// import { toast } from 'react-toastify'
// import React from 'react'
// import ToastMessage from 'src/components/toast'

// const toastQueue: Array<() => void> = []
// let isToastShowing = false

// export type TVariant = 'success' | 'error' | 'warn' | 'info'

// const processToastQueue = () => {
//   if (toastQueue.length > 0) {
//     const nextToast = toastQueue.shift()
//     if (nextToast) {
//       nextToast()
//     }

//     setTimeout(processToastQueue, 3000)
//   } else {
//     isToastShowing = false
//   }
// }

// const toastMessage = (message: string, variant: TVariant) => {
//   const toastFunction = () => {
//     toast(React.createElement(ToastMessage, { message, variant }), {
//       position: 'top-center',
//       autoClose: 3000,
//       hideProgressBar: true,
//       closeOnClick: false,
//       pauseOnHover: true,
//       closeButton: false,
//       theme: 'dark',
//       draggable: false,
//       onClose: () => {
//         setTimeout(processToastQueue, 3000)
//       },
//     })
//   }

//   toastQueue.push(toastFunction)

//   if (!isToastShowing) {
//     isToastShowing = true
//     processToastQueue()
//   }
// }

// export default toastMessage
