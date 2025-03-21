<template>
  <ag-grid-vue ref="gridRef" style="width: 100%; height: 100%" class="ag-grid-wrapper" :class="themeStore.AGGridClass"
    :grid-options="gridOptions" v-click-outside="handleClickGridOutside" :row-data="data" />
</template>
<script lang="ts" setup>
import {Plus, Delete} from '@element-plus/icons-vue'
import {shallowRef, onUnmounted, unref, computed} from "vue";
import {AgGridVue} from "ag-grid-vue3";
// import type {AgGridVue} from "ag-grid-vue3";
import {useThemeStore} from "@/store/theme";
import {
  CellStyleModule,
  CheckboxEditorModule,
  ClientSideRowModelApiModule,
  ClientSideRowModelModule,
  ColumnAutoSizeModule,
  CustomEditorModule,
  DateEditorModule,
  LargeTextEditorModule,
  ModuleRegistry,
  NumberEditorModule,
  SelectEditorModule,
  TextEditorModule,
  ValidationModule,
  // type ColumnApi,
  type FirstDataRenderedEvent,
  type GridApi,
  type GridOptions,
  type GridReadyEvent,
  type ICellRendererParams, type IRowNode
} from "ag-grid-community";
import GridActionCell from "@/components/ag-grid/cell/GridActionCell.vue";
import SelectEditor from "@/components/ag-grid/editor/SelectEditor.vue";
import InputEditor from "@/components/ag-grid/editor/InputEditor.vue";
import {AG_EDITOR_SELECT} from "@/components/ag-grid/editor";
import type {ListenerFieldInjectError} from '@/types';

ModuleRegistry.registerModules([ClientSideRowModelModule,
  ColumnAutoSizeModule,
  ClientSideRowModelApiModule,
  ValidationModule,
  TextEditorModule,
  NumberEditorModule,
  DateEditorModule,
  CheckboxEditorModule,
  LargeTextEditorModule,
  CellStyleModule,
  SelectEditorModule,
  CustomEditorModule])

interface Props {
  listener: ListenerObject
}

