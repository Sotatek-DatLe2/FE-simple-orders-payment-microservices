export const getColorByState = (state: string): string => {
  switch (state) {
    case 'delivered':
      return 'green'
    case 'cancelled':
      return 'red'
    case 'confirmed':
      return 'orange'
    default:
      return 'blue'
  }
}
