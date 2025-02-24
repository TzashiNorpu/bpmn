<template>
  <div class="ag-cell-edit-wrapper">
        <!--
    el-input 组件配置说明：
    该组件实现了动态属性绑定和双向数据绑定功能

    组件属性说明：
    - v-bind="params?.componentProps"：动态绑定Element输入框组件属性
      params参数说明：
        componentProps: 包含Element Input组件所有可用props的对象（可选属性）
        使用可选链操作符避免params未定义时出错
    - v-model="text"：实现输入框的双向数据绑定
      text参数说明：
        用于存储输入框当前值的响应式变量
        数据变更会自动同步到父组件作用域

    注意事项：
    1. 需确保父组件传入的params对象包含有效的Element Input props配置
    2. text变量需要在父组件data/computed中正确定义
    3. 支持Element Plus Input组件所有原生属性和事件
    -->
    <el-input v-bind="params?.componentProps" v-model="text" />
  </div>
</template>

<script lang="ts" setup>
import {  onMounted, ref } from 'vue'
import { ElInput } from "element-plus";
import { type CellEditorParams } from "@/components/ag-grid/editor/index";

interface Props {
  params: CellEditorParams
}

const props = defineProps<Props>()

const text = ref('')

/**
 * 获取输入编辑器的当前文本值
 *
 * 该函数用于从响应式文本引用中获取当前值，并在控制台打印调试信息
 *
 * @returns {string} 返回当前输入的文本值
 */
function getValue() {
  // 打印调试日志并返回当前文本值
  console.log('input editor getValue', text.value)
  return text.value
}

/**
 * 判断是否在启动前取消操作
 *
 * 该函数通常用于编辑器组件中，用于在编辑启动前检查是否需要取消后续操作。
 * 当前实现固定返回false，表示默认不取消操作，并会在控制台输出调试信息。
 *
 * @returns {boolean} 返回false表示不取消操作
 */
function isCancelBeforeStart() {
  console.log('input editor isCancelBeforeStart')
  return false
}


/**
 * 判断是否在结束后取消操作
 *
 * 该函数用于处理输入编辑器场景下的取消逻辑判断。根据当前实现，函数始终返回 false，
 * 表示在操作结束后不取消之前的操作。开发时可添加具体业务逻辑判断条件。
 *
 * @returns {boolean} 返回布尔值，表示是否在结束后取消操作。当前固定返回 false
 */
function isCancelAfterEnd() {
  console.log('input editor isCancelAfterEnd')
  return false
}

/**
 * 向父组件暴露以下方法:
 *
 * @method getValue - 获取编辑器中的当前值。
 * @method isCancelBeforeStart - 确定编辑开始前是否应取消编辑。
 * @method isCancelAfterEnd - 确定编辑结束后是否应取消编辑。
 */
defineExpose({
  getValue,
  isCancelBeforeStart,
  isCancelAfterEnd,
})

onMounted(() => {
  text.value = props.params?.value
})
</script>
