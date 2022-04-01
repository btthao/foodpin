import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface UserState {
  username: string;
  image: string;
  id: string;
}

const initialState: UserState = {
  username: "",
  image: "",
  id: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      const { username, image, id } = action.payload;
      state.username = username;
      state.image = image;
      state.id = id;
    },
    logout: (state) => {
      state.username = "";
      state.image = "";
      state.id = "";
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
