const protocol = window.location.protocol
const host = window.location.host
const fontURL = `${protocol}//${host}/fonts`

export const IMPORT_FONT_STYLES = `
  @font-face {
    font-family: 'Tacteing';
    src: url('${fontURL}/Tacteing.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Verdana';
    src: url('${fontURL}/Verdana.ttf') format('truetype');
  }
`
