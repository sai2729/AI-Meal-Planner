import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MealPlanComponent } from './meal-plan/meal-plan.component';
import { GroqService } from './groq.service';

@NgModule({
  declarations: [
    AppComponent,
    MealPlanComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [GroqService],
  bootstrap: [AppComponent]
})
export class AppModule { }
