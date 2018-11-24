import I18n from 'i18n-js'

export const TYPES = {
  text: 'text',
  other: 'other',
  table: 'table',
  execuse_error: 'execuse_error',
  execuse_result: 'execuse_result'
}

export function covertMessage (type, message) {
  let markdown = ''
  try {
    switch (type) {
      case TYPES.other:
        return `
<pre>
${message}
</pre>
`
      case TYPES.execuse_result:
      case TYPES.execuse_error:
        return `
<pre>
${message}
</pre>
`
      case TYPES.table:
        markdown = `
<div style='overflow-x: scroll'>

| ${I18n.t('playground.index')} | ${I18n.t('playground.name')} | ${I18n.t('playground.type')} | ${I18n.t('playground.value')} | ${I18n.t('playground.raw')} |
| ------- | ------- | ------- | ------- | ------- |
`
        message.forEach((item, index) => {
          markdown += `| ${index} | ${item.name} | ${item.type} | ${item.value} | ${item.raw} |\n`
        })
        markdown += ' </div> '
        return markdown
      case TYPES.text:
      default:
        return message
    }
  } catch (err) {
    return message
  }
}
