// ==UserScript==
// @name         Getchu Search Enhancer
// @namespace    github.com/zanetu
// @version      0.8
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
	var CLASS_INFO = {
		//title-based classes
		'ul.display a.blueb': {
			//rehash; usually cheap (remastered) edition
			'cheap_edition': {
				're': [
				/(Re：|Best\s)Price|ザ・ベスト|(完全|復刻|廉価)版/,
				/(Complete|Perfect|Best|Excellent|Final|Glamorous)\s(Edition|Collection)/,
				/コンプリート(コレクション|版|ディスク)|ゴールドディスク|メガ盛り|声優/,
				/Blu\-ray\sHD|Blu\-ray版(?!$)|[^ル]\bBOX\b|\bPack\b|Special\sEdition(?!$)/,
				/リニューアルリミテッド|バイノーラル|総集編|傑作選|再販|特価|[^\・]コレクション/,
				/^(ぺろぺろ☆てぃーちゃー(?!\s全)|鬼父\sチョビんぽパック\s)/,
				/^GEシリーズ\s/,
				/^(夜勤病棟ヒロインシリーズ|ぽ～じゅ|義母っつうても人の嫁じゃん|イヤですか？)\s/,
				/(プチベストセレクション|・真行寺由奈編|・神無月舞編)$/,
				/^(アッチェレランド|ストリンジェンド)パック$/,
				/\b((SPECIAL|NICE)\sPRICE|complete\sversion)\b/,
				/\b(the\sguilty\sparty|SEXFRIEND\sExtend|BEST\sThe|fuzzy\ lips\ 0＋1)\b/,
				/(\bComplete|\b(Special|Complete)～|～\sLimited)$/,
				/\b(THE\sBEST|Collectors)\b/i,
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
			}
		},
		//detail-based classes
		'ul.display td > p:first-child': {
			//3d (doujin) anime
			'doujin_dvd_edition': {
				're': [
				/ブランド名：\s(ホビコレ|WORLD\sPG|SPRECHCHOR|WTC\-project|ミルクキャンディー)/,
				/ブランド名：\s(アーカムプロダクツ\s\/\sチーム暗黒媒体|テクニカルスタッフ)/
				],
				'collapses': true,
				'backgroundColor': SILVER,
				'hides': false
			},
			//blu-ray edition
			//ignore "DVD-VIDEO" with "Blu-ray" in title, e.g. www.getchu.com/soft.phtml?id=855727
			'bluray_edition': {
				're': /メディア：\sBD\-VIDEO/,
				'collapses': false,
				'backgroundColor': BLUE,
				'hides': false
			},
			//live action
			'live_action': {
				're': /ブランド名：\sEドラ！/,
				'collapses': true,
				'backgroundColor': PINK,
				'hides': false
			}
		}
	}
	
	$('<style type="text/css" />').html(CONCATENATE_CSS()).appendTo('body')
	for (var selector in CLASS_INFO) {
		$(selector).each(function() {
			for (var className in CLASS_INFO[selector]) {
				var item = CLASS_INFO[selector][className]
				if (item && item['re'] && testArray(item['re'], $(this).text().trim())) {
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
				var item = CLASS_INFO[selector][className]
				//className can't be an empty string
				if (item && className) {
					var s = '.' + className
					if (item['hides']) {
						css += s + CSS_HIDDEN
					}
					//may not be needed
					else {
						if (item['collapses']) {
							css += s + CSS_COLLAPSED + s + ':hover' + CSS_UNCOLLAPSED
						}
						if (item['backgroundColor']) {
							css += s + ', ' + s + ' * {background-color: '
							+ item['backgroundColor'] + ' !important;} '
						}
					}
				}
			}
		}
		return css
	}
	
	function testArray(reArray, text) {
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
	
})()
