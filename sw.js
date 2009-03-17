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

    identifyAttribute: '_sw_',

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
        var options = Object.extend({
            size: null,
            style: 'SimpleWindow',
            position: 'middle',
            cloneNode: false,
            content: null,
            loading: 'Loading...',
            beforeOpen: null,
            afterOpen: null,
            beforeClose: null,
            afterClose: null,
            iframe: false,
            openEffect: null,
            openEffectOptions: {},
            closeEffect: null,
            closeEffectOptions: {}
        }, options || {});
        this.options = options;

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

        this._sw = _sw.setStyle({
            position:'absolute', 
            zInde:999, 
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
        var content = this.options.content;

        // inline string
        if (null == content || 'object' != typeof(content)) {
            if (content) {
                this._sw.update(content);
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
                self._sw.setStyle({display: 'none'}).update(transport.responseText);
                self._openWindow();
            }, 10);
        }

        new Ajax.Request(content.url, options);
        return;
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
        if (null === this.options.size) {
            var _swDim = this._sw.getDimensions();
        } else {
            var size = this.options.size.split('x');
            var _swDim = {width: parseInt(size[0]), height: parseInt(size[1])}
        }

        var docDim = document.viewport.getDimensions(),
        docScrollOffsets = document.viewport.getScrollOffsets(),
        posLeft = posTop = 0;

        switch (this.options.position) {
            case 'middle':
            posLeft = (docDim.width - _swDim.width) / 2 + docScrollOffsets.left;
            posTop = (docDim.height - _swDim.height) / 2 + docScrollOffsets.top;
            break;
        }

        return {left:posLeft, top:posTop, width:_swDim.width, height:_swDim.height};
    },

    /**
     *
     * open and show the window
     *
     * @return current window
     * @access private
     *
     */
    _openWindow: function() {
        var sw = this._sw;
        if (Object.isFunction(this.options.beforeOpen)) {
            this.options.beforeOpen(sw);
        }

        var position = this._getPosition();

        // in iframe?
        if (arguments[0] ? arguments[0] : this.options.iframe) {
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
            left: position.left + 'px',
            top: position.top + 'px',
            width: position.width + 'px',
            height: position.height + 'px'
        });

        if (this.options.openEffect) {
            new Effect[this.options.openEffect](sw, this.options.openEffectOptions);
        } else {
            sw.setStyle({display: 'block'});
        }

        if (Object.isFunction(this.options.afterOpen)) {
            this.options.afterOpen(sw);
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
            if (Object.isFunction(this.options.beforeClose)) {
                this.options.beforeClose(sw);
            }

            if (this.options.closeEffect) {
                this.options.closeEffectOptions.afterFinish = function(){
                    func == 'hide' ? sw.setStyle({display: 'none'}) : sw.remove();
                }
                new Effect[this.options.closeEffect](sw, this.options.closeEffectOptions);
            } else {
                func == 'hide' ? sw.setStyle({display: 'none'}) : sw.remove();
            }

            if (Object.isFunction(this.options.afterClose)) {
                this.options.afterClose(sw);
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
