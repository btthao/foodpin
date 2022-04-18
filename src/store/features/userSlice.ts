import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GoogleLoginResponse } from "react-google-login";
import { client } from "../../client";
import { User } from "../../utils/data";
import { RootState } from "../store";

export interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
};

export const login = createAsyncThunk(
  "user/loginUser",
  async (profileObj: GoogleLoginResponse["profileObj"]) => {
    const { name, imageUrl, googleId } = profileObj;
    const doc: User & { _type: string } = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: imageUrl,
      createdList: [],
      saveList: [],
    };

    const response = await client
      .createIfNotExists(doc)
      .then((res) => {
        console.log("create user doc response", res);
        localStorage.setItem("fp-user", JSON.stringify(profileObj));
        const { userName, _id, image, createdList, saveList } = res;
        return {
          _id,
          userName,
          image,
          createdList,
          saveList,
        };
      })
      .catch((err) => {
        console.log("error creating user doc:", err);
        return null;
      });
    return response;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("fp-user");
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      login.fulfilled,
      (state, action: PayloadAction<User | null>) => {
        state.currentUser = action.payload;
      }
    );
  },
});

export const { logout } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
