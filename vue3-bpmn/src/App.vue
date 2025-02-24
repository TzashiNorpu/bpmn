<script setup lang="ts">
import {RouterLink, RouterView} from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <!-- <HelloWorld msg="You did it!" /> -->

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
/**
 * 设置页面头部的样式
 * - 使用 line-height: 1.5 来提高文本的可读性，确保行间距不会太拥挤
 * - 设置 max-height: 100vh 以确保头部高度不会超过视窗高度，保持内容的可见性和布局的一致性
 *  App.vue 文件中，头部高度是指 <header> 元素的最大高度。
 * 1vh 等于视口高度的 1%。因此，100vh 就是整个视口的高度
 */
header {
  line-height: 1.5;
  max-height: 100vh;
}
/*
  .logo样式设置logo的布局和间距
  display: block; 确保.logo元素在页面中独占一行显示
  margin: 0 auto 2rem; 居中显示logo，并在其下方留出一定的空间
*/
.logo {
  display: block;
  margin: 0 auto 2rem;
}
/*
  导航栏样式设置
  - 宽度设置为100%以充满父容器
  - 字体大小设置为12像素
  - 文本居中对齐
  - 顶部外边距设置为2rem，用于控制与其他元素的间距
*/
nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

/* 当导航项是当前激活的路由时，应用此样式
   color 是文本颜色
*/
nav a.router-link-exact-active {
  color: var(--color-text);
}

/**
 * 当鼠标悬停在具有.router-link-exact-active类的导航链接上时，保持背景颜色为透明。
 * 这个CSS选择器专门针对Vue.js中精确匹配的路由链接，确保它们在悬停状态下不会改变背景颜色。
 */
nav a.router-link-exact-active:hover {
  background-color: transparent;
}

/*
  为导航链接设置样式：
  - 使用 inline-block 显示方式，使得元素可以设置宽高和对齐
  - 设置左右内边距为 1rem，增加点击区域的大小
  - 左边框使用变量 --color-border 定义的颜色，保持样式的一致性
*/
nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

/* 选择nav元素中的第一个a子元素，并设置其边框为0 */
nav a:first-of-type {
  border: 0;
}

/* 当视口宽度大于或等于1024px时，应用以下样式 */
@media (min-width: 1024px) {
  /* 设置header的样式，使其内容居中，并在右侧添加一定的内边距 */
  /* header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  } */
  /** ### 2rem 的解释
   *`2rem`** 是一个相对长度单位，相对于根元素（即 `<html>` 元素）的字体大小来计算。
   * 默认情况下，浏览器的根元素字体大小通常是 `16px`。因此：
   * `1rem = 16px`
   * `2rem = 32px`
   * 所以，在你的代码中，`.logo` 类的右边距设置为 `2rem`，意味着它将有 `32px` 的右边距。
   * 如果你修改了根元素的字体大小，`2rem` 的实际像素值也会相应变化。例如，如果根元素的字体大小设置为 `20px`，那么 `2rem` 就等于 `40px`。
   */
   header {
    display: inline-block;
  }
  .logo {
    margin: 0 2rem 0 0;
  }

  /* 设置header内部wrapper的样式，使其内容对齐到顶部，并允许内容换行显示 */
  header .wrapper {
    /* display: flex; */
    /* place-items: flex-start; */
    /* flex-wrap: wrap; */
  }

  /* 设置导航栏的样式，文本左对齐，向左移动一定的距离，设置字体大小，并在顶部和底部添加内边距 */
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
