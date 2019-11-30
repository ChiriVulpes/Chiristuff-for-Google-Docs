
setInterval(() => {

	// custom keyboard shortcuts
	const editingIFrame = document.querySelector("iframe.docs-texteventtarget-iframe");
	if (editingIFrame) {
		editingIFrame.contentDocument.addEventListener("keydown", onKeydown, false);
	}

	const urlInput = document.querySelector(".docs-link-urlinput-url");
	if (urlInput) {
		urlInput.addEventListener("input", filterLinkHeaders, false);
	}

	// make dictionary entries link to google dictionary searches
	document.querySelectorAll(".docs-explore-dictionaryentry-title")
		.forEach(title => {
			const newTitle = document.createElement("a");
			newTitle.textContent = title.textContent;
			newTitle.href = `https://google.com/search?q=define+${title.textContent.replace(/ /g, "+")}`;
			newTitle.classList.add("docs-explore-dictionaryentry-title");
			title.parentElement.replaceChild(newTitle, title);
		});

	// inaccurate live word count fallback
	const wordCountWrapper = document.getElementById("kix-documentmetrics-widget-content");
	const wordCountWrapperText = wordCountWrapper && wordCountWrapper.textContent;
	if (wordCountWrapperText && (wordCountWrapperText === "View word count" || wordCountWrapperText[0] === "~")) {
		const documentBody = document.querySelector(".kix-paginateddocumentplugin");
		const wordCount = documentBody && documentBody.textContent.split(/\s+/g).filter(v => v && /\w/.test(v)).length;
		wordCountWrapper.innerHTML = `~<span class="kix-documentmetrics-widget-number">${wordCount}</span> words`;
	}
}, 500);

// Event handler for keydowns
async function onKeydown(event) {

	// insert horizontal line
	if (event.code === "Minus" && event.ctrlKey && event.shiftKey) {
		simulateEvent(document.getElementById("docs-insert-menu"), "mousedown");
		simulateClick(document.querySelector("[aria-label='Horizontal line r']")
			.closest(".goog-menuitem"));
		event.preventDefault();
		return false;
	}

	// fill in find input with selected text
	if (event.code === "KeyF" && event.ctrlKey) {
		let findInput = document.querySelector(".docs-findinput-input");

		if (!findInput) {
			await sleep(10);
			findInput = document.querySelector(".docs-findinput-input");
		}

		simulateEvent(document.getElementById("docs-edit-menu"), "mousedown");
		const copyButton = document.querySelector("[aria-label='Copy c']")
			.closest(".goog-menuitem");
		simulateClick(copyButton);
		findInput.focus();

		if (copyButton.classList.contains("goog-menuitem-disabled")) {
			findInput.value = "";
			findInput.dispatchEvent(new Event("input", {
				'bubbles': true,
				'cancelable': true
			}));

		} else {
			document.execCommand("paste");
			findInput.select();
		}
	}

	// fill in link location with link text by default
	if (event.code === "KeyK" && event.ctrlKey) {
		await sleep(10);
		const text = document.querySelector(".docs-link-insertlinkbubble-text").value;
		const urlInput = document.querySelector(".docs-link-urlinput-url");
		if (urlInput && !urlInput.value) {
			urlInput.value = text;
			urlInput.dispatchEvent(new Event("input", {
				'bubbles': true,
				'cancelable': true
			}));
			filterLinkHeaders();
		}

	}
}

// filter the document headers in the link edit suggestion box to the ones that match the link location
async function filterLinkHeaders() {
	const headersButton = await waitForElement(".docs-link-infilelinksuggestiongroup-cb");

	const urlInput = document.querySelector(".docs-link-urlinput-url");
	if (!urlInput || !urlInput.value) return;

	if (!headersButton.classList.contains("docs-link-infilelinksuggestiongroup-cb-open")) {
		headersButton.classList.add("goog-zippy-expanded", "docs-link-infilelinksuggestiongroup-cb-open");
		headersButton.classList.remove("goog-zippy-collapsed");
		document.querySelector(".docs-link-infilelinksuggestiongroup-cb + .goog-zippy-content").style.display = null;
	}

	const searchWords = urlInput.value.trim().toLowerCase().split(/\s+/g);
	const headers = document.querySelectorAll(".docs-link-infilelinksuggestiongroup-cb + .goog-zippy-content > .docs-link-linksuggestion > .docs-link-linksuggestion-text");
	for (const header of headers) {
		const headerWords = header.textContent.trim().toLowerCase().split(/\s+/g);
		const filteredOut = !searchWords.every(searchWord => headerWords.some(word => word.startsWith(searchWord)));
		header.parentElement.classList.toggle("suggestion-filtered-out", filteredOut);
		header.parentElement.addEventListener("focus", onHeaderFocus, false);
	}
}

