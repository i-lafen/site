import fs from 'node:fs'
import path from 'node:path'
import { NavItem } from './type'

/**
 * 自动匹配文章生成 nav 配置，但是乱序
 * @returns initNavAuto: Function
 */
const useInitNavAuto = () => {
  const sourceDir = path.join(__dirname, '../../docs/')
  const ignoreDirs = ['.vitepress', 'index.md', 'guide', 'public']
  const ignoreImgs = ['images']
  
  const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1)
  const paddingStr = str => `/${str}/`
  const removeMd = str => str?.replace('.md', '')
  const dealText = str => str?.split('-')?.map(n => capitalizeFirstLetter(n))?.join(' ') ?? ''
  const isIndex = str => str?.toUpperCase()?.startsWith('INDEX')
  
  const initNavAuto = async () => {
    // 文章文件夹路径
    const dirs = await fs.promises.readdir(sourceDir)
    const postDirs = dirs.filter(dir => !ignoreDirs.includes(dir))
    const nav: NavItem[] = []
    // 遍历文章文件夹路径
    for (const postDir of postDirs) {
      const files = await fs.promises.readdir(path.join(sourceDir, postDir))
      const fileNames = files.filter(name => !ignoreImgs.includes(name))
      const link = paddingStr(postDir)
      const text = capitalizeFirstLetter(postDir)
      // 遍历文章文件名，和文件夹拼接
      const items = fileNames.map(name => {
        const _name = removeMd(name)
        const _link = isIndex(_name) ? link : `${link}${_name}`
        const _text = dealText(_name)
        return { link: _link, text: _text }
      })
      // 将 index 移到首位
      const index = items.findIndex(item => isIndex(item.text))
      const [_item] = items.splice(index, 1)
      items.unshift(_item)
      nav.push({ link, text, items })
    }
    return nav
  }

  return initNavAuto
}

export default useInitNavAuto
