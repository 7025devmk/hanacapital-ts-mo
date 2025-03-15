$(function(){
	//초기 a tag 셋팅(접근성 관련)
	aTagSetting();
	
	//full 팝업 호출 시 a tag 검사(접근성 관련)
	$('#dynamicPop').on('DOMNodeInserted',function(event){
		var tag = event.target.tagName;
		if(tag == 'A'){
			aTagSetting();
		}
	});
	
	//sub 팝업 호출 시 a tag 검사(접근성 관련)
	$('#subPopup').on('DOMNodeInserted',function(event){
		var tag = event.target.tagName;
		if(tag == 'A'){
			aTagSetting();
		}
	});
	
	
	// 레이아웃 설정
	if (!$('body').hasClass('popup_opened')) {
		var footerH = $('.wrap').find('> footer').outerHeight();
		footerH = footerH != null ? footerH : 0;
		
		// 메인화면이 아닐 경우
		if (!$('.wrap').hasClass('main')) {
			$('.wrap').find('> section.content').css('padding-bottom', parseInt(footerH + 80) + 'px');	
		}
		
		// 스크롤시 타이틀 이벤트
		$(window).scroll(function() {
			titleEvent();
		});
	}
	
	var menu = new menuInit();
	menu.init();
		
	// 메뉴 열기
	$('header').find('.btn_menu').on('click', function(e){
		e.preventDefault();
		menu.open();
	});
	
	// 메뉴 닫기
	$('nav > .container > .menuall > .top').find('.btn_close_menu').on('click', function(){
		menu.close();
	});
	
	// 폼 설정
	setFormInput();
	
	// 탭 설정
	setTab();
	
	// 진행상태바
	setProgressBar();
	
});

//function prograssBarSetting(){
//	var divTag = document.querySelectorAll("div.bar > div");
//	if(divTag.length > 0){
//		$(document).find('.progress').each(function() {
//			var val = $(this).find('.bar .val');
//			var valText = val.text();
//			val.css('width', valText + '%');
//			
//		});
//		$("div.bar > div").text("");
//		$("div.bar > div").find("span").remove();
//		$("div.bar > div").append("<span style='font-size:0;'>20% 진행중</span>");
//	}
//}

//접근성 관련 A tag 수정
function aTagSetting(){
	var aTag = document.querySelectorAll("a");
	
	for(var i=0; i < aTag.length; i++){
		if(!aTag[i].hasAttribute("href")){
			aTag[i].setAttribute('href',"javascript:void(0);");
		}
	}
}

//상단 진행상태바 셋팅
function setProgressBar(){
	$(document).find('.progress').each(function() {
		var val = $(this).find('.bar .val');
		var valText = val.text();
		val.css('width', valText + '%');
		val.text("");
		val.append("<span style='font-size:0;'>"+ valText + "% 진행중</span>");
		
	});
}

// 즐겨찾기 등록/해제
function setBookmark() {
	$('.btn_bookmark').on('click', function() {
		if ($(this).hasClass('active')) {
			$(this).removeClass('active');
			$(this).text('즐겨찾기 해제');
		} else {
			$(this).addClass('active');
			$(this).text('즐겨찾기 등록');
		}
	});
}

// 폼 설정
function setFormInput() {
	$('.grp_input').each(function() {
		// input
		$(this).find('input').each(function() {
			// 비밀번호 마스킹 스타일 설정
			/*if ($(this).attr('type') == 'password') {
				$(this).on({
					'focus keyup blur':function(e) {
						e.preventDefault();
						if ($(this).val().length) {
							$(this).addClass('on');
						} else {
							$(this).removeClass('on');	
						}
					}
				});
			}*/
			
			// 상태별 스타일 설정	('bg_white class 예외')
			if (
				!$(this).hasClass('bg_white')
				&& !$(this).parent().parent('.grp_input').hasClass('cardno')
				&& !$(this).parent().parent('.grp_input').hasClass('juminno')
				&& !$(this).parent().parent('.grp_input').hasClass('cellno')) {		
				if ($(this).prop('readonly') == true) {
					$(this).parent().parent('.grp_input').addClass('readonly');
				} else if ($(this).prop('disabled') == true) {
					$(this).parent().parent('.grp_input').addClass('disabled');
				}
			}
			
			// clear 버튼 추가/삭제
			if (!$(this).parent().parent('.grp_input').hasClass('calendar')
				&& !$(this).parent().parent('.grp_input').hasClass('cardno')
				&& !$(this).parent().parent('.grp_input').hasClass('juminno')
				&& !$(this).parent().parent('.grp_input').hasClass('cellno')
				&& !$(this).prop('disabled')
				&& !$(this).prop('readonly')
				&& !$(this).parent('.item').find('.btn_input_clear').get(0)) {
				
				$(this).parent('.item').append('<button type="button" class="btn_input_clear" title="입력 내용 삭제">삭제 버튼</button>');
				var $btnInit = $(this).parent('.item').find('.btn_input_clear');
				
				// 입력폼 초기화 버튼 클릭시 input value값 삭제, 버튼 숨김(click(X), mousedown 사용해야 함)
				if ($btnInit) {
					$btnInit.on('mousedown', function(e) {
						e.preventDefault();
						
						$(this).parent('.item').find('input').val('').focus();
						$btnInit.hide();
						
						// 금액 입력폼일 경우
						if ($(this).parent().parent('.grp_input').hasClass('amount')) {
							$(this).parent().parent('.grp_input').parent('.item_content').next('.item_amount').text('');
						}
						
						return false;
					});
				}
			}
			
			// focus/blur : on class 추가/삭제
			// keyup : value값 체크 후 숨김/표시
			$(this).on({
				focus:function(e) {
					e.preventDefault();
					$(this).parent().parent('.grp_input').addClass('on');
					
					if ($btnInit) {
						if ($(this).val().length) {
							$btnInit.show();
						} else {
							$btnInit.hide();
						}
					}
				},
				blur:function(e) {
					e.preventDefault();
					$(this).parent().parent('.grp_input').removeClass('on');
					
					if ($btnInit) {
						$btnInit.hide();
					}
				},
				keyup:function(e) {
					e.preventDefault();
					
					if ($btnInit) {
						if ($(this).val().length) {
							$btnInit.show();
						} else {
							$btnInit.hide();
						}
					}
				}
			});
		});
		
		// 콤보박스 상태별 스타일 설정
		$(this).find('select').each(function() {
			if ($(this).prop('disabled') == true) {
				$(this).parent().parent('.grp_input').addClass('disabled');
			}
			
			$(this).on({
				focus:function(){
					$(this).parent().parent('.grp_input').addClass('on');
				},
				blur:function(){
					$(this).parent().parent('.grp_input').removeClass('on');
				}
			});
		});
		
		// 버튼형 콤보박스 상태별 스타일 설정
		$(this).find('.btn_combobox').each(function() {
			if ($(this).prop('disabled') == true) {
				$(this).parent().parent('.grp_input').addClass('disabled');
			}
			
			$(this).on({
				focus:function(){
					$(this).parent().parent('.grp_input').addClass('on');
				},
				blur:function(){
					$(this).parent().parent('.grp_input').removeClass('on');
				}
			});
		});
	});
}

// 메인화면 인터렉션
function mainUi() {
	var cardItem = $('.list_card > .item'),
		cardItemBody = cardItem.find('> .card_body'),
		itemLength = $('.list_card > .item').length,
		startX, endX, curr, currIdx;
	
	cardItem.eq(0).addClass('active');

	cardItemBody.on('touchstart', function(e) {
		e.preventDefault();
		curr = $(this).parent();
		currIdx = curr.index()+1;
		startX = e.originalEvent.touches[0].pageX;
	});
	
	cardItemBody.on('touchmove', function(e) {
		e.preventDefault();
		endX = e.originalEvent.changedTouches[0].pageX;
		/* //console.log('endX===' + endX);
		curr.css('left', endX + 'px'); */
	});

	cardItemBody.on('touchend', function(e) {
		e.preventDefault();
		
		// 활성화카드
		if ($(this).parent().hasClass('active')) {
			if (startX - endX > 50) {
				////console.log('왼쪽으로');	
				curr.removeClass('active');	
	
				if (currIdx >= itemLength) {
					$('.list_card').find('.item').eq(0).addClass('active');
				} else {
					curr.next().addClass('active');
				}
			} else if (endX - startX > 50) {
				////console.log('오른쪽으로');
				curr.removeClass('active');
				
				if (currIdx == itemLength) {
					$('.list_card').find('.item').eq(0).addClass('active');
				} else {
					curr.next().addClass('active');
				}
			}
		// 비활성화카드
		} else {
			$('.list_card').find('.item').removeClass('active');
			$(this).parent().addClass('active');
		}
	});
}

