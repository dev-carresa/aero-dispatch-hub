
// Gestion améliorée du stockage de session

interface SessionData {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
  expiresAt: number; // timestamp en millisecondes
  tokenRefreshAt: number; // timestamp pour le rafraîchissement silencieux
}

const SESSION_KEY = 'sb-qqfnokbhdzmffywksmvl-auth-token';
const USER_DATA_KEY = 'user-session-data';
const REMEMBERED_EMAIL_KEY = 'remembered-email';
const LOGIN_ATTEMPTS_KEY = 'login-attempts';

// Stocke les données utilisateur complètes lors de la connexion
export const storeUserSession = (
  userId: string,
  email: string | null,
  name: string | null,
  role: string | null,
  expiresIn: number = 3600 // Durée par défaut en secondes
): void => {
  const now = new Date().getTime();
  const expiresAt = now + (expiresIn * 1000);
  const tokenRefreshAt = now + ((expiresIn * 1000) * 0.8); // Rafraîchir à 80% du temps d'expiration
  
  const sessionData: SessionData = {
    id: userId,
    email,
    name,
    role,
    expiresAt,
    tokenRefreshAt
  };
  
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(sessionData));
  
  // Réinitialiser le compteur de tentatives après une connexion réussie
  resetLoginAttempts();
};

// Mémoriser l'email de l'utilisateur
export const rememberUserEmail = (email: string, remember: boolean = true): void => {
  if (remember && email) {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
  } else {
    localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  }
};

// Récupérer l'email mémorisé
export const getRememberedEmail = (): string => {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
};

// Supprimer toutes les données de session lors de la déconnexion
export const clearUserSession = (): void => {
  localStorage.removeItem(USER_DATA_KEY);
  // Conserver la suppression du token Supabase pour assurer la compatibilité
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    console.error('Error clearing Supabase token:', e);
  }
  // Ne pas effacer l'email mémorisé lors de la déconnexion
};

// Vérifier si la session est valide basée sur les données stockées localement
export const isSessionValid = (): boolean => {
  try {
    const sessionDataStr = localStorage.getItem(USER_DATA_KEY);
    if (!sessionDataStr) return false;
    
    const sessionData: SessionData = JSON.parse(sessionDataStr);
    const now = new Date().getTime();
    
    // Session valide si le temps actuel est inférieur à l'expiration
    return sessionData.expiresAt > now;
  } catch (e) {
    console.error('Error checking session validity:', e);
    return false;
  }
};

// Vérifier si le token doit être rafraîchi
export const shouldRefreshToken = (): boolean => {
  try {
    const sessionDataStr = localStorage.getItem(USER_DATA_KEY);
    if (!sessionDataStr) return false;
    
    const sessionData: SessionData = JSON.parse(sessionDataStr);
    const now = new Date().getTime();
    
    // Refresh nécessaire si on a dépassé le temps de rafraîchissement
    return sessionData.tokenRefreshAt < now && sessionData.expiresAt > now;
  } catch (e) {
    console.error('Error checking token refresh:', e);
    return false;
  }
};

// Récupérer les données utilisateur stockées
export const getStoredUserData = (): SessionData | null => {
  try {
    const sessionDataStr = localStorage.getItem(USER_DATA_KEY);
    if (!sessionDataStr) return null;
    
    return JSON.parse(sessionDataStr);
  } catch (e) {
    console.error('Error getting stored user data:', e);
    return null;
  }
};

// Vérifier si nous avons une session stockée (rapide, sans validation d'expiration)
export const hasStoredSession = (): boolean => {
  try {
    return !!localStorage.getItem(USER_DATA_KEY) && !!localStorage.getItem(SESSION_KEY);
  } catch (e) {
    return false;
  }
};

// Mettre à jour la date d'expiration après un rafraîchissement de token
export const updateSessionExpiry = (expiresIn: number = 3600): void => {
  try {
    const sessionDataStr = localStorage.getItem(USER_DATA_KEY);
    if (!sessionDataStr) return;
    
    const sessionData: SessionData = JSON.parse(sessionDataStr);
    const now = new Date().getTime();
    
    sessionData.expiresAt = now + (expiresIn * 1000);
    sessionData.tokenRefreshAt = now + ((expiresIn * 1000) * 0.8);
    
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(sessionData));
  } catch (e) {
    console.error('Error updating session expiry:', e);
  }
};

// Nouvelles fonctions pour gérer les tentatives de connexion
export const trackLoginAttempt = (): number => {
  try {
    const now = new Date().getTime();
    const attemptsData = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    
    let attempts = [];
    if (attemptsData) {
      attempts = JSON.parse(attemptsData);
      // Supprimer les tentatives datant de plus de 5 minutes
      attempts = attempts.filter(timestamp => (now - timestamp) < 5 * 60 * 1000);
    }
    
    // Ajouter la nouvelle tentative
    attempts.push(now);
    localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
    
    return attempts.length;
  } catch (e) {
    console.error('Error tracking login attempt:', e);
    return 1;
  }
};

export const getLoginAttempts = (): number => {
  try {
    const now = new Date().getTime();
    const attemptsData = localStorage.getItem(LOGIN_ATTEMPTS_KEY);
    
    if (!attemptsData) return 0;
    
    const attempts = JSON.parse(attemptsData);
    // Filtrer les tentatives datant de plus de 5 minutes
    const recentAttempts = attempts.filter(timestamp => (now - timestamp) < 5 * 60 * 1000);
    
    return recentAttempts.length;
  } catch (e) {
    console.error('Error getting login attempts:', e);
    return 0;
  }
};

export const resetLoginAttempts = (): void => {
  try {
    localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
  } catch (e) {
    console.error('Error resetting login attempts:', e);
  }
};

// Mémoriser le password n'est PAS implémenté pour des raisons de sécurité
// Nous recommandons d'utiliser le gestionnaire de mots de passe du navigateur à la place
