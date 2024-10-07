import { Component } from '@angular/core';
import { GroqService } from '../groq.service'; // Adjust the path if your GroqService is in a different directory

@Component({
  selector: 'app-meal-plan',
  templateUrl: './meal-plan.component.html',
  styleUrls: ['./meal-plan.component.css']
})
export class MealPlanComponent {
  mealPlan: string | null = null; // Store the meal plan response
  completion: string | null = null;

  constructor(private groqService: GroqService) {}

  // generateMealPlan() {
  //   const groceries = [
  //     { nameOfItem: 'Milk', expiryDate: '2024-10-05' },
  //     { nameOfItem: 'Eggs', expiryDate: '2024-10-07' },
  //     { nameOfItem: 'Spinach', expiryDate: '2024-10-03' },
  //   ];
  
  //   this.groqService.generateMealPlan(groceries).subscribe(
  //     (response) => {
  //       console.log(response);
  //       if (response && response.mealPlan) {
  //         this.completion = response.mealPlan;
  //       }
  //     },
  //     (error) => {
  //       console.error('Error generating meal plan:', error);
  //     }
  //   );
  // }
  
}
