import React, { createContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { useToast } from "@chakra-ui/react";

export type LoginUserData = {
  eMail: string;
  password: string;
};

export type User = {
  eMail: string;
  username: string;
  firstname: string;
  id: string;
  lastname: string;
  iat: number;
  exp: number;
  iss: string;
  topTrackID: string;
};

type AuthContext = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  onLogin: (loginData: LoginUserData) => void;
  onLogout: () => void;
};

const authContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useLocalStorage<string | null>("accessToken", null);
  const toast = useToast();
  const user = accessToken ? (JSON.parse(atob(accessToken.split(".")[1])) as User) : null;

  /**
   *
   * 1. Login Daten an den Server schicken
   * 2. Access token kommt vom Server zurück
   * 3. Wenn ich einen access token haben / eingeloggt bin darf ich auf die Home Seite
   * 4. Access token wird im LocalStorage gespeichert
   * 5. Access token wird bei jeder Anfrage an den Server mitgeschickt
   *
   */
  const onLogin = async (loginData: LoginUserData) => {
    const body = {
      eMail: loginData.eMail,
      password: loginData.password,
    };
    try{
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.status === 400) {
        toast({ title: "invalid email or password", status: "error", position: "bottom" });
      }
      const resBody = await res.json();
      setAccessToken(resBody.accessToken);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  

  const onLogout = () => {
    setAccessToken(null);
  };
  return (
    <authContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        onLogin,
        onLogout,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const auth = React.useContext(authContext);
  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return auth;
};
