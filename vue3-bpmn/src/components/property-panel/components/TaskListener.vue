<template>
  <div style="width: 100%; " v-loading="loading">
    <el-table height="400px" stripe scrollbar-always-on :data="taskListenerList" @current-change="handleCurrentChange">
      <!-- prop -> tableData.event -->
      <el-table-column prop="event" label="事件" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="类型" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="value" label="值" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" width="120">
        <!-- https://element-plus.org/zh-CN/component/table.html#table-column-%E6%8F%92%E6%A7%BD -->
        <!-- 将 el-button 传给 el-table-column 的 header 插槽 -->
        <template #header>
          <el-button type="primary" size="small" @click="handleAddListener" :icon="Plus" />
        </template>
        <!-- scope 是用于接收子组件默认插槽位置返回的数据对象 -->
        <!-- el-button el-divider el-button 是传递给 el-table-column 的 default 插槽的内容 -->
        <!-- default 插槽的返回：https://element-plus.org/zh-CN/component/table.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%97%E6%A8%A1%E6%9D%BF -->
        <template #default="scope">
          <el-button type="primary" size="small" :icon="Edit" @click="handleEditListener(scope.row)"></el-button>
          <el-divider direction="vertical" />
          <el-button type="danger" size="small" :icon="Delete" @click="handleDeleteListener(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <MaskWindow v-model="editPanelVisible" teleport-to="#task-listener-panel" show-toolbar @cancel="handleCancel"
      @confirm="handleConfirm">
      <TaskListenerCreate @update-listener:event="handleListenerEventChange"
        @update-listener:type="handleListenerTypeChange" @update-listener:value="handleListenerValueChange"
        @listener-fields:add="handleFieldsAdd" ref="formRef" :listener="activeListener!" />
    </MaskWindow>
  </div>
</template>

<script lang="ts" setup>
import {onUnmounted, toRaw, ref, shallowRef, onMounted,  watch} from "vue"
import {ElTable, ElTableColumn, ElDivider, ElButton, ElMessage} from "element-plus"
import emitter from '@/event/mitt'
import TaskListenerCreate from '@/components/property-panel/components/TaskListenerCreate.vue'
import MaskWindow from "@/components/common/MaskWindow.vue"
import {Edit, Plus, Delete} from '@element-plus/icons-vue'
import {useBpmnModeler, useBpmnSelectedElem} from "@/config/app.hooks";
import BpmnUtil from "@/utils/bpmnUtil";
import type {ListenerFieldInjectError} from "@/types"
import type {Element} from "bpmn-js/lib/model/Types"
const bpmnModeler = useBpmnModeler()
const {bpmnSelectedElem,updateBpmnSelectedElem} = useBpmnSelectedElem()
// 用于编辑监听器的对象
const originalListener = shallowRef<TaskListener>()
const editPanelVisible = ref(false)

const bpmnUtil = new BpmnUtil(bpmnModeler)
const loading = ref(false)
const formRef = ref<InstanceType<typeof TaskListenerCreate>>()
const taskListenerList = ref<TaskListener[]>([])
const activeListener = ref<TaskListener>()

watch(() => bpmnSelectedElem.value, (selectedElem) => {
  console.log('selectedElem', selectedElem)
  taskListenerList.value = []
  const bo = selectedElem?.businessObject
  const extensionElements = bo.extensionElements
  const listeners = extensionElements?.get("values")
  if (listeners?.value && listeners.value.length > 0) {
    for (const listener of listeners.value) {
      if (!listener.$type.endsWith("TaskListener")) continue
      let type: ListenerValueType | undefined = undefined;
      let value = null;
      if (listener.value.class) {
        type = "class"
        value = listener.class
      }
      else if (listener.expression) {
        type = "expression"
        value = listener.expression
      } else if (listener.delegateExpression) {
        type = "delegateExpression"
        value = listener.delegateExpression
      } else continue

      taskListenerList.value.push({
        event: listener.event,
        type,
        value,
        fields: listener.fields
      })
    }
  }
})

function handleCurrentChange(val: TaskListener) {
  console.log('handleCurrentChange', val)
  activeListener.value = val
}
function handleEditListener(listener: TaskListener) {
  activeListener.value = listener
  originalListener.value = JSON.parse(JSON.stringify(toRaw(listener)))
  editPanelVisible.value = true
}

