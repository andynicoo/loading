const path = require('path');
const fs = require('fs');
const watch = require('gulp-watch');

let requestMap = [];
let isInit = false;
const configFilePath = path.join(__dirname, 'config.json');

/**
 * 监听配置文件，实现热加载
 */
function liveReload(){
    loadConfig();
    watch([configFilePath], loadConfig);
    isInit = true;
}


function loadConfig() {
    let str = fs.readFileSync(configFilePath);
    requestMap = JSON.parse(str)
    console.log(requestMap);
}

/**
 * 代理json请求到本地文件
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 * @returns 
 * 
 */
function handleJsonRequrest(req, res, next) {
    let i, len, item,reg,
        url = req.url,
        pathStr,
        fullPath;
    // console.log(url);
    // 第一次请求时加载代理配置
    if(!isInit) liveReload();
    // 遍历规则映射
    for (i = 0, len = requestMap.length; i < len; i++) {
        item = requestMap[i];
        reg = new RegExp(item.reg);
        if (reg.test(url)) {
            if (item.local.indexOf("$") > 0) {
                pathStr = url.replace(reg, item.local);
            } else {
                pathStr = item.local;
            }
            fullPath = path.join(__dirname, pathStr);
            // console.log(__dirname,pathStr,fullPath);
            // 检查文件路径是否存在
            if (fs.existsSync(fullPath)) {
                console.log("catch ", url, " -> ", fullPath);
                // 获取文件信息
                var stat = fs.statSync(fullPath);
                // 设置返回头
                res.writeHead(200, {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Content-Length': stat.size
                });

                var readStream = fs.createReadStream(fullPath);
                // We replaced all the event handlers with a simple call to readStream.pipe()
                readStream.pipe(res);
                return;
            }
        }
    }
    next();
}

exports.handleJsonRequrest = handleJsonRequrest;