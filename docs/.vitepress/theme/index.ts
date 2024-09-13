import DefaultTheme from 'vitepress/theme'

import './index.css'
import Layout from './layout/index.vue'

import useImgZoom from './hooks/useImgZoom'

export default {
  ...DefaultTheme,
  Layout,
  setup() {
    useImgZoom()
  }
}
