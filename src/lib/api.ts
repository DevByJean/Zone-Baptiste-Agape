const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface FetchOptions extends RequestInit {
  data?: unknown;
}

export const api = {
  get: async (endpoint: string, options: FetchOptions = {}) => {
    return request(endpoint, { ...options, method: 'GET' });
  },
  post: async (endpoint: string, options: FetchOptions = {}) => {
    return request(endpoint, { ...options, method: 'POST' });
  },
  put: async (endpoint: string, options: FetchOptions = {}) => {
    return request(endpoint, { ...options, method: 'PUT' });
  },
  delete: async (endpoint: string, options: FetchOptions = {}) => {
    return request(endpoint, { ...options, method: 'DELETE' });
  },
};

async function request(endpoint: string, options: FetchOptions = {}) {
  const { data, ...customConfig } = options;
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, config);
  } catch (error) {
    // fetch() lève un TypeError (pas une erreur HTTP) quand le serveur est
    // injoignable, hors-ligne, ou bloqué par CORS. Avant, ce cas remontait
    // tel quel comme "Failed to fetch", peu compréhensible pour l'utilisateur.
    console.error(`Impossible de joindre ${API_URL}${endpoint} :`, error);
    throw new Error(
      `Impossible de contacter le serveur (${API_URL}). Vérifiez que le backend est démarré et que VITE_API_URL est correct.`
    );
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erreur API (${response.status})`);
  }

  // Pour les routes qui retournent du texte brut ou rien (ex: 204 No Content)
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}