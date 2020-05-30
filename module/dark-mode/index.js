setInterval(() => {
	var pickerhtml = document.querySelector("[current-url^='https://docs.google.com/picker']");
	if (pickerhtml) {
		pickerhtml.id = "picker";
		
		var header = document.querySelector("#doclist > * > * > [style*='height:']");
		header?.classList.add("picker-header");
		
		var main = document.querySelector("#doclist > * > * > [style*='top:']");
		main?.classList.add("picker-main");
		
		var contents = main.querySelector(":scope > * > * > * > :not([style*='display: none']) > [role='group']");
		contents?.classList.add("picker-contents");
	}
}, 500);
