import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/common";

const initialState: User = {
  user_id: "",
  name: "",
  email: "",
  isLoggedIn: false,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user_id = action.payload.user_id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.user_id = "";
      state.name = "";
      state.email = "";
      state.isLoggedIn = false;
      state.role = null;
    },
    updateRole: (
      state,
      action: PayloadAction<"trainer" | "participant" | null>
    ) => {
      state.role = action.payload;
    },
  },
});

export const { login, logout, updateRole } = userSlice.actions;
export default userSlice.reducer;
