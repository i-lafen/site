import { defineConfig } from 'vitepress'
import { NavItem, SidebarMulti } from './type'

const nav = [
  {
    text: 'LeetCode',
    link: '/leetcode/',
    items: [
      { text: 'Leetcode', link: '/leetcode/' },
      { text: 'Link', link: '/leetcode/link' },
      { text: 'Tree', link: '/leetcode/tree' },
      { text: 'Array', link: '/leetcode/array' },
      { text: 'String', link: '/leetcode/string' },
      { text: 'Pointer', link: '/leetcode/pointer' },
      { text: 'Number', link: '/leetcode/number' },
      { text: 'Dp', link: '/leetcode/dp' },
      { text: 'Lru', link: '/leetcode/lru' }
    ]
  },
  {
    text: 'Http',
    link: '/http/',
    items: [
      { text: 'Http', link: '/http/' },
      { text: 'Tcp-ip-udp', link: '/http/tcp-ip-udp' },
      { text: 'Http', link: '/http/http' },
      { text: 'Https', link: '/http/https' },
      { text: 'Cache', link: '/http/cache' },
      { text: 'Csp', link: '/http/csp' },
      { text: 'Hand', link: '/http/hand' },
      { text: 'Url-to-page', link: '/http/url-to-page' }
    ]
  },
  { text: 'TypeScript', link: '/typescript/' },
  {
    text: 'Engineering',
    link: '/engineering/',
    items: [
      { text: 'Engineering', link: '/engineering/' },
      { text: 'Module', link: '/engineering/module' },
      { text: 'Base', link: '/engineering/base' },
      { text: 'Package', link: '/engineering/package' },
      { text: 'Monorepo', link: '/engineering/monorepo' },
      { text: 'Eslint', link: '/engineering/eslint' },
      { text: 'Gitflow', link: '/engineering/gitflow' },
      { text: 'Vite', link: '/engineering/vite' },
      { text: 'Unbuild', link: '/engineering/unbuild' },
      { text: 'Webpack', link: '/engineering/webpack' },
      { text: 'Gulp', link: '/engineering/gulp' },
      { text: 'Cli', link: '/engineering/cli' }
    ]
  },
  {
    text: 'Micro FE',
    link: '/microfe/',
    items: [
      { text: 'Microfe', link: '/microfe/' },
      { text: 'Federation', link: '/microfe/federation' },
      { text: 'Microapp', link: '/microfe/microapp' },
      { text: 'Wujie', link: '/microfe/wujie' }
    ]
  },
  { text: 'Vue', link: '/vue/' },
  {
    text: 'Browser',
    link: '/browser/',
    items: [
      { text: 'Browser', link: '/browser/' },
      { text: 'V8-gc', link: '/browser/v8-gc' },
      { text: 'Eventloop', link: '/browser/eventloop' },
      { text: 'Asyncapi', link: '/browser/asyncapi' },
      { text: 'Layer', link: '/browser/layer' },
      { text: 'Extension', link: '/browser/extension' }
    ]
  },
  {
    text: 'JavaScript',
    link: '/javascript/',
    items: [
      { text: 'JavaScript', link: '/javascript/' },
      { text: 'Js', link: '/javascript/js' },
      { text: 'Hoisting', link: '/javascript/hoisting' },
      { text: 'Stack', link: '/javascript/stack' },
      { text: 'Scope', link: '/javascript/scope' },
      { text: 'Scope-chain', link: '/javascript/scope-chain' },
      { text: 'This', link: '/javascript/this' },
      { text: 'New', link: '/javascript/new' },
      { text: 'Instanceof', link: '/javascript/instanceof' },
      { text: 'Call-apply-bind', link: '/javascript/call-apply-bind' },
      { text: 'Throttle-debounce', link: '/javascript/throttle-debounce' },
      { text: 'Deep-clone', link: '/javascript/deep-clone' },
      { text: 'Chain', link: '/javascript/chain' },
      { text: 'Curry', link: '/javascript/curry' },
      { text: 'Tail-call', link: '/javascript/tail-call' },
      { text: 'Sparse-array', link: '/javascript/sparse-array' },
      { text: 'Code', link: '/javascript/code' }
    ]
  },
  {
    text: 'Promise',
    link: '/promise/',
    items: [
      { text: 'Promise', link: '/promise/' },
      { text: 'All', link: '/promise/all' },
      { text: 'Promise', link: '/promise/promise' },
      { text: 'Promisify', link: '/promise/promisify' },
      { text: 'Max-request', link: '/promise/max-request' }
    ]
  },
  {
    text: 'Node',
    link: '/node/',
    items: [
      { text: 'Node', link: '/node/' },
      { text: 'Eventloop', link: '/node/eventloop' }
    ]
  },
  {
    text: 'Css',
    link: '/css/',
    items: [
      { text: 'Css', link: '/css/' },
      { text: 'Flex', link: '/css/flex' },
      { text: 'Grid', link: '/css/grid' },
      { text: 'Scoped', link: '/css/scoped' },
      { text: 'Wind', link: '/css/wind' },
      { text: 'Mobile', link: '/css/mobile' },
      { text: 'Margin', link: '/css/margin' },
      { text: 'Inline-block', link: '/css/inline-block' },
      { text: 'Bfc', link: '/css/bfc' },
      { text: 'Center', link: '/css/center' }
    ]
  },
  {
    text: 'Web',
    link: '/web/',
    items: [
      { text: 'Web', link: '/web/' },
      { text: 'Pattern', link: '/web/pattern' },
      { text: 'Threejs', link: '/web/threejs' },
      { text: 'Interview', link: '/web/interview' }
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
  head: [['link', { rel: 'icon', href: 'favico.ico' }]],
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    logo: '/logo.svg',

    nav,
    sidebar,

    outline: {
      level: 'deep',
      label: ''
    },

    search: {
      provider: 'local'
    },

    socialLinks: [{ icon: 'github', link: 'https://gitee.com/lafen' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present LAFEN'
    }
  }
})
