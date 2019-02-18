/* Polyfill service v3.16.0
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 * 
 * UA detected: ie/11.0.0
 * Features requested: default
 * 
 * - Array.from, License: CC0 (required by "default")
 * - Array.of, License: MIT (required by "default")
 * - Array.prototype.fill, License: CC0 (required by "default")
 * - Event, License: CC0 (required by "default", "CustomEvent", "Promise")
 * - CustomEvent, License: CC0 (required by "default")
 * - _DOMTokenList, License: CC0 (required by "DOMTokenList", "default")
 * - DOMTokenList, License: CC0 (required by "default")
 * - _mutation, License: CC0 (required by "Element.prototype.after", "default", "Element.prototype.append", "Element.prototype.before", "Element.prototype.prepend", "Element.prototype.remove", "Element.prototype.replaceWith")
 * - Element.prototype.after, License: CC0 (required by "default")
 * - Element.prototype.append, License: CC0 (required by "default")
 * - Element.prototype.before, License: CC0 (required by "default")
 * - Element.prototype.matches, License: CC0 (required by "default", "Element.prototype.closest")
 * - Element.prototype.closest, License: CC0 (required by "default")
 * - Element.prototype.prepend, License: CC0 (required by "default")
 * - Element.prototype.remove, License: CC0 (required by "default")
 * - Element.prototype.replaceWith, License: CC0 (required by "default")
 * - Symbol, License: MIT (required by "Map", "default", "Set", "Symbol.iterator", "Symbol.species")
 * - Symbol.iterator, License: MIT (required by "Map", "default", "Set")
 * - Symbol.species, License: MIT (required by "Map", "default", "Set")
 * - Number.isNaN, License: MIT (required by "default", "Map", "Set")
 * - Map, License: CC0 (required by "default")
 * - Node.prototype.contains, License: CC0 (required by "default")
 * - Object.assign, License: CC0 (required by "default")
 * - Promise, License: MIT (required by "default")
 * - Set, License: CC0 (required by "default")
 * - String.prototype.endsWith, License: CC0 (required by "default")
 * - String.prototype.includes, License: CC0 (required by "default")
 * - String.prototype.startsWith, License: CC0 (required by "default")
 * - URL, License: CC0 (required by "default") */

