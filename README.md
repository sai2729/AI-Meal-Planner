# AI Meal Planner

**AI Meal Planner** is a web application that helps users efficiently create weekly meal plans using scanned grocery items and their expiry dates. It ensures that groceries are used before they expire, thereby reducing food waste.

## Features
- **Barcode Scanning**: Scan product barcodes to quickly add groceries.
- **Product Details**: Retrieve product information like calories, protein, fat, and expiry date.
- **Meal Plan Generation**: Automatically generate a weekly meal plan based on the items added, ensuring efficient usage.
- **Dynamic Meal Scheduling**: View and manage weekly meal plans using a user-friendly table layout.

## Tech Stack
- **Frontend**: Angular, Bootstrap, HTML, CSS
- **Backend**: Firebase Functions, Node.js
- **APIs**: Groq API, Nutritionix API for product details
- **Barcode Scanning**: ZXing library

## Table of Contents
1. [Getting Started](#getting-started)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Deployment](#deployment)
5. [API Integration](#api-integration)
6. [Project Structure](#project-structure)
7. [Contributing](#contributing)
8. [License](#license)
9. [Acknowledgments](#acknowledgments)
10. [Contact](#contact)

## Getting Started

### Prerequisites
- **Node.js** and **npm** installed.
- **Firebase CLI** installed.
- **Git** for version control.
- Firebase project setup with necessary credentials.

### Installation
1. **Clone the Repository**
   ```sh
   git clone https://github.com/sai2729/AI-Meal-Planner.git
   cd AI-Meal-Planner
   ```
2. **Install Dependencies**
  - Frontend Dependencies
  ```sh
  npm install
  ```
  - Firebase Functions Dependencies
  ```sh
  cd functions
  npm install
  ```
3. **Set up Firebase Environment Config**
  ```sh
  firebase login
  firebase functions:config:set groq.api_key="YOUR_GROQ_API_KEY" api.nutritionix_app_id="YOUR_APP_ID" api.nutritionix_api_key="YOUR_API_KEY"
  ```
4. **Start the Application**
   ```sh
   ng serve
   ```
  Access it at http://localhost:4200.

## Usage
1. Scan Groceries: Click the "Open Scanner" button to scan or enter the product barcode manually.
2. Enter Expiry Date: After scanning, enter the expiry date for each product.
3. Generate Meal Plan: Click the "Generate Meal Plan" button after adding at least 5 items.
4. View Meal Plan: The meal plan is displayed in a table, organized by day and meal type.

## Deployment
### Firebase Deployment
1. Deploy Firebase Functions
  ```sh
  firebase deploy --only functions
  ```
2. Deploy the Angular App
   ```sh
   ng build --prod
   firebase deploy
   ```
## API Integration
- Groq API: Generates meal plans based on provided groceries.
- Nutritionix API: Fetches nutritional details of groceries by barcode.

## Project Structure
```sh
AI-Meal-Planner/
├── functions/              # Firebase backend functions
│   ├── index.js            # Main backend code
│   └── package.json
├── src/                    # Frontend source files
│   ├── app/                # Angular components
│   ├── assets/             # Static assets
│   ├── index.html          # Main HTML file
│   └── main.ts             # Angular main entry point
├── .firebaserc             # Firebase configuration
├── angular.json            # Angular project settings
├── package.json            # Dependencies for the frontend
└── README.md               # Project documentation
```

## Contributing
1. Fork the repository.
2. Create your feature branch (git checkout -b feature/AmazingFeature).
3. Commit your changes (git commit -m 'Add some AmazingFeature').
4. Push to the branch (git push origin feature/AmazingFeature).
5. Open a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- OpenAI & Groq for providing the language model and APIs.
- Nutritionix for nutritional data APIs.
- Firebase for backend services and hosting.

## Contact
- Author: Sai Kumar Bella
- LinkedIn: https://www.linkedin.com/in/sai2729
- GitHub: https://github.com/sai2729
