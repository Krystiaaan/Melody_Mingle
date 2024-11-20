import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { mountStoreDevtool } from "simple-zustand-devtools";

type TRegisterState = "initRegister" | "userDetails" | "userGender" | "userTaste";

interface LoginState {
  registerState: TRegisterState;
  setRegisterState(registerState: TRegisterState): void;
  userID: string;
  setUserID(userID: string): void;
}

export const useLoginStore = create<LoginState>()(
  devtools(
    (set) => ({
      registerState: "initRegister",
      setRegisterState: (registerState) => {
        set({ registerState });
      },
      userID: "",
      setUserID: (userID) => {
        set({ userID });
      },
    }),
    {
      name: "login-storage",
    }
  )
);

mountStoreDevtool("Login Store", useLoginStore);
