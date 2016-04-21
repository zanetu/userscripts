// ==UserScript==
// @name         Direct Slickdeals
// @namespace    github.com/zanetu
// @version      1.1
// @description  Removes Slickdeals redirects and automatically opens forum threads of frontpage deals. 
// @include      /^http\:\/\/slickdeals\.net\/[a-z]\/\d+/
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @run-at       document-end
// @noframes
// ==/UserScript==

;(function() {
	//start of slickdeals frontpage deals
	var threadContainer = document.getElementById('comments')
	var thread = threadContainer && threadContainer.getElementsByTagName('a')[0]
	if(thread && thread.href) {
		location.href = thread.href
		return
	}
	//end of slickdeals frontpage deals
	for(var i = 0, link; link = document.links[i]; i++) {
		var m = link.href.match(/\=(http(?:\%3A|\:)(?:\%2F|\/){2}.+?)(?=\&|$)/i)
		if(m && m[1]) {
			link.href = decodeURIComponent(m[1])
		}
	}
})()
