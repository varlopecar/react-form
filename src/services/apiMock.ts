import { RegistrationFormData } from "../schemas/registrationSchema";

// Mock data interfaces
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

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@example.com",
    first_name: "Admin",
    last_name: "User",
    birth_date: "1990-01-01",
    city: "Paris",
    postal_code: "75001",
    is_admin: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    birth_date: "1995-05-15",
    city: "Lyon",
    postal_code: "69001",
    is_admin: false,
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: 3,
    email: "jane.smith@example.com",
    first_name: "Jane",
    last_name: "Smith",
    birth_date: "1988-12-20",
    city: "Marseille",
    postal_code: "13001",
    is_admin: false,
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: 4,
    email: "pierre.dupont@example.com",
    first_name: "Pierre",
    last_name: "Dupont",
    birth_date: "1992-08-10",
    city: "Toulouse",
    postal_code: "31000",
    is_admin: false,
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: 5,
    email: "marie.laurent@example.com",
    first_name: "Marie",
    last_name: "Laurent",
    birth_date: "1997-03-25",
    city: "Nantes",
    postal_code: "44000",
    is_admin: false,
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
];

const mockBlogPosts: BlogPost[] = [
  {
    _id: "1",
    title: "Bienvenue sur notre Blog",
    content:
      "Ceci est le premier article de blog sur notre plateforme. Nous sommes ravis de partager du contenu intéressant avec nos lecteurs. Restez à l'écoute pour plus d'articles sur la technologie, le développement et les bonnes pratiques.",
    author: "Équipe Admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    _id: "2",
    title: "Débuter avec React",
    content:
      "React est une puissante bibliothèque JavaScript pour créer des interfaces utilisateur. Dans cet article, nous explorerons les bases des composants React, la gestion d'état et les hooks. Que vous soyez débutant ou développeur expérimenté, il y a quelque chose pour tout le monde ici.",
    author: "Jean Développeur",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    _id: "3",
    title: "Bonnes Pratiques Docker",
    content:
      "Docker a révolutionné la façon dont nous déployons les applications. Découvrez les bonnes pratiques Docker incluant les builds multi-étapes, les considérations de sécurité et les techniques d'optimisation. Nous couvrirons tout, des concepts de base aux stratégies de déploiement avancées.",
    author: "Sarah DevOps",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    _id: "4",
    title: "Principes de Conception d'API",
    content:
      "Une bonne conception d'API est cruciale pour construire des applications évolutives. Nous discuterons des principes RESTful, de la gestion d'erreurs, des stratégies de versioning et des bonnes pratiques de documentation. Ces principes s'appliquent que vous construisiez des microservices ou des applications monolithiques.",
    author: "Mike Architecte",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    _id: "5",
    title: "Stratégies de Test pour Applications Modernes",
    content:
      "Les tests sont une partie essentielle du développement logiciel. Nous explorerons différentes stratégies de test incluant les tests unitaires, les tests d'intégration et les tests end-to-end. Apprenez comment implémenter des tests complets qui vous donnent confiance dans votre code.",
    author: "Lisa QA",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
  {
    _id: "6",
    title: "Introduction à TypeScript",
    content:
      "TypeScript ajoute un système de types statiques à JavaScript, rendant le développement plus sûr et plus maintenable. Dans cet article, nous couvrirons les bases de TypeScript, les interfaces, les types génériques et comment migrer progressivement depuis JavaScript.",
    author: "Thomas TypeScript",
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-03-15T00:00:00Z",
  },
];

// Simulate API delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockApiService {
  private users = [...mockUsers];
  private blogPosts = [...mockBlogPosts];

  async registerUser(
    userData: RegistrationFormData & { password: string }
  ): Promise<User> {
    await delay(500); // Simulate network delay

    const newUser: User = {
      id: this.users.length + 1,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      birth_date: userData.birthDate.toISOString(),
      city: userData.city,
      postal_code: userData.postalCode,
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(300);

    // Allow any email/password for testing, but prefer admin user
    let user = this.users.find((u) => u.email === credentials.email);

    // If no user found, use admin user for testing
    if (!user) {
      user = this.users.find((u) => u.is_admin) || this.users[0];
    }

    return {
      access_token: "mock-jwt-token-" + user.id,
      token_type: "bearer",
    };
  }

  async getUsers(token: string): Promise<User[]> {
    await delay(400);

    if (!token.startsWith("mock-jwt-token-")) {
      throw new Error("Unauthorized");
    }

    return this.users.map((user) => ({
      ...user,
      // Hide sensitive data for non-admin users
      email: user.is_admin ? user.email : user.email.split("@")[0] + "@***",
      birth_date: user.is_admin ? user.birth_date : "***",
    }));
  }

  async deleteUser(
    userId: number,
    token: string
  ): Promise<{ message: string }> {
    await delay(300);

    if (!token.startsWith("mock-jwt-token-")) {
      throw new Error("Unauthorized");
    }

    const userIndex = this.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    this.users.splice(userIndex, 1);
    return { message: "User deleted successfully" };
  }

  async getCurrentUser(token: string): Promise<User> {
    await delay(200);

    if (!token.startsWith("mock-jwt-token-")) {
      throw new Error("Unauthorized");
    }

    const userId = parseInt(token.split("-").pop() || "1");
    const user = this.users.find((u) => u.id === userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  // Blog post methods
  async getBlogPosts(): Promise<BlogPost[]> {
    await delay(400);
    return this.blogPosts;
  }

  async createBlogPost(postData: CreateBlogPost): Promise<BlogPost> {
    await delay(500);

    const newPost: BlogPost = {
      _id: (this.blogPosts.length + 1).toString(),
      title: postData.title,
      content: postData.content,
      author: postData.author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.blogPosts.unshift(newPost); // Add to beginning
    return newPost;
  }

  async deleteBlogPost(postId: string): Promise<{ message: string }> {
    await delay(300);

    const postIndex = this.blogPosts.findIndex((p) => p._id === postId);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    this.blogPosts.splice(postIndex, 1);
    return { message: "Blog post deleted successfully" };
  }

  async updateBlogPost(
    postId: string,
    postData: CreateBlogPost
  ): Promise<BlogPost> {
    await delay(400);

    const postIndex = this.blogPosts.findIndex((p) => p._id === postId);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }

    const updatedPost: BlogPost = {
      ...this.blogPosts[postIndex],
      title: postData.title,
      content: postData.content,
      author: postData.author,
      updatedAt: new Date().toISOString(),
    };

    this.blogPosts[postIndex] = updatedPost;
    return updatedPost;
  }

  // Convenience methods without token parameter
  async getUsersWithoutToken(): Promise<User[]> {
    const token = localStorage.getItem("authToken") || "mock-jwt-token-1";
    return this.getUsers(token);
  }

  async deleteUserWithoutToken(userId: number): Promise<{ message: string }> {
    const token = localStorage.getItem("authToken") || "mock-jwt-token-1";
    return this.deleteUser(userId, token);
  }

  async getCurrentUserWithoutToken(): Promise<User> {
    const token = localStorage.getItem("authToken") || "mock-jwt-token-1";
    return this.getCurrentUser(token);
  }
}

export const mockApiService = new MockApiService();
