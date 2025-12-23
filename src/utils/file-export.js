export function exportHTMLToDocx ({ html, filename }) {
  const blob = new Blob(['\uFEFF', html], {
    type: 'application/msword',
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.doc`
  a.click()
  URL.revokeObjectURL(url)
}
