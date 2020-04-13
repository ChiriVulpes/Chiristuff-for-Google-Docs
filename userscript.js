let modules = [

	// comma-separated list of Chiristuff modules you want to opt into.
	// for a full list, see https://github.com/Yuudaari/Chiristuff-for-Google-Docs/tree/master/module
	// if you click on one of the modules on that page, it'll show a description of what it does
	
	"dark-mode",
	"zen-mode",
	"comments-sidebar",
	"misc",
];


// the "branch" of Chiristuff to use. usually you want to keep this set to "master"
const branch = "master";



// CONFIGURATION END
//////////////////////////////////////////////////////////




(async function () {
	
	async function getFile(file) {
		const baseurl = `https://raw.githubusercontent.com/Yuudaari/Chiristuff-for-Google-Docs/${branch}`;
		return fetch(`${baseurl}/${file}`)
			.then(r => r.ok ? (file.endsWith(".json") ? r.json() : r.text()) : undefined);
	}
	
	modules = modules
		.map(async module => ({
			name: module,
			js: await getFile(`module/${module}/index.js`),
			css: await getFile(`module/${module}/index.css`),
		}));

	modules = await Promise.all(modules);



	///////////////////////////////////////////////////////
	// CSS
	// applied in iframes as well
	
	const css = modules
		.filter(({css}) => css)
    	.map(({name, css}) => `/* ${name} */\n\n${css}`)
        .join("\n\n\n");
	
    const iframeURLs = await getFile("iframes.json");
    setInterval(() => {
    
        const documents = [document];
        const iframes = document.querySelectorAll(iframeURLs
        	.flatMap(url => [url, `https://docs.google.com${url}`])
        	.map(url => `iframe[src^="${url}"]`)
        	.join(","))
        	.forEach(iframe => {
                const frameDocument = iframe && iframe.contentDocument;
                const body = frameDocument && frameDocument.body;
                if (!body) return;
                documents.push(frameDocument);
        	});

        for (const doc of documents) {
        	doc.documentElement.setAttribute("current-url", doc.URL);
            const stylesheet = doc.getElementById("chiristuff") || doc.createElement("style");
            stylesheet.id = "chiristuff";
            stylesheet.textContent = css;
            if (!stylesheet.parentElement || doc.querySelector("#chiristuff ~ style, #chiristuff ~ link")) {
                doc.body.appendChild(stylesheet);
            }
        }
        
        document.documentElement.classList.add("show-everything");
        
    }, 100);
    
    
    
    ////////////////////////////////////////////////////////
    // JS
    
    for (const {name, js} of modules.filter(({js}) => js)) {
	    const script = document.createElement("script");
	    script.textContent = `/* ${name} */\n\n${js}`;
	    document.head.appendChild(script);
    }
	
})();
