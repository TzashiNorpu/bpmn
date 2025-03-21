<template>
  <el-form label-width="80px" label-position="right">
    <el-form-item label="节点类型">
      <el-input disabled v-model="elementType" />
    </el-form-item>
    <el-form-item label="节点标识">
      <el-input disabled v-model="elementId" />
    </el-form-item>
    <el-form-item label="节点名称">
      <el-input v-model="elementName" />
    </el-form-item>
    <el-form-item label="节点描述">
      <el-input style="align-self: flex-start" :rows="2" type="textarea" v-model="elementDescription" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import {ElInput, ElForm, ElFormItem} from "element-plus"
import BpmnUtil from "@/utils/bpmnUtil"
import {useBpmnModeler, useBpmnSelectedElem} from "@/config/app.hooks";


const {bpmnSelectedElem,updateBpmnSelectedElem} = useBpmnSelectedElem()
const bpmnModeler = useBpmnModeler()

const bpmnUtil = new BpmnUtil(bpmnModeler)

const elementType = computed(() => {
  if (!bpmnSelectedElem.value) {
    return ''
  }
  return bpmnSelectedElem.value?.type || ''
})


const elementId = computed(() => {
  if (!bpmnSelectedElem.value) {
    return ''
  }
  return bpmnSelectedElem.value?.id || ''
})

const elementName = ref('')
const elementDescription = ref('')
watch(elementName, (v) => {
  if (!bpmnSelectedElem.value) {
    return
  }
  bpmnUtil.updateProperty(bpmnSelectedElem.value, {
    name: v
  })
})
watch(elementDescription, (v) => {
  if (!bpmnSelectedElem.value) {
    return
  }
  const bo = bpmnSelectedElem.value?.businessObject
  const docs = bo.get("documentation")
  if (!docs || docs.length === 0) {
    const comment = bo.$model.create('bpmn:Documentation', {text: v});
    docs.push(comment)
  } else {
    docs[0].text = v
  }
})
watch(bpmnSelectedElem, selectedEle => {
  const bo = selectedEle?.businessObject
  elementName.value = bo?.name || ''
  const docs = bo?.get("documentation")
  elementDescription.value = docs?.[0]?.text || ''
})
</script>

<style scoped>
* {
  font-size: 14px;
}
</style>
