import { defineConfig } from 'vitepress'
import { NavItem, SidebarMulti } from './type'

const nav = [
  {
    link: '/leetcode/',
    text: 'LeetCode',
    items: [
      { link: '/leetcode/', text: 'Leetcode' },
      { link: '/leetcode/data-structure', text: 'Data Structure' },
      { link: '/leetcode/link', text: 'Link' },
      { link: '/leetcode/tree', text: 'Tree' },
      { link: '/leetcode/array', text: 'Array' },
      { link: '/leetcode/string', text: 'String' },
      { link: '/leetcode/pointer', text: 'Pointer' },
      { link: '/leetcode/number', text: 'Number' },
      { link: '/leetcode/dp', text: 'DP' },
      { link: '/leetcode/lru', text: 'LRU' },
    ]
  },
  {
    text: 'Http',
    link: '/http/',
    items: [
      { link: '/http/', text: 'Http' },
      { link: '/http/tcp-ip-udp', text: 'TCP-IP-UDP' },
      { link: '/http/http', text: 'Http' },
      { link: '/http/https', text: 'Https' },
      { link: '/http/cache', text: 'Cache' },
      { link: '/http/csp', text: 'CSP' },
      { link: '/http/hand', text: 'Hand' },
      { link: '/http/url-to-page', text: 'Url-to-page' },
      { link: '/http/dns', text: 'DNS' },
    ]
  },
  {
    link: '/engineering/',
    text: 'Engineering',
    items: [
      { link: '/engineering/', text: 'Engineering'},
      { link: '/engineering/module', text: 'Module' },
      { link: '/engineering/base', text: 'Base' },
      { link: '/engineering/package', text: 'Package' },
      { link: '/engineering/monorepo', text: 'Monorepo' },
      { link: '/engineering/eslint', text: 'Eslint' },
      { link: '/engineering/gitflow', text: 'Gitflow' },
      { link: '/engineering/vite', text: 'Vite' },
      { link: '/engineering/vite-plugin', text: 'Vite Plugin' },
      { link: '/engineering/unbuild', text: 'Unbuild' },
      { link: '/engineering/webpack', text: 'Webpack' },
      { link: '/engineering/gulp', text: 'Gulp' },
      { link: '/engineering/cli', text: 'Cli' },
      { link: '/engineering/vue', text: 'Vue' },
      { link: '/engineering/react', text: 'React' },
    ]
  },
  {
    link: '/microfe/',
    text: 'Micro FE',
    items: [
      { link: '/microfe/', text: 'Micro FE' },
      { link: '/microfe/federation', text: 'Federation' },
      { link: '/microfe/microapp', text: 'Micro App' },
      { link: '/microfe/wujie', text: 'WuJie' },
      { link: '/microfe/qiankun', text: 'Qiankun' },
      { link: '/microfe/compare', text: 'Compare' },
    ]
  },
  {
    link: '/browser/',
    text: 'Browser',
    items: [
      { link: '/browser/', text: 'Browser' },
      { link: '/browser/v8-gc', text: 'V8-GC' },
      { link: '/browser/eventloop', text: 'Eventloop' },
      { link: '/browser/node-eventloop', text: 'Node Eventloop' },
      { link: '/browser/asyncapi', text: 'Async Api' },
      { link: '/browser/layer', text: 'Layer' },
      { link: '/browser/extension', text: 'Extension' },
    ]
  },
  {
    link: '/javascript/',
    text: 'JavaScript',
    items: [
      { link: '/javascript/', text: 'JavaScript' },
      { link: '/javascript/ts', text: 'TS' },
      { link: '/javascript/typescript', text: 'TypeScript' },
      { link: '/javascript/js', text: 'Js' },
      { link: '/javascript/hoisting', text: 'Hoisting' },
      { link: '/javascript/stack', text: 'Stack' },
      { link: '/javascript/scope', text: 'Scope' },
      { link: '/javascript/scope-chain', text: 'Scope Chain' },
      { link: '/javascript/this', text: 'This' },
      { link: '/javascript/new', text: 'New' },
      { link: '/javascript/instanceof', text: 'Instanceof' },
      { link: '/javascript/call-apply-bind', text: 'Call Apply Bind' },
      { link: '/javascript/throttle-debounce', text: 'Throttle Debounce' },
      { link: '/javascript/deep-clone', text: 'Deep Clone' },
      { link: '/javascript/chain', text: 'Chain' },
      { link: '/javascript/curry', text: 'Curry' },
      { link: '/javascript/tail-call', text: 'Tail Call' },
      { link: '/javascript/sparse-array', text: 'Sparse Array' },
      { link: '/javascript/code', text: 'Code' },
      { link: '/javascript/all', text: 'Promise.all' },
      { link: '/javascript/promise', text: 'Promise' },
      { link: '/javascript/promisify', text: 'Promisify' },
      { link: '/javascript/max-request', text: 'Max Request' },
    ]
  },
  {
    link: '/css/',
    text: 'Css',
    items: [
      { link: '/css/', text: 'Css' },
      { link: '/css/flex', text: 'Flex' },
      { link: '/css/grid', text: 'Grid' },
      { link: '/css/scoped', text: 'Scoped' },
      { link: '/css/unocss', text: 'Unocss' },
      { link: '/css/mobile', text: 'Mobile' },
      { link: '/css/margin', text: 'Margin' },
      { link: '/css/inline-block', text: 'Inline Block' },
      { link: '/css/bfc', text: 'BFC' },
      { link: '/css/center', text: 'Center' },
    ]
  },
  {
    link: '/web/',
    text: 'Web',
    items: [
      { link: '/web/', text: 'Web' },
      { link: '/web/monitor', text: 'Monitor' },
      { link: '/web/pattern', text: 'Pattern' },
      { link: '/web/session-share', text: 'Session Share' },
      { link: '/web/fabric-editor', text: 'Fabric Editor' },
      { link: '/web/threejs', text: 'ThreeJs' },
      { link: '/web/vitepress', text: 'VitePress' },
      { link: '/web/interview', text: 'Interview' },
    ]
  }
] as NavItem[]

const sidebar = nav.reduce((res: SidebarMulti, cur: NavItem) => {
  if (cur.link && cur.items?.length) {
    res[cur.link] = {
      text: cur.text,
      items: cur.items ?? [],
    }
  }
  return res
}, {} as SidebarMulti)

const base = '/site/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  title: "LAFEN",
  description: "🍒Personal Blog🍒",
  head: [['link', { rel: 'icon', href: base + 'logo.svg' }]],
  lastUpdated: false,
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'logo.svg',
    nav,
    sidebar,
    outline: { level: 'deep', label: '' },
    search: { provider: 'local' },
    socialLinks: [{ icon: 'github', link: 'https://github.com/i-lafen' }],
    externalLinkIcon: true,
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present LAFEN'
    }
  },
  sitemap: {
    hostname: 'https://i-lafen.github.io/site'
  }
})
