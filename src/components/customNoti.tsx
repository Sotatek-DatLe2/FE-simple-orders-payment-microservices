import React from 'react'
import styled from 'styled-components'

interface NotificationWrapperProps {
  $type: 'success' | 'error'
}

const NotificationWrapper = styled.div<NotificationWrapperProps>`
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: ${(props) => (props.$type === 'success' ? '#e6fffb' : '#fff1f0')};
  color: ${(props) => (props.$type === 'success' ? '#237804' : '#cf1322')};
  border: 1px solid ${(props) => (props.$type === 'success' ? '#87e8de' : '#ffa39e')};
  padding: 12px 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 9999;
`

interface Props {
  message: string
  type: 'success' | 'error'
}
const CustomNotification: React.FC<Props> = ({ message, type }) => {
  return <NotificationWrapper $type={type}>{message}</NotificationWrapper>
}

export default CustomNotification
