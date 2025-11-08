import i18n from '../plugins/i18n'
export function changeLang (isKh) {
  const lng = isKh ? 'kh' : 'en'
  i18n.global.locale = lng
  // console.log(isKh);
  // localStorage.setItem("lng", lng);
}
