const fs = require('fs')

const mainJs = fs.readFileSync('dist/main.js', 'utf8')
const setting = JSON.parse(fs.readFileSync('config/setting.json', 'utf8'))

let tampermonkey = fs.readFileSync('config/tampermonkey.js', 'utf8')
tampermonkey = tampermonkey.replace('targetName', setting.name)
tampermonkey = tampermonkey.replace('targetDescription', setting.description)
tampermonkey = tampermonkey.replace('targetAuthor', setting.author)
tampermonkey = tampermonkey.replace('targetUrl', setting.url)

// fs.writeFileSync('dist/tampermonkey.js', tampermonkey + '\n' + '(function() {' + '\n    ' + mainJs + '\n' + '})();')
fs.writeFileSync('dist/tampermonkey.js', tampermonkey + '\n' + mainJs)