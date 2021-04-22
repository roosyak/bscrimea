// Detect IE
var browserIE = false;
if(whichBrs() == 'Internet Explorer') browserIE = true;

// Detect Mobile
var browserMobile = false;
if($('body').hasClass('layout-mobile')) browserMobile = true;

var browserIphone = false;
if($('body').hasClass('layout-phone')) browserIphone = true;

// Detect Browsers with font problems
var browserFontProblem = false;
if(whichBrs() == 'Safari') browserFontProblem = true;

// Vars
var InfiniteSliderColumns;

// Elements
var $wrapper = $('#wrapper'),
	$header = $('#header'),
	$section = $('#section'),
	$footer = $('#footer'),
	$imgbg = $('#imgbg'),
	$valignCenter = $('.valign-center'),
	$navMainLi = $('ul.nav-main > li', $header),
	$sliderColumns = $('#slider-container-columns');

var animRunning = false,
	companyData = [],
	InfiniteSliderColumns,
	shareChartLines = [];

//$(window).load(function(){  
	/* ////////////////////////////////////////
	//
	// General
	//
	/////////////////////////////////////// */

	// Main Navigation - Show Subnav
	if(browserMobile){
		$('> a', $navMainLi).on('click', function(){
			var $subnav = $(this).siblings('div');

			if($subnav.length == 1){
				// Open
				if($subnav.height() == 0){
					$subnav.height($('> ul', $subnav).outerHeight());
				}
				// Close
				else {
					$subnav.height(0);
				}

				return false;
			}
		});
	} else {
		$('> a', $navMainLi).on('mouseenter', function(){
			var $subnav = $(this).siblings('div');
			$subnav.height($('> ul', $subnav).outerHeight());
		});
	}

	$navMainLi.on('mouseleave', function(){
		$('> div', this).height(0);
	});

	// Header Mobile
	$('#header-mobile .btn-toggler').on('click', function(){
		var $fixedContent = $section;
		if($sliderColumns.length == 1) $fixedContent = $sliderColumns;

		// Open
		if(!$(this).hasClass('close')){
			$fixedContent.attr('data-scroll',currentScroll).css({'position': 'fixed', 'top': -currentScroll});

			$(this).addClass('close');
			$('#menu-mobile').stop(true, true).fadeIn(250);
		}
		// Close
		else {
			$(this).removeClass('close');
			$('#menu-mobile').stop(true, true).fadeOut(250, function(){
				$fixedContent.css({'position': 'relative', 'top': '0'});
				$('html, body').scrollTop($fixedContent.attr('data-scroll'));
			});
		}

		return false;
	});

	$('#menu-mobile .subnav > a').on('click', function(){
		$(this).toggleClass('close');
		$(this).next('div').stop(true, true).slideToggle(250);

		return false;
	});
	
	/* ////////////////////////////////////////
	//
	// Home
	//
	/////////////////////////////////////// */

	$sliderColumns.each(function(){
		if(browserIphone) $('.slider > ul > li:eq(3)', $sliderColumns).remove();

		// Init Slider
		InfiniteSliderColumns = new InfiniteSlider($sliderColumns,750,7000,'columns','easeOutQuad',false,true);

		// Init Flipping Text
		setInterval(function(){
			$('.flip-container').toggleClass('hover');
		}, 4000);

		// Init Knobs
		$(".knob").knob();
	});

	/* ////////////////////////////////////////
	//
	// Share Price
	//
	/////////////////////////////////////// */

    $('#share-price-chart').each(function(){
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var todaysDate = new Date();
		var day = todaysDate.getDate();
		var month = months[todaysDate.getMonth()];
		var year = todaysDate.getFullYear();
		fillShareChart('http://www.google.com/finance/historical?q=OTCMKTS:ICORD&startdate=Jan+01%2C+2009&enddate='+month+'+'+day+'%2C+'+year+'&output=csv');
	});

	/* ////////////////////////////////////////
	//
	// FAQ
	//
	/////////////////////////////////////// */

	$('.contentToggler').each(function(){
		new ContentToggler($(this));
	});

	/* ////////////////////////////////////////
	//
	// Contact
	//
	/////////////////////////////////////// */

	$('#section.contact .map').each(function(){
		var latitude = parseFloat($(this).attr('data-latitude'));
		var longitude = parseFloat($(this).attr('data-longitude'));
		var mapID = $('> div', this).attr('id');

		initializeMap(latitude, longitude, mapID);
	});

	/* ////////////////////////////////////////
	//
	// Init
	//
	/////////////////////////////////////// */
	
	positionContent();

	$('#loading-mask').fadeOut(750);
	$('.animated-line, .animated-line-top').each(function(){
		var $object = $(this);
		var delay = Math.floor((Math.random()*300)+150); 

		setTimeout(function(){
			$object.addClass('animated');
		}, delay);
	});
	$('#section > h1 > span, #section.contact h2 > span, #slide-1 h2 > span').each(function(){
		var $object = $('> span', this);
		var delay = Math.floor((Math.random()*450)) + ($(this).index() * 150); 

		setTimeout(function(){
			$object.width($object.parent().width());
		}, delay);
	});

	if(browserMobile) $('html, body').scrollTop(1);
