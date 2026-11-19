/**
 * BoilIt Constants & Purdue University Dining Data
 * 
 * Form options and journey definitions for CS 19300.
 */

export const MEAL_STEPS = [
  {
    id: 'breakfast',
    mealType: 'Breakfast',
    stepNumber: '01',
    label: 'Breakfast',
    subtitle: 'Log what you ate or skip ahead to lunch.',
  },
  {
    id: 'lunch',
    mealType: 'Lunch',
    stepNumber: '02',
    label: 'Lunch',
    subtitle: 'Midday dining court meal.',
  },
  {
    id: 'dinner',
    mealType: 'Dinner',
    stepNumber: '03',
    label: 'Dinner',
    subtitle: 'Evening dining court meal.',
  },
  {
    id: 'summary',
    mealType: 'Daily Summary',
    stepNumber: '04',
    label: 'Daily Summary',
    subtitle: 'Today’s nutrition against your target.',
  },
];

export const DIETARY_PREFERENCES = [
  { id: 'No preference', label: 'No preference', description: 'All dining court items' },
  { id: 'Vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { id: 'Vegan', label: 'Vegan', description: 'Plant-based ingredients only' },
];

/**
 * The "Big 9" major food allergens tracked by FDA and Purdue Dining & Catering
 */
export const FOOD_ALLERGIES = [
  { id: 'milk', label: 'Milk' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree nuts', label: 'Tree nuts' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'soy', label: 'Soy' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'sesame', label: 'Sesame' },
];

/**
 * Purdue University Residential Dining Courts
 */
export const DINING_HALLS = [
  { id: 'Earhart', name: 'Earhart', location: 'South Campus' },
  { id: 'Ford', name: 'Ford', location: 'North Campus' },
  { id: 'Hillenbrand', name: 'Hillenbrand', location: 'Southwest Campus' },
  { id: 'Wiley', name: 'Wiley', location: 'Central Academic' },
  { id: 'Windsor', name: 'Windsor', location: 'Central Campus' },
];

export const CALORIE_PRESETS = [1600, 2000, 2400, 2800];

export const INITIAL_PREFERENCES_STATE = {
  calorieTarget: '2000',
  dietaryPreference: 'No preference',
  allergies: [],
  preferredDiningHalls: [],
};
