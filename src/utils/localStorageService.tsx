import { Dispatch } from 'redux'
import { ListOrders, NewOrder } from 'src/types'
import ordersService from 'src/service/Home'
import { AxiosResponse } from 'axios'
import { showLoading, hideLoading } from 'src/stores/loading.store'

interface PendingAction {
  type: 'createOrder'
  data: NewOrder
}

interface SyncState {
  status: 'idle' | 'syncing' | 'synced' | 'error'
  error?: string
}

interface SyncOptions {
  orders: ListOrders[]
  setOrders: React.Dispatch<React.SetStateAction<ListOrders[]>>
  setSyncStatus: React.Dispatch<React.SetStateAction<SyncState['status']>>
  dispatch: Dispatch
  page: number
  filters: {
    status?: string
    startDate?: string
    endDate?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }
}

const localStorageService = {
  getOrders: () => JSON.parse(localStorage.getItem('orders') || '[]') as ListOrders[],
  saveOrders: (orders: ListOrders[]) => localStorage.setItem('orders', JSON.stringify(orders)),
  getPendingActions: () => JSON.parse(localStorage.getItem('pendingActions') || '[]') as PendingAction[],
  savePendingActions: (actions: PendingAction[]) => localStorage.setItem('pendingActions', JSON.stringify(actions)),
  getLastSync: () => parseInt(localStorage.getItem('lastSync') || '0'),
  saveLastSync: (timestamp: number) => localStorage.setItem('lastSync', timestamp.toString()),
}

const syncWithServer = async ({
  orders,
  setOrders,
  setSyncStatus,
  dispatch,
  page,
  filters,
}: SyncOptions): Promise<void> => {
  setSyncStatus('syncing')
  dispatch(showLoading())

  try {
    const pendingActions = localStorageService.getPendingActions()
    const lastSync = localStorageService.getLastSync()

    // Process pending actions (e.g., create orders)
    for (const action of pendingActions) {
      if (action.type === 'createOrder') {
        const { localId, ...orderData } = action.data // Exclude localId from server request
        const response: AxiosResponse<{ order: ListOrders }> = await ordersService.createOrder(orderData)
        if (response.data?.order) {
          const updatedOrders = orders.map((order) =>
            order.localId === localId ? { ...order, orderId: response.data.order.orderId, localId: undefined } : order
          )
          localStorageService.saveOrders(updatedOrders)
          setOrders(updatedOrders)
        }
      }
    }

    // Clear pending actions after processing
    localStorageService.savePendingActions([])

    // Fetch new or updated orders from server
    const response: AxiosResponse<{
      data: ListOrders[]
      total: number
      page: number
      totalPages: number
    }> = await ordersService.getOrders({
      page,
      status: filters.status || '',
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      sortBy: filters.sortBy || 'createdAt',
      sortOrder: filters.sortOrder || 'DESC',
    })

    const serverOrders = Array.isArray(response.data.data) ? response.data.data : []

    // Merge server and local orders with timestamp-based conflict resolution
    const mergedOrders = [...orders]
    serverOrders.forEach((serverOrder) => {
      const localIndex = mergedOrders.findIndex(
        (local) => (local.orderId && local.orderId === serverOrder.orderId) || local.localId === serverOrder.localId
      )
      if (localIndex === -1) {
        mergedOrders.push(serverOrder)
      } else if (serverOrder.updatedAt > mergedOrders[localIndex].updatedAt) {
        mergedOrders[localIndex] = { ...serverOrder, localId: mergedOrders[localIndex].localId }
      }
    })

    // Update local storage and state
    localStorageService.saveOrders(mergedOrders)
    setOrders(mergedOrders)
    localStorageService.saveLastSync(Date.now())
    setSyncStatus('synced')
  } catch (error) {
    console.error('Synchronization failed:', error)
    setSyncStatus('error')
    throw new Error(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    dispatch(hideLoading())
  }
}

export { localStorageService, syncWithServer }
