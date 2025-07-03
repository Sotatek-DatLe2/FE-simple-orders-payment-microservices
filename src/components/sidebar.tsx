import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MenuOutlined, DashboardOutlined, DollarOutlined, TeamOutlined } from '@ant-design/icons'
import clsx from 'clsx'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SidebarComp: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()
  const userID = localStorage.getItem('userId')
  const sidebarItems = [
    { name: 'Dashboard', icon: DashboardOutlined, href: '/' },
    { name: 'Profile', icon: TeamOutlined, href: `/user/${userID}` },
    { name: 'Billing', icon: DollarOutlined, href: '/billing' },
  ]

  return (
    <div
      className={clsx(
        'hidden md:flex flex-col bg-white h-full shadow-md transition-all duration-300',
        sidebarOpen ? 'w-60' : 'w-16'
      )}
    >
      <div className="flex justify-center p-4">
        <button className="p-2 rounded hover:bg-gray-100 transition" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuOutlined style={{ fontSize: '20px' }} />
        </button>
      </div>

      <nav className="flex flex-col gap-1 mt-2">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                'flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-300 border-l-4',
                {
                  'text-blue-700 bg-blue-100 border-blue-700': isActive,
                  'text-gray-600 border-transparent': !isActive,
                  'hover:bg-gray-100 hover:text-gray-900': true,
                }
              )}
            >
              <IconComponent className="text-lg" />

              {/* Smooth transition for label */}
              <span
                className={clsx(
                  'ml-3 whitespace-nowrap overflow-hidden transition-all duration-300',
                  sidebarOpen ? 'opacity-100 scale-100 max-w-[200px]' : 'opacity-0 scale-95 max-w-0'
                )}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export default SidebarComp
