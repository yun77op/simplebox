if(typeof Box === 'undefined')
Box = {};

Array.isArray = Array.isArray || function(o) { return Object.prototype.toString.call(o) === '[object Array]'; }; 

(function(K){

K.scripts={};
K.styles={};


K.getScripts=curry(getSS,1);
K.getStyles=curry(getSS,0);

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
	if(requires ){
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


	if(t=args.shift() )  url=t;
	if(t=args.shift() ) ver=t;
	
	if(url){
		K.scripts[name]=url;
	} else {
		url=K.scripts[name];
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


	K.addEvent=(function(){
		if(document.addEventListener)
			return function(obj,type,fn){
				obj.addEventListener(type,fn,false);
			};
		else if(document.attachEvent)
			return function(obj,type,fn){
				obj.attachEvent('on'+type,fn);
			};
	})();

	
	K.removeEvent=(function(){
		if(document.removeEventListener)
			return function(obj,type,fn){
					obj.removeEventListener(type,fn,false);
				};
		else if(document.detachEvent)
			return function(obj,type,fn){
				obj.detachEvent('on'+type,fn);	
				};
	})();

	K.$=function(obj){
		return document.getElementById(obj);
	};


function isObject(obj){
	return obj instanceof Object;
}


K.extend=function(){
	var i, deep=true, target, args ,objCp;

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


K.contentLoad=function(fn){
	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", fn, false);

	} else if (/MSIE/i.test(navigator.userAgent)) {
	document.write("<script id='__ie_onload' defer src='javascript:void(0);'><\/script>");
	var script = document.getElementById("__ie_onload");
		script.onreadystatechange = function() {
			if (this.readyState == 'complete') {
				fn();
			}
		}

	} else if (/WebKit/i.test(navigator.userAgent)) {
		var _timer = setInterval( function() {
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

K.createElement=function(tag,attrs){
	var t=document.createElement(tag),ret;
	ret=attrs ? K.extend(t,attrs) : t ;
	return ret;
};


K.getComputedStyleValue=function(element, style){
    return window.getComputedStyle(element, null).getPropertyValue(style);
};

K.extendStyle=function(el,style){
	var i,styleClone={};
	for(i in style){
		styleClone[i] = style[i]+'px';
	}
	K.extend(el.style,styleClone);
};

K.fadeOut=curry(fade,0);
K.fadeIn=curry(fade,1);

function fade(io,el,time,callback){
	var args=Array.prototype.slice.call(arguments,0),
	    from,t;
	if(args.length==3 && typeof args[2]=='function' ){
		callback=args[2];
		time=null;
	}
	
	if(io){
		if(K.getComputedStyleValue(el,'display')!='none')
			return;
		el.style.opacity=0;
		el.style.display=el.getAttribute('data-display') || 'block';

		new Animate(el,'opacity',{
			to:1,
			time:time,
			callback:function(){
				callback && callback()
				}
			});
	
	
	
	} else {
		if((t=K.getComputedStyleValue(el,'display'))=='none')
			return;
		el.setAttribute('data-display',t);
		new Animate(el,'opacity',{
			to:0,
			time:time,
			callback:function(){
				el.style.display='none';
				callback && callback()
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


})(Box);



function Animate(elm,prop,opts){
	this.elm=elm;
	this.prop=prop;
	this.to=parseInt(opts.to);
	this.from= typeof opts.from != 'undefined' ? opts.from : Box.getComputedStyleValue(elm,prop);
	this.from=parseInt(this.from);
	this.callback=opts.callback;
	this.diff=this.to-this.from;
	this.time=parseInt(opts.time) || Animate.timeShorts[opts.time] || 400;
	this.step=opts.step;
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

