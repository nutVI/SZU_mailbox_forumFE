# mailbox
使用vue和Element-UI开发的能在校务信箱发表评论的油猴脚本, 借鉴了此项目<a herf="https://github.com/huangxubo23/tampermonkey-vue">https://github.com/huangxubo23/tampermonkey-vue</a>


## 安装到油猴脚本
浏览器准备<a herf="https://github.com/kalilacc/Tampermonkey-Installer">油猴脚本</a>  
将打包后的文件`dist/tampermonkey.js`复制进入脚本编辑页面即可
- 也可在此处<a href="https://greasyfork.org/zh-CN/scripts/421424-szu-mailbox">https://greasyfork.org/zh-CN/scripts/421424-szu-mailbox</a>直接安装

## 配置文件
### `config/setting.json`
```json
{
  "name": "name",               //脚本名称
  "description": "description", //脚本描述
  "author": "author",           //脚本作者
  "url": "url"                  //脚本匹配URl
}
```
### `config/tampermonkey.js`
阅读油猴文档<a href="https://www.tampermonkey.net/documentation.php?ext=dhdg&locale=zh">https://www.tampermonkey.net/documentation.php?ext=dhdg&locale=zh</a>
### `config/webpack.config.js`
阅读webpack文档<a href="https://webpack.docschina.org/concepts/">https://webpack.docschina.org/concepts/</a>
### `config/build.js`
在webpack打包后重写为标准的油猴脚本
## 安装
```
npm install
```

### 开发
```
npm run serve
```

### 打包
```
npm run build
输出的命令实际为: 
webpack --config config/webpack.config.js && node config/build.js
```

### eslint语法测试
```
npm run lint
```
