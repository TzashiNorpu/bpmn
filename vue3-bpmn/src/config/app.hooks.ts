import { inject } from 'vue'
import { bpmnModelerKey, bpmnSelectedElemKey } from '@/config/app.keys'

export function useBpmnSelectedElem() {
  return inject(bpmnSelectedElemKey)!
}

export function useBpmnModeler() {
  return inject(bpmnModelerKey)!
}