function handleAddListener() {
  activeListener.value = {
    event: 'create',
    type: 'class',
    value: '',
  }
  originalListener.value = undefined
  editPanelVisible.value = true
}
// function deleteFieldsFromActiveListener(fields: ListenerField[]) {
//   if (!activeListener.value)
//     return
//   const bo = bpmnSelectedElem.value?.businessObject;
//   for (const field of fields) {
//     bo.$model.remove(field)
//     activeListener.value.fields = activeListener.value.fields?.filter(it => it.name === field.name && it.value === field.value && it.type === field.type)
//   }
// }
function saveFieldsToActiveListener(fields: ListenerFieldConfig[]) {
  if (!activeListener.value)    return
  if(!fields) return
  console.log('fields', fields)
  // if (!activeListener.value?.fields) {
  //   activeListener.value.fields = []
  // }
  const bo = bpmnSelectedElem.value?.businessObject;
  // 每次全量新建
  activeListener.value.fields= []
  for (const field of fields) {
    // description.json 里的 Field 类型有 name、expression、stringValue、string 和htmlVar 几种属性
    // FieldInject 面板的类型里限制了只有 string 和 expression 两种
    // 再把 FieldInject 面板的 字段名 和 值 存储到 Field 里
    const bpmnField = bo.$model.create('flowable:Field', {
      name: field.name,
      [field.type]: field.value
    })
    activeListener.value.fields.push(bpmnField)
  }
}
function addActiveListenerToExtensionElementsOfSelectedElement() {
  if (!activeListener.value) {
    return
  }
  const bo = bpmnSelectedElem.value?.businessObject
  let extensionElements = bo.extensionElements
  if (!extensionElements) {
    extensionElements = bo.$model.create('bpmn:ExtensionElements', {values: []})
  }
  // bo.$model.create('bpmn:Documentation', { text: val })
  // bpmn.json 里 ExtensionElements 的 values 是一个 Element 数组
  const valuesOfExtensionElements: Array<Element> = extensionElements.values

  // 组合 TaskListener 对象
  const taskListener = bo.$model.create('flowable:TaskListener', {
    event: activeListener.value.event,
    [activeListener.value.type]: activeListener.value.value,
    fields: activeListener.value.fields
  })

  if (originalListener.value) {
    const originalObj = originalListener.value
    const index = valuesOfExtensionElements.findIndex(it => it.$type === 'flowable:TaskListener' && it.event === originalObj.event && it[originalObj.type] === originalObj.value)
    if (index === -1) {
      throw new Error("找不到源监听器对象")
    }
    valuesOfExtensionElements[index] = taskListener
  } else {
    valuesOfExtensionElements.push(taskListener)
    if (bpmnSelectedElem.value)
      bpmnUtil.updateProperty(bpmnSelectedElem.value, {
        extensionElements
      })
  }
  if (bpmnSelectedElem.value){
    bpmnUtil.updateModelingProperty(bpmnSelectedElem.value, extensionElements, {values: valuesOfExtensionElements})
    const element = bpmnUtil.getElementById(bpmnSelectedElem.value.id)
    updateBpmnSelectedElem(element)
  }

}
async function handleConfirm() {
  console.log('confirm')
  loading.value = true
  try {
    await formRef.value?.validate()
  } catch (e: unknown) {
    console.log('error', e)
    const errors = (e as {value: ListenerFieldInjectError[]}).value;
    const message = errors.map((it, idx) =>
      `<div style="margin-bottom: ${idx === errors.length - 1 ? '0' : '4'}px">${it.message}</div>`
    ).join('');
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      duration: 6000,
      message,
    });
  } finally {
    loading.value = false
  }

  if (!activeListener.value) {
    return
  }

  // 添加 field:
  const fields: Array<ListenerFieldConfig> = [];
  formRef.value?.gridApi()?.forEachNode((node) => {
    if (!node.data) {
      return
    }
    if (!fields.includes(node.data as ListenerFieldConfig)) {
      fields.push(node.data as ListenerFieldConfig)
    }
  })

  const type = activeListener.value.type
  if (type !== 'class') {
    activeListener.value.fields = []
  } else {
    const names = new Set(fields?.map(it => it.name) || [])
    if (fields && names.size !== fields.length) {
      ElMessage.error('字段名不允许重复')
      return
    }

    if (fields?.some(it => !it?.name?.trim())) {
      ElMessage.error('请先填写字段名')
      return
    }
    if (fields?.some(it => !it.value.trim())) {
      ElMessage.error('请先填写字段值')
      return
    }


  }
  if (type === 'delegateExpression') {
    ElMessage.error('禁止使用delegateExpression')
    return
  }
  if (bpmnSelectedElem.value?.type === 'bpmn:SequenceFlow') {
    activeListener.value.event = undefined
  }

  console.log('处理后的监听器结构', activeListener.value)
  // 更新面板
  if (!taskListenerList.value.includes(activeListener.value))
    taskListenerList.value.push(activeListener.value)
  // if (fields && fields.length) {
  saveFieldsToActiveListener(fields)
  // }
  // 更新 bpmn 模型
  addActiveListenerToExtensionElementsOfSelectedElement()
  // const bo = bpmnSelectedElem.value?.businessObject
  // let extensionElements = bo.extensionElements
  // if (!extensionElements) {
  //   extensionElements = bo.$model.create('bpmn:ExtensionElements', {values: []})
  // }
  // // bo.$model.create('bpmn:Documentation', { text: val })
  // // bpmn.json 里 ExtensionElements 的 values 是一个 Element 数组
  // const extensionElementsValues: Array<Element> = extensionElements.values


  // let fields = undefined
  // if (activeListener.value?.fields?.length) {
  //   fields = []
  //   for (const field of activeListener.value?.fields) {
  //     // description.json 里的 Field 类型有 name、expression、stringValue、string 和htmlVar 几种属性
  //     // FieldInject 面板的类型里限制了只有 string 和 expression 两种
  //     // 再把 FieldInject 面板的 字段名 和 值 存储到 Field 里
  //     const bpmnField = bo.$model.create('flowable:Field', {
  //       name: field.name,
  //       [field.type]: field.value
  //     })
  //     fields.push(bpmnField)
  //   }
  // }
  // // 组合 TaskListener 对象
  // const taskListener = bo.$model.create('flowable:TaskListener', {
  //   event: activeListener.value.event,
  //   [activeListener.value.type]: activeListener.value.value,
  //   fields,
  // })

  // if (originalListener.value) {
  //   const originalObj = originalListener.value
  //   const index = extensionElementsValues.findIndex(it => it.$type === 'flowable:TaskListener' && it.event === originalObj.event && it[originalObj.type] === originalObj.value)
  //   if (index === -1) {
  //     throw new Error("找不到源监听器对象")
  //   }
  //   extensionElementsValues[index] = taskListener
  // } else {
  //   extensionElementsValues.push(taskListener)
  //   if (bpmnSelectedElem.value)
  //     bpmnUtil.updateProperty(bpmnSelectedElem.value, {
  //       extensionElements
  //     })
  // }

  // if (bpmnSelectedElem.value)
  //   bpmnUtil.updateModelingProperty(bpmnSelectedElem.value, extensionElements, {values: extensionElementsValues})

  editPanelVisible.value = false
}

