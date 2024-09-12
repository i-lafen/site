import DefaultTheme from 'vitepress/theme'
import './index.css'
import MyLayout from './MyLayout.vue'

import { onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import mediumZoom from 'medium-zoom'

export default {
  ...DefaultTheme,
  Layout: MyLayout,
  setup() {
    const route = useRoute()
    const initRoom = () => mediumZoom('.main img', { background: 'var(--vp-c-bg)' })
    onMounted(initRoom)
    watch(() => route.path, () => nextTick(initRoom))
  }
}
