<script setup>
import { onMounted, ref, watch, computed, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'

const { Layout } = DefaultTheme

const route = useRoute()

const count = ref(0)
const initStat = () => {
  count.value = document.querySelector("#VPContent")?.innerText?.length ?? 0
}
onMounted(initStat)
watch(() => route.path, () => nextTick(initStat))

const spendTime = computed(() => Math.round(count.value / 500))
const text = computed(() => `本篇共 ${count.value} 字，阅读约 ${spendTime.value} 分钟`)

const textStyle = {
  display: 'flex',
  marginBottom: '1rem',
  color: '#8a919f',
}
</script>

<template>
  <Layout>
    <template #doc-before>
      <span :style="textStyle">{{ text }}</span>
    </template>
  </Layout>
</template>
