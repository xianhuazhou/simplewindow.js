var optionsList = {
	size: {
		desc: 'size of the div for show, width and height, can be detected automatically if null',
		defaultValue: 'null',
		examples: "{size: '300x250'}"
	},
	style: {
		desc: 'css of div, can be a class name or a valid string of css',
		defaultValue: 'SimpleWindow',
   	examples: "{style: 'background:black;color:red'}, {style: 'LoginForm'}"
	},
	position: {
		desc: 'position of the div',
		defaultValue: 'middle',
  	examples: "name: {position: 'leftTop'}, possible values: leftTop, middleTop, rightTop, leftMiddle, rightMiddle, leftBottom, middleBottom, rightBottom<br />" + 
             	"custom values: {position: '200x200'}<br />" + 
	            "object of custom values: {position: {left: 200, top: 200}}" 
	},
	positionFixed: {
		desc: 'fix the position of the div, can be true or false, so the div does not affacted by the position of scroll bar',
		defaultValue: 'false',
		examples: '{positionFixed: true}'
	},
	positionOffset: {
		desc: 'adujst the position of the div, will be added to the position if use this option',
		defaultValue: 'null',
		examples: '{positionOffset: \'10x20\'} leftxtop,  {positionOffset: {left: 10, top: 20}}<br />' + 
		          'if the original position of the div is {left:200, top:100}, then will be changed to {left:210, top:120}, you can also set it like: {positionOffset: \'-10x-10\'}'
	},
	changePosition: {
		desc: 'this option only availed when you using ajax calls, if it\'s false, then the position of the div will be changed depands on the new size of the div after the ajax loading progress finished. otherwise, will keep the position same as the ajax loading progress div',
		defaultValue: 'true',
		examples: '{changePosition: false, content: {url: \'/path/to/ajax.html\'}}'
	},
	cloneNode: {
		desc: 'this option only availed when you using a exist html node for the div, will clone a new node insert into the html body. because for some reason, the position:absolute does not works well if the html node is wrapped by some other html nodes, however, the standalone html node is always works fine with the position:absolute property. NOTICE: usually you do not need to use this option.',
		defaultValue: 'false',
		examples: '{cloneNode: true}'
	},
	content: {
		desc: 'the content option can be a string, a html node or just null. if using ajax calls, the content option must be a object, like: {url: \'/path/to/ajax.html\', {onComplete: function(res){}}, delayTime:1000}',
		defaultValue: 'null',
		examples: 'string: {content: \'some contents\'}<br />' +
		          'html node: {content: $(\'userInfo\')}<br />' +
							'ajax calls: {content: {url: \'/path/to/ajax.html\'} }<br />' + 
							'ajax calls with delay time for debug: {content: {url: \'/path/to/ajax.html\'}, delayTime: 1000 }, the delayTime option is a number, will show the ajax content in delayTime ms if have' 
	},
	overlay: {
		desc: 'overlay the whole page for disable all of possible clicks except a activate div',
		defaultValue: 'null',
		examples: "{overlay: {background: 'green'} }<br />" + 
		          "{overlay: {opacity: 0.8} }<br />" +
							"{overlay: {openEffect: 'Appear'} }<br />" + 
							"{overlay: {openEffect: 'Appear', openEffectOptions:{duration: 0.5} } }<br />" +
							"{overlay: {openEffect: function(overlay){new Effect.Appear(overlay)} } }<br />" + 
							"{overlay: {closeEffect: 'Fade'} }<br />" + 
							"{overlay: {closeEffect: 'Fade', closeEffectOptions:{duration: 0.5} } }<br />" +
							"{overlay: {closeEffect: function(overlay){new Effect.Fade(overlay)} } }<br />" + 
							"{overlay: {afterClick: function(overlay){alert('you clicked the overlay')} } }" 
	},
	autoResize: {
		desc: 'this option only availed if the openEffect callback function is defined by youself. resize the div automatically',
		defaultValue: 'true',
		examples: '{autoResize: false}, if you want to resize the div by the custom openEffect call back function, then can do it like this.'
	},
	loading: {
		desc: 'only for ajax calls, show a loading tips, can be a string or a html node',
		defaultValue: 'Loading...',
		examples: "{loading: 'Loading...'}<br />{loading: $('loadingTips')}"
	},
	zIndex: {
		desc: 'z-index of the div',
		defaultValue: 999,
		examples: "{zIndex: 100}"
	},
	headerContent: {
		desc: "add some contents before the content of div, it's still wrapped by the div",
		defaultValue: 'null',
		examples: "{headerContent: 'Title of the simplewindow'}<br />{headerContent: $('titleInfos')}"
	},
	footerContent: {
		desc: "add some contents after the content of div, it's still wrapped by the div",
		defaultValue: 'null',
		examples: "{footerContent: 'some bottom infos'}<br />{headerContent: $('footerInfos')}"
	},
	beforeOpen: {
		desc: 'callback function will be executed before the simple window is opened',
		defaultValue: 'null',
		examples: "{beforeOpen: function(sw){} }"
	},
	afterOpen: {
		desc: 'callback function will be executed if the simple window has opened',
		defaultValue: 'null',
		examples: "{afterOpen: function(sw){} }"
	},
	beforeClose: {
		desc: 'callback function will be executed before the simple window is closed',
		defaultValue: 'null',
		examples: "{beforeClose: function(sw){} }"
	},
	afterClose: {
		desc: 'callback function will be executed before the simple window has closed',
		defaultValue: 'null',
		examples: "{afterClose: function(sw){} }"
	},
	iframe: {
		desc: 'use iframe for show the content, can be used even without ajax calls',
		defaultValue: 'false',
		examples: "{iframe: true}"
	},
	openEffect: {
		desc: 'callback function will be executed for open simple window, can be a string which is a valid effect name defined in effects.js or a function for customization',
		defaultValue: 'null',
		examples: "{openEffect: 'Appear'}<br />" + 
		          "{openEffect: function(sw){new Effect.Appear(sw)} }"
	},
	openEffectOptions: {
		desc: 'for the openEffect callback function, only availed if the openEffect option is a string',
		defaultValue: '{}',
		examples: "{openEffect: 'Appear', openEffectOptions:{duration: 0.8, afterFinish: function(){}} }"
	},
	closeEffect: {
		desc: 'callback function will be executed for close simple window, can be a string which is a valid effect name defined in effects.js or a function for customization',
		defaultValue: 'null',
		examples: "{closeEffect: 'Fade'}<br />" + 
		          "{closeEffect: function(sw){new Effect.Fade(sw)} }"
	},
	closeEffectOptions: {
		desc: 'for the closeEffect callback function, only availed if the closeEffect option is a string',
		defaultValue: '{}',
		examples: "{closeEffect: 'Fade', closeEffectOptions:{duration: 0.8, afterFinish: function(){}} }"
	},
	openLoadingEffect: {
		desc: 'callback function will be executed for show loading tips for ajax calls, can be a string which is a valid effect name defined in effects.js or a function for customization',
		defaultValue: 'null',
		examples: "{openLoadingEffect: 'BlindDown'}<br />" + 
		          "{openLoadingEffect: function(loadingDiv){ new Effect.BlindDown(loadingDiv) } }"
	},
	openLoadingEffectOptions: {
		desc: 'for the openLoadingEffect callback function, only availed if the openLoadingEffect option is a string',
		defaultValue: '{}',
		examples: "{openLoadingEffect: 'Appear', openLoadingEffectOptions:{duration: 0.8} }"
	},
	closeLoadingEffect: {
		desc: 'callback function will be executed for hide loading tips for ajax calls, can be a string which is a valid effect name defined in effects.js or a function for customization',
		defaultValue: 'null',
		examples: "{closeLoadingEffect: 'BlindDown'}<br />" + 
		          "{closeLoadingEffect: function(loadingDiv, positionOfLoading, showContentCallbackFunc){ <br />" + 
		          "&nbsp;&nbsp;&nbsp;&nbsp;new Effect.BlindDown(loadingDiv); <br />" + 
							"&nbsp;&nbsp;&nbsp;&nbsp;<span class=\"code\">showContentCallbackFunc();</span>// this callback must be executed manually<br />" + 
							"&nbsp;&nbsp;}<br />}"
	},
	closeLoadingEffectOptions: {
		desc: 'for the closeLoadingEffect callback function, only availed if the closeLoadingEffect option is a string',
		defaultValue: '{}',
		examples: "{closeLoadingEffect: 'Fade', closeLoadingEffectOptions:{duration: 0.8} }"
	},
}

document.observe('dom:loaded', function(){
	var rows = [], n = 0;
	$H(optionsList).each(function(v){
		rows.push("<tr class=\"" + (n++ % 2 ? 'odd' : 'even') + "\"><td>" + v.key + "</td><td>" + v.value.desc + "</td><td>" +  v.value.defaultValue + "</td><td>" + v.value.examples + "</td></tr>");
	});
	$('Options').update('<table cellspacing="1" cellpadding="3">' + 
	"<thead><tr><th>Name</th><th>Description</th><th>Default</th><th class=\"examples\">Examples</th></thead>" +
	"<tbody>" + rows.join('') + "</tbody></table>");
});
