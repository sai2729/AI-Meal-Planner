import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Result, NotFoundException } from '@zxing/library';
import { GroqService } from './groq.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  barcodeReader = new BrowserMultiFormatReader();
  selectedDeviceId: string | null = null;
  currentStream: MediaStream | null = null;
  mealPlan: string | null = null; // Store the meal plan response
  completion: string | null = null;

  // Scanned products list, initially empty

  scannedProducts: {
    nameOfItem: string;
    expiryDate: string;
    calories: number;
    protein: number;
    fat: number;
    servingSize: number;
    servingUnit: string;
  }[] = [];
  schedule: any;

  constructor(private http: HttpClient, private groqService: GroqService) {}

  openSweetAlert() {
    Swal.fire({
      title: 'Scan or Enter Barcode',
      html: `
        <div>
          <video id="videoElement" width="100%" height="200" style="border: 1px solid #ccc;" autoplay></video>
        </div>
        <div style="margin-top: 15px;">
          <input id="manualBarcode" type="text" placeholder="Enter barcode manually" class="form-control">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit',
      didOpen: () => {
        // Start the camera and initialize barcode scanning after the SweetAlert modal is fully opened
        this.startBarcodeScanner();
      },
      willClose: () => {
        // Stop the camera when the modal is closed
        this.stopBarcodeScanner();
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const manualBarcode = (<HTMLInputElement>document.getElementById('manualBarcode')).value;
        if (manualBarcode) {
          this.fetchProductFromFunction(manualBarcode);
        } else {
          console.log('No barcode entered.');
        }
      }
    });
  }

  startBarcodeScanner() {
    const videoElement = document.getElementById('videoElement') as HTMLVideoElement;

    if (!videoElement) {
      console.error('Video element not found');
      return;
    }

    // List available video input devices and start streaming
    BrowserMultiFormatReader.listVideoInputDevices()
      .then((videoInputDevices: MediaDeviceInfo[]) => {
        if (videoInputDevices.length > 0) {
          this.selectedDeviceId = videoInputDevices[0].deviceId;

          navigator.mediaDevices.getUserMedia({ video: { deviceId: this.selectedDeviceId } })
            .then((stream) => {
              this.currentStream = stream;
              videoElement.srcObject = stream;

              // Start barcode decoding
              this.barcodeReader.decodeFromVideoElement(videoElement, (result?: Result, error?: any) => {
                if (result) {
                  const barcode = result.getText();
                  console.log('Scanned barcode:', barcode);
                  Swal.close(); // Close the SweetAlert when the barcode is successfully scanned
                  if (this.isNumeric(barcode)) {
                    this.fetchProductFromFunction(barcode); // Call Firebase Function API with the scanned barcode
                  } else {
                    console.warn('The scanned barcode is not numeric:', barcode);
                  }
                } else if (error && !(error instanceof NotFoundException)) {
                  // Log other errors, but suppress NotFoundException to avoid spamming the console
                  console.error(error);
                }
              });
            })
            .catch((err) => {
              console.error('Error accessing the camera: ', err);
            });
        } else {
          console.error('No video devices found.');
        }
      })
      .catch((err) => console.error('Error listing video input devices:', err));
  }

  stopBarcodeScanner() {
    if (this.currentStream) {
      const tracks = this.currentStream.getTracks();
      tracks.forEach(track => track.stop());
      this.currentStream = null;
    }
  }

  fetchProductFromFunction(barcode: string) {
    const functionUrl = 'https://us-central1-ai-meal-planner-b9b51.cloudfunctions.net/getProductDetails';

    this.http.post(functionUrl, { barcode: barcode }, { headers: { 'Content-Type': 'application/json' } })
      .subscribe(
        (data: any) => {
          const product = data.foods && data.foods[0];
          if (product) {
            console.log("Product Details:", product);
            // Here you can add saveProductToFirebase or displayProductDetails as needed in the future.
            this.askForExpiryDate(product);
          } else {
            console.log("Product not found or error in response from Firebase Function");
          }
        },
        (error) => {
          console.error("Error fetching product details from Firebase Function:", error);
        }
      );
  }

  askForExpiryDate(product: any) {
    Swal.fire({
      title: `Enter expiry date for ${product.food_name}`,
      input: 'date',
      inputLabel: 'Expiry Date',
      inputPlaceholder: 'Enter the expiry date',
      showCancelButton: true,
    }).then((expiryResult) => {
      if (expiryResult.isConfirmed && expiryResult.value) {
        const newProduct = {
          nameOfItem: product.food_name,
          calories: product.nf_calories,
          protein: product.nf_protein,
          fat: product.nf_total_fat,
          servingSize: product.serving_qty,
          servingUnit: product.serving_unit,
          expiryDate: expiryResult.value,
        };
        this.scannedProducts.push(newProduct);
      }
    });

  }

  generateMealPlan() {
    this.groqService.generateMealPlan(this.scannedProducts).subscribe(
      (response) => {
        console.log('Raw response:', response);
  
        if (response && response.mealPlan) {
          try {
            // Parse the response as a JSON object
            this.schedule = JSON.parse(response.mealPlan);
            console.log('Parsed schedule:', this.schedule);
          } catch (error) {
            console.error('Error parsing meal plan response:', error);
          }
        } else {
          console.error('No valid meal plan response received.');
        }
      },
      (error) => {
        console.error('Error generating meal plan:', error);
      }
    );
  }  
  
  getDays(schedule: any): string[] {
    return schedule ? Object.keys(schedule) : [];
  }
  
  
  

  isNumeric(value: string): boolean {
    return !isNaN(Number(value));
  }

  ngOnDestroy() {
    // Stop the barcode scanner if the component is destroyed
    this.stopBarcodeScanner();
  }
}
