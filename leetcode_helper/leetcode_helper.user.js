// ==UserScript==
// @name         LeetCode Helper
// @namespace    github.com/zanetu
// @version      0.99
// @description  Enhances leetcode.com by providing a sort-by-votes "Discuss" button.
// @include      /^https?\:\/\/leetcode\.com\/problems\//
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @run-at       document-end
// @noframes
// ==/UserScript==

var $discuss = $('.action .btn-success').first()
$discuss.clone().text('Most Votes').attr('href', function(i, v) {
	return v + '?sort=votes'
}).insertAfter($discuss)
