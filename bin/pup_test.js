const puppeteer = require("puppeteer");

;(async function() {
	for(var i = 1; i <= 10; i++) {
		//for(var j = 0; j < 4; j++) {
			const browser = await puppeteer.launch();
			const page = await browser.newPage();
			await page.tracing.start({path: 'trace.json'});
			//page.on('console', msg => console.log('PAGE LOG:', msg.text()));
			await page.goto('http://localhost:8080/');
			let first = await page.metrics()
			await page.evaluate('window.load()');
			let second = await page.metrics()
			await page.evaluate(`window.start(${i})`);
			let after = await page.metrics()
			const z = await page.evaluateHandle('window.z');
			const b = await page.queryObjects(z);
			const count = await page.evaluate(maps => maps.length, b);
			let afterer = await page.metrics();
			//await new Promise(res => setTimeout(res, 1000));
			//let last = await page.metrics()
			await page.tracing.stop();
			await browser.close();
			console.log([i, first.JSHeapUsedSize, second.JSHeapUsedSize, after.JSHeapUsedSize, afterer.JSHeapUsedSize].join(","));
		//}
	}
})();
