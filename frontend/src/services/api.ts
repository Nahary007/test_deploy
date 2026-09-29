import type { AuthResponse, LoginFormData, RegisterFormData, User } from "../types/auth";

const API_BASE_URL = "http://localhost:5000/api";

const getToken = (): string | null => {
  return localStorage.getItem("auth_token");
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem("auth_token", token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem("auth_token");
};

export const apiRegister = async (data: RegisterFormData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Échec de l'inscription");
  }

  return resData;
};

export const apiLogin = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error(resData.message || "Échec de la connexion");
  }

  return resData;
};

export const apiLogout = async (): Promise<void> => {
  const token = getToken();
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (err) {
    console.error("Erreur logout:", err);
  } finally {
    removeStoredToken();
  }
};

export const apiGetMe = async (): Promise<{ user: User }> => {
  const token = getToken();
  if (!token) {
    throw new Error("Aucun jeton d'authentification trouvé");
  }

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    removeStoredToken();
    throw new Error(resData.message || "Session expirée ou invalide");
  }

  return resData;
};