function handleCancel() {
  editPanelVisible.value = false
}

const handleListenerTypeChange = (val: string) => {
  activeListener.value!.type = val as ListenerValueType
}

const handleListenerValueChange = (val: string) => {
  activeListener.value!.value = val
}

const handleListenerEventChange = (val: string) => {
  activeListener.value!.event = val as TaskListenerEvent
}
function handleDeleteListener(listener: TaskListener) {
  console.log('handleDeleteListener', listener)
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    return
  }

  const bo = selectedElem.businessObject
  const extensionElements = bo.extensionElements
  const listeners: Element[] = extensionElements?.get("values")

  if (!listeners || listeners.length === 0) {
    return
  }

  const idx = listeners.filter(it => it.$type.endsWith('TaskListener')).findIndex(it => it.event === listener.event && it[listener.type] === listener.value)
  if (idx !== -1)
    listeners.splice(idx, 1)
  const i = taskListenerList.value.findIndex(it => it.event === listener.event && it.type === listener.type && it.value === listener.value)
  if (i !== -1)
    taskListenerList.value.splice(i, 1)

}

function handleFieldsAdd(listenerFields: ListenerFieldConfig[]) {
  console.log('handleFieldsAdd', listenerFields)
  saveFieldsToActiveListener(listenerFields)
}
function handleElementChanged() {
}

function handleSelectionChanged() {
  editPanelVisible.value = false
}

emitter.on('bpmnElementChanged', handleElementChanged)
onUnmounted(() => emitter.off('bpmnElementChanged', handleElementChanged))

emitter.on('bpmnSelectionChanged', handleSelectionChanged)
onUnmounted(() => emitter.off('bpmnSelectionChanged', handleSelectionChanged))

onMounted(() => {
  emitter.on('listenerFieldAdd', (payload: {row: ListenerField}) => {activeListener.value?.fields?.push(payload.row)})
})
onUnmounted(() => emitter.off('listenerFieldAdd'))

onMounted(() => {
  emitter.on('listenerFieldDelete', (payload: {idx: number}) => {
    activeListener.value?.fields?.splice(payload.idx, 1)
  })
})
</script>

<style scoped>
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
