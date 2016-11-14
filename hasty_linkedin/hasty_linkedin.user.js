// ==UserScript==
// @name         Hasty LinkedIn
// @namespace    github.com/zanetu
// @version      0.99
// @description  Expedites job hunting on linkedin.com.
// @include      /^https?\:\/\/(www\.)?linkedin\.com\//
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @run-at       document-end
// @noframes
// ==/UserScript==

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
function handleMutation() {
	var jd = document.querySelector('.description-module[style*="height:"]')
	var jdButton = jd && jd.parentNode.querySelector('#job-details-reveal[aria-expanded="false"]')
	if(jdButton) {
		jdButton.click()
	}
	var moreJobsButton = document.querySelector('button[data-control="seemorejobs"]')
	moreJobsButton && moreJobsButton.click()
}
