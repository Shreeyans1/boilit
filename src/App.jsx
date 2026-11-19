import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import TimelineStepper from './components/TimelineStepper';
import MealSection from './components/MealSection';
import DailySummarySection from './components/DailySummarySection';
import { MEAL_STEPS, INITIAL_PREFERENCES_STATE } from './constants/boilitData';
import {
  getTodayDateString,
  loadUserPreferences,
  saveUserPreferences,
  loadDailyJourney,
  saveDailyJourney,
  clearDailyJourney,
} from './utils/storage';

function App() {
  const todayStr = useMemo(() => getTodayDateString(), []);

  // 1. User Preferences State (persisted across days)
  const [preferences, setPreferences] = useState(() => {
    return loadUserPreferences() || INITIAL_PREFERENCES_STATE;
  });

  // 2. Daily Journey State (date-keyed in localStorage)
  const [journey, setJourney] = useState(() => {
    return loadDailyJourney(todayStr);
  });

  // Save journey whenever it changes
  useEffect(() => {
    saveDailyJourney(todayStr, journey);
  }, [journey, todayStr]);

  // Subtle smooth scroll helper
  const scrollToSection = useCallback((sectionKey) => {
    setTimeout(() => {
      const el = document.getElementById(`section-${sectionKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  }, []);

  // Handler: Update and persist user preferences
  const handleSavePreferences = (newPrefs) => {
    setPreferences(newPrefs);
    saveUserPreferences(newPrefs);
  };

  // Determine the status of each meal in the journey
  // 'completed' | 'skipped' | 'current' | 'locked'
  const getMealStatus = (stepKey) => {
    const meal = journey.meals[stepKey];
    if (meal) {
      return meal.status === 'consumed' ? 'completed' : 'skipped';
    }

    if (stepKey === 'breakfast') {
      return 'current';
    }

    if (stepKey === 'lunch') {
      return journey.meals.breakfast ? 'current' : 'locked';
    }

    if (stepKey === 'dinner') {
      return journey.meals.lunch ? 'current' : 'locked';
    }

    return 'locked';
  };

  const isSummaryUnlocked = Boolean(journey.meals.dinner);

  // Handler: Confirm a meal
  const handleConfirmMeal = (mealPayload) => {
    const { mealKey } = mealPayload;

    setJourney((prev) => {
      const updatedMeals = {
        ...prev.meals,
        [mealKey]: mealPayload,
      };

      return {
        ...prev,
        meals: updatedMeals,
      };
    });

    if (mealKey === 'breakfast') {
      scrollToSection('lunch');
    } else if (mealKey === 'lunch') {
      scrollToSection('dinner');
    } else if (mealKey === 'dinner') {
      scrollToSection('summary');
    }
  };

  // Handler: Skip a meal
  const handleSkipMeal = (skipPayload) => {
    const { mealKey } = skipPayload;

    setJourney((prev) => {
      const updatedMeals = {
        ...prev.meals,
        [mealKey]: skipPayload,
      };

      return {
        ...prev,
        meals: updatedMeals,
      };
    });

    if (mealKey === 'breakfast') {
      scrollToSection('lunch');
    } else if (mealKey === 'lunch') {
      scrollToSection('dinner');
    } else if (mealKey === 'dinner') {
      scrollToSection('summary');
    }
  };

  // Handler: Undo / Edit a logged meal
  const handleUndoMeal = (mealKey) => {
    setJourney((prev) => {
      const updatedMeals = { ...prev.meals };
      updatedMeals[mealKey] = null;

      if (mealKey === 'breakfast') {
        updatedMeals.lunch = null;
        updatedMeals.dinner = null;
      } else if (mealKey === 'lunch') {
        updatedMeals.dinner = null;
      }

      return {
        ...prev,
        meals: updatedMeals,
      };
    });

    scrollToSection(mealKey);
  };

  // Handler: Reset today's journey
  const handleRestartJourney = () => {
    clearDailyJourney(todayStr);
    setJourney(loadDailyJourney(todayStr));
    scrollToSection('breakfast');
  };

  // Calculate live nutrition totals across all consumed meals
  const totals = useMemo(() => {
    const consumedMeals = Object.values(journey.meals).filter(
      (m) => m && m.status === 'consumed'
    );

    return consumedMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
      }),
      { calories: 0 }
    );
  }, [journey.meals]);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-stone-900 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Header />

        {/* Stepper & Calorie Status */}
        <TimelineStepper
          steps={MEAL_STEPS}
          journey={journey}
          preferences={preferences}
          totalCalories={totals.calories}
          onNavigateToSection={scrollToSection}
        />

        {/* Vertical Timeline Journey */}
        <main className="relative">
          {/* Step 1: Breakfast */}
          <MealSection
            mealKey="breakfast"
            mealType="Breakfast"
            title="Breakfast"
            subtitle="Choose what you ate or skip ahead to lunch."
            status={getMealStatus('breakfast')}
            unlockRequirement="Available from the start of your day."
            loggedMeal={journey.meals.breakfast}
            preferences={preferences}
            onSavePreferences={handleSavePreferences}
            onConfirmMeal={handleConfirmMeal}
            onSkipMeal={handleSkipMeal}
            onUndoMeal={() => handleUndoMeal('breakfast')}
            isLast={false}
          />

          {/* Step 2: Lunch */}
          <MealSection
            mealKey="lunch"
            mealType="Lunch"
            title="Lunch"
            subtitle="Midday dining court meal."
            status={getMealStatus('lunch')}
            unlockRequirement="Complete or skip breakfast to unlock lunch."
            loggedMeal={journey.meals.lunch}
            preferences={preferences}
            onSavePreferences={handleSavePreferences}
            onConfirmMeal={handleConfirmMeal}
            onSkipMeal={handleSkipMeal}
            onUndoMeal={() => handleUndoMeal('lunch')}
            isLast={false}
          />

          {/* Step 3: Dinner */}
          <MealSection
            mealKey="dinner"
            mealType="Dinner"
            title="Dinner"
            subtitle="Evening dining court meal."
            status={getMealStatus('dinner')}
            unlockRequirement="Complete or skip lunch to unlock dinner."
            loggedMeal={journey.meals.dinner}
            preferences={preferences}
            onSavePreferences={handleSavePreferences}
            onConfirmMeal={handleConfirmMeal}
            onSkipMeal={handleSkipMeal}
            onUndoMeal={() => handleUndoMeal('dinner')}
            isLast={false}
          />

          {/* Step 4: Daily Summary */}
          <DailySummarySection
            isUnlocked={isSummaryUnlocked}
            journey={journey}
            preferences={preferences}
            totalCalories={totals.calories}
            onRestartJourney={handleRestartJourney}
            onNavigateToMeal={scrollToSection}
          />
        </main>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-stone-200 text-xs text-stone-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span>BoilIt · Purdue University CS 19300</span>
          <span className="text-stone-400 font-mono">Purdue residential dining</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
