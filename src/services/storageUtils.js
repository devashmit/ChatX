/**
 * Cryptographic and LocalStorage utilities for ChatX.
 */

/**
 * Generates a SHA-256 hash of a password using the Web Crypto API.
 * @param {string} password 
 * @returns {Promise<string>} Hex encoded hash
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Safely writes a key-value pair to localStorage with quota error handling.
 * @param {string} key 
 * @param {any} value 
 * @returns {boolean} Success state
 */
export function safeSetItem(key, value) {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, stringValue);
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      console.error('LocalStorage storage quota exceeded.', e);
      alert('Local storage is full. Some conversations may not be saved. Please delete older chats.');
    } else {
      console.error('Error writing to localStorage', e);
    }
    return false;
  }
}

/**
 * Retrieves all registered users.
 * @returns {Array} Array of user objects
 */
export function getUsers() {
  try {
    const users = localStorage.getItem('chatx_users');
    return users ? JSON.parse(users) : [];
  } catch (e) {
    console.error('Error reading users list', e);
    return [];
  }
}

/**
 * Saves a new user to the registered list.
 * @param {object} user { username, passwordHash, createdAt }
 * @returns {boolean} Success state
 */
export function saveUser(user) {
  const users = getUsers();
  users.push(user);
  return safeSetItem('chatx_users', users);
}

/**
 * Gets the current active session user.
 * @returns {object|null} Active session or null
 */
export function getCurrentUserSession() {
  try {
    const session = localStorage.getItem('chatx_current_user');
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

/**
 * Sets the current active session.
 * @param {object} session { username, loginTime }
 */
export function setCurrentUserSession(session) {
  safeSetItem('chatx_current_user', session);
}

/**
 * Clears the active session.
 */
export function clearCurrentUserSession() {
  localStorage.removeItem('chatx_current_user');
}
