import api from './utils'

export default {
    changePrePage(root) {
        root.POSTID = api.getPostID()
        let prePage, nextPage;
        prePage = document.getElementById('prePage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(1)")

        nextPage = document.getElementById('nextPage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2)")
        this.hotLoad(prePage, nextPage, root)
    },

    hotLoad(prePage, nextPage, root) {
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

                let html = res.match(/width="90%" bgcolor="#FFFFFF">([\s\S]*?)<\/table>/)[1];
                let id = res.matchAll(/\[<a href="(.*?)"/g)

                let changeTable =
                    document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table")
                if (changeTable) {
                    changeTable.innerHTML = html
                }

                prePage.href = (id.next()).value[1];
                nextPage.href = (id.next()).value[1];
                root.POSTID = api.getPostID()

                window.history.pushState({
                    table: html,
                    prePage: prePage.href,
                    nextPage: nextPage.href,
                    postid: root.POSTID
                }, document.title, search);

                document.title = res.match(/(<title>=?)(.*?)(?=<\/title>)/)[2]
                this.hotLoad(prePage, nextPage, root)
            })
        }
    },

    popstateListen(event, root) {
        console.log(event.state, root)
        root.POSTID = event.state.postid
        
        let prePage, nextPage;
        prePage = document.getElementById('prePage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(1)")

        nextPage = document.getElementById('nextPage') ||
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2)")

        prePage.href = event.state.prePage
        nextPage.href = event.state.nextPage

        let changeTable =
            document.querySelector("body > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(2) > td > table")
        if (changeTable) {
            changeTable.innerHTML = event.state.table
        }

        this.hotLoad(prePage, nextPage, root)
    }
}