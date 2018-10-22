/* Sociolla Library beta version */
/***** 
	Regex WIKI:
	+ The \w metacharacter is used to find a word character. A word character is a character from a-z, A-Z, 0-9, including the _ (underscore) character.
	+ The \s metacharacter is used to find a whitespace character.
		+ A whitespace character can be:
		 - A space character
		 - A tab character
		 - A carriage return character
		 - A new line character
		 - A vertical tab character
		 - A form feed characte
	+ RegExp.$1-$9 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/n
*****/
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t():function(e){if(!e.document)throw new Error("Sociolla Library requires a window with a document");return t()}:t()}(this,function(){var e=function(){var c,u,s,r,a,e,i=[],o=i.concat,f=i.filter,l=i.slice,p=window.document,t={},n={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},h=/^\s*<(\w+|!)[^>]*>/,d=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,m=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
//special attributes that should be get/set via method calls 
v=["val","css","html","text","data","width","height","offset"],g=p.createElement("table"),y=p.createElement("tr"),E={tr:p.createElement("tbody"),tbody:g,thead:g,tfoot:g,td:y,th:y,"*":p.createElement("div")},w=/complete|loaded|interactive/,b=/^[\w-]*$/,S={},x=S.toString,N={},P=p.createElement("div"),O=Array.isArray||function(e){return e instanceof Array};function C(e){return null==e?String(e):S[x.call(e)]||"object"}function j(e){return"function"===C(e)}function A(e){return null!=e&&e==e.window}function T(e){return"object"===C(e)}function D(e){return T(e)&&!A(e)&&Object.getPrototypeOf(e)==Object.prototype}
// true if type data is array
function k(e){var t=!!e&&"length"in e&&e.length,n=s.type(e);return"function"!=n&&!A(e)&&("array"==n||0===t||"number"==typeof t&&0<t&&t-1 in e)}function L(e){return e.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function V(e){return e in t?t[e]:t[e]=new RegExp("(^|\\s)"+e+"(\\s|$)")}function _(e,t){return"number"!=typeof t||n[L(e)]?t:t+"px"}function q(e,t){var n,r;if(k(e)){for(n=0;n<e.length;n++)if(!1===t.call(e[n],n,e[n]))return e}else for(r in e)if(!1===t.call(e[r],r,e[r]))return e;return e}function z(e,t){var n,r=e?e.length:0;for(n=0;n<r;n++)this[n]=e[n];this.length=r,this.selector=t||""}
// `$SO.sociolla.fragment` takes a html string and an optional tag name
// to generate DOM nodes from the given html string.
// The generated DOM nodes are returned as an array.
// This function can be overridden in plugins for example to make
// it compatible with browsers that don't support the DOM fully.
function B(e,t,n,r){return j(args)?args.call(e,n,r):t}
// access className property while respecting SVGAnimatedString
function M(e,t){var n=e.className||"",r=n&&n.baseVal!==c;if(t===c)return r?n.baseVal:n;r?n.baseVal=t:e.className=t}
// "true"  => true
// "false" => false
// "null"  => null
// "42"    => 42
// "42.5"  => 42.5
// "08"    => "08"
// JSON    => parse if valid
// String  => self
return N.matches=function(e,t){if(!t||!e||1!==e.nodeType)return!1;var n=e.matches||e.webkitMatchesSelector||e.mozMatchesSelector||e.oMatchesSelector||e.matchesSelector;if(n)return n.call(e,t);
// fall back to performing a selector:
var r,i=e.parentNode,o=!i;return o&&(i=P).appendChild(e),r=~N.qsa(i,t).indexOf(e),o&&P.removeChild(e),r},a=function(e){return e.replace(/-+(.)?/g,function(e,t){return t?t.toUpperCase():""})},e=function(n){return f.call(n,function(e,t){return n.indexOf(e)==t})},N.fragment=function(e,t,n){var r,i,o;
// A special case optimization for a single tag
return d.test(e)&&(r=s(p.createElement(RegExp.$1))),r||(e.replace&&(e=e.replace(m,"<$1></$2>")),t===c&&(t=h.test(e)&&RegExp.$1),t in E||(t="*"),(o=E[t]).innerHTML=""+e,r=s.each(l.call(o.childNodes),function(){o.removeChild(this)})),D(n)&&(i=s(r),s.each(n,function(e,t){-1<v.indexOf(e)?i[e](t):i.attr(e,t)})),r}
// `$SO.sociolla.S` swaps out the prototype of the given `dom` array
// of nodes with `$SO.fn` and thus supplying all the Sociolla functions
// to the array. This method can be overridden in plugins.
,N.S=function(e,t){return new z(e,t)}
// `$SO.sociolla.isS` should return `true` if the given object is a So (sociolla)
// collection. This method can be overridden in plugins.
,N.isS=function(e){return e instanceof N.S}
// `$SO.sociolla.init` is Sociolla's counterpart to Zepto's `$.zepto.init` and
// takes a CSS selector and an optional context (and handles various
// special cases).
// This method can be overridden in plugins.
,N.init=function(e,t){var n,r;
// If nothing given, return an empty Sociolla collection
if(!e)return N.S();
// Optimeze for string selectors	
// create a new Sociolla collection from the nodes found 
if("string"==typeof e)
// If it's a html fragment, create nodes from it
// Note: In both Chrome 21 and Firefox 15, DOM error 12
// is thrown if the fragment doesn't begin with <
if("<"==(e=e.trim())[0]&&h.test(e))n=N.framegment(e,RegExp.$1,t),e=null;
// If there's a context, create a collection on that context first, and select
// nodes from there
else{if(t!==c)return s(t).find(e);
// If it's a CSS selector, use it to select nodes.
n=N.qsa(p,e)}else{if(N.isS(e))return e;
// normalize array if an array of nodes is given 
if(O(e))r=e,n=f.call(r,function(e){return null!=e});
// Wrap DOM nodes.
else if(T(e))n=[e],e=null;
// If it's a html fragment, create nodes from it
else if(h.test(e))n=N.fragment(e.trim(),RegExp.$1,t),e=null;
// If there's a context, create a collection on that context first, and select
// nodes from there
else{if(t!==c)return s(t).find(e);
// And last but no least, if it's a CSS selector, use it to select nodes.
n=N.qsa(p,e)}}return N.S(n,e)}
// `$SO` will be the base `Sociolla` object. When calling this
// function just call `$SO.sociolla.init, which makes the implementation
// details of selecting nodes and creating Sociolla collections
// patchable in plugins.
,
// Copy all but undefined properties from one or more
// objects to the `target` object.
(s=function(e,t){return N.init(e,t)}).extend=function(t){var n,e=l.call(arguments,1);return"boolean"==typeof t&&(n=t,t=e.shift()),e.forEach(function(e){!function e(t,n,r){for(u in n)r&&(D(n[u])||O(n[u]))?(D(n[u])&&!D(t[u])&&(t[u]={}),O(n[u])&&!O(t[u])&&(t[u]=[]),e(t[u],n[u],r)):n[u]!==c&&(t[u]=n[u])}(t,e,n)}),t}
// `$SO.sociolla.qsa` is Sociolla's CSS selector implementation which
// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
// This method can be overridden in plugins.
,N.qsa=function(e,t){var n,r="0"===t[0],i=!i&&"."===t[0],o=r||i?t.slice(1):t,// Ensure that a 1 char tag name still gets checked
u=b.test(o);return e.getElementById&&u&&r?// Safari DocumentFragment doesn't have getElementById
(n=e.getElementById(o))?[n]:[]:1!==e.nodeType&&9!==e.nodeType&&11!==e.nodeType?[]:l.call(u&&!r&&e.getElementsByClassName?// DocumentFragment doesn't have getElementsByClassName/TagName
i?e.getElementsByClassName(o):// If it's simple, it could be a class
e.getElementsByTagName(t):// Or a tag
e.querySelectorAll(t))},s.contains=p.documentElement.contains?function(e,t){return e!==t&&e.contains(t)}:function(e,t){for(;t&&(t=t.parentNode);)if(t===e)return!0;return!1},s.type=C,s.isFunction=j,s.isWindow=A,s.isArray=O,s.isPlainObject=D,s.isEmptyObject=function(e){var t;for(t in e)return!1;return!0},s.inArray=function(e,t,n){return i.indexOf.call(t,e,n)},s.camelCase=a,s.trim=function(e){return null==e?"":String.prototype.trim.call(e)}
// // plugin compatibility
,s.uuid=0,s.support={},s.expr={},s.noop=function(){},s.map=function(e,t){var n,r,i,o,u=[];if(k(e))for(r=0;r<e.length;r++)null!=(n=t(e[r],r))&&u.push(n);else for(i in e)null!=(n=t(e[i],i))&&u.push(n);return 0<(o=u).length?s.fn.concat.apply([],o):o},s.each=q,s.pluck=function(e,n){var r=[];return O(e)&&q(e,function(e,t){r.push(t[n])}),r},s.size=function(e){return null==e?0:O(e)||D(e)?k(e)?e.length:Object.keys(e).length:0},s.grep=function(e,t){return f.call(e,t)},window.JSON&&(s.parseJSON=JSON.parse),
// Populate the class2type map
s.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){S["[object "+t+"]"]=t.toLowerCase()}),
// Define methods that will be available on all
// Sociolla collections
s.fn={constructor:N.S,length:0,
// Because a collection acts like an array
// copy over these useful array functions.
forEach:i.forEach,reduce:i.reduce,push:i.push,sort:i.sort,splice:i.splice,indexOf:i.indexOf,concat:function(){var e,t,n=[];for(e=0;e<arguments.length;e++)t=arguments[e],n[e]=N.isS(t)?t.toArray():t;return o.apply(N.isS(this)?this.toArray():this,n)},
// `map` and `slice` in the jQuery API work differently
// from their array counterparts
map:function(n){return s(s.map(this,function(e,t){return n.call(e,t,e)}))},slice:function(){return s(l.apply(this,arguments))},ready:function(e){
// need to check if document.body exists for IE as that browser reports
// document ready when it hasn't yet created the body element
return w.test(p.readyState)&&p.body?e(s):p.addEventListener("DOMContentLoaded",function(){e(s)},!1),this},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(n){return i.every.call(this,function(e,t){return!1!==n.call(e,t,e)}),this},css:function(e,t){if(arguments.length<2){var n=this[0];if("string"==typeof e){if(!n)return;return n.style[a(e)]||getComputedStyle(n,"").getPropertyValue(e)}if(O(e)){if(!n)return;var r={},i=getComputedStyle(n,"");return s.each(e,function(e,t){r[t]=n.style[a(t)]||i.getPropertyValue(t)}),r}}var o="";if("string"==C(e))t||0===t?o=L(e)+":"+_(e,t):this.each(function(){this.style.removeProperty(L(e))});else for(u in e)e[u]||0===e[u]?o+=L(u)+":"+_(u,e[u])+";":this.each(function(){this.style.removeProperty(L(u))});return this.each(function(){this.style.cssText+=";"+o})},find:function(e){var n=this;return e?"object"==typeof e?s(e).filter(function(){var t=this;return i.some.call(n,function(e){return s.contains(e,t)})}):1==this.length?s(N.qsa(this[0],e)):this.map(function(){return N.qsa(this,e)}):$()},hasClass:function(e){return!!e&&i.some.call(this,function(e){return this.test(M(e))},V(e))},addClass:function(n){return n?this.each(function(e){if("className"in this){r=[];var t=M(this);B(this,n,e,t).split(/\s+/g).forEach(function(e){s(this).hasClass(e)||r.push(e)},this),r.length&&M(this,t+(t?" ":"")+r.join(" "))}}):this},removeClass:function(t){return this.each(function(e){if("className"in this){if(t===c)return M(this,"");r=M(this),B(this,t,e,r).split(/\s+/g).forEach(function(e){r=r.replace(V(e)," ")}),M(this,r.trim())}})}},N.S.prototype=z.prototype=s.fn,
// Generate the `after`, `prepend`, `before`, `append`,
// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
["after","prepend","before","append"].forEach(function(t,u){var a=u%2;//=> prepend, append
s.fn[t]=function(){
// arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
var n,r,i=s.map(arguments,function(e){var t=[];return"array"==(n=C(e))?(e.forEach(function(e){return e.nodeType!==c?t.push(e):s.sociolla.isS(e)?t=t.concat(e.get()):void(t=t.concat(N.fragment(e)))}),t):"object"==n||null==e?e:N.fragment(e)}),o=1<this.length;return i.length<1?this:this.each(function(e,t){r=a?t:t.parentNode,
// convert all methods to a "before" operation
t=0==u?t.nextSibling:1==u?t.firstChild:2==u?t:null;var n=s.contains(p.documentElement,r);i.forEach(function(e){if(o)e=e.cloneNode(!0);else if(!r)return s(e).remove();r.insertBefore(e,t),n&&function e(t,n){n(t);for(var r=0,i=t.childNodes.length;r<i;r++)e(t.childNodes[r],n)}(e,function(e){if(!(null==e.nodeName||"SCRIPT"!==e.nodeName.toUpperCase()||e.type&&"text/javascript"!==e.type||e.src)){var t=e.ownerDocument?e.ownerDocument.defaultView:window;t["eval"].call(t,e.innerHTML)}})})})}
// after    => insertAfter
// prepend  => prependTo
// before   => insertBefore
// append   => appendTo
,s.fn[a?t+"To":"insert"+(u?"Before":"After")]=function(e){return s(e)[t](this),this}}),
// Export internal API functions in the `$SO.sociolla` namespace
N.uniq=e,N.deserializeValue=function(t){try{return t?"true"==t||"false"!=t&&("null"==t?null:+t+""==t?+t:/^[\[\{]/.test(t)?$.parseJSON(t):t):t}catch(e){return t}},s.sociolla=N,s}();window.Sociolla=e,void 0===window.$SO&&(window.$SO=e),function(f){var l,t=1,s=Array.prototype.slice,p=f.isFunction,h=function(e){return"string"===f.type(e)},d={},o={},n="onfocusin"in window,r={focus:"focusin",blur:"focusout"},m={mouseenter:"mouseover",mouseleave:"mouseout"};function v(e){return e._sid||(e._sid=t++)}function u(e,t,n,r){if((t=g(t)).ns)var i=(o=t.ns,new RegExp("(?:^| )"+o.replace(" ",".* ?")+"(?: |$)"));var o;return(d[v(e)]||[]).filter(function(e){return e&&(!t.e||e.e==t.e)&&(!t.ns||i.test(e.ns))&&(!n||v(e.fn)===v(n))&&(!r||e.sel==r)})}function g(e){var t=(""+e).split(".");return{e:t[0],ns:t.slice(1).sort().join(" ")}}function y(e,t){return e.del&&!n&&e.e in r||!!t}function E(e){return m[e]||n&&r[e]||e}function w(i,e,t,o,u,a,c){var n=v(i),s=d[n]||(d[n]=[]);e.split(/\s/).forEach(function(e){if("ready"==e)return f(document).ready(t);var n=g(e);n.fn=t,n.sel=u,
// emulate mouseenter, mouseleave
n.e in m&&(t=function(e){var t=e.relatedTarget;if(!t||t!==this&&!f.contains(this,t))return n.fn.apply(this,arguments)});var r=(n.del=a)||t;n.proxy=function(e){if(!(e=x(e)).isImmediatePropagationStopped()){e.data=o;var t=r.apply(i,e._args==l?[e]:[e].concat(e._args));return!1===t&&(e.preventDefault(),e.stopPropagation()),t}},n.i=s.length,s.push(n),"addEventListener"in i&&i.addEventListener(E(n.e),n.proxy,y(n,c))})}function b(t,e,n,r,i){var o=v(t);(e||"").split(/\s/).forEach(function(e){u(t,e,n,r).forEach(function(e){delete d[o][e.i],"removeEventListener"in t&&t.removeEventListener(E(e.e),e.proxy,y(e,i))})})}o.click=o.mousedown=o.mouseup=o.mousemove="MouseEvents",f.event={add:w,remove:b},f.proxy=function(e,t){var n=2 in arguments&&s.call(arguments,2);if(p(e)){var r=function(){return e.apply(t,n?n.concat(s.call(arguments)):arguments)};return r._sid=v(e),r}if(h(t))return n?(n.unshift(e[t],e),f.proxy.apply(null,n)):f.proxy(e[t],e);throw new TypeError("expected function")};var a=function(){return!0},S=function(){return!1},i=/^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,e={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};function x(r,i){return!i&&r.isDefaultPrevented||(i||(i=r),f.each(e,function(e,t){var n=i[e];r[e]=function(){return this[t]=a,n&&n.apply(i,arguments)},r[t]=S}),r.timeStamp||(r.timeStamp=Date.now()),(i.defaultPrevented!==l?i.defaultPrevented:"returnValue"in i?!1===i.returnValue:i.getPreventDefault&&i.getPreventDefault())&&(r.isDefaultPrevented=a)),r}function N(e){var t,n={originalEvent:e};for(t in e)i.test(t)||e[t]===l||(n[t]=e[t]);return x(n,e)}f.fn.on=function(t,i,n,o,u){var a,c,r=this;return t&&!h(t)?(f.each(t,function(e,t){r.on(e,i,n,t,u)}),r):(h(i)||p(o)||!1===o||(o=n,n=i,i=l),o!==l&&!1!==n||(o=n,n=l),!1===o&&(o=S),r.each(function(e,r){u&&(a=function(e){return b(r,e.type,o),o.apply(this,arguments)}),i&&(c=function(e){var t,n=$(e.target).closest(i,r).get(0);if(n&&n!==r)return t=f.extend(N(e),{currentTarget:n,liveFired:r}),(a||o).apply(n,[t].concat(s.call(arguments,1)))}),w(r,t,o,n,i,c||a)}))},f.fn.off=function(e,n,t){var r=this;return e&&!h(e)?(f.each(e,function(e,t){r.off(e,n,t)}),r):(h(n)||p(t)||!1===t||(t=n,n=l),!1===t&&(t=S),r.each(function(){b(this,e,t,n)}))},f.fn.trigger=function(e,t){return(e=h(e)||f.isPlainObject(e)?f.Event(e):x(e))._args=t,this.each(function(){
// handle focus(), blur() by calling them directly
e.type in r&&"function"==typeof this[e.type]?this[e.type]():"dispatchEvent"in this?this.dispatchEvent(e):f(this).triggerHandler(e,t)})}
// triggers event handlers on current element just as if an event occurred,
// doesn't trigger an actual event, doesn't bubble
,f.fn.triggerHandler=function(n,r){var i,o;return this.each(function(e,t){(i=N(h(n)?f.Event(n):n))._args=r,i.target=t,f.each(u(t,n.type||n),function(e,t){if(o=t.proxy(i),i.isImmediatePropagationStopped())return!1})}),o}
// shortcut methods for `.bind(event, fn)` for each event type
,("focusin focusout focus blur load resize scroll unload click dblclick "+"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave "+"change select keydown keypress keyup error").split(" ").forEach(function(t){f.fn[t]=function(e){return 0 in arguments?this.bind(t,e):this.trigger(t)}}),f.Event=function(e,t){h(e)||(e=(t=e).type);var n=document.createEvent(o[e]||"Events"),r=!0;if(t)for(var i in t)"bubbles"==i?r=!!t[i]:n[i]=t[i];return n.initEvent(e,r,!0),x(n)}}(e)});