// 툴팁
function setTooltip() {
	$('.tooltip').each(function(){
		var tooltip = $(this);
		var icon = $(this).find('> .tooltip_icon');
		var panel = $(this).find('> .tooltip_panel');
		
		// 툴팁 아이콘 클릭시 툴팁 열기
		icon.on('click', function() {
			tooltip.addClass('on');
		
			// 닫기 버튼 클릭시 툴팁 닫기
			panel.find('.btn_close_tooltip').on('click', function() {
				tooltip.removeClass('on');
			});
		});
	});
}

// menu function
var $navOpener;
var menuInit = function(){
	this.init = function(){
		$(window).resize(function(){
			$('nav .dim').css('width', $(document).width());
			$('nav .dim').css('height', $(document).height());
		});
		
		this.setEvent();
	},
	this.open = function(){
		// 오프너 설정(메뉴 버튼)
		$navOpener = document.activeElement;
		
		// 최초 설정(첫번째 메뉴 활성화)
		if ($('.leftmenu > ul > li.active').length == 0) {
			$('.leftmenu > ul > li:first').addClass('active');
			$('.wrap_dep2 > .cont:first').addClass('active');	
		}
		
		// 바디 스크롤 고정
		$('body').removeAttr('style').css({'overflow':'hidden','position':'fixed','width':'100%','height':'100%'});
		$('header nav').show();
		$('header nav .dim').css({'width':$(document).width(), 'height':$(document).height()});
		$('header nav .dim').show();
		$('header nav').find('.container').addClass('active');

		// css3 transition 종료이벤트
		var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';
		
		// nav 활성화
		$('nav').find('.container').each(function(){
			$(this).one(transitionEnd,function(){
				////console.log('open 애니메이션 완료')
				$('nav').show();
			});
		});
		
		// 포커스 유지
		var focusObj = $('nav').on().find('button,[tabindex="0"],a').get();
		var firstTabStop = $('.btn_login');
		var lastTabStop = focusObj[focusObj.length - 1];
		
		$('nav').on({
			'keydown': function(e) {
				if (e.keyCode == 9) {
					////console.log('로딩','탭누름1',document.activeElement);
					if (e.shiftKey) {
						////console.log('뒤로',document.activeElement);
						if ((document.activeElement) == firstTabStop) {
							lastTabStop.focus();
							e.preventDefault();
						}
					} else {
						if (document.activeElement == lastTabStop) {
							////console.log('다음마지막',document.activeElement);
							firstTabStop.focus();
							e.preventDefault();
						}
					}
				}
			}
		});
	},
	this.close = function($obj){
		// nav 비활성화
		$('body').css({'overflow':'auto', 'position':'static', 'width':'100%', 'height':'100%'});
		$('header nav').find('.container').removeClass('active');
		
		// 메뉴 버튼에 focus
		$navOpener.focus();
		
		//css3 transition 종료이벤트
		var transitionEnd = 'transitionend webkitTransitionEnd oTransitionEnd otransitionend';
		$('header nav').find('.container').each(function(){
			$(this).one(transitionEnd,function(){
				$('header nav').hide();
			});
		});
	},
	this.setEvent = function(){
		var $tabMenu = $('.gnb').find('.wrap_dep1 > ul > li > a'),
			$tabPanels = $('.gnb').find('.wrap_dep2');
		
		// 1depth 메뉴 클릭시 2depth 메뉴 활성화
		$('.gnb').each(function(){				
			$tabMenu.on('click', function(e){
				e.preventDefault();
				
				var selectedId = $(this).attr('href');
				
				$(this).parent().siblings('li').removeClass('active');
				$(this).parent().addClass('active');
				
				$tabPanels.find('> .cont').removeClass('active');
				$tabPanels.find('>' + selectedId).addClass('active');				
			});
		});
	};
};

// 검색창 이벤트
function searchWord() {
	var top = $('.menuall .top');
	var popular = top.find('> .search .popular');
	
	// 검색창 포커스시 인기검색어 레이어 스크롤다운
	$('#search_word').on('focus', function() {
		if (!top.hasClass('active')) {
			$('#dim_search').show();
			popular.slideDown(function() {
				top.addClass('active');
				
				if (top.hasClass('active')) {						
					// 팝업 포커스 유지
					var focusObj = top.on().find('button,[tabindex="0"],a').get();
					var firstTabStop = focusObj[0];
					var lastTabStop = focusObj[focusObj.length - 1];
				
					// focus 유지(접근성)
					popular.find('.list li a').on({
						'keydown': function(e) {
							if (e.keyCode == 9) {
								////console.log('로딩','탭누름1',document.activeElement);
								if (e.shiftKey) {
									////console.log('뒤로',document.activeElement);
									if ((document.activeElement) == firstTabStop) {
										lastTabStop.focus();
										e.preventDefault();
									}
								} else {
									if (document.activeElement == lastTabStop) {
										////console.log('다음마지막',document.activeElement);
										closeLayer();
										e.preventDefault();
									}
								}
							}
						}
					});
				}
			});
		}
	});

	// 딤 클릭시 인기검색어 레이어 닫힘
	$('#dim_search').on('click', function() {
		closeLayer();
	});
	
	function closeLayer() {
		////console.log('close layer');
		top.removeClass('active');	
		popular.slideUp(function() {
			$('.dim_search').hide();	
		});
	}
}

// 진행상태 카운트
function countContract() {
	$('.grp_count_contract').each(function() {
		$(this).find('.item > a').on('click', function() {
			$('.grp_count_contract').find('.item').removeClass('active');
			$(this).parent().addClass('active');
		});
	});
}

// 상품설명서 텍스트 마스킹
function txtMasking() {
	$('.masking').on('click', function(){
		$(this).parent().addClass('off');
	});	
}

// datepicker
function datePicker() {	
	// readonly 속성이 있는 경우 readonly class 추가
	$('.datepicker').each(function() {
		if ($(this).prop('readonly') == true) {
			$(this).addClass('readonly');
		}
	});
	
	// readonly 제외한 datepicker에 이벤트
	$('.datepicker:not(.readonly)').datepicker({
		beforeShow:function(){			
			$('body').prepend('<div class="dim_datepicker"></div>');
			
			setTimeout(function(){
				var $dateDivWidth = $('#ui-datepicker-div').width();
				var $dateDivHeight = $('#ui-datepicker-div').height();
			
				$('#ui-datepicker-div').css({
					'top': '50%',
					'left': '50%',
					'margin-top': -($dateDivHeight/2),
					'margin-left': -($dateDivWidth/2),
					'z-index': 99997,
					'display' : 'block'
				}).attr('tabindex','0').focus();
			});
		}/*, onSelect:function() {20220224 포커스제거
			$(this).focus();
			
		}*/, onClose:function() {
			setTimeout(function() {
				$('.dim_datepicker').remove();
				$('#ui-datepicker-div').css({
					'display' : 'none'
				});
			}, 300);
		}
	});
}

// 좌우로 나눠진 리스트 토글
function descListToggle() {
	$('.list_desc_01').find('li.tg').each(function() {
		var tgItem = $('.list_desc_01').find('li.tg');
		$(this).find('.tg_title > div > a').on('click', function() {
			if (tgItem.hasClass('active')) {
				tgItem.removeClass('active');
			} else {
				tgItem.addClass('active');
			}
		});
	});
}

// 아코디언
function activeAccordion() {
	$('.list_accordion').each(function() {
		$(this).find('.item > a').on('click', function() {
			var item = $(this).parent('.item');
			
			// 메뉴 클릭시 하위 메뉴 표시
			if (item.hasClass('active')) {
				item.removeClass('active');
				$(this).attr('title','상세정보 닫기');
			} else {
				item.addClass('active');
				$(this).attr('title','상세정보 열기');
			}
		});
		
		$(this).find('.item > input[type=checkbox]').on('change', function() {
			var item = $(this).parent('.item');
			
			if ($(this).is(':checked')) {
				item.addClass('active');
				// float 팝업 리사이징
				/*if ($('body').hasClass('popup_opened') && $('.popup.on').hasClass('float')) {
					$('.popup.on').find('> .container').css('margin-top', -($('.popup').find('.container').outerHeight()/2));
				}*/
			} else {
				item.removeClass('active');
				// float 팝업 리사이징
				/*if ($('body').hasClass('popup_opened') && $('.popup.on').hasClass('float')) {
					$('.popup.on').find('> .container').css('margin-top', -(orgH/2));
				}*/
			}
		});
	});
}

