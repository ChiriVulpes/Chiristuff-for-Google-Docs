setInterval(() => {
	var pickerhtml = document.querySelector("[current-url^='https://docs.google.com/picker']");
	if (pickerhtml) {
		pickerhtml.id = "picker";
		
		var header = document.querySelector("#doclist > * > * > [style*='height:']");
		header?.classList.add("picker-header");
		
		var main = document.querySelector("#doclist > * > * > [style*='top:']");
		main?.classList.add("picker-main");
        
		/* footer */
		var footer = main.querySelector(":scope > * > [style*='height:']");
		footer?.classList.add("picker-footer");

		var newFolderButton = footer.querySelector("[role='button'][aria-label='New Folder']");
		newFolderButton?.classList.add("picker-button");

		var moveButton = footer.querySelector("[role='button']:not([aria-label='New Folder'])");
		moveButton?.classList.add("picker-button-default");

		/* contents */
		var contentsWrapper = main.querySelector(":scope > * > [style*='bottom:']");
		contentsWrapper?.classList.add("picker-contents-wrapper");

		var contents = contentsWrapper.querySelector(":scope > * > :not([style*='display: none']) > [role='group']");
		contents?.classList.add("picker-contents");

		var filelist = contents.querySelector(":scope > [role='menu']");
		filelist?.classList.add("picker-filelist");

		filelist.querySelectorAll("[role='menuitem']")
			.forEach(menuitem => menuitem.classList.add("picker-file"));

		var activedescendant = filelist?.getAttribute("aria-activedescendant");
		filelist.querySelector(`.picker-focused-file:not([id="${activedescendant}"])`)?.classList.remove("picker-focused-file");
		filelist.querySelector(`.picker-file[id="${activedescendant}"]:not(.picker-focused-file)`)?.classList.add("picker-focused-file");
	}
}, 50);
