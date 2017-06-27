// ==UserScript==
// @name         Direct Slickdeals
// @namespace    github.com/zanetu
// @version      1.6
// @description  Removes Slickdeals redirects and automatically opens forum threads of frontpage deals.
// @include      /^https?\:\/\/slickdeals\.net\/[a-z]\/\d+/
// @include      /^https?\:\/\/slickdeals\.net\/forums\/showthread\.php/
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @run-at       document-end
// @noframes
// ==/UserScript==

;(function() {
	for(var i = 0, link; link = document.links[i]; i++) {
		var m = link.href.match(/\=(https?(?:\%3A|\:)(?:\%2F|\/){2}.+?)(?=\&|$)/i)
		if(m && m[1]) {
			link.href = decodeURIComponent(m[1])
		}
	}
})()
