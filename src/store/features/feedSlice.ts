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
    updateSaveStatus: (
      state,
      action: PayloadAction<{ _id: string; save: any[] }>
    ) => {
      const updatedMainFeed = [...state.mainFeed];
      let idx = -1;
      for (let i = 0; i < updatedMainFeed.length; i++) {
        if (updatedMainFeed[i]._id === action.payload._id) {
          idx = i;
          break;
        }
      }

      if (idx >= 0) {
        updatedMainFeed[idx] = {
          ...updatedMainFeed[idx],
          save: action.payload.save,
        };
        state.mainFeed = updatedMainFeed;
      }
    },
  },
});

export const { setFeedData, updateSaveStatus } = feedSlice.actions;

export const selectFeed = (state: RootState) => state.feed;

export default feedSlice.reducer;
