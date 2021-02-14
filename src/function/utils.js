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
    if (process.env.VUE_APP_ENVIRONMENT === "development")
      return "ASPSESSIONIDQCSDTSTA=LIIFIFGADHONCKDLNHAANEJE"
    let cookieStr = document.cookie.split('; ');
    let cookies = "null";
    let isFirst = true;
    for (const i in cookieStr) {
      if (cookieStr[i].indexOf("ASPSESSION") !== -1) {
        if (isFirst) {
          cookies = cookieStr[i];
          isFirst = false;
        } else {
          cookies += '; ' + cookieStr[i];
        }
      }
    }
    return cookies
  },
  async httpMethod(method, url, data) {
    url = process.env.VUE_APP_Url + url
    const xml = new XMLHttpRequest();
    xml.withCredentials = true
    let str = '';
    let isFirst = true;
    for (const i in data) {
      if (isFirst) {
        isFirst = false;
        str += i + '=' + data[i]
      } else str += '&' + i + '=' + data[i]
    }

    if (method == 'GET' || method == 'DELETE') {
      xml.open(method, url + '?' + str);
      xml.send(null);
    } else if (method == 'POST') {
      xml.open(method, url);
      xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xml.send(str);
    }
    return new Promise((resolve, reject) => {
      xml.onload = () => {
        if (xml.status == 200) resolve(JSON.parse(xml.responseText))
        else reject(xml.responseText);
      }
    })
  },
}