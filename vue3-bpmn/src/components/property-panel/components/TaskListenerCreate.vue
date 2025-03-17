<template>
  <el-scrollbar height="100%" always>
    <el-form ref="formRef" :model="props.listener" label-width="100px" style="margin-top: 6px">
      <el-form-item prop="event" label="事件" required>
        <el-radio-group v-model="event">
          <el-radio-button value="assignment">指派</el-radio-button>
          <el-radio-button value="create">创建</el-radio-button>
          <el-radio-button value="complete">完成</el-radio-button>
          <el-radio-button value="delete">删除</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="type" label="类型" required>
        <el-radio-group v-model="type">
          <el-radio-button value="class">Java类</el-radio-button>
          <el-radio-button value="expression">表达式</el-radio-button>
          <el-radio-button value="delegateExpression" disabled>委托表达式</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="value" label="值" required>
        <el-input v-model="value" />
      </el-form-item>
      <div v-if="listener.type === 'class'" style="width: 100%; height: 200px ;margin-top: 10px">
        <ListenerFieldInject ref="fieldRef" v-bind="$props"
           />
      </div>
    </el-form>
  </el-scrollbar>

</template>

<script lang="ts" setup>
import {ElScrollbar, ElForm, ElFormItem, ElRadioGroup, ElRadioButton, ElInput} from 'element-plus'
import {computed, ref} from "vue";
import ListenerFieldInject from "@/components/property-panel/components/ListenerFieldInject.vue";
interface Props {
  listener: TaskListener
}

const props = defineProps<Props>()
// 这两个 ref 用于暴露 validate 方法
const formRef = ref<InstanceType<typeof ElForm>>()
const fieldRef = ref<InstanceType<typeof ListenerFieldInject>>()
const emit = defineEmits(['updateListener:event', 'updateListener:type', 'updateListener:value']);

const event = computed({
  get() {
    return props.listener.event;
  },
  set(value) {
    emit('updateListener:event', value);
  }
});
const type = computed({
  get() {
    return props.listener.type;
  },
  set(value) {
    emit('updateListener:type', value);
  }
});
const value = computed({
  get() {
    return props.listener.value;
  },
  set(value) {
    emit('updateListener:value', value);
  }
});


async function validate() {
  await fieldRef.value?.validate()
  await formRef.value?.validate()
}


defineExpose({
  validate,
  gridApi:()=>fieldRef.value?.gridApi
})

// https://l1yp.com/docs/flowable/bpmn/#executionListeners
</script>

<style scoped>
:deep(.listener-field-table.vxe-table--render-default .vxe-header--column:not(.col--ellipsis)) {
  padding: 0;
}
</style>
