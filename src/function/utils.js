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
  getPostID() {
    let postPath = document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2)")
    const query = postPath.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split("=");
      if (pair[0] == "id") {
        return pair[1];
      }
    }
    return (false);
  },
  loadInit() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdn.jsdelivr.net/npm/element-ui@2.15.0/lib/theme-chalk/index.min.css';
    link.media = 'all';
    document.head.appendChild(link);

    const oMeta = document.createElement('meta');
    oMeta.content = 'no-referrer';
    oMeta.name = 'referrer';
    document.head.appendChild(oMeta);

    let father = document.getElementById('testVueToTamper') ||
      document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td")
    if (!this.getQueryVariable("id")) {
      father = document.body
    }

    const divApp = document.createElement('div')
    divApp.id = 'app'
    father.append(divApp)
  },
  getLength(str) {
    const ele = document.getElementById('textLength')
    ele.textContent = str
    const length = ele.clientWidth
    ele.textContent = ''
    return Math.ceil(length / 664) * 23
  },
  getLength14Size(str) {
    const ele = document.getElementById('textLength')
    ele.textContent = str
    const length = ele.clientWidth
    ele.textContent = ''
    return length
  },
  getASPSESSION() {
    if (process.env.VUE_APP_ENVIRONMENT === "development")
      return "ASPSESSIONIDSCQAQTQD=PFJKGCPCINBEFJOKFBOBJOKH"
    let cookieStr = document.cookie.split('; ');
    let cookies = "null";
    let isFirst = true;
    for (let i = 0; i < cookieStr.length; i++) {
      if (cookieStr[i].indexOf("ASPSESSION") !== -1) {
        if (isFirst) {
          cookies = cookieStr[i];
          isFirst = false;
        } else {
          cookies += '---' + cookieStr[i];
        }
      }
    }
    return cookies
  },
  async httpJsonMethod(method, url, data) {
    url = process.env.VUE_APP_Url + url
    const xml = new XMLHttpRequest();
    xml.withCredentials = true
    let str = '';
    let isFirst = true;
    for (const i in data) {
      if (isFirst) {
        isFirst = false;
        if (method == 'GET' || method == 'DELETE') {
          str += '?'
        }
        str += i + '=' + data[i]
      } else str += '&' + i + '=' + data[i]
    }

    if (method == 'GET' || method == 'DELETE') {
      xml.open(method, url + str);
      xml.send(null);
    } else if (method == 'POST') {
      xml.open(method, url);
      xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xml.send(str);
    }
    return new Promise((resolve, reject) => {
      xml.onload = () => {
        if (xml.status == 200) {
          resolve(JSON.parse(xml.responseText))
        } else reject(xml.responseText);
      }
    })
  },

  async httpHtmlMethod(method, url, data, charset) {
    const xml = new XMLHttpRequest();
    xml.withCredentials = true
    let str = '';
    let isFirst = true;
    for (const i in data) {
      if (isFirst) {
        isFirst = false;
        if (method == 'GET' || method == 'DELETE') {
          str += '?'
        }
        str += i + '=' + data[i]
      } else str += '&' + i + '=' + data[i]
    }

    if (method == 'GET' || method == 'DELETE') {
      xml.open(method, url + str);
      if (charset != undefined)
        xml.overrideMimeType("text/html;charset=" + charset)
      xml.send(null);
    } else if (method == 'POST') {
      xml.open(method, url);
      xml.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xml.send(str);
    }
    return new Promise((resolve, reject) => {
      xml.onload = () => {
        if (xml.status == 200) {
          resolve(xml.responseText)
        } else reject(xml.responseText);
      }
    })
  },
}