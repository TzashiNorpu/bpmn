<!--
  SVGIcon.vue

  这个 Vue 组件渲染一个 SVG 图标。它检查图标名称是否存在于导入的 Element Plus 图标中。
  如果图标存在，它会渲染相应的组件。否则，它会回退到渲染一个带有 `use` 标签的 SVG 元素，
  该标签引用了通过符号 ID 的图标。

  属性:
    - name (String, required): 要渲染的图标名称。它必须是导入的 Element Plus 图标的键。

  计算属性:
    - symbolId (String): SVG `use` 标签的计算符号 ID，格式为 `#icon-{name}`。

  依赖:
    - Vue 的 `defineComponent`、`computed` 和 `PropType` 来自 'vue'。
    - 所有图标来自 '@element-plus/icons-vue'。
-->
<template>
  <!--
   Icon 是从 @element-plus/icons-vue 导入的所有图标的集合对象。
   它包含了所有可用的图标组件，键是图标名称，值是对应的图标组件。
   用 hasOwnProperty 方法检查 Icon 对象是否具有名为 name 的属性
   如果 Icon 对象中存在名为 name 的属性，则返回 true，否则返回 false。
  -->
  <template v-if="hasIcon(name)">
    <!--
    component： vue 动态组件
    如果 name 的值是 'Home'，并且 Icon 对象中存在 Home 属性，则 Icon['Home'] 将返回对应的图标组件。
  -->
    <component :is="iconComponent(name)" />
  </template>
  <template v-else>
    <svg aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>
  </template>
</template>
<script lang="ts">
import {computed, defineComponent, type Component, type PropType} from 'vue'
import * as Icon from '@element-plus/icons-vue'

const iconKeys = Object.keys(Icon) as Array<keyof typeof Icon>
function hasIcon(name: string): boolean {
  return iconKeys.includes(name as keyof typeof Icon)
}

function iconComponent(name: string): Component| {
  return hasIcon(name) ? Icon[name as keyof typeof Icon] : null
}

export default defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
      required: true
    }
  },
  setup(props) {

    const symbolId = computed<string>(() => `#icon-${props.name}`)
    return {
      symbolId, hasIcon,iconComponent
    }
  }
})
</script>