(function(undefined) {

// Array.from

// Wrapped in IIFE to prevent leaking to global scope.
(function () {
	function parseIterable (arraylike) {
		var done = false;
		var iterableResponse;
		var tempArray = [];

		// if the iterable doesn't have next;
		// it is an iterable if 'next' is a function but it has not been defined on
		// the object itself.
		if (typeof arraylike.next === 'function') {
			while (!done) {
				iterableResponse = arraylike.next();
				if (
					iterableResponse.hasOwnProperty('value') &&
					iterableResponse.hasOwnProperty('done')
				) {
					if (iterableResponse.done === true) {
						done = true;
						break;

					// handle the case where the done value is not Boolean
					} else if (iterableResponse.done !== false) {
						break;
					}

					tempArray.push(iterableResponse.value);
				} else {

					// it does not conform to the iterable pattern
					break;
				}
			}
		}

		if (done) {
			return tempArray;
		} else {

			// something went wrong return false;
			return false;
		}

	}

	Object.defineProperty(Array, 'from', {
		configurable: true,
		value: function from(source) {
			// handle non-objects
			if (source === undefined || source === null) {
				throw new TypeError(source + ' is not an object');
			}

			// handle maps that are not functions
			if (1 in arguments && !(arguments[1] instanceof Function)) {
				throw new TypeError(arguments[1] + ' is not a function');
			}

			var arraylike = typeof source === 'string' ? source.split('') : Object(source);
			var map = arguments[1];
			var scope = arguments[2];
			var array = [];
			var index = -1;
			var length = Math.min(Math.max(Number(arraylike.length) || 0, 0), 9007199254740991);
			var value;

			// variables for rebuilding array from iterator
			var arrayFromIterable;

			// if it is an iterable treat like one
			arrayFromIterable = parseIterable(arraylike);

			//if it is a Map or a Set then handle them appropriately
			if (
				typeof arraylike.entries === 'function' &&
				typeof arraylike.values === 'function'
			) {
				if (arraylike.constructor.name === 'Set' && 'values' in Set.prototype) {
					arrayFromIterable = parseIterable(arraylike.values());
				}
				if (arraylike.constructor.name === 'Map' && 'entries' in Map.prototype) {
					arrayFromIterable = parseIterable(arraylike.entries());
				}
			}

			if (arrayFromIterable) {
				arraylike = arrayFromIterable;
				length = arrayFromIterable.length;
			}

			while (++index < length) {
					value = arraylike[index];

					array[index] = map ? map.call(scope, value, index) : value;
			}

			array.length = length;

			return array;
		},
		writable: true
	});
}());

// Array.of
/*! https://mths.be/array-of v0.1.0 by @mathias */
(function () {
	'use strict';
	var defineProperty = (function () {
		// IE 8 only supports `Object.defineProperty` on DOM elements
		try {
			var object = {};
			var $defineProperty = Object.defineProperty;
			var result = $defineProperty(object, object, object) && $defineProperty;
		} catch (error) { /**/ }
		return result;
	}());
	var isConstructor = function isConstructor(Constructor) {
		try {
			return !!new Constructor();
		} catch (_) {
			return false;
		}
	};
	var of = function of() {
		var items = arguments;
		var length = items.length;
		var Me = this;
		var result = isConstructor(Me) ? new Me(length) : new Array(length);
		var index = 0;
		var value;
		while (index < length) {
			value = items[index];
			if (defineProperty) {
				defineProperty(result, index, {
					'value': value,
					'writable': true,
					'enumerable': true,
					'configurable': true
				});
			} else {
				result[index] = value;
			}
			index += 1;
		}
		result.length = length;
		return result;
	};
	if (defineProperty) {
		defineProperty(Array, 'of', {
			'value': of,
			'configurable': true,
			'writable': true
		});
	} else {
		Array.of = of;
	}
}());

// Array.prototype.fill
Object.defineProperty(Array.prototype, 'fill', {
	configurable: true,
	value: function fill(value) {
		if (this === undefined || this === null) {
			throw new TypeError(this + ' is not an object');
		}

		var arrayLike = Object(this);

		var length = Math.max(Math.min(arrayLike.length, 9007199254740991), 0) || 0;

		var relativeStart = 1 in arguments ? parseInt(Number(arguments[1]), 10) || 0 : 0;

		relativeStart = relativeStart < 0 ? Math.max(length + relativeStart, 0) : Math.min(relativeStart, length);

		var relativeEnd = 2 in arguments && arguments[2] !== undefined ? parseInt(Number(arguments[2]), 10) || 0 : length;

		relativeEnd = relativeEnd < 0 ? Math.max(length + arguments[2], 0) : Math.min(relativeEnd, length);

		while (relativeStart < relativeEnd) {
			arrayLike[relativeStart] = value;

			++relativeStart;
		}

		return arrayLike;
	},
	writable: true
});

// Event
(function () {
	var unlistenableWindowEvents = {
		click: 1,
		dblclick: 1,
		keyup: 1,
		keypress: 1,
		keydown: 1,
		mousedown: 1,
		mouseup: 1,
		mousemove: 1,
		mouseover: 1,
		mouseenter: 1,
		mouseleave: 1,
		mouseout: 1,
		storage: 1,
		storagecommit: 1,
		textinput: 1
	};

	function indexOf(array, element) {
		var
		index = -1,
		length = array.length;

		while (++index < length) {
			if (index in array && array[index] === element) {
				return index;
			}
		}

		return -1;
	}

	var existingProto = (window.Event && window.Event.prototype) || null;
	window.Event = Window.prototype.Event = function Event(type, eventInitDict) {
		if (!type) {
			throw new Error('Not enough arguments');
		}

		// Shortcut if browser supports createEvent
		if ('createEvent' in document) {
			var event = document.createEvent('Event');
			var bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
			var cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

			event.initEvent(type, bubbles, cancelable);

			return event;
		}

		var event = document.createEventObject();

		event.type = type;
		event.bubbles = eventInitDict && eventInitDict.bubbles !== undefined ? eventInitDict.bubbles : false;
		event.cancelable = eventInitDict && eventInitDict.cancelable !== undefined ? eventInitDict.cancelable : false;

		return event;
	};
	if (existingProto) {
		Object.defineProperty(window.Event, 'prototype', {
			configurable: false,
			enumerable: false,
			writable: true,
			value: existingProto
		});
	}

	if (!('createEvent' in document)) {
		window.addEventListener = Window.prototype.addEventListener = Document.prototype.addEventListener = Element.prototype.addEventListener = function addEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1];

			if (element === window && type in unlistenableWindowEvents) {
				throw new Error('In IE8 the event: ' + type + ' is not available on the window object. Please see https://github.com/Financial-Times/polyfill-service/issues/317 for more information.');
			}

			if (!element._events) {
				element._events = {};
			}

			if (!element._events[type]) {
				element._events[type] = function (event) {
					var
					list = element._events[event.type].list,
					events = list.slice(),
					index = -1,
					length = events.length,
					eventElement;

					event.preventDefault = function preventDefault() {
						if (event.cancelable !== false) {
							event.returnValue = false;
						}
					};

					event.stopPropagation = function stopPropagation() {
						event.cancelBubble = true;
					};

					event.stopImmediatePropagation = function stopImmediatePropagation() {
						event.cancelBubble = true;
						event.cancelImmediate = true;
					};

					event.currentTarget = element;
					event.relatedTarget = event.fromElement || null;
					event.target = event.target || event.srcElement || element;
					event.timeStamp = new Date().getTime();

					if (event.clientX) {
						event.pageX = event.clientX + document.documentElement.scrollLeft;
						event.pageY = event.clientY + document.documentElement.scrollTop;
					}

					while (++index < length && !event.cancelImmediate) {
						if (index in events) {
							eventElement = events[index];

							if (indexOf(list, eventElement) !== -1 && typeof eventElement === 'function') {
								eventElement.call(element, event);
							}
						}
					}
				};

				element._events[type].list = [];

				if (element.attachEvent) {
					element.attachEvent('on' + type, element._events[type]);
				}
			}

			element._events[type].list.push(listener);
		};

		window.removeEventListener = Window.prototype.removeEventListener = Document.prototype.removeEventListener = Element.prototype.removeEventListener = function removeEventListener() {
			var
			element = this,
			type = arguments[0],
			listener = arguments[1],
			index;

			if (element._events && element._events[type] && element._events[type].list) {
				index = indexOf(element._events[type].list, listener);

				if (index !== -1) {
					element._events[type].list.splice(index, 1);

					if (!element._events[type].list.length) {
						if (element.detachEvent) {
							element.detachEvent('on' + type, element._events[type]);
						}
						delete element._events[type];
					}
				}
			}
		};

		window.dispatchEvent = Window.prototype.dispatchEvent = Document.prototype.dispatchEvent = Element.prototype.dispatchEvent = function dispatchEvent(event) {
			if (!arguments.length) {
				throw new Error('Not enough arguments');
			}

			if (!event || typeof event.type !== 'string') {
				throw new Error('DOM Events Exception 0');
			}

			var element = this, type = event.type;

			try {
				if (!event.bubbles) {
					event.cancelBubble = true;

					var cancelBubbleEvent = function (event) {
						event.cancelBubble = true;

						(element || window).detachEvent('on' + type, cancelBubbleEvent);
					};

					this.attachEvent('on' + type, cancelBubbleEvent);
				}

				this.fireEvent('on' + type, event);
			} catch (error) {
				event.target = element;

				do {
					event.currentTarget = element;

					if ('_events' in element && typeof element._events[type] === 'function') {
						element._events[type].call(element, event);
					}

					if (typeof element['on' + type] === 'function') {
						element['on' + type].call(element, event);
					}

					element = element.nodeType === 9 ? element.parentWindow : element.parentNode;
				} while (element && !event.cancelBubble);
			}

			return true;
		};

		// Add the DOMContentLoaded Event
		document.attachEvent('onreadystatechange', function() {
			if (document.readyState === 'complete') {
				document.dispatchEvent(new Event('DOMContentLoaded', {
					bubbles: true
				}));
			}
		});
	}
}());

