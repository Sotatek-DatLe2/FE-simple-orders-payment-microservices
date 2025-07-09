export const STORAGE_KEYS = {
  PENDING_ORDERS: 'PENDING_ORDERS',
} as const

export const DEFAULT_FILTERS = {
  status: '',
  startDate: '',
  endDate: '',
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'DESC',
} 

// constants/index.ts
export const ITEMS_PER_PAGE_OPTIONS = [4, 8, 12];
export const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' }
] 
