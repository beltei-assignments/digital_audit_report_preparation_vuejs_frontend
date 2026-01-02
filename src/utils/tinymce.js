const isProd = import.meta.env.PROD
const fontFolder = isProd ? '/assets/fonts' : '/src/assets/fonts'

export const IMPORT_FONT_STYLES = `
  @font-face {
    font-family: 'Tacteing';
    src: url('${fontFolder}/Tacteing.ttf') format('truetype');
  }
  @font-face {
    font-family: 'Verdana';
    src: url('${fontFolder}/Verdana.ttf') format('truetype');
  }
`
