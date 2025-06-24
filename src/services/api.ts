import { RegistrationFormData } from "../schemas/registrationSchema";

// Extend Window interface for runtime environment variables
declare global {
  interface Window {
    __ENV__?: {
      VITE_API_URL?: string;
    };
  }
}

// More robust API URL configuration
const getApiBaseUrl = (): string => {
  // Try to get from environment variable (build-time)
  const envUrl = import.meta.env.VITE_API_URL;

  // Try to get from window.__ENV__ (runtime, if configured)
  const runtimeUrl = window.__ENV__?.VITE_API_URL;

  // Try to get from meta tag (runtime)
  const metaUrl = document
    .querySelector('meta[name="api-url"]')
    ?.getAttribute("content");

  // Determine if we're in production
  const isProduction =
    import.meta.env.PROD || window.location.hostname !== "localhost";

  // Use the first available URL, with production fallback
  const apiUrl =
    runtimeUrl ||
    metaUrl ||
    envUrl ||
    (isProduction
      ? "https://backend-omega-khaki.vercel.app"
      : "http://localhost:8000");

  return apiUrl;
};

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  city: string;
  postal_code: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getApiBaseUrl();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async registerUser(
    userData: RegistrationFormData & { password: string }
  ): Promise<User> {
    return this.request<User>("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getUsers(token: string): Promise<User[]> {
    return this.request<User[]>("/users", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async deleteUser(
    userId: number,
    token: string
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getCurrentUser(token: string): Promise<User> {
    return this.request<User>("/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const apiService = new ApiService();
