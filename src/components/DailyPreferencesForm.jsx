import { useState } from 'react';
import {
  DIETARY_PREFERENCES,
  FOOD_ALLERGIES,
  DINING_HALLS,
  CALORIE_PRESETS,
} from '../constants/boilitData';

export default function DailyPreferencesForm({
  preferences,
  onSavePreferences,
  initialCollapsed = false,
}) {
  const [isEditing, setIsEditing] = useState(!initialCollapsed);
  const [formData, setFormData] = useState({
    calorieTarget: preferences?.calorieTarget ? String(preferences.calorieTarget) : '2000',
    dietaryPreference: preferences?.dietaryPreference || 'No preference',
    allergies: preferences?.allergies ? [...preferences.allergies] : [],
    preferredDiningHalls: preferences?.preferredDiningHalls ? [...preferences.preferredDiningHalls] : [],
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const raw = formData.calorieTarget;
    if (!raw || raw.trim() === '') {
      newErrors.calorieTarget = 'Daily calorie target is required.';
    } else {
      const parsed = Number(raw);
      if (Number.isNaN(parsed) || parsed <= 0) {
        newErrors.calorieTarget = 'Enter a positive number greater than 0.';
      } else if (!Number.isInteger(parsed)) {
        newErrors.calorieTarget = 'Enter a whole number.';
      } else if (parsed > 10000) {
        newErrors.calorieTarget = 'Enter a realistic target under 10,000 kcal.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalorieChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, calorieTarget: val }));
    if (errors.calorieTarget) setErrors((prev) => ({ ...prev, calorieTarget: undefined }));
  };

  const handlePresetClick = (preset) => {
    setFormData((prev) => ({ ...prev, calorieTarget: String(preset) }));
    if (errors.calorieTarget) setErrors((prev) => ({ ...prev, calorieTarget: undefined }));
  };

  const handleDietSelect = (id) => {
    setFormData((prev) => ({ ...prev, dietaryPreference: id }));
  };

  const handleAllergyToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.allergies.includes(id);
      return {
        ...prev,
        allergies: exists
          ? prev.allergies.filter((a) => a !== id)
          : [...prev.allergies, id],
      };
    });
  };

  const handleClearAllergies = () => {
    setFormData((prev) => ({ ...prev, allergies: [] }));
  };

  const handleDiningHallToggle = (id) => {
    setFormData((prev) => {
      const exists = prev.preferredDiningHalls.includes(id);
      return {
        ...prev,
        preferredDiningHalls: exists
          ? prev.preferredDiningHalls.filter((h) => h !== id)
          : [...prev.preferredDiningHalls, id],
      };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const sanitized = {
      calorieTarget: Number(formData.calorieTarget),
      dietaryPreference: formData.dietaryPreference,
      allergies: [...formData.allergies],
      preferredDiningHalls: [...formData.preferredDiningHalls],
    };

    console.log('BoilIt Daily Preferences Saved:', sanitized);
    onSavePreferences(sanitized);
    setIsEditing(false);
  };

  // Collapsed: Warm cream summary row
  if (!isEditing) {
    return (
      <div className="py-3 px-4 mb-5 rounded-lg bg-cream-tint border border-cream-border/70 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-stone-700">
            <span className="font-mono text-white bg-plum text-[10px] tracking-wider px-2 py-0.5 rounded">
              Profile
            </span>
            <span className="text-stone-300 hidden sm:inline">|</span>
            <span>
              <strong className="font-semibold text-plum font-mono">
                {formData.calorieTarget} kcal
              </strong>{' '}
              target
            </span>
            <span className="text-stone-300 hidden sm:inline">·</span>
            <span>{formData.dietaryPreference}</span>
            <span className="text-stone-300 hidden sm:inline">·</span>
            <span className="text-stone-600">
              {formData.allergies.length === 0
                ? 'No allergies'
                : `${formData.allergies.length} excluded`}
            </span>
            <span className="text-stone-300 hidden sm:inline">·</span>
            <span className="text-stone-600">
              {formData.preferredDiningHalls.length === 0
                ? 'All dining courts'
                : formData.preferredDiningHalls.join(', ')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="self-start sm:self-center font-medium text-plum hover:text-plum-hover underline underline-offset-2 cursor-pointer"
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  // Expanded Form
  return (
    <div className="mb-5 p-5 rounded-xl border border-stone-200 bg-white shadow-xs">
      <div className="flex items-baseline justify-between border-b border-stone-150 pb-3 mb-5">
        <div>
          <h3 className="text-sm font-semibold text-stone-900 tracking-tight">
            Daily target &amp; dietary restrictions
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Configured once at breakfast; carried over to lunch and dinner automatically.
          </p>
        </div>
        {initialCollapsed && (
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-xs text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* 1. Daily Calorie Target */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label
              htmlFor="dailyCalorieTarget"
              className="text-xs font-medium text-stone-700"
            >
              Daily calorie target
            </label>
            <span className="text-[11px] font-mono text-stone-400">kcal / day</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              id="dailyCalorieTarget"
              type="number"
              min="1"
              step="1"
              placeholder="2000"
              value={formData.calorieTarget}
              onChange={handleCalorieChange}
              aria-invalid={errors.calorieTarget ? 'true' : 'false'}
              className={`w-full sm:w-48 px-3 py-1.5 rounded-lg border text-sm font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-plum transition-all ${
                errors.calorieTarget
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-stone-300 focus:border-plum'
              }`}
            />

            {/* Presets */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-stone-400 hidden sm:inline mr-1">Presets:</span>
              {CALORIE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={`text-xs px-2.5 py-1 rounded-md border font-mono transition-colors cursor-pointer ${
                    formData.calorieTarget === String(preset)
                      ? 'bg-cream text-stone-900 border-cream-border font-medium'
                      : 'bg-white hover:bg-cream-tint text-stone-600 border-stone-200'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {errors.calorieTarget && (
            <p className="text-xs text-red-600 mt-1">{errors.calorieTarget}</p>
          )}
        </div>

        {/* 2. Dietary Preference */}
        <div>
          <label className="text-xs font-medium text-stone-700 block mb-1.5">
            Dietary preference
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DIETARY_PREFERENCES.map((diet) => {
              const isSelected = formData.dietaryPreference === diet.id;
              return (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => handleDietSelect(diet.id)}
                  className={`px-3 py-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-plum bg-plum-tint text-stone-900'
                      : 'border-stone-200 bg-stone-50/50 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="text-xs font-medium">{diet.label}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">{diet.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Food Allergies */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label className="text-xs font-medium text-stone-700">
              Food allergies &amp; restrictions
            </label>
            {formData.allergies.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllergies}
                className="text-[11px] text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Clear all ({formData.allergies.length})
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
            {FOOD_ALLERGIES.map((allergy) => {
              const isChecked = formData.allergies.includes(allergy.id);
              return (
                <button
                  key={allergy.id}
                  type="button"
                  onClick={() => handleAllergyToggle(allergy.id)}
                  className={`px-2 py-1.5 rounded-md border text-xs text-center transition-colors cursor-pointer ${
                    isChecked
                      ? 'border-mint bg-mint-tint text-stone-900 font-medium'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {allergy.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Preferred Dining Courts */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label className="text-xs font-medium text-stone-700">
              Preferred dining courts <span className="text-stone-400 font-normal">(optional)</span>
            </label>
            {formData.preferredDiningHalls.length > 0 && (
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, preferredDiningHalls: [] }))}
                className="text-[11px] text-stone-500 hover:text-stone-800 cursor-pointer"
              >
                Select all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {DINING_HALLS.map((hall) => {
              const isChecked = formData.preferredDiningHalls.includes(hall.id);
              return (
                <button
                  key={hall.id}
                  type="button"
                  onClick={() => handleDiningHallToggle(hall.id)}
                  className={`px-2.5 py-1.5 rounded-md border text-xs text-center transition-colors cursor-pointer ${
                    isChecked
                      ? 'border-plum bg-plum text-white font-medium'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  {hall.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-plum hover:bg-plum-hover rounded-lg transition-colors cursor-pointer"
          >
            Save preferences
          </button>
        </div>
      </form>
    </div>
  );
}
