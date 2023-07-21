document.getElementById("docs-branding-container")
	?.addEventListener("contextmenu", toggleZenMode);

function toggleZenMode(e) {
	document.documentElement.classList.toggle("zen-mode");
	document.activeElement.blur();
	forceRecenterDocument();
	if (e) e.preventDefault();
}

function toggleZenModeNoComments(e) {
	document.documentElement.classList.toggle("zen-mode-no-comments");
	if (e) e.preventDefault();
}

setInterval(() => {
	const commentsButton = document.getElementById("docs-docos-commentsbutton");
	if (commentsButton) commentsButton.addEventListener("contextmenu", toggleZenModeNoComments);
	
	const editorWrapper = document.querySelector(".kix-appview-editor");
	document.documentElement.classList.toggle("has-horizontal-scrollbar",
		editorWrapper && editorWrapper.scrollWidth > editorWrapper.clientWidth);

	const horizontalRuler = document.getElementById("kix-horizontal-ruler");
	document.documentElement.classList.toggle("has-horizontal-ruler",
		horizontalRuler && horizontalRuler.style.display !== "none");

	const verticalRuler = document.getElementById("kix-vertical-ruler");
	document.documentElement.classList.toggle("has-vertical-ruler",
		verticalRuler && verticalRuler.style.display !== "none");

	const documentPlugin = document.querySelector(".kix-paginateddocumentplugin, .kix-canvas-tile-content");
	if (documentPlugin)
		document.documentElement.style.setProperty("--document-width", 
			`${documentPlugin.getBoundingClientRect().width}px`);

	// custom keyboard shortcuts
	const editingIFrame = document.querySelector("iframe.docs-texteventtarget-iframe");
	if (editingIFrame) {
		editingIFrame.contentDocument.addEventListener("keydown", onZenModeKeydown, false);
	}
	
	document.querySelectorAll(".kix-cursor > .kix-cursor-caret")
		.forEach(cursor => cursor.parentElement
			 .classList.toggle("others-cursor", !cursor.matches("[style*='border-color: rgb(170, 170, 170)']")));
}, 500);

window.addEventListener("mousemove", event => {
	document.documentElement.classList.toggle("right-side-hovered", window.innerWidth - event.clientX < 200);
	document.documentElement.classList.toggle("top-hovered-close", event.clientY < 105);
	document.documentElement.classList.toggle("top-hovered", event.clientY < 210);
});


function forceRecenterDocument() {
	const appSwitcherButton = document.querySelector(".companion-collapser-button-container .app-switcher-button");
	simulateClick(appSwitcherButton);
	simulateClick(appSwitcherButton);
	simulateEvent(appSwitcherButton, "blur");
	appSwitcherButton.classList.remove("app-switcher-button-hover");
}


// Event handler for keydowns
async function onZenModeKeydown(e) {

	// toggle zen mode
	if (e.code === "F11" && e.altKey) {
		toggleZenMode(e);
		return false;
	}
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
