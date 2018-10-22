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
(function(global, factory) {
	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "Sociolla Library requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}
}(this, function() {
	var Sociolla = (function() {
		var undefined, key, $SO, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
		document = window.document,
		elementDisplay = {}, classCache = {},
		cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
		fragmentRE = /^\s*<(\w+|!)[^>]*>/,
		singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
		rootNodeRE = /^(?:body|html)$/i,
		capitalRE = /([A-Z])/g,

		//special attributes that should be get/set via method calls 
		methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

		adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
		table = document.createElement('table'),
		tableRow = document.createElement('tr'),
		containers = {
		  'tr': document.createElement('tbody'),
		  'tbody': table, 'thead': table, 'tfoot': table,
		  'td': tableRow, 'th': tableRow,
		  '*': document.createElement('div')
		},
		readyRE = /complete|loaded|interactive/,
		simpleSelectorRE = /^[\w-]*$/,
		class2type = {},
		toString = class2type.toString,
		sociolla = {},
		camelize, uniq,
		tempParent = document.createElement('div'),
		propMap = {
		  'tabindex': 'tabIndex',
		  'readonly': 'readOnly',
		  'for': 'htmlFor',
		  'class': 'className',
		  'maxlength': 'maxLength',
		  'cellspacing': 'cellSpacing',
		  'cellpadding': 'cellPadding',
		  'rowspan': 'rowSpan',
		  'colspan': 'colSpan',
		  'usemap': 'useMap',
		  'frameborder': 'frameBorder',
		  'contenteditable': 'contentEditable'
		},
		isArray = Array.isArray || 
			function(object){ return object instanceof Array }

		sociolla.matches = function(element, selector) {
			if (!selector || !element || element.nodeType !== 1) return false
		    var matchesSelector = element.matches || element.webkitMatchesSelector ||
		                          element.mozMatchesSelector || element.oMatchesSelector ||
		                          element.matchesSelector
		    if (matchesSelector) return matchesSelector.call(element, selector)
		    // fall back to performing a selector:
		    var match, parent = element.parentNode, temp = !parent
		    if (temp) (parent = tempParent).appendChild(element)
		    match = ~sociolla.qsa(parent, selector).indexOf(element)
		    temp && tempParent.removeChild(element)
		    return match
		}

		function type(obj) {
			return obj == null ? String(obj) : 
				class2type[toString.call(obj)] || "object"
		}

		function isFunction(obj) 	{ return type(obj) === "function" }
		function isWindow(obj) 		{ return obj != null && obj == obj.window }
		function isObject(obj) 		{ return type(obj) === "object" }
		function isPlainObject(obj) {
			return isObject(obj) &&  !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
		}
		// true if type data is array
		function likeArray(obj) {
			var length = !!obj && 'length' in obj && obj.length,
				type = $SO.type(obj)

			return 'function' != type && !isWindow(obj) && (
				'array' == type || length === 0 ||
					(typeof length == 'number' && length > 0 && (length - 1) in obj)
			)
		}

		function compact(array) { return filter.call(array, function(item){ return item != null }) }
		function flatten(array) { return array.length > 0 ? $SO.fn.concat.apply([], array) : array }
		camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
		function dasherize(str) {
			return str.replace(/::/g, '/')
		           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
		           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
		           .replace(/_/g, '-')
		           .toLowerCase()
		}
		uniq = function(array)  { return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

		function classRE(name)	{
			return name in classCache ?
				classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
		}

		function maybeAddPx(name, value) {
			return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
		}

		function defaultDisplay(nodeName) {
			var element, display
			if (!elementDisplay[nodeName]) {
				element = document.createElement(nodeName)
				document.body.appendChild(element)
				display = getComputedStyle(element, '').getPropertyValue("display")
				element.parentNode.removeChild(element)
				display == "none" && (display = "block")
				elementDisplay[nodeName] = display
			}
			return elementDisplay[nodeName]
		}

		function children(element) {
			return 'children' in element ?
				slice.call(element.children) : 
					$SO.map(element.childNodes, function(node){ if(node.nodeType == 1) return node })
		}

		function each(elements, callback) {
			var i, key
			if(likeArray(elements)) {
				for (i = 0; i < elements.length; i++) 
					if (callback.call(elements[i], i, elements[i]) === false) return elements
			} else {
				for (key in elements)
					if (callback.call(elements[key], key, elements[key]) === false) return elements
			}

			return elements
		}

		function S(dom, selector) {
			var i, len = dom ? dom.length : 0
			for (i = 0; i < len; i++) this[i] = dom[i]
			this.length = len
			this.selector = selector || ''
		}

		// `$SO.sociolla.fragment` takes a html string and an optional tag name
		// to generate DOM nodes from the given html string.
		// The generated DOM nodes are returned as an array.
		// This function can be overridden in plugins for example to make
		// it compatible with browsers that don't support the DOM fully.
		sociolla.fragment = function(html, name, properties) {
			var dom, nodes, container

			// A special case optimization for a single tag
			if (singleTagRE.test(html)) dom = $SO(document.createElement(RegExp.$1))

			if (!dom) {
				if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
				if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
				if (!(name in containers)) name = '*'

				container = containers[name]
				container.innerHTML = '' + html
				dom = $SO.each(slice.call(container.childNodes), function(){
					container.removeChild(this)
				})
			}

			if (isPlainObject(properties)) {
				nodes = $SO(dom)
				$SO.each(properties, function(key, value) {
					if (methodAttributes.indexOf(key) > -1) nodes[key](value)
					else nodes.attr(key, value)
				})
			}

			return dom
		}

		// `$SO.sociolla.S` swaps out the prototype of the given `dom` array
		// of nodes with `$SO.fn` and thus supplying all the Sociolla functions
		// to the array. This method can be overridden in plugins.
		sociolla.S = function(dom, selector) {
		  return new S(dom, selector)
		}

		// `$SO.sociolla.isS` should return `true` if the given object is a So (sociolla)
		// collection. This method can be overridden in plugins.
		sociolla.isS = function(object) {
		  return object instanceof sociolla.S
		}

		// `$SO.sociolla.init` is Sociolla's counterpart to Zepto's `$.zepto.init` and
		// takes a CSS selector and an optional context (and handles various
		// special cases).
		// This method can be overridden in plugins.
		sociolla.init = function(selector, context) {
			var dom
			// If nothing given, return an empty Sociolla collection
			if (!selector) return sociolla.S()
			// Optimeze for string selectors	
			else if (typeof selector === 'string') {
				selector = selector.trim()
				// If it's a html fragment, create nodes from it
				// Note: In both Chrome 21 and Firefox 15, DOM error 12
				// is thrown if the fragment doesn't begin with <
				if(selector[0] == '<' && fragmentRE.test(selector))
					dom = sociolla.framegment(selector, RegExp.$1, context), selector = null
				// If there's a context, create a collection on that context first, and select
				// nodes from there
				else if (context !== undefined) return $SO(context).find(selector)
				// If it's a CSS selector, use it to select nodes.
				else dom = sociolla.qsa(document, selector)
			}
			// If a Sociolla collection is given, just return it
			else if (sociolla.isS(selector)) return selector
			else {
				// normalize array if an array of nodes is given 
				if(isArray(selector)) dom = compact(selector)
				// Wrap DOM nodes.
				else if(isObject(selector))
					dom = [selector], selector = null
				// If it's a html fragment, create nodes from it
				else if (fragmentRE.test(selector))
					dom = sociolla.fragment(selector.trim(), RegExp.$1, context), selector = null
				// If there's a context, create a collection on that context first, and select
				// nodes from there
				else if (context !== undefined) return $SO(context).find(selector)
				// And last but no least, if it's a CSS selector, use it to select nodes.
				else dom = sociolla.qsa(document, selector)
			}
			// create a new Sociolla collection from the nodes found 
			return sociolla.S(dom, selector)
		}

		// `$SO` will be the base `Sociolla` object. When calling this
		// function just call `$SO.sociolla.init, which makes the implementation
		// details of selecting nodes and creating Sociolla collections
		// patchable in plugins.
		$SO = function(selector, context){
		  return sociolla.init(selector, context)
		}

		function extend(target, source, deep) {
			for (key in source)
				if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
					if (isPlainObject(source[key]) && !isPlainObject(target[key]))
						target[key] = {}
					if (isArray(source[key]) && !isArray(target[key]))
						target[key] = []
					extend(target[key], source[key], deep)
				}
				else if (source[key] !== undefined) target[key] = source[key]
		}

		// Copy all but undefined properties from one or more
		// objects to the `target` object.
		$SO.extend = function(target){
			var deep, args = slice.call(arguments, 1)
			if (typeof target == 'boolean') {
				deep = target
				target = args.shift()
			}
			args.forEach(function(arg){ extend(target, arg, deep) })
			return target
		}

		// `$SO.sociolla.qsa` is Sociolla's CSS selector implementation which
		// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
		// This method can be overridden in plugins.
		sociolla.qsa = function(element, selector){
			var found,
				maybeID = selector[0] === '0',
				maybeClass = !maybeClass && selector[0] === '.',
				nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
				isSimple = simpleSelectorRE.test(nameOnly)
			return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
				( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
				(element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
				slice.call(
					isSimple && !maybeID && element.getElementsByClassName ?  // DocumentFragment doesn't have getElementsByClassName/TagName
						maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
						element.getElementsByTagName(selector) : // Or a tag
						element.querySelectorAll(selector) // Or it's not simple, and we need to query all
				)
		}

		function filtered(nodes, selector) {
			return selector == null ? $SO(nodes) : $SO(nodes).filter(selector)
		}

		$SO.contains = document.documentElement.contains ?
			function(parent, node) {
				return parent !== node && parent.contains(node)
			} : 
			function(parent, node) {
				while (node && (node = node.parentNode))
					if (node === parent) return true
				return false
			}

		function funcArg(context, arg, idx, payload) {
			return isFunction(args) ? args.call(context, idx, payload) : arg
		}

		function setAttribute(node, name, value) {
			value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
		}

		// access className property while respecting SVGAnimatedString
		function className(node, value){
			var klass = node.className || '',
				svg   = klass && klass.baseVal !== undefined

			if (value === undefined) return svg ? klass.baseVal : klass
			svg ? (klass.baseVal = value) : (node.className = value)
		}

		// "true"  => true
		// "false" => false
		// "null"  => null
		// "42"    => 42
		// "42.5"  => 42.5
		// "08"    => "08"
		// JSON    => parse if valid
		// String  => self
		function deserializeValue(value) {
		  try {
		    return value ?
		      value == "true" ||
		      ( value == "false" ? false :
		        value == "null" ? null :
		        +value + "" == value ? +value :
		        /^[\[\{]/.test(value) ? $.parseJSON(value) :
		        value )
		      : value
		  } catch(e) {
		    return value
		  }
		}

		$SO.type = type
		$SO.isFunction = isFunction
		$SO.isWindow = isWindow
		$SO.isArray = isArray
		$SO.isPlainObject = isPlainObject

		$SO.isEmptyObject = function(obj) {
			var name
			for (name in obj) return false
			return true
		}

		$SO.inArray = function(elem, array, i){
			return emptyArray.indexOf.call(array, elem, i)
		}

		$SO.camelCase = camelize
		$SO.trim = function(str) {
			return str == null ? "" : String.prototype.trim.call(str)
		}

		$SO.map = function(elements, callback){
			var value, values = [], i, key
			if (likeArray(elements))
				for (i = 0; i < elements.length; i++) {
					value = callback(elements[i], i)
					if (value != null) values.push(value)
				}
			else 
				for (key in elements) {
					value = callback(elements[key], key)
					if (value != null) values.push(value)
				}
			return flatten(values)
		}

		$SO.each = each;

		$SO.pluck = function(obj, key) {
			var values = []
			isArray(obj) ? 
				each(obj, function(idx, element){ values.push(element[key]) })
				: values
			return values
		}

		$SO.size = function(obj) {
			if (obj == null) return 0
			if (isArray(obj) || isPlainObject(obj)) 
				return likeArray(obj) ? obj.length : Object.keys(obj).length; 
			else
				return 0
		}

		$SO.grep = function(elements, callback){
		  return filter.call(elements, callback)
		}

		if(window.JSON) $SO.parseJSON = JSON.parse;

		// Populate the class2type map
		$SO.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		  class2type[ "[object " + name + "]" ] = name.toLowerCase()
		})

		// Define methods that will be available on all
		// Sociolla collections
		$SO.fn = {
			constructor: sociolla.S,
			length: 0,

			// Because a collection acts like an array
			// copy over these useful array functions.
			forEach: emptyArray.forEach,
			reduce: emptyArray.reduce,
			push: emptyArray.push,
			sort: emptyArray.sort,
			splice: emptyArray.splice,
			indexOf: emptyArray.indexOf,
			concat: function(){
				var i, value, args = []
				for (i = 0; i < arguments.length; i++) {
					value = arguments[i]
					args[i] = sociolla.isS(value) ? value.toArray() : value
				}
				return concat.apply(sociolla.isS(this) ? this.toArray() : this, args)
			},

			// `map` and `slice` in the jQuery API work differently
			// from their array counterparts
			map: function(fn){
			  return $SO($SO.map(this, function(el, i){ return fn.call(el, i, el) }))
			},
			slice: function(){
			  return $SO(slice.apply(this, arguments))
			},

			ready: function(callback){
				// need to check if document.body exists for IE as that browser reports
				// document ready when it hasn't yet created the body element
				if(readyRE.test(document.readyState) && document.body) callback($SO)
				else document.addEventListener('DOMContentLoaded', function(){ callback($SO) }, false)
				return this	
			},

			remove: function() {
				return this.each(function(){
					if (this.parentNode != null) {
						this.parentNode.removeChild(this)
					}
				})
			},
			each: function(callback){
				emptyArray.every.call(this, function(el, idx){
					return callback.call(el, idx, el) !== false
				})
				return this
			},
			css: function(property, value){
			  if (arguments.length < 2) {
			    var element = this[0]
			    if (typeof property == 'string') {
			      if (!element) return
			      return element.style[camelize(property)] || getComputedStyle(element, '').getPropertyValue(property)
			    } else if (isArray(property)) {
			      if (!element) return
			      var props = {}
			      var computedStyle = getComputedStyle(element, '')
			      $SO.each(property, function(_, prop){
			        props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
			      })
			      return props
			    }
			  }

			  var css = ''
			  if (type(property) == 'string') {
			    if (!value && value !== 0)
			      this.each(function(){ this.style.removeProperty(dasherize(property)) })
			    else
			      css = dasherize(property) + ":" + maybeAddPx(property, value)
			  } else {
			    for (key in property)
			      if (!property[key] && property[key] !== 0)
			        this.each(function(){ this.style.removeProperty(dasherize(key)) })
			      else
			        css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
			  }

			  return this.each(function(){ this.style.cssText += ';' + css })
			},
			find: function(selector){
			  var result, $this = this
			  if (!selector) result = $()
			  else if (typeof selector == 'object')
			    result = $SO(selector).filter(function(){
			      var node = this
			      return emptyArray.some.call($this, function(parent){
			        return $SO.contains(parent, node)
			      })
			    })
			  else if (this.length == 1) result = $SO(sociolla.qsa(this[0], selector))
			  else result = this.map(function(){ return sociolla.qsa(this, selector) })
			  return result
			},
			hasClass: function(name){
			  if (!name) return false
			  return emptyArray.some.call(this, function(el){
			    return this.test(className(el))
			  }, classRE(name))
			},
			addClass: function(name){
			  if (!name) return this
			  return this.each(function(idx){
			    if (!('className' in this)) return
			    classList = []
			    var cls = className(this), newName = funcArg(this, name, idx, cls)
			    newName.split(/\s+/g).forEach(function(klass){
			      if (!$SO(this).hasClass(klass)) classList.push(klass)
			    }, this)
			    classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
			  })
			},
			removeClass: function(name){
			  return this.each(function(idx){
			    if (!('className' in this)) return
			    if (name === undefined) return className(this, '')
			    classList = className(this)
			    funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
			      classList = classList.replace(classRE(klass), " ")
			    })
			    className(this, classList.trim())
			  })
			}
		}

		sociolla.S.prototype = S.prototype = $SO.fn

		function traverseNode(node, fun) {
		  fun(node)
		  for (var i = 0, len = node.childNodes.length; i < len; i++)
		    traverseNode(node.childNodes[i], fun)
		}

		// Generate the `after`, `prepend`, `before`, `append`,
		// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
		adjacencyOperators.forEach(function(operator, operatorIndex) {
		  var inside = operatorIndex % 2 //=> prepend, append

		  $SO.fn[operator] = function(){
		    // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
		    var argType, nodes = $SO.map(arguments, function(arg) {
		          var arr = []
		          argType = type(arg)
		          if (argType == "array") {
		            arg.forEach(function(el) {
		              if (el.nodeType !== undefined) return arr.push(el)
		              else if ($SO.sociolla.isS(el)) return arr = arr.concat(el.get())
		              arr = arr.concat(sociolla.fragment(el))
		            })
		            return arr
		          }
		          return argType == "object" || arg == null ?
		            arg : sociolla.fragment(arg)
		        }),
		        parent, copyByClone = this.length > 1
		    if (nodes.length < 1) return this

		    return this.each(function(_, target){
		      parent = inside ? target : target.parentNode

		      // convert all methods to a "before" operation
		      target = operatorIndex == 0 ? target.nextSibling :
		               operatorIndex == 1 ? target.firstChild :
		               operatorIndex == 2 ? target :
		               null

		      var parentInDocument = $SO.contains(document.documentElement, parent)

		      nodes.forEach(function(node){
		        if (copyByClone) node = node.cloneNode(true)
		        else if (!parent) return $SO(node).remove()

		        parent.insertBefore(node, target)
		        if (parentInDocument) traverseNode(node, function(el){
		          if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
		             (!el.type || el.type === 'text/javascript') && !el.src){
		            var target = el.ownerDocument ? el.ownerDocument.defaultView : window
		            target['eval'].call(target, el.innerHTML)
		          }
		        })
		      })
		    })
		  }

		  // after    => insertAfter
		  // prepend  => prependTo
		  // before   => insertBefore
		  // append   => appendTo
		  $SO.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
		    $SO(html)[operator](this)
		    return this
		  }
		})

		// Export internal API functions in the `$SO.sociolla` namespace
		sociolla.uniq = uniq
		sociolla.deserializeValue = deserializeValue
		$SO.sociolla = sociolla

		return $SO
	})()

	window.Sociolla = Sociolla
	window.$SO === undefined && (window.$SO = Sociolla)

	;(function($SO){
		var _sid = 1, undefined,
			slice = Array.prototype.slice,
			isFunction = $SO.isFunction,
			isString = function(obj) { return $SO.type(obj) === 'string' },
			handlers = {},
			specialEvents = {},
			focusinSupported = 'onfocusin' in window,
			focus = { focus: 'focusin', blur: 'focusout' },
			hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

		specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

		function sid(element) {
			return element._sid || (element._sid = _sid++)
		}
		function findHandlers(element, event, fn, selector) {
			event = parse(event)
			if (event.ns) var matcher = matcherFor(event.ns)
			return (handlers[sid(element)] || []).filter(function(handler) {
				return handler
					&& (!event.e  || handler.e == event.e)
					&& (!event.ns || matcher.test(handler.ns))
					&& (!fn 	  || sid(handler.fn) === sid(fn))
					&& (!selector || handler.sel == selector)
			})
		}
		function parse(event) {
			var parts = ('' + event).split('.')
			return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
		}
		function matcherFor(ns) {
			return new RegExp('(?:^| )' + ns.replace(' ', '.* ?') + '(?: |$)')
		}

		function eventCapture(handler, captureSetting) {
			return handler.del &&
				(!focusinSupported && (handler.e in focus)) ||
				!!captureSetting
		}

		function realEvent(type) {
			return hover[type] || (focusinSupported && focus[type]) || type
		}

		function add(element, events, fn, data, selector, delegator, capture){
		  var id = sid(element), set = (handlers[id] || (handlers[id] = []))
		  events.split(/\s/).forEach(function(event){
		    if (event == 'ready') return $SO(document).ready(fn)
		    var handler   = parse(event)
		    handler.fn    = fn
		    handler.sel   = selector
		    // emulate mouseenter, mouseleave
		    if (handler.e in hover) fn = function(e){
		      var related = e.relatedTarget
		      if (!related || (related !== this && !$SO.contains(this, related)))
		        return handler.fn.apply(this, arguments)
		    }
		    handler.del   = delegator
		    var callback  = delegator || fn
		    handler.proxy = function(e){
		      e = compatible(e)
		      if (e.isImmediatePropagationStopped()) return
		      e.data = data
		      var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
		      if (result === false) e.preventDefault(), e.stopPropagation()
		      return result
		    }
		    handler.i = set.length
		    set.push(handler)
		    if ('addEventListener' in element)
		      element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
		  })
		}
		function remove(element, events, fn, selector, capture){
		  var id = sid(element)
		  ;(events || '').split(/\s/).forEach(function(event){
		    findHandlers(element, event, fn, selector).forEach(function(handler){
		      delete handlers[id][handler.i]
		    if ('removeEventListener' in element)
		      element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
		    })
		  })
		}

		$SO.event = { add: add, remove: remove }

		$SO.proxy = function(fn, context) {
		  var args = (2 in arguments) && slice.call(arguments, 2)
		  if (isFunction(fn)) {
		    var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
		    proxyFn._sid = sid(fn)
		    return proxyFn
		  } else if (isString(context)) {
		    if (args) {
		      args.unshift(fn[context], fn)
		      return $SO.proxy.apply(null, args)
		    } else {
		      return $SO.proxy(fn[context], fn)
		    }
		  } else {
		    throw new TypeError("expected function")
		  }
		}

		var returnTrue = function(){return true},
		    returnFalse = function(){return false},
		    ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$|webkitMovement[XY]$)/,
		    eventMethods = {
		      preventDefault: 'isDefaultPrevented',
		      stopImmediatePropagation: 'isImmediatePropagationStopped',
		      stopPropagation: 'isPropagationStopped'
		    }

		function compatible(event, source) {
		  if (source || !event.isDefaultPrevented) {
		    source || (source = event)

		    $SO.each(eventMethods, function(name, predicate) {
		      var sourceMethod = source[name]
		      event[name] = function(){
		        this[predicate] = returnTrue
		        return sourceMethod && sourceMethod.apply(source, arguments)
		      }
		      event[predicate] = returnFalse
		    })

		    event.timeStamp || (event.timeStamp = Date.now())

		    if (source.defaultPrevented !== undefined ? source.defaultPrevented :
		        'returnValue' in source ? source.returnValue === false :
		        source.getPreventDefault && source.getPreventDefault())
		      event.isDefaultPrevented = returnTrue
		  }
		  return event
		}

		function createProxy(event) {
		  var key, proxy = { originalEvent: event }
		  for (key in event)
		    if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

		  return compatible(proxy, event)
		}

		$SO.fn.on = function(event, selector, data, callback, one){
		  var autoRemove, delegator, $this = this
		  if (event && !isString(event)) {
		    $SO.each(event, function(type, fn){
		      $this.on(type, selector, data, fn, one)
		    })
		    return $this
		  }

		  if (!isString(selector) && !isFunction(callback) && callback !== false)
		    callback = data, data = selector, selector = undefined
		  if (callback === undefined || data === false)
		    callback = data, data = undefined

		  if (callback === false) callback = returnFalse

		  return $this.each(function(_, element){
		    if (one) autoRemove = function(e){
		      remove(element, e.type, callback)
		      return callback.apply(this, arguments)
		    }

		    if (selector) delegator = function(e){
		      var evt, match = $(e.target).closest(selector, element).get(0)
		      if (match && match !== element) {
		        evt = $SO.extend(createProxy(e), {currentTarget: match, liveFired: element})
		        return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
		      }
		    }

		    add(element, event, callback, data, selector, delegator || autoRemove)
		  })
		}
		$SO.fn.off = function(event, selector, callback){
		  var $this = this
		  if (event && !isString(event)) {
		    $SO.each(event, function(type, fn){
		      $this.off(type, selector, fn)
		    })
		    return $this
		  }

		  if (!isString(selector) && !isFunction(callback) && callback !== false)
		    callback = selector, selector = undefined

		  if (callback === false) callback = returnFalse

		  return $this.each(function(){
		    remove(this, event, callback, selector)
		  })
		}

		$SO.fn.trigger = function(event, args){
		  event = (isString(event) || $SO.isPlainObject(event)) ? $SO.Event(event) : compatible(event)
		  event._args = args
		  return this.each(function(){
		    // handle focus(), blur() by calling them directly
		    if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
		    // items in the collection might not be DOM elements
		    else if ('dispatchEvent' in this) this.dispatchEvent(event)
		    else $SO(this).triggerHandler(event, args)
		  })
		}

		// triggers event handlers on current element just as if an event occurred,
		// doesn't trigger an actual event, doesn't bubble
		$SO.fn.triggerHandler = function(event, args){
		  var e, result
		  this.each(function(i, element){
		    e = createProxy(isString(event) ? $SO.Event(event) : event)
		    e._args = args
		    e.target = element
		    $SO.each(findHandlers(element, event.type || event), function(i, handler){
		      result = handler.proxy(e)
		      if (e.isImmediatePropagationStopped()) return false
		    })
		  })
		  return result
		}

		// shortcut methods for `.bind(event, fn)` for each event type
		;('focusin focusout focus blur load resize scroll unload click dblclick '+
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
		'change select keydown keypress keyup error').split(' ').forEach(function(event) {
		  $SO.fn[event] = function(callback) {
		    return (0 in arguments) ?
		      this.bind(event, callback) :
		      this.trigger(event)
		  }
		})

		$SO.Event = function(type, props) {
		  if (!isString(type)) props = type, type = props.type
		  var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
		  if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
		  event.initEvent(type, bubbles, true)
		  return compatible(event)
		}

	})(Sociolla)
}))