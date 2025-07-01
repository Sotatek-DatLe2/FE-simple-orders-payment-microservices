import React from 'react'
import styled from 'styled-components'
import { Link, useLocation } from 'react-router-dom'
import { MenuOutlined } from '@ant-design/icons'
import {
  BarChartOutlined,
  CloseOutlined,
  DashboardOutlined,
  ScheduleOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons'

const Sidebar = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  width: 16rem;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: ${(props) => (props.open ? '16rem' : '6rem')};
  transition: width 300ms ease-in-out;

  @media (min-width: 1024px) {
    transform: translateX(0);
    position: static;
  }
`

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`

const SidebarTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
`

const Nav = styled.nav`
  margin-top: 2rem;
`

const NavItem = styled(Link)<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  margin: 0 1rem 0.5rem;
  color: ${(props) => (props.active ? '#2b6cb0' : '#4a5568')};
  background-color: ${(props) => (props.active ? '#ebf8ff' : 'transparent')};
  border-right: ${(props) => (props.active ? '2px solid #2b6cb0' : 'none')};
  transition: all 0.2s;
  text-decoration: none;

  &:hover {
    color: #1a202c;
    background-color: #f7fafc;
  }
`

const MenuButton = styled.button`
  padding: 0.5rem;
  color: red;
  border-radius: 0.375rem;
  &:hover {
    color: #4a5568;
  }
  @media (min-width: 1800px) {
    display: none;
  }
`

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
    { name: 'Billing ', icon: DollarOutlined, href: '/billing' },
  ]

  return (
    <Sidebar open={sidebarOpen}>
      <SidebarHeader>
        <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          <MenuOutlined style={{ width: '1.5rem', height: '1.5rem' }} />
        </MenuButton>
      </SidebarHeader>
      <Nav>
        <div>
          {sidebarItems.map((item) => {
            const IconComponent = item.icon
            // Set active if the current pathname matches the item's href
            const isActive = location.pathname === item.href
            return (
              <NavItem key={item.name} to={item.href} active={isActive}>
                <IconComponent style={{ width: '1.25rem', height: '1.25rem' }} />
                {sidebarOpen && <span style={{ marginLeft: '0.5rem' }}>{item.name}</span>}
              </NavItem>
            )
          })}
        </div>
      </Nav>
    </Sidebar>
  )
}

export default SidebarComp