// 아코디언 체크
function activeAccordionChk() {
	$('.list_accordion_chk .chk_item .btn button.arrow').on('click', function() {
		var item = $(this).parent().parent();
		if (item.hasClass('active')) {
			item.removeClass('active');
		} else {
			item.addClass('active');
		}
	});
}

// 버튼메뉴 토글
function activeAccordionList() {
	$('.list_button_05').each(function() {
		// 하위 메뉴가 있을 경우 버튼 이미지 변경
		$(this).find('> li').each(function() {
			if ($(this).find('> ul').length > 0) {
				$(this).addClass('hasChild');
			}
		});
		
		// 메뉴 클릭시 하위 메뉴 표시
		$(this).find('> li > a').on('click', function() {
			var item = $(this).parent('li');
			
			if (item.hasClass('active')) {
				item.removeClass('active');
				$(this).attr('title','상세정보 닫기');
			} else {
				item.addClass('active');
				$(this).attr('title','상세정보 열기');
			}
		});
	});
}

// ARS메뉴 토글
function activeAccordionArsMenu() {
	$('.list_menu_ars').each(function() {
		// 하위 메뉴가 없을 경우 배경이미지 제거
		$(this).find('li').each(function() {
			if ($(this).find('> ol').length == 0) {
				$(this).find('> a').css('background-image','none');
			}	
		});
		
		// 메뉴 클릭시 하위 메뉴 표시
		$(this).find('li > a').on('click', function() {
			var item = $(this).parent('li');
			item.siblings('li').removeClass('active');
			item.find('ol li').removeClass('active');
			
			if (item.hasClass('active')) {
				item.removeClass('active');
				$(this).attr('title','상세정보 닫기');
			} else {
				item.addClass('active');
				$(this).attr('title','상세정보 열기');
			}
		});
	});
}

// 전체 동의
function chkAllAgreement(obj, target) {
	if (obj.is(':checked')) {
		target.find('> li > ul').addClass('active');
		target.find('> li > .toggle').addClass('active');
		target.find('input').prop('checked', true);
		
		// 목록 체크 해제시 전체동의 체크 해제
		target.find('> li > div > input').on('change', function() {
			if (!$(this).is(':checked')) {			
				if (obj.length == 1) {
					obj.prop('checked', false);
				}
			}
		});
	} else {
		target.find('> li > ul').removeClass('active');
		target.find('> li > .toggle').removeClass('active');
		target.find('input').prop('checked', false);
	}
}

// 동의 체크
function openAgreementList() {
	// 전체 동의
	$('.grp_agreement_check_all').each(function() {
		var chkList = $(this).next('.grp_agreement_list');
		
		$(this).find('input').on('change', function() {
			if ($(this).is(':checked')) {
				chkList.find('> li > ul').addClass('active');
				chkList.find('> li > .toggle').addClass('active');
				chkList.find('input').prop('checked', true);
			} else {
				chkList.find('> li > ul').removeClass('active');
				chkList.find('> li > .toggle').removeClass('active');
				chkList.find('input').prop('checked', false);
			}
		});
	});
	
	// 동의 목록
	// 1depth 목록 최초 클릭시 전체 펼침
	$('.grp_agreement_list').each(function() {
		var chkList = $(this);
		
		$(this).find('> li > div > input').on('change', function() {
			if ($(this).is(':checked')) {
				if (!($(this).hasClass('fixed'))) {
					$(this).parent().parent().find('> ul').addClass('active');
					$(this).parent().parent().find('> .toggle').addClass('active');
				}
			} else {
				// 전체동의 체크 해제
				var chkAll = chkList.prev('.grp_agreement_check_all');
				
				if (chkAll.length == 1) {
					chkAll.find('input').prop('checked', false);
				}
			}
		});
	});
} 

// 스위치 토글 전체 동의
function chkAllSwitch(obj, target) {
	if (obj.is(':checked')) {
		target.find('> li > div > .tg_chk_agree').prop('checked', true);
		target.find('> li > div > label').find('.title').text('동의');
		
		// 목록 체크 해제시 전체동의 체크 해제
		target.find('> li > div > .tg_chk_agree').on('change', function() {
			if (!$(this).is(':checked')) {			
				if (obj.length == 1) {
					obj.prop('checked', false);
				}
			}
		});
	} else {
		target.find('> li > div > .tg_chk_agree').prop('checked', false);
		target.find('> li > div > label').find('.title').text('미동의');
	}
}

// 스위치 토글 동의 체크
function toggleSwitchCheck() {
	$('.list_box_switch').each(function() {
		var list = $(this).find('.title').next('ul');
		var input = list.find('.tg_chk_agree');
		
		// 전체 동의 체크
		$('#chk_ag_all').on('change', function() {
			if ($(this).is(':checked')) {
				input.prop('checked', true);
				input.next('label').find('.title').text('동의');
			} else {
				input.prop('checked', false);
				input.next('label').find('.title').text('미동의');
			}
	
		});
		
		// 동의 체크
		input.on('change', function() {				
			if ($(this).is(':checked')) {
				$(this).next('label').find('.title').text('동의');
			} else {
				$(this).next('label').find('.title').text('미동의');
				$('#chk_ag_all').prop('checked', false);
			}
		});
		
	});
}

// 버티컬 메뉴
function verticalMenu() {
	$('.list_vt_menu').each(function() {			
		$(this).find('> ul > li > a').on('click', function() {
			$(this).parent().siblings('li').removeClass('on');
			$(this).parent().addClass('on');
		});
	});
}

// 탭 설정
function setTab(obj) {
	obj = obj || $('body');
	$('.grp_tab').each(function() {		
		var tab = $(this),
			tabMenuList = tab.find('> .tab_menu > .list_menu > li'),
			tabMenu = tabMenuList.find('> a'),
			tabSubMenuList = tab.find('> .tab_menu_sub > .list_menu > li'),
			tabSubMenu = tabSubMenuList.find('> a'),
			tabContent = tab.find('> .tab_content > .item'),
			popupfg = $('body').hasClass('popup_opened'),
			headerH = popupfg ? $('.popup.on > .container > header') : $('.wrap > header').outerHeight();
			
			
			
			
		// 탭메뉴 고객이탈방지 팝업 이후 오류 방지	
//		if(tab.closest('.section.popup.on').length == 0 && popupfg){
//			return false;
//		}else if(tab.closest('.section.popup.on').length > 0 && !popupfg){
//			return false;
//		}
		// 탭메뉴 width값 동일하게 설정
		if (!tab.find('> .tab_menu').hasClass('swiper')) {
			tabMenuList.css('flex','0 0 ' + 100/tabMenuList.length + '%');	
		}
		
		//선택된 첫번째 탭 디폴트 셋팅
		if(tabMenuList.hasClass('on')) {
			tabMenuList.eq(0).find('> a > span').attr('aria-label','선택됨');
		}
		
		// 첫번째 탭 디폴트 표시
		if(!tabMenuList.hasClass('on')) {
			tabMenuList.eq(0).addClass('on');
			tabSubMenuList.eq(0).addClass('on');
			tabContent.eq(0).addClass('on');
		}
		
		// 탭 스크롤시 헤더 고정
		if (tab.hasClass('depth_01')) {
			$(window).on('scroll',function(){
							
				// top:0일때 탭메뉴 고정
				if (tab.offset().top - tab.find('> .tab_menu').outerHeight() >= $(this).scrollTop()) {
					tab.removeClass('fixed');
					tab.find('> .tab_menu').css({
						'top': 0
					});
				} else {
					tab.addClass('fixed');
					tab.find('> .tab_menu').css({
						'top': (headerH-1) + 'px' /* headerH 아래 보이는 현상 방지(1px 위로) */
					});
				}
			});
		}
		
		// 스크롤타입 탭
		if (tab.hasClass('st_scroll')) {
			var tabmenuH = tab.find('> .tab_menu').outerHeight(),
				lastItemIdx = tabContent.length-1,
				maxScreenH = $(window).height();
				
			/* 마지막 탭컨텐츠에 최소 높이값 추가 */
			tabContent.eq(lastItemIdx).css('min-height', maxScreenH - (headerH + tabmenuH) + 'px');
			
			tabMenuList.on('click','a', function(e) {
				// 팝업으로 인한 스크롤 탭 오류 때문에 높이 다시 구하기
				popupfg = $('body').hasClass('popup_opened');
				headerH = popupfg ? $('.popup.on > .container > header') : $('.wrap > header').outerHeight();
				var $target = $(this).parent(),
					idx = $target.index(),
					section = tabContent.eq(idx),
					offsetTop = section.offset().top - (headerH + tabmenuH);
					
				////console.log(section.offset().top - (headerH + tabmenuH));
								 
				$('html, body').stop().animate({
					scrollTop: offsetTop
				}, 800);
				
				return false;
			});
			
			$(window).scroll(function() {
				var scltop = $(this).scrollTop();
				
				////console.log('11111111scltop==' + scltop);
				
				$.each(tabContent, function(idx, item) {
					var $target = tabContent.eq(idx),
						targetTop = $target.offset().top - (headerH + tabmenuH);
						
						////console.log('targetTop===' + targetTop + ', scltop==' + scltop);
					
					if (targetTop <= scltop+1) {
						tabMenuList.removeClass('on');
						tabMenuList.find('> a > span').removeAttr("aria-label");
						tabMenuList.eq(idx).addClass('on');
						tabMenuList.eq(idx).find('> a > span').attr('aria-label','선택됨');	
					}
				});
			});			
		//일반 탭
		} else {
			tabMenu.on('click', function() {
				var idx = $(this).parent().index();
				tabMenuList.removeClass('on');
				tabMenuList.find('> a > span').removeAttr("aria-label");
				tabMenuList.eq(idx).addClass('on');
				tabMenuList.eq(idx).find('> a > span').attr('aria-label','선택됨');
				
				// 레이어 스타일 아닌 경우(일반)
				if (!tab.hasClass('st_layer')) {
					tabContent.removeClass('on');
					tabContent.eq(idx).addClass('on');
				}
			});
			
			tabSubMenu.on('click', function() {
				var idx = $(this).parent().index();
				
				tabSubMenuList.removeClass('on');
				tabSubMenuList.find('> a > span').removeAttr("aria-label");
				tabSubMenuList.eq(idx).addClass('on');
				tabSubMenuList.eq(idx).find('> a > span').attr('aria-label','선택됨');
				
				// 레이어 스타일 아닌 경우(일반)
				if (!tab.hasClass('st_layer')) {
					tabContent.removeClass('on');
					tabContent.eq(idx).addClass('on');
				}
			});
		}
	});	
}



