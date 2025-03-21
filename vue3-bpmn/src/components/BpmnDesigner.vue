<template>
  <div class="root-container" v-loading="loading">
    <div class="toolbar">
      <el-button-group>
        <el-button :icon="View" title="预览JSON" @click="handlePreviewXml" />
        <el-button :icon="FolderOpened" title="导入BPMN文件" />
        <el-button :icon="SaveIcon" title="保存" @click="handleSaveXml" />
        <el-button :icon="Check" title="校验" @click="handleValidBpmn" />
        <el-button :icon="RefreshLeft" title="重置" @click="handleReset" />
        <!-- <el-button :icon="TopRight" title="新窗口打开" :disabled="route.name === 'workflow-ver-design'" @click="handleOpenNew" /> -->
      </el-button-group>
    </div>
    <div style="width: 100%; height: calc(100% - 41px); position: relative">
      <div style="width: 100%; height: 100%" ref="diagramRef"></div>
      <div style="position: absolute; top: 0; right: 0; height: 100%">
        <CustomCollapsed v-model="propertiesPanelVisible" position="right" style="height: 100%">
          <div style="
              box-sizing: border-box;
              width: 600px;
              height: 100%;
              background-color: var(--el-bg-color);
              border-left: 1px solid var(--el-border-color);
            ">
            <CustomPropertyPanel />
          </div>
        </CustomCollapsed>
      </div>
    </div>
    <!-- <xml-editor v-model="previewVisible" :code="previewCode" @confirm="handleUpdateXml" /> -->
    <div id="workflow-mask-panel"></div>
    <el-tooltip v-model:visible="errTooltipVisible" placement="right" :virtual-ref="errEl!" virtual-triggering manual
      :auto-close="3000">
      <template #content>
        <span style="color: red; font-weight: bold" v-text="errText"></span>
      </template>
    </el-tooltip>
  </div>
</template>

<script lang="ts" setup>
// import {useVerApi} from "@/service/workflow/ver";
import {ElMessage, ElTooltip} from 'element-plus/es'
import {onMounted, provide, ref, shallowRef} from 'vue'
import 'bpmn-js/dist/assets/bpmn-js.css'
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'
import 'diagram-js-minimap/assets/diagram-js-minimap.css'
import MiniMap from 'diagram-js-minimap'
import flowableDescriptor from '@/assets/flowable/descriptor.json'
// import PropertyPanel from '@/components/bpmn/PropertyPanel.vue'
import {bpmnModelerKey, bpmnSelectedElemKey, type BpmnSelectedElemProvider} from '@/config/app.keys'
// import {useModelingFieldApi} from "@/service/modeling/field";
// import XmlEditor from "@/components/common/XmlEditor.vue";
// import {useModelingPageApi} from "@/service/modeling/page";
import ElementRegistry from 'diagram-js/lib/core/ElementRegistry'
import {validate} from './bpmnlint'
import Canvas from 'diagram-js/lib/core/Canvas'
import type {Element, Shape} from 'bpmn-js/lib/model/Types'
import {xmlStr} from '@/mock/xmlStr'
import {useRoute} from 'vue-router'
import GridLineModule from 'diagram-js-grid-bg'
import MyCustomContextPadProvider from '@/components/context-pad'
import {useIcon} from '@/utils/util'
import emitter from '@/event/mitt'
import {View, FolderOpened, Check, RefreshLeft} from "@element-plus/icons-vue";
import CustomPropertyPanel from './property-panel/CustomPropertyPanel.vue'
import CustomCollapsed from './common/CustomCollapsed.vue'
import Modeler from 'bpmn-js/lib/Modeler'
const route = useRoute()
console.log('route', route, route.name)
// const router = useRouter()

const SaveIcon = useIcon('Save')

// interface Props {
//   verId: string
// }

// const props = defineProps<Props>()
const propertiesPanelVisible = ref(true)
const loading = ref(false)
// const {workflowVer, findVer, updateXml} = useVerApi(loading)
// const {modelingFields, findModelingFields} = useModelingFieldApi(loading)
// const {pageList, findModulePages} = useModelingPageApi(loading)

