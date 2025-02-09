<script setup lang="ts">
import BpmnModeler from 'bpmn-js/lib/Modeler'
// 这里引入的是右侧属性栏这个框
import { BpmnPropertiesPanelModule, BpmnPropertiesProviderModule } from 'bpmn-js-properties-panel'
// 而这个引入的是右侧属性栏里的内容
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// 一个描述的json
import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json'
import { xmlStr } from '@/mock/xmlStr'
import { onMounted, useTemplateRef, ref, unref } from 'vue'

const bpmnModeler = ref<BpmnModeler>()
const canvas = useTemplateRef<HTMLElement>('canvas')
async function createNewDiagram() {
  // 将字符串转换成图显示出来
  bpmnModeler.value?.importXML(xmlStr)
}
function init() {
  bpmnModeler.value = new BpmnModeler({
    container: unref(canvas) as HTMLElement,
    propertiesPanel: {
      parent: '#js-properties-panel',
    },
    additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule],
    moddleExtensions: {
      //如果要在属性面板中维护camunda：XXX属性，则需要此
      camunda: camundaModdle,
    },
  })
  createNewDiagram()
}

onMounted(async () => {
  init()
})
</script>

<template>
  <div class="containers">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
  </div>
</template>

<style scoped>
.containers {
  background-color: #ffffff;
  width: 100%;
  height: calc(100vh - 52px);
}
.canvas {
  width: 100%;
  height: 100%;
}
.panel {
  position: absolute;
  right: 0;
  top: 0;
  width: 300px;
}
</style>
