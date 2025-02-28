<template>
  <div class="ag-cell-edit-wrapper">
    <el-select v-bind="params?.componentProps" v-model="selectedValue" :popper-class="AG_EDITOR_SELECT">
      <el-option v-for="option in params?.options" :key="option[params?.valueField || 'value']"
        :label="option[params?.labelField || 'label']" :value="option[params?.valueField || 'value']"
        :disabled="option[params?.disabledField || 'disabled'] === (params?.disabledValue === undefined ? true : params?.disabledValue)" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {ElSelect, ElOption} from "element-plus";
import {AG_EDITOR_SELECT} from "@/components/ag-grid/editor";
import type {CellEditorParams} from "@/components/ag-grid/editor";
import type {MYANY} from '@/types/type';


interface SelectCellEditorParam extends CellEditorParams {
  options: MYANY[]
  labelField: string
  valueField: string
  disabledField: string
  disabledValue: string | number | boolean
}

interface Props {
  params: SelectCellEditorParam
}


const props = defineProps<Props>()

const selectedValue = ref(props.params.value)
onMounted(() => {
  selectedValue.value = props.params.value
})


function getValue() {
  return selectedValue.value
}

function isCancelBeforeStart() {
  return false
}

function isCancelAfterEnd() {
  return false
}

defineExpose({
  getValue,
  isCancelBeforeStart,
  isCancelAfterEnd,
})

</script>
