import React from 'react'
import { MOCK_PRODUCTS } from '../../utils/dummy'
import { useCart } from 'src/hooks/useCart'
import { useProductFilters } from 'src/hooks/useProductFilters'
import { Header } from 'src/components/productList/header'
import { HeroSection } from 'src/components/productList/HeroSection/HeroSection'
import { ProductFilters } from 'src/components/productList/ProductFilters/ProductFilters'
import { ProductGrid } from 'src/components/productList/ProductGrid'
import { Pagination } from 'src/components/productList/Pagination'
import { CartSummary } from 'src/components/productList/cartSummary'

export const ProductStore: React.FC = () => {
  const cart = useCart()
  const filters = useProductFilters(MOCK_PRODUCTS)

  const handleCategoryChange = (category: string) => {
    filters.setSelectedCategory(category)
    filters.resetToFirstPage()
  }

  const handleSortChange = (sortBy: 'name' | 'price' | 'rating') => {
    filters.setSortBy(sortBy)
    filters.resetToFirstPage()
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    filters.setItemsPerPage(itemsPerPage)
    filters.resetToFirstPage()
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Products</h2>
          <p className="text-gray-600">
            Discover our curated collection of {filters.filteredAndSortedProducts.length} premium products
          </p>
        </div>

        <ProductFilters
          categories={filters.categories}
          selectedCategory={filters.selectedCategory}
          sortBy={filters.sortBy}
          itemsPerPage={filters.itemsPerPage}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />

        <ProductGrid
          products={filters.paginatedProducts}
          onAddToCart={cart.addToCart}
          getCartQuantity={cart.getCartQuantity}
        />

        <Pagination
          currentPage={filters.currentPage}
          totalPages={filters.totalPages}
          onPageChange={filters.setCurrentPage}
        />
      </main>
    </div>
  )
}

export default ProductStore
