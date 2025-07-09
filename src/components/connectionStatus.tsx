import React from "react"

export const ConnectionStatus: React.FC<{ isConnected: boolean }> = ({ isConnected }) => (
  <div className="flex items-center gap-2">
    <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
    <span>{isConnected ? 'Online' : 'Offline'}</span>
  </div>
)

export const CreateOrderButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
    onClick={onClick}
  >
    + Create Order
  </button>
)