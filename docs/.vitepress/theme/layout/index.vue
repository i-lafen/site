<script setup>
import DefaultTheme from 'vitepress/theme'
import useSpendTime from '../hooks/useSpendTime'
import useThemeTransition from '../hooks/useThemeTransition'
import useImgZoom from '../hooks/useImgZoom'
import './index.css'

const { text, textStyle, colorStyle } = useSpendTime()
useThemeTransition()
useImgZoom()
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <span :style="textStyle">
        ⏰
        <span :style="colorStyle">{{ text }}</span>
      </span>
    </template>
  </DefaultTheme.Layout>
</template>
