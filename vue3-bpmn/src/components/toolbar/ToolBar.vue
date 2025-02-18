<template>
  <div class="toolbar">
    <el-button-group>
      <el-button :icon="View" title="预览JSON" @click="handlePreviewXml" />
      <el-button :icon="FolderOpened" title="导入BPMN文件" />
      <el-button :icon="SaveIcon" title="保存" @click="handleSaveXml" />
      <el-button :icon="Check" title="校验" @click="handleValidBpmn" />
      <el-button :icon="RefreshLeft" title="重置" @click="handleReset" />
      <el-button :icon="TopRight" title="新窗口打开" :disabled="route.name === 'workflow-ver-design'"
        @click="handleOpenNew" />
    </el-button-group>
  </div>
</template>

<script lang="ts" setup>
import {ElButtonGroup, ElButton} from "element-plus/es";
import {View, FolderOpened, Check, RefreshLeft, TopRight} from "@element-plus/icons-vue/dist/types";
import {useRoute} from "vue-router";

const route = useRoute();

defineProps<{
  handlePreviewXml: () => void;
  handleSaveXml: () => void;
  handleValidBpmn: () => void;
  handleReset: () => void;
  handleOpenNew: () => void;
  SaveIcon: () => void;
}>();
</script>

<style scoped>
.toolbar {
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  background-color: var(--toolbar-bg-color);
  border-bottom: 1px solid var(--el-border-color);
}
</style>
