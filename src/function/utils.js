export default {
  getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return (false);
  },
  getLength(str) {
    const ele = document.getElementById('textLength')
    ele.textContent = str
    const length = ele.clientWidth
    ele.textContent = ''
    return Math.ceil(length / 664) * 23
  },
  getASPSESSION() {
    return "ASPSESSIONIDQCRDQRRD=DNCFOFDBIPCLMNDPNIIOFIEE"
    // let cookieStr = document.cookie.split('; ');
    // let cookies = "null";
    // let isFirst = true;
    // for (const i in cookieStr) {
    //   if (cookieStr[i].indexOf("ASPSESSION") !== -1) {
    //     if (isFirst) {
    //       cookies = cookieStr[i];
    //       isFirst = false;
    //     } else {
    //       cookies += '; ' + cookieStr[i];
    //     }
    //   }
    // }
    // return cookies
  },
}