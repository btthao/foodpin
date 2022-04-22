import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeData, Save } from "../../utils/data";
import { RootState } from "../store";
import produce from "immer";

export interface FeedState {
  mainFeed: RecipeData[];
  searchQuery: string;
  searchFeed: RecipeData[];
}

const initialState: FeedState = {
  mainFeed: [],
  searchQuery: "",
  searchFeed: [],
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
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
      action: PayloadAction<{
        _id: string;
        userId: string;
        saved: boolean;
      }>
    ) => {
      const changeSaveStatus = (feed: RecipeData[]) => {
        return produce(feed, (draft) => {
          for (let i = 0; i < feed.length; i++) {
            if (feed[i]._id === action.payload._id) {
              if (action.payload.saved) {
                draft[i] = {
                  ...feed[i],
                  save: !feed[i].save
                    ? [{ userId: action.payload.userId }]
                    : [
                        ...(feed[i].save as Save[]),
                        { userId: action.payload.userId },
                      ],
                };
              } else {
                draft[i] = {
                  ...feed[i],
                  save: feed[i].save!.filter(
                    (user) => user.userId !== action.payload.userId
                  ),
                };
              }
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

export const { setFeedData, updateSaveStatus, resetFeed, setSearchQuery } =
  feedSlice.actions;

export const selectFeed = (state: RootState) => state.feed;

export default feedSlice.reducer;
