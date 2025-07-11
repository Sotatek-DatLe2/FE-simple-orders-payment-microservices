import { useState, useMemo } from 'react';
import { Product } from '../types/product';

export const useProductFilters = (products: Product[]) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const categories = useMemo(() => 
    ['All', ...new Set(products.map((p) => p.category))], 
    [products]
  );

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) => 
        selectedCategory === 'All' || product.category === selectedCategory
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'price':
            return a.price - b.price;
          case 'rating':
            return b.rating - a.rating;
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [products, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  
  const paginatedProducts = useMemo(() => {
    return filteredAndSortedProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const resetToFirstPage = () => setCurrentPage(1);

  return {
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    itemsPerPage,
    setItemsPerPage,
    currentPage,
    setCurrentPage,
    categories,
    filteredAndSortedProducts,
    paginatedProducts,
    totalPages,
    resetToFirstPage
  };
};