import type { InjectionKey, ShallowRef, Ref } from 'vue'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import type { Element } from 'bpmn-js/lib/model/Types'
export const bpmnSelectedElemKey = Symbol('bpmnSelectedElem') as InjectionKey<
  ShallowRef<Element | null>
>

export const bpmnModelerKey = Symbol('bpmnModeler') as InjectionKey<
  ShallowRef<BpmnModeler | undefined>
>
export const propertyPanelOpenedKey = Symbol('propertyPanelOpenedKey') as InjectionKey<Ref<string>>