// 타이틀 이벤트
function titleEvent(popup){
	var top, h1, h2;
	var obj = popup ? popup : $('.wrap');
	
	if (popup) {
		top = popup.find('.popup_content').scrollTop();
		h1 = popup.find('header h1');
		h2 = popup.find('.popup_content .grp_title.depth_02');
	} else {
		top = $(window).scrollTop();
		h1 = $('.wrap header h1');
		h2 = $('.wrap .content .grp_title.depth_02');
	}
	
	// 고정형 h1이 아닌 경우 타이틀 이벤트 적용
	if (!(h1.hasClass('fixed'))) {
		if (top > h2.outerHeight() + 30) {
			obj.addClass('fg_title_ev');
		} else {
			obj.removeClass('fg_title_ev');
		}
	}
	
	return false;
}

/**
	토스트 메시지
	copy 여부 파라메터 추가 : 공유하기인경우만 파라메터 추가(true) - 아무값이나 넣어도 됨
 */ 
function toastMessage(msg, copy) {
		
	var insertDiv = '',
	baseBottom = $('body').find('footer').outerHeight() ? $('body').find('footer').outerHeight() + 10 : 34;	/* margin-bottom(10), 기본 bottom(34) */
	
	insertDiv += '<div class="grp_toast_msg" style="bottom:' + baseBottom + 'px;">';
	insertDiv += msg;
	insertDiv += '</div>';
	
	$('body').append(insertDiv);	
	var t= getTime();
	$('.grp_toast_msg').css("z-index", t);
	$('.grp_toast_msg').fadeIn().delay(1500).fadeOut('slow', function() {
		$(this).remove();
	});
	
	//안드로이드가 아닌 경우만 url복사 메세지 출력 - 안드로이드 자체기능으로 중복.
//	var agent = HNCFnc.getSmartPhoneAgentKind();
	////console.log("agent=============" + agent);
//	if(copy != undefined && copy != null && copy && agent != 'android'){
	if(copy != undefined && copy != null && copy){
		if(comCheckDeviceOS() == 'APP'){
			var lc = location.href;
			fncBridgeClipBoard(lc);
		}else{
			var dummy = document.createElement("input");
			document.body.appendChild(dummy);
			dummy.value = location.href;
			dummy.select();
			document.execCommand("copy");
			document.body.removeChild(dummy);	
		}
		
	}
}

function lpad(val) {
	if(String(val).length == 1) {
		val = "0" + val;
	}
	return val;
};
function getTime(){
	var currentDate = new Date();
		var tomorrowDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
			year = tomorrowDate.getFullYear();
			month = tomorrowDate.getMonth() + 1;
//			month = HNCFnc.lpad(month);
			day = tomorrowDate.getDate();
			day = lpad(day);
			hours = tomorrowDate.getHours();
			hours = lpad(hours);
			minutes = tomorrowDate.getMinutes();
			minutes = lpad(minutes);
			seconds = currentDate.getSeconds();
			seconds = lpad(seconds);
			first= Number(String(year).substring(2,4)) + Number(month) + Number(day);
		return first + ""  + hours + "" + minutes +"" + seconds;
}




