const BASE_URL = "http://localhost:5000/api";

// ── Token yönetimi ───────────────────────────────────────────────────
export const getToken = () => localStorage.getItem("token");
export const setToken = (token: string) => localStorage.setItem("token", token);
export const removeToken = () => localStorage.removeItem("token");

// ── Ortak fetch ──────────────────────────────────────────────────────
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Bir hata oluştu");
  }
  return data;
}
// ── Auth ─────────────────────────────────────────────────────────────
export const authApi = {
  register: (body: {
    name: string;
    email: string;
    password: string;
    accountType?: "individual" | "company";
    companyName?: string;
  }) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => apiFetch("/auth/me"),
};