const props = defineProps<Props>()
const data = computed(() => {
  const fieldsData: Array<ListenerFieldConfig> = []
  const fields = props.listener.fields
  if (!fields) {
    return fieldsData
  }
  for (const field of fields) {
    console.log('field:', field)
    fieldsData.push({
      name: field.name,
      type: 'string' in field ? 'string' : 'expression',
      value: 'string' in field ? field['string'] :('expression' in field ? field['expression'] :'')
    } as ListenerFieldConfig)
  }
  return fieldsData
})
const fieldTypeOptions = [
  {
    label: '字符串',
    value: 'string'
  },
  {
    label: '表达式',
    value: 'expression'
  },
]
const themeStore = useThemeStore()
const gridApi = shallowRef<GridApi<ListenerFieldConfig>>()
// const columnApi = shallowRef<ColumnApi>()
// const data = ref(props.listener.fields || [])
const gridOptions: GridOptions<ListenerFieldConfig> = {
  rowData: [],
  rowHeight: 36,
  headerHeight: 36,
  editType: 'fullRow',
  columnDefs: [
    {
      headerName: '#', // 设置列的标题为 '#'
      width: 50, // 设置列宽为 50 像素
      // 定义一个值获取器函数，用于计算每行的行号
      valueGetter: params => String((params.node?.rowIndex || 0) + 1),
    },
    {
      field: 'name', // 列的字段名
      headerName: '字段名', // 列表头的显示名称
      width: 150, // 列的宽度
      resizable: true, // 允许手动调整列宽
      editable: true, // 列单元格可编辑
      cellEditor: InputEditor, // 指定列单元格的编辑器组件
    },
    {
      // 字段名，用于数据绑定
      field: 'type',
      // 表头名称，显示在表格中
      headerName: '类型',
      // 列宽
      width: 150,
      // 是否可以调整列宽
      resizable: true,
      // 是否可编辑
      editable: true,
      // 使用的单元格编辑器组件
      cellEditor: SelectEditor,
      // 单元格编辑器的参数
      cellEditorParams: {
        // 选项，由 fieldTypeOptions 提供
        options: fieldTypeOptions,
        // 组件属性
        componentProps: {
          style: {
            // 设置宽度为100%
            width: '100%',
            // 设置高度为100%
            height: '100%'
          }
        }
      }
    },
    {
      field: 'value', // 列的字段名
      headerName: '值', // 列表头的显示名称
      width: 150, // 列的宽度
      resizable: true, // 允许手动调整列宽
      editable: true, // 列的单元格可编辑
      cellEditor: InputEditor, // 指定列的单元格编辑器组件
    },
    {
      headerName: '操作',  // 列头名称为“操作”
      width: 32,           // 列宽为32像素
      cellRenderer: GridActionCell,  // 使用GridActionCell组件渲染单元格内容
      wrapHeaderText: true,  // 允许列头文本换行
      headerClass: 'action-header',  // 设置列头样式类名
      cellClass: 'action-cell',  // 设置单元格样式类名
      headerComponent: GridActionCell,  // 使用GridActionCell组件渲染列头
      headerComponentParams: {  // 列头组件参数
        actions: [  // 定义列头中的操作按钮
          {
            id: '1',  // 按钮ID
            props: {  // 按钮属性
              link: true,  // 是否作为链接样式
              type: 'danger',  // 按钮类型为危险（红色）
              icon: Plus,  // 使用Plus图标
              style: 'width: 20px; height: 20px;  ',  // 自定义样式
            },
            clickHandler(params: ICellRendererParams<ListenerFieldConfig>, ev: MouseEvent) {  // 点击事件处理器
              console.log('event:', ev)  // 打印鼠标事件信息
              console.log('params:', params)
              console.log('gridApi:', gridApi.value)
              if (!gridApi.value) {  // 如果gridApi不存在，直接返回
                return
              }

              const newRow: ListenerFieldConfig = {  // 创建新行数据
                name: '',
                type: 'string',
                value: ''
              }

              params.api.applyTransaction({  // 将新行添加到表格中
                add: [
                  newRow
                ]
              });

              // props.listener.fields?.push(newRow)  // 将新行添加到字段列表中
              // emitter.emit('listenerFieldAdd', {row: newRow})  // 发送监听器字段添加事件
              // emit('field:add', newRow)  // 触发字段添加事件
              const rowCount = params.api.getDisplayedRowCount();  // 获取当前行数
              params.api.startEditingCell({  // 开始编辑新行的第一个单元格
                rowIndex: rowCount - 1,
                colKey: 'name'
              })

            }
          }
        ]
      },
      cellRendererParams: {  // 单元格渲染器参数
        actions: [  // 定义单元格中的操作按钮
          {
            id: '1',  // 按钮ID
            props: {  // 按钮属性
              link: true,  // 是否作为链接样式
              type: 'danger',  // 按钮类型为危险（红色）
              icon: Delete,  // 使用Delete图标
              style: 'width: 20px; height: 20px; border: none;',  // 自定义样式
            },
            clickHandler(params: ICellRendererParams, ev: MouseEvent) {  // 点击事件处理器
              console.log('click delete handler', ev)  // 打印点击删除事件信息
              params.api.applyTransaction({  // 从表格中移除当前行
                remove: [params.data]
              })

              // const idx = props.listener.fields?.indexOf(params.data) || -1  // 查找当前行在字段列表中的索引
              // idx !== -1 && props.listener.fields?.splice(idx, 1)  // 如果找到，则从字段列表中移除当前行
              // if (idx !== -1) {
              // emit('field:delete', idx)  // 触发字段删除事件
              // emitter.emit('listenerFieldDelete', {idx: idx})  // 发送监听器字段删除事件
              // }
            }
          }
        ]
      }
    },
  ],
  /**
 * 当网格准备就绪时调用的函数
 * 该函数初始化网格并绑定必要的事件监听器
 *
 * @param {GridReadyEvent<ListenerField>} event - 网格准备就绪事件，包含网格的API和列API
 */
  onGridReady(event: GridReadyEvent<ListenerFieldConfig>) {
    // 将网格API和列API保存到组件的响应式变量中
    gridApi.value = event.api
    // columnApi.value = event.columnApi

    // 绑定点击事件到网格
    bindClickEvent()
    // 设置网格的行数据，如果没有提供则使用空数组
    // event.api.setRowData(props.listener.fields || [])
  },
  onFirstDataRendered(event: FirstDataRenderedEvent<ListenerFieldConfig>) {
    event.api.sizeColumnsToFit()
  },
}

