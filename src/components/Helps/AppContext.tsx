"use client";
import React, {
  useState,
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

import type { StrapiAuthResponse, StrapiUser } from "@/types/strapi-custom-types";
import { getUserMeLoader } from "@/services/user-me-loader";

interface MeActonResponse {
  data: StrapiAuthResponse;
  ok: boolean;
  error?: any;
}

interface AppContextType {
  user: StrapiUser | null;
  setUser: React.Dispatch<React.SetStateAction<StrapiUser | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<StrapiUser | null>(null);
  const router = useRouter();
  const fetchData = useCallback(async () => {
    try {
      const response = (await getUserMeLoader()) as MeActonResponse;
      const user: any = response.data.error ? null : response.data;
      if (user) setUser(user);
      else router.push("/");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
