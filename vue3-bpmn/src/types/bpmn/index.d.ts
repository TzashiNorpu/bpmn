declare type ExecutionListenerFieldType = 'string' | 'expression'

declare interface ListenerField {
  name: string
  type: ExecutionListenerFieldType
  value: string
}

declare type ExecutionListenerEvent = 'start' | 'end' | undefined
declare type ListenerValueType = 'class' | 'expression' | 'delegateExpression'

interface ListenerObject {
  type: ListenerValueType
  value: string
  fields?: ListenerField[]
}
declare interface ExecutionListenerObject extends ListenerObject {
  event: ExecutionListenerEvent
}

declare type TaskListenerEvent = 'create' | 'assignment' | 'complete' | 'delete'

declare interface TaskListenerObject extends ListenerObject {
  event?: TaskListenerEvent
}

declare interface SelectionChangedEvent {
  newSelection: import('bpmn-js/lib/model/Types').Element[]
}

declare interface ElementChangedEvent {
  element: import('bpmn-js/lib/model/Types').Element
}
