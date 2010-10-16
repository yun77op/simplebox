var simplebox=(function(){
var _1,_2,_3,_4,_5,_6,_7,_8,_9=false,_a,_b,_c,_d,_e,_f=1,_10=20,_11=new Image,fx={style:{}},_12,_13,_14,_15=/\.(jpg|gif|png|bmp|jpeg)(.*)?$/i,_16=/[^\.]\.(swf)\s*$/i,_17,_18=[],_19={padding:10,margin:20,width:560,height:340,cyclic:false,overlayShow:true,hideOnOverlayClick:true,hideOnContentClick:false,swf:{wmode:"opaque"},h5video:{controls:"controls",preload:"metadata",autoplay:false},flashPlayer:"http://releases.flowplayer.org/swf/flowplayer-3.2.1.swf",titlePosition:"inside",titleShow:true,titleFormat:null,transitionIn:"fade",transitionOut:"fade",speedIn:500,speedOut:500,changeSpeed:500,changeFade:500,scrolling:"auto",autoScale:true,autoDimension:true,enableCenter:true,enableMouseWheel:true,showCloseButton:true,showNavArrows:true,enableEscapeButton:true,overlayColor:"#666",overlayOpacity:"0.3",preloadIndent:1};
function _1a(){
_5.style.display="none";
_11.onerror=_11.onload=null;
};
function _1b(){
if(_9){
return;
}
_9=true;
_1a();
_9=false;
};
function _1c(){
simplebox.start({content:"Sorry! the request cann't be reached"},{transitionIn:"none",transitionOut:"none"});
};
function _1d(){
var _1e=function(){
_4.innerHTML=_2.innerHTML="";
Box.fadeOut(_1,"fast",function(){
_9=false;
});
},t;
if(_9){
return;
}
_9=true;
_1a();
Box.removeEvent(document,"keydown",_54);
Box.removeEvent(window,"resize",_3d);
_6.style.display="none";
_7.style.display="none";
_8.style.display="none";
_4.style.overflow="hidden";
if(Box.$("simple-title")){
Box.$("simple-title").parentNode.removeChild(Box.$("simple-title"));
}
if(_d.transitionOut=="fade"){
Box.fadeOut(_3,_1e);
}else{
if(_d.transitionOut=="elastic"){
t=_13;
_13=_12;
_12=t;
new Animate(fx,"fx",{from:0,to:1,step:_39,time:_d.speedOut,callback:function(){
_3.style.display="none";
_1e();
}});
}else{
_3.style.display="none";
_1e();
}
}
};
function _1f(){
var d=document.createDocumentFragment(),t=Box.createElement("div",{"id":"simplebox"});
d.appendChild(t);
_2=Box.createElement("div",{"id":"simple-tmp"});
t.appendChild(_2);
_5=_2.cloneNode(false);
_5.id="simple-loading";
_5.appendChild(document.createElement("div"));
t.appendChild(_5);
_1=_2.cloneNode(false);
_1.id="simple-overlay";
t.appendChild(_1);
_3=_2.cloneNode(false);
_3.id="simple-outer";
t.appendChild(_3);
_4=_2.cloneNode(false);
_4.id="simple-inner";
_3.appendChild(_4);
_6=Box.createElement("a",{"id":"simple-close"});
_3.appendChild(_6);
_7=Box.createElement("a",{"id":"simple-left"});
var _20=Box.createElement("span",{"id":"simple-left-ico","className":"simple-ico"});
_7.appendChild(_20);
_3.appendChild(_7);
_8=_7.cloneNode(true);
_8.id="simple-right";
_8.querySelector("span").id="simple-right-ico";
_3.appendChild(_8);
document.body.appendChild(d);
Box.addEvent(_6,"click",_1d);
Box.addEvent(_7,"click",_21);
Box.addEvent(_8,"click",_22);
Box.addEvent(_5,"click",_1b);
};
function _23(){
if(_9){
return;
}
_9=true;
_1a();
_d=Box.extend({},_c);
var obj=_a[_b],_24,_25,_26=_d.orig,t,arr;
typeof _26=="string"&&(_26=document.querySelector(_26));
obj.getElementsByTagName&&!_26&&(_d.orig=_26=obj.getElementsByTagName("img")[0]);
_d.title=obj.title||(_26&&(_26.title||_26.alt))||"";
_24=_d.href||obj.href||null;
if(_d.type){
_25=_d.type;
if(_25=="html"){
_24=_d.content;
}
}else{
if(_24){
if(_24.match(_15)){
_25="image";
}else{
if(_24.match(_16)){
_25="swf";
}
}
}
if(typeof _d.content!=="undefined"){
_25="html";
_24=_d.content;
}else{
if((t=_d.video)&&(arr=t.split(";"))&&arr.length>0){
var _27={mp4:"video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"",webm:"video/webm; codecs=\"vp8, vorbis\"",ogv:"video/ogg; codecs=\"theora, vorbis\"",ogg:"video/ogg; codecs=\"theora, vorbis\""},swf=[],_28,_29=null;
_25="h5video";
_28=document.createElement("video");
document.body.appendChild(_28);
arr.forEach(function(el,_2a,arr){
var _2b=el.slice(-3),_2c;
if(_2b!="flv"&&(t=_27[_2b])){
if(_2b=="mp4"){
swf.push(el);
if(!_28.play){
swf.push(el);
return;
}
}
_2c=_28.canPlayType(t);
if((_2c=="probably"||_2c=="maybe")&&!_29){
_29="<source src=\""+el+"\" type='"+t+"'>";
}
}else{
swf.push(el);
}
});
swf.length>0&&(_24=swf[0]);
_29&&(_24=_29);
}
}
}
if(!_24||!_25){
return;
}
_d.href=_24;
_d.type=_25;
var str="",emb="",key,_2d;
switch(_25){
case "image":
_9=false;
_5a();
_11=new Image();
_11.onload=function(){
_11.onerror=null;
_11.onload=null;
_2e();
};
_11.onerror=_1c;
_11.src=_24;
break;
case "h5video":
if(_28.play&&_29){
str+="<video id=\"simple-video\" ";
for(key in _d.h5video){
str+=key+"="+_d.h5video[key]+" ";
}
str+="width=\""+_d.width+"\" height=\""+_d.height+"\">";
str+=_29;
str+="</video>";
_2.innerHTML=str;
document.body.removeChild(_28);
_2f();
break;
}
if(swf.length>0){
document.body.removeChild(_28);
_d.swf["flashvars"]=_30();
_d.href=_d.flashPlayer;
}
case "swf":
str+="<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\""+_d.width+"\" height=\""+_d.height+"\"><param name=\"movie\" value=\""+_d.href+"\"></param>";
for(key in _d.swf){
str+="<param name=\""+key+"\" value='"+_d.swf[key]+"'></param>";
emb+=" "+key+"='"+_d.swf[key]+"'";
}
str+="<embed src=\""+_d.href+"\" type=\"application/x-shockwave-flash\" width=\""+_d.width+"\" height=\""+_d.height+"\""+emb+"></embed></object>";
_2.innerHTML=str;
_2f();
break;
case "html":
_2.innerHTML=_d.href;
if(_d.autoDimension){
Box.extend(_2.style,{visibility:"hidden",display:"block",position:"absolute"});
_d.width=parseInt(Box.getComputedStyleValue(_2,"width"));
_d.height=parseInt(Box.getComputedStyleValue(_2,"height"));
Box.extend(_2.style,{visibility:"visible",display:"hidden",position:"auto"});
}
_2f();
}
};
function _30(){
var _31={},t,p;
p=_31["playlist"]=[];
(t=_d["h5video"]["poster"])&&p.push(t);
t={};
t.url=_d.href;
t.autoPlay=_d.h5video.autoplay;
t.autoBuffering=(_d.h5video.preload!=="none");
p.push(t);
return "config="+JSON.stringify(_31);
};
function _2e(){
_9=true;
_2.innerHTML="";
_d.width=_11.width;
_d.height=_11.height;
_11.alt=_d.title;
_11.id="simple-img";
_2.appendChild(_11);
_2f();
};
function _2f(){
var w,h,_32,_33=_d.fadeSpeed;
_5.style.display="none";
_32=Box.extend({},_13);
_13=_34();
_35();
w=_13.width-2*_d.padding;
h=_13.height-2*_d.padding-_14;
if(Box.getComputedStyleValue(_3,"display")!="none"){
_6.style.display="none";
_7.style.display="none";
_8.style.display="none";
Box.fadeOut(_4,_33,function(){
_4.style.overflow="hidden";
_4.innerHTML=_2.innerHTML;
_12={width:parseInt(_4.style.width),height:parseInt(_4.style.height),};
if(_12.width==w&&_12.height==h){
Box.fadeIn(_4,_33,function(){
Box.extendStyle(_3,_13);
_38();
});
}else{
function _36(_37){
Box.fadeIn(_4,_33,_38);
};
_12=_32;
new Animate(fx,"fx",{from:0,to:1,time:_d.changeSpeed,step:_39,callback:_36});
}
});
return;
}
_12=_3a();
_4.innerHTML=_2.innerHTML;
if(_d.overlayShow){
_1.style.backgroundColor=_d.overlayColor;
_1.style.opacity=_d.overlayOpacity;
_1.style.display="block";
}
if(_d.transitionIn=="elastic"){
Box.extend(_4.style,{top:_d.padding+"px",left:_d.padding+"px",width:Math.max(_12.width-(_d.padding*2),1)+"px",height:Math.max(_12.height-(_d.padding*2),1)+"px"});
Box.extendStyle(_3,_12);
_3.style.opacity=1;
_3.style.display="block";
new Animate(fx,"fx",{from:0,to:1,step:_39,time:_d.speedIn,callback:_38});
}else{
Box.extendStyle(_3,_13);
Box.extend(_4.style,{top:_d.padding+"px",left:_d.padding+"px",width:Math.max(_13.width-(_d.padding*2),1)+"px",height:Math.max(_13.height-(_d.padding*2)-_14,1)+"px"});
if(_d.transitionIn=="fade"){
Box.fadeIn(_3,_33,_38);
}else{
_3.style.opacity=1;
_3.style.display="block";
_38();
}
}
};
function _38(){
var _3b=_d.scrolling;
_3b=_3b=="auto"?(_d.type=="html"?"auto":"hidden"):(_3b=="yes"?"auto":"visible");
_4.style.overflow=_3b;
if(Box.$("simple-title")){
Box.$("simple-title").style.display="block";
}
if(_d.showCloseButton){
_6.style.display="block";
}
if(_d.hideOnContentClick){
Box.removeEvent(_4,"click",_1d);
Box.addEvent(_4,"click",_1d);
}
if(_d.hideOnOverlayClick&&_d.overlayShow){
Box.removeEvent(_1,"click",_1d);
Box.addEvent(_1,"click",_1d);
}
_a.length>1&&_3c();
if(_d.enableCenter){
Box.addEvent(window,"resize",_3d);
}
_9=false;
_3e();
};
function _39(_3f){
var _40=Math.round(_12.width+(_13.width-_12.width)*_3f),_41=Math.round(_12.height+(_13.height-_12.height)*_3f),top=Math.round(_12.top+(_13.top-_12.top)*_3f),_42=Math.round(_12.left+(_13.left-_12.left)*_3f);
Box.extendStyle(_3,{width:_40,height:_41,left:_42,top:top});
_40=Math.max(_40-_d.padding*2,0);
_41=Math.max(_41-(_d.padding*2+(_14*_3f)),0);
_4.style.width=_40+"px";
_4.style.height=_41+"px";
};
function _43(){
var de=document.documentElement;
return {"width":(window.innerWidth||(de&&de.clientWidth)||document.body.clientWidth),"height":(window.innerHeight||(de&&de.clientHeight)||document.body.clientHeight)};
};
function _44(){
var win=_43();
return [win.width,win.height,document.documentElement.scrollLeft||document.body.scrollLeft,document.documentElement.scrollTop||document.body.scrollTop];
};
function _45(elm){
var h,w,t=0,l=0;
h=elm.offsetHeight;
w=elm.offsetWidth;
do{
l+=elm.offsetLeft;
t+=elm.offsetTop;
}while(elm=elm.offsetParent);
return {width:w,height:h,left:l,top:t};
};
function _3a(){
var _46=_d.orig,_47={},pos,_48,p=_d.padding;
if(_46){
pos=_45(_46);
_47={width:(pos.width+(p*2)),height:(pos.height+(p*2)),top:(pos.top-p),left:(pos.left-p)};
}else{
_48=_44();
_47={width:1,height:1,top:_48[3]+_48[1]*0.5,left:_48[2]+_48[0]*0.5};
}
return _47;
};
function _34(){
var _49=_44(),to={},_4a=_d.autoScale,_4b=_d.padding*2,_4c=(_d.margin+_10)*2,_4d=(_d.margin+_10)*2;
if(_d.width.toString().indexOf("%")>-1){
to.width=((_49[0]*parseFloat(_d.width))/100)-(2*_10);
_4a=false;
}else{
to.width=_d.width+_4b;
}
if(_d.height.toString().indexOf("%")>-1){
to.height=((_49[1]*parseFloat(_d.height))/100)-(2*_10);
_4a=false;
}else{
to.height=_d.height+_4b;
}
if(_4a&&(to.width>(_49[0]-_4c)||to.height>(_49[1]-_4d))){
_4c+=_4b;
_4d+=_4b;
var _4e=Math.min(Math.min(_49[0]-_4c,_d.width)/_d.width,Math.min(_49[1]-_4d,_d.height)/_d.height);
to.width=Math.round(_4e*(to.width-_4b))+_4b;
to.height=Math.round(_4e*(to.height-_4b))+_4b;
}
to.left=_49[2]+(_49[0]-to.width)*0.5;
to.top=_49[3]+(_49[1]-to.height)*0.5;
if(_d.autoScale==false){
to.top=Math.max(_49[3]+margin,to.top);
to.left=Math.max(_49[2]+margin,to.left);
}
return to;
};
function _35(){
var _4f=_d.title,_50,w,p=_d.padding;
if(Box.$("simple-title")){
Box.$("simple-title").parentNode.removeChild(Box.$("simple-title"));
}
_14=0;
if(!_d.titleShow){
return;
}
if(!_4f){
return;
}
_4f=typeof (_d.titleFormat)==="function"?_d.titleFormat(_4f,_a,_b,_d):_51(_4f);
w=Math.max(_13.width-2*p,1);
_50=Box.createElement("div",{"id":"simple-title","innerHTML":_4f,"className":"simple-title-"+_d.titlePosition});
Box.extend(_50.style,{width:w+"px",paddingLeft:p+"px",paddingRight:p+"px"});
document.body.appendChild(_50);
switch(_d.titlePosition){
case "over":
_50.style.bottom=p+"px";
break;
default:
_14=_50.offsetHeight-_d.padding;
_13.height+=_14;
break;
}
_3.appendChild(_50);
_50.style.display="none";
};
function _51(_52){
var ret=false;
if(_52&&_52.length){
switch(_d.titlePosition){
case "over":
ret="<span id=\"simple-title-over\">"+_52+"</span>";
break;
default:
ret=_52;
break;
}
}
return ret;
};
function _3c(){
var _53=navigator.userAgent.match(/firefox/i)?"DOMMouseScroll":"mousewheel";
Box.addEvent(document,"keydown",_54);
if(_d.enableMouseWheel){
Box.removeEvent(_3,_53,_55);
Box.addEvent(_3,_53,_55);
}
if(!_d.showNavArrows){
return;
}
if((_d.cyclic&&_a.length>1)||_b!=0){
_7.style.display="block";
}
if((_d.cyclic&&_a.length>1)||_b!=(_a.length-1)){
_8.style.display="block";
}
};
function _55(e){
var _56;
e=e||window.event;
_56=e.wheelDelta?(e.wheelDelta/120):(-e.detail/3);
_56<0?_22():_21();
e.preventDefault();
};
function _3d(){
console.log(_44());
_12=_3a();
_13=_34();
Box.extendStyle(_3,_13);
Box.extend(_4.style,{top:_d.padding+"px",left:_d.padding+"px",width:Math.max(_13.width-(_d.padding*2),1)+"px",height:Math.max(_13.height-(_d.padding*2)-_14,1)+"px"});
};
function _54(e){
var _57=e||window.event;
if(e.keyCode==27&&_d.enableEscapeButton){
e.preventDefault();
_1d();
}else{
if(e.keyCode==37){
e.preventDefault();
_21();
}else{
if(e.keyCode==39){
e.preventDefault();
_22();
}
}
}
};
function _21(){
return pos(_b-1);
};
function _22(){
return pos(_b+1);
};
function pos(pos){
if(_9){
return;
}
if(pos>-1&&_a.length>pos){
_b=pos;
_23();
}
if(_d.cyclic&&_a.length>1&&pos<0){
_b=_a.length-1;
_23();
}
if(_d.cyclic&&_a.length>1&&pos>=_a.length){
_b=0;
_23();
}
};
function _58(){
if(_5.style.display!="block"){
clearInterval(_e);
return;
}
_5.childNodes[0].style.top=(_f*-40)+"px";
_f=(_f+1)%12;
};
function _3e(){
var i,l,t=_a.length,img,_59;
for(i=_b+1,l=_b+_d.preloadIndent;i<=l;++i){
if(i>t-1){
break;
}
_59=_a[i].href;
if(typeof _59!=="undefined"&&!_18[i]&&_59.match(_15)){
img=new Image();
img.src=_a[i].href;
_18[i]=img;
}
}
for(i=l+1;i<t-1;++i){
delete _18[i];
}
for(i=_b-1,l=_b-_d.preloadIndent;i>=l;i--){
if(i<0){
break;
}
_59=_a[i].href;
if(typeof _59!=="undefined"&&!_18[i]&&_59.match(_15)){
img=new Image();
img.src=_a[i].href;
_18[i]=img;
}
}
for(i=0;i<l;++i){
delete _18[i];
}
};
function _5a(){
clearInterval(_e);
_5.style.display="block";
_e=setInterval(_58,66);
};
return {init:_1f,start:function(el,_5b,now){
var _5c,_5d;
if(typeof el==="string"){
_5c=document.querySelectorAll(el);
_5c=Array.prototype.slice.call(_5c,0);
}else{
_5c=!Array.isArray(el)&&[el];
}
if(arguments.length==2&&typeof arguments[1]=="boolean"){
now=_5b;
_5b=null;
}
if(_5c.length==0){
return;
}
function go(_5e,_5f){
_a=_5f;
_b=_5e;
_c=Box.extend({},_19);
var _60=el.attributes,_61,t;
if(_60){
for(var i=0,l=_60.length;i<l;++i){
_61=_60[i].nodeName;
if(_61.indexOf("data-")==0){
_61=_61.split("-");
t=_61.pop();
for(var j=1,_62=_61.length,_63=_c;j<_62;++j){
_63[_61[j]]&&(_63=_63[_61[j]]);
}
_63[t]=_60[i].nodeValue;
}
}
}
_5b&&(Box.extend(_c,_5b));
_c["width"]=parseInt(_c["width"]);
_c["height"]=parseInt(_c["height"]);
_23();
};
if(now){
el=_5c[0];
go(0,_5c);
return;
}
_5c.forEach(function(m,_64,arr){
Box.addEvent(m,"click",function(e){
el=m;
e.preventDefault();
go(_64,arr);
});
});
}};
})();

