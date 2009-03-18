/**
 *
 *  a Simple Window  library based on prototype/scriptaculous
 *
 *  created on 17 March, 2009
 *
 *  author xianhua.zhou@gmail.com
 *
 */

var $sw = {

	// the special attribute for the generated window
	identifyAttribute: '_sw_',

	// cached content
	_cachedContent: [],

	_options: {},

	// default options
	defaultOptions: {

		// null means detect the size automatically, can't be null if want to use iframe with ajax calls
		// possible value like 300x250 (widthxheight)
		size: null,

		// css string or css class name.
		// possible values: "background:black;color:red", "mySimpleWindow"
		style: 'SimpleWindow',

		// position of the simple window.
		// possible values: "middle", "leftTop", "middleTop", "rightTop",
		//                  "leftMiddle", "rightMiddle", "leftBottom", 
		//                  "middleBottom", "rightBottom", "200x100"(custom positions, leftxtop)
		position: 'middle',

		// default the position is "absolute", if this option is true, then the position will be "fixed"
		positionFixed: false,

		// only for ajax calls, if it's true, the position will be different with the loading layout. 
		// otherwise, the position will be same as the loading layout, but the size is different.
		changePosition: true,

		// only for exists html node.  
		// if it's true, then will remove the current one and create new one insert before the body tag.
		cloneNode: false,

		// can be null if you use the exists tag, or can be string.
  	// for ajax calls, the parameter looks like:  {url: '/path/to/ajax.htm', otherOptions}, 
	  //    the parameters are same as Ajax.Request in prototype.js.
		//    there is a extra parameter called "delayTime", 
		//    will show the simple window with the response content in "delayTime" ms if have, 
		//    maybe useful for debug in some special cases.
		content: null,

		// only for ajax calls, will show the loading before the ajax calls finished.
		// can be string or a html node.
		loading: 'Loading...',

		// z-index of the simple window
		zIndex: 999,

		// the content is a part of the simple window's content if have.
		// can be string or a html node
		headerContent: null,

		// the content is a part of the simple windows' content if have.
		// can be string or a html node
		footerContent: null,

		// call back function will be called before open the simple window if have.
		beforeOpen: null,

		// call back function will be called after open the simple window if have.
		afterOpen: null,

		// call back function will be called before close or remove the simple window if have.
		beforeClose: null,

		// call back function will be called after close or remove the simple window if have.
		afterClose: null,

		// use iframe for show the content of simple window.
		iframe: false,

		// open simple window with the effect if have one.  can any valid effect which defined in effects.js
		// for example: Appear
		openEffect: null,

		// effect options for the openEffect, this parameter same as the parameter which defined in effects.js
		// for example: {duration: 0.3, afterFinish:function(){ alert('nice') }}
		// avaiable only if openEffect avaiable.
		openEffectOptions: {},

		// same as the openEffect, but this will be used after close the simple window.
		closeEffect: null,

		// same as the openEffectOptions, but this will be used after close the simple window with closeEffect
		closeEffectOptions: {}
	},

	/**
	 *
	 * public function, open a window
	 *
	 * @param string id
	 * @param hash options
	 *
	 * @return void
	 * @access public
	 *
	 */
	open: function(id, options) {

		// initialize some options
		var options = Object.extend(
			Object.extend({}, this.defaultOptions), 
			options || {}
		);
		this._options = options;

		// initialize the window
		if (!id) {
			id = 'sw_' + new Date().getTime();
		}
		var _sw = $(id);
		if (!_sw) {
			_sw = new Element('div', {id:id});
			$(document.body).insert(_sw);
		} else {
			if (options.cloneNode) {
				var __sw = _sw.cloneNode(true);
				_sw.remove();
				$(document.body).insert(__sw);
				_sw = __sw;
			}
		}
		this._sw = _sw;

		// css
		if (options.style.include(':')) {
			this._sw.writeAttribute('style', options.style);
		} else {
			this._sw.addClassName(options.style);
		}

		// basic style
		this._sw = _sw.setStyle({
			position:options.positionFixed ? 'fixed' : 'absolute', 
			zInde:options.zIndex, 
			display:'none'
			}).writeAttribute(this.identifyAttribute, 'y');

			// render and show
			this._render();
	},

	/**
	 *
	 * render the content of window
	 *
	 * @return void
	 * @access private
	 *
	 */
	_render: function() {
		var content = this._options.content;

		// inline string
		if (null == content || 'object' != typeof(content)) {
			this._setContent(content);
			this._openWindow();
			return;
		}

		// ajax calls
		var self = this;
		var options = content.options || {};
		options.onLoading = function() {
			self._sw.setStyle({display: 'none'});
			self._setContent(self._options.loading);
			self._openWindow({
				frame: false,
				beforeOpen: false,
				afterOpen: false
			});
		}
		options.onComplete = function(transport) {
			setTimeout(function(){
				self._setContent(transport.responseText);
				self._openWindow({
					openEffect: false,
					changePosition: options.changePosition,
					frame: options.frame
				});
			}, 10 + parseInt(content.delayTime));
		}

		new Ajax.Request(content.url, options);
	},

	/**
	 *
	 * set content to the window
	 *
	 * @param string content
	 *
	 * @return void
	 * @access private
	 *
	 */
	_setContent: function(content) {
		// get content
		content = !content ? this._sw.innerHTML : this._getAsString(content);
		this._cachedContent[this._sw.id] = content;

		// set content with header and footer
		this._sw.update(
			this._getAsString(this._options.headerContent) +
			content + 
			this._getAsString(this._options.footerContent)
		);
	},

	/**
	 *
	 * get string from a html node or just string
	 *
	 * @param mixed can be a html node or string or null
	 *
	 * @return string
	 * @access private
	 *
	 */
	_getAsString: function(node) {
		if (null == node || Object.isString(node)) {
			return node;
		}
		return new Element('div').update(
			$(node.cloneNode(true)).setStyle({
				display: ''
			})).innerHTML;
	},

	/**
	 *
	 * get the position of window for render
	 *
	 * @return hash  {left:N, top:N, width:N, height:N}
	 * @access private
	 *
	 */
	_getPosition: function() {
		if (null === this._options.size) {
			var _swDim = this._sw.getDimensions();
		} else {
			var size = this._options.size.split('x');
			var _swDim = {width: parseInt(size[0]), height: parseInt(size[1])}
		}

		var docDim = document.viewport.getDimensions(),
		docScrollOffsets = document.viewport.getScrollOffsets(),
		posLeft = posTop = 0;

		// clean the space of border, padding and margin. 
		// see http://www.prototypejs.org/api/element/getStyle, not works for all browsers!!
		docDim.width -= (parseInt(this._sw.getStyle('borderLeftWidth')) +
			parseInt(this._sw.getStyle('borderRightWidth')) +
			parseInt(this._sw.getStyle('paddingLeft')) +
			parseInt(this._sw.getStyle('paddingRight')) +
			parseInt(this._sw.getStyle('marginLeft')) +
			parseInt(this._sw.getStyle('marginRight'))
		);
		docDim.height -= (parseInt(this._sw.getStyle('borderTopWidth')) +
			parseInt(this._sw.getStyle('borderBottomWidth')) +
			parseInt(this._sw.getStyle('paddingTop')) +
			parseInt(this._sw.getStyle('paddingBottom')) +
			parseInt(this._sw.getStyle('marginTop')) +
			parseInt(this._sw.getStyle('marginBottom'))
		);

		// get position
		if (this._options.position.include('x')) {
			  var _pos = this._options.position.split('x');
				posLeft = parseInt(_pos[0]);
				posTop = parseInt(_pos[1]);
			} else {
				switch (this._options.position) {
					case 'leftTop':
					posLeft = 0;
					postTop = 0;
					break;

					case 'middleTop':
					posLeft = (docDim.width - _swDim.width) / 2;
					posTop = 0;
					break;

					case 'rightTop':
					posLeft = (docDim.width - _swDim.width);
					posTop = 0;
					break;

					case 'leftMiddle':
					posLeft = 0;
					posTop = (docDim.height - _swDim.height) / 2;
					break;

					case 'rightMiddle':
					posLeft = (docDim.width - _swDim.width);
					posTop = (docDim.height - _swDim.height) / 2;
					break;

					case 'leftBottom':
					posLeft = 0;
					posTop = (docDim.height - _swDim.height);
					break;

					case 'middleBottom':
					posLeft = (docDim.width - _swDim.width) / 2;
					posTop = (docDim.height - _swDim.height);
					break;

					case 'rightBottom':
					posLeft = (docDim.width - _swDim.width);
					posTop = (docDim.height - _swDim.height);
					break;

					case 'middle':
					default:
					posLeft = (docDim.width - _swDim.width) / 2;
					posTop = (docDim.height - _swDim.height) / 2;
				}
			}

		// don't need the scrollOffsets if the position is fixed.
		if (!this._options.positionFixed) {
			posLeft += docScrollOffsets.left;
			posTop += docScrollOffsets.top;
		}

		return {
			left:posLeft, 
			top:posTop, 
			width:_swDim.width, 
			height:_swDim.height
		};
	},

	/**
	 *
	 * open and show the window
	 *
	 * @return current window
	 * @access private
	 *
	 */
  _openWindow: function(opt) {

    // some options for open window
    var opt = Object.extend({
      beforeOpen: true,
      afterOpen: true,
      openEffect: true,
      iframe: true,
      changePosition: true
    }, opt || {});

		var sw = this._sw;
		var position = this._getPosition();

    // call beforeOpen
		if (opt.beforeOpen && Object.isFunction(this._options.beforeOpen)) {
			this._options.beforeOpen(sw);
		}

		// in iframe?
		if (opt.iframe && this._options.iframe) {
			var iframe = new Element('iframe', {src:'about:blank', frameborder:'0'}).setStyle({
				width: '100%',
				height: '100%',
				margin: 0,
				padding: 0,
				marginWidth: '0',
				marginHeight: '0',
				scrolling: 'auto'
			});
			var content = sw.innerHTML;
			sw.update(iframe);
			var doc = iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument;
			doc.open();
			doc.write(content);
			doc.close();
		}

		// show it
		sw.setStyle({
			width: position.width + 'px',
			height: position.height + 'px'
		});

    // need change the position?
    if (opt.changePosition) {
      sw.setStyle({
        left: position.left + 'px',
        top: position.top + 'px'
      });
    }

    // show effect
		if (opt.openEffect && this._options.openEffect) {
			new Effect[this._options.openEffect](sw, this._options.openEffectOptions);
		} else {
			sw.setStyle({display: 'block'});
		}

    // call afterOpen
		if (opt.afterOpen && Object.isFunction(this._options.afterOpen)) {
			this._options.afterOpen(sw);
		}
		return sw;
	},

	// close a window, just hide
	close: function(id) {
		this._hide(id, 'hide');
	},

	// close all windows, just hide them
	closeAll: function() {
		this._hideAll('hide');
	},

	// remove a window
	remove: function(id) {
		this._hide(id, 'remove');
	},

	// remove all windows
	removeAll: function() {
		this._hideAll('remove');
	},

	/**
	 *
	 * hide or remove the window
	 *
	 * @param mixed id can be string or object
	 *
	 * @return void
	 * @access private
	 *
	 */
	_hide: function(id, func) {
		var sw = $(id);
		var isHide = 'hide' == func;
		if (sw) {

			// call back function
			if (Object.isFunction(this._options.beforeClose)) {
				this._options.beforeClose(sw);
			}

			// hide it
		  var self = this;
			if (this._options.closeEffect) {
				this._options.closeEffectOptions.afterFinish = function(){
					self._hideIt(isHide, sw);
				}
				new Effect[this._options.closeEffect](sw, this._options.closeEffectOptions);
			} else {
				this._hideIt(isHide, sw);
			}

			// call back function
			if (Object.isFunction(this._options.afterClose)) {
				this._options.afterClose(sw);
			}
		}
	},
	_hideIt: function(isHide, sw) {
		if (isHide) {
			sw.setStyle({display: 'none'}).update(this._cachedContent[sw.id]);
		} else {
			this._cachedContent[sw.id] = null;
			sw.remove();
		}
	},

	/**
	 *
	 * hide or remove all windows
	 *
	 * @param function func
	 *
	 * @return void
	 * @access private
	 *
	 */
	_hideAll: function(func) {
		var self = this;
		$$('div[' + this.identifyAttribute + '=y]').each(function(it){
			func == 'hide' ? self.close(it) : self.remove(it);
		});
	}
}
