import React from "react"

export const Pagination: React.FC<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}> = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-end items-center gap-2 my-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      disabled={currentPage === 1}
    >
      Previous
    </button>
    
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
      <span
        key={pageNum}
        onClick={() => onPageChange(pageNum)}
        className={`px-3 py-2 rounded border cursor-pointer transition-colors ${
          pageNum === currentPage 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
        }`}
      >
        {pageNum}
      </span>
    ))}
    
    <button
      onClick={() => onPageChange(currentPage + 1)}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      disabled={currentPage === totalPages}
    >
      Next
    </button>
  </div>
)