const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const AUTH_TOKEN_STORAGE_KEY = 'tallerx-auth-token';
export const AUTH_USER_STORAGE_KEY = 'tallerx-auth-user';

const clearAuthSession = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  window.dispatchEvent(new Event('tallerx-auth-logout'));

  if (!window.location.pathname.startsWith('/login')) {
    window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
  }
};

const toCamelCase = (value: string) => value.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());

const normalizeResponse = <T>(value: unknown): T => {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeResponse(item)) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [toCamelCase(key), normalizeResponse(item)])
    ) as T;
  }

  return value as T;
};

const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    if (response.status === 401) {
      clearAuthSession();
    }

    const errorBody = await response.json().catch(() => undefined) as { error?: string; message?: string } | undefined;
    throw new Error(errorBody?.message ?? errorBody?.error ?? `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return normalizeResponse<T>(await response.json());
};

export const httpClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });
    return parseResponse<T>(response);
  },

  post: async <T>(url: string, body: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(body),
    });
    return parseResponse<T>(response);
  },

  put: async <T>(url: string, body: unknown): Promise<T> => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(body),
    });
    return parseResponse<T>(response);
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
    });
    return parseResponse<T>(response);
  },
};
