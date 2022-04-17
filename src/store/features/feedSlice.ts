import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeData } from "../../utils/data";
import { RootState } from "../store";
import produce from "immer";

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
      const changeSaveStatus = (feed: RecipeData[]) => {
        return produce(feed, (draft) => {
          for (let i = 0; i < feed.length; i++) {
            if (feed[i]._id === action.payload._id) {
              draft[i] = { ...feed[i], save: action.payload.save };
            }
          }
        });
      };
      state.mainFeed = changeSaveStatus(state.mainFeed);
      state.searchFeed = changeSaveStatus(state.searchFeed);
    },
    resetFeed: (state) => {
      state.mainFeed = [];
      state.searchFeed = [];
    },
  },
});

export const { setFeedData, updateSaveStatus, resetFeed } = feedSlice.actions;

export const selectFeed = (state: RootState) => state.feed;

export default feedSlice.reducer;