// 팝업 열기
var orgH;
function openPopup(id,dvCd, params, callBackFn) {
	if(id=='#memberJoinpop') {
		if ($("#allAagreeCommTerms").is(':checked')) {
			$("#allAagreeCommTerms").trigger("click");
		} else {
				
		}
	}
	////console.log("id::" + $(id).hasClass('toast'));
	// 오프너 설정
	var $opener = document.activeElement; 
	// tabindex 초기화
	$('.popup').removeAttr('tabindex');
	
	try {
		var vType;
		if (comCheckDeviceOS() == 'APP') {
			vType = 'A';
		}else{
			vType = 'W';
		}
		//HNCFnc.saveLoginInfo('SAVE',vType);
	} catch(e){
	}
	
	if(dvCd == 'D') {
		////console.log(checkHistory(id.replace("#","")))
		if(!checkHistory(id.replace("#",""))) {
			
			fncSaveHistory(id.replace("#",""));		
		}	
	}
	
	// dim 생성
	var target_first;
	if ($(id).find('.dim').length == 0) {
		target_first = $(id).prepend('<div class="dim"></div>');
	} else {
		target_first = $(id).find('.target_first');
	}
	
//	// 포커스대상 버튼 생성(접근성)
	if ($(id).find('.target_first').length == 0) {
		$(id).prepend('<a class="target_first" tabindex=-1></a>');
	}
	// 팝업 열기
	$('body').addClass('popup_opened');
	$(id).addClass('on').attr('tabindex',0);
//	$(id).addClass('on');
	
	
	orgH = $(id).find('.container').outerHeight();
	
	
	t= getTime();//todo  z-index
	t2 = localStorage.getItem('z-index');	
	
	////console.log("z-index>>>>>>>>>>>" + t2);
	if(t2 == null) {
		t = 10001;
		localStorage.setItem('z-index', t);
	} else {
		t = parseInt(t2) + 1;
		localStorage.setItem('z-index', t);
	}
	
	if($(id).hasClass('toast') || $(id).hasClass('sub')){
		$(id).find("h1").attr('tabindex',0);
		$(id).find("h2").attr('tabindex',0);
		$(id).focus();
		t = t + 1;
	}else{
		$(id).find("h2").attr('tabindex',0);
		$(id).focus();
	}
	
	// 토스트 팝업일 경우(+ full sub 팝업 추가)
	if ($(id).hasClass('toast') || ($(id).hasClass('full') && $(id).hasClass('sub'))) {
		$(id).find('> .container').addClass('up');	
	}
	
	// 팝업이 열려있을 때
	if ($(id).hasClass('on')) {
		// 많이 찾는 자동차 배너
		if ($('.btn_favorite_car')) {
			setTimeout(function() {
				$('.btn_favorite_car').addClass('on');
			},800);
		}
		
		// 팝업 포커스 유지(접근성)
		var focusObj = $(id).on().find('input,button,[tabindex="0"],a').get();
		var firstTabStop = target_first;
		var lastTabStop = focusObj[focusObj.length - 1];
		
		$(id).on({
			'keydown': function(e) {
				if (e.keyCode == 9) {
					////console.log('로딩','탭누름1',document.activeElement);
					if (e.shiftKey) {
						////console.log('뒤로',document.activeElement);
						if ((document.activeElement) == firstTabStop) {
							lastTabStop.focus();
							e.preventDefault();
						}
					} else {
						if (document.activeElement == lastTabStop) {
							////console.log('다음마지막',document.activeElement);
							firstTabStop.focus();
							e.preventDefault();
						}
					}
				}
				
			}
		});
	
		// 타이틀 토글 이벤트
		$(id).find('.popup_content').scroll(function() {
			titleEvent($(id));
		});
		
		// 팝업 닫기
		function popClose() {
			//if(id=='#memberJoinpop'){
				//if ($("#allAagreeCommTerms").is(':checked')) {
					//$("#allAagreeCommTerms").trigger("click");
				//} else {
				//}
			//}
			if ($(id).hasClass('toast') || ($(id).hasClass('full') && $(id).hasClass('sub'))) {
				$(id).find('> .container').removeClass('up');
				
				setTimeout(function() {
					$(id).find('.dim').remove();
					$(id).removeClass('on');
				}, 200);
			} else {
				$(id).find('.dim').remove(); //params
				if(dvCd=='D') { // 동적인 경우
					if(params.tg =='S') {
						historyArr.pop();
						$(id).remove();
					} else {
						historyArr.length = 0;
						$("#dynamicPop").children().remove();	
					}
				} else {
					$(id).removeClass('on');
				}
			}
			
			$(id).find('a.target_first').remove();	// 포커스 대상 버튼 삭제
			$(id).removeAttr('tabindex');			// 팝업 tabindex 삭제
			$('body').removeClass('popup_opened');	// body 팝업 class 삭제
			$opener.focus();						// 오프너에 focus(접근성)
		}
		
		// 닫기 버튼 클릭시 팝업 닫기
		$(id).find('.btn_close_popup').on('click', function() {
			//alert("id>>" + id)
			flag = $(id).data('webviewclose');
			callFunction = $(id).data('callfunction');
			afterDonCloseYN = $(id).data('afterdoncloseyn');
/*			isApp = $(id).data('isapp');*/
			
			////console.log(">>flag " + flag);
			////console.log(">>callFunction " + callFunction);
			////console.log(">>afterDonCloseYN " + afterDonCloseYN);
			
			if(callFunction != undefined){
				if(window[callFunction] == undefined || typeof window[callFunction] != 'function'){
					//callfunction 미정의 시 팝업 그냥 닫도록 함.
					window[callFunction] = function(){
						//console.log("popup(#"+$(this).closest(".popup").attr("id")+") callfunction [" + callFunction + "] is undefined.");
					};
				}
			}
			
			if(callFunction != undefined && afterDonCloseYN =='Y'){
				window[callFunction]();
			}else if(callFunction != undefined && afterDonCloseYN =='N'){
				popClose();
			}else if(callFunction != undefined && afterDonCloseYN == undefined) {
				window[callFunction]();
				popClose();
			} else {
				if(flag !='Y') {
				//fncBridgeWebViewClose();
					//popClose();
				} else {
					
					if (comCheckDeviceOS() == 'APP') {
						//console.log("APP");
						fncBridgeWebViewClose();
					} else {
						//console.log("MB");
					}
				//popClose();
				}
				popClose();	
			}
		});
		
		// 고정형 팝업, alert 팝업이 아닐 경우 dim 클릭시 팝업 닫기
		if (!$(id).hasClass('fixed') && !$(id).hasClass('float') && $(id).find('.btn_close_popup').length == 1) {
			if ($(id).find('.dim').length > 0) {
				$(id).find('.dim').on('click', function() {
					//popClose();
					$(id).find('.btn_close_popup').trigger("click");
				});
			}
		}
	}
	
	if($(id).parents('#dynamicPop').get(0)){
		var cnt =  $(id).parents('#dynamicPop').children('section.full').not('.sub').length;
		cnt >= 2 ? $(id).parents('#dynamicPop').children('section.full').not('.sub').eq(cnt-2).removeClass('on') : '';	
	}
	
	if(callBackFn != null || typeof(callBackFn)=="function"){
		callBackFn();
	}
	
	////console.log("t::" + t)
	$(id).css("z-index", t); //임시
	// 폼 설정
	setFormInput();
	
	// 탭 설정
	//setTab();

	//상단 진행상태바 설정
	setProgressBar();	
	
	try {
		if (comCheckDeviceOS() == 'APP') {
			vType = 'A';
			}else{
			vType = 'W';
		}
		HNCFnc.saveLoginInfo("SAVE",vType);
	} catch(e) {
		
	}
}
// 팝업 닫기
function popCloseBtn(id, dvCd, callBackFn) {
	if($(id).hasClass('popup toast') || $(id).hasClass('full sub') || $(id).hasClass('popup float')) { //toast 팝업, sub팝업 닫기
		//console.log("1")
		$(id).find('> .container').removeClass('up');
		
		setTimeout(function() {
			$(id).find('.dim').remove();
			$(id).removeClass('on');
		}, 200);	
	} else { //full 팝업
		//console.log("2")
		$(id).find('.dim').remove();
		if(dvCd=='D') { // 동적인 경우
			$(id).remove();
		//}else if(dvCd=='P') { //인 경우
			////console.log(id +":" + parent_id);
			//$(id).removeClass('on');
			//$(parent_id).removeClass('on');	
		} else {
			$(id).removeClass('on');
		}
		//$(id).removeClass('on');
	}
	
	$(id).find('a.target_first').remove();	// 포커스 대상 버튼 삭제
	$(id).removeAttr('tabindex');			// 팝업 tabindex 삭제
	$('body').removeClass('popup_opened');	// 팝업여부 body class 삭제
	
	if(callBackFn != null || typeof(callBackFn)=="function"){
		callBackFn();
	}
	
	//$opener.focus();						// 오프너에 focus
}
// 비밀번호 마스킹
function keyMasking() {
	$('.key_masking').each(function() {
		if ($(this).hasClass('first_char')) {
			$(this).find('.key_cover .key').on('keyup', function() {
				if ($(this).val().length) {
					$(this).parent().addClass('on');
				} else {
					$(this).parent().removeClass('on');
				}
			});
		}
	});
}

//팝업 ajax호출
/* 설명 :팝업 ajax호출 참조 popup1.jsp
		사용 예)
		id='popup2' +  Date.now();
		params ={ popupId : id }
		openPopAjax('/sample/popup2.hnc', '#'+id, params  
		, function(){
			
		});
		
 (2022.02.16)option 추가(로딩바관련)
 ex) openPopAjax('/hc.hnc', '#popId', { params : "Y" }, null , {isProgress:true, isProgressEnd:true, asyn:true});
		
*/  
function openPopAjax(url, popId, params, callBackFn, option){
	if(option == undefined || option==null || option == {}){
		option = null;
	}
	openPopAjaxWithSettings(url, popId, params, option, callBackFn);
};

//팝업 ajax호출
/* 설명 :팝업 ajax호출 참조 popup1.jsp
		사용 예)
		id='popup2' +  Date.now();
		params ={ popupId : id }
		settings = {isProgress:true, isProgressEnd:true, asyn:false}; // HNCFnc.ajax 에서 사용 progress 관련 설정값
			=> 기본값으로 사용하려면 openPopAjax 사용.
		openPopAjaxWithSettings('/sample/popup2.hnc', '#'+id, params, settings  
		, function(){
			
		});
*/

class AjaxQue {
	constructor(){
		this._arr  = [];
	}
	push(item){
		this._arr.push([item]);
	} 
	shift(item, fnc){
		if(this._arr.length > 0){
			if(this._arr[0][0] == item){
				if(fnc != null && typeof(fnc) == 'function'){
					fnc();
				}
				this._arr.shift();
				if(this._arr.length > 0){
					if(this._arr[0][1] != undefined && this._arr[0][1] != null && typeof(this._arr[0][1]) == 'function'){
						this.shift(this._arr[0][0], this._arr[0][1]);
					}
				}
			}else{
				$.each(this._arr, function(){
					if(this[0] == item && (this[1] == undefined ||  this[1] == null)){
						this.push(fnc);
						return false;
					}
				});
			}
		}
	}
	isLast(item){
		if(this._arr.length > 0){
			return this._arr[this._arr.length-1][0] == item;
		}
		return false;
	}
}

