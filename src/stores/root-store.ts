import { configureStore } from '@reduxjs/toolkit'
import loadingStore from 'src/stores/loading.store'
import { TLoadingStore } from 'src/stores/loading.store'

export type TRootStore = {
  loadingStore: TLoadingStore
}

const stores = configureStore({
  reducer: {
    loadingStore,
  },
})

export default stores