// provide(workflowVerKey, workflowVer)
// provide(modelingFieldKey, modelingFields)
// provide(modelingPageKey, pageList)

const diagramRef = ref<HTMLDivElement>()

onMounted(initDiagram)

const scale = ref<number>(1)
const bpmnModeler = shallowRef<Modeler>()
provide(bpmnModelerKey, bpmnModeler)
function updateBpmnSelectedElem(elem: Element | null) {
  if (!elem) {
    return
  }
  bpmnSelectedElem.value = elem
}
const bpmnSelectedElem = shallowRef<Element | null>(null)
const bpmnSelectedElemProvider: BpmnSelectedElemProvider = {
  bpmnSelectedElem,
  updateBpmnSelectedElem,
};
provide(bpmnSelectedElemKey, bpmnSelectedElemProvider)

async function initDiagram() {
  new Modeler({
    container: diagramRef.value,
    additionalModules: [
      MiniMap,
      GridLineModule,
      MyCustomContextPadProvider
    ],
    moddleExtensions: {
      flowable: flowableDescriptor,
    },
    minimap: {
      open: true,
    },
  })
  bpmnModeler.value = new Modeler({
    container: diagramRef.value,
    // keyboard: {
    //   bindTo: window,
    // },
    additionalModules: [
      // {
      //   // 禁用滚轮滚动
      //   zoomScroll: ['value', ''],
      // },
      MiniMap,
      GridLineModule,
      MyCustomContextPadProvider
    ],
    moddleExtensions: {
      flowable: flowableDescriptor,
    },
    minimap: {
      open: true,
    },
  })

  loading.value = true
  // findVer(props.verId)
  //   .then(() => findModelingFields('WORKFLOW', workflowVer.value!.key))
  //   .then(() => findModulePages({module: 'WORKFLOW', mkey: workflowVer.value!.key}))
  //   .then(() => importXML(workflowVer.value!.xml))
  //   .finally(() => loading.value = false)
  // console.log(xmlStr);

  await importXML(xmlStr).finally(() => (loading.value = false))
}

async function importXML(xml: string) {
  try {
    if (!bpmnModeler.value) {
      return
    }
    await bpmnModeler.value.importXML(xml)
    const canvas = bpmnModeler.value.get<Canvas>('canvas')
    if (!canvas) {
      return
    }
    // @ts-expect-error "fit-viewport" is not in the type definition
    canvas.zoom('fit-viewport', true)
    canvas.zoom(Math.ceil(scale.value / 100))

    const registry = bpmnModeler.value.get<ElementRegistry>('elementRegistry')
    if (!registry) {
      return
    }

    bpmnSelectedElem.value = registry.find((it) => it.type === 'bpmn:Process') as Element
    console.log('bpmnSelectedElemxxx', bpmnSelectedElem.value)
    bpmnModeler.value.on<SelectionChangedEvent>('selection.changed', (e) => {
      console.log('element select change111', e)
      console.log('new selection', e.newSelection)
      const selectionArray = e.newSelection
      // bpmnSelectedElem.value = e.newSelection
      bpmnSelectedElem.value = selectionArray?.length
        ? selectionArray[0]
        : registry.find((it) => it.type === 'bpmn:Process') as Element
      emitter.emit('bpmnSelectionChanged', {element: bpmnSelectedElem.value})
    })
    bpmnModeler.value.on<ElementChangedEvent>('element.changed', (e) => {
      console.log('element change', e)
      emitter.emit('bpmnElementChanged', {element: e.element})
    })
  } catch (e) {
    console.error(e)
    ElMessage.error('导入失败: ' + (e as Error).message)
  }
}

const previewCode = ref('')
const previewVisible = ref(false)

async function handlePreviewXml() {
  if (!bpmnModeler.value) {
    return
  }
  loading.value = true
  const {xml} = await bpmnModeler.value.saveXML({format: true})
  // console.log("export xml", xml)
  previewCode.value = xml!
  previewVisible.value = true
  loading.value = false
}

// function handleUpdateXml(xml: string) {
//   importXML(xml)
//   previewVisible.value = false
// }

