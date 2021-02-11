# mailbox
使用vue和Element-UI开发的能在校务信箱发表评论的油猴脚本, 借鉴了此项目<a herf="https://github.com/huangxubo23/tampermonkey-vue">https://github.com/huangxubo23/tampermonkey-vue</a>


## 安装到油猴脚本
浏览器准备<a herf="https://github.com/kalilacc/Tampermonkey-Installer">油猴脚本</a>  
将打包后的文件复制进入脚本编辑页面即可


## 配置文件
### setting
```json
{
  "name": "name",               //脚本名称
  "description": "description", //脚本描述
  "author": "author",           //脚本作者
  "url": "url"                  //脚本匹配URl
}
```
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
```

### eslint语法测试
```
npm run lint
```
