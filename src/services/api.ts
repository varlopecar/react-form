import { RegistrationFormData } from "../schemas/registrationSchema";

// Extend Window interface for runtime environment variables
declare global {
  interface Window {
    __ENV__?: {
      VITE_API_URL?: string;
    };
  }
}

// Simple API URL configuration
const getApiBaseUrl = (): string => {
  // Use environment variable or fallback to localhost
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  
  console.log("🔍 API URL:", apiUrl);
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
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Blog post interfaces for Node.js/MongoDB API
export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPost {
  title: string;
  content: string;
  author: string;
}

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getApiBaseUrl();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { baseUrl?: string } = {}
  ): Promise<T> {
    const { baseUrl, ...requestOptions } = options;
    const url = `${baseUrl || this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...requestOptions.headers,
      },
      credentials: "omit", // Don't send credentials for cross-origin requests
      mode: "cors", // Explicitly set CORS mode
      ...requestOptions,
    };

    // Debug logging
    console.log("🌐 API Request:", {
      url,
      method: config.method || "GET",
      headers: config.headers,
      hasBody: !!config.body,
    });

    try {
      const response = await fetch(url, config);

      // Debug response
      console.log("📡 API Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers ? Object.fromEntries(response.headers.entries()) : {},
        url: response.url,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error:", errorData);
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("💥 API request failed:", error);
      throw error;
    }
  }

  async registerUser(
    userData: RegistrationFormData & { password: string }
  ): Promise<User> {
    // Transform camelCase to snake_case for backend compatibility
    const transformedData = {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      birth_date: userData.birthDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
      city: userData.city,
      postal_code: userData.postalCode,
      password: userData.password,
    };

    return this.request<User>("/register", {
      method: "POST",
      body: JSON.stringify(transformedData),
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  // Blog post methods for Node.js/MongoDB API
  async getBlogPosts(): Promise<BlogPost[]> {
    // This will connect to the separate Node.js/MongoDB API
    const blogApiUrl =
      import.meta.env.VITE_BLOG_API_URL || "http://localhost:3001";
    return this.request<BlogPost[]>("/posts", {
      baseUrl: blogApiUrl,
    });
  }

  async createBlogPost(postData: CreateBlogPost): Promise<BlogPost> {
    const blogApiUrl =
      import.meta.env.VITE_BLOG_API_URL || "http://localhost:3001";
    return this.request<BlogPost>("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
      baseUrl: blogApiUrl,
    });
  }

  async deleteBlogPost(postId: string): Promise<{ message: string }> {
    const blogApiUrl =
      import.meta.env.VITE_BLOG_API_URL || "http://localhost:3001";
    return this.request<{ message: string }>(`/posts/${postId}`, {
      method: "DELETE",
      baseUrl: blogApiUrl,
    });
  }

  async updateBlogPost(
    postId: string,
    postData: CreateBlogPost
  ): Promise<BlogPost> {
    const blogApiUrl =
      import.meta.env.VITE_BLOG_API_URL || "http://localhost:3001";
    return this.request<BlogPost>(`/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify(postData),
      baseUrl: blogApiUrl,
    });
  }

  // User management methods (public access)
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/users", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("No authentication token");

    return this.request<{ message: string }>(`/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Fetch public users (first names only)
  async getPublicUsers(): Promise<{ first_name: string }[]> {
    return this.request<{ first_name: string }[]>("/public-users", {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

// Use mock service for frontend testing (no API calls)
// Change this to false to use real API
const USE_MOCK = false;

// Import mock service
import { mockApiService } from "./apiMock";

// Create a wrapper that provides the correct interface
const createApiService = () => {
  if (USE_MOCK) {
    return {
      registerUser: mockApiService.registerUser.bind(mockApiService),
      login: mockApiService.login.bind(mockApiService),
      getUsers: mockApiService.getUsersWithoutToken.bind(mockApiService),
      getPublicUsers: mockApiService.getPublicUsers.bind(mockApiService),
      deleteUser: mockApiService.deleteUserWithoutToken.bind(mockApiService),
      getBlogPosts: mockApiService.getBlogPosts.bind(mockApiService),
      createBlogPost: mockApiService.createBlogPost.bind(mockApiService),
      deleteBlogPost: mockApiService.deleteBlogPost.bind(mockApiService),
      updateBlogPost: mockApiService.updateBlogPost.bind(mockApiService),
    };
  }
  return new ApiService();
};

export const apiService = createApiService();