async function handleSaveXml() {
  if (!bpmnModeler.value) {
    return
  }
  const result = validateBpmn()
  if (!result) {
    ElMessage.error('流程图信息未填写完毕, 无法保存')
    return
  }
  // const { xml } = await bpmnModeler.value.saveXML({ format: false })
  // await updateXml({
  //   id: workflowVer.value!.id,
  //   xml: xml!,
  // })
}

const errTooltipVisible = ref(false)
const errEl = shallowRef<HTMLElement>()
const errText = ref('')

function validateBpmn(): boolean {
  if (!bpmnModeler.value) {
    return false
  }
  const canvas = bpmnModeler.value.get<Canvas>('canvas')
  const root = canvas.getRootElement() as Shape
  console.log('root type', root.constructor.name, root)

  // if (root.id !== workflowVer.value!.key) {
  //   ElMessage.error('流程id与流程模型标识不一致')
  //   return false
  // }

  const registry = bpmnModeler.value.get<ElementRegistry>('elementRegistry')

  const err = validate(registry, root)
  if (err) {
    if (!err.element) {
      ElMessage.error(err.message)
      return false
    }
    errEl.value = document.querySelector<HTMLElement>(
      `g.djs-element[data-element-id=${err.element.id}] .djs-visual`,
    )!
    errText.value = err.message
    errTooltipVisible.value = true
    return false
  }
  return true
}

function handleValidBpmn() {
  const result = validateBpmn()
  if (result) {
    ElMessage.success('校验成功 bpmn文件正常')
  }
}

function handleReset() {
  // if (!bpmnModeler.value || !workflowVer.value) {
  //   return
  // }
  // const registry = bpmnModeler.value.get<ElementRegistry>('elementRegistry')
  // const process = registry.get(workflowVer.value.key)
  // if (!process) {
  //   return
  // }
  // const xml = InitBPMNXml.replaceAll('{{PROCESS_ID}}', process.id)
  //   .replaceAll('{{PROCESS_NAME}}', process.businessObject.name)
  //   .replaceAll(
  //     '{{START_EVENT_ID}}',
  //     'StartEvent_' + Math.random().toString(36).replaceAll('0.', ''),
  //   )
  // importXML(xml)
}

// function handleOpenNew() {
//   router.push({
//     name: 'workflow-ver-design',
//     params: props,
//   })
// }
</script>

<style scoped>
div {
  box-sizing: border-box;
}

.root-container {
  width: 100%;
  height: 100%;
  border: 1px solid var(--el-border-color);
}

:deep(.djs-minimap) {
  top: initial;
  right: initial;
  left: 20px;
  bottom: 40px;
  background-color: var(--el-bg-color);
}

:deep(.bjs-powered-by) {
  right: initial;
  left: 20px;
  width: 200px;
}

/*:deep(.layer-selectionOutline) {*/
/*  display: none;*/
/*}*/

/*:deep(g.djs-element.djs-shape g.djs-visual circle) {*/
/*  fill: var(--el-bg-color) !important;*/
/*  stroke: var(--el-border-color)!important;*/
/*}*/

/*:deep(g.djs-element.djs-shape g.djs-visual rect) {*/
/*  fill: var(--el-bg-color) !important;*/
/*  stroke: var(--el-border-color)!important;*/
/*}*/

/*:deep(g.djs-element.djs-shape g.djs-visual polygon) {*/
/*  fill: var(--el-bg-color) !important;*/
/*  stroke: var(--el-border-color)!important;*/
/*}*/

/*:deep(g.djs-element.djs-shape g.djs-visual polygon ~ path) {*/
/*  fill: var(--el-bg-color) !important;*/
/*  stroke: var(--el-border-color)!important;*/
/*}*/

/*:deep(.djs-context-pad .entry) {*/
/*  background-color: var(--el-bg-color);*/
/*}*/

/*:deep(g.djs-element.djs-shape g.djs-visual text) {*/
/*  fill: var(--el-text-color-regular) !important;*/
/*}*/

/*:deep(g.djs-element.djs-connection g.djs-visual path) {*/
/*  stroke: var(--el-border-color) !important;*/
/*}*/
</style>
