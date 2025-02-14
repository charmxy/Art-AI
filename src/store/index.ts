import { create } from "zustand";
interface UserStore {
  userState: {};
  setUserState: (payload: UserStore) => any;
  clearUserState: () => void;
}

export const useUserStore = create<any>(set => ({
  // 默认为游客
  userState: {},
  setUserState: (userState: UserStore) => set({ userState }),
  clearUserState: () => set({ userState: {} })
}));
