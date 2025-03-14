import * as PageApi from '@/api/modeling/page'
import {ref, type Ref} from "vue";
import {ElMessage} from "element-plus";

// 封装加载状态设置函数
function setLoading(loading: Ref<boolean> | undefined, value: boolean) {
  if (loading) {
    loading.value = value;
  }
}
export function useModelingPageApi(loading?: Ref<boolean>) {

  const pageInfo = ref<ModelingPageView>()
  const pageList = ref<ModelingPageView[]>([])


  async function getPage(pageId: string) {
    try {
      setLoading(loading, true); // 设置加载状态
      pageInfo.value = await PageApi.getPage(pageId)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      setLoading(loading, false); // 设置加载状态
      }
  }

  async function findPage(param: ModelingPageFindParam) {
    try {
     setLoading(loading, true)
      pageInfo.value = await PageApi.findPage(param)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      setLoading(loading, false)
    }
  }


  async function findModulePages(param: ModelingPageModuleFindParam) {
    try {
      setLoading(loading, true)
      pageList.value = await PageApi.findModulePages(param)
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '查询失败')
    } finally {
      setLoading(loading, false)
    }
  }


  async function bindPage(param: ModelingPageBindParam) {
    try {
      setLoading(loading, true)
      await PageApi.bindPage(param)
      ElMessage.success('绑定成功')
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '绑定失败')
    } finally {
      setLoading(loading, false)
    }
  }

  async function unbindPage(param: ModelingPageUnbindParam) {
    try {
      setLoading(loading, true)
      await PageApi.unbindPage(param)
      ElMessage.success('解绑成功')
    } catch (e) {
      console.error(e)
      ElMessage.error((e as Error)?.message || '解绑失败')
    } finally {
      setLoading(loading, false)
    }
  }






  return {
    pageInfo, getPage, findPage, bindPage, unbindPage,
    pageList, findModulePages,
  }
}
