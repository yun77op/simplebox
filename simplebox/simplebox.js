(function() {

	Array.isArray = Array.isArray || function(o) { return Object.prototype.toString.call(o) === '[object Array]'; }; 
	var util = {};

	(function(util){

	util.scripts={};
	util.styles={};

	util.getScripts=curry(getSS,1);
	util.getStyles=curry(getSS,0);

	//name,url,ver,requires,callback
	function getSS(){
		var args,ss,requires=null;
		args=Array.prototype.slice.call(arguments,0);
		ss=args.shift();
		for(var i=args.length-1;i>0;--i){
			if(Array.isArray(args[i])){
				requires=args.slice(i,i);
				delete args[i];
				break;
			}
		}
		if(requires){
			(function(requires){
			 var self=arguments.callee,t;
			if(t=requires.shift())	
				getSS(ss,t,function(){
						self(requires);
					});
			else loadSS(args,ss); 
			})(requires);
		} else loadSS(args,ss);
	}


	function loadSS(args,ss){
		var t,s,name,url,ver,callback,requires;
		name=args.shift();
		if((t=args[args.length-1]) && typeof t == 'function') {
			callback=args.pop();
		}


		if (t=args.shift())  url = t;
		if (t=args.shift()) ver = t;
		
		if (url) {
			util.scripts[name]=url;
		} else {
			url=util.scripts[name];
			if(!url) return;
		}
		
		if(ss){	
			s=document.createElement('script');
			s.setAttribute('type','text/javascript');
			callback && (s.onload=callback)
		} else {
			s=document.createElement('link');
			s.setAttribute('rel','stylesheet');
		}

		document.getElementsByTagName('head')[0].appendChild(s);
		t = ver ? url+ver : url;
		ss ? (s.src=t) : (s.href=t)
	}


	function isObject(obj){
		return obj instanceof Object;
	}


	util.extend = function() {
		var i, deep = true, target, args, objCp;

		args=Array.prototype.slice.call( arguments, 0 );
		typeof args[0] === 'boolean' && (deep=args.shift())
		target=args.shift();

		function recurCp(target, objCp){
			if(!objCp || !target) return;
			for( i in objCp ){
				if( i in target){
					if( deep && isObject(target[i]) && isObject(objCp[i])){
						recurCp(target[i],objCp[i]);
						
					} else {
						target[i]=objCp[i];
					}
					
				} else if( typeof objCp[i] !== 'undefined') {
					target[i]=objCp[i];
				}		
			}		
		}
		
		while( objCp=args.shift() ) {
			recurCp(target, objCp);
		}
		return target;
	};


	util.contentLoad=function(fn){
		if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", fn, false);
		} else if(/MSIE/i.test(navigator.userAgent)) {
			document.write("<script id='__ie_onload' defer src='javascript:void(0);'><\/script>");
			var script = document.getElementById("__ie_onload");
			script.onreadystatechange = function() {
				if (this.readyState == 'complete') {
					fn();
				}
			}
		} else if (/WebKit/i.test(navigator.userAgent)) {
			var _timer = setInterval(function() {
				if (/loaded|complete/.test(document.readyState)) {
					clearInterval(_timer);
					fn();
				}
			}, 10);

		} else {
			window.onload = function(e) {
				fn();
			}
		}
	};

	util.createElement=function(tag,attrs){
		var t=document.createElement(tag);
		return attrs ? util.extend(t,attrs) : t;
	};

	util.getComputedStyleValue=function(element, style){
		return window.getComputedStyle(element, null).getPropertyValue(style);
	};

	util.extendStyle=function(el,style) {
		var i,styleClone={};
		for(i in style){
			styleClone[i] = style[i]+'px';
		}
		util.extend(el.style,styleClone);
	};

	util.fadeOut=curry(fade,0);
	util.fadeIn=curry(fade,1);

	function fade(io,el,time,callback){
		var args=Array.prototype.slice.call(arguments,0),
				from,t,cb;
		if(args.length==3 && typeof args[2]=='function' ){
			callback=args[2];
			time=null;
		}
		cb=function(){
			callback && callback()
		};	
		if(io){
			if(util.getComputedStyleValue(el,'display')!='none'){
				cb();
				return;
			}
			el.style.opacity=0;
			el.style.display=el.getAttribute('data-display') || 'block';

			new Animate(el,'opacity',{
				to:1,
				time:time,
				callback:function(){
					callback();
					}
				});
		} else {
			if((t=util.getComputedStyleValue(el,'display'))=='none'){
				cb();
				return;
			}
			el.setAttribute('data-display',t);
			new Animate(el,'opacity',{
				to:0,
				time:time,
				callback:function(){
					el.style.display='none';
					cb()
					}
				});
		
		}
	}

	function curry(){
		var args=Array.prototype.slice.call(arguments,0),fn=args.shift();
		return function(){
			var io=Array.prototype.slice.call(arguments,0);
			io=args.concat(io);
			return	fn.apply(null,io);
		}
	}

})(util);

/**
 * @constructor
 */

function Animate(elm,prop,opts) {
	this.elm = elm;
	this.prop = prop;
	this.to = parseInt(opts.to);
	this.from = typeof opts.from != 'undefined' ? opts.from : util.getComputedStyleValue(elm,prop);
	this.from = parseInt(this.from);
	this.callback = opts.callback;
	this.diff = this.to - this.from;
	this.time = parseInt(opts.time) || Animate.timeShorts[opts.time] || 400;
	this.step = opts.step;
	this.start();
}

Animate.timeShorts={
	slow:600,
	fast:200
};


Animate.prototype={
	start:function(){
		var self=this;
		this.startTime=new Date();
				this.timer=setInterval(function(){
				self._animate.call(self);
		},4);
		return this;
	},
	_animate:function(){
		var diff=new Date()-this.startTime,
			val,percent; 
		if(diff>=this.time){
			this._setStyle(this.to);
			typeof this.step=='function' && this.step(1)
			clearInterval(this.timer);
			typeof this.callback =='function'&& this.callback()
			return;
		}
		
		percent = Math.floor((diff / this.time) * 100) / 100;
					val = this.diff * percent + this.from;
		this._setStyle(val);
		typeof this.step=='function' && this.step(percent)
		},
	_setStyle:function(val){
		var style=this.elm.style;
			switch(this.prop){
				case 'opacity':
				style[this.prop]=val;
				break;
			default:style[this.prop]=val+'px';
				break;
			}
		}
};



window.simplebox=(function(){
var overlay,tmp,outer,inner,loading,nav_close,nav_left,nav_right,title=null,
	busy=false,
	selectedArray,selectedIndex,opts,selectedOpts,
	loadingTimer, loadingFrame = 1,
	shadow=20, imgLoader=new Image,fx={style:{}},
	start_pos,final_pos,titleh,
	imgRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i, swfRegExp = /[^\.]\.(swf)\s*$/i,
	winSize,preLoads=[],
	defaults={
		padding			:	10,
		margin			:	20,
		width			:	560,
		height			:	340,
		cyclic			:	false,

		overlayShow		:	true,
		hideOnOverlayClick	:	true,
		hideOnContentClick	:	false,

		swf			:	{ wmode: 'opaque' },
		h5video			:	{controls:'controls',preload:'metadata',autoplay:false},
		flashPlayer		:	'http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf',

		titlePosition		:	'inside', //'inside' or 'over'
		titleShow		:	true,
		titleFormat		:	null,
	
		transitionIn		:	'fade',	// 'elastic', 'fade' or 'none'
		transitionOut		:	'fade',	// 'elastic', 'fade' or 'none'

		speedIn			:	500,
		speedOut		:	500,

		changeSpeed		:	500,
		changeFade		:	500,
	
		scrolling		:	'auto', //'auto', 'yes' or 'no'
		autoScale		:	true,
		autoDimension		:	true,
		
		enableCenter		:	true,	
		enableMouseWheel	:	true,

		showCloseButton		:	true,
		showNavArrows		:	true,
		enableEscapeButton	:	true,
		overlayColor		:   	'#666',
		overlayOpacity		:	'0.3',
		
		preloadIndent		:	1
	}



function abort(){
	loading.style.display='none';
	imgLoader.onerror = imgLoader.onload = null;	
}

function cancel(){
	if (busy) return;
	busy = true;
	abort();
	busy = false;
}

function error(){
	simplebox.start({content:'Sorry! the request cann\'t be reached'},{
		transitionIn:'none',
		transitionOut:'none'
	});
}


function close(){
	var _clean=function(){
		inner.innerHTML=tmp.innerHTML='';
		util.fadeOut(overlay,'fast',function(){busy=false;});
	},t;

	if(busy) return;
	busy=true;
	abort();
	document.removeEventListener('keydown', documentKey);
	window.removeEventListener('resize', resizeCenter);
	nav_close.style.display = 'none';
	nav_left.style.display = 'none';
	nav_right.style.display = 'none';

	inner.style.overflow = 'hidden';

	if (title) {
		title.parentNode.removeChild(title);
		title = null;
	}
	if(selectedOpts.transitionOut=='fade'){
		util.fadeOut(outer,_clean);
	} else if(selectedOpts.transitionOut=='elastic'){
		t=final_pos;
		final_pos=start_pos;
		start_pos=t;

		new Animate(fx,'fx',{
				from:0,
				to:1,
				step:draw,
				time:selectedOpts.speedOut,
				callback:function(){
					outer.style.display='none';
					_clean();	
				}});	
		
	
	} else {
		outer.style.display='none';
		_clean();	
	}


}


function init(){

	var d=document.createDocumentFragment(),
	    t=document.createElement('div');
	    t.id = 'simplebox';
	d.appendChild(t);

	tmp=document.createElement('div');
	tmp.id = 'simple-tmp';
	t.appendChild(tmp);
	
	loading=tmp.cloneNode(false);	
	loading.id='simple-loading';
	loading.appendChild(document.createElement('div'));
	t.appendChild(loading);

	overlay=tmp.cloneNode(false);
	overlay.id='simple-overlay';
	t.appendChild(overlay);
	outer=tmp.cloneNode(false);
	outer.id='simple-outer';
	t.appendChild(outer);
	
	inner=tmp.cloneNode(false);
	inner.id='simple-inner';
	outer.appendChild(inner);
	
	nav_close = document.createElement('a');
	nav_close.id = 'simple-close';
	outer.appendChild(nav_close);
	
	nav_left = document.createElement('a');
	nav_left.id = 'simple-left';
	var ico_left = document.createElement('span');
	ico_left.id = 'simple-left-ico';
	ico_left.className = 'simple-ico';
	nav_left.appendChild(ico_left);
	outer.appendChild(nav_left);

	nav_right=nav_left.cloneNode(true);
	nav_right.id='simple-right';
	nav_right.querySelector('span').id='simple-right-ico';
	outer.appendChild(nav_right);

	document.body.appendChild(d);

	nav_close.addEventListener('click', close);
	nav_left.addEventListener('click', prev);
	nav_right.addEventListener('click', next);
	loading.addEventListener('click', cancel);

}


function start() {
	if(busy) return;
	busy=true;
	abort();

	selectedOpts=util.extend({},opts);
	var obj=selectedArray[selectedIndex],
	    href,type,orig=selectedOpts.orig,t,arr;

	typeof orig=='string' && (orig=document.querySelector(orig))
	obj.getElementsByTagName && !orig && (selectedOpts.orig = orig = obj.getElementsByTagName('img')[0])
	selectedOpts.title = obj.title || (orig && ( orig.title || orig.alt )) || '';

	href=selectedOpts.href || obj.href || null;

	if(selectedOpts.type){
		type=selectedOpts.type;	
		if(type=='html')
			href=selectedOpts.content;
	} else {
	       	if(href){
			if (href.match(imgRegExp)) {
				type = 'image';
			} else if (href.match(swfRegExp)) {
				type = 'swf';
			}
		} 
	       
		if(typeof selectedOpts.content!=='undefined'){
			type='html';
			href=selectedOpts.content;
		} else if((t=selectedOpts.video) && (arr=t.split(';')) && arr.length>0 ){
			var videoTypes={mp4:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
					webm:'video/webm; codecs="vp8, vorbis"',
					ogv:'video/ogg; codecs="theora, vorbis"',
					ogg:'video/ogg; codecs="theora, vorbis"'},swf=[],video,source=null;

			type='h5video';
			video=document.createElement('video');
			document.body.appendChild(video);
			arr.forEach(function(el,index,arr){
					var suffix=el.slice(-3),canPlay;
					if(suffix!='flv' && (t=videoTypes[suffix])){
						if(suffix=='mp4') {
					       		swf.push(el) 
					       		if(!video.play) {
						       		swf.push(el);
								return;
							}
						}
						canPlay=video.canPlayType(t);
						if((canPlay=='probably' || canPlay=='maybe') && !source){
							source='<source src="'+el+'" type=\''+t+'\'>';
						}
								
					} else {
						swf.push(el);	
					}
					
				});
			swf.length > 0 && (href=swf[0])
			source && (href=source)

		}
	}

	if( !href || !type ){
		busy=false;
		return;
	}
	selectedOpts.href=href;
	selectedOpts.type=type;


	var str = '', emb = '', key, attrs;

	switch (type){
		case 'image':
				busy=false;
				showActivity();
				imgLoader=new Image();
				imgLoader.onload = function() {
					imgLoader.onerror = null;
					imgLoader.onload = null;
					processImage();
				}
				imgLoader.onerror=error;
				imgLoader.src = href;
		break;
		case 'h5video':
				if(video.play && source) {
					str+='<video id="simple-video" '; 
					for(key in selectedOpts.h5video){
						str+= key + '=' + selectedOpts.h5video[key] + ' ';
					}
					str+='width="' + selectedOpts.width + '" height="' + selectedOpts.height + '">';
					str+=source;
					str+='</video>';
					tmp.innerHTML=str;
					document.body.removeChild(video);
					show();
					break;
				}
				if(swf.length > 0) {
					document.body.removeChild(video);
					selectedOpts.swf['flashvars']=buildFlash();
					selectedOpts.href=selectedOpts.flashPlayer;
				 }

				
				

			
		case 'swf':
				str += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"><param name="movie" value="' + selectedOpts.href + '"></param>';

				for( key in selectedOpts.swf ){
					str += '<param name="' + key + '" value=\'' + selectedOpts.swf[key] + '\'></param>';
					emb += ' ' + key + '=\'' + selectedOpts.swf[key] + '\'';
				}
				str += '<embed src="' + selectedOpts.href + '" type="application/x-shockwave-flash" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"' + emb + '></embed></object>';

				tmp.innerHTML=str;
				show();
		break;

		case 'html':
				tmp.innerHTML=selectedOpts.href;
				if(selectedOpts.autoDimension){
					util.extend(tmp.style,{display:'block',position:'absolute'});

					selectedOpts.width=parseInt(util.getComputedStyleValue(tmp,'width'));
					selectedOpts.height=parseInt(util.getComputedStyleValue(tmp,'height'));

					util.extend(tmp.style,{display:'none',position:'auto'});
				}
				show();
	}
	


}


function buildFlash(){
	var flashVar={},t,p;
	p=flashVar['playlist']=[];
	(t=selectedOpts['h5video']['poster']) && p.push(t)
	t={};
	t.url = selectedOpts.href;
	t.autoPlay = selectedOpts.h5video.autoplay;
	t.autoBuffering = (selectedOpts.h5video.preload !== 'none');
	p.push(t);
	return 'config='+JSON.stringify(flashVar);
	
}




function processImage(){
	busy=true;
	tmp.innerHTML = '';
	selectedOpts.width= imgLoader.width;
	selectedOpts.height= imgLoader.height;
	imgLoader.alt=selectedOpts.title;
	imgLoader.id="simple-img";
	tmp.appendChild(imgLoader);
	show();
}

function show() {
	var w,h,reservedPos,fadeSpeed=selectedOpts.fadeSpeed;
	loading.style.display='none';
	reservedPos=util.extend({},final_pos);
	final_pos = getZoomTo();
	processTitle();
	w = final_pos.width-2*selectedOpts.padding;
	h = final_pos.height-2*selectedOpts.padding-titleh;

	if (util.getComputedStyleValue(outer,'display') != 'none') {
		nav_close.style.display='none';
		nav_left.style.display='none';
		nav_right.style.display='none';
		util.fadeOut(inner,fadeSpeed,function(){
				inner.style.overflow='hidden';
				inner.innerHTML = tmp.innerHTML;
				start_pos={
					width:parseInt(inner.style.width),
					height:parseInt(inner.style.height),
				};

			
				if(start_pos.width==w && start_pos.height==h){
					util.fadeIn(inner,fadeSpeed,function(){
							util.extendStyle(outer,final_pos);
							finish();
							});	
				} else {

					function finish_resize(percent){
						util.fadeIn(inner,fadeSpeed,finish);
					}
					start_pos=reservedPos;
					new Animate(fx,'fx',{from:0,to:1,time:selectedOpts.changeSpeed,step:draw,callback:finish_resize});	
				}
		
				
				});
		
		return;
	}

	start_pos=getZoomFrom();

	inner.innerHTML= tmp.innerHTML;

	if(selectedOpts.overlayShow) {
		overlay.style.backgroundColor = selectedOpts.overlayColor;
		overlay.style.opacity = selectedOpts.overlayOpacity;
		overlay.style.display = 'block';
	}

		

		if(selectedOpts.transitionIn=='elastic'){
			util.extend(inner.style,{
				top	: selectedOpts.padding+'px',
				left	: selectedOpts.padding+'px',
				width	: Math.max(start_pos.width - (selectedOpts.padding * 2), 1)+'px',
				height	: Math.max(start_pos.height- (selectedOpts.padding * 2), 1)+'px'
			});

			util.extendStyle(outer,start_pos);
			outer.style.opacity=1;
			outer.style.display='block';
			new Animate(fx,'fx',{from:0,to:1,step:draw,time:selectedOpts.speedIn,callback:finish});
		} else {
			util.extendStyle(outer,final_pos);
			util.extend(inner.style,{
				top	: selectedOpts.padding+'px',
				left	: selectedOpts.padding+'px',
				width	: Math.max(final_pos.width - (selectedOpts.padding * 2), 1)+'px',
				height	: Math.max(final_pos.height- (selectedOpts.padding * 2)-titleh, 1)+'px'
			});

			if(selectedOpts.transitionIn == 'fade') {
				util.fadeIn(outer,fadeSpeed,finish);
			} else {
				outer.style.opacity=1;
				outer.style.display='block';
				finish();
			}
		}
											
}


function finish(){
var scroll=selectedOpts.scrolling;
	scroll=scroll=='auto' ? (selectedOpts.type=='html' ? 'auto' : 'hidden' ) : (scroll=='yes'?'auto':'visible' );
	inner.style.overflow=scroll;
	if(title)
		title.style.display='block';
	if (selectedOpts.showCloseButton)
		 nav_close.style.display='block';
	if (selectedOpts.hideOnContentClick){
		inner.removeEventListener('click', close);
		inner.addEventListener('click', close);
	}
	if (selectedOpts.hideOnOverlayClick && selectedOpts.overlayShow){
		overlay.removeEventListener('click',close);
		overlay.addEventListener('click',close);
	}

	selectedArray.length > 1 && SetNavigation()
	
	if(selectedOpts.enableCenter){
		window.addEventListener('resize',resizeCenter);
	}

	busy = false;
	preLoadImages();
}




function draw(percent){
	var width = Math.round(start_pos.width+ (final_pos.width- start_pos.width) * percent),
		height = Math.round(start_pos.height+ (final_pos.height- start_pos.height) * percent),
		top = Math.round(start_pos.top+ (final_pos.top- start_pos.top)* percent),
		left = Math.round(start_pos.left+ (final_pos.left - start_pos.left) * percent);
	util.extendStyle(outer,{
			width:width,
			height:height,
			left:left,
			top:top
			});

	width	= Math.max(width - selectedOpts.padding * 2, 0);
	height	= Math.max(height - (selectedOpts.padding * 2 + (titleh * percent)), 0);

	inner.style.width=width+'px';
	inner.style.height=height+'px';

}


function getBrowserWindowSize() {
    var de = document.documentElement;
   return  {
        'width':(
		window.innerWidth
            ||  (de && de.clientWidth ) 
            || document.body.clientWidth),
        'height':(
		window.innerHeight
            || (de && de.clientHeight ) 
            || document.body.clientHeight)
    };
   }

function get_viewport(){
	var win=getBrowserWindowSize();
	return [win.width,win.height,
	       document.documentElement.scrollLeft || document.body.scrollLeft ,
	       document.documentElement.scrollTop || document.body.scrollTop];
}



function get_obj_pos(elm){

	var h,w,t=0,l=0;
	h=elm.offsetHeight;
	w=elm.offsetWidth;
	do{
		l+=elm.offsetLeft;
		t+=elm.offsetTop;
	} while(elm=elm.offsetParent);
	
	return {
		width:w,
		height:h,
		left:l,
		top:t
	};

}


function getZoomFrom(){
	var orig = selectedOpts.orig,
		from = {},
		pos,
		view,
		p=selectedOpts.padding;

	if (orig) {
		pos = get_obj_pos(orig);

		from = {
			width	: (pos.width	+ (p * 2)),
			height	: (pos.height	+ (p * 2)),
			top	: (pos.top	- p ),
			left	: (pos.left	- p )
		};
		
	} else {
		view = get_viewport();

		from = {
			width	: 1,
			height	: 1,
			top	: view[3] + view[1] * 0.5,
			left	: view[2] + view[0] * 0.5
		};
	}

	return from;
}

function getZoomTo(){
	var view=get_viewport(),to={},
	    margin=selectedOpts.margin,
	resize = selectedOpts.autoScale,
	double_padding=selectedOpts.padding*2,
	horizontal_space= (selectedOpts.margin+shadow) * 2, vertical_space= (selectedOpts.margin+shadow) * 2 ;

	if (selectedOpts.width.toString().indexOf('%') > -1) {
		to.width = ((view[0] * parseFloat(selectedOpts.width)) / 100) - (2 * shadow);
		resize = false;

	} else {
		to.width = selectedOpts.width + double_padding;
	}

	if (selectedOpts.height.toString().indexOf('%') > -1) {
		to.height = ((view[1] * parseFloat(selectedOpts.height)) / 100)- (2 * shadow) ;
		resize = false;

	} else {
		to.height = selectedOpts.height + double_padding;
	}
	
	if (resize && (to.width > (view[0] - horizontal_space) || to.height > (view[1] - vertical_space))) {
		if(selectedOpts.type=='image'){	
		horizontal_space	+= double_padding;
		vertical_space		+= double_padding;

		var ratio = Math.min(Math.min( view[0] - horizontal_space, selectedOpts.width) / selectedOpts.width, Math.min( view[1] - vertical_space, selectedOpts.height) / selectedOpts.height);

		to.width	= Math.round(ratio * (to.width	- double_padding)) + double_padding;
		to.height	= Math.round(ratio * (to.height	- double_padding)) + double_padding;

		} else {
			to.width	= Math.min(to.width,	(view[0] - horizontal_space));
					to.height	= Math.min(to.height,	(view[1] - vertical_space));
		
		
		}
	}

	to.left=view[2]+(view[0]-to.width)*0.5;
	to.top=view[3]+(view[1]-to.height)*0.5;

	if (selectedOpts.autoScale == false) {
		to.top	= Math.max(view[3] + margin, to.top);
		to.left	= Math.max(view[2] + margin, to.left);
	}

	return to;
}

function processTitle(){
	var t = selectedOpts.title,w,p=selectedOpts.padding;

	if(title){
		title.parentNode.removeChild(title);
		title=null;
	}
	titleh=0;
	if(!selectedOpts.titleShow) return;

	if(!t) return;

	t = typeof (selectedOpts.titleFormat) === 'function' ? selectedOpts.titleFormat(t, selectedArray, selectedIndex, selectedOpts) : formatTitle(t);
	
	w=Math.max(final_pos.width-2*p,1);
	title=util.createElement('div',{'id':'simple-title','innerHTML':t,'className':'simple-title-'+selectedOpts.titlePosition});
	util.extend(title.style,{width:w+'px',paddingLeft:p+'px',paddingRight:p+'px'});

	document.body.appendChild(title);
	switch (selectedOpts.titlePosition) {
			case 'over':
				title.style.bottom=p+'px';
				break;

			default:
				titleh=title.offsetHeight - selectedOpts.padding;
				final_pos.height += titleh;
				break;
		}
	outer.appendChild(title);
	title.style.display='none';

}


function formatTitle(title){
	var ret=false;
	if (title && title.length) {
			switch (selectedOpts.titlePosition) {
			
				case 'over':
					ret = '<span id="simple-title-over">' + title + '</span>';
					break;
				
				default:
					ret=title;
					break;
				}
		}

		return ret;
}


function SetNavigation(){
	var wheel=navigator.userAgent.match(/firefox/i) ?  "DOMMouseScroll" : "mousewheel";
		document.addEventListener('keydown', documentKey);
	if(selectedOpts.enableMouseWheel){
		outer.removeEventListener(wheel, mouseWheel);
		outer.addEventListener(wheel, mouseWheel);
	}


	if (!selectedOpts.showNavArrows) return;

		if ((selectedOpts.cyclic && selectedArray.length > 1) || selectedIndex != 0) {
			nav_left.style.display='block';
		}

		if ((selectedOpts.cyclic && selectedArray.length > 1) || selectedIndex != (selectedArray.length -1)) {
			nav_right.style.display='block';
		}
}

function mouseWheel(e){
	var delta;
	e = e || window.event;
	delta = e.wheelDelta ? (e.wheelDelta / 120) : ( -e.detail / 3);
      	delta < 0 ? next() : prev()
	e.preventDefault();
}

function resizeCenter(){
	console.log(get_viewport());
	start_pos=getZoomFrom();
	final_pos=getZoomTo();
	
	if(title){
		title.style.width=final_pos.width-2*selectedOpts.padding+'px';
		if(selectedOpts.titlePosition=='inside'){
			titleh=title.offsetHeight - selectedOpts.padding;
			final_pos.height += titleh;
		}
	}
	util.extendStyle(outer,final_pos);	
	util.extend(inner.style,{
		top	: selectedOpts.padding+'px',
		left	: selectedOpts.padding+'px',
		width	: Math.max(final_pos.width - (selectedOpts.padding * 2), 1)+'px',
		height	: Math.max(final_pos.height- (selectedOpts.padding * 2)-titleh, 1)+'px'
	});
}


function documentKey(e){
		var event=e || window.event;
		if (e.keyCode == 27 && selectedOpts.enableEscapeButton) {
			e.preventDefault();
			close();

		} else if (e.keyCode == 37) {
			e.preventDefault();
			prev();

		} else if (e.keyCode == 39) {
			e.preventDefault();
			next();
		}
			
	}
function prev(){
	return pos( selectedIndex - 1);
	}


function next(){
	return pos( selectedIndex + 1);
	}


function pos(pos){
		if(busy) return;	
		if (pos > -1 && selectedArray.length > pos) {
			selectedIndex = pos;
			start();
		}

		if ( selectedOpts.cyclic &&  selectedArray.length > 1 && pos < 0) {
			selectedIndex = selectedArray.length - 1;
			start();
		}

		if (selectedOpts.cyclic && selectedArray.length > 1 && pos >=  selectedArray.length) {
			selectedIndex = 0;
			start();
		}
	
	}
function animate_loading() {
		if (loading.style.display!='block'){
			clearInterval(loadingTimer);
			return;
		}

		loading.childNodes[0].style.top= (loadingFrame * -40) + 'px';

		loadingFrame = (loadingFrame + 1) % 12;
	}


function preLoadImages(){
	var i,l,t=selectedArray.length,img,href;

	

	for(i=selectedIndex+1,l=selectedIndex+selectedOpts.preloadIndent;i<=l;++i){
		if(i>t-1)
			break;
		href=selectedArray[i].href;
		if (typeof href !== 'undefined' && !preLoads[i] && href.match(imgRegExp)) {
			img=new Image();
			img.src=selectedArray[i].href;
			preLoads[i]=img;
		}
	
	}
	for(i=l+1;i<t-1;++i)
		delete preLoads[i];

	for(i=selectedIndex-1,l=selectedIndex-selectedOpts.preloadIndent;i>=l;i--){
		if(i<0)
			break;
		href=selectedArray[i].href;
		if (typeof href !== 'undefined' && !preLoads[i] && href.match(imgRegExp)) {
			img=new Image();
			img.src=selectedArray[i].href;
			preLoads[i]=img;
		}		
	
	}
	for(i=0;i<l;++i)
		delete preLoads[i];
}


function showActivity(){
	clearInterval(loadingTimer);
	loading.style.display='block';
	loadingTimer = setInterval(animate_loading, 66);
}

return {
	init:init,
	start:function(el,option,now){
		var group,index;
		if(typeof el==='string') {
			group=document.querySelectorAll(el);
			group=Array.prototype.slice.call(group,0);
		} else {
			group = !Array.isArray(el) && [el]
		}
		if(arguments.length==2 && typeof arguments[1]=='boolean'){
			now=option;
			option=null;
		}
		if(group.length==0) return;

		function go(index,group){
					selectedArray=group;
					selectedIndex=index;

					opts=util.extend({},defaults);

				var attrs=el.attributes,node,t;	
					if(attrs){
						for(var i=0,l=attrs.length;i<l;++i){
							node=attrs[i].nodeName;
							if(node.indexOf('data-')==0){
								node=node.split('-');
								t=node.pop();
								for(var j=1,nodeL=node.length,part=opts;j<nodeL;++j){
									part[node[j]] && (part = part[node[j]])
								}
								part[t]=attrs[i].nodeValue;
							} 

						}	
					}
					option && (util.extend(opts,option))
					opts['width']=parseInt(opts['width']);
					opts['height']=parseInt(opts['height'])
					start();
				}
		if(now){
			el=group[0];
			go(0,group);
			return;
		}

		group.forEach(function(m,index,arr){
			m.addEventListener('click', function(e) {
				e.preventDefault();
				el = m;
				go(index, arr);
			});
		});
	}
}

})();


})();