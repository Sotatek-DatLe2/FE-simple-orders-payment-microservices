export interface Product {
  productId: string
  name: string
  price: number
  category: string
  rating: number
  description: string
  colors: string[]
  imageUrl: string
}

export interface CartItem {
  productId: string
  quantity: number
}

export interface ShippingAddress {
  fullName: string
  address: string
  city: string
  state: string
  country: string
  email: string
}
