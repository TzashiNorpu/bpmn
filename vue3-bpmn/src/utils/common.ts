import { computed, type ComputedRef } from 'vue'
import { useWindowSize } from '@vueuse/core'

type Device = 'pc' | 'h5' | 'pad'

const { width, height } = useWindowSize()

export { width, height }

export function getDeviceType(): ComputedRef<Device> {
  return computed(() => {
    if (width.value < 425) {
      console.log('width device', width.value)
      return 'h5'
    }
    if (width.value < 768) {
      console.log('width device', width.value)
      return 'pad'
    } else {
      console.log('width device', width.value)
      return 'pc'
    }
  })
}
