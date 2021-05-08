# Chiristuff-for-Google-Docs

A WIP extension for Google Docs that I'm too lazy to actually make an extension for.

## Using
1. Get a userscript & userstyle extension. 
	- On Chrome, I use [User JavaScript and CSS](https://chrome.google.com/webstore/detail/user-javascript-and-css/nbhcbdghjpllgmfilhnhkllmkecfmpld).
	- On Firefox, people have had success with [Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/) and [Stylish](https://addons.mozilla.org/en-US/firefox/addon/stylish). 
	- You can use whatever you fancy, though.
2. Add a userscript that targets `docs.google.com/document` with the content of [userscript.js](./userscript.js). (In the User JavaScript & CSS extension, this is the left side).
3. Add a userstyle that targets `docs.google.com/document` with the content of [userstyle.css](./userstyle.css). (In the User JavaScript & CSS extension, this is the right side).

## Configuring
Chiristuff is split into multiple "modules" which can be enabled/disabled at will. By default, the `userscript.js` provided includes a list of all modules at the top, but **you can remove them or comment them out** (with `//` at the start of the line) to remove what you don't want, and as new modules are implemented, you'll have to **opt into them manually**.

**List of all modules:** [Modules](./module)

To view details about what each module does, simply click on the module on this page and it will give more information on it.