const ajaxQue = new AjaxQue();

function openPopAjaxWithSettings(url, popId, params, settings, callBackFn){
	if(settings == undefined || settings==null || settings == {}){
		settings = {isProgress:true, isProgressEnd:true, asyn:true};
	} else {
		if(settings.isProgress == undefined || settings.isProgress == null){
			settings.isProgress = true;
		}
		if(settings.isProgressEnd == undefined || settings.isProgressEnd == null){
			settings.isProgressEnd = true;
		}
		if(settings.asyn == undefined || settings.asyn == null){
			settings.asyn = true;
			
		}
		if(settings.isEtc != undefined || settings.isEtc != null){
			settings.isEtc = "Y";
		}
	}
	
	if(ajaxQue.isLast(popId)){ //중복호출 일경우 실행 안시킴
		return false;
	}
	ajaxQue.push(popId);
	fncSetSStorageData("curPopId", popId);
	HNCFnc.ajax(
		url 
		, params
		, 'post'
		, 'html'
		, function(data, textStatus, jqXHR){
			ajaxQue.shift(popId, function(){
				//$('#dynamicPop .popup.full').removeClass('on');		// 팝업 열기전에 on 초기화
				
				if($(popId).length > 0){
					//$('body').append(data);
					var t= getTime();//todo  z-index
					var t2 = localStorage.getItem('z-index');	
					if(t2 == null) {
					t = 10001;
					localStorage.setItem('z-index', t);
					} else {
						t = parseInt(t2) + 1;
						localStorage.setItem('z-index', t);
					}
					if($(popId).hasClass('toast') || $(popId).hasClass('sub')){
						t = t + 1;
					}
//					$('#dynamicPop').append(data);
					openPopup(popId,'D',params, callBackFn);
				}else{
					//$('body').append(data); dynamicPop
					$('#dynamicPop').append(data);
					openPopup(popId,'D',params, callBackFn);
				}
				
				setTab($(data));
				
				if($(data).find('[data-tk-kbdType]').length > 0){
					if(mtk != null){
						mtk = null; //보안키보드 초기화
						transkey=[];
						$('form input[type=hidden]').filter('[id=transkeyUuid],[id^=transkey_]').remove();
					}
					initmTranskey();					
				}
				/*
				if(callBackFn != null || typeof(callBackFn)=="function"){
					callBackFn();
				}
				*/
			});
		}
		, function(data, textStatus, jqXHR){
			ajaxQue.shift(popId, function(){
				var msg = "";
				if(data.eMsg != undefined){
					msg = data.eMsg;
				} else {
					switch(data.status){
						case "500":
							msg = "응답 처리 중 오류가 발생하였습니다.";
							break;
						case "404":
							msg = "페이지를 찾을 수 없습니다.";
							break;
						default:
							msg = "알수없는 오류가 발생하였습니다.";
							break;
					}
				}
				
				mPop.alert(msg);
				HNCFnc.progressbar(false, true);
			});
			
			//console.log('POPUP CONTENTS ERROR('+data.status+') : ' + url, params); //TODO 어디서 오류 발생했는지 알수 있도록 할것
			
			return false;
		}
		// 로딩바 시작, 로딩바 종료, 비동기 유무
		// 약관 다수 팝업 일 시 false 처리 해줘야 함.
		, settings.isProgress, settings.isProgressEnd, settings.asyn,"Y", popId
	);
};

//SUB 팝업 ajax호출 
function openSubPopAjax(url, popId, params, callBackFn){
	
	fncSetSStorageData("curPopId", popId);
	HNCFnc.ajax(
		url 
		, params
		, 'post'
		, 'html'
		, function(data, textStatus, jqXHR){
			if($(popId).length > 0){
				//console.l
				//$('#subPopup').html(data);
				$('#subPopup '+popId).remove(); // 이미 팝업있는경우 다시 클릭시 여러개 생성됨
				$('#subPopup').append(data);
				$(popId).addClass('on');
				openPopup(popId,'S',params);
			}else{
				//$('#subPopup').html(data);
				$('#subPopup').append(data);
				$(popId).addClass('on');
				openPopup(popId,'S',params);
			}
			
			if(callBackFn != null || typeof(callBackFn)=="function"){
				callBackFn();
			}
		}
		, function(data, textStatus, jqXHR){
			mPop.alert(data.eMsg);
			return false;
		}
		// 로딩바 시작, 로딩바 종료, 비동기 유무
		// 약관 다수 팝업 일 시 false 처리 해줘야 함.
		, true, true, false
	);
};
//SUB 팝업 ajax호출 
function openPathSubPopAjax(url, popId, params, callBackFn){
	//alert(url)
	fncSetSStorageData("curPopId", popId);
	HNCFnc.ajax(
		url 
		, params
		, 'post'
		, 'html'
		, function(data, textStatus, jqXHR){
			
			if($(popId).length > 0){
				//console.l
				//$('#subPopup').html(data);
				$('#subPopup').append(data);
				//$(popId).addClass('on');
				//console.log("aaa>>" + popId);
				openPopup(popId,'S',params);
			}else{
				//$('#subPopup').html(data);
				$('#subPopup').append(data);
				//$(popId).addClass('on');
				//console.log("Bbb>>" + popId);
				openPopup(popId,'S',params);
			}
			/*
			$('#subPopup').append(data);
				//$(popId).addClass('on');
				//console.log("Bbb>>" + popId);
				$('#subPopup').append(data);
				openPopup(popId,'S',params);
			//}
			*/
			if(callBackFn != null || typeof(callBackFn)=="function"){
				callBackFn();
			}
		}
		, function(data, textStatus, jqXHR){
			mPop.alert(data.eMsg);
			return false;
		}
		// 로딩바 시작, 로딩바 종료, 비동기 유무
		// 약관 다수 팝업 일 시 false 처리 해줘야 함.
		, true, true, false
	);
};
//레이어 URL
function subOpenUrl(url, popId, params, callBackFn){
	
	if(!url) return false;
	
	if(typeof(url) == "string"){
		subUrlSubAjax(url, popId, params, callBackFn);
	}else{
		$.each(url, function(i, v){
			subUrlSubAjax(v, popId[i], params, callBackFn);
		});	
	};
};

//레이어 PATH
function subOpenPath(path, params){
	
	if(!path) return false;
	
	if(typeof(path) == "string"){
		
		subpathSubAjax(path, params);
	}else{
		$.each(path, function(i, v){
			
			subpathSubAjax(v, params);
		});
	}
};


function subUrlSubAjax(url, pPopId, params, callBackFn){
	//var popId = url.split('/')[url.split.length+1].split('.')[0];
	//createPopId = popId+Date.now();
	//return; 
	newPopId = "#" + pPopId;
	//newPopId = createPopId;  
	//console.log(params)
	if(params == undefined) params = {};
	//params.popupId = createPopId
	openSubPopAjax(url, newPopId, params 
	 , function(){
		
		if(callBackFn != null || typeof(callBackFn)=="function"){
				callBackFn();
		}
			
		//openPopup(newPopId,'S');
		//$('#' + newPopId).on('click', function(){
			//$(this).remove();
		//});
		/*
		$(newPopId+' .btn_close_popup').on('click', function(){
			$(this).parents('.popup').remove();
		});
		*/
	});
};

//정적 페이지 오픈
function subpathSubAjax(path, params){
	//alert(path)
	var popId = path.split('/')[path.split.length];
	
	newPopId = "#" + popId;
	//console.log(newPopId + "," + path) // 팝업ID, jsp패스 경로
	params.path = path; //jsp 경로
	
	url = '/common/commonLayer.hnc';
	//url = '/sample/sampleLayer.hnc';
	openSubPopAjax(url, newPopId, params
	//openPathSubPopAjax(url, newPopId, params
	//openPathSubPopAjax('/sample/sampleGetLayer.hnc', popId, params
	//openPathSubPopAjax('/sample/sampleGetLayer.hnc', popId, params
	, function(){
		//openPopup(newPopId,"S",params);
		/*
		$(popId+' .btn_close_popup').on('click', function(){
			$(this).parents('.popup').remove();
		});
		*/
	});
};

