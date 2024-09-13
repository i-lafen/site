import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'

/**
 * 图片放大
 */
const useImgZoom = () => {
  const route = useRoute()
  const initZoom = () => mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
  onMounted(initZoom)
  watch(() => route.path, () => nextTick(initZoom))
}

export default useImgZoom
