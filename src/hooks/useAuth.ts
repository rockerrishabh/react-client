import { useContext } from "react";
import { AuthProviderContext } from "@/contexts/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
