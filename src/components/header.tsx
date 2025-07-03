import React from 'react'

const HeaderComp = () => {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 w-full">
      <div className="flex align-items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <div className="md:ml-0 ml-2 text-md text-black font-semibold">Order Dashboard</div>
        </div>
        <div>
          <button
            className="sm:p-2 hover:bg-custom-gray-1 hover:text-white cursor-pointer rounded-lg transition-all duration-200"
            onClick={() => {
              localStorage.removeItem('accessToken')
              localStorage.removeItem('user')
              localStorage.removeItem('userId')
              localStorage.removeItem('role')
              localStorage.removeItem('patient_id')
              window.location.href = '/login'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default HeaderComp
