// ==UserScript==
// @name         Hasty LinkedIn
// @namespace    github.com/zanetu
// @version      0.99.2
// @description  Expedites job hunting on linkedin.com.
// @include      /^https?\:\/\/(www\.)?linkedin\.com\/(jobs|company(-beta)?)\//
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @run-at       document-end
// @noframes
// ==/UserScript==

//expand job details and company info
MutationObserver = window.MutationObserver || window.WebKitMutationObserver
if (MutationObserver) {
	new MutationObserver(handleChange).observe(document.documentElement, {
		childList: true,
		subtree: true
	})
}
//for chrome v18-, firefox v14-, internet explorer v11-, opera v15- and safari v6-
else {
	setInterval(handleChange, 500)
}
handleChange()
function handleChange() {
	//job details
	var jd = document.querySelector('.description-module[style*="height:"]')
	var jdButton = jd && jd.parentNode.querySelector('#job-details-reveal[aria-expanded="false"]')
	jdButton && jdButton.click()
	//company info
	var biButton = document.querySelector('.basic-info.state-viewmore .view-more-bar')
	biButton && biButton.click()
	//company-beta info
	downIcon = document.querySelector('[type="chevron-down-icon"]')
	downIcon && downIcon.click()
}
var s = document.createElement('style')
s.type = 'text/css', s.appendChild(document.createTextNode(
	//view more jobs
	'.expand-button-container,.spinner {visibility: hidden !important;}'
	+ ' .loader-container {display: none !important;}'
)), document.documentElement.appendChild(s)
var timer = setInterval(loadMoreJobs, 500)
function loadMoreJobs() {
	var moreJobsContainer = document.querySelector('.expand-button-container')
	if (moreJobsContainer) {
		//no more jobs
		if(moreJobsContainer.style.display === 'none') {
			clearInterval(timer)
			return
		}
		var moreJobsButton = moreJobsContainer.querySelector('button[data-control="seemorejobs"]')
		if (moreJobsButton) {
			var top = moreJobsButton.getBoundingClientRect().top;
			if (top <= (window.innerHeight || document.documentElement.clientHeight) + 5000) {
				moreJobsButton.click()
			}
		}
	}
}
