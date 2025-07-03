import React from 'react'
import clsx from 'clsx'
import { CustomNotificationProps } from 'src/types'

const CustomNotification: React.FC<CustomNotificationProps> = ({ message, type }) => {
  return (
    <div
      className={clsx('fixed top-5 right-5 px-4 py-3 rounded shadow-lg border z-[9999]', {
        'bg-teal-50 text-green-700 border-teal-300': type === 'success',
        'bg-red-50 text-red-700 border-red-300': type === 'error',
      })}
    >
      {message}
    </div>
  )
}

export default CustomNotification