// });

/* ////////////////////////////////////////////////////////////////////////////
//
// Fill Chart
//
/////////////////////////////////////////////////////////////////////////// */

function fillShareChart(remote_url) {/*
    $.ajax({
        url: "http://query.yahooapis.com/v1/public/yql?"+"q=select%20*%20from%20html%20where%20url%3D%22"+encodeURIComponent(remote_url)+"%22&format=json",
        type: 'get',
        dataType: 'jsonp',
        success: function(data) {
			// Get Data
			var allText = data.query.results.body.p;
			var allTextLines = allText.split(' ');
		    var lines_nb = allTextLines.length;

		    for(var i = 0; i < lines_nb; i ++){
				var lineData = allTextLines[i].split(',');
				shareChartLines.push(lineData);
		    }

		    shareChartLines.splice(0,1);

		    createShareChart();
        },
        error: function(jqXHR, textStatus, errorThrow){
            console.log(jqXHR['responseText']);
        }
    });*/
}

function createShareChart(){
	// Get Last 9 Values
	var labels = [];
	var dataset = [];
	var lowest = 1000000;
	var highest = 0;
	var step = 0;

	for(var i = 8; i >= 0; i --){
		labels.push(shareChartLines[i][0]);
		dataset.push(shareChartLines[i][4]);

		if(shareChartLines[i][4] < lowest) lowest = parseFloat(shareChartLines[i][4]);
		if(shareChartLines[i][4] > highest) highest = parseFloat(shareChartLines[i][4]);
	}

	var step = (highest / 4).toFixed(2);

	// Create Chart
	var chartData = {
		labels : labels,
		datasets : [
			{
				fillColor : "rgba(239,68,95,0.75)",
				strokeColor : "rgba(220,220,220,0)",
				pointColor : "rgba(220,220,220,0)",
				pointStrokeColor : "transparent",
				data : dataset
			}
		]
	};

	var chartOptions = {
		bezierCurve : false,
		// Override
		scaleOverride : true,
		scaleSteps : 5,
		scaleStepWidth : step,
		scaleStartValue : 0,
		// Override
		scaleLineColor : "rgba(239,68,95,1)",
		scaleLineWidth : 2,
		scaleFontFamily : "'Roboto Condensed'",
		scaleFontSize : 13,
		scaleFontStyle : "normal",
		scaleFontColor : "#fff",	
		scaleShowGridLines : true,
		scaleGridLineColor : "rgba(163,191,198,.4)",
		scaleGridLineWidth : 1
	};

	var ctx = $('#share-price-chart').get(0).getContext('2d');
	var myNewChart = new Chart(ctx).Line(chartData,chartOptions);
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Google Map
//
/////////////////////////////////////////////////////////////////////////// */

function initializeMap(latitude, longitude, mapID) {/*
    var g = new google.maps.LatLng(latitude, longitude);
    var b = {
        zoom: 15,
        center: g,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
		  {
		    "stylers": [
		      { "visibility": "simplified" },
		      { "saturation": 100 },
		      { "hue": "#0099ff" }
		    ]
		  },{
		    "stylers": [
		      { "gamma": 0.81 },
		      { "lightness": -46 },
		      { "saturation": -76 }
		    ]
		  },{
		    "featureType": "road",
		    "stylers": [
		      { "hue": "#0091ff" },
		      { "visibility": "on" },
		      { "saturation": 10 },
		      { "lightness": 3 }
		    ]
		  },{
		    "stylers": [
		      { "invert_lightness": true },
		      { "lightness": -50 }
		    ]
		  },{
		    "featureType": "landscape",
		    "stylers": [
		      { "visibility": "simplified" }
		    ]
		  },{
		    "featureType": "poi",
		    "stylers": [
		      { "visibility": "simplified" }
		    ]
		  },{
		    "featureType": "poi",
		    "stylers": [
		      { "visibility": "off" }
		    ]
		  },{
		    "stylers": [
		      { "hue": "#00b2ff" },
		      { "lightness": 2 },
		      { "gamma": 0.88 },
		      { "saturation": 20 }
		    ]
		  },{
		    "featureType": "road.highway",
		    "stylers": [
		      { "saturation": -36 },
		      { "lightness": -1 }
		    ]
		  },{
		    "stylers": [
		      { "saturation": -20 },
		      { "hue": "#00aaff" }
		    ]
		  }
		]
    };
    var d = new google.maps.Map(document.getElementById(mapID), b);
    var a = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: d,
        icon: "http://phoenix-m.com/intercore/images/layout/contact_icon-map.png"
    });*/
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Window Functions
//
/////////////////////////////////////////////////////////////////////////// */

$(window).resize(function(){
	positionContent();
});

$(window).scroll(function(){
	scrollContent();
});

/* ////////////////////////////////////////////////////////////////////////////
//
// Position Content
//
/////////////////////////////////////////////////////////////////////////// */

function positionContent(){
	// Resize Layout
	var bodyClass = '';
	if($(window).width() < 1660) bodyClass = 'layout-1280';
       if($(window).width() < 1280) bodyClass = 'layout-980';
	if($(window).height() < 900){
		bodyClass += ' layout-short';
		if($sliderColumns.length == 1) $wrapper.height(900);
	} else {
		$wrapper.height('auto');
	}
	if(browserFontProblem) bodyClass += ' layout-font-substitute';
	$wrapper.attr('class',bodyClass);

	// Resize Bg Images
	$imgbg.each(function(){
		var bg_main = $(this);
		var wrapper = $(window);
		var wrapperWidth = wrapper.width();
		var wrapperHeight = wrapper.height();

		// Background Image
		var bgMainRatio = 1920/1080;
		var wrapperRatio = wrapperWidth/wrapperHeight;

		// Background Main
		if(bgMainRatio > wrapperRatio){
			bg_main
				.height(wrapperHeight)
				.width(wrapperHeight * bgMainRatio)
				.css('left',-(bg_main.width()/2 - wrapperWidth/2)+'px')
				.css('top','0');
		} else {
			bg_main
				.width(wrapperWidth)
				.height(wrapperWidth / bgMainRatio)
				.css('left','0')
				.css('top',-(bg_main.height()/2 - wrapperHeight/2)+'px');
		}
	});

	// Resize Valign Center
	$valignCenter.each(function(){
		$(this).css('padding-top', ($(this).parent().height()/2 - $(this).height()/2)+'px');
	});

	// Resize Slider Columns
	$sliderColumns.each(function(){
		InfiniteSliderColumns.reset(InfiniteSliderColumns);
	});
	
	scrollContent();
}

function scrollContent(){
	var totalScroll = $(document).height() - $(window).height();
	
	if(browserMobile){
		newScroll = $(window).scrollTop();
	} else {
		if(whichBrs() == 'Safari' || whichBrs() == 'Chrome'){
			newScroll = $('body').scrollTop();
		} else {
			newScroll = $('html,body').scrollTop();
		}
	}
	
	// Adjust Header
	$header.each(function(){
		// Move
		if(newScroll < 35){
			$('.header-full', this)
				.css('padding-top', 45 - newScroll)
				.removeClass('locked');
		}
		// Lock
		else {
			$('.header-full', this)
				.css('padding-top', 10)
				.addClass('locked');
		}
	});
	
	currentScroll = newScroll;
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Get Browser
//
/////////////////////////////////////////////////////////////////////////// */

function whichBrs() {
	var agt=navigator.userAgent.toLowerCase();
	if (agt.indexOf("opera") != -1) return 'Opera';
	if (agt.indexOf("staroffice") != -1) return 'Star Office';
	if (agt.indexOf("webtv") != -1) return 'WebTV';
	if (agt.indexOf("beonex") != -1) return 'Beonex';
	if (agt.indexOf("chimera") != -1) return 'Chimera';
	if (agt.indexOf("netpositive") != -1) return 'NetPositive';
	if (agt.indexOf("phoenix") != -1) return 'Phoenix';
	if (agt.indexOf("firefox") != -1) return 'Firefox';
	if (agt.indexOf("chrome") != -1) return 'Chrome';
	if (agt.indexOf("safari") != -1) return 'Safari';
	if (agt.indexOf("skipstone") != -1) return 'SkipStone';
	if (agt.indexOf("msie") != -1) return 'Internet Explorer';
	if (agt.indexOf("netscape") != -1) return 'Netscape';
	if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
	if (agt.indexOf('\/') != -1) {
		if (agt.substr(0,agt.indexOf('\/')) != 'mozilla') {
			return navigator.userAgent.substr(0,agt.indexOf('\/'));
		} else return 'Netscape';
	} else if (agt.indexOf(' ') != -1)
		return navigator.userAgent.substr(0,agt.indexOf(' '));
	else return navigator.userAgent;
}