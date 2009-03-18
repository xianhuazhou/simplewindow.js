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

	// default options
	defaultOptions: {
		size: null,
		style: 'SimpleWindow',
		position: 'middle',
		positionFixed: false,
		cloneNode: false,
		content: null,
		loading: 'Loading...',
		zIndex: 999,

		headerContent: null,
		footerContent: null,

		beforeOpen: null,
		afterOpen: null,
		beforeClose: null,
		afterClose: null,

		iframe: false,

		openEffect: null,
		openEffectOptions: {},
		closeEffect: null,
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
			if (content) {
				this._setContent(content);
			}
			this._openWindow();
			return;
		}

		// ajax calls
		var self = this;
		var options = content.options || {};
		options.onLoading = function() {
			self._openWindow(false).update(self.options.loading);
		}
		options.onComplete = function(transport) {
			setTimeout(function(){
				self._sw.setStyle({display: 'none'});
				self._setContent(transport.responseText);
				self._openWindow();
			}, 10);
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
		this._sw.update('');
		var options = this._options;
		if (options.headerContent) {
			this._sw.insert(options.headerContent);
		}
		this._sw.insert(content);
		if (options.footerContent) {
			this._sw.insert(options.footerContent);
		}
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

		// get correct position
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
		if (sw) {
			if (Object.isFunction(this._options.beforeClose)) {
				this._options.beforeClose(sw);
			}

			if (this._options.closeEffect) {
				this._options.closeEffectOptions.afterFinish = function(){
					func == 'hide' ? sw.setStyle({display: 'none'}) : sw.remove();
				}
				new Effect[this._options.closeEffect](sw, this._options.closeEffectOptions);
			} else {
				func == 'hide' ? sw.setStyle({display: 'none'}) : sw.remove();
			}

			if (Object.isFunction(this._options.afterClose)) {
				this._options.afterClose(sw);
			}
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