async function validate() {
  if (!gridApi.value) {
    return
  }
  const errorList: Array<ListenerFieldInjectError> = []

  gridApi.value.forEachNode((rowNode: IRowNode<ListenerFieldConfig>, index: number) => {
    if (!rowNode.data) {
      return
    }

    if (!rowNode.data.name) {
      errorList.push({field: 'name', fieldValue: rowNode.data.name, message: `第${index + 1}行字段名不能为空`})
      // throw new Error(`第${index + 1}行请输入字段名或删除此行`)
    }
    if (!rowNode.data.value) {
      errorList.push({field: 'value', fieldValue: rowNode.data.value, message: `第${index + 1}行字段值不能为空`})
      // throw new Error(`第${index + 1}行请输入字段值`)
    }
    if (!rowNode.data.type) {
      errorList.push({field: 'type', fieldValue: rowNode.data.type, message: `第${index + 1}行类型不能为空`})
      // throw new Error(`第${index + 1}行请选择字段类型`)
    }
    if (!/^[a-zA-Z_$][\w$]*$/.test(rowNode.data.name)) {
      errorList.push({field: 'name', fieldValue: rowNode.data.name, message: `第${index + 1}行字段名不符合规则: 字母或下划线开头`})
      // throw new Error(`第${index + 1}行字段名不符合规则: 字母或下划线开头`)
    }
  })
  if (errorList?.length) {
    throw {value: errorList}
  }
}

defineExpose({
  validate,
  gridApi
})

function handleClickGridOutside(up: MouseEvent, down: MouseEvent) {
  const target = up.target as HTMLElement
  let parentElem = target.parentElement
  while (parentElem) {
    // el-popper is-pure is-light el-select__popper ag-editor-select
    if (parentElem.classList.contains(AG_EDITOR_SELECT) &&
      parentElem.classList.contains('el-popper') && parentElem.classList.contains('el-select__popper')) {
      return
    }
    parentElem = parentElem.parentElement
  }
  console.log(down);

  gridApi.value?.stopEditing(false)
}

const gridRef = shallowRef<typeof AgGridVue>()

const bodyContainer = shallowRef<HTMLDivElement>()
const headerContainer = shallowRef<HTMLDivElement>()

function bindClickEvent() {
  const gridComponent = unref(gridRef);
  if (gridComponent && gridComponent instanceof HTMLElement) {
    bodyContainer.value = gridComponent.querySelector("div.ag-center-cols-viewport") as HTMLDivElement;
    bodyContainer.value?.addEventListener("mousedown", handleCancelEditing);

    headerContainer.value = gridComponent.querySelector("div.ag-header-viewport") as HTMLDivElement;
    headerContainer.value?.addEventListener("mousedown", handleCancelEditing);
  }
  // bodyContainer.value = gridRef.value?.$el.querySelector("div.ag-center-cols-viewport") as HTMLDivElement
  // bodyContainer.value?.addEventListener("mousedown", handleCancelEditing)

  // headerContainer.value = gridRef.value?.$el.querySelector("div.ag-header-viewport") as HTMLDivElement
  // headerContainer.value?.addEventListener("mousedown", handleCancelEditing)
}

function handleCancelEditing(ev: MouseEvent) {
  if ([headerContainer.value, bodyContainer.value].includes(ev.target as HTMLDivElement)) {
    gridApi.value?.stopEditing(false)
  }
}

onUnmounted(() => {
  headerContainer.value?.removeEventListener('mousedown', handleCancelEditing)
  bodyContainer.value?.removeEventListener('mousedown', handleCancelEditing)
})


</script>
<style scoped>
:deep(.action-header) {
  padding-left: 6px;
  padding-right: 6px;
}

:deep(.action-header .ag-header-cell-comp-wrapper) {
  justify-content: center;
  padding-left: 6px;
  padding-right: 6px;
}

:deep(.action-cell) {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 6px;
  padding-right: 6px;
}

:deep(.ag-cell-inline-editing) {
  height: unset;
}

/*
.ag-grid-wrapper ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.ag-grid-wrapper ::-webkit-scrollbar-track {
  background: transparent;
}

.ag-grid-wrapper ::-webkit-scrollbar-thumb {
  background: #bfc6d2;
  border-radius: 3px;
}

.ag-grid-wrapper ::-webkit-scrollbar-thumb:hover {
  background: #6e85ad;
  cursor: pointer;
}
*/
</style>