function popRemove(popId, callBackFn){
	$("#" + popId).remove();
		setTimeout(function() {
				if(callBackFn != null || typeof(callBackFn)=="function"){
				callBackFn();
			}
		}, 200);
	
}
//'/sample/popup2.hnc'
/* 설명      : 뒤로 가기 팝업에서 이전버튼 클릭시 동작
			  이전 페이지를 그대로 보여주는 경우
			  이전 
 * PARAM
	pageUrl : 페이지 url    '/sample/popup2.hnc'
	dvCd  	:'N' 현재 페이지 삭제하고 이전페이지 삭제하고 현재 페이지 생성
		     'S' 현재 페이지만 삭제한다.
	curPopId : 현재 페이지 Id
	prePopId : 이전 페이지 Id
	params   : dvCd가 N인 경우 현재 페이지에서 셋팅한다. popup2.jsp 참조
				newPopupId는 고정 컬럼, 추가로 Controller에서 화면 구성시 필요한 컬럼을 추가한다.
	 			var params = {
					newPopupId : "popup1"
				};
*/
function goBack(dvCd, pageUrl, curPopId, prePopId, params){
	if(dvCd=='N') { //현재 페이지 remove 이전페이지 remove 이전페이지 새로 생성
		/*
		popRemove(curPopId, function(){
			popRemove(prePopId, function(){
				openPopAjax(pageUrl, prePopId, {} 
				, function(){
					//console.log('page추가')
				});
			});
		});
		*/
		$("#" + prePopId).remove();
		$("#" + curPopId).remove();
		id = params.newPopupId + Date.now();
		params.popupId =  id;
		params.tg = "S";
		openPopAjax(pageUrl, "#" + params.popupId , params 
			, function(){
				
			});
	} else if(dvCd =='S') {//현재 페이지 remove 이전 페이지를 show
		//console.log(curPopId + "," + prePopId)
		historyArr.pop();
		$("#" + curPopId).remove();
		$("#" + prePopId).addClass("on");	
	}
	
};
//하단 버튼 클릭시 창 닫기
function closePopOnBtn(btnid) {
	var sectionId= fncGetSStorageData("curPopId");
	popCloseBtn(sectionId);
	
}
/*공통 alert
  설명 : 공통alert를 호출한다. 
        콜백이 없을 경우 동작없음 
  param 정의
	  title : alert 제목
	  contents : alert본문
	  btnOkTxt : 버튼명
	  callBackOkFn : 콜백 함수  string이나 function
	  콜백을 준경우는 콜백에서 닫기 넣어주자.
 예) openAlert('테스트', '테스트내용', '확인', 'okFunc')
    openAlert('테스트', '테스트내용', '확인',  okFunc)
	openAlert('테스트', '테스트내용', '확인', function(){alert('2')});
    openAlert('테스트', '테스트내용')
*/
function openAlert(title, contents, btnOkTxt, callBackOkFn) {
	if(btnOkTxt =='' || btnOkTxt == undefined) {
		v_btnOkTxt = "확인";
	} else {
		v_btnOkTxt = btnOkTxt;
	}
	$("#modalAlertTitle").html(title);
	$("#modalAlertContents").html(contents);
	$("#modalAlertClose").html(v_btnOkTxt);
	openPopup('#modalAlertPop');
	//$("#modalAlertOk").off("click").click(closeAlert()).click(( fnc != undefined && $.isFunction(fnc))? fnc : function(){});
	$("#modalAlertClose").on("click", function() {
		if(typeof(callBackOkFn)=="string"){
			if(callBackOkFn =='') {
				//console.log('콜백실행 불가(콜백함수 공백)')
				//closeAlert()
			} else {
				try {
					window[callBackOkFn]();
				} catch(e) {
					//console.log('error>' + e);
				}
			}
		} else if(typeof(callBackOkFn)=="function"){
			callBackOkFn();
		} else if(callBackOkFn == undefined) {
			//console.log('콜백실행 불가(undefined)')
			//closeAlert()
		}
		closeAlert();
	});
	
}
function closeAlert() {
	$('#modalAlertPop').removeClass('on').removeAttr('tabindex');
	if ($('.dim').length > 0) {
		$('#modalAlertPop').find('.dim').remove();
	}
	
}
/*공통 Confirm
  설명 : 공통Confirm을 호출한다. 
        콜백이 없을 경우 동작없음 
  param 정의
		  title : alert 제목
		  contents : alert본문
		  btnOkTxt : 버튼명 (2번째)
		  callBackOkFn : 콜백 함수  string이나 function
		  btnCancelTxt : 버튼명(1번째)
		  callBackCancelFn : 콜백 함수  string이나 function		
  예)openConfirm('테스트', '테스트내용', '확인','okFunc', '취소', 'cancelFunc', )
    openConfirm('테스트', '테스트내용', '확인', okFunc,  '취소',  cancelFunc)
    openConfirm('테스트', '테스트내용', '확인', okFunc)
	openConfirm('테스트', '테스트내용', '확인') 
*/
function openConfirm(title, contents,  btnOkTxt, callBackOkFn, btnCancelTxt,  callBackCancelFn) {
	if(btnCancelTxt =='' || btnCancelTxt == undefined) {
		v_btnCancelTxt = "취소" ;
	} else {
		v_btnCancelTxt = btnCancelTxt;
	}
	$("#modalConfirmTitle").html(title);
	$("#modalConfirmContent").html(contents);
	$("#modalConfirmBtn1").html(v_btnCancelTxt);
	$("#modalConfirmBtn2").html(btnOkTxt);
	openPopup('#modalConfirmPop');
	//$("#modalConfirmCancelBtn").off("click").click(closeConfirm).click(
		//( fnc != undefined && $.isFunction(fnc))? fnc : function(){}
		//);
	//$("#modalConfirmCancelBtn").off("click").click(closeConfirm(fnc));
	$("#modalConfirmBtn1").on("click", function() {
		if(typeof(callBackCancelFn)=="string"){
			if(callBackCancelFn =='') {
				//console.log('콜백실행 불가(콜백함수 공백)')
			} else {
				try {
					window[callBackCancelFn]();
				} catch(e) {
					//console.log('error>' + e);
				}
			}
		} else if(typeof(callBackCancelFn)=="function"){
			callBackCancelFn();
		} else if(callBackCancelFn == undefined) {
			//console.log('콜백실행 불가(undefined)')
		}
	});
	$("#modalConfirmBtn2").on("click", function() {
		if(typeof(callBackOkFn)=="string"){
			if(callBackOkFn =='') {
				//console.log('콜백실행 불가(콜백함수 공백)')
				//closeConfirm();
			} else {
				try {
					window[callBackOkFn]();
				} catch(e) {
					//console.log('error>' + e);
				}
			}
		} else if(typeof(callBackOkFn)=="function"){
			callBackOkFn();
		} else if(callBackOkFn == undefined) {
			//console.log('콜백실행 불가(undefined)')
			//closeConfirm();
		}
		closeConfirm();
	});
}
function closeConfirm() {
	$('#modalConfirmPop').removeClass('on').removeAttr('tabindex');
	if ($('.dim').length > 0) {
		$('#modalConfirmPop').find('.dim').remove();
	}
	
	//addOn 2022.03.05
	//바닥페이지인 경우, popup_opened 제거 
	if($('body').hasClass('popup_opened')){
		$('body').removeClass('popup_opened');
	}
}
/**
 * 
 */
function fncSetLStorageData(key, val) {
	localStorage.setItem(key, val);
}
/**
 * 
 */
function fncGetLStorageData(key) {
	return localStorage.getItem(key);
}

/**
 * 
 */
function fncSetSStorageData(key, val) {
	sessionStorage.setItem(key, val);
}
/**
 * 
 */
function fncGetSStorageData(key) {
	return sessionStorage.getItem(key);
}
function checkHistory(pId) {
	//historyArr = fncGetSStorageData("history");
	isFlag=false;
	historyArr.forEach((value, index, array) =>{
		if(value==pId) isFlag=true; 
	});
	return isFlag;
}
historyArr = []
historyNewArr = []
/**
 * 화면 오픈시 history 기록
 */
function fncSaveHistory(pId) {
	//historyArr = fncGetSStorageData("history");
	//console.log(historyArr)
	if(historyArr.length ==0) {
		historyArr.push(pId);
		//console.log('1.스토리지 생성하고 2.화면배열 생성후 화면ID 추가 3.스토리지에 화면 배열 담기')
	} else {
		historyArr.push(pId); //백일때 push안한다.
		//console.log('1.화면 배열 복제하고 화면ID 추가 2.화면 배열 스토리지에 담기')
		historyArr.forEach((value, index, array) =>{
			//console.log(index +':' + value)
		});
	}
}

