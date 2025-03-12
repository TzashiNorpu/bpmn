import mitt from 'mitt'

export type SelectMultipleChangedEvent = {
  prop: string
  multiple: boolean
}

export type FormDesignerFieldDeleteEvent = {
  field: string
}

export type BpmnElementChanged = {
  element: import('bpmn-js/lib/model/Types').Element
}

export type BpmnSelectionChanged = {
  element: import('bpmn-js/lib/model/Types').Element
}
export type ListenerFieldAddEvent = {
  row: ListenerField
}
export type ListenerFieldDeleteEvent = {
  idx: number
}
export type Events = {
  selectMultipleChanged: SelectMultipleChangedEvent
  removeFieldInDesigner: FormDesignerFieldDeleteEvent
  bpmnElementChanged: BpmnElementChanged
  bpmnSelectionChanged: BpmnSelectionChanged
  listenerFieldAdd: ListenerFieldAddEvent
  listenerFieldDelete: ListenerFieldDeleteEvent
}

export default mitt<Events>()
