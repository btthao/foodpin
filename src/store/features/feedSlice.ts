import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeData } from "../../utils/data";
import { RootState } from "../store";

export interface FeedState {
  mainFeed: RecipeData[];
  searchFeed: RecipeData[];
}

const initialState: FeedState = {
  mainFeed: [],
  searchFeed: [],
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeedData: (
      state,
      action: PayloadAction<{ type: string; data: RecipeData[] }>
    ) => {
      if (action.payload.type === "main") {
        state.mainFeed = action.payload.data;
      } else {
        state.searchFeed = action.payload.data;
      }
    },
  },
});

export const { setFeedData } = feedSlice.actions;

export const selectFeed = (state: RootState) => state.feed;

export default feedSlice.reducer;
