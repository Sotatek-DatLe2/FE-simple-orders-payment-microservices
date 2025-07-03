import { Spin } from 'antd'
import { useSelector } from 'react-redux'
import { isLoadingStore } from 'src/stores/loading.store'
import React from 'react'

const Loading = () => {
  const loadingStore = useSelector(isLoadingStore)
  if (!loadingStore) return <></>
  return (
    loadingStore && (
      <div className="fixed top-0 left-0 w-full h-full bg-white z-[9999] flex justify-center items-center">
        <Spin tip="Loading...">
          <div className="pl-[52px]" />
        </Spin>
      </div>
    )
  )
}

export default Loading
