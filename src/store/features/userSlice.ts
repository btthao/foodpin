import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserState {
  username: string;
  image: string;
}

const initialState: UserState = {
  username: "",
  image: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      const { username, image } = action.payload;
      state.username = username;
      state.image = image;
    },
    logout: (state) => {
      state.username = "";
      state.image = "";
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
