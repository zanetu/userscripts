// ==UserScript==
// @name         Wayback jsPerf
// @namespace    github.com/zanetu
// @version      0.99
// @description  Redirects to WayBackMachine (archive.org) when visiting jsperf.com.
// @include      /^https?\:\/\/(www\.)?jsperf\.com/
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @run-at       document-start
// @noframes
// ==/UserScript==

location.href = 'http://web.archive.org/web/' + location.href