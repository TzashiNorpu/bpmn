<template>
  <div style="width: 100%; " v-loading="loading">
    <el-table height="400px" stripe scrollbar-always-on :data="tableData">
      <!-- prop -> tableData.event -->
      <el-table-column prop="event" label="事件" width="80" show-overflow-tooltip></el-table-column>
      <el-table-column prop="type" label="类型" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="value" label="值" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" width="120">
        <!-- https://element-plus.org/zh-CN/component/table.html#table-column-%E6%8F%92%E6%A7%BD -->
        <!-- 将 el-button 传给 el-table-column 的 header 插槽 -->
        <template #header>
          <el-button link text type="danger" @click="handleAddListener" :icon="Plus" />
        </template>
        <!-- scope 是用于接收子组件默认插槽位置返回的数据对象 -->
        <!-- el-button el-divider el-button 是传递给 el-table-column 的 default 插槽的内容 -->
        <!-- default 插槽的返回：https://element-plus.org/zh-CN/component/table.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%97%E6%A8%A1%E6%9D%BF -->
        <template #default="scope">
          <el-button link @click="handleEditListener(scope.row)">编辑</el-button>
          <el-divider direction="vertical" />
          <el-button link type="danger" @click="handleDeleteListener(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <mask-window v-model="editPanelVisible" teleport-to="#task-listener-panel" show-toolbar @cancel="handleCancel"
      @confirm="handleConfirm">
      <TaskListenerCreate ref="formRef" :listener="listenerObject!" />
    </mask-window> -->
    <el-dialog v-model="editPanelVisible" :modal="false">
      <TaskListenerCreate ref="formRef" :listener="listenerObject!" />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">Cancel</el-button>
          <el-button type="primary" @click="handleConfirm">Confirm</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {computed, onUnmounted, toRaw, ref, shallowRef, onMounted} from "vue"
import {ElTable, ElTableColumn, ElDivider, ElButton, ElMessage} from "element-plus"
import emitter from '@/event/mitt'
import TaskListenerCreate from './TaskListenerCreate.vue'
import {Plus} from '@element-plus/icons-vue'
import {useBpmnModeler, useBpmnSelectedElem} from "@/config/app.hooks";
import BpmnUtil from "@/utils/bpmnUtil";
const bpmnModeler = useBpmnModeler()
const bpmnSelectedElem = useBpmnSelectedElem()

const loading = ref(false)
const formRef = ref<InstanceType<typeof TaskListenerCreate>>()

const tableKey = ref(1)
const tableData = computed<TaskListenerObject[]>(() => {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    return []
  }

  const bo = selectedElem.businessObject
  const extensionElements = bo.extensionElements
  const listeners = extensionElements?.get("values")

  if (!listeners || listeners.length === 0) {
    return []
  }
  const data: TaskListenerObject[] = []
  if (listeners && listeners.length > 0) {
    for (const listener of listeners) {
      if (!listener.$type.endsWith("TaskListener")) {
        continue
      }
      let type: ListenerValueType | undefined = undefined;
      let val = null;
      if (listener.class) {
        type = "class"
        val = listener.class
      }
      else if (listener.expression) {
        type = "expression"
        val = listener.expression
      } else if (listener.delegateExpression) {
        type = "delegateExpression"
        val = listener.delegateExpression
      } else {
        continue
      }
      const fields: ListenerField[] = []
      if (listener.fields?.length) {
        for (const field of listener.fields) {
          let fieldType: ExecutionListenerFieldType | undefined = undefined
          let fieldVal = null
          if (field.string) {
            fieldType = 'string'
            fieldVal = field.string
          } else if (field.expression) {
            fieldType = 'expression'
            fieldVal = field.expression
          } else {
            continue
          }
          fields.push({
            name: field.name,
            type: fieldType,
            value: fieldVal
          })
        }
      }
      data.push({
        event: listener.event,
        type,
        value: val,
        fields,
      })
    }
  }
  console.log('task listeners', data)
  return data
})

const originalListenerObject = shallowRef<TaskListenerObject>()
const listenerObject = ref<TaskListenerObject>()
const editPanelVisible = ref(false)
function handleEditListener(listener: TaskListenerObject) {
  listenerObject.value = listener
  originalListenerObject.value = JSON.parse(JSON.stringify(toRaw(listener)))
  editPanelVisible.value = true
}

function handleAddListener() {
  listenerObject.value = {
    event: 'create',
    type: 'class',
    value: '',
  }
  originalListenerObject.value = undefined
  editPanelVisible.value = true
}

