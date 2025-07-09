// components/ProductFilters/ProductFilters.tsx
import React from 'react';
import { ITEMS_PER_PAGE_OPTIONS, SORT_OPTIONS } from 'src/const/constants';

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  sortBy: string;
  itemsPerPage: number;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: 'name' | 'price' | 'rating') => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  selectedCategory,
  sortBy,
  itemsPerPage,
  onCategoryChange,
  onSortChange,
  onItemsPerPageChange
}) => {
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter & Sort</h2>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'name' | 'price' | 'rating')}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
