
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
