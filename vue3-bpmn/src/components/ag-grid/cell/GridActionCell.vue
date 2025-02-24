<template>
  <el-button v-for="action in params.actions" :key="action.id" v-bind="action.props"
    @click="ev => action.clickHandler?.(params, ev)">
    {{ action.text }}
  </el-button>
</template>

<script lang="ts" setup>
import type {MYANY} from "@/types/type";
import type {ICellRendererParams} from "ag-grid-community";
import {ElButton} from 'element-plus'

interface ActionItem {
  id: string
  props: Record<string, MYANY>
  text?: string
  clickHandler: (params: ICellRendererParams, event: MouseEvent) => void
}


interface CellActionParams extends ICellRendererParams {
  actions: ActionItem[]
}

interface Props {
  params: CellActionParams
}
defineProps<Props>()


</script>
