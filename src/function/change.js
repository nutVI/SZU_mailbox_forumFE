import api from './utils'

export default {
    changePrePage(root) {
        let prePage, nextPage;
        prePage = document.getElementById('prePage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(1)")

        nextPage = document.getElementById('nextPage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2)")
        this.hotLoad(prePage, nextPage, root)
    },

    hotLoad(prePage, nextPage, root) {
        root.POSTID = api.getPostID()

        this.changeInter(prePage, nextPage, root, prePage)
        this.changeInter(prePage, nextPage, root, nextPage)
    },

    changeInter(prePage, nextPage, root, currentPage) {
        let search = currentPage.search
        let url = currentPage.href

        currentPage.href = "javascript:void(0);"
        currentPage.onclick = () => {
            console.log(url, search)
            api.httpHtmlMethod("GET", url, {}, "gb2312").then((res) => {
                window.history.pushState(null, null, search);

                let html = res.match(/width="90%" bgcolor="#FFFFFF">([\s\S]*?)<\/table>/)[1];
                let id = res.matchAll(/\[<a href="(.*?)"/g)

                let changeTable =
                    document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table")
                if (changeTable) {
                    changeTable.innerHTML = html
                }

                prePage.href = (id.next()).value[1];
                nextPage.href = (id.next()).value[1];

                this.hotLoad(prePage, nextPage, root)
            })
        }
    }
}