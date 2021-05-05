module.exports = {
  devServer: {
    proxy: {
      'mailbox': {
        target: "https://www1.szu.edu.cn/mailbox/",
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/mailbox': ''
        }
      }
    }
  },
}