/*  설명  이전 페이지 이동시 호출한다.
         이전 페이지가 바로 전단계이거나 몇단계 건너띄는 경우
         현재 페이지부터 이전페이지 사이는 remove
		 이전 페이지는 dvCd가 N인 경우 remove, S인 경우 show
		 해당 함수는 동적 영역으로 만든 페이지에서 동작
 *  파람
    dvCd  'N' 이전 페이지 새로 생성 'S' 이전페이지 유지
	pId    이전페이지ID
    pageUrl '이전 페이지 url' dvCd는 N인 경우 필요
	params pageUrl 호출시 넘길 파라미터
*/
function fncBackHistory(dvCd, pId, pageUrl, params) {
	//console.log('fncBackHistory strart')
	historyNewArr = [...historyArr].reverse();
	//console.log('fncBackHistory' + historyNewArr)
	for(let i=0; i<historyNewArr.length; i++) {
		//console.log(i +">>" + historyNewArr[i]);
		if(historyNewArr[i] != pId) {
			historyArr.pop();
			$("#" + historyNewArr[i]).remove();
		} else {
			if(dvCd =='N') {
				//console.log('1.신규인 경우 화면 재생성')
				
				params.tg = "S";
				//console.log(">>>>>" + params.popupId)
				/*
				if(params.popupId == undefined) {
					params.popupId = pId;
				} else {
					pId = params.popupId;
				}
				*/
				$("#" + pId).remove();
				//historyArr[i] = pId; //교체한 경우
				openPopAjax(pageUrl, "#" + pId , params, function(){});
			} else {
				//console.log('1.유지인 경우 화면 show')
				$("#" + pId).addClass("on");
			}
			//console.log("history>>" + historyArr);
			break;
		};
	};
	//console.log('fncBackHistory end')
}

/*$(window).scroll(function(){
	//console.log('3333');
	titleEvent();
});*/

/*$(window).resize(function() {
	setTab();
});*/


function fnScrollDisable() {
	$('body').addClass('scrollDisable').on('scroll touchmove mousewheel', function(e) {
		e.preventDefault();
	});
}

function fnScrollAble() {
	$('body').removeClass('scrollDisable').off('scroll touchmove mousewheel');
}

var CodeToast = {
	init : function(){
		//-- 토스트 닫기 --
		$("section[id^=pop_ct_] .btn_close_popup").on("click", function(e){
			CodeToast.close($(this).closest("section[id^=pop_ct_]").attr("id"));
		});
		
		$("section[id^=pop_ct_] .popup_content button").on("click", function(){
			var selectedValue = $(this).data("value");
			var selectedName = $.trim($(this).text());
			var codeID = $(this).closest(".popup_content").data("id");
			if($("#pop_ct_"+codeID+"_val").length == 1){
				$("#pop_ct_"+codeID+"_val").val(selectedValue);
				$("#pop_ct_"+codeID+"_val").data("name", selectedName);
			}
			
			var toastPopEl = $(this).closest("section[id^=pop_ct_]");
			
			CodeToast.close("#"+toastPopEl.attr("id"));
			
			if($(".btn_combobox[data-code="+codeID+"]") != undefined){
				$(".btn_combobox[data-code="+codeID+"]").text(selectedName);
			}
			if(window["fnCbCodeToast"+codeID] != undefined && typeof window["fnCbCodeToast"+codeID] == "function"){
				window["fnCbCodeToast"+codeID](selectedValue, selectedName);
			}
			
		});
	}
	, open:function(target) {//열기
		
		var codeID = "";
		var title = "";
		if(typeof target == "object"){
			codeID = $(target).data("code");
			title = $(target).data("title");
			if(title == undefined) title = "선택";
		} else if(typeof target == "string"){
			codeID = target;
			title = "선택";
		}
		
		if(title != undefined && $.trim(title) != "") {
			$("#pop_ct_"+codeID).find(".container header h1").text(title);
		}
		
		openPopup("#pop_ct_"+codeID);
		
		
	}
	, close:function(id){ //닫기

		if(window["closeToastPop"] != undefined && typeof window["closeToastPop"] == "function"){
			closeToastPop(id);
		} else {
			var popId = $(id); 
			if (popId.hasClass('toast')) {
				popId.find('> .container').removeClass('up');
			}
			
			popId.removeClass('on').removeAttr('tabindex');
			if ($('.dim').length > 0) {
				popId.find('.dim').remove();
			}
		}
	}
	,getValue:function (id){
		var toastValueId ="#pop_ct_"+id+"_val";
		 
		return [$(toastValueId).val(), $(toastValueId).data("name")];
	}
	
	,setValue:function(id, value){
		var popup = $("#pop_ct_"+id);
		var item = "";
		try{
			item = popup.find(".list_select_option button[data-value='"+value+"']");
			
			if(item != undefined && item.length == 1){
				item.trigger("click");
			} else {
				return false;
			}
			
		}catch(e){
			//console.log(e);
			//목록에 없음
			return false;
		}
		return true;
	}
	, clearToast:function(id_lst){
		$.each(id_lst, function(idx, data){
			$("#pop_ct_"+data).remove();
		});
	}
};



/**
* sectionId : form id 또는 section id 
* buttonId : section id에서 활성/비활성화 되어야 할 버튼 id
* sectionId 에 포함된 input 태그에 required 추가
*/
function gfnRequiredCheck(sectionId, buttonId){
	fnRequiredCheck(sectionId, buttonId);
	fnRequiredBind(sectionId, buttonId);
	
}


/**
필수입력 바인딩
 */
function fnRequiredBind(sectionId, buttonId){
	$("#" + sectionId + " :input, textarea, select").each(function(){
		//hidden, button, number, text, checkbox
		////console.log($(this).attr("type") + "====" + $(this).attr("id") + "===" + $(this).attr("required") + "===" + $(this).prop("tagName"));
		if($(this).attr("required") == "required"){
			////console.log($(this).attr("type") + "====" + $(this).attr("id"));
			
			if($(this).attr("type") == "text" || $(this).attr("type") == "number"  || $(this).attr("type") == "password" 
				|| $(this).attr("type") == "tel" || $(this).prop("tagName") == "TEXTAREA"
				|| $(this).prop("tagName") == "SELECT"){
				$(this).on("keyup input change propertyChange", function(){
					fnRequiredCheck(sectionId, buttonId);
				});
			}
			else if($(this).attr("type") == "checkbox" || $(this).attr("type") == "radio"){
				$(this).on("click change propertyChange input", function(){
					fnRequiredCheck(sectionId, buttonId);
				});
			}
		}
		
		if($(this).attr("type") == "button" && $(this).hasClass("required")){
			$(this).on("propertyChange input click change blur", function(){
				fnRequiredCheck(sectionId, buttonId);
			});
		}
	});
}



/**
필수입력 체크 및 버튼 활성/비활성화
 */
function fnRequiredCheck(sectionId, buttonId){
	$("#" + buttonId).prop("disabled", false);
	
	
	var obj = $("#" + sectionId + " :input, textarea, select");
	for(var i=0; i<obj.length; i++){
		if($(obj[i]).attr("type") != "button"){
			if($(obj[i]).attr("required") != "required" ){
				continue;
			}
		}else if(!$(obj[i]).hasClass("required")){
			continue;
		}
		
		
		var str = "";
		if($(obj[i]).attr("type") == "text" || $(obj[i]).attr("type") == "number" || $(obj[i]).attr("type") == "password" 
			|| $(obj[i]).attr("type") == "tel" || $(obj[i]).prop("tagName") == "TEXTAREA" || $(obj[i]).prop("tagName") == "SELECT"){
			str = $(obj[i]).val();
		}else if($(obj[i]).attr("type") == "checkbox" || $(obj[i]).attr("type") == "radio"){
			if($(obj[i]).prop("checked")){
				str = $(obj[i]).val();
			}
		}else if($(obj[i]).attr("type") == "button"){
			str = $(obj[i]).text();
			if(str == "선택"){
				str = "";
			}
		}
		
		////console.log( $(obj[i]).attr("id") + "====" + str);
		if(str == undefined || str == null || $.trim(str) == ""){
			//alert("필수입려값 누락");
			//$(obj[i]).focus();
			$("#" + buttonId).prop("disabled", "disabled");
			return;
		}
	}
}

function comCheckDeviceOS(){
	return HNCFnc.comCheckDeviceOS();
}