// CustomEvent
this.CustomEvent = function CustomEvent(type, eventInitDict) {
	if (!type) {
		throw Error('TypeError: Failed to construct "CustomEvent": An event name must be provided.');
	}

	var event;
	eventInitDict = eventInitDict || {bubbles: false, cancelable: false, detail: null};

	if ('createEvent' in document) {
		try {
			event = document.createEvent('CustomEvent');
			event.initCustomEvent(type, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
		} catch (error) {
			// for browsers which don't support CustomEvent at all, we use a regular event instead
			event = document.createEvent('Event');
			event.initEvent(type, eventInitDict.bubbles, eventInitDict.cancelable);
			event.detail = eventInitDict.detail;
		}
	} else {

		// IE8
		event = new Event(type, eventInitDict);
		event.detail = eventInitDict && eventInitDict.detail || null;
	}
	return event;
};

CustomEvent.prototype = Event.prototype;

// _DOMTokenList
var _DOMTokenList = (function () { // eslint-disable-line no-unused-vars

	function tokenize(token) {
		if (/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/.test(token)) {
			return String(token);
		} else {
			throw new Error('InvalidCharacterError: DOM Exception 5');
		}
	}

	function toObject(self) {
		for (var index = -1, object = {}, element; element = self[++index];) {
			object[element] = true;
		}

		return object;
	}

	function fromObject(self, object) {
		var array = [], token;

		for (token in object) {
			if (object[token]) {
				array.push(token);
			}
		}

		[].splice.apply(self, [0, self.length].concat(array));
	}

	var DTL = function() {};

	DTL.prototype = {
		constructor: DTL,
		item: function item(index) {
			return this[parseFloat(index)] || null;
		},
		length: Array.prototype.length,
		toString: function toString() {
			return [].join.call(this, ' ');
		},

		add: function add() {
			for (var object = toObject(this), index = 0, token; index in arguments; ++index) {
				token = tokenize(arguments[index]);

				object[token] = true;
			}

			fromObject(this, object);
		},
		contains: function contains(token) {
			return token in toObject(this);
		},
		remove: function remove() {
			for (var object = toObject(this), index = 0, token; index in arguments; ++index) {
				token = tokenize(arguments[index]);

				object[token] = false;
			}

			fromObject(this, object);
		},
		toggle: function toggle(token) {
			var
			object = toObject(this),
			contains = 1 in arguments ? !arguments[1] : tokenize(token) in object;

			object[token] = !contains;

			fromObject(this, object);

			return !contains;
		}
	};

	return DTL;

}());

// DOMTokenList
(function (global) {
	var nativeImpl = "DOMTokenList" in global && global.DOMTokenList;

	if (!nativeImpl) {
		global.DOMTokenList = _DOMTokenList;
	} else {
		var NativeToggle = nativeImpl.prototype.toggle;

		nativeImpl.prototype.toggle = function toggle(token) {
			if (1 in arguments) {
				var contains = this.contains(token);
				var force = !!arguments[1];

				if ((contains && force) || (!contains && !force)) {
					return force;
				}
			}

			return NativeToggle.call(this, token);
		};

	}

}(this));

// _mutation
// http://dom.spec.whatwg.org/#mutation-method-macro
function _mutation(nodes) { // eslint-disable-line no-unused-vars
	if (!nodes.length) {
		throw new Error('DOM Exception 8');
	} else if (nodes.length === 1) {
		return typeof nodes[0] === 'string' ? document.createTextNode(nodes[0]) : nodes[0];
	} else {
		var
		fragment = document.createDocumentFragment(),
		length = nodes.length,
		index = -1,
		node;

		while (++index < length) {
			node = nodes[index];

			fragment.appendChild(typeof node === 'string' ? document.createTextNode(node) : node);
		}

		return fragment;
	}
}

// Element.prototype.after
Document.prototype.after = Element.prototype.after = function after() {
	if (this.parentNode) {
		this.parentNode.insertBefore(_mutation(arguments), this.nextSibling);
	}
};

// Not all UAs support the Text constructor.  Polyfill on the Text constructor only where it exists
// TODO: Add a polyfill for the Text constructor, and make it a dependency of this polyfill.
if ("Text" in this) {
	Text.prototype.after = Element.prototype.after;
}

// Element.prototype.append
Document.prototype.append = Element.prototype.append = function append() {
	this.appendChild(_mutation(arguments));
};

// Element.prototype.before
Document.prototype.before = Element.prototype.before = function before() {
	if (this.parentNode) {
		this.parentNode.insertBefore(_mutation(arguments), this);
	}
};

// Not all UAs support the Text constructor.  Polyfill on the Text constructor only where it exists
// TODO: Add a polyfill for the Text constructor, and make it a dependency of this polyfill.
if ("Text" in this) {
	Text.prototype.before = Element.prototype.before;
}

// Element.prototype.matches
Element.prototype.matches = Element.prototype.webkitMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.mozMatchesSelector || function matches(selector) {

	var element = this;
	var elements = (element.document || element.ownerDocument).querySelectorAll(selector);
	var index = 0;

	while (elements[index] && elements[index] !== element) {
		++index;
	}

	return !!elements[index];
};

// Element.prototype.closest
Element.prototype.closest = function closest(selector) {
	var node = this;

	while (node) {
		if (node.matches(selector)) return node;
		else node = node.parentElement;
	}

	return null;
};

// Element.prototype.prepend
Document.prototype.prepend = Element.prototype.prepend = function prepend() {
	this.insertBefore(_mutation(arguments), this.firstChild);
};

// Element.prototype.remove
Document.prototype.remove = Element.prototype.remove = function remove() {
	if (this.parentNode) {
		this.parentNode.removeChild(this);
	}
};

// Not all UAs support the Text constructor.  Polyfill on the Text constructor only where it exists
// TODO: Add a polyfill for the Text constructor, and make it a dependency of this polyfill.
if ("Text" in this) {
	Text.prototype.remove = Element.prototype.remove;
}

// Element.prototype.replaceWith
Document.prototype.replaceWith = Element.prototype.replaceWith = function replaceWith() {
	if (this.parentNode) {
		this.parentNode.replaceChild(_mutation(arguments), this);
	}
};

// Not all UAs support the Text constructor.  Polyfill on the Text constructor only where it exists
// TODO: Add a polyfill for the Text constructor, and make it a dependency of this polyfill.
if ('Text' in this) {
	Text.prototype.replaceWith = Element.prototype.replaceWith;
}

// Symbol
// A modification of https://github.com/WebReflection/get-own-property-symbols
// (C) Andrea Giammarchi - MIT Licensed

(function (Object, GOPS, global) {

	var	setDescriptor;
	var id = 0;
	var random = '' + Math.random();
	var prefix = '__\x01symbol:';
	var prefixLength = prefix.length;
	var internalSymbol = '__\x01symbol@@' + random;
	var DP = 'defineProperty';
	var DPies = 'defineProperties';
	var GOPN = 'getOwnPropertyNames';
	var GOPD = 'getOwnPropertyDescriptor';
	var PIE = 'propertyIsEnumerable';
	var ObjectProto = Object.prototype;
	var hOP = ObjectProto.hasOwnProperty;
	var pIE = ObjectProto[PIE];
	var toString = ObjectProto.toString;
	var concat = Array.prototype.concat;
	var cachedWindowNames = typeof window === 'object' ? Object.getOwnPropertyNames(window) : [];
	var nGOPN = Object[GOPN];
	var gOPN = function getOwnPropertyNames (obj) {
		if (toString.call(obj) === '[object Window]') {
			try {
				return nGOPN(obj);
			} catch (e) {
				// IE bug where layout engine calls userland gOPN for cross-domain `window` objects
				return concat.call([], cachedWindowNames);
			}
		}
		return nGOPN(obj);
	};
	var gOPD = Object[GOPD];
	var create = Object.create;
	var keys = Object.keys;
	var freeze = Object.freeze || Object;
	var defineProperty = Object[DP];
	var $defineProperties = Object[DPies];
	var descriptor = gOPD(Object, GOPN);
	var addInternalIfNeeded = function (o, uid, enumerable) {
		if (!hOP.call(o, internalSymbol)) {
			try {
				defineProperty(o, internalSymbol, {
					enumerable: false,
					configurable: false,
					writable: false,
					value: {}
				});
			} catch (e) {
				o.internalSymbol = {};
			}
		}
		o[internalSymbol]['@@' + uid] = enumerable;
	};
	var createWithSymbols = function (proto, descriptors) {
		var self = create(proto);
		gOPN(descriptors).forEach(function (key) {
			if (propertyIsEnumerable.call(descriptors, key)) {
				$defineProperty(self, key, descriptors[key]);
			}
		});
		return self;
	};
	var copyAsNonEnumerable = function (descriptor) {
		var newDescriptor = create(descriptor);
		newDescriptor.enumerable = false;
		return newDescriptor;
	};
	var get = function get(){};
	var onlyNonSymbols = function (name) {
		return name != internalSymbol &&
			!hOP.call(source, name);
	};
	var onlySymbols = function (name) {
		return name != internalSymbol &&
			hOP.call(source, name);
	};
	var propertyIsEnumerable = function propertyIsEnumerable(key) {
		var uid = '' + key;
		return onlySymbols(uid) ? (
			hOP.call(this, uid) &&
			this[internalSymbol]['@@' + uid]
		) : pIE.call(this, key);
	};
	var setAndGetSymbol = function (uid) {
		var descriptor = {
			enumerable: false,
			configurable: true,
			get: get,
			set: function (value) {
			setDescriptor(this, uid, {
				enumerable: false,
				configurable: true,
				writable: true,
				value: value
			});
			addInternalIfNeeded(this, uid, true);
			}
		};
		try {
			defineProperty(ObjectProto, uid, descriptor);
		} catch (e) {
			ObjectProto[uid] = descriptor.value;
		}
		return freeze(source[uid] = defineProperty(
			Object(uid),
			'constructor',
			sourceConstructor
		));
	};
	var Symbol = function Symbol(description) {
		if (this instanceof Symbol) {
			throw new TypeError('Symbol is not a constructor');
		}
		return setAndGetSymbol(
			prefix.concat(description || '', random, ++id)
		);
		};
	var source = create(null);
	var sourceConstructor = {value: Symbol};
	var sourceMap = function (uid) {
		return source[uid];
		};
	var $defineProperty = function defineProp(o, key, descriptor) {
		var uid = '' + key;
		if (onlySymbols(uid)) {
			setDescriptor(o, uid, descriptor.enumerable ?
				copyAsNonEnumerable(descriptor) : descriptor);
			addInternalIfNeeded(o, uid, !!descriptor.enumerable);
		} else {
			defineProperty(o, key, descriptor);
		}
		return o;
		};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
		return gOPN(o).filter(onlySymbols).map(sourceMap);
		}
	;

	descriptor.value = $defineProperty;
	defineProperty(Object, DP, descriptor);

	descriptor.value = $getOwnPropertySymbols;
	defineProperty(Object, GOPS, descriptor);

	descriptor.value = function getOwnPropertyNames(o) {
		return gOPN(o).filter(onlyNonSymbols);
	};
	defineProperty(Object, GOPN, descriptor);

	descriptor.value = function defineProperties(o, descriptors) {
		var symbols = $getOwnPropertySymbols(descriptors);
		if (symbols.length) {
		keys(descriptors).concat(symbols).forEach(function (uid) {
			if (propertyIsEnumerable.call(descriptors, uid)) {
			$defineProperty(o, uid, descriptors[uid]);
			}
		});
		} else {
		$defineProperties(o, descriptors);
		}
		return o;
	};
	defineProperty(Object, DPies, descriptor);

	descriptor.value = propertyIsEnumerable;
	defineProperty(ObjectProto, PIE, descriptor);

	descriptor.value = Symbol;
	defineProperty(global, 'Symbol', descriptor);

	// defining `Symbol.for(key)`
	descriptor.value = function (key) {
		var uid = prefix.concat(prefix, key, random);
		return uid in ObjectProto ? source[uid] : setAndGetSymbol(uid);
	};
	defineProperty(Symbol, 'for', descriptor);

	// defining `Symbol.keyFor(symbol)`
	descriptor.value = function (symbol) {
		if (onlyNonSymbols(symbol))
		throw new TypeError(symbol + ' is not a symbol');
		return hOP.call(source, symbol) ?
		symbol.slice(prefixLength * 2, -random.length) :
		void 0
		;
	};
	defineProperty(Symbol, 'keyFor', descriptor);

	descriptor.value = function getOwnPropertyDescriptor(o, key) {
		var descriptor = gOPD(o, key);
		if (descriptor && onlySymbols(key)) {
		descriptor.enumerable = propertyIsEnumerable.call(o, key);
		}
		return descriptor;
	};
	defineProperty(Object, GOPD, descriptor);

	descriptor.value = function (proto, descriptors) {
		return arguments.length === 1 || typeof descriptors === "undefined" ?
		create(proto) :
		createWithSymbols(proto, descriptors);
	};
	defineProperty(Object, 'create', descriptor);

	descriptor.value = function () {
		var str = toString.call(this);
		return (str === '[object String]' && onlySymbols(this)) ? '[object Symbol]' : str;
	};
	defineProperty(ObjectProto, 'toString', descriptor);


	setDescriptor = function (o, key, descriptor) {
		var protoDescriptor = gOPD(ObjectProto, key);
		delete ObjectProto[key];
		defineProperty(o, key, descriptor);
		defineProperty(ObjectProto, key, protoDescriptor);
	};

}(Object, 'getOwnPropertySymbols', this));

