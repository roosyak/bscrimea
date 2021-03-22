/* ////////////////////////////////////////////////////////////////////////////
//
// Infinite Slider
// V 1.0
// Alexandra Nantel
// Last Update 01/11/2012 10:22
//
/////////////////////////////////////////////////////////////////////////// */

function InfiniteSlider(wrapper,speed,duration,mode,easing,hover,animation){
	var _infiniteSlider = this;
		
	// If true : running
	this.animated = false;
	// Autorotation
	this.hover = hover;
	this.autorotation = animation;
	this.running = true;
	this.t;
	// Setting the container and controller
	this.wrapper = $(wrapper);
	this.container = $('.slider',this.wrapper);
	this.arrows = $('.slider-arrows',this.wrapper);
	this.count = $('.count',this.arrows);
	this.controls = $('.slider-controls',this.wrapper);
	this.infos = $('.slider-infos',this.wrapper);
	this.speed = speed;
	this.duration = duration;
	this.mode = mode; // slide - slidev - fade - demask
	this.easing = easing;
	this.width = this.container.width();
	this.height = this.container.height();
	// Setting index : slide ordered index || indexSlide : slide real index
	this.index = 0;
	this.indexSlide = 0;
	// Number of elements
	this.length = $('li', this.container).length - 1;
	this.chartLines = [];
	
	/* Initialize
	//////////////////////////////////////////////////////////////////////// */
	
	// Identify each slide and control with initial order
	$('> ul > li', this.container).each(function(){
		$(this).attr('data-slide',$(this).index() + 1);
		
		if($(this).index() == 0){
			$(this).addClass('active');
			$(_infiniteSlider.controls).append('<li class="active" data-slide="'+($(this).index() + 1)+'"><a href=""><span>Slide '+($(this).index() + 1)+'</span></a></li>');
		} else {
			$(this).addClass('inactive');
			$(_infiniteSlider.controls).append('<li class="inactive" data-slide="'+($(this).index() + 1)+'"><a href=""><span>Slide '+($(this).index() + 1)+'</span></a></li>');
		}
	});
	
	$('li', this.controls).each(function(){
		$(this).attr('data-slide',$(this).index() + 1);
		
		if($(this).index() == 0){
			$(this).addClass('active');
			$('a span', this).css('opacity', '1').width('100%');
		} 
		else $(this).addClass('inactive');
	});
	
	// Fill Count values
	$(this.count).html((this.index + 1)/*+' / '+(this.length + 1)*/);
	
	// Fill First Infos
	if($('> ul > li:eq(0)', this.container).attr('data-infos') != '') $(this.infos).html($('> ul > li:eq(0)', this.container).attr('data-infos'));
	
	// Disable if just one slide
	if(this.length == 0){
		$(this.controls).hide();
		this.autorotation = false;
	}
	
	// Initiate Positioning
	this.reset(_infiniteSlider);
	
	// Bind
	if(this.hover){
		$(this.wrapper).mouseenter(function(){
			_infiniteSlider.stop(_infiniteSlider);
		});
		$(this.wrapper).mouseleave(function(){
			_infiniteSlider.start(_infiniteSlider);
		});
	}

	$('li a',this.controls).click(function(){
		_infiniteSlider.controlsClick($(this),_infiniteSlider);
		
		return false;
	});

	$('li a',this.arrows).click(function(){
		_infiniteSlider.arrowsClick($(this),_infiniteSlider);
		
		return false;
	});
	
	/*$(window).resize(function(){
		_infiniteSlider.reset(_infiniteSlider);
	});*/
	
	// Start Autorotation
	if(this.running) setTimeout(function(){ _infiniteSlider.autoRotation(_infiniteSlider); }, 750);

	// If Chart
	if($('#slide-3-chart').length > 0){
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var todaysDate = new Date();
		var day = todaysDate.getDate();
		var month = months[todaysDate.getMonth()];
		var year = todaysDate.getFullYear();
		_infiniteSlider.fillChart('http://www.google.com/finance/historical?q=OTCMKTS:ICORD&startdate=Jan+01%2C+2009&enddate='+month+'+'+day+'%2C+'+year+'&output=csv',_infiniteSlider);
	}
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Autorotation
//
/////////////////////////////////////////////////////////////////////////// */

InfiniteSlider.prototype.autoRotation = function(_infiniteSlider){
	clearTimeout(_infiniteSlider.t);	
	
	if($('li', _infiniteSlider.controls).length > 1 && _infiniteSlider.autorotation){
		if(_infiniteSlider.running){
			_infiniteSlider.t = setTimeout(function(){
				_infiniteSlider.changeSlide(_infiniteSlider.indexSlide,_infiniteSlider.indexSlide + 1,_infiniteSlider)
			},_infiniteSlider.duration);
		}
	}
}

/* ////////////////////////////////////////////////////////////////////////////
//
// External Functions
//
/////////////////////////////////////////////////////////////////////////// */

InfiniteSlider.prototype.start = function(_infiniteSlider){ 
	_infiniteSlider.running = true;
	_infiniteSlider.autoRotation(_infiniteSlider);
	
	return false;
}

InfiniteSlider.prototype.stop = function(_infiniteSlider){ 
	clearTimeout(_infiniteSlider.t); 
	_infiniteSlider.running = false; 
	
	return false;
}

InfiniteSlider.prototype.arrowsClick = function(object,_infiniteSlider){
	if(!_infiniteSlider.animated){
		_infiniteSlider.autorotation = false;
		_infiniteSlider.wrapper.addClass('stopped');

		// Stop timer
		clearTimeout(_infiniteSlider.t);
		
		if($(object).parent().hasClass('next')) var clicked = _infiniteSlider.indexSlide + 1;
		else var clicked = _infiniteSlider.indexSlide - 1;

		_infiniteSlider.changeSlide(_infiniteSlider.indexSlide,clicked,_infiniteSlider);
	}

	return false;
}

InfiniteSlider.prototype.controlsClick = function(object,_infiniteSlider){
	if(!_infiniteSlider.animated && $(object).parent().hasClass('active') == false){
		_infiniteSlider.autorotation = false;
		_infiniteSlider.wrapper.addClass('stopped');

		// Stop timer
		clearTimeout(_infiniteSlider.t);
		
		var clicked = $(object).parent().index();
		
		$('> ul > li',_infiniteSlider.container).each(function(){
			if($(this).attr('data-slide') == clicked + 1){
				_infiniteSlider.changeSlide(_infiniteSlider.indexSlide,$(this).index(),_infiniteSlider);
			} 
		});	
	}

	return false;
}

InfiniteSlider.prototype.reset = function(_infiniteSlider){
	if(!_infiniteSlider.animated){
		_infiniteSlider.stop(_infiniteSlider);
		_infiniteSlider.width = _infiniteSlider.container.width();
		_infiniteSlider.height = _infiniteSlider.container.height();
		$('> ul > li',_infiniteSlider.container).width(_infiniteSlider.width);
		
		// Demask Specific
		if(_infiniteSlider.mode == 'demask'){
			$('> ul > li.inactive',_infiniteSlider.container).width(0);
			$('> ul > li > img',_infiniteSlider.container).width(_infiniteSlider.width);
		}

		// Columns Specific
		if(_infiniteSlider.mode == 'columns'){
			$('> ul > li > img',_infiniteSlider.container).each(function(){
				var bg_main = $(this);
				var wrapper = $(this).parent();
				var wrapperWidth = wrapper.width();
				var wrapperHeight = wrapper.height();
				var colWidth = parseInt($(this).parent().attr('data-col-width'));
				var nbCols;
				var columnsContent = '';

				// Background Image
				var bgMainRatio = 1920/1080;
				var wrapperRatio = wrapperWidth/wrapperHeight;

				// Background Main
				if(bgMainRatio > wrapperRatio){
					// Calculate Width depending on ColWidth
					var imgWidth = wrapperHeight * bgMainRatio;

					nbCols = Math.ceil(imgWidth / colWidth);
					if(!$('#wrapper').hasClass('layout-1440') && !$('#wrapper').hasClass('layout-980')){
						if(nbCols % 2 != 1) nbCols = nbCols + 1;
					} else {
						if(nbCols % 2 == 1) nbCols = nbCols + 1;
					}

					imgWidth = nbCols * colWidth;

					// Resize Containers
					bg_main
						.width(imgWidth)
						.height(imgWidth / bgMainRatio)
						.css('left',-(bg_main.width()/2 - wrapperWidth/2)+'px')
						.css('top',-(bg_main.height()/2 - wrapperHeight/2)+'px');

					bg_main.siblings('.columns')
						.width(imgWidth)
						.height(imgWidth / bgMainRatio)
						.css('left',-(bg_main.width()/2 - wrapperWidth/2)+'px')
						.css('top',-(bg_main.height()/2 - wrapperHeight/2)+'px');
				} else {
					// Calculate Width depending on ColWidth
					var imgWidth = wrapperWidth;

					nbCols = Math.ceil(imgWidth / colWidth);
					if(!$('#wrapper').hasClass('layout-1440') && !$('#wrapper').hasClass('layout-980')){
						if(nbCols % 2 != 1) nbCols = nbCols + 1;
					} else {
						if(nbCols % 2 == 1) nbCols = nbCols + 1;
					}

					imgWidth = nbCols * colWidth;

					// Resize Containers
					bg_main
						.width(imgWidth)
						.height(imgWidth / bgMainRatio)
						.css('left',-(bg_main.width()/2 - wrapperWidth/2)+'px')
						.css('top',-(bg_main.height()/2 - wrapperHeight/2)+'px');

					bg_main.siblings('.columns')
						.width(imgWidth)
						.height(imgWidth / bgMainRatio)
						.css('left',-(bg_main.width()/2 - wrapperWidth/2)+'px')
						.css('top',-(bg_main.height()/2 - wrapperHeight/2)+'px');
				}

				// Fill Columns
				for(var i = 0; i < nbCols; i ++){
					var posLeft = - i * colWidth;
					columnsContent += '<li><div><img src="'+$(this).parent().attr('data-img-src')+'" alt="" style="left: '+posLeft+'px; width: '+bg_main.width()+'px; height: '+bg_main.height()+'px;" /></div></li>';
				}

				bg_main.siblings('.columns').html(columnsContent);
			});
		}
		
		//$(_infiniteSlider.infos).css('top', ($(_infiniteSlider.container).height()/2 - $(_infiniteSlider.infos).height()/2)+'px');
		
		_infiniteSlider.start(_infiniteSlider);
	}
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Change slide
//
/////////////////////////////////////////////////////////////////////////// */

InfiniteSlider.prototype.changeSlide = function(current,clicked,_infiniteSlider){			
	_infiniteSlider.animated = true;
	var direction = 'next';
	if(clicked < current) direction = 'previous';
	
	// Check limits
	if(clicked > _infiniteSlider.length){
		clicked = 0;
	} else if(clicked < 0){
		clicked = _infiniteSlider.length;
	}
		
	// Redefine active slide
	$('> ul > li',_infiniteSlider.container).removeClass('active').addClass('inactive');
	$('> ul > li',_infiniteSlider.container).eq(clicked).removeClass('inactive').addClass('active');
			
	_infiniteSlider.index = parseInt($('> ul > li.active',_infiniteSlider.container).attr('data-slide')) - 1;
	_infiniteSlider.indexSlide = $('> ul > li.active',_infiniteSlider.container).index();
	
	// Redefine active control
	if(!_infiniteSlider.wrapper.hasClass('stopped')){
		$('li.active a span',_infiniteSlider.controls).animate({opacity: 0}, 250, function(){
			$(this).width(0);
		});
		$('li',_infiniteSlider.controls).eq(clicked).find('a span').css('opacity', '1').width('100%');
	}

	$('li',_infiniteSlider.controls).removeClass('active');
	$('li',_infiniteSlider.controls).eq(_infiniteSlider.index).addClass('active');
	
	// Change Count
	$(_infiniteSlider.count).html($('> ul > li.active',_infiniteSlider.container).attr('data-slide')/*+' / '+(_infiniteSlider.length + 1)*/);
	
	// Animate Infos
	$(_infiniteSlider.infos).fadeOut(_infiniteSlider.speed/2, function(){
		$('> li',_infiniteSlider.infos).hide();
		$('> li',_infiniteSlider.infos).eq(clicked).show();
		$(this).show().css('opacity','0');
		_infiniteSlider.reset(_infiniteSlider);
		$(this).animate({opacity: 1}, _infiniteSlider.speed/2);

		if(current == 0 || current == 2){
			$('> li',_infiniteSlider.infos).eq(current).find('h2 > span > span').width(0);
		}
	});
	
	// Animate Slides
	if(_infiniteSlider.mode == 'slide'){
		// Place new slide AFTER
		if(direction == 'next'){
			$('> ul > li',_infiniteSlider.container).eq(clicked)
				.css('left', _infiniteSlider.width+'px')
				.show();
			
			// Animate slides
			$('> ul > li',_infiniteSlider.container).animate({left: '-='+_infiniteSlider.width}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing, 'complete': function(){				
				_infiniteSlider.animated = false;
				$('> ul > li.inactive',_infiniteSlider.container).hide();
				if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
			}});
		}
		// Place new slide BEFORE
		else {
			$('> ul > li',_infiniteSlider.container).eq(clicked)
				.css('left', -_infiniteSlider.width+'px')
				.show();
			
			// Animate slides
			$('> ul > li',_infiniteSlider.container).animate({left: '+='+_infiniteSlider.width}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing, 'complete': function(){				
				_infiniteSlider.animated = false;
				$('> ul > li.inactive',_infiniteSlider.container).hide();
				if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
			}});
		}
	}	else if(_infiniteSlider.mode == 'slidev'){
		// Place new slide AFTER
		if(direction == 'next'){
			$('> ul > li',_infiniteSlider.container).eq(clicked)
				.css('top', _infiniteSlider.height+'px')
				.show();
			
			// Animate slides
			$('> ul > li',_infiniteSlider.container).animate({top: '-='+_infiniteSlider.height}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing, 'complete': function(){				
				_infiniteSlider.animated = false;
				$('> ul > li.inactive',_infiniteSlider.container).hide();
				if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
			}});
		}
		// Place new slide BEFORE
		else {
			$('> ul > li',_infiniteSlider.container).eq(clicked)
				.css('top', -_infiniteSlider.height+'px')
				.show();
			
			// Animate slides
			$('> ul > li',_infiniteSlider.container).animate({top: '+='+_infiniteSlider.height}, {'duration': _infiniteSlider.speed, easing: _infiniteSlider.easing, 'complete': function(){				
				_infiniteSlider.animated = false;
				$('> ul > li.inactive',_infiniteSlider.container).hide();
				if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
			}});
		}
	} else if(_infiniteSlider.mode == 'fade'){
		// Animate Slides
		$('> ul > li.active',_infiniteSlider.container).fadeIn(_infiniteSlider.speed, function(){
			$('> ul > li',_infiniteSlider.container).eq(current).hide();
			_infiniteSlider.animated = false;
			if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
		});
	} else if(_infiniteSlider.mode == 'demask'){
		$('> ul > li.active',_infiniteSlider.container).animate({width: _infiniteSlider.width}, _infiniteSlider.speed, _infiniteSlider.easing, function(){
			$('> ul > li.inactive',_infiniteSlider.container).width(0);
			_infiniteSlider.animated = false;
			if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
		});
	} else if(_infiniteSlider.mode == 'columns'){
		$('> ul > li',_infiniteSlider.container).eq(clicked).css('left', '0');
		$('> ul > li',_infiniteSlider.container).eq(current).find('.columns > li > div').animate({width: 0}, _infiniteSlider.speed, _infiniteSlider.easing, function(){
			$('> ul > li',_infiniteSlider.container).eq(current).css('left', '100%');
			$('> ul > li',_infiniteSlider.container).eq(current).find('.columns > li > div').width('100%');
			_infiniteSlider.animated = false;
			if(_infiniteSlider.running) _infiniteSlider.autoRotation(_infiniteSlider);
		});
	}

	// Fill Chart
	if($('#slide-3-chart').length > 0){
		if(clicked == 1){
			$('.knob').each(function(){
				$(this).val(0).trigger('change');
				$(this).parent().siblings('.dummy').css('margin-left','0');
				
				if($(this).val() == 0){
					$(this).parent().siblings('.dummy').animate({marginLeft: - $(this).attr('data-goal-value')}, {
					    duration: 2500,
					    easing:'easeInOutQuad',
					    step: function() 
					    {
					        var newVal = - Math.ceil(parseFloat($(this).css('margin-left')));
					        $(this).siblings('div').find('.knob').val(newVal).trigger('change');
					    },
					    complete: function(){
					    	var newVal = - Math.ceil(parseFloat($(this).css('margin-left')));
					        $(this).siblings('div').find('.knob').val(newVal).trigger('change');
					    }
					});
				}
			});
		}

		if(clicked == 0 || clicked == 2){
			$('> li',_infiniteSlider.infos).eq(clicked).find('h2 > span').each(function(){
				var $object = $('> span', this);
				var delay = Math.floor((Math.random()*(450 * $(this).index()))) + (_infiniteSlider.speed - 250); 

				setTimeout(function(){
					$object.width('100%');
				}, delay);
			});
		}

		if(clicked == 3/* && !$('#slide-3-chart').hasClass('animated')*/){
			_infiniteSlider.createChart(_infiniteSlider);
			$('#slide-3-chart').addClass('animated');
		}
	}
}

