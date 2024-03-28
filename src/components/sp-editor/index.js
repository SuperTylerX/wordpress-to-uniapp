export const linkFlag = '#-*=*-*=*-*=*@-link超链接标识link-@*=*-*=*-*=*-#'

export async function addLink(editorCtx, attr) {
  try {
    await new Promise((resolve, reject) => {
      editorCtx.insertText({
        text: linkFlag,
        success: resolve,
        fail: reject
      })
    })

    const res = await new Promise((resolve, reject) => {
      editorCtx.getContents({
        success: resolve,
        fail: reject
      })
    })

    const options = res.delta.ops
    const findex = options.findIndex(
      item => typeof item.insert === 'string' && item.insert.includes(linkFlag)
    )

    if (findex > -1) {
      const findOption = options[findex]
      const { insert: findInsert, attributes: findAttributes } = findOption

      const [prefix, suffix] = findInsert.split(linkFlag)

      const handleOps = []

      if (prefix) {
        handleOps.push(
          findAttributes ? { insert: prefix, attributes: findAttributes } : { insert: prefix }
        )
      }

      const linkOps = {
        insert: attr.text,
        attributes: {
          link: attr.href,
          textDecoration: attr.textDecoration || 'none',
          color: attr.color || '#007aff'
        }
      }
      handleOps.push(linkOps)

      if (suffix) {
        handleOps.push(
          findAttributes ? { insert: suffix, attributes: findAttributes } : { insert: suffix }
        )
      }

      options.splice(findex, 1, ...handleOps)

      editorCtx.setContents({ delta: { ops: options } })
      editorCtx.blur()
    } else {
      console.error('标识未找到')
    }
  } catch (error) {
    console.error('添加链接失败:', error)
  }
}