// Symbol.iterator
Object.defineProperty(Symbol, 'iterator', {value: Symbol('iterator')});

// Symbol.species
Object.defineProperty(Symbol, 'species', {value: Symbol('species')});

// Number.isNaN
Number.isNaN = Number.isNaN || function(value) {
    return typeof value === "number" && isNaN(value);
};

// Map
(function(global) {


	// Deleted map items mess with iterator pointers, so rather than removing them mark them as deleted. Can't use undefined or null since those both valid keys so use a private symbol.
	var undefMarker = Symbol('undef');

	// NaN cannot be found in an array using indexOf, so we encode NaNs using a private symbol.
	var NaNMarker = Symbol('NaN');

	function encodeKey(key) {
		return Number.isNaN(key) ? NaNMarker : key;
	}
	function decodeKey(encodedKey) {
		return (encodedKey === NaNMarker) ? NaN : encodedKey;
	}

	function makeIterator(mapInst, getter) {
		var nextIdx = 0;
		var done = false;
		return {
			next: function() {
				if (nextIdx === mapInst._keys.length) done = true;
				if (!done) {
					while (mapInst._keys[nextIdx] === undefMarker) nextIdx++;
					return {value: getter.call(mapInst, nextIdx++), done: false};
				} else {
					return {value: void 0, done:true};
				}
			}
		};
	}

	function calcSize(mapInst) {
		var size = 0;
		for (var i=0, s=mapInst._keys.length; i<s; i++) {
			if (mapInst._keys[i] !== undefMarker) size++;
		}
		return size;
	}

	var ACCESSOR_SUPPORT = true;

	var Map = function(data) {
		this._keys = [];
		this._values = [];

		// If `data` is iterable (indicated by presence of a forEach method), pre-populate the map
		data && (typeof data.forEach === 'function') && data.forEach(function (item) {
			this.set.apply(this, item);
		}, this);

		if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
	};
	Map.prototype = {};

	// Some old engines do not support ES5 getters/setters.  Since Map only requires these for the size property, we can fall back to setting the size property statically each time the size of the map changes.
	try {
		Object.defineProperty(Map.prototype, 'size', {
			get: function() {
				return calcSize(this);
			}
		});
	} catch(e) {
		ACCESSOR_SUPPORT = false;
	}

	Map.prototype['get'] = function(key) {
		var idx = this._keys.indexOf(encodeKey(key));
		return (idx !== -1) ? this._values[idx] : undefined;
	};
	Map.prototype['set'] = function(key, value) {
		var idx = this._keys.indexOf(encodeKey(key));
		if (idx !== -1) {
			this._values[idx] = value;
		} else {
			this._keys.push(encodeKey(key));
			this._values.push(value);
			if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
		}
		return this;
	};
	Map.prototype['has'] = function(key) {
		return (this._keys.indexOf(encodeKey(key)) !== -1);
	};
	Map.prototype['delete'] = function(key) {
		var idx = this._keys.indexOf(encodeKey(key));
		if (idx === -1) return false;
		this._keys[idx] = undefMarker;
		this._values[idx] = undefMarker;
		if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
		return true;
	};
	Map.prototype['clear'] = function() {
		this._keys = this._values = [];
		if (!ACCESSOR_SUPPORT) this.size = 0;
	};
	Map.prototype['values'] = function() {
		return makeIterator(this, function(i) { return this._values[i]; });
	};
	Map.prototype['keys'] = function() {
		return makeIterator(this, function(i) { return decodeKey(this._keys[i]); });
	};
	Map.prototype['entries'] =
	Map.prototype[Symbol.iterator] = function() {
		return makeIterator(this, function(i) { return [decodeKey(this._keys[i]), this._values[i]]; });
	};
	Map.prototype['forEach'] = function(callbackFn, thisArg) {
		thisArg = thisArg || global;
		var iterator = this.entries();
		var result = iterator.next();
		while (result.done === false) {
			callbackFn.call(thisArg, result.value[1], result.value[0], this);
			result = iterator.next();
		}
	};
	Map.prototype['constructor'] =
	Map.prototype[Symbol.species] = Map;

	Map.length = 0;

	// Export the object
	this.Map = Map;

}(this));

