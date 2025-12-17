export type Role = "superadmin" | "admin" | "operator" | string;

export type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
};

export type User = {
  id: number;
  id_department: number | null;
  username: string;
  role: Role;
};

export type LoginCredentials = {
  username: string;
  password: string;
};
