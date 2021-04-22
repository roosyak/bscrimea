/* ///////////////////////////////////////////////
//
// Content Toggler
// V 1.0
// Alexandra Nantel
// Last Update 18/09/2012 15:20
//
////////////////////////////////////////////// */

function ContentToggler(wrapper){
	var _contentToggler = this;
	
	// Params
	this.wrapper = wrapper;
	this.togglers = $('> li > a', this.wrapper);
	this.toggled = $('> li > div', this.wrapper);
	this.animated = false;
	
	// Bind
	$(this.togglers).on('click', function(){
		var clicked = $(this).parent();
		_contentToggler.elementToggle(clicked,_contentToggler);
		return false;
	});
}

/* ////////////////////////////////////////////////////////////////////////////
//
// External Functions
//
/////////////////////////////////////////////////////////////////////////// */

ContentToggler.prototype.elementToggle = function(clicked,_contentToggler){
	if(!_contentToggler.animated){
		_contentToggler.animated = true;
		
		if($('> .active', _contentToggler.wrapper).get(0)){
			$('> .active > div', _contentToggler.wrapper).slideUp(450, function(){
				if($(clicked).hasClass('active') == false){
					$('> .active', _contentToggler.wrapper).removeClass('active');
					$(clicked).addClass('active');
					$('> div',clicked).slideDown(450, function(){
						_contentToggler.animated = false;
					});
				} else {
					$('> li', _contentToggler.wrapper).removeClass('active');
					_contentToggler.animated = false;
				}
			});
		} else {
			$(clicked).toggleClass('active');
			$('> div',clicked).slideDown(450, function(){
				_contentToggler.animated = false;
			});
		}
	}
}