// Node.prototype.contains
(function() {

	function contains(node) {
		if (!(0 in arguments)) {
			throw new TypeError('1 argument is required');
		}

		do {
			if (this === node) {
				return true;
			}
		} while (node = node && node.parentNode);

		return false;
	}

	// IE
	if ('HTMLElement' in this && 'contains' in HTMLElement.prototype) {
		try {
			delete HTMLElement.prototype.contains;
		} catch (e) {}
	}

	if ('Node' in this) {
		Node.prototype.contains = contains;
	} else {
		document.contains = Element.prototype.contains = contains;
	}

}());

// Object.assign
Object.assign = function assign(target, source) { // eslint-disable-line no-unused-vars
	for (var index = 1, key, src; index < arguments.length; ++index) {
		src = arguments[index];

		for (key in src) {
			if (Object.prototype.hasOwnProperty.call(src, key)) {
				target[key] = src[key];
			}
		}
	}

	return target;
};

// Promise
!function(n){function t(e){if(r[e])return r[e].exports;var o=r[e]={exports:{},id:e,loaded:!1};return n[e].call(o.exports,o,o.exports,t),o.loaded=!0,o.exports}var r={};return t.m=n,t.c=r,t.p="",t(0)}({0:/*!***********************!*\
  !*** ./src/global.js ***!
  \***********************/
function(n,t,r){(function(n){var t=r(/*! ./yaku */84);try{n.Promise=t,window.Promise=t}catch(e){}}).call(t,function(){return this}())},84:/*!*********************!*\
  !*** ./src/yaku.js ***!
  \*********************/
function(n,t){(function(t){!function(){"use strict";function r(){return en[$][z]||B}function e(n,t){for(var r in t)n.prototype[r]=t[r];return n}function o(n){return n&&"object"==typeof n}function i(n){return"function"==typeof n}function u(n,t){return n instanceof t}function c(n){return u(n,L)}function f(n,t,r){if(!t(n))throw v(r)}function a(){try{return S.apply(F,arguments)}catch(n){return nn.e=n,nn}}function s(n,t){return S=n,F=t,a}function l(n,t){function r(){for(var r=0;r<o;)t(e[r],e[r+1]),e[r++]=R,e[r++]=R;o=0,e.length>n&&(e.length=n)}var e=I(n),o=0;return function(n,t){e[o++]=n,e[o++]=t,2===o&&en.nextTick(r)}}function h(n,t){var r,e,o,c,f=0;if(!n)throw v(N);var a=n[en[$][q]];if(i(a))e=a.call(n);else{if(!i(n.next)){if(u(n,I)){for(r=n.length;f<r;)t(n[f],f++);return f}throw v(N)}e=n}for(;!(o=e.next()).done;)if(c=s(t)(o.value,f++),c===nn)throw i(e[D])&&e[D](),c.e;return f}function v(n){return new TypeError(n)}function _(n){return(n?"":Q)+(new L).stack}function p(n,t){var r="on"+n.toLowerCase(),e=Y[r];H&&H.listeners(n).length?n===Z?H.emit(n,t._v,t):H.emit(n,t):e?e({reason:t._v,promise:t}):en[n](t._v,t)}function d(n){return n&&n._Yaku}function w(n){if(d(n))return new n(tn);var t,r,e;return t=new n(function(n,o){if(t)throw v();r=n,e=o}),f(r,i),f(e,i),t}function m(n,t){return function(r){E&&(n[K]=_(!0)),t===O?C(n,r):g(n,t,r)}}function k(n,t,r,e){return i(r)&&(t._onFulfilled=r),i(e)&&(n[G]&&p(X,n),t._onRejected=e),E&&(t._pre=n),n[n._pCount++]=t,n._s!==U&&on(n,t),t}function y(n){if(n._umark)return!0;n._umark=!0;for(var t,r=0,e=n._pCount;r<e;)if(t=n[r++],t._onRejected||y(t))return!0}function j(n,t){function r(n){return e.push(n.replace(/^\s+|\s+$/g,""))}var e=[];return E&&(t[K]&&r(t[K]),function o(n){n&&J in n&&(o(n._next),r(n[J]+""),o(n._pre))}(t)),n.stack+("\n"+e.join("\n")).replace(rn,"")}function x(n,t){return n(t)}function g(n,t,r){var e=0,o=n._pCount;if(n._s===U)for(n._s=t,n._v=r,t===A&&(E&&c(r)&&(r.longStack=j(r,n)),un(n));e<o;)on(n,n[e++]);return n}function C(n,t){if(t===n&&t)return g(n,A,v(V)),n;if(t!==P&&(i(t)||o(t))){var r=s(T)(t);if(r===nn)return g(n,A,r.e),n;i(r)?(E&&d(t)&&(n._next=t),d(t)?b(n,t,r):en.nextTick(function(){b(n,t,r)})):g(n,O,t)}else g(n,O,t);return n}function T(n){return n.then}function b(n,t,r){var e=s(r,t)(function(r){t&&(t=P,C(n,r))},function(r){t&&(t=P,g(n,A,r))});e===nn&&t&&(g(n,A,e.e),t=P)}var R,S,F,P=null,Y="object"==typeof window?window:t,E=!1,H=Y.process,I=Array,L=Error,A=0,O=1,U=2,$="Symbol",q="iterator",z="species",B=$+"("+z+")",D="return",G="_uh",J="_pt",K="_st",M="Invalid this",N="Invalid argument",Q="\nFrom previous ",V="Chaining cycle detected for promise",W="Uncaught (in promise)",X="rejectionHandled",Z="unhandledRejection",nn={e:P},tn=function(){},rn=/^.+\/node_modules\/yaku\/.+\n?/gm,en=n.exports=function(n){var t,r=this;if(!o(r)||r._s!==R)throw v(M);if(r._s=U,E&&(r[J]=_()),n!==tn){if(!i(n))throw v(N);t=s(n)(m(r,O),m(r,A)),t===nn&&g(r,A,t.e)}};en["default"]=en,e(en,{then:function(n,t){if(void 0===this._s)throw v();return k(this,w(en.speciesConstructor(this,en)),n,t)},"catch":function(n){return this.then(R,n)},_pCount:0,_pre:P,_Yaku:1}),en.resolve=function(n){return d(n)?n:C(w(this),n)},en.reject=function(n){return g(w(this),A,n)},en.race=function(n){var t=this,r=w(t),e=function(n){g(r,O,n)},o=function(n){g(r,A,n)},i=s(h)(n,function(n){t.resolve(n).then(e,o)});return i===nn?t.reject(i.e):r},en.all=function(n){function t(n){g(o,A,n)}var r,e=this,o=w(e),i=[];return r=s(h)(n,function(n,u){e.resolve(n).then(function(n){i[u]=n,--r||g(o,O,i)},t)}),r===nn?e.reject(r.e):(r||g(o,O,[]),o)},en.Symbol=Y[$]||{},s(function(){Object.defineProperty(en,r(),{get:function(){return this}})})(),en.speciesConstructor=function(n,t){var e=n.constructor;return e?e[r()]||t:t},en.unhandledRejection=function(n,t){try{Y.console.error(W,E?t.longStack:j(n,t))}catch(r){}},en.rejectionHandled=tn,en.enableLongStackTrace=function(){E=!0},en.nextTick=H?H.nextTick:function(n){setTimeout(n)},en._Yaku=1;var on=l(999,function(n,t){var r,e;return e=n._s?t._onFulfilled:t._onRejected,e===R?void g(t,n._s,n._v):(r=s(x)(e,n._v),r===nn?void g(t,A,r.e):void C(t,r))}),un=l(9,function(n){y(n)||(n[G]=1,p(Z,n))})}()}).call(t,function(){return this}())}});
// Set
(function(global) {


	// Deleted map items mess with iterator pointers, so rather than removing them mark them as deleted. Can't use undefined or null since those both valid keys so use a private symbol.
	var undefMarker = Symbol('undef');

	// NaN cannot be found in an array using indexOf, so we encode NaNs using a private symbol.
	var NaNMarker = Symbol('NaN');

	function encodeVal(data) {
		return Number.isNaN(data) ? NaNMarker : data;
	}
	function decodeVal(encodedData) {
		return (encodedData === NaNMarker) ? NaN : encodedData;
	}

	function makeIterator(setInst, getter) {
		var nextIdx = 0;
		return {
			next: function() {
				while (setInst._values[nextIdx] === undefMarker) nextIdx++;
				if (nextIdx === setInst._values.length) {
					return {value: void 0, done: true};
				}
				else {
					return {value: getter.call(setInst, nextIdx++), done: false};
				}
			}
		};
	}

	function calcSize(setInst) {
		var size = 0;
		for (var i=0, s=setInst._values.length; i<s; i++) {
			if (setInst._values[i] !== undefMarker) size++;
		}
		return size;
	}

	var ACCESSOR_SUPPORT = true;

	var Set = function(data) {
		this._values = [];

		// If `data` is iterable (indicated by presence of a forEach method), pre-populate the set
		data && (typeof data.forEach === 'function') && data.forEach(function (item) {
			this.add.call(this, item);
		}, this);

		if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
	};

	// Some old engines do not support ES5 getters/setters.  Since Set only requires these for the size property, we can fall back to setting the size property statically each time the size of the set changes.
	try {
		Object.defineProperty(Set.prototype, 'size', {
			get: function() {
				return calcSize(this);
			}
		});
	} catch(e) {
		ACCESSOR_SUPPORT = false;
	}

	Set.prototype['add'] = function(value) {
		value = encodeVal(value);
		if (this._values.indexOf(value) === -1) {
			this._values.push(value);
			if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
		}
		return this;
	};
	Set.prototype['has'] = function(value) {
		return (this._values.indexOf(encodeVal(value)) !== -1);
	};
	Set.prototype['delete'] = function(value) {
		var idx = this._values.indexOf(encodeVal(value));
		if (idx === -1) return false;
		this._values[idx] = undefMarker;
		if (!ACCESSOR_SUPPORT) this.size = calcSize(this);
		return true;
	};
	Set.prototype['clear'] = function() {
		this._values = [];
		if (!ACCESSOR_SUPPORT) this.size = 0;
	};
	Set.prototype['values'] =
	Set.prototype['keys'] = function() {
		return makeIterator(this, function(i) { return decodeVal(this._values[i]); });
	};
	Set.prototype['entries'] =
	Set.prototype[Symbol.iterator] = function() {
		return makeIterator(this, function(i) { return [decodeVal(this._values[i]), decodeVal(this._values[i])]; });
	};
	Set.prototype['forEach'] = function(callbackFn, thisArg) {
		thisArg = thisArg || global;
		var iterator = this.entries();
		var result = iterator.next();
		while (result.done === false) {
			callbackFn.call(thisArg, result.value[1], result.value[0], this);
			result = iterator.next();
		}
	};
	Set.prototype['constructor'] =
	Set.prototype[Symbol.species] = Set;

	Set.length = 0;

	// Export the object
	this.Set = Set;

}(this));

