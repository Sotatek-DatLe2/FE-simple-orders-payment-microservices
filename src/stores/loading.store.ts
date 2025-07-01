import { createSlice } from "@reduxjs/toolkit"
import { TRootStore } from "src/stores/root-store"

export type TLoadingStore = {
  isLoading: boolean
}

const initialState: TLoadingStore = {
  isLoading: false,
}

const loadingStore = createSlice({
  name: "loadingStore",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.isLoading = true
    },

    hideLoading: (state) => {
      state.isLoading = false
    },
  },
})

export const { showLoading, hideLoading } = loadingStore.actions

export const isLoadingStore = (state: TRootStore) =>
  state.loadingStore.isLoading

export default loadingStore.reducer
