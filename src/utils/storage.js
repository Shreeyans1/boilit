/**
 * BoilIt LocalStorage Management
 * 
 * Persists user form preferences and daily journey progress across sessions for CS 19300.
 */

const PREFERENCES_KEY = 'boilit_user_preferences';
const JOURNEY_KEY_PREFIX = 'boilit_journey_';

/**
 * Returns today's local date string formatted as YYYY-MM-DD
 */
export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats date into a user-friendly display (e.g., "Thursday, Nov 19")
 */
export function formatFriendlyDate(dateStr) {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Loads saved user preferences or returns default fallbacks
 */
export function loadUserPreferences() {
  try {
    const raw = localStorage.getItem(PREFERENCES_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Could not load BoilIt preferences from localStorage:', err);
    return null;
  }
}

/**
 * Saves user preferences to localStorage
 */
export function saveUserPreferences(preferences) {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (err) {
    console.warn('Could not save BoilIt preferences to localStorage:', err);
  }
}

/**
 * Initial empty daily journey structure
 */
export function createInitialJourney(dateStr = getTodayDateString()) {
  return {
    date: dateStr,
    meals: {
      breakfast: null, // null | { status: 'consumed'|'skipped', calories: number, diningHall?: string, title?: string, ... }
      lunch: null,
      dinner: null,
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Loads the journey progress for a specific date
 */
export function loadDailyJourney(dateStr = getTodayDateString()) {
  try {
    const raw = localStorage.getItem(`${JOURNEY_KEY_PREFIX}${dateStr}`);
    if (!raw) return createInitialJourney(dateStr);
    const parsed = JSON.parse(raw);
    return {
      ...createInitialJourney(dateStr),
      ...parsed,
      date: dateStr,
    };
  } catch (err) {
    console.warn(`Could not load BoilIt journey for ${dateStr}:`, err);
    return createInitialJourney(dateStr);
  }
}

/**
 * Saves the daily journey progress
 */
export function saveDailyJourney(dateStr, journeyData) {
  try {
    const dataToSave = {
      ...journeyData,
      date: dateStr,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(`${JOURNEY_KEY_PREFIX}${dateStr}`, JSON.stringify(dataToSave));
  } catch (err) {
    console.warn(`Could not save BoilIt journey for ${dateStr}:`, err);
  }
}

/**
 * Clears today's journey
 */
export function clearDailyJourney(dateStr = getTodayDateString()) {
  try {
    localStorage.removeItem(`${JOURNEY_KEY_PREFIX}${dateStr}`);
  } catch (err) {
    console.warn(`Could not clear BoilIt journey for ${dateStr}:`, err);
  }
}
