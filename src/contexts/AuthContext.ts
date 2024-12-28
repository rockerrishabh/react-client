import { createContext } from "react";
import { z } from "zod";

type User = {
  id: string;
  email: "rockerrishabh1994@gmail.com";
  name: "Rishabh Kumar";
  avatar: string;
};

export type Auth = {
  user: User;
  accessToken: string;
  exp: number;
  iat: number;
};

export const signUpSchema = z.object({
  avatar: z.instanceof(File).refine((file) => file?.size <= 20 * 1024 * 1024, {
    message: "Avatar size must be less than 20MB.",
  }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password must be less than 20 characters"),
  // .regex(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //   "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  // ),
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address").min(2).max(50),
  password: z.string().min(6, "Password must be at least 6 characters").max(20),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;

type AuthProviderState = {
  auth: Auth | null;
  signInError: string | null;
  signInSuccess: string | null;
  signUpError: string | null;
  signUpSuccess: string | null;
  logoutError: string | null;
  logoutSuccess: string | null;
  loading: boolean;
  signInLoading: boolean;
  signUpLoading: boolean;
  logoutLoading: boolean;
  signIn: (values: SignInSchema) => Promise<void>;
  signUp: (values: SignUpSchema) => Promise<void>;
  logout: () => Promise<void>;
};

const initialState: AuthProviderState = {
  auth: null,
  signInError: null,
  signInSuccess: null,
  signUpError: null,
  signUpSuccess: null,
  logoutError: null,
  logoutSuccess: null,
  loading: false,
  signInLoading: false,
  signUpLoading: false,
  logoutLoading: false,
  signIn: async () => {},
  signUp: async () => {},
  logout: async () => {},
};

export const AuthProviderContext =
  createContext<AuthProviderState>(initialState);
