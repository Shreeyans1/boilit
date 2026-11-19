export default function TimelineStepper({
  steps,
  journey,
  preferences,
  totalCalories,
  onNavigateToSection,
}) {
  const calorieGoal = Number(preferences?.calorieTarget) || 2000;
  const progressPercent = Math.min(100, Math.round((totalCalories / calorieGoal) * 100));

  const getStepStatus = (stepId) => {
    if (stepId === 'summary') {
      const dinnerMeal = journey.meals.dinner;
      if (dinnerMeal) return 'unlocked';
      return 'locked';
    }

    const meal = journey.meals[stepId];
    if (meal) {
      return meal.status === 'consumed' ? 'completed' : 'skipped';
    }

    if (stepId === 'breakfast') return 'current';
    if (stepId === 'lunch') {
      return journey.meals.breakfast ? 'current' : 'locked';
    }
    if (stepId === 'dinner') {
      return journey.meals.lunch ? 'current' : 'locked';
    }
    return 'locked';
  };

  return (
    <nav
      aria-label="Daily progress"
      className="sticky top-0 z-20 -mx-4 sm:mx-0 px-4 sm:px-4 py-2.5 mb-8 bg-[#FBFBFA]/95 backdrop-blur-xs border-b border-stone-200 sm:rounded-lg sm:border text-stone-800 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Minimal step list */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs py-0.5">
          {steps.map((step, idx) => {
            const status = getStepStatus(step.id);
            const isClickable = status !== 'locked';

            return (
              <div key={step.id} className="flex items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onNavigateToSection(step.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                    status === 'current'
                      ? 'text-plum font-semibold bg-plum-tint border border-plum-border'
                      : status === 'completed'
                      ? 'text-stone-800 hover:text-stone-900 hover:bg-stone-100'
                      : status === 'skipped'
                      ? 'text-stone-400 hover:text-stone-600'
                      : status === 'unlocked'
                      ? 'text-stone-700 hover:text-stone-900'
                      : 'text-stone-300 cursor-not-allowed'
                  }`}
                >
                  <span className="font-mono text-[10px] text-stone-400">
                    {step.stepNumber}
                  </span>
                  <span>{step.label}</span>
                  {status === 'completed' && (
                    <span className="text-[11px] text-sage-dark font-bold">✓</span>
                  )}
                  {status === 'skipped' && (
                    <span className="text-[10px] text-stone-400 italic">skip</span>
                  )}
                </button>

                {idx < steps.length - 1 && (
                  <span className="text-stone-300 px-1 select-none text-[10px]">/</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Quiet Calorie Tracker */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <div className="text-right flex items-center gap-2">
            <span className="text-xs font-mono tabular-nums text-stone-900">
              <span className="font-semibold text-plum">{totalCalories.toLocaleString()}</span>
              <span className="text-stone-400"> / </span>
              <span className="text-stone-600">{calorieGoal.toLocaleString()} kcal</span>
            </span>

            {/* Subtle progress bar in Mint */}
            <div className="w-20 sm:w-28 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-mint rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <span className="text-[11px] font-mono text-stone-500 tabular-nums">
            {progressPercent}%
          </span>
        </div>
      </div>
    </nav>
  );
}

