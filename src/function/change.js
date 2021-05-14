import api from './utils'

export default {
    changePrePage() {
        let prePage, nextPage;
        prePage = document.getElementById('prePage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(1)")

        nextPage = document.getElementById('nextPage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2)")
        this.hotLoad(prePage, nextPage)
    },

    hotLoad(prePage, nextPage) {
        let url = nextPage.href
        nextPage.href = "javascript:void(0);"
        nextPage.onclick = () => {
            api.httpHtmlMethod("GET", url, {}, "gb2312").then((res) => {
                let html = res.match(/width="90%" bgcolor="#FFFFFF">([\s\S]*?)<\/table>/)[1];
                let id = res.matchAll(/\[<a href="(.*?)"/g)

                let changeTable =
                    document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table")
                if (changeTable) {
                    changeTable.innerHTML = html
                }

                prePage.href = (id.next()).value[1];
                nextPage.href = (id.next()).value[1];

                this.hotLoad(prePage, nextPage)
            })
        }

        let url2 = prePage.href
        prePage.href = "javascript:void(0);"
        prePage.onclick = () => {
            api.httpHtmlMethod("GET", url2, {}, "gb2312").then((res) => {
                let html = res.match(/width="90%" bgcolor="#FFFFFF">([\s\S]*?)<\/table>/)[1];
                let id = res.matchAll(/\[<a href="(.*?)"/g)

                let changeTable =
                    document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table")
                if (changeTable) {
                    changeTable.innerHTML = html
                }

                prePage.href = (id.next()).value[1];
                nextPage.href = (id.next()).value[1];

                this.hotLoad(prePage, nextPage)
            })
        }
    }
}