// when focus is on a header that's filtered out, move to the next unfiltered header (or other link)
function onHeaderFocus(event) {
	const header = event.target;
	if (header.classList.contains("suggestion-filtered-out")) {
		let cursor = header;
		while ((cursor = cursor.nextElementSibling) && cursor.matches(".docs-link-linksuggestion")) {
			if (!cursor.classList.contains("suggestion-filtered-out")) {
				cursor.focus();
				return;
			}
		}
		if (!cursor) cursor = header;
		let groupCursor = cursor.closest(".docs-link-linksuggestiongroup");
		while (groupCursor = groupCursor.nextElementSibling) {
			cursor = groupCursor.querySelector("[tabindex='0']");
			if (cursor) {
				cursor.focus();
				return;
			}
		}
	}
}



// Outline Compression
function getLevel(nav) { return +(nav.getAttribute("aria-label") || "9").slice(-1); }

function updateNavItems() {
	document.querySelectorAll(".navigation-item:not([aria-label$='level 1'])").forEach(nav => {
		let affectingLevel = getLevel(nav) - 1;
		let cursor = nav;
		while (cursor = cursor.previousElementSibling) {
			const level = getLevel(cursor);
			if (level > affectingLevel) continue;
			affectingLevel = level - 1;
			cursor.classList.add("nav-directory-heading");
			const isOpen = cursor.classList.contains("open-nav-item");
			nav.classList.toggle("hidden-nav-item", !isOpen);
			if (!isOpen || affectingLevel === 0) break;
		}
	});
}

function onNavItemContextMenu(event) {
	event.stopPropagation();
	event.preventDefault();

	const nav = event.target.closest(".navigation-item");
	nav.classList.toggle("open-nav-item");
	updateNavItems();
}

function onNavHeaderContextMenu() {
	event.stopPropagation();
	event.preventDefault();

	const open = !document.querySelector(".open-nav-item");
	document.querySelectorAll(".nav-directory-heading")
		.forEach(heading => heading.classList.toggle("open-nav-item", open));
	updateNavItems();
}

setInterval(() => {
	updateNavItems();
	document.querySelectorAll(".navigation-item")
		.forEach(nav => nav.addEventListener("contextmenu", onNavItemContextMenu, false));
	document.querySelectorAll(".navigation-widget-hat")
		.forEach(header => header.addEventListener("contextmenu", onNavHeaderContextMenu, false));

	const findInput = document.querySelector(".docs-findinput-input");
	const findDialog = findInput && findInput.closest(".docs-slidingdialog");
	const isOpen = findDialog && findDialog.style.display !== "none";
	const findFilterWords = !isOpen ? "" : findInput.value
		.trim()
		.toLowerCase()
		.split(/\s+/g)
		.filter(w => w);

	document.querySelectorAll(".navigation-item")
		.forEach(nav => {
			let highlighted = findFilterWords.length > 0;
			if (highlighted) {
				const headerWords = nav.textContent.trim().toLowerCase().split(/\s+/g);
				highlighted = findFilterWords.every(word => headerWords.some(headerWord => headerWord.startsWith(word)));
			}
			nav.classList.toggle("nav-find-highlighted", highlighted);
		});
}, 500);





// Utilities

async function waitForElement(selector) {
	if (!selector) return;

	let element;
	do {
		element = document.querySelector(selector);
		await sleep(100);
	} while (!element);

	return element;
}

async function sleep(ms = 0) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


// Event simulation utilities

function simulateClick(element) {
	simulateEvent(element, "mousedown");
	simulateEvent(element, "mouseup");
	simulateEvent(element, "mouseup");
}

function simulateEvent(element, eventName) {
	var options = extend(defaultOptions, arguments[2] || {});
	var oEvent, eventType = null;

	for (var name in eventMatchers) {
		if (eventMatchers[name].test(eventName)) { eventType = name; break; }
	}

	if (!eventType)
		throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

	if (document.createEvent) {
		oEvent = document.createEvent(eventType);
		if (eventType == 'HTMLEvents') {
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		}
		else {
			oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
				options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
				options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
		}
		element.dispatchEvent(oEvent);
	}
	else {
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		var evt = document.createEventObject();
		oEvent = extend(evt, options);
		element.fireEvent('on' + eventName, oEvent);
	}
	return element;
}

function extend(destination, source) {
	for (var property in source)
		destination[property] = source[property];
	return destination;
}

var eventMatchers = {
	'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
	'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
	pointerX: 0,
	pointerY: 0,
	button: 0,
	ctrlKey: false,
	altKey: false,
	shiftKey: false,
	metaKey: false,
	bubbles: true,
	cancelable: true
}