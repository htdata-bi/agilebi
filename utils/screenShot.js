const puppeteer = require('puppeteer');
const logger = require('./logger.js');
module.exports = async (url, selecter, screenshotingTemPath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try{
        await page.goto(url,{
            waitUntil: ['load', 'networkidle2']
        });
        await page.setViewport({
            width: 1920,
            height: 1080,
            deviceScaleFactor: 2
        });
        await page.waitForFunction(() => {
            // 判断所有的需要加载（可视区域）图表加载完成
            const nodeListGS = document.querySelectorAll('.gridstack-item-mask');
            let nodeArray = [];
            for (var i = 0; i < nodeListGS.length; i++) {
                nodeArray.push(nodeListGS[i]);
            }
            return nodeArray.every((item) => {
                return getComputedStyle(item).display === 'none' || item.querySelector('.err-mask p') && item.querySelector('.err-mask p').innerText !== '数据加载中...';
            });
        }, {
            timeout: 60000
        });
        const rect = await page.evaluate((selecter) => {
            const element = document.querySelector(JSON.parse(selecter));
            const {x, y, width, height} = element.getBoundingClientRect();
            return {x, y, width, height};
        }, JSON.stringify(selecter));
        await page.screenshot({
            path: screenshotingTemPath,
            clip: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
            }
        });
    }catch(error){
        await browser.close();
        logger.fatal(error);
    }
    await browser.close();
}