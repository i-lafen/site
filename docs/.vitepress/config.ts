import { defineConfig } from 'vitepress'

const nav = [
  {
    text: 'LeetCode',
    link: '/leetcode/',
    items: [
      '/leetcode',
      '/leetcode/link',
      '/leetcode/tree',
      '/leetcode/array',
      '/leetcode/string',
      '/leetcode/pointer',
      '/leetcode/number',
      '/leetcode/dp',
      '/leetcode/lru',
    ]
  },
  {
    text: 'Http',
    link: '/http/',
    items: [
      '/http/',
      '/http/tcp-ip-udp',
      '/http/http',
      '/http/https',
      '/http/cache',
      '/http/csp',
      '/http/hand',
      '/http/url-to-page',
    ]
  },
  {
    text: 'TypeScript',
    link: '/typescript/',
  },
  {
    text: 'Engineering',
    link: '/engineering/',
    items: [
      '/engineering/',
      '/engineering/module',
      '/engineering/base',
      '/engineering/package',
      '/engineering/monorepo',
      '/engineering/eslint',
      '/engineering/gitflow',
      '/engineering/vite',
      '/engineering/unbuild',
      '/engineering/webpack',
      '/engineering/gulp',
      '/engineering/cli',
    ]
  },
  {
    text: 'Micro FE',
    link: '/microfe/',
    items: [
      '/microfe/',
      '/microfe/federation',
      '/microfe/microapp',
      '/microfe/wujie',
    ]
  },
  {
    text: 'Vue',
    link: '/vue/',
  },
  {
    text: 'Browser',
    link: '/browser/',
    items: [
      '/browser/',
      '/browser/v8-gc',
      '/browser/eventloop',
      '/browser/asyncapi',
      '/browser/layer',
      '/browser/extension',
    ]
  },
  {
    text: 'JavaScript',
    link: '/javascript/',
    items: [
      '/javascript/',
      '/javascript/js',
      '/javascript/hoisting',
      '/javascript/stack',
      '/javascript/scope',
      '/javascript/scope-chain',
      '/javascript/this',
      '/javascript/new',
      '/javascript/instanceof',
      '/javascript/call-apply-bind',
      '/javascript/throttle-debounce',
      '/javascript/deep-clone',
      '/javascript/chain',
      '/javascript/curry',
      '/javascript/tail-call',
      '/javascript/sparse-array',
      '/javascript/code',
    ]
  },
  {
    text: 'Promise',
    link: '/promise/',
    items: [
      '/promise/',
      '/promise/all',
      '/promise/promise',
      '/promise/promisify',
      '/promise/max-request',
    ]
  },
  {
    text: 'Node',
    link: '/node/',
    items: [
      '/node/',
      '/node/eventloop',
    ]
  },
  {
    text: 'Css',
    link: '/css/',
    items: [
      '/css/',
      '/css/flex',
      '/css/grid',
      '/css/scoped',
      '/css/wind',
      '/css/mobile',
      '/css/margin',
      '/css/inline-block',
      '/css/bfc',
      '/css/center',
    ]
  },
  {
    text: 'Web',
    link: '/web/',
    items: [
      '/web/',
      '/web/pattern',
      '/web/threejs',
      '/web/interview',
    ]
  },
]

const sidebar = nav.reduce((res: Record<string, string[]>, cur: typeof nav[0]) => {
  if (cur.link && cur.items?.length) res[cur.link] = [...cur.items]
  return res
}, {} as Record<string, string[]>)

const base = '/site/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  title: "LAFEN",
  description: "🍒Personal Blog🍒",
  head: [['link', { rel: 'icon', href: base + 'images/logo.svg' }]],
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' }
    // ],

    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],

    logo: base + 'images/logo.svg',

    nav,
    // sidebar,

    docFooter: {
      prev: true,
      next: true,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present LAFEN'
    }
  }
})
