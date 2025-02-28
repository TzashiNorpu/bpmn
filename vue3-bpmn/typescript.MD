# info

## typeof

typeof 是 JavaScript 和 TypeScript 中的关键字，用于获取变量或表达式的类型。
在 Vue 组件中，typeof 操作符用于获取变量或表达式的类型。对于 Vue 组件（无论是使用选项式 API 还是组合式 API），typeof 返回的是组件的构造函数类型。

- typeof TaskListenerCreate 返回的是一个函数类型的值，这个函数是 Vue 组件的构造函数
- 通过 typeof 获取一个已经实例化的组件（例如通过 ref 引用的组件实例），它会返回 "object"，因为实例化后的组件是一个对象。

## InstanceType

InstanceType 是 TypeScript 中的一个条件类型，用于从构造函数类型[typeof 的返回]中提取实例类型。在 Vue 组件中，
`InstanceType<typeof TaskListenerCreate>` 用于获取该构造函数实例化后的类型，即组件实例的具体类型