// String.prototype.endsWith
String.prototype.endsWith = function (string) {
	var index = arguments.length < 2 ? this.length : arguments[1];
	var foundIndex = this.lastIndexOf(string);
	return foundIndex !== -1 && foundIndex === index - string.length;
};

// String.prototype.includes
String.prototype.includes = function (string, index) {
	if (typeof string === 'object' && string instanceof RegExp) throw new TypeError("First argument to String.prototype.includes must not be a regular expression");
	return this.indexOf(string, index) !== -1;
};

// String.prototype.startsWith
String.prototype.startsWith = function (string) {
	var index = arguments.length < 2 ? 0 : arguments[1];

	return this.slice(index).indexOf(string) === 0;
};

// URL
// URL Polyfill
// Draft specification: https://url.spec.whatwg.org

// Notes:
// - Primarily useful for parsing URLs and modifying query parameters
// - Should work in IE8+ and everything more modern

(function (global) {
  'use strict';

  // Browsers may have:
  // * No global URL object
  // * URL with static methods only - may have a dummy constructor
  // * URL with members except searchParams
  // * Full URL API support
  var origURL = global.URL;
  var nativeURL;
  try {
    if (origURL) {
      nativeURL = new global.URL('http://example.com');
      if ('searchParams' in nativeURL)
        return;
      if (!('href' in nativeURL))
        nativeURL = undefined;
    }
  } catch (_) {}

  // NOTE: Doesn't do the encoding/decoding dance
  function urlencoded_serialize(pairs) {
    var output = '', first = true;
    pairs.forEach(function (pair) {
      var name = encodeURIComponent(pair.name);
      var value = encodeURIComponent(pair.value);
      if (!first) output += '&';
      output += name + '=' + value;
      first = false;
    });
    return output.replace(/%20/g, '+');
  }

  // NOTE: Doesn't do the encoding/decoding dance
  function urlencoded_parse(input, isindex) {
    var sequences = input.split('&');
    if (isindex && sequences[0].indexOf('=') === -1)
      sequences[0] = '=' + sequences[0];
    var pairs = [];
    sequences.forEach(function (bytes) {
      if (bytes.length === 0) return;
      var index = bytes.indexOf('=');
      if (index !== -1) {
        var name = bytes.substring(0, index);
        var value = bytes.substring(index + 1);
      } else {
        name = bytes;
        value = '';
      }
      name = name.replace(/\+/g, ' ');
      value = value.replace(/\+/g, ' ');
      pairs.push({ name: name, value: value });
    });
    var output = [];
    pairs.forEach(function (pair) {
      output.push({
        name: decodeURIComponent(pair.name),
        value: decodeURIComponent(pair.value)
      });
    });
    return output;
  }


  function URLUtils(url) {
    if (nativeURL)
      return new origURL(url);
    var anchor = document.createElement('a');
    anchor.href = url;
    return anchor;
  }

  function URLSearchParams(init) {
    var $this = this;
    this._list = [];

    if (init === undefined || init === null)
      init = '';

    if (Object(init) !== init || !(init instanceof URLSearchParams))
      init = String(init);

    if (typeof init === 'string' && init.substring(0, 1) === '?')
      init = init.substring(1);

    if (typeof init === 'string')
      this._list = urlencoded_parse(init);
    else
      this._list = init._list.slice();

    this._url_object = null;
    this._setList = function (list) { if (!updating) $this._list = list; };

    var updating = false;
    this._update_steps = function() {
      if (updating) return;
      updating = true;

      if (!$this._url_object) return;

      // Partial workaround for IE issue with 'about:'
      if ($this._url_object.protocol === 'about:' &&
          $this._url_object.pathname.indexOf('?') !== -1) {
          $this._url_object.pathname = $this._url_object.pathname.split('?')[0];
      }

      $this._url_object.search = urlencoded_serialize($this._list);

      updating = false;
    };
  }


  Object.defineProperties(URLSearchParams.prototype, {
    append: {
      value: function (name, value) {
        this._list.push({ name: name, value: value });
        this._update_steps();
      }, writable: true, enumerable: true, configurable: true
    },

    'delete': {
      value: function (name) {
        for (var i = 0; i < this._list.length;) {
          if (this._list[i].name === name)
            this._list.splice(i, 1);
          else
            ++i;
        }
        this._update_steps();
      }, writable: true, enumerable: true, configurable: true
    },

    get: {
      value: function (name) {
        for (var i = 0; i < this._list.length; ++i) {
          if (this._list[i].name === name)
            return this._list[i].value;
        }
        return null;
      }, writable: true, enumerable: true, configurable: true
    },

    getAll: {
      value: function (name) {
        var result = [];
        for (var i = 0; i < this._list.length; ++i) {
          if (this._list[i].name === name)
            result.push(this._list[i].value);
        }
        return result;
      }, writable: true, enumerable: true, configurable: true
    },

    has: {
      value: function (name) {
        for (var i = 0; i < this._list.length; ++i) {
          if (this._list[i].name === name)
            return true;
        }
        return false;
      }, writable: true, enumerable: true, configurable: true
    },

    set: {
      value: function (name, value) {
        var found = false;
        for (var i = 0; i < this._list.length;) {
          if (this._list[i].name === name) {
            if (!found) {
              this._list[i].value = value;
              found = true;
              ++i;
            } else {
              this._list.splice(i, 1);
            }
          } else {
            ++i;
          }
        }

        if (!found)
          this._list.push({ name: name, value: value });

        this._update_steps();
      }, writable: true, enumerable: true, configurable: true
    },

    entries: {
      value: function() {
        var $this = this, index = 0;
        return { next: function() {
          if (index >= $this._list.length)
            return {done: true, value: undefined};
          var pair = $this._list[index++];
          return {done: false, value: [pair.name, pair.value]};
        }};
      }, writable: true, enumerable: true, configurable: true
    },

    keys: {
      value: function() {
        var $this = this, index = 0;
        return { next: function() {
          if (index >= $this._list.length)
            return {done: true, value: undefined};
          var pair = $this._list[index++];
          return {done: false, value: pair.name};
        }};
      }, writable: true, enumerable: true, configurable: true
    },

    values: {
      value: function() {
        var $this = this, index = 0;
        return { next: function() {
          if (index >= $this._list.length)
            return {done: true, value: undefined};
          var pair = $this._list[index++];
          return {done: false, value: pair.value};
        }};
      }, writable: true, enumerable: true, configurable: true
    },

    forEach: {
      value: function(callback) {
        var thisArg = (arguments.length > 1) ? arguments[1] : undefined;
        this._list.forEach(function(pair, index) {
          callback.call(thisArg, pair.name, pair.value);
        });

      }, writable: true, enumerable: true, configurable: true
    },

    toString: {
      value: function () {
        return urlencoded_serialize(this._list);
      }, writable: true, enumerable: false, configurable: true
    }
  });

  if ('Symbol' in global && 'iterator' in global.Symbol) {
    Object.defineProperty(URLSearchParams.prototype, global.Symbol.iterator, {
      value: URLSearchParams.prototype.entries,
      writable: true, enumerable: true, configurable: true});
  }

  function URL(url, base) {
    if (!(this instanceof global.URL))
      throw new TypeError("Failed to construct 'URL': Please use the 'new' operator.");

    if (base) {
      url = (function () {
        if (nativeURL) return new origURL(url, base).href;

        var doc;
        // Use another document/base tag/anchor for relative URL resolution, if possible
        if (document.implementation && document.implementation.createHTMLDocument) {
          doc = document.implementation.createHTMLDocument('');
        } else if (document.implementation && document.implementation.createDocument) {
          doc = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
          doc.documentElement.appendChild(doc.createElement('head'));
          doc.documentElement.appendChild(doc.createElement('body'));
        } else if (window.ActiveXObject) {
          doc = new window.ActiveXObject('htmlfile');
          doc.write('<head><\/head><body><\/body>');
          doc.close();
        }

        if (!doc) throw Error('base not supported');

        var baseTag = doc.createElement('base');
        baseTag.href = base;
        doc.getElementsByTagName('head')[0].appendChild(baseTag);
        var anchor = doc.createElement('a');
        anchor.href = url;
        return anchor.href;
      }());
    }

    // An inner object implementing URLUtils (either a native URL
    // object or an HTMLAnchorElement instance) is used to perform the
    // URL algorithms. With full ES5 getter/setter support, return a
    // regular object For IE8's limited getter/setter support, a
    // different HTMLAnchorElement is returned with properties
    // overridden

    var instance = URLUtils(url || '');

    // Detect for ES5 getter/setter support
    // (an Object.defineProperties polyfill that doesn't support getters/setters may throw)
    var ES5_GET_SET = (function() {
      if (!('defineProperties' in Object)) return false;
      try {
        var obj = {};
        Object.defineProperties(obj, { prop: { 'get': function () { return true; } } });
        return obj.prop;
      } catch (_) {
        return false;
      }
    })();

    var self = ES5_GET_SET ? this : document.createElement('a');



    var query_object = new URLSearchParams(
      instance.search ? instance.search.substring(1) : null);
    query_object._url_object = self;

    Object.defineProperties(self, {
      href: {
        get: function () { return instance.href; },
        set: function (v) { instance.href = v; tidy_instance(); update_steps(); },
        enumerable: true, configurable: true
      },
      origin: {
        get: function () {
          if ('origin' in instance) return instance.origin;
          return this.protocol + '//' + this.host;
        },
        enumerable: true, configurable: true
      },
      protocol: {
        get: function () { return instance.protocol; },
        set: function (v) { instance.protocol = v; },
        enumerable: true, configurable: true
      },
      username: {
        get: function () { return instance.username; },
        set: function (v) { instance.username = v; },
        enumerable: true, configurable: true
      },
      password: {
        get: function () { return instance.password; },
        set: function (v) { instance.password = v; },
        enumerable: true, configurable: true
      },
      host: {
        get: function () {
          // IE returns default port in |host|
          var re = {'http:': /:80$/, 'https:': /:443$/, 'ftp:': /:21$/}[instance.protocol];
          return re ? instance.host.replace(re, '') : instance.host;
        },
        set: function (v) { instance.host = v; },
        enumerable: true, configurable: true
      },
      hostname: {
        get: function () { return instance.hostname; },
        set: function (v) { instance.hostname = v; },
        enumerable: true, configurable: true
      },
      port: {
        get: function () { return instance.port; },
        set: function (v) { instance.port = v; },
        enumerable: true, configurable: true
      },
      pathname: {
        get: function () {
          // IE does not include leading '/' in |pathname|
          if (instance.pathname.charAt(0) !== '/') return '/' + instance.pathname;
          return instance.pathname;
        },
        set: function (v) { instance.pathname = v; },
        enumerable: true, configurable: true
      },
      search: {
        get: function () { return instance.search; },
        set: function (v) {
          if (instance.search === v) return;
          instance.search = v; tidy_instance(); update_steps();
        },
        enumerable: true, configurable: true
      },
      searchParams: {
        get: function () { return query_object; },
        enumerable: true, configurable: true
      },
      hash: {
        get: function () { return instance.hash; },
        set: function (v) { instance.hash = v; tidy_instance(); },
        enumerable: true, configurable: true
      },
      toString: {
        value: function() { return instance.toString(); },
        enumerable: false, configurable: true
      },
      valueOf: {
        value: function() { return instance.valueOf(); },
        enumerable: false, configurable: true
      }
    });

    function tidy_instance() {
      var href = instance.href.replace(/#$|\?$|\?(?=#)/g, '');
      if (instance.href !== href)
        instance.href = href;
    }

    function update_steps() {
      query_object._setList(instance.search ? urlencoded_parse(instance.search.substring(1)) : []);
      query_object._update_steps();
    };

    return self;
  }

  if (origURL) {
    for (var i in origURL) {
      if (origURL.hasOwnProperty(i) && typeof origURL[i] === 'function')
        URL[i] = origURL[i];
    }
  }

  global.URL = URL;
  global.URLSearchParams = URLSearchParams;

}(self));
})
.call('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
