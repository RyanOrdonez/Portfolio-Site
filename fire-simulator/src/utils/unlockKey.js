// utils/unlockKey.js
// Purpose: Gumroad license key validation + localStorage persistence for Pro unlock.
//   Client-side only — keys are validated against a hardcoded list for MVP.
//   This is intentionally simple (v1 requirement); upgrade to server-side
//   validation in v2 if key sharing becomes a problem.
// Key exports: validateKey, isUnlocked, setUnlocked, clearUnlock

// ---------------------------------------------------------------------------
// VALID_KEYS — placeholder list for MVP.
// Replace with real Gumroad license keys before launch.
// Keys are case-insensitive; validated after uppercasing + trimming.
// ---------------------------------------------------------------------------
const VALID_KEYS = [
  'FIRE-PRO-DEMO-2025',
  // Add real Gumroad keys here before launch
];

const STORAGE_KEY = 'fire_sim_pro_unlocked';

// ---------------------------------------------------------------------------
// validateKey — check if a key is valid
// Returns: { valid: boolean, message: string }
// ---------------------------------------------------------------------------
export function validateKey(rawKey) {
  if (!rawKey || typeof rawKey !== 'string') {
    return { valid: false, message: 'Please enter a license key.' };
  }

  const normalized = rawKey.trim().toUpperCase();

  if (normalized.length === 0) {
    return { valid: false, message: 'Please enter a license key.' };
  }

  if (VALID_KEYS.includes(normalized)) {
    return { valid: true, message: 'License key accepted. Pro features unlocked!' };
  }

  return {
    valid: false,
    message: 'Invalid license key. Check your Gumroad receipt or purchase at the link below.',
  };
}

// ---------------------------------------------------------------------------
// isUnlocked — check localStorage for a persisted unlock
// ---------------------------------------------------------------------------
export function isUnlocked() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    // localStorage unavailable (private browsing in some browsers)
    return false;
  }
}

// ---------------------------------------------------------------------------
// setUnlocked — persist unlock state to localStorage
// ---------------------------------------------------------------------------
export function setUnlocked(value) {
  try {
    if (value) {
      localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Silently fail — user will need to re-enter key on next visit
  }
}

// ---------------------------------------------------------------------------
// clearUnlock — remove persisted unlock (for testing / reset)
// ---------------------------------------------------------------------------
export function clearUnlock() {
  setUnlocked(false);
}
