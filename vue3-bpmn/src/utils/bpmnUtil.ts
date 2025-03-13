import BpmnModeler from 'bpmn-js/lib/Modeler'
import { type ShallowRef, unref } from 'vue'
import Modeling from 'bpmn-js/lib/features/modeling/Modeling'
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory'
import type { MYANY } from '@/types/type'
// import type { Element } from 'diagram-js/lib/model'
import { type Element } from 'bpmn-js/lib/model/Types'
export default class BpmnUtil {
  private bpmnModeler: ShallowRef<BpmnModeler | undefined>

  constructor(bpmnModeler: ShallowRef<BpmnModeler | undefined>) {
    this.bpmnModeler = bpmnModeler
  }

  public isMultiInstanceUserTask(element: Element|null): boolean {
    if (!element) {
      console.log('element is null')
      return false
    }
    const bo = unref(element)?.businessObject
    return !!bo?.loopCharacteristics
  }

  public updateProperty(element: Element | null, properties: Record<string, MYANY>) {
    if (!element) {
      console.log('element is null')
      return
    }
    const modeling = unref(this.bpmnModeler)?.get<Modeling>('modeling')
    modeling?.updateProperties(unref(element), properties)
  }

  public updateModelingProperty(
    element: Element | null,
    attrInstance: MYANY,
    properties: Record<string, MYANY>,
  ) {
    if (!element) {
      console.log('element is null')
      return
    }
    const modeling = this.bpmnModeler.value?.get<Modeling>('modeling')
    modeling?.updateModdleProperties(unref(element), attrInstance, properties)
  }

  public getProcessKey(): string {
    const registry = unref(this.bpmnModeler)?.get<ElementRegistry>('elementRegistry')
    const root = registry?.find((it) => it.type === 'bpmn:Process')
    return root?.id || ''
  }

  public createElement(elementType: string, properties: Record<string, MYANY>, parent: Element) {
    const bpmnFactory = this.bpmnModeler.value!.get<BpmnFactory>('bpmnFactory')
    const element = bpmnFactory.create(elementType, properties)

    if (parent) {
      element.$parent = parent
    }

    return element
  }
}
