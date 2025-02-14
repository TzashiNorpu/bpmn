import type { InjectionKey, ShallowRef } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import type { Element as BpmnElement } from 'diagram-js/lib/model'

export const bpmnSelectedElemKey = Symbol('bpmnSelectedElem') as InjectionKey<
  ShallowRef<BpmnElement | null>
>

export const bpmnModelerKey = Symbol('bpmnModeler') as InjectionKey<
  ShallowRef<BpmnModeler | undefined>
>
