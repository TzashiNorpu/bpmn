<template>
  <el-form label-width="80px">
    <el-form-item label="表达式" v-if="lineType === 'gateway'">
      <el-input v-model="expression" clearable />
    </el-form-item>
    <el-form-item label="序号" v-if="lineType === 'user'">
      <el-input-number controls-position="right" v-model="orderNo" :min="1" />
    </el-form-item>
    <el-form-item label="流转规则" v-if="completionRule">
      <el-radio-group v-model="completionRule">
        <el-radio-button value="dynamic">动态</el-radio-button>
        <el-radio-button value="any">或签</el-radio-button>
        <el-radio-button value="all">全签</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="表达式" v-if="completionRule === 'dynamic'">
      <el-input v-model="completionExpression" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
// TODO: 设置 连线类型：默认流转 条件流程 无
import {onUnmounted, computed, toRaw, ref} from "vue"
import {ElForm, ElFormItem, ElInput, ElInputNumber, ElRadioGroup, ElRadioButton} from "element-plus"
import emitter, {type BpmnElementChanged} from "@/event/mitt";
import BpmnUtil from "@/utils/bpmnUtil";
import {useBpmnModeler, useBpmnSelectedElem} from "@/config/app.hooks";
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import type {Connection} from "bpmn-js/lib/model/Types";
import BpmnFactory from "bpmn-js/lib/features/modeling/BpmnFactory";

const bpmnModeler = useBpmnModeler()
const bpmnSelectedElem = useBpmnSelectedElem()


const bpmnUtil = new BpmnUtil(bpmnModeler)

const expressionKey = ref(1)
const expression = computed({
  get() {
    // const depKey = expressionKey.value
    return bpmnSelectedElem.value?.businessObject?.conditionExpression?.body || ''
  },
  set(v) {
    expressionKey.value++
    if (bpmnSelectedElem.value?.businessObject?.conditionExpression) {
      bpmnSelectedElem.value.businessObject.conditionExpression.body = v
    } else {
      const bpmnFactory = bpmnModeler.value?.get<BpmnFactory>("bpmnFactory")
      const conditionExpression = bpmnFactory?.create('bpmn:FormalExpression')
      conditionExpression.body = v
      if (bpmnSelectedElem.value) {
        bpmnUtil.updateProperty(bpmnSelectedElem.value, {conditionExpression})
      }
      // bpmnUtil.updateProperty(bpmnSelectedElem, {conditionExpression})
    }
    // expression.effect?.scheduler?.()
  }
})

const orderNoKey = ref(1)
const orderNo = computed({
  get() {
    // const depKey = orderNoKey.value
    return parseInt(bpmnSelectedElem.value?.businessObject?.order || '0') || 0
  },
  set(order) {
    orderNoKey.value++
    if (bpmnSelectedElem.value) {
      bpmnUtil.updateProperty(bpmnSelectedElem.value, {order})
    }
    // bpmnUtil.updateProperty(bpmnSelectedElem, {order})
  }
})

// const lineTypeKey = ref(1)
const lineType = computed(() => {
  if (bpmnSelectedElem.value?.type !== 'bpmn:SequenceFlow') {
    return null
  }
  const source = bpmnSelectedElem.value?.source
  if (source?.type === 'bpmn:UserTask') {
    return 'user'
  } else if (source?.type === 'bpmn:ExclusiveGateway') {
    return 'gateway'
  }
  return null
})

const completionRuleKey = ref(1)
const completionRule = computed({
  get() {
    // const depKey = completionRuleKey.value
    const elem = toRaw(bpmnSelectedElem.value)
    if (!elem) {
      return null
    }
    return elem.businessObject.completionRule
  },
  set(v) {
    if (bpmnSelectedElem.value) {
      bpmnUtil.updateProperty(bpmnSelectedElem.value, {
        completionRule: v
      })
    }
    // bpmnUtil.updateProperty(bpmnSelectedElem, {
    //   completionRule: v
    // })
    completionRuleKey.value++
  }
})

const completionExpressionKey = ref(1)
const completionExpression = computed({
  get() {
    // const depKey = completionExpressionKey.value
    const elem = toRaw(bpmnSelectedElem.value)
    if (!elem) {
      return null
    }
    return elem.businessObject.completionExpression
  },
  set(v) {
    if (bpmnSelectedElem.value) {
      bpmnUtil.updateProperty(bpmnSelectedElem.value, {
        completionExpression: v
      })
    }
    // bpmnUtil.updateProperty(bpmnSelectedElem, {
    //   completionExpression: v
    // })
    completionExpressionKey.value++
  }
})

function refreshState(e: BpmnElementChanged) {
  if (e.element.type === 'label') {
    let connection = e.element.labelTarget
    if (!connection) {
      // label被清空 删除条件
      const registry = bpmnModeler.value?.get<ElementRegistry>("elementRegistry")
      const flowId = e.element.businessObject.id
      connection = registry?.get(flowId) as Connection
      if (!connection) {
        // delete flow
        return;
      }

      const expression = connection.businessObject.conditionExpression
      const resetBody = '${outcome == ""}'
      if (expression.body !== resetBody) {
        expression.body = resetBody
        bpmnUtil.updateProperty(connection, {conditionExpression: expression})
        console.log('label cleared, reset condition now')
      }

      return

    }
  }

  // 修改线条类型
  if (e.element.type === 'bpmn:SequenceFlow') {
    const connection = e.element as Connection
    // 用户任务出口流转线
    if (e.element.businessObject.$type === 'bpmn:SequenceFlow' && connection.source?.type === 'bpmn:UserTask') {
      // 条件流且label存在 自动设置 expression
      if (connection.businessObject.conditionExpression && connection.businessObject.name) {
        const body = '${outcome == "' + connection.businessObject.name + '"}'
        if (body === connection.businessObject.conditionExpression.body) {
          return
        }
        const bpmnFactory = bpmnModeler.value?.get<BpmnFactory>("bpmnFactory")
        const conditionExpression = bpmnFactory?.create('bpmn:FormalExpression')
        conditionExpression.body = '${outcome == "' + connection.businessObject.name + '"}'
        bpmnUtil.updateProperty(connection, {conditionExpression})
        console.log('auto set outcome expression', connection)
      }
    }

  }
}

emitter.on('bpmnElementChanged', refreshState)
onUnmounted(() => emitter.off('bpmnElementChanged', refreshState))


</script>

<style scoped>
* {
  font-size: 14px;
}
</style>
