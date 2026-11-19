import { useState } from 'react';
import DailyPreferencesForm from './DailyPreferencesForm';

export default function MealSection({
  mealKey,
  mealType,
  title,
  subtitle,
  status,
  unlockRequirement,
  loggedMeal,
  preferences,
  onSavePreferences,
  onConfirmMeal,
  onSkipMeal,
  onUndoMeal,
  isLast = false,
}) {
  const [customCalories, setCustomCalories] = useState('500');
  const [customDish, setCustomDish] = useState('');

  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';
  const isSkipped = status === 'skipped';

  const handleConfirm = (e) => {
    e?.preventDefault();
    const cals = Number(customCalories) || 0;

    onConfirmMeal({
      status: 'consumed',
      mealType,
      mealKey,
      title: customDish.trim() || `${mealType} Meal`,
      calories: cals,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSkip = () => {
    onSkipMeal({
      status: 'skipped',
      mealType,
      mealKey,
      calories: 0,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div id={`section-${mealKey}`} className="relative pl-7 sm:pl-10 pb-10 sm:pb-14">
      {/* Vertical Timeline Spine Line */}
      {!isLast && (
        <div
          aria-hidden="true"
          className={`absolute left-[11px] sm:left-[13px] top-6 bottom-0 w-[1.5px] transition-colors duration-300 ${
            isCompleted || isSkipped ? 'bg-sage' : 'bg-stone-200'
          }`}
        />
      )}

      {/* Step Indicator Node on Timeline */}
      <div
        className={`absolute left-0 top-0.5 w-[23px] h-[23px] sm:w-[27px] sm:h-[27px] rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs transition-colors ${
          isCompleted
            ? 'bg-sage text-stone-900 border border-sage-border font-bold'
            : isSkipped
            ? 'border border-stone-300 bg-stone-100 text-stone-500'
            : isCurrent
            ? 'border-2 border-plum bg-white text-plum font-bold'
            : 'border border-stone-300 bg-stone-100 text-stone-400'
        }`}
      >
        {isCompleted ? '✓' : isSkipped ? '—' : isLocked ? '·' : ''}
      </div>

      {/* Section Content */}
      <section className="transition-all duration-200">
        {/* Section Heading Row */}
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
          <div className="flex items-baseline gap-2.5">
            <h3 className="font-serif text-2xl font-normal text-stone-900 tracking-tight">
              {title}
            </h3>

            {isCompleted && (
              <span className="text-[11px] font-mono text-sage-dark bg-sage-tint border border-sage-border/60 px-2 py-0.5 rounded font-medium">
                Logged
              </span>
            )}
            {isSkipped && (
              <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                Skipped
              </span>
            )}
            {isCurrent && (
              <span className="text-[11px] font-mono text-plum bg-plum-tint border border-plum-border px-2 py-0.5 rounded font-medium">
                Current
              </span>
            )}
            {isLocked && (
              <span className="text-[11px] font-mono text-stone-400">
                Locked
              </span>
            )}
          </div>

          <p className="text-xs text-stone-500 hidden sm:block">
            {subtitle}
          </p>
        </div>

        {/* LOCKED STATE */}
        {isLocked && (
          <div className="p-6 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 text-stone-500 text-xs">
            <p className="font-medium text-stone-700">{mealType} is locked</p>
            <p className="text-stone-500 mt-0.5">{unlockRequirement}</p>
          </div>
        )}

        {/* COMPLETED STATE */}
        {isCompleted && loggedMeal && (
          <div className="p-4 sm:p-5 rounded-xl border border-sage-border/60 bg-white shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <span className="text-xs font-mono text-plum uppercase tracking-wider mb-0.5 block font-medium">
                  {mealType} Logged
                </span>
                <h4 className="font-serif text-lg font-medium text-stone-900">
                  {loggedMeal.title}
                </h4>

                <div className="mt-1 text-xs font-mono text-stone-600">
                  <span className="font-semibold text-stone-900">{loggedMeal.calories} kcal</span>
                  <span className="text-stone-400 ml-2">
                    at {new Date(loggedMeal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onUndoMeal}
                className="self-start sm:self-center text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2 cursor-pointer"
              >
                Edit meal
              </button>
            </div>
          </div>
        )}

        {/* SKIPPED STATE */}
        {isSkipped && (
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 flex items-center justify-between text-xs">
            <span className="text-stone-600">
              Skipped {mealType.toLowerCase()} today <span className="font-mono text-stone-400">(0 kcal recorded)</span>
            </span>
            <button
              type="button"
              onClick={onUndoMeal}
              className="text-stone-700 hover:text-stone-900 underline underline-offset-2 cursor-pointer"
            >
              Undo
            </button>
          </div>
        )}

        {/* CURRENT / ACTIVE STATE */}
        {isCurrent && (
          <div className="space-y-4">
            {/* Breakfast: Embed preferences */}
            {mealKey === 'breakfast' && (
              <DailyPreferencesForm
                preferences={preferences}
                onSavePreferences={onSavePreferences}
                initialCollapsed={Boolean(preferences?.calorieTarget)}
              />
            )}

            {/* Empty State: Ready for live Purdue HFS data */}
            <div className="p-5 sm:p-6 rounded-xl border border-stone-200 bg-white shadow-xs space-y-4">
              <div className="border-b border-stone-150 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                    Purdue Dining Court Menu
                  </span>
                  <span className="text-[11px] font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
                    Awaiting HFS Link
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Live menu items from Purdue dining courts will be fetched and displayed here in the next milestone.
                </p>
              </div>

              {/* Quick Log for testing before HFS is connected */}
              <div className="pt-1">
                <span className="text-xs font-medium text-stone-800 block mb-2">
                  Log {mealType.toLowerCase()} or advance to next step:
                </span>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    placeholder="Meal description (optional)"
                    value={customDish}
                    onChange={(e) => setCustomDish(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-plum"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      step="50"
                      placeholder="Calories"
                      value={customCalories}
                      onChange={(e) => setCustomCalories(e.target.value)}
                      className="w-24 px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-mono text-stone-900 focus:outline-none focus:border-plum"
                    />
                    <span className="text-xs font-mono text-stone-400">kcal</span>

                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="px-4 py-1.5 text-xs font-medium text-white bg-plum hover:bg-plum-hover rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    >
                      I ate this meal
                    </button>
                  </div>
                </div>
              </div>

              {/* Skip option */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400">Not eating {mealType.toLowerCase()} today?</span>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="text-stone-600 hover:text-stone-900 underline underline-offset-2 cursor-pointer font-medium"
                >
                  Skip {mealType.toLowerCase()} today →
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
