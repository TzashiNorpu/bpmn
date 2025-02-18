/**
 * CustomCollapsed.vue
 *
 * 这是一个 Vue 3 组件，用于创建一个可折叠的内容区域。该组件允许用户通过点击按钮来折叠或展开内容。
 *
 * Props:
 * - modelValue (boolean): 控制内容是否折叠的布尔值。
 * - position ('left' | 'top' | 'bottom' | 'right'): 指定折叠按钮的位置。
 *
 * Emits:
 * - update:modelValue (boolean): 当折叠状态改变时触发，传递新的折叠状态。
 *
 * Computed Properties:
 * - collapsed: 计算属性，用于获取和设置折叠状态。
 * - toggleButtonBoxClass: 计算属性，根据 position 属性返回相应的 CSS 类名。
 * - toggleBarLeftStyle: 计算属性，根据 position 属性返回左侧折叠按钮的样式。
 * - toggleBarRightStyle: 计算属性，根据 position 属性返回右侧折叠按钮的样式。
 *
 * Scoped Styles:
 * - .collapse-content-wrap: 定义内容区域的基本样式。
 * - .toggle-button-box: 定义折叠按钮的基本样式。
 * - .toggle-button-box.bottom-to-top: 定义从下往上折叠按钮的样式。
 * - .toggle-button-box.top-to-bottom: 定义从上往下折叠按钮的样式。
 * - .toggle-button-box.left-to-right: 定义从左往右折叠按钮的样式。
 * - .toggle-button-box.right-to-left: 定义从右往左折叠按钮的样式。
 * - 各种 hover 状态下的样式，用于在鼠标悬停时改变折叠按钮的外观。
 */
<template>
  <div class="collapse-content-wrap" :class="collapsed ? 'collapsed' : undefined">
    <transition name="el-fade-in-linear">
      <div style="width: 100%; height: 100%;" v-show="!collapsed">
        <slot></slot>
      </div>
    </transition>

    <div class="toggle-button-box" :class="toggleButtonBoxClass" @click="collapsed = !collapsed">
      <div class="toggle-button__left" :style="toggleBarLeftStyle"></div>
      <div class="toggle-button__right" :style="toggleBarRightStyle"></div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {computed, type StyleValue} from "vue"

interface Props {
  modelValue: boolean
  position: 'left' | 'top' | 'bottom' | 'right'
}

interface Emits {
  (e: 'update:modelValue', v: boolean): void
}


/**
 * CustomCollapsed 组件的事件定义。
 *
 * 这个常量用于定义 CustomCollapsed 组件可以触发的事件。
 * `defineEmits` 函数是 Vue 3 组合式 API 的一个特性，它允许你指定组件可以触发的事件及其类型。
 *
 * @type {Emits} - 触发事件的类型定义。
 */
const emits = defineEmits<Emits>()


/**
 * 定义 CustomCollapsed 组件的属性。
 *
 * 该常量用于显式声明 CustomCollapsed 组件所接受的 props。
 * `defineProps` 函数是 Vue 3 组合式 API 的一个特性，它允许你指定组件从父组件接收的属性。
 *
 * @type {Props} - 属性的类型定义。
 */
const props = defineProps<Props>()
const collapsed = computed({
  get() {
    return props.modelValue
  },
  set(v) {
    emits('update:modelValue', v)
  },
})

const toggleButtonBoxClass = computed<string>(() => {
  if (props.position === 'top') {
    // 往上折叠
    return 'bottom-top'
  }
  else if (props.position === 'bottom') {
    // 往下折叠
    return 'top-to-bottom'
  }
  else if (props.position === 'left') {
    // 往左折叠
    return 'right-to-left'
  }
  else if (props.position === 'right') {
    // 往右折叠
    return 'left-to-right'
  }
  return ""
})

const toggleBarLeftStyle = computed<StyleValue>(() => {
  if (props.position === 'top') {
    // 往上折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      top: '14px',
      width: '38px',
      height: '4px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'bottom') {
    // 往下折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      bottom: '14px',
      width: '38px',
      height: '4px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'left') {
    // 往左折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      left: '14px',
      width: '4px',
      height: '38px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'right') {
    // 往右折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      right: '14px',
      width: '4px',
      height: '38px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  return {}
})
const toggleBarRightStyle = computed<StyleValue>(() => {
  if (props.position === 'top') {
    // 往上折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      top: '14px',
      left: '34px',
      width: '38px',
      height: '4px',
      'border-radius': '2px',
      transition: 'all0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'bottom') {
    // 往下折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      bottom: '14px',
      left: '34px',
      width: '38px',
      height: '4px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'left') {
    // 往左折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      left: '14px',
      top: '34px',
      width: '4px',
      height: '38px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  else if (props.position === 'right') {
    // 往右折叠
    return {
      backgroundColor: '#bfbfbf',
      position: 'absolute',
      top: '34px',
      right: '14px',
      width: '4px',
      height: '38px',
      'border-radius': '2px',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      'transform': '0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  return null
})

</script>
<style scoped>
.collapse-content-wrap {
  position: relative;
  box-sizing: border-box;
}

.toggle-button-box {
  position: absolute;
  cursor: pointer;
  z-index: 999;
}

.toggle-button-box.bottom-to-top {
  left: calc(50% - 36px);
  bottom: -28px;
  width: 72px;
  height: 32px
}

.toggle-button-box.top-to-bottom {
  left: calc(50% - 36px);
  top: -28px;
  width: 72px;
  height: 32px
}

.toggle-button-box.left-to-right {
  top: calc(50% - 36px);
  left: -28px;
  width: 32px;
  height: 72px
}

.toggle-button-box.right-to-left {
  top: calc(50% - 36px);
  right: -28px;
  width: 32px;
  height: 72px
}

/* 从下往上收缩 */

.toggle-button-box.bottom-to-top:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateX(-2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.bottom-to-top:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateX(-2px);
}

.toggle-button-box.bottom-to-top:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateX(2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.bottom-to-top:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateX(2px);
}

/* 从上往下收缩 */

.toggle-button-box.top-to-bottom:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateX(-2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.top-to-bottom:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateX(-2px);
}

.toggle-button-box.top-to-bottom:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateX(2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.top-to-bottom:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateX(2px);
}

/* 从右往左收缩 */

.toggle-button-box.right-to-left:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateY(-2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.right-to-left:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateY(-2px);
}

.toggle-button-box.right-to-left:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateY(2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.right-to-left:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateY(2px);
}


/* 从左往右收缩 */

.toggle-button-box.left-to-right:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateY(-2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.left-to-right:hover .toggle-button__left {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateY(-2px);
}

.toggle-button-box.left-to-right:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(12deg) scale(1.15) translateY(2px);
}

.collapse-content-wrap.collapsed .toggle-button-box.left-to-right:hover .toggle-button__right {
  background-color: #999999;
  transform: rotate(-12deg) scale(1.15) translateY(2px);
}
</style>
