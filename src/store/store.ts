import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import userReducer from "./features/userSlice";
import feedReducer from "./features/feedSlice";
import userPageReducer from "./features/userPageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    userPage: userPageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
