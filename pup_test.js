const puppeteer = require("puppeteer");

;(async function() {
	for(var i = 0; i < 10; i++) {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		page.on('console', msg => console.log('PAGE LOG:', msg.text()));
		await page.goto('http://localhost:8080/');
		await page.evaluate(async () => {
			let float32 = await getFloat32();
			let obj = getObj(float32);
			await runBVHBuilderOld(obj);
		});
		await browser.close();
	}
})();
