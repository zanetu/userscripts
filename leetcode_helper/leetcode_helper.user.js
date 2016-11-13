// ==UserScript==
// @name         LeetCode Helper
// @namespace    github.com/zanetu
// @version      0.99.1
// @description  Enhances leetcode.com.
// @include      /^https?\:\/\/leetcode\.com\/problems\//
// @include      /^https?\:\/\/leetcode\.com\/problemset\//
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-end
// @noframes
// ==/UserScript==

//always show tags and similar problems
$('<style>.hidebutton {display: inline !important;}'
//always show spoilers
+ ' .spoilers {display: block !important;}'
//google premium problems
+ ' i.fa-lock::after {content: "(Google)"; cursor: pointer;}</style>').appendTo('head')
//always show tags, similar problems and spoilers
$('#tags,#similar,[onclick^="showSpoilers("]').remove()
//hide/show premium problems
var premiumStyle = $('<style>.premium-row {display: none !important;}</style>').appendTo('head')[0]
$('<select/>').css('margin-left', '10px')
.append(new Option('Hide Locked', '0')).append(new Option('Show Locked', '1'))
.change(function() {
	switch(this.value) {
		case '0':
			premiumStyle.disabled = false
			break
		case '1':
			premiumStyle.disabled = true
			break
	}
	localStorage.setItem('premium-select', this.value)
}).val(localStorage.getItem('premium-select') || '0').change().insertBefore('.form-horizontal')
//google premium problems
$(document).on('click', 'i.fa-lock', function(e) {
	var q = encodeURIComponent($(e.target).prev().text().trim() + ' -site:leetcode.com leetcode')
	open('//www.google.com/search?q=' + q)
})
//never subscribe to see which companies asked this question
$('[href="/subscribe/"]').parent().remove()
//detect premium problems
MutationObserver = window.MutationObserver || window.WebKitMutationObserver
if(MutationObserver) {
	var observer = new MutationObserver(function(mutations) {
		handleMutation()
	})
	observer.observe(document.documentElement, {
		childList: true,
		subtree: true
	})
	handleMutation()
}
//for chrome v18-, firefox v14-, internet explorer v11-, opera v15- and safari v6-
else {
	setInterval(function() {
		handleMutation()
	}, 500)
}
function handleMutation() {
	//label premium problems
	$('tr:has(i.fa-lock)').addClass('premium-row')
}
