export default function DailySummarySection({
  isUnlocked,
  journey,
  preferences,
  totalCalories,
  onRestartJourney,
  onNavigateToMeal,
}) {
  const calorieGoal = Number(preferences?.calorieTarget) || 2000;
  const difference = totalCalories - calorieGoal;
  const percentOfGoal = Math.round((totalCalories / calorieGoal) * 100);

  const meals = [
    { key: 'breakfast', label: 'Breakfast', data: journey.meals.breakfast },
    { key: 'lunch', label: 'Lunch', data: journey.meals.lunch },
    { key: 'dinner', label: 'Dinner', data: journey.meals.dinner },
  ];

  return (
    <div id="section-summary" className="relative pl-7 sm:pl-10 pb-8">
      {/* Step Indicator Node on Timeline */}
      <div
        className={`absolute left-0 top-0.5 w-[23px] h-[23px] sm:w-[27px] sm:h-[27px] rounded-full flex items-center justify-center font-mono text-[11px] sm:text-xs transition-colors ${
          isUnlocked
            ? 'bg-sage text-stone-900 border border-sage-border font-bold'
            : 'border border-stone-300 bg-stone-100 text-stone-400'
        }`}
      >
        {isUnlocked ? '✓' : '·'}
      </div>

      <section>
        {/* Section Heading */}
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div className="flex items-baseline gap-2.5">
            <h3 className="font-serif text-2xl font-normal text-stone-900 tracking-tight">
              Daily Summary
            </h3>
            {isUnlocked ? (
              <span className="text-[11px] font-mono text-sage-dark bg-sage-tint border border-sage-border/60 px-2 py-0.5 rounded font-medium">
                Complete
              </span>
            ) : (
              <span className="text-[11px] font-mono text-stone-400">
                Locked
              </span>
            )}
          </div>

          <p className="text-xs text-stone-500 hidden sm:block">
            Today’s total intake against your target.
          </p>
        </div>

        {/* LOCKED STATE */}
        {!isUnlocked && (
          <div className="p-6 rounded-xl border border-dashed border-stone-200 bg-stone-50/50 text-stone-500 text-xs">
            <p className="font-medium text-stone-700">Daily summary is locked</p>
            <p className="text-stone-500 mt-0.5">
              Complete or skip dinner to view today’s full daily summary.
            </p>
          </div>
        )}

        {/* UNLOCKED SUMMARY DASHBOARD */}
        {isUnlocked && (
          <div className="p-5 sm:p-6 rounded-xl border border-stone-200 bg-white shadow-xs space-y-6">
            {/* Calorie Intake vs Goal */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-medium text-stone-900 font-mono tabular-nums">
                    {totalCalories.toLocaleString()}
                  </span>
                  <span className="text-sm font-mono text-stone-500">
                    / {calorieGoal.toLocaleString()} kcal target
                  </span>
                </div>

                <div className="text-xs font-mono text-stone-600">
                  {Math.abs(difference) <= 50 ? (
                    <span className="text-sage-dark font-medium">On target</span>
                  ) : difference > 0 ? (
                    <span className="text-stone-700">+{difference.toLocaleString()} kcal over target</span>
                  ) : (
                    <span className="text-stone-700">{Math.abs(difference).toLocaleString()} kcal remaining</span>
                  )}
                  <span className="text-stone-400 mx-1.5">·</span>
                  <span>{percentOfGoal}%</span>
                </div>
              </div>

              {/* Progress Bar in Mint */}
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-mint rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, percentOfGoal)}%` }}
                />
              </div>
            </div>

            {/* Meals Recap List */}
            <div className="pt-4 border-t border-stone-150">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2.5">
                Meals logged today
              </span>

              <div className="divide-y divide-stone-100 text-xs">
                {meals.map((m) => {
                  const isConsumed = m.data?.status === 'consumed';
                  const isSkipped = m.data?.status === 'skipped';

                  return (
                    <div
                      key={m.key}
                      className="py-2.5 flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-medium text-stone-900 mr-2">{m.label}</span>
                        <span className="text-stone-500">
                          {isConsumed
                            ? `${m.data.title}`
                            : isSkipped
                            ? 'Skipped'
                            : 'Pending'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-stone-800 tabular-nums">
                          {isConsumed ? `${m.data.calories} kcal` : '0 kcal'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onNavigateToMeal(m.key)}
                          className="text-plum hover:text-plum-hover underline underline-offset-2 cursor-pointer"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions: Restart Journey */}
            <div className="pt-4 border-t border-stone-150 flex items-center justify-between text-xs text-stone-500">
              <span>Saved locally to this device.</span>

              <button
                type="button"
                onClick={onRestartJourney}
                className="text-stone-600 hover:text-plum underline underline-offset-2 cursor-pointer"
              >
                Reset today’s journey
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
