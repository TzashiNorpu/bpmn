import type { MYANY } from '@/types/type'
import type { ICellEditorParams } from 'ag-grid-community'

export const AG_EDITOR_SELECT = 'ag-editor-select'

export interface CellEditorParams extends ICellEditorParams {
  componentProps: Record<string, MYANY>
}

/**
 * @description: TypeScript 实用类型示例及作用：
 * Partial<T>：使接口所有属性可选
 *   interface User { name: string; age: number }
 *   type PartialUser = Partial<User> // { name?: string; age?: number }
 * Required<T>：使接口所有属性必选
 *   interface Props { title?: string }
 *   type RequiredProps = Required<Props> // { title: string }
 * Record<K, T>：创建一个由属性K类型值为T类型的对象
 *   type ColorMap = Record<'red'|'blue', string[]>
 *   // { red: string[]; blue: string[] }
 * Pick<T, K>：从接口T中选取属性K
 *   interface Book { title: string; pages: number }
 *   type BookTitle = Pick<Book, 'title'> // { title: string }
 * Omit<T, K>：从接口T中排除属性K
 *   interface Task { id: string; desc: string }
 *   type NoIdTask = Omit<Task, 'id'> // { desc: string }
 * ReturnType<T>：获取函数类型的返回值类型
 *   function getUser() { return { name: 'Alice' } }
 *   type UserData = ReturnType<typeof getUser> // { name: string }
 * ...
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
