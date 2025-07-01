import { Spin } from 'antd'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { isLoadingStore } from 'src/stores/loading.store'
import React from 'react'

const CenteredContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: auto;
`

const Content = styled.div`
  padding-left: 52px;
`

const Loading = () => {
  const loadingStore = useSelector(isLoadingStore)

  return (
    loadingStore && (
      <CenteredContainer>
        <Spin tip="Loading...">
          <Content />
        </Spin>
      </CenteredContainer>
    )
  )
}

export default Loading
