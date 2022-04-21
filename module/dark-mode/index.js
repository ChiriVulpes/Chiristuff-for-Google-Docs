setInterval(() => {
	document.querySelectorAll("[current-url^='https://docs.google.com/picker'], [aria-label='Drive'][role='dialog']")
		.forEach(pickerhtml => {
			pickerhtml.id = "picker";
		
			var doclist = pickerhtml.querySelector("#doclist");

			var header = doclist?.querySelector(":scope > * > * > [style*='height:']")
				?? pickerhtml.querySelector(":scope > * > * > [style*='height:']");
			header?.classList.add("picker-header");

			var main = doclist?.querySelector(":scope > * > * > [style*='top:']")
				?? pickerhtml.querySelector(":scope > * > * > [style*='top:']");
			main?.classList.add("picker-main");

			/* footer */
			var footer = main?.querySelector(":scope > * > [style*='height:']");
			footer?.classList.add("picker-footer");

			var newFolderButton = footer?.querySelector("[role='button'][aria-label='New Folder']");
			newFolderButton?.classList.add("picker-button");

			var moveButton = footer?.querySelector("[role='button']:not([aria-label='New Folder'])");
			moveButton?.classList.add("picker-button-default");

			/* contents */
			var contentsWrapper = main?.querySelector(":scope > * > [style*='bottom:']");
			contentsWrapper?.classList.add("picker-contents-wrapper");

			var contents = contentsWrapper?.querySelector(":scope > * > :not([style*='display: none']) > [role='group']");
			contents?.classList.add("picker-contents");

			var filelist = contents?.querySelector(":scope > [role='menu']");
			filelist?.classList.add("picker-filelist");

			filelist?.querySelectorAll("[role='menuitem']")
				.forEach(menuitem => menuitem.classList.add("picker-file"));

			var activedescendant = filelist?.getAttribute("aria-activedescendant");
			filelist?.querySelector(`.picker-focused-file:not([id="${activedescendant}"])`)?.classList.remove("picker-focused-file");
			filelist?.querySelector(`.picker-file[id="${activedescendant}"]:not(.picker-focused-file)`)?.classList.add("picker-focused-file");
		
			/* Google Drive picker */
			if (pickerhtml.getAttribute("role") === "dialog") {
				pickerhtml.firstElementChild?.firstElementChild?.classList.add("picker-min-arrow-inner");
				pickerhtml.firstElementChild?.lastElementChild?.classList.add("picker-min-arrow-border");
			}
		});
	
	document.querySelectorAll(".kix-canvas-tile-content rect[fill='rgba(34,34,34,1)']")
		.forEach(rect => rect.closest(".kix-canvas-tile-content").classList.add("inherent-dark-bg"));
	
	document.querySelectorAll("canvas.kix-canvas-tile-content")
		.forEach(canvas => {
			const background = canvas.getContext("2d").getImageData(0, 0, 1, 1).data
				.slice(0, 3)
				.map(ch => ch.toString(16).padStart(2, "0"))
				.join("");
			if (background === "222222")
				canvas.classList.add("inherent-dark-bg");
		});
			
	/* Google Drive classes */
	var driveMainPage = document.getElementById("drive_main_page");
	var driveBackground = driveMainPage?.children[1];
	driveBackground?.classList.add("drive-background");

	var driveHeader = driveBackground?.querySelector(":scope > :first-child > * > * > *");
	driveHeader?.classList.add("drive-header");
	
	driveMainPage?.querySelectorAll("[data-target='sidebar'] > * > [data-label='SINGLE'] > * > * > *")
		.forEach(sidebarPanel => {
			sidebarPanel.classList.add("drive-sidebar-panel");
			sidebarPanel.lastElementChild.firstElementChild.classList.add("drive-sidebar-panel-body");
		});
}, 50);
