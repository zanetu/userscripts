// ==UserScript==
// @name         DM5 Bulk Loader
// @namespace    github.com/zanetu
// @version      1.0
// @description  一次性载入动漫屋的整集漫画
// @include      /^http\:\/\/([^\.\/]+\.)?dm5.com\/m(\d+|anhua\-).*?\//
// @author       zanetu
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @grant        none
// @run-at       document-end
// @noframes
// ==/UserScript==

;(function() {
	//united states ip
	$.ajaxSetup({beforeSend: function(xhr) {xhr.setRequestHeader('X-Forwarded-For', '3.3.3.3')}})
	var $blocked = $('.tsmy.mato5:first')
	//series page
	if(window.DM5_COMIC_MID) {
		//chapters blocked on series page
		$('<div/>').attr({'id': 'tempc', 'class': 'ma5'}).replaceAll($blocked)
		.load('/template-' + DM5_COMIC_MID + '-t2/?language=1')
	}
	//chapter page
	else {
		//prevent initial scrolling
		$('iframe:last').remove()
		$('[oncontextmenu]').removeAttr('oncontextmenu')
		var $divContainer = $('<div/>')
		var $container = $('#cp_img').length ?
		 $divContainer.appendTo($('#cp_img')) : $divContainer.replaceAll($blocked)
		$('<style>#cp_img > p, #cp_img > div ~ img { display: none !important; }</style>')
		.appendTo('head')
		var styleFit = $('<style>#cp_img > div > img { max-width: 100% }</style>')
		.appendTo('head')[0]
		loadSequentially(window.DM5_FLOAT_INDEX || 1, $('.logo_1').attr('href'))
		$('.rightToolBar').css('opacity', '0').hover(function() {
			$(this).css('opacity', '1')
		}, function() {
			$(this).css('opacity', '0')
		})
		$('body').css('min-width', 'auto')
		var $fit = $('.logo_3:first')
		styleFit.disabled = !$fit.hasClass('active')
		$fit.click(function() {
			styleFit.disabled = !$(this).hasClass('active')
		})
	}
	
	function loadSequentially(pageCount, href) {
		$.ajax({
			url: 'chapterfun.ashx', 
			data: {
				cid: window.DM5_CID, 
				page: pageCount, 
				key: $("#dm5_key").val(), 
				language: 1, 
				gtk: 6
			}, 
			success: function(data) {
				eval(data)
				if('undefined' === typeof d || !d[0]) {
					return
				}
				var $newItem = $('<img/>').attr('src', d[0]).css({
					'display': 'block', 
					'border': '1px solid #444', 
					'box-sizing': 'border-box', 
					//center narrower images
					'margin': 'auto'
				})
				//previous chapter
				href && $newItem.click(function() {
					location.href = href
				}).css('cursor', 'pointer')
				$newItem.appendTo($container)
				$('<div>' + pageCount + '</div>').css({
					'min-width': '30px', 
					'display': 'inline-block', 
					'color': '#ddd', 
					'border': '1px solid #ddd', 
					'border-top-width': '0px', 
					'border-radius': '0px 0px 30px 30px', 
					'background': '#444', 
					'padding': '0px 10px', 
					'margin-bottom': '10px'
				}).appendTo($container)
				if(pageCount < window.DM5_IMAGE_COUNT) {
					loadSequentially(pageCount + 1)
				}
				else {
					$container.siblings().remove()
					//next chapter
					href = $('.logo_2').attr('href')
					href && $newItem.unbind('click').click(function() {
						location.href = href
					}).css('cursor', 'pointer')
				}
			}
		})
	}
})()
