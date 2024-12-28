import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Auth,
  AuthProviderContext,
  SignInSchema,
  SignUpSchema,
} from "@/contexts/AuthContext";
import { delay } from "@/lib/utils";

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children, ...props }: AuthProviderProps) {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signInSuccess, setSignInSuccess] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState<string | null>(null);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [logoutSuccess, setLogoutSuccess] = useState<string | null>(null);
  const [signInLoading, setSignInLoading] = useState<boolean>(false);
  const [signUpLoading, setSignUpLoading] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{
        success: boolean;
        message: string;
        accessToken?: string;
      }>(`http://localhost:5000/user/refresh`, {
        withCredentials: true,
      });

      if (!response.data.accessToken) {
        return;
      }
      const { accessToken } = response.data;
      type DecodedType = Omit<Auth, "accessToken">;
      const decodedToken = jwtDecode(accessToken as string) as DecodedType;
      setAuth({ accessToken: accessToken as string, ...decodedToken });
    } catch {
      return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth) {
      refreshUser();
    }
  }, [auth]);

  async function signIn(values: SignInSchema) {
    setSignInLoading(true);
    setSignInError("");
    setSignInSuccess("");
    try {
      const response = await axios.post<{
        success: boolean;
        message: string;
        accessToken?: string;
      }>("http://localhost:5000/user/sign-in", values, {
        withCredentials: true,
      });
      if (response.status !== 200) {
        setSignInError(response.data.message);
        return;
      }
      const { accessToken } = response.data;
      type DecodedType = Omit<Auth, "accessToken">;
      const decodedToken = jwtDecode(accessToken as string) as DecodedType;
      setSignInSuccess(response.data.message);
      await delay(1000);
      setAuth({ accessToken: accessToken as string, ...decodedToken });
    } catch (err) {
      if (err instanceof AxiosError) {
        setSignInError(err.response?.data.message);
      }
    } finally {
      setSignInLoading(false);
    }
  }

  async function signUp(values: SignUpSchema) {
    try {
      setSignUpError("");
      setSignUpSuccess("");
      setSignUpLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);

      if (values.avatar instanceof File) {
        formData.append("avatar", values.avatar);
      } else {
        throw new Error("Avatar must be a File");
      }

      const response = await axios.post<{ success: boolean; message: string }>(
        "http://localhost:5000/user/sign-up",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status !== 201) {
        setSignUpError(response.data.message);
        return;
      }

      setSignUpSuccess(response.data.message);
    } catch (err) {
      if (err instanceof AxiosError) {
        setSignUpError(err.response?.data.message);
      }
    } finally {
      setSignUpLoading(false);
    }
  }

  const logout = async () => {
    try {
      setLogoutLoading(true);
      setLogoutError("");
      setLogoutSuccess("");
      const response = await axios.delete<{
        success: boolean;
        message: string;
      }>(`http://localhost:5000/user/logout`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${auth?.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        return;
      }
      setLogoutSuccess(response.data.message);
      setAuth(null);
    } catch (err) {
      if (err instanceof AxiosError) {
        setLogoutError(err.response?.data.message);
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  const value = {
    signIn,
    signUp,
    auth,
    signInError,
    signInSuccess,
    signUpError,
    signUpSuccess,
    logoutError,
    logoutSuccess,
    logout,
    loading,
    signInLoading,
    signUpLoading,
    logoutLoading,
  };

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}
