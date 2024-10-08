import fs from 'node:fs'
import path from 'node:path'

/**
 * 此版本 vitepress@1.0.0-rc.7 有时候会忽略 public 文件夹内容
 * 故暂时手动拷贝
 * 但是现在貌似不会了，先不用了
 */
const init = async () => {
  const sourceDir = './docs/.vitepress/public'
  const destDir = './docs/.vitepress/dist/'

  try {
    const files = await fs.promises.readdir(sourceDir, { withFileTypes: true })
  
    for (const file of files) {
      const sourcePath = path.join(sourceDir, file.name)
      const destPath = path.join(destDir, file.name)
      await fs.promises.copyFile(sourcePath, destPath)
      console.log(`[copy success]：${file.name} has been copied to ${destDir}`)
    }
  } catch (err) {
    console.error(err)
  }
}

init()
