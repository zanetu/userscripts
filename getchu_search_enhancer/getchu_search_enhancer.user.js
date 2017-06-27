// ==UserScript==
// @name         Getchu Search Enhancer
// @namespace    github.com/zanetu
// @version      1.1
// @description  Enhances adult anime search on getchu.com by collapsing rehash (with Blu-ray marked in blue), 3D anime (marked in silver) and live action (marked in pink), according to title and brand. Does not work with thumbnail search results. 
// @include      /^http\:\/\/([^\.\/]+\.)?getchu.com\/php\/search\.phtml\?(\w+\=[\w\%\+]*\&)*(age\=18\%3Alady|sub\_genre\%5B336\%5D\=1)(\&\w+\=[\w\%\+]*)*/
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @run-at       document-end
// @noframes
// ==/UserScript==

/**
 * Test Pages: 
 * http://www.getchu.com/php/search.phtml?sort=release_date&genre=anime_dvd&age=18%3Alady&list_count=100
 * http://www.getchu.com/php/search.phtml?sort=release_date&genre=anime_dvd&sub_genre%5B336%5D=1
 * 
 * List of Cheap Edition Adult Anime: 
 * http://www.getchu.com/php/search.phtml?sort=release_date&genre=anime_dvd&age=18%3Alady&sub_genre%5B354%5D=1&list_count=999
 */

;(function() {
	var CSS_COLLAPSED = ' {height: 1em !important; overflow: hidden !important;} '
	var CSS_UNCOLLAPSED = ' {height: auto !important; overflow: visible !important;} '
	var CSS_HIDDEN = ' {display: none !important;} '
	var PINK = '#ffc0cb'
	var SILVER = '#c0c0c0'
	var BLUE = '#b2ffff'
	var SKYBLUE = '#87ceeb'
	var YELLOW = '#ffff00'
	var CLASS_INFO = {
		//title-based classes
		'ul.display a.blueb': {
			//rehash; usually cheap (remastered) edition
			'cheap_edition': {
				're': [
				/(Re：|(Best|Value))\ ?Price|Royal\ asset|ザ・ベスト|(完全|復刻|廉価)版/,
				/(Complete|Perfect|Best|Excellent|Final|Glamorous|Special)\ (Edi|Collec|Selec)tion/,
				/コンプリート(コレクション|版|ディスク)|ゴールドディスク|メガ盛り|声優/,
				/Blu\-ray\ HD|Blu\-ray版(?!$)|[^ル]\bBOX\b/,
				/リニューアルリミテッド|バイノーラル|総集編|傑作選|再販|特価/,
				/[^\・]コレクション|これくしょん|セレクション|パック|セット/,
				/^GEシリーズ\ /,
				/^(夜勤病棟ヒロインシリーズ|ぽ～じゅ|ぺろぺろ☆てぃーちゃー(?!\ 全))\ /,
				/(プチベストセレクション|・真行寺由奈編|・神無月舞編)$/,
				/\b((SPECIAL|NICE)\ PRICE|complete\ version|Contenant\ tous)\b/,
				/\b(the\ guilty\ party|SEXFRIEND\ Extend|BEST\ The|fuzzy\ lips\ 0＋1)\b/,
				/(\bComplete|\b(Special|Complete)～|～\ Limited)$/,
				/\b(THE\ BEST|Collectors|Pack)\b/i
				],
				'collapses': true,
				'backgroundColor': null,
				'hides': false
			},
			//live action
			'live_action': {
				're': [
				/（実写）$/
				],
				'collapses': true,
				'backgroundColor': PINK,
				'hides': false
			},
			//special edition; may be cheap edition
			'special_edition': {
				're': [
				/\＜初回版\＞|\[抱き枕カバー付き\]|限定版/
				],
				'collapses': true,
				'backgroundColor': YELLOW,
				'hides': false
			}
		},
		//detail-based classes
		'ul.display td > p:first-child': {
			//3d (doujin) anime
			'doujin_dvd_edition': {
				're': [
				/ブランド名： (ホビコレ|WORLD PG|SPRECHCHOR|WTC\-project|ミルクキャンディー)/,
				/ブランド名： (アーカムプロダクツ \/ チーム暗黒媒体|テクニカルスタッフ)/
				],
				'collapses': true,
				'backgroundColor': SILVER,
				'hides': false
			},
			//blu-ray edition
			//ignore "DVD-VIDEO" with "Blu-ray" in title, e.g. www.getchu.com/soft.phtml?id=855727
			'bluray_edition': {
				're': /メディア： BD\-VIDEO/,
				'collapses': false,
				'backgroundColor': BLUE,
				'hides': false
			},
			//live action
			'live_action': {
				're': /ブランド名： Eドラ！/,
				'collapses': true,
				'backgroundColor': PINK,
				'hides': false
			},
			//vanilla released nothing but rehashes after 2012/10/19
			// and has been using random titles since 2016/05/13
			'vanilla_cheap_edition': {
				're': /ブランド名： バニラ/,
				'collapses': true,
				'backgroundColor': SKYBLUE,
				'hides': false
			},
		}
	}
	
	$('<style type="text/css" />').html(CONCATENATE_CSS()).appendTo('body')
	for (var selector in CLASS_INFO) {
		$(selector).each(function() {
			for (var className in CLASS_INFO[selector]) {
				var info = CLASS_INFO[selector][className] || {}
				if (info['re'] && testRe(info['re'], $(this).text().trim())
						|| info['id'] && testId(info['id'], $(this).attr('href'))) {
					$(this).closest('li').addClass(className)
				}
			}
		})
	}
	//disable lazy load
	$('img.lazy[src="/common/images/space.gif"][data-original]').each(function() {
		this.src = $(this).data('original')
	})
	
	function CONCATENATE_CSS() {
		var css = ''
		for (var selector in CLASS_INFO) {
			for (var className in CLASS_INFO[selector]) {
				var info = CLASS_INFO[selector][className]
				//className can't be an empty string
				if (info && className) {
					var s = '.' + className
					if (info['hides']) {
						css += s + CSS_HIDDEN
					}
					//may not be needed
					else {
						if (info['collapses']) {
							css += s + CSS_COLLAPSED + s + ':hover' + CSS_UNCOLLAPSED
						}
						if (info['backgroundColor']) {
							css += s + ', ' + s + ' * {background-color: '
							+ info['backgroundColor'] + ' !important;} '
						}
					}
				}
			}
		}
		return css
	}
	
	function testRe(reArray, text) {
		if (reArray instanceof Array) {
			for (var i = 0, l = reArray.length; i < l; i++) {
				if (reArray[i] instanceof RegExp && reArray[i].test(text)) {
					return true
				}
			}
		}
		else if (reArray instanceof RegExp && reArray.test(text)) {
			return true
		}
		return false
	}
	
	function testId(idObject, href) {
		var id = href && href.split && href.split('id=').pop()
		return id && id !== href && idObject && idObject.hasOwnProperty(id)
	}
	
})()
