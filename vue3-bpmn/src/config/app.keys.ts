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
export const modelingFieldKey = Symbol("processModelFieldKey") as InjectionKey<ShallowRef<ModelingFieldDefView[]>>

export const modelingPageKey = Symbol("modelingPageKey") as InjectionKey<ShallowRef<ModelingPageView[]>>
export const workflowVerKey = Symbol("workflowVerKey") as InjectionKey<Ref<WorkflowTypeVerView | undefined>>
