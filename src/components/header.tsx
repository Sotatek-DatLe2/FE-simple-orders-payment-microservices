import React from 'react'
import styled from 'styled-components'


const Header = styled.header`
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e2e8f0;
  width: 100%;
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 1.5rem;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`

const PageTitle = styled.h2`
  margin-left: 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  @media (min-width: 1024px) {
    margin-left: 0;
  }
`

const LogoutButton = styled.button`
  padding: 0.5rem;
  color: #a0aec0;
  border-radius: 0.375rem;
  &:hover {
    color: #4a5568;
  }
`

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void
}

const HeaderComp = ({ setSidebarOpen }: HeaderProps) => {
  return (
    <Header>
      <HeaderContent>
        <HeaderLeft>
          <PageTitle>Order Dashboard</PageTitle>
        </HeaderLeft>
        <div>
          <LogoutButton
            onClick={() => {
              //clear local storage
              localStorage.removeItem('accessToken')
              localStorage.removeItem('user')
              localStorage.removeItem('userId')
              localStorage.removeItem('role')
              localStorage.removeItem('patient_id')
              window.location.href = '/login'
            }}
          >
            Logout
          </LogoutButton>
        </div>
      </HeaderContent>
    </Header>
  )
}

export default HeaderComp
