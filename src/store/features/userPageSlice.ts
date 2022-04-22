import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import produce from "immer";
import { RecipeData, Save } from "../../utils/data";
import { RootState } from "../store";

export interface UserPageState {
  userId: string;
  createdList: RecipeData[];
  saveList: RecipeData[];
}

const initialState: UserPageState = {
  userId: "",
  createdList: [],
  saveList: [],
};

export const userPageSlice = createSlice({
  name: "userPage",
  initialState,
  reducers: {
    setListData: (state, action: PayloadAction<UserPageState>) => {
      state.userId = action.payload.userId;
      state.createdList = action.payload.createdList;
      state.saveList = action.payload.saveList;
    },
    updateSaveStatusUserList: (
      state,
      action: PayloadAction<{
        _id: string;
        userId: string;
        saved: boolean;
        isOwnList?: boolean;
      }>
    ) => {
      if (!state.userId) return;
      const changeSaveStatus = (list: RecipeData[]) => {
        return produce(list, (draft) => {
          for (let i = 0; i < list.length; i++) {
            if (list[i]._id === action.payload._id) {
              if (action.payload.saved) {
                draft[i] = {
                  ...list[i],
                  save: !list[i].save
                    ? [{ userId: action.payload.userId }]
                    : [
                        ...(list[i].save as Save[]),
                        { userId: action.payload.userId },
                      ],
                };
              } else {
                draft[i] = {
                  ...list[i],
                  save: list[i].save!.filter(
                    (user) => user.userId !== action.payload.userId
                  ),
                };
              }
            }
          }
        });
      };

      const newCreatedList = changeSaveStatus(state.createdList);
      const newSaveList = changeSaveStatus(state.saveList);

      state.createdList = newCreatedList;

      if (!action.payload.isOwnList) {
        state.saveList = newSaveList;
      } else {
        if (action.payload.saved) {
          const savedRecipe = newCreatedList.filter(
            (recipe) => recipe._id == action.payload._id
          )[0];
          if (savedRecipe) {
            state.saveList = [...newSaveList, savedRecipe];
          }
        } else {
          state.saveList = newSaveList.filter(
            (recipe) => recipe._id !== action.payload._id
          );
        }
      }
    },
    resetList: (state) => {
      state.userId = "";
      state.createdList = [];
      state.saveList = [];
    },
  },
});

export const { setListData, updateSaveStatusUserList, resetList } =
  userPageSlice.actions;

export const selectUserPage = (state: RootState) => state.userPage;

export default userPageSlice.reducer;
