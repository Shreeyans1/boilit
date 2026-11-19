import { getTodayDateString, formatFriendlyDate } from '../utils/storage';

export default function Header() {
  const todayFriendly = formatFriendlyDate(getTodayDateString());

  return (
    <header className="pt-2 pb-6 border-b border-stone-200 mb-6 sm:mb-8">
      <div className="flex items-center justify-between text-xs font-mono text-stone-500 uppercase tracking-wider mb-2">
        <span>Purdue University</span>
        <span className="bg-cream/40 text-stone-700 border border-cream-border/60 px-2 py-0.5 rounded text-[11px] font-mono">
          {todayFriendly}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4">
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal tracking-tight">
          Boil<span className="text-plum italic">It</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 font-normal">
          Plan daily campus meals to hit your calorie target.
        </p>
      </div>
    </header>
  );
}
