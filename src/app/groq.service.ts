import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Groq } from 'groq-sdk';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroqService {
  private firebaseFunctionUrl = 'https://us-central1-ai-meal-planner-b9b51.cloudfunctions.net/generateMealPlan'; // Replace with your actual URL

  constructor(private http: HttpClient) {}

  // generateMealPlan(groceries: {
  //   nameOfItem: string;
  //   expiryDate: string;
  //   calories: number;
  //   protein: number;
  //   fat: number;
  //   servingSize: number;
  //   servingUnit: string;
  // }[]): Observable<any> {
  //   // Create the prompt based on groceries and expiry dates
  //   const groceryList = groceries
  //     .map((item) => 
  //       `${item.nameOfItem}, expires on ${item.expiryDate}, calories: ${item.calories}, protein: ${item.protein}g, fat: ${item.fat}g, serving size: ${item.servingSize} ${item.servingUnit}`
  //     )
  //     .join('\n');

  //   const prompt = `Given the following groceries and their expiry dates, create a weekly meal plan that ensures all the items are used before they expire:\n\n${groceryList}\n\nProvide balanced meal ideas for breakfast, lunch, and dinner.`;

  //   console.log('Calling API with prompt:', prompt);

  //   return this.http.post(this.firebaseFunctionUrl, { messages: [{ role: 'user', content: prompt }] }).pipe(
  //     tap((response) => {
  //       console.log('API response received:', response);
  //     }),
  //     catchError((error) => {
  //       console.error('Error occurred while calling API:', error);
  //       return throwError(error);
  //     })
  //   );
  // }

  generateMealPlan(groceries: {
    nameOfItem: string;
    expiryDate: string;
    calories: number;
    protein: number;
    fat: number;
    servingSize: number;
    servingUnit: string;
  }[]): Observable<any> {
    // Create the prompt based on groceries and expiry dates
    const groceryList = groceries
      .map((item) => 
        `${item.nameOfItem}, expires on ${item.expiryDate}, calories: ${item.calories}, protein: ${item.protein}g, fat: ${item.fat}g, serving size: ${item.servingSize} ${item.servingUnit}`
      )
      .join('\n');
  
      const prompt = `
      Given the following groceries and their expiry dates, create a weekly meal plan that ensures all the items are used before they expire. 
      Format the response as a JavaScript object in JSON format where each day of the week is a key, and the value is an array containing details for breakfast, lunch, and dinner.
      Each meal should contain the following information:
      - Meal Name
      - Ingredients Needed
      - Steps to Prepare
      
      Example format:
      {
        "Monday": [
          {
            "mealType": "Breakfast",
            "mealName": "Oatmeal with Fresh Fruit",
            "ingredients": ["Oats", "Fresh Fruits", "Milk"],
            "steps": ["Cook oats in milk.", "Top with fresh fruit."]
          },
          {
            "mealType": "Lunch",
            "mealName": "Grilled Chicken Salad",
            "ingredients": ["Chicken Breast", "Lettuce", "Tomatoes", "Olive Oil"],
            "steps": ["Grill the chicken.", "Chop vegetables.", "Mix chicken and veggies with olive oil."]
          },
          {
            "mealType": "Dinner",
            "mealName": "Baked Chicken with Broccoli",
            "ingredients": ["Chicken Breast", "Broccoli", "Olive Oil"],
            "steps": ["Preheat oven to 180°C.", "Place chicken and broccoli on a baking sheet.", "Drizzle with olive oil and bake for 20 minutes."]
          }
        ],
        "Tuesday": [
          {
            "mealType": "Breakfast",
            "mealName": "Peanut Butter Oatmeal",
            "ingredients": ["Oats", "Peanut Butter & Cocoa Balls", "Milk"],
            "steps": ["Cook oats in milk.", "Add peanut butter and mix well."]
          },
          ...
        ],
        ...
      }
    
      Groceries:
      ${groceryList}
    
      Provide the weekly meal plan in the specified JSON format. No extra text is needed, only the JSON object should be returned.
    `;
    
    
    
  
    console.log('Calling API with prompt:', prompt);
  
    // Make HTTP request to Firebase function
    return this.http.post(this.firebaseFunctionUrl, { messages: [{ role: 'user', content: prompt }] }).pipe(
      tap((response) => {
        console.log('API response received:', response);
      }),
      catchError((error) => {
        console.error('Error occurred while calling API:', error);
        return throwError(error);
      })
    );
  }
  
  
  
}