/* ////////////////////////////////////////////////////////////////////////////
//
// Playing with CSVs
//
/////////////////////////////////////////////////////////////////////////// */

InfiniteSlider.prototype.fillChart = function(remote_url,_infiniteSlider) {
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
				_infiniteSlider.chartLines.push(lineData);
		    }

		    _infiniteSlider.chartLines.splice(0,1);
        },
        error: function(jqXHR, textStatus, errorThrow){
            console.log(jqXHR['responseText']);
        }
    });
}

InfiniteSlider.prototype.createChart = function(_infiniteSlider){
	// Get Last 9 Values
	var labels = [];
	var dataset = [];
	var lowest = 1000000;
	var highest = 0;
	var step = 0;

	for(var i = 8; i >= 0; i --){
		labels.push(_infiniteSlider.chartLines[i][0]);
		dataset.push(_infiniteSlider.chartLines[i][4]);

		if(_infiniteSlider.chartLines[i][4] < lowest) lowest = parseFloat(_infiniteSlider.chartLines[i][4]);
		if(_infiniteSlider.chartLines[i][4] > highest) highest = parseFloat(_infiniteSlider.chartLines[i][4]);
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

	var ctx = $('#slide-3-chart').get(0).getContext('2d');
	var myNewChart = new Chart(ctx).Line(chartData,chartOptions);
}