const bpmnUtil = new BpmnUtil(bpmnModeler)
async function handleConfirm() {
  loading.value = true
  try {
    await formRef.value?.validate()
  } catch (e) {
    // const message = (e.value)?.map((it, idx) => `<div style="margin-bottom: ${idx === e.value.length - 1 ? '0' : '4'}px">${it.message}</div>`).join('')
    ElMessage.error({
      dangerouslyUseHTMLString: true,
      duration: 6000,
      // message,
    })
    console.error(e)
    return
  } finally {
    loading.value = false
  }

  if (!listenerObject.value) {
    return
  }

  const type = listenerObject.value.type
  if (type !== 'class') {
    listenerObject.value.fields = []
  } else {
    const names = new Set(listenerObject.value.fields?.map(it => it.name) || [])
    if (listenerObject.value.fields && names.size !== listenerObject.value.fields.length) {
      ElMessage.error('字段名不允许重复')
      return
    }

    if (listenerObject.value.fields?.some(it => !it?.name?.trim())) {
      ElMessage.error('请先填写字段名')
      return
    }

    if (listenerObject.value.fields?.some(it => !it?.value?.trim())) {
      ElMessage.error('请先填写字段值')
      return
    }


  }
  if (type === 'delegateExpression') {
    ElMessage.error('禁止使用delegateExpression')
    return
  }
  if (bpmnSelectedElem.value?.type === 'bpmn:SequenceFlow') {
    listenerObject.value.event = undefined
  }

  console.log('处理后的监听器结构', listenerObject.value)

  console.log('tableData', tableData.value)
  const bo = bpmnSelectedElem.value?.businessObject
  let extensionElements = bo.extensionElements
  if (!extensionElements) {
    extensionElements = bo.$model.create('bpmn:ExtensionElements', {values: []})
  }
  // bo.$model.create('bpmn:Documentation', { text: val })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values: Array<any> = extensionElements.values


  let fields = undefined
  if (listenerObject.value?.fields?.length) {
    fields = []
    for (const field of listenerObject.value?.fields) {
      const bpmnField = bo.$model.create('flowable:Field', {
        name: field.name,
        [field.type]: field.value
      })
      fields.push(bpmnField)
    }
  }

  const executionListener = bo.$model.create('flowable:TaskListener', {
    event: listenerObject.value.event,
    [listenerObject.value.type]: listenerObject.value.value,
    fields,
  })

  if (originalListenerObject.value) {
    const originalObj = originalListenerObject.value
    const index = values.findIndex(it => it.$type === 'flowable:TaskListener' && it.event === originalObj.event && it[originalObj.type] === originalObj.value)
    if (index === -1) {
      throw new Error("找不到源监听器对象")
    }
    values[index] = executionListener
  } else {
    values.push(executionListener)
    if (bpmnSelectedElem.value)
      bpmnUtil.updateProperty(bpmnSelectedElem.value, {
        extensionElements
      })
  }



  if (bpmnSelectedElem.value)
    bpmnUtil.updateModelingProperty(bpmnSelectedElem.value, extensionElements, {values})

  editPanelVisible.value = false
}

function handleCancel() {
  tableKey.value++
  editPanelVisible.value = false
}

function handleDeleteListener(listener: TaskListenerObject) {
  const selectedElem = toRaw(bpmnSelectedElem.value)
  if (!selectedElem) {
    return
  }

  const bo = selectedElem.businessObject
  const extensionElements = bo.extensionElements
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listeners: any[] = extensionElements?.get("values")

  if (!listeners || listeners.length === 0) {
    return
  }

  const idx = listeners.filter(it => it.$type.endsWith('TaskListener')).findIndex(it => it.event === listener.event && it[listener.type] === listener.value)
  if (idx !== -1) {
    listeners.splice(idx, 1)
    tableKey.value++
  }


}

function handleElementChanged() {
  tableKey.value++
}

function handleSelectionChanged() {
  editPanelVisible.value = false
}

emitter.on('bpmnElementChanged', handleElementChanged)
onUnmounted(() => emitter.off('bpmnElementChanged', handleElementChanged))

emitter.on('bpmnSelectionChanged', handleSelectionChanged)
onUnmounted(() => emitter.off('bpmnSelectionChanged', handleSelectionChanged))

onMounted(() => {
  emitter.on('listenerFieldAdd', (payload: {row: ListenerField}) => {listenerObject.value?.fields?.push(payload.row)})
})
onUnmounted(() => emitter.off('listenerFieldAdd'))

onMounted(() => {
  emitter.on('listenerFieldDelete', (payload: {idx: number}) => {
    listenerObject.value?.fields?.splice(payload.idx, 1)
  })
})
</script>

<style scoped>
:deep(.el-button + .el-button) {
  margin-left: 0;
}
</style>
