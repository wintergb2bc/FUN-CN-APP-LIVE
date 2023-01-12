if (process.browser) {
    setTimeout(() => {
        let script1 = document.createElement('script');
		script1.src = 'https://mpsnare.iesnare.com/snare.js';
		script1.type = 'text/javascript';
		document.querySelectorAll('body')[0].appendChild(script1);
        let script2 = document.createElement('script');
        script2.src = 'https://e2.platform88798.com/E2/EagleEye.js';
        script2.type = 'text/javascript';
        document.querySelectorAll('body')[0].appendChild(script2);
    }, 5000);
}