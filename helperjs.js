void function () {
// browserify -s someGlobal entry.js -o bundle.js
// browserify -s helperjs helperjs.js -o helperjsbundle.js
// HelperJS II version 0.1. ☃
// Easter egg in plain sight: (thanks to Brigand)
// function foo(){return XII}fooFixed=new Function(foo.toString().replace(/function\s*\w+\(\)\s*{/,"").slice(0,-1).replace(/[IVXLCDM]+/g,function(a){for(k=d=l=0;i={I:1,V:5,X:10,L:50,C:100,D:500,M:1E3}[a[k++]];l=i)d+=i>l?i-2*l:i;return d})); fooFixed()
//
// Prototypes and Math. property-functions always camel-case.
//
// Modifications or additions to native functionality:
// 1) In .misc_polyfills: just polyfills or fixes to IE.
//
// 2) In .dom_object_prototypes:
// The NodeList and HTMLCollection DOM objects get a forEach prototype, and HTMLElement gets .isAttached, .appendChildrenOf,
// setPositionOnLeft, .setPositionOnRight, and .setPositionOnCenter.
//
// 3) In .timer_prototypes:
// "window" gets .setTimeoutUpgraded and .setIntervalUpgraded.
// HTMLElement gets .setTimeout, .setInterval, .setTimeoutUpgraded, and .setIntervalUpgraded.
//
// 4) In .array_manipulation:
// Array gets .combineWith, .sendToFront, .trim, .removeEmptyStrings, .multiply, .round, .add, and .shuffle.
//
// 5) In .math: The native Math object gets Math.rad, Math.randInt, Math.randBool, Math.GCD, Math.weightedSample
//
// 6) In date_manipulation: Date gets .getUTCTime, .getMonthName, .getShortMonthName, .getHHMMLocaleTimeString,
// .daysInAMonth, .setTimeObject, and .format.
// 
// In string_manipulation:
// .repeat, .toCharCode, .indexOfMultiChar, .cushort, .cuint, .l2br, .trim, .ltrim, .rtrim, .splitAndTrim, .capitalize,
// .capitalizeFirstLetter, .stripslashes

var h = {}
if (typeof module == "undefined") var module = {}
module.exports = h
if (typeof window != "undefined") global = window
if (global) global.helperjs = h

// Settings.
h.library_settings = {
 misc_polyfills        : true,
 alt_names             : true,
 timer                 : true,
 physical_control      : true,
 sorting               : true,
 object_manipulation   : true,
 logic                 : true,
 math                  : true,
 date_manipulation     : true,
 string_manipulation   : true,
 dom_position          : true,
 ajax                  : true,
 download              : true,
 gui_widgets           : true,
 dom_manipulation      : true,
 domain_and_directory  : true,
 audio                 : true,
 graphics              : true,
 feature_detection     : true,
 cookie                : true,
 font_loading          : true,
 misc                  : true,
 use_prototypes        : true,
 use_camelcases        : true,
 use_underscores       : true,
}

h.proto = {NodeList: {}, HTMLCollection: {}, HTMLElement: {}, String: {}, Array: {}, Math: {}, Date: {}}

// Add ".is_library_container" to .library_settings, .proto, and .proto's child properties.
void function () {
 h.library_settings.is_library_container = true
 void function (obj) {
  obj.is_library_container = true
  for (var target_name in obj) {
   obj[target_name].is_library_container = true
  }
 } (h.proto)
} ()

// <Miscellaneous browser fixes and polyfills. TAG: polyfills.>
if (h.library_settings.misc_polyfills) {
 // Fix errors caused by console (or console.log) not being defined in certain browsers.
 if (typeof console == "undefined") console = {}
 if (typeof console.log == "undefined") console.log = function () {}
 // classList polyfill. https://github.com/remy/polyfills. MIT license.
 if (typeof document !== "undefined" && !("classList" in document.documentElement)) {(function (view) {
 if (!('HTMLElement' in view) && !('Element' in view)) return
 var classListProp = "classList" , protoProp = "prototype" , elemCtrProto = (view.HTMLElement || view.Element)[protoProp]
  , objCtr = Object , strTrim = String[protoProp].trim || function () {return this.replace(/^\s+|\s+$/g, "")}
  , arrIndexOf = Array[protoProp].indexOf || function (item) {
   var i = 0 , len = this.length
   for (; i < len; i++) {if (i in this && this[i] === item) {return i}}
   return -1
  }
  , DOMEx = function (type, message) {this.name = type; this.code = DOMException[type]; this.message = message}
  , checkTokenAndGetIndex = function (classList, token) {
   if (token === "") {throw new DOMEx("SYNTAX_ERR", "An invalid or illegal string was specified")}
   if (/\s/.test(token)) {throw new DOMEx("INVALID_CHARACTER_ERR", "String contains an invalid character")}
   return arrIndexOf.call(classList, token)
  }
  , ClassList = function (elem) {
   var trimmedClasses = strTrim.call(elem.className), classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [], i = 0, len = classes.length
   for (; i < len; i++) {this.push(classes[i])}
   this._updateClassName = function () {elem.className = this.toString()}
  }
  , classListProto = ClassList[protoProp] = []
  , classListGetter = function () {return new ClassList(this)}
 
 // Most DOMException implementations don't allow calling DOMException's toString()
 // on non-DOMExceptions. Error's toString() is sufficient here.
 DOMEx[protoProp] = Error[protoProp]
 classListProto.item = function (i) {return this[i] || null;}
 classListProto.contains = function (token) {token += ""; return checkTokenAndGetIndex(this, token) !== -1;}
 classListProto.add = function () {
  var tokens = arguments, i = 0, l = tokens.length, token, updated = false
  do {token = tokens[i] + ""; if (checkTokenAndGetIndex(this, token) === -1) {this.push(token); updated = true}} while (++i < l)
  if (updated) this._updateClassName()
 }
 classListProto.remove = function () {
  var tokens = arguments, i = 0, l = tokens.length, token, updated = false
  do {token = tokens[i] + ""; var index = checkTokenAndGetIndex(this, token); if (index !== -1) {this.splice(index, 1); updated = true;}} while (++i < l)
  if (updated) this._updateClassName()
 }
 classListProto.toggle = function (token, forse) {
  token += ""
  var result = this.contains(token), method = result ? forse !== true && "remove" : forse !== false && "add"
  if (method) this[method](token)
  return !result;
 }
 classListProto.toString = function () {return this.join(" ")}
 if (objCtr.defineProperty) {
  var classListPropDesc = {get: classListGetter, enumerable: true, configurable: true}
  try {
   objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  } catch (ex) { // IE 8 doesn't support enumerable:true
   if (ex.number === -0x7FF5EC54) {
    classListPropDesc.enumerable = false;
    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
   }
  }
 } else if (objCtr[protoProp].__defineGetter__) {
  elemCtrProto.__defineGetter__(classListProp, classListGetter);
 }
 }(self))
}
 // IE .innerHTML shim/polyfill.
 if (/(msie|trident)/i.test(navigator.userAgent)) {
  void function () {
   var innerhtml_get = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML").get
   var innerhtml_set = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerHTML").set
   Object.defineProperty(HTMLElement.prototype, "innerHTML", {
    get: function () {return innerhtml_get.call (this)},
    set: function (new_html) {
     var childNodes = this.childNodes
     for (var curlen = childNodes.length, i = curlen; i > 0; i--) {
      this.removeChild (childNodes[0])
     }
     innerhtml_set.call (this, new_html)
    }
   })
  } ()
 }
 // Fix for IE HTMLImageElement.start being unwritable.
 if (/(msie|trident)/i.test(navigator.userAgent)) {
  Object.defineProperty (HTMLImageElement.prototype, "start", {writable: true})
 }
 window.requestAnimationFrame = function () {
  return window.requestAnimationFrame       || 
         window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame    || 
         window.oRequestAnimationFrame      || 
         window.msRequestAnimationFrame     || 
         function (callback) {window.setTimeout (callback, 1000 / 60)}
 } ()
}
// </Miscellaneous browser fixes and polyfills.>

// <Alt names for addEventListener / removeEventListener.>
if (h.library_settings.alt_names) {
 h.add_event    = function (evt_target, evt_type, evt_listener, use_capture) {evt_target.addEventListener    (evt_type, evt_listener, use_capture)}
 h.remove_event = function (evt_target, evt_type, evt_listener, use_capture) {evt_target.removeEventListener (evt_type, evt_listener, use_capture)}
}
// </Alt names for addEventListener / removeEventListener.>

// <Interval handler/wrapper functions. TAG: setInterval, TAG: setTimeout.>
if (h.library_settings.timer) {
 void function () {
  // Add a setTimeout and setInterval to HTMLElement. The setTimeout and setInterval remove themselves if the element is removed.
  var set_timeout_upgraded  = h.set_timeout_upgraded  = function () {
   var args = Array.prototype.slice.call(arguments)
    var curtime = new Date().getTime()
    return {
     timeLeft : args[1],
     start    : curtime,
     pause    : function () {
      if (this.paused) return
      this.paused = true
      this.timeLeft = new Date().getTime() - this.start
      if (this.timeLeft <= 0) return
      window.clearTimeout (this.id)
     },
    resume   : function () {
     if (!this.paused) return
     delete (this.paused)
     this.start = new Date().getTime()
     args[1] = this.timeLeft
     this.id = window.setTimeout.apply(window, args)
    },
    restart  : function () {
     if (this.paused) delete (this.paused)
     window.clearTimeout(this.id)
     this.start = new Date().getTime()
     this.id = window.setTimeout.apply(window, args)
    },
    id       : setTimeout.apply(window, args)
   }
  }
  var set_interval_upgraded = h.set_interval_upgraded = function () {
   var args = Array.prototype.slice.call(arguments)
   return {
    pause  : function () {if (typeof this.paused == "undefined") {window.clearInterval(this.id); this.paused = true}},
    resume : function () {if (typeof this.paused != "undefined") {this.id = window.setInterval.apply(window, args); delete (this.paused)}},
    id     : window.setInterval.apply(window, args)
   }
  }
  
  function is_attached (obj) {
   while (true) {obj = obj.parentNode; if (obj == document.documentElement) return true; if (obj == null) return false}
  }
  h.proto.HTMLElement.set_timeout_upgraded  = function (obj, callback, calltime) {
   function callback_wrapper () {if (is_attached(obj)) callback.apply (null, Array.prototype.slice.call(arguments))}
   var timeout_object = set_timeout_upgraded(callback_wrapper, calltime)
   return timeout_object
  }
  h.proto.HTMLElement.set_interval_upgraded = function (obj, callback, calltime) {
   function callback_wrapper () {
    if (!is_attached(obj)) {window.clearInterval(obj.id); return}
    callback.apply (null, Array.prototype.slice.call(arguments))
   }
   return set_interval_upgraded(callback_wrapper, calltime)
  }
  h.proto.HTMLElement.set_timeout           = function (obj, callback, calltime) {
   function callback_wrapper () {if (is_attached(obj)) callback.apply (null, Array.prototype.slice.call(arguments))}
   return window.setTimeout(callback_wrapper, calltime)
  }
  h.proto.HTMLElement.set_interval          = function (obj, callback, calltime) {
   function callback_wrapper () {
    if (!is_attached(obj)) {window.clearInterval(obj.id); return}
    callback.apply(null, Array.prototype.slice.call(arguments))
   }
   return window.setInterval(callback_wrapper, calltime)
  }
 } ()
}
// </Interval handler/wrapper functions.>

// <Physical control functions. TAG: mouse, TAG: keyboard, TAG: pointer, TAG: pinch, TAG: swipe.>
if (h.library_settings.physical_control) {
 var get_right_click =
 h.get_right_click     = function (evt) {return (evt.which) ? (evt.which == 3) : ((evt.button) ? (evt.button == 2) : false)}
 h.get_wheel_data      = function (evt) {return evt.detail ? evt.detail * -1 : evt.wheelDelta / 40}
 h.get_key_code_string = function (evt) {
  var keyCode = evt.keyCode
  var keyMap = {37: "left", 38: "up", 39: "right", 40: "down", 107: "+", 187: "+", 109: "-", 189: "-", 16: "shift", 27: "escape", 13: "enter"}
  if (typeof keyCode[keyMap] == "undefined") {return String.fromCharCode(keyCode).toUpperCase()} else {return keyCode[keyMap]}
 }
 if (h.library_settings.dom_position) {
  h.add_pinch_controls  = function (init) {
   var target_obj = init.target, current_distance = false, zoom_x = undefined, zoom_y = undefined
   target_obj.addEventListener ('touchend'    , end_effect)
   target_obj.addEventListener ('touchcancel' , end_effect)
   target_obj.addEventListener ('touchleave'  , end_effect)
   target_obj.addEventListener ('touchstart'  , pinch)
   target_obj.addEventListener ('touchmove'   , pinch)
   function end_effect (evt) {if (current_distance != false) if (typeof init.end_effect != "undefined") init.end_effect (evt)}
   function pinch (evt) {
    if (evt.touches.length < 2) {current_distance = false; return}
    if (evt.type == 'touchmove') {
     if (current_distance == false) {return} else {var last_distance = current_distance}
    } else {
     if ((typeof init.start_condition != "undefined") && (init.start_condition (evt) === false)) return
    }
    var xy0 = get_x_y(evt.touches[0], target_obj); var x0 = xy0[0]; var y0 = xy0[1]
    var xy1 = get_x_y(evt.touches[1], target_obj); var x1 = xy1[0]; var y1 = xy1[1]
    if ((init.always_recalculate_zoom_target === true) || (current_distance == false)) {
     zoom_x = (x0 + x1) / 2, zoom_y = (y0 + y1) / 2
    }
    current_distance = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2))
    if (evt.type == 'touchstart') {
     if (typeof init.start_effect != "undefined") init.start_effect (evt, x0, y0, x1, y1)
     return
    }
    init.result_function (current_distance / last_distance, zoom_x, zoom_y)
    if (typeof init.move_effect != "undefined") init.move_effect (evt)
   }
  }
  h.add_swipe_controls  = function (init) {
   // N.B.: For PCs, use .preventDefault on dragstart. For mobile, use .preventDefault on touchmove.
   if (typeof init.is_mobile == "undefined") init.is_mobile = true
   var target_obj = init.target, initial_x, initial_y, current_x, current_y, swipe_in_effect = false
   target_obj.addEventListener (init.is_mobile ? 'touchstart'  : 'mousedown', swipe_start_event)
   target_obj.addEventListener (init.is_mobile ? 'touchmove'   : 'mousemove', swipe_event)
   target_obj.addEventListener (init.is_mobile ? 'touchend'    : 'mouseup'  , function (evt) {if (swipe_in_effect == false) return; swipe_end_event (evt)})
   target_obj.addEventListener (init.is_mobile ? 'touchleave'  : 'mouseout' , function (evt) {if (swipe_in_effect == false) return; swipe_end_event (evt)})
   target_obj.addEventListener (init.is_mobile ? 'touchcancel' : 'blur'     , function (evt) {if (swipe_in_effect == false) return; swipe_end (evt)})
   function swipe_end (evt) {
    if (swipe_in_effect == false) return
    swipe_in_effect = false
    if (typeof init.end_effect != "undefined") init.end_effect (evt)
   }
   function swipe_start_event (evt) {
    if ((typeof init.start_condition != "undefined") && (init.start_condition (evt) == false)) return
    if ((init.is_mobile) && (evt.touches.length != 1)) return
    var xy = get_x_y((init.is_mobile) ? evt.touches[0] : evt, target_obj); initial_x = xy[0]; initial_y = xy[1]
    current_x = initial_x; current_y = initial_y
    if (swipe_in_effect == true) return
    swipe_in_effect = true
    if (typeof init.start_effect != "undefined") init.start_effect (evt)
   }
   function swipe_event (evt) {
    if (
        ((init.is_mobile) && (evt.touches.length != 1)) ||
        ((typeof init.continue_condition != "undefined") && (init.continue_condition(evt) === false))
       ) {swipe_end (evt); return}
    var xy = get_x_y((init.is_mobile) ? evt.touches[0] : evt, target_obj); current_x = xy[0]; current_y = xy[1]
    if (typeof init.swipe_move != "undefined") init.swipe_move ({evt: evt, init: init, initial_x: initial_x, initial_y: initial_y, current_x: current_x, current_y: current_y, swipe_in_effect: swipe_in_effect})
   }
   function swipe_end_event (evt) {
    if ((typeof init.continue_condition != "undefined") && (init.continue_condition(evt) === false)) {swipe_end (evt); return}
    if (current_x < initial_x) {
     if (typeof init.swipe_left != "undefined") init.swipe_left (evt)
    } else {
     if ((current_x > initial_x) && (typeof init.swipe_right != "undefined")) init.swipe_right (evt)
    }
    if (current_y < initial_y) {
     if (typeof init.swipe_down != "undefined") init.swipe_down (evt)
    } else {
     if ((current_y > initial_y) && (typeof init.swipe_up != "undefined")) init.swipe_up (evt)
    }
    swipe_end (evt)
   }
  }
 }
}
// </Physical control functions.>

// <Array sorting functions. TAG: array, TAG: sorting.>
if (h.library_settings.sorting) {
 h.sort_characters_in_string = function (string_to_sort) {return string_to_sort.split('').sort(sort_case_insensitive).join('')}
 var sort_case_insensitive =
 h.sort_case_insensitive     = function (a, b) {a = a.toLowerCase (); b = b.toLowerCase (); if (a > b) return  1; if (a < b) return -1; return 0}
 // Sorts "linked arrays", or "array pairs".
 // Sample sort function is: function (a, b) {if (a[0] > b[0]) return 1; return -(a[0] < b[0])}
 h.sort_linked_arrays        = function (input_array, linked_array, sort_function) {
  if (typeof sort_function == "undefined") {
   if (input_array.length == 0) returnsor
   var starts = [0]
   var ends = [input_array.length]
   while (starts.length) {
    var p = starts.pop ()
    var q = ends.pop ()
    var pivot = input_array[p] // Pivot should probably be randomized to avoid worst-case..
    var i = p, swapInput, swapLinked
    for (var j = p + 1; j < q; j++) {
     if (input_array[j] < pivot) {
      i++
      swapInput = input_array[i]  ; input_array[i]  = input_array[j] ; input_array[j]  = swapInput
      swapLinked = linked_array[i]; linked_array[i] = linked_array[j]; linked_array[j] = swapLinked
     }
    }
    swapInput  = input_array[p] ; input_array[p]  = input_array[i] ; input_array[i]  = swapInput
    swapLinked = linked_array[p]; linked_array[p] = linked_array[i]; linked_array[i] = swapLinked
    if (q - i > 2) {starts.push(i + 1); ends.push(q)}
    if (i - p > 1) {starts.push(p)    ; ends.push(i)}
   }
   return
  }
  var curlen = input_array.length
  var input_array_obj = new Array(curlen)
  for (var i = 0; i < curlen; i++) {
   input_array_obj[i] = [input_array[i], linked_array[i]]
  }
  input_array_obj.sort(sort_function)
  for (var i = 0; i < curlen; i++) {
   input_array[i]  = input_array_obj[i][0]
   linked_array[i] = input_array_obj[i][1]
  }
 }
 // Get the resultant indices of an array as if it had been sorted.
 h.get_indices_from_sort     = function (input_array, sort_function) {
  if (typeof sort_function == "undefined") var sort_function = function (a, b) {if (a[0] > b[0]) return 1; return -(a[0] < b[0])}
  var curlen = input_array.length
  var input_array_obj = new Array(curlen); input_array.forEach(function (entry, i) {input_array_obj[i] = [entry, i]})
  input_array_obj.sort(sort_function)
  var output_array = new Array(curlen); input_array_obj.forEach(function (entry, i) {output_array[entry[1]] = i})
  return output_array
 }
}
// </Array sorting functions.>

// <Array manipulation functions. TAG: array, TAG: arrays, TAG: array manipulation, TAG: object manipulation, TAG: copy, TAG: test.>
if (h.library_settings.object_manipulation) {
 h.proto.Array.combine_with         = function (obj, secondary) {
  var primary = obj, primary_length = primary.length
  secondary.forEach(function (current_entry) {
   var target_found = false
   for (var j = 0; j < primary_length; j++) {if (primary[j] === current_entry) {target_found = true; break}}
   if (target_found != true) {primary.push(current_entry); primary_length += 1}
  })
  return primary
 }
 h.proto.Array.send_to_front        = function (obj, target) {
  var newobj = obj.map (function (element) {return element})
  newobj.some (function (element, i) {
   if (!objects_are_equal(element, target)) return false
   newobj.splice (i, 1); newobj.splice (0, 0, target); return true
  })
  return newobj
 }
 h.proto.Array.remove_empty_strings = function (obj) {return obj.filter (function (element) {return element != ""})} // for (var i = 0, curlen = obj.length; i < curlen; i++) {if (obj[i] != "") continue; obj.splice (i, 1); curlen -= 1; i -= 1; }; return obj
 h.proto.Array.multiply             = function (obj, mult_value)           {return obj.map (function (element) {return element * mult_value})}  // for (var i = 0, curlen = obj.length; i < curlen; i++) {obj[i] *= mult_value}; return obj
 h.proto.Array.round                = function (obj) {function round (obj) {return obj.map (function (element) {return Math.round(element)})}}  // for (var i = 0, curlen = obj.length; i < curlen; i++) {obj[i] = Math.round(obj[i])}; return obj
 h.proto.Array.add                  = function (obj, add_value)            {return obj.map (function (element) {return element +  add_value})}  // for (var i = 0, curlen = obj.length; i < curlen; i++) {obj[i] += add_value}; return obj
 h.proto.Array.shuffle              = function (obj) {
  var i = obj.length, t, r
  while (0 !== i) {                          // While there remain elements to shuffle...
   r = Math.floor(Math.random() * i); i -= 1 // Pick a remaining element...
   t = obj[i]; obj[i] = obj[r]; obj[r] = t   // And swap it with the current element.
  }
  return obj
 }
 h.search_array_of_objects          = function (init) {
  // Search attributes/key values (init.attribute) in a set of objects (init.array) containing certain text (init.text).
  var text_list      = init.text; if ((typeof text_list == "undefined") || (!(text_list instanceof Array) && (text_list.trim() == ""))) return init.array
  if (!(text_list instanceof Array)) text_list = [text_list]
  var input_array    = init.array
  var attribute_list = init.attribute
  if (!(attribute_list instanceof Array)) attribute_list = [attribute_list]
  var attribute_list_length = attribute_list.length
  var case_insensitive = ((typeof init.case_insensitive != "undefined") ? init.case_insensitive : true)
  var output_array = []
  var curlen = input_array.length
  for (var i = 0; i < curlen; i++) {
   var current_entry = input_array[i]
   var continue_loop = false
   for (var j = 0; j < attribute_list_length; j++) {
    if (typeof text_list[j] == "undefined") continue
    if (case_insensitive == true) {
     if ((current_entry[attribute_list[j]]+'').search(new RegExp(text_list[j], "i")) == -1) {continue_loop = true; break}
    } else {
     if ((current_entry[attribute_list[j]]+'').search(text_list[j]) == -1) {continue_loop = true; break}
    }
   }
   if (continue_loop == true) continue
   output_array.push (current_entry)
  }
  return output_array
 }
 h.merge_objects                    = function (secondary, primary) {
  // Merge two objects together. If the primary object has the same key as the secondary object, use the primary object's value.
  if (typeof secondary == "undefined") var primary = primary.primary, secondary = primary.secondary
  var new_object = {}
  for (var property in secondary) {new_object[property] = secondary[property]}
  for (var property in primary)   {new_object[property] = primary  [property]}
  return new_object
 }
 h.merge_objects_with_options       = function (secondary, primary, options) {
  // Merge two objects together.
  // If the primary object has the same key as the secondary object:
  // If both keys' values are function, merge the functions, secondary first.
  // If that key's value is an object, use the primary object's value.
  if (typeof options == "undefined") options = {}
  if (typeof secondary == "undefined") var primary = primary.primary, secondary = primary.secondary
  var new_object = {}
  for (var property in secondary) {new_object[property] = secondary[property]}
  for (var property in primary)   {
   if ((options.merge_subfunctions) && (typeof secondary[property] == "function") && (typeof primary[property] == "function")) {
    new_object[property] = function () {
     var args = Array.prototype.slice.call(arguments)
     secondary[property].apply (this, args)
     primary[property]  .apply (this, args)
    }
    continue
   }
   new_object[property] = primary[property]
  }
  return new_object
 }
 var objects_are_equal =
 h.objects_are_equal = function (a, b) {
  function generalType (o) {var t = typeof(o); if (t != 'object') return t; if (o instanceof String) return 'string'; if (o instanceof Number) return 'number'; return t}
  function uniqueArray (a) {if (!(a instanceof Array)) return; a.sort (); for (var i = 1; i < a.length; i++) {if (a[i - 1] == a[i]) a.splice(i, 1)}}
  function keys (map) {var list = []; for (var prop in map) {if (map.hasOwnProperty(prop)) list.push(prop)}; return list}
  if (a === b) return true
  if (generalType(a) != generalType(b)) return false
  if (a == b) return true
  if (typeof a != 'object') return false
  // null != {}
  if (a instanceof Object != b instanceof Object) return false
  if (a instanceof Date || b instanceof Date) {
   if (a instanceof Date != b instanceof Date || a.getTime() != b.getTime()) return false
  }
  var all_keys = [].concat(keys(a), keys(b))
  uniqueArray (all_keys)
  for (var i = 0; i < all_keys.length; i++) {
   var prop = all_keys[i]
   if (!objects_are_equal(a[prop], b[prop])) return false
  }
  return true
 }
 h.shallowcopy       = function (source) {
  if ((typeof source !== 'object') || (source == null)) return source
  var copy = ((source instanceof Array) ? [] : {})
  for (var i in source) {copy[i] = source[i]}
  return copy
 }
 var deepcopy =
 h.deepcopy          = function (source) {
  if ((typeof source !== 'object') || (source == null)) return source
  var copy = ((source instanceof Array) ? [] : {})
  for (var i in source) {
   var property = source[i]
   if (typeof property != 'object') {copy[i] = property; continue}
   if (!(property instanceof Array)) {copy[i] = deepcopy(property); continue}
   copy[i] = []
   for (var j = 0, curlen = property.length; j < curlen; j++) {
    if (typeof property[j] != 'object') {copy[i].push(property[j]); continue}
    copy[i].push(deepcopy(property[j]))
   }
  }
  return copy
 }
 h.strip_dom_keys    = function (source) {
  var copy = {}
  var props = Object.keys(source)
  var dummy = document.createElement ('div')
  var dom_keys = Object.keys(dummy)
  for (var pi = 0, curlen = props.length; pi < curlen; pi++) {
   var p = props[pi]
   if (dom_keys.indexOf(p) != -1) continue
   copy[p] = source[p]
  }
  return copy
 }
 h.deep_extend       = function (destination, source) {
  for (var property in source) {
   if ((source[property]) && (source[property].constructor) && (source[property].constructor === Object)) {
    destination[property] = destination[property] || {}
    arguments.callee (destination[property], source[property])
   } else {
    destination[property] = source[property]
   }
  }
  return destination
 }
 h.replace_property  = function (init) {
  // replace_property.
  // Replace a property.. with something else.
  // replace_property ({
  //  search_object    : {1: {11: {Control: function () {return 111}}}, 2: {21: {211: {Control: 2111}}}},
  //  search_property  : 'Control',
  //  replace_function : function (value) {return value}
  // })
  var obj= init.search_object
  var search_property  = init.search_property
  var replace_function = init.replace_function
  recurse_test (obj, null, null)
  function recurse_test (cur_obj, parent, ref) {
   if (typeof cur_obj[search_property] != "undefined") {
    parent[ref] = replace_function (cur_obj[search_property])
    return
   }
   for (var i in cur_obj) {recurse_test (cur_obj[i], cur_obj, i)}
  }
 }
 h.grid_create       = function (target, xsize, ysize, constructor_inner, constructor_outer) {
  // Populate an array, with (by default) a set of sub-arrays, without (by default) setting values in each sub-array.
  var x = 0, y = 0
  if (typeof constructor_outer != "undefined") {
   if (typeof constructor_inner != "undefined") {
    for (x = 0; x < xsize; x++) {eval ('target[x]=' + constructor_outer); for (y = 0; y < xsize; y++) {eval ('target[x][y]=' + constructor_inner)}}
   } else {
    for (x = 0; x < xsize; x++) {eval ('target[x]=' + constructor_outer)}
   }
  } else {
   if (typeof constructor_inner != "undefined") {
    for (x = 0; x < xsize; x++) {target[x] = []; for (y = 0; y < xsize; y++) {eval ('target[x][y]=' + constructor_inner)}}
   } else {
    for (x = 0; x < xsize; x++) {target[x] = []}
   }
  }
  return target
 }
 h.grid_clone        = function (source, target, constructor_outer, constructor_initial) {
  // Clone an array in the first and second level (the sub-arrays and their values).
  if (typeof target == "undefined") {
   if (typeof constructor_initial == "undefined") {
    if (source.constructor == Array) {var target = new Array(source.length)} else {var target = new source.constructor}
   } else {
    eval ('var target=' + constructor_initial)
   }
  }
  if (source.constructor == Array) {
   var xsize = source.length
   var s0 = source[0]
   if ((s0 instanceof Int8Array) || (s0 instanceof Uint8Array) || (s0 instanceof Uint8ClampedArray) || (s0 instanceof Int16Array) || (s0 instanceof Uint16Array) || (s0 instanceof Int32Array) || (s0 instanceof Uint32Array) || (s0 instanceof Float32Array) || (s0 instanceof Float64Array)) {
    for (var x = 0; x < xsize; x++) {
     target[x] = new source[x].constructor (source[x].buffer, source[x].byteOffset)
    }
   }
   return target
  }
  var ysize = source[0].length
  for (var x = 0; x < xsize; x++) {
   if (typeof constructor_outer == "undefined") {target[x] = new source[0].constructor} else {eval ('target[x]=' + constructor_outer)}
   for (var y = 0; y < ysize; y++) {target[x][y] = source[x][y]}
  }
  return target
 }
 h.grid_copy         = function (source, target) {
  // Unlike clone, assumes arrays are already in place on the target and source/target xsize and ysize are the same.
  if (source.constructor == Array) {
   var xsize = source.length
   var s0 = source[0]
   if ((s0 instanceof Int8Array) || (s0 instanceof Uint8Array) || (s0 instanceof Uint8ClampedArray) || (s0 instanceof Int16Array) || (s0 instanceof Uint16Array) || (s0 instanceof Int32Array) || (s0 instanceof Uint32Array) || (s0 instanceof Float32Array) || (s0 instanceof Float64Array)) {
    for (var x = 0; x < xsize; x++) {
     target[x] = new source[x].constructor (source[x].buffer, source[x].byteOffset)
    }
   }
   return target
  }
  var ysize = source[0].length
  for (var x = 0; x < xsize; x++) {for (var y = 0; y < ysize; y++) {target[x][y] = source[x][y]}}
  return target
 }
 h.grid_normalize    = function (curobj, xsize, ysize, oldmax, newmax, toint) {
  var x = 0, y = 0
  if (toint) {
   var oldmax = 0
   for (x = 0; x < xsize; x++) {
    for (y = 0; y < ysize; y++) {
     if (oldmax < curobj[x][y]) oldmax = curobj[x][y]
    }
   }
   for (x = 0; x < xsize; x++) {
    for (y = 0; y < ysize; y++) {curobj[x][y] = Math.round(newmax * curobj[x][y] / oldmax)
    }
   }
  } else {
   for (x = 0; x < xsize; x++) {
    for (y = 0; y < ysize; y++) {
     curobj[x][y] = parseInt(curobj[x][y] / oldmax * newmax)
    }
   }
  }
  return curobj
 }
 h.grid_clear        = function (target, xsize, ysize) {
  var x = 0, y = 0
  for (x = 0; x < xsize; x++) {
   for (y = 0; y < ysize; y++) {
    delete (target[x][y])
   }
  }
  return target
 }
 h.grid_set          = function (target, xsize, ysize, value) {
  var x = 0, y = 0
  for (x = 0; x < xsize; x++) {
   for (y = 0; y < ysize; y++) {
    target[x][y] = value
   }
  }
  return target
 }
 h.mapobject         = function (func, obj) {
  var result = new Object()
  for (var i in obj) {result[i] = func(i, obj[i])}
  return result
 }
 h.extend            = function (source, target) {
  var target = target || new Object ()
  mapobject (function (k, v) {try {target[k] = v} catch (err) {console.log(err)}}, source)
  return target
 }
 h.is_empty          = function (obj) {if (Object.keys(obj).length == 0) return true}
}
// <Object manipulation functions.>

// <Generic logic functions. TAG: logic, TAG: logic functions, TAG: bits, TAG: bit manipulation, TAG: data, TAG: data manipulation.>
if (h.library_settings.logic) {
 // Converts a 0 or 1 (or a string version of it) to a true/false value. Returns true if '1' or 1; otherwise, returns false.
 h.numeric_to_truthy = function (value) {if (+value != 0) {return true} else {return false}}
 // Converts a true/false value to 0 (not true) or 1 (true).
 h.truthy_to_numeric = function (value) {if (value == true) {return 1} else {return 0}}
 // Clear a bit n in the pth position, starting from 0.
 h.bit_clear         = function (n, p) {return n &= ~(1 << p)}
 // Set a bit n in the pth position, starting from 0.
 h.bit_set           = function (n, p) {return n |= (1 << p)}
 // Toggle a bit n in the pth position, starting from 0.
 h.bit_toggle        = function (n, p) {return n ^= (1 << p)}
 // Check if a bit n is set in the pth position, starting from 0.
 .bit_is_set         = function (n, p) {return (n & (1 << p) != 0)}
 // Count the bits of a 32-bit integer.
 h.bit_count         = function (n) {
  n = n - ((n >> 1) & 0x55555555)         // Reuse input as temporary.
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333)        // Temp.
  return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24 // Count.
 }
}
// </Generic logic functions.>

// <Math manipulation functions. TAG: math, TAG: math manipulation.>
if (h.library_settings.math) {
 // .rad, .randInt, .randBool, .GCD, and .weightedSample are all standardized. The collision risk is extremely low and thus these are added to the Math object itself.
 Math.rad      = function (degree) {return Math.PI / 180 * degree}
 Math.randInt  = function (min, max) {return min + Math.floor(Math.random() * (max - min + 1))}
 Math.randBool = function () {return (0 == Math.floor(Math.random() * 2))}
 Math.GCD      = function () {
  var array_array = Array.prototype.slice.call(arguments)
  if (!array_array.length) return 0
  var r, a
  if (array_array[0] instanceof Array) {var gcd = array_array[0][0]} else {var gcd = array_array[0]}
  for (var i = 0, curlen_i = array_array.length; i < curlen_i; i++) {
   if (array_array[i] instanceof Array) {var current_array = array_array[i]} else {var current_array = [array_array[i]]}
   for (var j = 0, curlen_j = current_array.length; j < curlen_j; j++) {
    a = current_array[j]
    do {
     r = a % gcd
     if (r == 0) break
     a = gcd
     gcd = r
    } while (true)
   }
  }
  return gcd
 }
 Math.randBMT  = function () {
  var x = 0, y = 0, rds, c
  // Get a random numbers from 0 to 1, with the mean at .5.
  
  // If the radius is zero or greater than 1, throw them out and pick two new ones.
  // Rejection sampling throws away about 20% of the pairs.
  do {
   x = Math.random() * 2 - 1
   y = Math.random() * 2 - 1
   rds = x * x + y * y
  }
  while (rds == 0 || rds > 1)
  // This magic is the Box-Muller Transform.
  c = Math.sqrt(-2 * Math.log(rds) / rds)
  // It always creates a pair of numbers. I'll return them in an array.
  // This function is quite efficient so don't be afraid to throw one away if you don't need both.
  var x = (x * c + 1) / 2
  if (x > 1) {x = 1} else {if (x < 0) x = 0}
  return x
 }
 // Weighted sample / distribution selection function.
 Math.weightedSample = function (obj) {
  var total = 0; for (var i in obj) {total += obj[i]}; total *= Math.random ()
  for (var i in obj) {total -= obj[i]; if (total < 0) return i}
 }
 // Get the final width/height of a rotated object.
 h.math = {}
 h.math.get_rotated_size = function (width, height, degrees) {
  degrees = degrees % 180
  width = degrees < 90 ? width : - width
  var radians = Math.PI / 180 * degrees, cosine = Math.cos(radians), sine = Math.sin(radians)
  return [Math.ceil(Math.abs(cosine * width + sine * height)), Math.ceil(Math.abs(cosine * height + sine * width))]
 }
 h.math.eval = function (expression, replace_list) {
  if (typeof replace_list == "undefined") replace_list = {}
  do {
   var do_exit = true
   for (var i in replace_list) {
    if (replace_list[i] === null) continue
    var new_expression = expression.replace (i.toString(), replace_list[i].toString())
    if (new_expression != expression) do_exit = false
    expression = new_expression
   }
   break
   if (do_exit) break
  } while (true)
  return eval (expression)
 }
}
// </Math manipulation functions.>

// <Date manipulation functions. TAG: date.>
if (h.library_settings.date_manipulation) {
 void function () {
  var monthName      = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  var shortMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  h.proto.Date.get_UTC_time                = function (obj) {return obj.getTime() + obj.getTimezoneOffset() * 60000}
  h.proto.Date.get_month_namev             = function (obj) {return monthName[obj.getMonth()]}
  h.proto.Date.get_short_month_name        = function (obj) {return shortMonthName[obj.getMonth()]}
  h.proto.Date.get_HHMM_locale_time_string = function (obj) {return shortMonthName[obj.getMonth()]}
  h.proto.Date.days_in_a_month             = function (obj) {var d = new Date(obj.getFullYear(), obj.getMonth() + 1, 0); return d.getDate()}
  h.proto.Date.set_time_object             = function (obj, n) {obj.setTime(n); return obj}
 } ()
 // Get a date object from a string in the format of the Mysql DATETIME string, or vice-versa.
 h.get_date_from_mysql_format     = function (mysql_string) {
  var mysql_array = mysql_string.split(" ")
  var ymd = mysql_array[0].split("-")
  var hms = mysql_array[1].split(":")
  return new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2], 0)
 }
 h.get_mysql_format_from_date     = function (unix_timestamp) {
  var date = new Date (unix_timestamp * 1000)
  var current_month  = date.getUTCMonth() + 1; if (current_month  < 10) current_month  = "0" + current_month
  var current_day    = date.getUTCDate()     ; if (current_day    < 10) current_day    = "0" + current_day
  var current_hour   = date.getUTCHours()    ; if (current_hour   < 10) current_hour   = "0" + current_hour
  var current_minute = date.getUTCMinutes()  ; if (current_minute < 10) current_minute = "0" + current_minute
  var current_second = date.getUTCSeconds()  ; if (current_second < 10) current_second = "0" + current_second
  return date.getUTCFullYear() + "-" + current_month + "-" + current_day + " " + current_hour + ":" + current_minute + ":" + current_second
 }
 // Mysql date (just date, no time) <-> unix timestamp conversion functions.
 h.mysql_date                     = function (unix_timestamp) {return mysql_date_from_unix_timestamp (unix_timestamp)}
 h.mysql_date_from_unix_timestamp = function (unix_timestamp) {
  var date = new Date (unix_timestamp * 1000)
  var current_month = date.getUTCMonth() + 1
  if (current_month < 10) current_month = "0" + current_month
  var current_day = date.getUTCDate()
  if (current_day < 10) current_day = "0" + current_day
  return date.getUTCFullYear() + "-" + current_month + "-" + current_day
 }
 h.unix_timestamp_from_mysql_date = function (mysql_date) {
  var mysql_date_array = mysql_date.split("-")
  return parseInt((new Date (mysql_date_array[0], mysql_date_array[1]-1, mysql_date_array[2], 0, 0, 0, 0)).getUTCTime() / 1000)
 }
 h.date_format = function () {
  // Date Format 1.2.3
  // (c) 2007-2009 Steven Levithan <stevenlevithan.com>
  // MIT license
  //
  // Includes enhancements by Scott Trenda <scott.trenda.net>
  // and Kris Kowal <cixar.com/~kris.kowal/>
  //
  // Accepts a date, a mask, or a date and a mask.
  // Returns a formatted version of the given date.
  // The date defaults to the current date/time.
  // The mask defaults to date_format.masks.default.
  var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
   timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
   timezoneClip = /[^-+\dA-Z]/g,
   pad = function (val, len) {
    val = String(val)
    len = len || 2
    while (val.length < len) val = "0" + val
    return val
   }
   
  // Regexes and supporting functions are cached through closure.
  return function (date, mask, utc) {
   var dF = dateFormat
   
   // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
   if ((arguments.length == 1) && (Object.prototype.toString.call(date) == "[object String]") && (!/\d/.test(date))) {
    mask = date
    date = undefined
   }
   
   // Passing date through Date applies Date.parse, if necessary.
   date = date ? new Date(date) : new Date
   if (isNaN(date)) throw SyntaxError("invalid date")
   
   mask = String(dF.masks[mask] || mask || dF.masks["default"])
   
   // Allow setting the utc argument via the mask.
   if (mask.slice(0, 4) == "UTC:") {
    mask = mask.slice(4)
    utc = true
   }
   
   var _ = utc ? "getUTC" : "get"
   var d = date[_ + "Date"] ()
   var D = date[_ + "Day"] ()
   var m = date[_ + "Month"] ()
   var y = date[_ + "FullYear"] ()
   var H = date[_ + "Hours"] ()
   var M = date[_ + "Minutes"] ()
   var s = date[_ + "Seconds"] ()
   var L = date[_ + "Milliseconds"] ()
   var o = utc ? 0 : date.getTimezoneOffset ()
   var flags = {
    d:    d,
    dd:   pad(d),
    ddd:  dF.i18n.dayNames[D],
    dddd: dF.i18n.dayNames[D + 7],
    m:    m + 1,
    mm:   pad(m + 1),
    mmm:  dF.i18n.monthNames[m],
    mmmm: dF.i18n.monthNames[m + 12],
    yy:   String(y).slice(2),
    yyyy: y,
    h:    H % 12 || 12,
    hh:   pad(H % 12 || 12),
    H:    H,
    HH:   pad(H),
    M:    M,
    MM:   pad(M),
    s:    s,
    ss:   pad(s),
    l:    pad(L, 3),
    L:    pad(L > 99 ? Math.round(L / 10) : L),
    t:    H < 12 ? "a"  : "p",
    tt:   H < 12 ? "am" : "pm",
    T:    H < 12 ? "A"  : "P",
    TT:   H < 12 ? "AM" : "PM",
    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
   }
    
   return mask.replace(token, function ($0) {
    return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1)
   })
  }
 }()
 // Some common format strings.
 h.date_format.masks = {
  "default":      "ddd mmm dd yyyy HH:MM:ss",
  shortDate:      "m/d/yy",
  mediumDate:     "mmm d, yyyy",
  longDate:       "mmmm d, yyyy",
  fullDate:       "dddd, mmmm d, yyyy",
  shortTime:      "h:MM TT",
  mediumTime:     "h:MM:ss TT",
  longTime:       "h:MM:ss TT Z",
  isoDate:        "yyyy-mm-dd",
  isoTime:        "HH:MM:ss",
  isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
  isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
 }
 // Internationalization strings.
 var date_format = h.date_format.i18n = {
  dayNames: [
   "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
   "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  monthNames: [
   "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
   "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]
 }
 // For convenience...
 h.proto.Date.format = function (obj, mask, utc) {return date_format(obj, mask, utc)}
}
// <Date manipulation functions.>

// <String manipulation functions. TAG: string, string manipulation.>
if (h.library_settings.string_manipulation) {
 h.proto.String.repeat                  = function (obj, num) {return new Array(num + 1).join(obj)}
 h.proto.String.to_char_code            = function (obj, n) {return obj.charCodeAt(n)}
 // Check if any character in the search string is in any character in the target string. Otherwise, return false.
 h.proto.String.index_of_multi_char     = function (obj, searchstring, startpos) {
  if (typeof startpos == "undefined") startpos = 0
  var curlen = obj.length
  for (var i = startpos; i < curlen; i++) {if (searchstring.indexOf (obj[i]) != -1) return i}
  return false
 }
 // 16 bit. (2 bytes)
 h.proto.String.cushort                 = function (obj) {return (((obj.charCodeAt(1)&0xff)<<8) + (obj.charCodeAt(0)&0xff))}
 // 32-bit. (4 bytes)
 h.proto.String.cuint                   = function (obj) {return ((obj.charCodeAt(3)&0xff)<<24) + ((obj.charCodeAt(2)&0xff)<<16) + ((obj.charCodeAt(1)&0xff)<<8) + (obj.charCodeAt(0)&0xff)}
 h.proto.String.l2br                    = function (obj) {return obj.replace(/(\r\n|\n\r|\r|\n)/g, "<br/>")}
 h.proto.String.ltrim                   = function (obj) {return obj.replace(/^\s+/,"")}
 h.proto.String.rtrim                   = function (obj) {return obj.replace(/\s+$/,"")}
 // Splits by the specified divisor, then right-trims and left-trims, removing 0-character strings.
 h.proto.String.split_and_trim          = function (obj, divisor) {
  if (obj == null) return []
  var result = obj.split(divisor)
  var j = 0
  for (var i = 0, curlen = result.length; i < curlen; i++) {
   var current_result = result[i].replace(/^\s+|\s+$/g, "")
   if (current_result == "") continue
   result[j] = current_result
   j += 1
  }
  result.splice (j, curlen - j)
  return result
 }
 h.proto.String.capitalize              = function (obj) {
  return obj.toLowerCase().replace(/^[a-z]|\s[a-z]/g, conv)
  function conv () {return arguments[0].toUpperCase()}
 }
 var capitalize_first_letter = h.proto.String.capitalize_first_letter = function (obj) {return obj.charAt(0).toUpperCase() + obj.slice(1)}
 h.proto.String.stripslashes            = function (obj) {
  return (obj + '').replace(/\\(.?)/g, function (s, n1) {
   switch (n1) {
    case '\\' : return '\\'
    case '0'  : return '\u0000'
    case ''   : return ''
    default   : return n1
   }
  })
 }
 h.shorten_text                         = function (text, maximum_length) {
  if (text.length > maximum_length) text = text.slice (0, maximum_length - 4) + "..."
  return text
 }
 // Split a String's written sentences into separate arrays.
 h.split_string_by_sentences            = function (curstr) {
  // We could also do: return curstr.match(/.*?[.?!][")}\]]*( |$)/g).map (n => n.trim ())
  var curobj = curstr.match(/.*?[.?!][")}\]]*( |$)/g)
  var curlen = curobj.length; for (var i = 0; i < curlen; i++) {curobj[i] = curobj[i].trim ()}
  return curobj
 }
 //"Hello. My name is Summer. What's your name?"
 //["Hello", " My name is Summer.", " What's your name?"]
 
 // Add commas to a number.
 // This will be superceded by https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString soon enough.
 h.format_add_commas_to_number          = function (input_string) {
  var arr = (input_string + "").split('.')
  var predot  = arr[0]
  var postdot = (arr.length > 1) ? '.' + arr[1] : ''
  var the_regex = /(\d+)(\d{3})/
  while (the_regex.test(predot)) {predot = predot.replace(the_regex, '$1' + ',' + '$2')}
  return predot + postdot
 }
 // Not really finished...
 h.grammar = {
 "single_noun_general_preposition":
 function (curstring) {
  if (typeof curstring == "undefined") return ""
  var firstletter = curstring[0]
  var starts_with_an = "aeiou"
  if (starts_with_an.indexOf (firstletter) == -1) {
   // Check for abbreviations or lack thereof.
   var dotFound   = curstring.indexOf (".")
   var spaceFound = curstring.indexOf (" ")
   if ((dotFound == -1) || ((spaceFound != -1) && (spaceFound < dotFound))) {
    return "a " + curstring
   }
  }
   return "an " + curstring
  }
 }
}
// </String manipulation functions.>

// <Mouse/DOM object position functions. TAG: mouse, TAG: mouse position, TAG: positions, TAG: object positions, TAG: element positions.>
if (h.library_settings.dom_position) {
 var get_x_y = h.get_x_y   = function (evt, target) {
  if (typeof target == "undefined") target = evt.target
  var rect = target.getBoundingClientRect(); return [evt.clientX - rect.left, evt.clientY - rect.top]
 }
 var get_x = h.get_x       = function (evt, target) {
  if (typeof target == "undefined") target = evt.target
  return evt.clientX - target.getBoundingClientRect().left
 }
 var get_y = h.get_y       = function (evt, target) {
  if (typeof target == "undefined") target = evt.target
  return evt.clientY - target.getBoundingClientRect().top
 }
 // Function to find the absolute position of a DOM object.
 var findabspos =
 h.findabspos              = function (obj, lastobj) {
  var curleft = 0, curtop = 0, borderWidthTest = 0
  if (typeof lastobj == "undefined") lastobj = null
  do {
   borderWidthTest = parseFloat(window.getComputedStyle(obj).borderLeftWidth)
   if (!isNaN(borderWidthTest)) curleft += borderWidthTest
   borderWidthTest = parseFloat(window.getComputedStyle(obj).borderTopWidth)
   if (!isNaN(borderWidthTest)) curtop += borderWidthTest
   if (obj.offsetParent == lastobj) return [curleft, curtop] // If offsetParent is lastobj (or null if lastobj is null), return the result.
   curleft += obj.offsetLeft
   curtop  += obj.offsetTop
   obj = obj.offsetParent
  } while (true)
 }
 // Function to find the absolute x-position of a DOM object.
 h.findabspos_x            = function (obj, lastobj) {
  var curleft = 0, borderWidthTest = 0
  if (typeof lastobj == "undefined") lastobj = null
  do {
   borderWidthTest = parseFloat(window.getComputedStyle(obj).borderLeftWidth)
   if (!isNaN(borderWidthTest)) curleft += borderWidthTest
   if (obj.offsetParent == lastobj) return curleft // If offsetParent is lastobj (or null if lastobj is null), return the result.
   curleft += obj.offsetLeft
   obj = obj.offsetParent
  } while (true)
 }
 // Function to find the absolute y-position of a DOM object.
 h.findabspos_y            = function (obj, lastobj) {
  var curtop = 0, borderWidthTest = 0
  if (typeof lastobj == "undefined") lastobj = null
  do {
   borderWidthTest = parseFloat(window.getComputedStyle(obj).borderTopWidth)
   if (!isNaN(borderWidthTest)) curtop += borderWidthTest
   if (obj.offsetParent == lastobj) return curtop // If offsetParent is lastobj (or null if lastobj is null), return the result.
   curtop += obj.offsetTop
   obj = obj.offsetParent
  } while (true)
 }
 // Function to find the absolute position of a DOM object, taking CSS scale transforms into account.
 var findabspos_zoom =
 h.findabspos_zoom         = function (obj, lastobj) {
  var curleft = 0, curtop = 0, zoom_level_x = 0, zoom_level_y = 0, borderWidthTest = 0
  if (typeof lastobj == "undefined") lastobj = null
  do {
   if (obj.offsetParent == lastobj) {
    zoom_level_x = 1; zoom_level_y = 1
   } else {
    zoom_level_x = get_inherited_transform(obj.offsetParent, {transform_type: "scale", xy: "x"})
    zoom_level_y = get_inherited_transform(obj.offsetParent, {transform_type: "scale", xy: "y"})
   }
   borderWidthTest = parseFloat(window.getComputedStyle(obj).borderLeftWidth)
   if (!isNaN(borderWidthTest)) curleft += borderWidthTest * zoom_level_x
   borderWidthTest = parseFloat(window.getComputedStyle(obj).borderTopWidth)
   if (!isNaN(borderWidthTest)) curtop += borderWidthTest * zoom_level_y
   if (obj.offsetParent == lastobj) return [curleft, curtop] // If offsetParent is lastobj (or null if lastobj is null), return the result.
   curleft += obj.offsetLeft * zoom_level_x
   curtop  += obj.offsetTop  * zoom_level_y
   obj = obj.offsetParent
  } while (true)
 }
 // Function to find the absolute x-position of a DOM objet, taking CSS scale transforms into account.
 var findabspos_zoom_x = 
 h.findabspos_zoom_x       = function (obj, lastobj) {
  var curleft = 0, zoom_level_x = 0, borderWidthTest = 0
  if (typeof lastobj == "undefined") lastobj = null
  do {
   if (obj.offsetParent == lastobj) {
    zoom_level_x = 1
   } else {
    zoom_level_x = get_inherited_transform(obj.offsetParent, {transform_type: "scale", xy: "x"})
   }
   borderWidthTest = parseFloat(window.getComputedStyle(obj).borderLeftWidth)
   if (!isNaN(borderWidthTest)) curleft += borderWidthTest * zoom_level_x
   if (obj.offsetParent == lastobj) return curleft // If offsetParent is lastobj (or null if lastobj is null), return the result.
   curleft += obj.offsetLeft * zoom_level_x
   obj = obj.offsetParent
  } while (true)
 }
 // Function to find the absolute y-position of a DOM object, taking CSS scale transforms into account.
 var findabspos_zoom_y =
 h.findabspos_zoom_y       = function (obj, lastobj) {
  var curtop = 0, zoom_level_y = 0, borderWidthTest = 0
  if (typeof lastobj == "undefined") lastobj = null
  do {
   if (obj.offsetParent == lastobj) {
    zoom_level_y = 1
   } else {
    zoom_level_y = get_inherited_transform(obj.offsetParent, {transform_type: "scale", xy: "y"})
   }
   borderWidthTest = parseFloat(window.getComputedStyle(obj).borderTopWidth)
   if (!isNaN(borderWidthTest)) curtop += borderWidthTest * zoom_level_y
   if (obj.offsetParent == lastobj) return curtop // If offsetParent is lastobj (or null if lastobj is null), return the result.
   curtop += obj.offsetTop * zoom_level_y
   obj = obj.offsetParent
  } while (true)
 }
 // Example usage: get_inherited_transform (obj, {transform_type:scale, xy:"x"})
 var get_inherited_transform =
 h.get_inherited_transform = function (obj, init) {
  var transform_type = init.transform_type
  var xy             = init.xy
  var transform_string = ""
  var transform_array  = []
  switch (transform_type) {
   case "scale":
    var scale = 1
    while (true) {
     transform_string = getTransformString(obj)
     if (transform_string != false) {
      transform_array = (transform_string.slice(7, transform_string.length - 6)).split(",")
      switch (xy) {
       case "x": scale *= parseFloat(transform_array[0]); break
       case "y": scale *= parseFloat(transform_array[3]); break
      }
     }
     var obj = obj.parentNode
     if (obj.parentNode == null) break
    }
   return scale
  }
  
  function getTransformString (obj) {
   var transform_string = window.getComputedStyle(obj)["Transform"]
   if (typeof transform_string == "undefined") {transform_string = window.getComputedStyle(obj)["msTransform"]}
   if (typeof transform_string == "undefined") {transform_string = window.getComputedStyle(obj)["webkitTransform"]}
   if (typeof transform_string == "undefined") {transform_string = window.getComputedStyle(obj)["MozTransform"]}
   if (typeof transform_string == "undefined") {transform_string = window.getComputedStyle(obj)["OTransform"]}
   if ((typeof transform_string == "undefined") || (transform_string == "none")) return false
   return transform_string
  }
 }
}
// </Mouse/DOM object position functions.>

// <Ajax / download functions. TAG: ajax, TAG: xhr, TAG: download, TAG: downloads.>
if (h.library_settings.download) {
 // Create a download prompt.
 h.file_download = function (url, data_array) {
  // Url and data options required.
  if (!url || !data_array) return
  // Split parameters into form inputs.
  var input_text = ""
  for (var i in data_array) {
   current_value = data_array[i]
   input_text += '<input type="hidden" name="'+i+'" value="'+current_value+'" />'
  }
   // Send the request.
  var hidden_form = document.createElement ('form')
  hidden_form.action = url
  hidden_form.method = 'post'
  hidden_form.innerHTML = input_text
  document.body.appendChild (hidden_form)
  hidden_form.submit ()
  document.body.removeChild (hidden_form)
 }
 // Ajax functions.
 h.ajax = function () {
  var ajax = {}
  
  function merge_objects (secondary, primary) {
   if (typeof secondary == "undefined") var primary = primary.primary, secondary = primary.secondary
   var new_object = {}
   for (var property in secondary) {new_object[property] = secondary[property]}
   for (var property in primary)   {new_object[property] = primary  [property]}
   return new_object
  }
  // Only ajax_queue.add, ajax_queue.group_add, ajax_queue.group_run, and ajax_queue.run are exposed.
  var ajax_queue = ajax.queue = function () {
   var ajax_queue = {}
   var queue_list = {}
   
   // Enqueue an ajax function: If the queue is locked, add it to the queue. Otherwise, run it.
   // Parameters: .name and .data.
   ajax_queue.enqueue = ajax_queue.add = function (init) {
    var name = (typeof init.name != "undefined") ? init.name : "default"
    if (typeof queue_list[name] == "undefined") queue_list[name] = {locked: false, queue: []}
    var queue = queue_list[name]
    if (queue.locked) {
     queue.queue_function.push (init.function)
     queue.queue_data.push     (init.data)
     return
    }
    process (init)
   }
   
   // Process an entry.
   function process (init) {
    var name          = init.name
    var data          = init.data
    queue_list[name].locked = true
    init.function.apply (null, init.data)
    ["success", "error", "callback"].forEach (function (func) {
     init.data[func] = function () {
      queue_list[name].locked = false
      init.data[func].apply (null, Array.prototype.slice.call(arguments))
     }
    })
   }
  } ()
  
  // A "latch"?
  ajax.create_accumulator = function (init) {
   var default_function = init.function
   var func_list    = []
   var run_list     = []
   var resolve_func = undefined
   var test_counter = 0
   
   var accumulator = {add: add, add_custom: add_custom, resolve: resolve, test: test}; return accumulator
   function add () {func_list.push (default_function); run_list.push (Array.prototype.slice.call(arguments))}  
   function add_custom (init) {
    var func = (typeof init.function != "undefined") ? init.function : default_function
    func_list.push (func); run_list.push (init.data)
   }   
   function resolve (new_resolve_func) {
    if (typeof new_resolve_func != "undefined") resolve_func = new_resolve_func
    test_counter += run_list.length
    run_list.forEach (function (params, i) {func_list[i].apply (null, params)})
    return accumulator
   }
   function test () {
    test_counter -= 1
    if (accumulator.test_progress) accumulator.test_progress (run_list.length - test_counter, run_list.length)
    if (test_counter == 0 && resolve_func) resolve_func ()
   }
  }
  
  // Get data. Parameters:
  // .plaintext / .send_data_as_plaintext, .is_asynchronous / .async, .charset, .data,
  // .ignore_request_status, .response_type, .header_list, .file, .request_method,
  // .error, .success.
  ajax.get_data = function (params) {
   // Convert request into GET or POST data.
   var send_data_as_plaintext = params.send_data_as_plaintext || params.plaintext || false
   var is_asynchronous = true
   if (typeof params.is_asynchronous != "undefined") is_asynchronous = params.is_asynchronous
   if (typeof params.async           != "undefined") is_asynchronous = params.async
   var charset = (typeof params.charset != "undefined") ? params.charset : ""
   var data    = (typeof params.data    != "undefined") ? params.data    : ""
   var ignore_request_status = (typeof params.ignore_request_status != "undefined") ? params.ignore_request_status : false
   var response_type         = (typeof params.response_type         != "undefined") ? params.response_type         : undefined
   var header_list           = (typeof params.header_list           != "undefined") ? params.header_list           : undefined
   
   // Call the request function.
   var http_request_result = make_request (params.file, data, send_data_as_plaintext, charset, is_asynchronous, response_type, header_list, params.request_method)
   var http_request        = http_request_result["http_request"]
   
   if (is_asynchronous == false) return process_http_request ()
   
   http_request.onreadystatechange = function () {if (http_request.readyState == 4) process_http_request ()}
   return http_request
   
   function process_http_request () {
    var response_text = http_request.responseText
    // If the request status isn't 200, send an error.
    if ((http_request.status != 200) && (ignore_request_status == false)) {
     response_text = {error: true, errormessage: response_text}
    } else {
     if ((send_data_as_plaintext != true) && (response_text != "")) {
      // Send an error if the JSON text can't be parsed.
      try {
       response_text = JSON.parse (response_text)
      } catch (err) {
       response_text = {error: true, errormessage: response_text}
       if (is_asynchronous == false) {return response_text} else {if (params.error) params.error(response_text); return}
      }
     }
    }
    
    // Send an error.
    if ((response_text != "") && (response_text.error == true)) {
     if (typeof params.error != "undefined") if (is_asynchronous == false) {return response_text} else {return params.error(response_text)}
     return
    }
    
    if (is_asynchronous == false) return response_text
    if (typeof params.success != "undefined") params.success (response_text)
   }
  }

  // Use XMLHttpRequest to get text data from a file.
  ajax.get_text_data = function (params) {return get_data (merge_objects(params, {plaintext: true}))}
  
  // Set text in a DOM element based on a filename (url).
  ajax.set_innerhtml_from_url = function (params) {
   return get_data (merge_objects (params, {plaintext: true, success: function (result) {obj.innerHTML = result; params.success ()}}))
  }
  
  // Use XMLHttpRequest to get a 32-bit integer 2D array from a set of data files in a zip.
  // Use XMLHttpRequest to get image data from a set of image files in a zip.
  // Requires the JSZip library: http://stuartk.com/jszip.
  if (typeof JSZip != "undefined") {
   function zip_imagelist_object () {
    var zip_src_to_generated_img_list = this.zip_src_to_generated_img_list = {}
    var deferred_list_src = {}, deferred_list_img = {}
    this.load = function (init) {
     zip_load_images ({
      filename : init.filename,
      async    : true,
      callback : load_complete
     })
     function load_complete (result) {
      var webworker_func = function (evt) {
       var result = evt.data
       
       // If a number is sent, store it. This will be the amount of array buffers that will be sent to the web worker.
       if (typeof result == "number") {self.arrayBuffer_list_total = result; return}
       
       // Define the arrayBuffer list and countdown for buffer array loading, or add 1.
       if (typeof self.arrayBuffer_list == "undefined") {self.arrayBuffer_list = []; self.arrayBuffer_list_loaded = 0}
       // If an array buffer is sent, add it to a list (array).
       self.arrayBuffer_list.push (result)
       arrayBuffer_list_loaded += 1
       // If the loaded amount equals the total, process the array buffer list.
       if (arrayBuffer_list_loaded != arrayBuffer_list_total) return
       
       var output = []
       for (var i = 0, curlen = arrayBuffer_list.length; i < curlen; i++) {
        output.push (new Blob([arrayBuffer_list[i]], {type: 'image/png'}))
       }
       postMessage (output)
      }
      if (typeof window.URL == "undefined") window.URL = window.webkitURL
      var web_worker = new Worker (window.URL.createObjectURL( new Blob(['onmessage = ' + webworker_func.toString()]) ))
      web_worker.onmessage = function (evt) {
       var web_worker_output = evt.data
       function get_domain_and_directory (url) {
        var last_index = url.lastIndexOf("/") + 1
        return url.substring(0, last_index)
       }
       var filename_dir = get_domain_and_directory (init.filename)
       var load_count = 0
       for (var i = 0, curlen = result_keys.length; i < curlen; i++) {
        var relative_url = filename_dir + result_keys[i]
        var img = new Image ()
        load_count += 1
        img.src = window.URL.createObjectURL(web_worker_output[i])
        img.onload = test_load_count
        zip_src_to_generated_img_list[relative_url] = img
        // Deferred SRCs.
        var test_deferred = deferred_list_src[relative_url]
        if (typeof test_deferred != "undefined") {
         for (var t = 0; t < test_deferred.length; t++) {
          var test_deferred_current = test_deferred[t]
          test_deferred_current[0][test_deferred_current[1]] = img.src
         }
         delete (deferred_list_src[relative_url])
        }
        // Deferred IMGs.
        var test_deferred = deferred_list_img[relative_url]
        if (typeof test_deferred != "undefined") {
         for (var t = 0; t < test_deferred.length; t++) {
          var test_deferred_current = test_deferred[t]
          test_deferred_current[0][test_deferred_current[1]] = img
         }
         delete (deferred_list_img[relative_url])
        }
       }
       function test_load_count (evt) {
        load_count -= 1
        if (load_count == 0) {if (typeof init.callback != "undefined") init.callback ()}
       }
      }
      
      // Start the web worker.
      var result_values = [], result_keys = []
      for (var i in result) {
       result_values.push (result[i])
       result_keys.push (i)
      }
      web_worker.postMessage (result_values.length)
      for (var i = 0, curlen = result_values.length; i < curlen; i++) {
       web_worker.postMessage (result_values[i], [result_values[i]])
      }
     }
    }
    this.get_src = function (zip_src) {
     return ((typeof zip_src_to_generated_img_list[zip_src] == "undefined") ? zip_src : zip_src_to_generated_img_list[zip_src].src)
    }
    this.get_img = function (zip_src) {
     return ((typeof zip_src_to_generated_img_list[zip_src] == "undefined") ? zip_src : zip_src_to_generated_img_list[zip_src])
    }
    this.get_src_deferred = function (zip_src, obj, prop) {
     if (zip_src.trim() == '') return ''
     if (typeof zip_src_to_generated_img_list[zip_src] == "undefined") {
      if (typeof deferred_list_src[zip_src] == "undefined") deferred_list_src[zip_src] = []
      deferred_list_src[zip_src].push ([obj, prop])
      return zip_src
     } else {
      return zip_src_to_generated_img_list[zip_src].src
     }
    }
    this.get_img_deferred = function (zip_src, obj, prop) {
     if (zip_src.trim() == '') return ''
     if (typeof zip_src_to_generated_img_list[zip_src] == "undefined") {
      if (typeof deferred_list_img[zip_src] == "undefined") deferred_list_img[zip_src] = []
      deferred_list_img[zip_src].push ([obj, prop])
      return zip_src
     } else {
      return zip_src_to_generated_img_list[zip_img]
     }
    }
   } 
   ajax.zip_load_images = function (init) {
    var filename = init.filename
    var async    = (typeof init.async    != "undefined") ? init.async    : true
    var callback = (typeof init.callback != "undefined") ? init.callback : function () {}
    var charset  = (typeof init.charset  != "undefined") ? init.charset  : true
    
    var base_url = window.location.protocol + "//" + window.location.host + '/'
    
    var make_request_result = make_request (filename, "", undefined, charset, async, 'arraybuffer', undefined, 'GET')
    var http_request        = make_request_result["http_request"]
    
    if (async == false) return process_http_request ()
    http_request.onreadystatechange = function () {if ((http_request.readyState == 4) && (http_request.status == 200)) process_http_request ()}
    
    function process_http_request () {
     var URL = window.URL
     var webworker_func = function (evt) {
      var response = evt.data
      if (typeof response == "string") {self.base_url = response; return}
      window = {}
      importScripts (self.base_url + 'js/plugins/jszip/jszip.js')
      importScripts (self.base_url + 'js/plugins/jszip/jszip-deflate.js', self.base_url + 'js/plugins/jszip/jszip-inflate.js')
      importScripts (self.base_url + 'js/plugins/jszip/jszip-load.js')
      var zip = new JSZip (response, {base64: false})
      var buffer_list = {}
      for (var filename_in_loop in zip.files) {
       if (filename_in_loop.trim().substr(-1, 1) == "/") continue
       buffer_list[filename_in_loop] = zip.file(filename_in_loop).asArrayBuffer()
      }
      self.postMessage (buffer_list)
     }
     var web_worker = new Worker(window.URL.createObjectURL( new Blob(['onmessage = ' + webworker_func.toString()]) ))
     web_worker.onmessage = function (evt) {
      var buffer_list = evt.data
      if (typeof callback != "undefined") callback (buffer_list)
     }
     web_worker.postMessage (base_url)
     web_worker.postMessage (http_request.response)
    }
   }
  }
  
  function make_request (url, data, send_data_as_plaintext, charset, is_asynchronous, response_type, header_list, request_method) {
   if ((typeof send_data_as_plaintext == "undefined") || (send_data_as_plaintext !== true)) send_data_as_plaintext = false
   if ((typeof is_asynchronous == "undefined") || (is_asynchronous != false)) is_asynchronous = true
   if (typeof charset == "undefined") {charset = ''} else {charset = '; charset=' + charset}
   var http_request = new XMLHttpRequest()
   if (!http_request) {alert ("Cannot create an XMLHTTP instance for some reason. Please try reloading the page.")}
   if (typeof request_method == "undefined") var request_method = ((data === null) ? "GET" : "POST")
   if (request_method == "GET") {
    // Add a "?" if the "?" doesn't already exist in the url. If "data" doesn't start with a "&", add it.
    if (typeof data == "string") {
     var altchar = (data[0] != "&") ? "&" : ""
     url += ((url.indexOf ("?") == -1) ? "?" : altchar) + data
    }
    data = null
   }
   http_request.open (request_method, url, is_asynchronous)
   if (typeof response_type != "undefined") http_request.responseType = response_type
   if (send_data_as_plaintext === true) {
    http_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded' + charset)
    if (typeof http_request.overrideMimeType != "undefined") http_request.overrideMimeType("text/plain; charset=x-user-defined")
   } else {
    http_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded' + charset)
   }
   if (header_list) {
    header_list.forEach (function (header) {http_request.setRequestHeader(header.name, header.content)})
   }
   http_request.send (data)
   return {"http_request": http_request}
  }
  ajax.is_library_container = true
  return ajax
 } ()
 h.get_data = h.ajax.get_data
}
// </Ajax / download functions>

// <DOM-widget functions. TAG: DOM, TAG: widgets, TAG: DOM widgets.>
if (h.library_settings.gui_widgets) {
 h.message_emitter_create = function () {
  if ((typeof this == "undefined") || (this == window)) return new message_emitter ()
  var main = this
  main.event_list = {}
  main.event_listener_list = []
  main.addEvent = function (event_name, func) {main.event_list[event_name] = func}
  main.addEventListener = function (event_name, func) {
   if (typeof main.event_listener_list[event_name] == "undefined") main.event_listener_list[event_name] = []
   main.event_listener_list[event_name].push (func)
  }
  main.message_silent = false
  main.send_message = function (message) {
  console.log (message)
   var triggered_events = {}
   for (var evt_name in main.event_list) {var evt = main.event_list[evt_name]; if (evt(message)) triggered_events[evt_name] = main.event_listener_list[evt_name]}
   for (var evt_name in triggered_events) {
    var event_listener_sublist = main.event_listener_list[evt_name]
    for (var i = 0, curlen = event_listener_sublist.length; i < curlen; i++) {event_listener_sublist[i] ()}
   }
   if (main.message_silent == true) alert (message, {}, function () {main.message_silent = true})
   main.message_silent = false
  }
 }
 h.add_li_menu_options    = function (parent, options) {
  for (var i = 0, curlen = options.length; i < curlen; i++) {
   var temp_li = document.createElement('li')
   parent.appendChild (temp_li)
   var current_option = options[i]
   // Add text and click function.
   temp_li.innerHTML = current_option.text
   temp_li.addEventListener ('click', current_option.func)
   // Run the immediate function, if it exists.
   if (typeof current_option.immediate_func == "function") current_option.immediate_func (temp_li)
   // Copy properties.
   for (var p in current_option) {if ((p != 'text') && (p != 'func') && (p != 'immediate_func')) temp_li[p] = current_option[p]}
  }
 }
 h.button                 = function (init) {
  var button_div = document.createElement ('div')
  var parent     = init.parent
  var className  = init.className
  var style      = init.style
  var text       = init.text
  button_div.destroy = function () {
   for (var property in init) {
    if (['parent', 'className', 'style', 'text'].indexOf (property) == -1) button_div.removeEventListener (property, init[property])
   }
   button_div.parentNode.removeChild (button_div)
   button_div = null
  }
  for (var property in init) {
   if (['parent', 'className', 'style', 'text'].indexOf (property) == -1) button_div.addEventListener (property, init[property])
  }
  if (typeof text      != "undefined") button_div.innerHTML = text
  if (typeof className != "undefined") button_div.className = className
  if (typeof style     != "undefined") setStyle (button_div, style)
  Object.defineProperty (button_div, 'text', {get: function () {return button_div.innerHTML}, set: function (text) {button_div.innerHTML = text}})
  parent.appendChild (button_div)
  return button_div
 }
 h.gui_close_button       = function (init) {
  var close_button = document.createElement('div')
  init.parent.appendChild (close_button)
  close_button.className = "gui-window-close_button"
  addEvent (close_button, 'click', function (evt) {init.close_function (); evt.stopPropagation(); return false})
  return close_button
 }
 h.sliderbar              = function (init) {
  var main = (typeof init.main_element != "undefined") ? init.main_element : document.createElement('div')
  Object.defineProperty(main, 'parent', {
   get: function () {return parent},
   set: function (new_parent) {
    if ((typeof new_parent != "object") || (!(new_parent instanceof HTMLElement))) return
    parent = new_parent; new_parent.appendChild(main); if (main.textbox) new_parent.appendChild(main.textbox)
   }
  })
  var parent = main.parent = init.parent
  var background_style            = init.background_style
  var foreground_container_style  = init.foreground_container_style
  var foreground_style            = init.foreground_style
  var foreground_inverse_style    = init.foreground_inverse_style
  var background_class            = init.background_class
  var foreground_container_class  = init.foreground_container_class
  var foreground_class            = init.foreground_class
  var foreground_inverse_class    = init.foreground_inverse_class
  var background_beyond_max_style = init.background_beyond_max_style
  var pivot_slice_style           = init.pivot_slice_style
  var pivot_slice_class           = init.pivot_slice_class
  var control_style               = init.control_style
  var control_image_src           = init.control_image
  var control_class               = init.control_class
  var point_initial               = (typeof init.point_initial     != "undefined") ? init.point_initial : 0
  var orientation                 = ((typeof init.orientation      != "undefined") && (init.orientation      == "vertical")) ? "vertical" : "horizontal"
  var use_touch_events            = ((typeof init.use_touch_events != "undefined") && (init.use_touch_events == true      )) ? true       : false
  var use_mouse_events            = ((typeof init.use_mouse_events == "undefined") || (init.use_mouse_events == true      )) ? true       : false
  main.start_condition            = (typeof init.start_condition != "undefined") ? init.start_condition : undefined
  main.events                     = {update: ("events" in init) ? init.events.update : undefined}
  main.point_maximum              = (typeof init.point_maximum     == "number") ? init.point_maximum : 100
  main.pivot_point                = (typeof init.pivot_point       == "number") ? init.pivot_point   : 0
  main.point_upper_limit          = (typeof init.point_upper_limit == "number") ? init.point_upper_limit : 100
  main.textbox_enabled            = init.textbox_enabled || false
  main.control_unit_offset        = (typeof init.control_unit_offset == "number") ? init.control_unit_offset : 0
  main.css_unit_type              = init.css_unit_type || "px"
  main.recalculate_size           = (typeof init.recalculate_size != "undefined") ? init.recalculate_size : true
  
  var width_height    = (orientation == "horizontal") ? "width"           : "height"
  var left_top        = (orientation == "horizontal") ? "left"            : "top"
  var pageXY          = (orientation == "horizontal") ? "pageX"           : "pageY"
  var orientation_xy  = (orientation == "horizontal") ? "x"               : "y"
  var findabspos_zoom = (orientation == "horizontal") ? h.findabspos_zoom_x : h.findabspos_zoom_y
  
  var px_to_css_unit_type_fixed = undefined
  
  function px_to_css_unit_type () {
   if (main.css_unit_type == "px") return 1
   if ((!main.recalculate_size) && (typeof px_to_css_unit_type_fixed != "undefined")) return px_to_css_unit_type_fixed
   var mydiv = document.createElement('div'); mydiv.style.visibility = 'hidden'; mydiv.style.width = '1' + main.css_unit_type
   parent.appendChild(mydiv); var w = mydiv.getBoundingClientRect().width; parent.removeChild(mydiv)
   if (!main.recalculate_size) px_to_css_unit_type_fixed = w
   return w
  }
  function calculate_physical_max (pxc, zoom_level) {
   if (typeof zoom_level == "undefined") zoom_level = calculate_zoom_level()
   if (typeof pxc        == "undefined") pxc        = px_to_css_unit_type()
   var style = window.getComputedStyle(main)
   var box_sizing = (style.boxSizing != "") ? style.boxSizing : style.mozBoxSizing
   if (box_sizing == "border-box") {
    var border_and_padding_adjustment = 0
   } else {
    var border_and_padding_adjustment = (orientation == "horizontal"
     ? parseFloat(window.getComputedStyle(main).borderLeftWidth) + parseFloat(window.getComputedStyle(main).borderRightWidth)
     : parseFloat(window.getComputedStyle(main).borderTopWidth)  + parseFloat(window.getComputedStyle(main).borderBottomWidth)
    )
   }
   border_and_padding_adjustment += (orientation == "horizontal"
    ? parseFloat(window.getComputedStyle(main).paddingLeft) + parseFloat(window.getComputedStyle(main).paddingRight)
    : parseFloat(window.getComputedStyle(main).paddingTop)  + parseFloat(window.getComputedStyle(main).paddingBottom)
   )
   var is_not_border_box = (box_sizing != "border-box") ? 1 : 0
   return (main.getBoundingClientRect()[width_height] - main.control.getBoundingClientRect()[width_height]) / (pxc * zoom_level) - border_and_padding_adjustment / pxc - main.control_unit_offset * 2
  }
  
  var zoom_level_fixed = undefined
  function calculate_zoom_level () {
   if ((!main.recalculate_size) && (typeof zoom_level_fixed != "undefined")) return zoom_level_fixed
   var zoom_level = h.get_inherited_transform(main, {transform_type: "scale", xy: orientation_xy})
   if (!main.recalculate_size) zoom_level_fixed = zoom_level
   return zoom_level
  }
  
  // Add a linked textbox object if it is set.
  if (main.textbox_enabled != true) {
   var textbox = main.textbox = undefined
  } else {
   var textbox = main.textbox = document.createElement('div')
   textbox.className = init.textbox_class || ''; h.add_style(textbox, init.textbox_style || '')
   parent.appendChild(textbox)
   if (typeof init.textbox_prefix != "undefined") {
    var textbox_prefix = document.createElement('div')
    textbox_prefix.className = init.textbox_prefix_class || ''; h.add_style(textbox_prefix, init.textbox_prefix_style || '')
    textbox_prefix.innerHTML = init.textbox_prefix || ''
    textbox.appendChild(textbox_prefix)
   }
   var textbox_number = document.createElement('input')
   h.add_style(textbox_number, init.textbox_number_style || ''); textbox_number.className = init.textbox_number_class || ''
   textbox_number.type = "text"
   textbox_number.readOnly = false
   textbox_number.addEventListener('input', textbox_change)
   textbox_number.addEventListener('keypress', textbox_keypress)
   textbox.appendChild(textbox_number)
   if (typeof init.textbox_suffix != "undefined") {
    var textbox_suffix = document.createElement('div')
    textbox_suffix.className = init.textbox_suffix_class  || ''; h.add_style(textbox_suffix, init.textbox_suffix_style || '')
    textbox_suffix.innerHTML = init.textbox_suffix || ''
    textbox.appendChild(textbox_suffix)
   }
   function textbox_change (evt) {
    var curvalue = parseFloat(textbox_number.value)
    if ((isNaN(curvalue)) || (curvalue < 0)) curvalue = 0
    if (curvalue > main.point_upper_limit) curvalue = main.point_upper_limit
    main.set_position_by_point_value(curvalue)
   }
   function textbox_keypress (evt) {var keyCode = evt.keyCode; if (keyCode == 13) textbox_number.blur()}
   function textbox_update_value (pxc) {
    if (typeof pxc == "undefined") pxc = px_to_css_unit_type()
    textbox_number.value = Math.round((main.point_upper_limit * main.position) / calculate_physical_max(pxc))
   }
   function textbox_blur (evt) {
    if (main.textbox_enabled == false) return
    if (evt.currentTarget == textbox_number) return
    textbox_number.blur()
   }
   function textbox_focus (evt) {
    if (main.textbox_enabled == true) return
    if (evt.currentTarget == textbox_number) return
    textbox_number.focus()
   }
  }
  
  function update_foreground_width_height () {
   main.foreground.style[width_height]         = (((main.position + main.control_unit_offset) >= 0) ? main.position : 0) + main.css_unit_type
   main.foreground_inverse.style[width_height] = "100%"
  }
  
  // Set the main object (background) class and style. Don't override the original style with a blank if a new one isn't defined.
  main.className = init.background_class || ''; if (typeof background_style != "undefined") h.add_style(main, background_style)
  
  // Create the "background_beyond_max" object and set its class and style.
  if ((typeof background_beyond_max_style != 'undefined') || (typeof background_beyond_max_class != 'undefined')) {
   main.background_beyond_max = document.createElement('div'); main.background_beyond_max.className = init.background_beyond_max_class || ''; h.add_style(main.background_beyond_max, background_beyond_max_style || '')
   main.appendChild(main.background_beyond_max)
  }
  
  // Create the foreground object and set its class and style.
  main.foreground_container = document.createElement ('div'); h.add_style(main.foreground_container, "position: relative; overflow: hidden; "+width_height+": 100%; line-height: 0")
  main.foreground_container.className = foreground_container_class || ''; h.add_style(main.foreground_container, foreground_container_style || '')
  main.appendChild(main.foreground_container)
  main.foreground_container.style.pointerEvents = "none"
  
  main.foreground = document.createElement('div'); main.foreground.className = foreground_class || ''; h.add_style(main.foreground, foreground_style || '')
  main.foreground_container.appendChild(main.foreground)
  main.foreground.style.pointerEvents = "none"
  
  main.foreground_inverse = document.createElement('div'); main.foreground_inverse.className = foreground_inverse_class || ''; h.add_style(main.foreground_inverse, foreground_inverse_style || '')
  main.foreground_container.appendChild(main.foreground_inverse)
  main.foreground_inverse.style.pointerEvents = "none"
  
  // Create the control object and set its class and style.
  var control_element_type = (typeof control_image_src != "undefined") ? "img" : "div"
  main.control = document.createElement(control_element_type)
  main.control.style.pointerEvents = "none"
  main.control.className = control_class || ''
  h.add_style(main.control, control_style || '')
  
  if (typeof control_image_src != "undefined") main.control.src = control_image_src
  main.appendChild(main.control)
  
  // Now make the pivot slice element.
  if (typeof pivot_slice_style != 'undefined') {
   main.pivot_slice = document.createElement('div'); main.pivot_slice.className = pivot_slice_class || ''; h.add_style(main.pivot_slice, pivot_slice_style || '')
   main.appendChild(main.pivot_slice)
  }
  
  // Calculate the physical control position max, calculate the logical control position max, and set the initial physical control position.
  main.update = function () {
   if (typeof main.position != "undefined") var logical_position = main.position / main.position_logical_max
   var pxc        = px_to_css_unit_type()
   var zoom_level = calculate_zoom_level()
   main.position_physical_max = calculate_physical_max(pxc, zoom_level)
   main.position_logical_max  = main.position_physical_max * (main.point_maximum / main.point_upper_limit)
   if (typeof main.position == "undefined") {
    main.position = main.position_physical_max * (point_initial / main.point_upper_limit)
   } else {
    main.position = logical_position * main.position_logical_max
   }
   // Set the control left/top position and the foreground width/height.
   main.control.style[left_top] = (main.position + main.control_unit_offset) + main.css_unit_type
   update_foreground_width_height()
   if ((typeof background_beyond_max_style != 'undefined') || (typeof background_beyond_max_class != 'undefined')) {
    main.background_beyond_max.style[width_height] = (main.position_physical_max - main.position_logical_max) + main.css_unit_type
    main.background_beyond_max.style[left_top]     = main.position_logical_max + main.css_unit_type
   }
   if (typeof pivot_slice_style != 'undefined') {
    main.pivot_start = main.position_physical_max * (main.pivot_point / main.point_upper_limit)
    main.pivot_end   = main.position
    main.pivot_slice.style[width_height] = Math.abs(main.pivot_end - main.pivot_start) + main.css_unit_type
    main.pivot_slice.style[left_top]     = ((main.pivot_end > main.pivot_start) ? main.pivot_start : main.pivot_end) + main.css_unit_type
   }
   if (main.textbox) textbox_update_value(pxc)
  }
  
  main.update()
  
  var startscroll = false, startxy = 0, offsetxy = 0     
  if (use_mouse_events) {  
   main.addEventListener     ('mousedown', mousedown)
   main.addEventListener     ('mouseover', mousemove)
   main.addEventListener     ('mousemove', mousemove)
   document.addEventListener ('mouseup'  , mouseup_or_blur)
   window.addEventListener   ('blur'     , mouseup_or_blur)
   window.addEventListener   ('mouseout' , mouseout)
  }
  if (use_touch_events) {
   main.addEventListener     ('touchstart' , touchstart)
   main.addEventListener     ('touchmove'  , mousemove)
   document.addEventListener ('touchend'   , mouseup_or_blur)
   window.addEventListener   ('touchcancel', mouseup_or_blur)
   window.addEventListener   ('touchleave' , mouseup_or_blur)
  }
  if (main.textbox) {
   document.removeEventListener       ((!use_touch_events) ? 'mousedown' : 'touchstart', textbox_blur)
   textbox_number.removeEventListener ((!use_touch_events) ? 'click'     : 'touchend',  textbox_focus)
   textbox_number.removeEventListener ('input'   , textbox_change)
   textbox_number.removeEventListener ('keypress', textbox_keypress)
  }
  
  function mousedown (evt) {
   evt.preventDefault()
   if (evt.target != evt.currentTarget) return
   if (h.get_right_click(evt) || (main.start_condition && !main.start_condition(main)) || startscroll == true) return
   var pxc        = px_to_css_unit_type()
   var zoom_level = calculate_zoom_level()
   main.update_position(pxc, zoom_level)
   offsetxy = (main.control.getBoundingClientRect()[width_height] / 2) / (zoom_level * pxc)
   startscroll = true
   mousemove(evt, pxc, zoom_level)
  }
  
  function touchstart (evt) {mousemove(evt); mousedown (evt)}
  
  function mousemove (evt, pxc, zoom_level) {
   if (evt.currentTarget == main) evt.preventDefault()
   if (startscroll == false) return
   if (typeof pxc        == "undefined") pxc        = px_to_css_unit_type()
   if (typeof zoom_level == "undefined") zoom_level = calculate_zoom_level()
   var xy = (evt.changedTouches ? evt.changedTouches[0] : evt)[pageXY] / (zoom_level * pxc)
   main.set_position(xy - offsetxy - startxy - main.control_unit_offset, true, pxc, evt)
  }
  
  function mouseout (evt) {
   evt.preventDefault()
   var coords = (evt.changedTouches ? evt.changedTouches[0] : evt)
   var mouseX = coords.pageX, mouseY = coords.pageY
   var windowScrollX = (typeof window.scrollX != "undefined") ? window.scrollX : document.body.scrollLeft
   var windowScrollY = (typeof window.scrollY != "undefined") ? window.scrollY : document.body.scrollTop
   if (((mouseY >= 0)) && ((mouseY <= window.innerHeight + windowScrollY)) && ((mouseX >= 0) && mouseX <= (window.innerWidth + windowScrollX))) return
   mouseup_or_blur(evt)
  }
  function mouseup_or_blur (evt) {
   if (startscroll == false) return
   if (evt.target != main) {main.events.update(main, evt)} else {
   mousemove(evt, px_to_css_unit_type(), calculate_zoom_level())}
   startscroll = false
  }
  
  main.update_position = function (pxc, zoom_level) {
   if (typeof pxc        == "undefined") pxc        = px_to_css_unit_type()
   if (typeof zoom_level == "undefined") zoom_level = calculate_zoom_level()
   startxy = findabspos_zoom(main) / (pxc * zoom_level)
  }
  
  main.set_position = function (new_position, trigger_update_event, pxc, evt) {
   main.position = new_position
   main.position_logical_max = main.position_physical_max * (main.point_maximum / main.point_upper_limit)
   if (main.position > main.position_logical_max) {
    main.position = main.position_logical_max
   } else {
    if (main.position < 0) main.position = 0
   }
   main.control.style[left_top] = (main.position + main.control_unit_offset) + main.css_unit_type
   update_foreground_width_height()
   if (typeof pivot_slice_style != 'undefined') {
    main.pivot_start = main.position_physical_max * (main.pivot_point / main.point_upper_limit)
    main.pivot_end   = main.position
    update_foreground_width_height()
   }
   if (main.textbox_enabled == true) textbox_update_value(pxc)
   if (trigger_update_event && main.events.update) main.events.update(main, evt)
  }
  main.set_position_percent = function (new_point_value, trigger_update_event, evt) {
   main.set_position(main.position_physical_max * new_point_value / main.point_upper_limit, trigger_update_event, px_to_css_unit_type(), evt)
  }
  main.get_position_percent = function () {return (main.position / main.position_physical_max * main.point_upper_limit)}
  
  main.destroy = function () {
   if (use_mouse_events) {
    main.removeEventListener     ('mousedown', mousedown)
    main.removeEventListener     ('mouseover', mousemove)
    main.removeEventListener     ('mousemove', mousemove)
    document.removeEventListener ('mouseup'  , mouseup_or_blur)
    window.removeEventListener   ('blur'     , mouseup_or_blur)
    window.removeEventListener   ('mouseout' , mouseout)
   }
   if (use_touch_events) {
    main.removeEventListener     ('touchstart' , touchstart)
    main.removeEventListener     ('touchmove'  , mousemove)
    document.removeEventListener ('touchend'   , mouseup_or_blur)
    window.removeEventListener   ('touchcancel', mouseup_or_blur)
    window.removeEventListener   ('touchleave' , mouseup_or_blur)
   }
   if (main.textbox) {
    document.removeEventListener       ((!use_touch_events) ? 'mousedown' : 'touchstart', textbox_blur)
    textbox_number.removeEventListener ((!use_touch_events) ? 'click'     : 'touchend',  textbox_focus)
    textbox_number.removeEventListener ('input'   , textbox_change)
    textbox_number.removeEventListener ('keypress', textbox_keypress)
   }
   var current_parent = main.parentNode; if (current_parent != null) current_parent.removeChild(main)
  }
  
  //If MutationObserver is defined, call main.destroy when the object is removed from a parent element.
  var MutationObserver = window.MutationObserver || window.WebkitMutationObserver
  if (typeof MutationObserver != "undefined") {
   var observer = new MutationObserver (function (mutation_list) {
    for (var i = 0, curlen_i = mutation_list.length; i < curlen_i; i++) {
     var mutation_item = mutation_list[i]
     if (mutation_item.type != 'childList') return
     for (var j = 0, curlen_j = mutation_item.removedNodes.length; j < curlen_j; j++) {
      if (mutation_item.removedNodes[j] != main) continue
      main.destroy(); observer.disconnect(); return
     }
    }
   })
   observer.observe(parent, {attributes: false, childList: true, subtree: false})
  }
  return main
 }
 h.red_blue_arrow         = function (init) {
  var parent      = init['parent']
  var style       = init['style']
  var main        = document.createElement('div'); parent.appendChild (main)
  main.thickness  = parseFloat(init['thickness'])
  main.bar_length = parseFloat(init['bar length'])
  main.tip_length = parseFloat(init['tip length'])
  main.left   = document.createElement('img') ; main.appendChild (main.left)
  main.middle = document.createElement('img') ; main.appendChild (main.middle)
  main.right  = document.createElement('img') ; main.appendChild( main.right)
  if (typeof main.thickness  == 'undefined') main.thickness  = "63px"
  if (typeof main.bar_length == 'undefined') main.bar_length = "428px"
  if (typeof main.tip_length == 'undefined') main.tip_length = "32px"
  main.left.src   = "images/gui/interface-blue-red arrow left.png"   ; setStyle (main.left  , "position:absolute; height:" + main.thickness + "px; width:" + main.tip_length + 'px; top:0; left:0')
  main.middle.src = "images/gui/interface-blue-red arrow middle.png" ; setStyle (main.middle, "position:absolute; height:" + main.thickness + "px; width:" + main.bar_length + 'px; top:0; left:' + main.tip_length + 'px')
  main.right.src  = "images/gui/interface-blue-red arrow right.png"  ; setStyle (main.right , "position:absolute; height:" + main.thickness + "px; width:" + main.tip_length + 'px; top:0; left:' + (main.tip_length + main.bar_length) + 'px')
  setStyle (main, style)
  main.style.display = "inline-block"
  main.style.width  = (main.tip_length * 2 + main.bar_length) + 'px'
  main.style.height = main.thickness + 'px'
  return main
 }
 h.loadingbar_object      = function (init) {
  var loadingbar = document.createElement ('div')
  loadingbar.parent          = init.parent
  loadingbar.loading_string  = init.loading_string || "Loading... "
  loadingbar.percent         = init.percent        || 0
  loadingbar.show_percent    = init.show_percent   || true
  loadingbar.loadinginnerbar = document.createElement('div')
  loadingbar.loadingouterbar = document.createElement('div')
  var loadingbar_position = ((typeof init.position != "undefined") ? init.position : "absolute")
  setStyle (loadingbar, 'position:'+loadingbar_position+'; z-index:0; width:50%; height:2.5em; border: 1px solid #8F8F8F')
  setStyle (loadingbar.loadingouterbar, 'position:absolute; left:0; top:0; height:100%; width:100%; background-color:#8F0000')
  setStyle (loadingbar.loadinginnerbar, 'position:absolute; left:0; top:0; height:100%; width:0%; background-color:#FFFFFF')
  loadingbar.loadingbartext1 = document.createElement('div')
  setStyle (loadingbar.loadingbartext1, 'position:absolute; left:0; top:0; margin:.125em; width:100%; text-align:center; color:#C0C0C0; font-size:1.5em; font-family:arial; display:block')
  loadingbar.appendChild (loadingbar.loadingouterbar)
  loadingbar.appendChild (loadingbar.loadinginnerbar)
  loadingbar.appendChild (loadingbar.loadingbartext1)
  loadingbar.parent.appendChild (loadingbar)
  if (loadingbar_position == "absolute") {
   loadingbar.style.left = parseFloat((loadingbar.parent.clientWidth - loadingbar.clientWidth) / 2) + 'px'
   loadingbar.style.top  = parseFloat((loadingbar.parent.clientHeight - loadingbar.clientHeight) / 2) + 'px'
  } else if (loadingbar_position == "fixed") {
   loadingbar.style.left = '50%'
   loadingbar.style.top  = '50%'
   loadingbar.style.marginLeft = -(loadingbar.clientWidth  / 2) + 'px'
   loadingbar.style.marginTop  = -(loadingbar.clientHeight / 2) + 'px'
  }
  
  loadingbar.set_percent = function (percent) {loadingbar.percent = percent; loadingbar.update ()}
  
  loadingbar.add_percent = function (percent_to_add) {loadingbar.percent += percent_to_add; loadingbar.update ()}
  
  loadingbar.update = function () {
   var rounded_percent = Math.round(loadingbar.percent)
   if (rounded_percent >= 100) {remove_all_descendants_and_self (loadingbar); return}
   var percentstring = rounded_percent.toString()
   loadingbar.loadinginnerbar.style.width = percentstring + "%"
   loadingbar.loadingbartext1.innerHTML = loadingbar.loading_string + ((loadingbar.show_percent == true) ? (percentstring + "% done.") : "")
  }
  
  loadingbar.update ()
  return loadingbar
 }
// </DOM-widget functions.>
}

if (h.library_settings.dom_manipulation) {
// <DOM object prototypes. TAG: DOM, TAG: DOM objects, TAG: prototypes.>
 // Add forEach to "HTMLCollection" items.
 //["forEach"].forEach (function (op) {
 // NodeList.prototype[op] = HTMLCollection.prototype[op] = function (callback, thisArg) {
 //  return Array.prototype.slice.call(this)[op] (callback, thisArg)
 // }
 //})
 ["forEach"].forEach (function (op) {
  h.proto.NodeList[op] = h.proto.HTMLCollection[op] = function (obj, callback, thisArg) {
   return Array.prototype.slice.call(obj)[op] (callback, thisArg)
  }
 })
 // Is the element attached to the DOM?
 // (Don't hate me cause I'm a prototype!)
 h.proto.HTMLElement.is_attached            = function (obj) {
  while (true) {
   obj = obj.parentNode
   if (obj == document.documentElement) return true
   if (obj == null) return false
  }
 }
 // Others: adoptChildren, stealChildren, window.childServices. Props to averyvery on the last one!
 h.proto.HTMLElement.append_children_of     = function (obj, source) {
  while (source.firstChild) {obj.appendChild (source.firstChild)}
  return obj
 }
 h.proto.HTMLElement.set_position_on_left   = function (obj) {
  var marginLeft_stored = parseFloat(window.getComputedStyle(obj)['marginLeft'])
  var width_stored      = obj.offsetWidth
  obj.style.marginLeft = -width_stored + 'px'
  obj.style.left       = (width_stored - marginLeft_stored) + 'px'
 }
 h.proto.HTMLElement.set_position_on_right  = function (obj) {
  var marginRight_stored = parseFloat(window.getComputedStyle(obj)['marginRight'])
  var width_stored       = obj.offsetWidth
  obj.style.marginRight = -width_stored + 'px'
  obj.style.right       = (width_stored + marginRight_stored) + 'px'
  return obj
 }
 h.proto.HTMLElement.set_position_on_center = function (obj) {
  obj.style.left = (get_client_width_full(obj.parentNode, {margin: obj}) - get_client_width_full(obj, {margin: obj})) / 2 + 'px'
  return obj
 }
 // </DOM object prototypes.>
 // <DOM manipulation functions. TAG: px, TAG: CSS, TAG: DOM, TAG: dom, TAG: style.>
 h.get_caret_position                = function (obj) { 
  if (obj.selectionStart) return obj.selectionStart
  if (document.selection) { 
   obj.focus ()
   var r = document.selection.createRange () 
   if (r == null) return 0
   var re = obj.createTextRange ()
   rc = re.duplicate()
   re.moveToBookmark(r.getBookmark ())
   rc.setEndPoint('EndToStart', re)
   return rc.text.length
  }
  return 0
 }
 h.set_caret_position                = function (obj, pos) {
  if (obj.setSelectionRange) {
   obj.focus ()
   obj.setSelectionRange(pos, pos)
  } else if (obj.createTextRange) {
   var range = obj.createTextRange ()
   range.collapse (true)
   range.moveEnd ('character', pos)
   range.moveStart ('character', pos)
   range.select ()
  }
 }
 h.set_scrolltop                     = function (amount, obj) {
  if ((typeof obj == 'undefined') || (obj == null)) {
   if (typeof window.opera == 'undefined') { // Opera detection
    document.body.scrollTop -= amount
    document.documentElement.scrollTop -= amount   
   }
  }
 }
 h.clearfocus                        = function () {
  var hocuspocus = document.createElement('input')
  document.body.appendChild(hocuspocus); hocuspocus.focus()
  document.body.removeChild(hocuspocus); hocuspocus = null
 }
 h.set_style                         = function (element, text) {
  // Multiple element support.
  if ((typeof element == "object") && (element instanceof Array)) {element.forEach (function (current_element) {setStyle (current_element, text)}); return}
  element.setAttribute("style", check_for_missing_properties (element, text))
 }
 var add_style                       =
 h.add_style                         = function (element, text) {
  // Multiple element support.
  if ((typeof element == "object") && (element instanceof Array)) {element.forEach (function (current_element) {add_style (current_element, text)}); return}
  if (element.getAttribute("style") == null) {element.setAttribute("style", check_for_missing_properties(element, text)); return}
  element.setAttribute("style", check_for_missing_properties(element, element.getAttribute("style")) + "; " + text)
 }
 var check_for_missing_properties    = 
 h.check_for_missing_properties      = function (element, text) {
  if (!(getComputedStyle(document.documentElement,null)["BoxSizing"]) && !!(getComputedStyle(document.documentElement,null)["MozBoxSizing"])) text = text.replace(/box-sizing/g, '-moz-box-sizing')
  return text
 }
 h.get_vendor_specific_property_name = function () {
  var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms']
  element = element || document.documentElement
  var style = element.style, prefixed
  // Test standard property first.
  if (typeof style[propName] == 'string') return propName
  // Capitalize.
  propName = propName.charAt(0).toUpperCase() + propName.slice(1)
  // Test vendor specific properties
  for (var i = 0, l = prefixes.length; i < l; i++) {
   prefixed = prefixes[i] + propName
   if (typeof style[prefixed] == 'string') return prefixed
  }
 }
 h.get_stylesheet_property_value     = function (class_name, property_name) {
  var temp = document.createElement("div"); temp.class_name = class_name
  document.body.appendChild (temp)
  if (window.getComputedStyle) {
   var property_value = window.getComputedStyle(temp, null).getPropertyValue(property_name)
  } else {
   if (temp.currentStyle) {var property_value = temp.currentStyle[property_name]} else {var property_value = null}
  }
  document.body.removeChild (temp)
  return property_value
 }
 h.add_stylesheet_rule = function (obj, new_rule) {
  if (typeof obj.styleSheetRuleAmount == "undefined") obj.styleSheetRuleAmount = 0
  if (typeof obj.styleSheetRuleArray  == "undefined") obj.styleSheetRuleArray  = []
  document.styleSheets[0].insertRule (new_rule, 0)
  obj.styleSheetRuleArray.push (new_rule)
  obj.styleSheetRuleAmount += 1
 }
 h.remove_all_stylesheet_rules       = function (obj) {
  if (typeof obj.styleSheetRuleAmount == "undefined") return
  var curlen = obj.styleSheetRuleAmount
  var styleSheetRuleArray = obj.styleSheetRuleArray
  for (var i = 0; i < curlen; i++) {
   document.styleSheets[0].deleteRule (styleSheetRuleArray[i])
  }
  obj.styleSheetRuleArray  = []
  obj.styleSheetRuleAmount = 0
 }
 var remove_all_descendants_and_self = h.remove_all_descendants_and_self   = function (cell) {
  if (cell.hasChildNodes()) {while (cell.childNodes.length > 0) {remove_all_descendants_and_self (cell.firstChild)}}
  if (cell.parentNode) (cell.parentNode).removeChild (cell)
  if (cell == window.cell) delete (window.cell)
  cell = null
 }
 var remove_all_descendants = h.remove_all_descendants            = function (cell) {
  var childNodes = cell.childNodes
  if (!childNodes) return
  var childNodes = Array.prototype.slice.call(childNodes)
  for (var i = 0, curlen = childNodes.length; i < curlen; i++) {
   remove_all_descendants (childNodes[i])
   cell.removeChild(childNodes[i])
  }
 }
 // Calculate the client width, plus the left and right border widths, and return the result.
 var get_client_width_full =
 h.get_client_width_full             = function (obj, init) {
  var style = window.getComputedStyle(obj)
  if ((typeof init != "undefined") && (typeof init.margin != "undefined") && (init.margin == true)) {
   var margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight)
  } else {
   var margin = 0
  }
  return obj.clientWidth + margin + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth)
 }
 // Calculate the client height, plus the top and bottom border widths, and return the result.
 h.get_client_height_full            = function (obj, init) {
  var style = window.getComputedStyle(obj)
  if ((typeof init != "undefined") && (typeof init.margin != "undefined") && (init.margin == true)) {
   var margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom)
  } else {
   var margin = 0
  }
  return obj.clientHeight + margin + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth)
 }
 // Get the [left, top] scroll position of the window / document / body.
 h.get_document_scroll_position      = function () {
  return Array((document.documentElement && document.documentElement.scrollLeft) || window.pageXOffset || self.pageXOffset || document.body.scrollLeft, (document.documentElement && document.documentElement.scrollTop) || window.pageYOffset || self.pageYOffset || document.body.scrollTop)
 }
 // Prevent the context menu from appearing (or allow it) on this object. TAGS: select, TAGS: selectable.
 h.prevent_context_menu              = function (obj, do_prevent, omitformtags) {
  if ((typeof do_prevent == "undefined") || (do_prevent == true)) {
   if (typeof omitformtags == "undefined") {
    // Disable text/image select code and ondragstart code.
    var omitformtags = ['input', 'textarea', 'select', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'tr', 'th']
    var omitformtags = omitformtags.join('|')
   }
   void function (omitformtags) {
    function contextmenu_event_handler (evt) {
     var current_target = evt.target
     if (typeof current_target.tagName == "undefined") return
     if (omitformtags.indexOf(current_target.tagName.toLowerCase()) != -1) return true
     evt.preventDefault()
     return false
    }
    obj.oncontextmenu = contextmenu_event_handler
   } (omitformtags)
  } else {
   obj.oncontextmenu = null
  }
 }
 // Move a DOM object to its parent's top.
 h.move_to_top                       = function (evt) {
  var obj = evt.currentTarget, parent = obj.parentNode
  if (parent.childNodes[parent.childNodes.length - 1] == obj) return
  parent.appendChild (obj)
 }
 // Set this page to selectable or otherwise. TAGS: select, TAGS: selectable.
 h.disable_selection                 = function (obj) {
  obj.setAttribute ('unselectable', 'on')
  obj.style.WebkitTapHighlightColor = 'rgba(255, 255, 255, 0)'
  obj.style.WebkitHighlightColor    = 'transparent'
  obj.style.MozUserSelect           = 'none'
  obj.style.OUserSelect             = 'none'
  obj.style.KhtmlUserSelect         = 'none'
  obj.style.WebkitUserSelect        = 'none'
  obj.style.MsUserSelect            = 'none'
  obj.style.userSelect= 'none'
 }
 h.enable_selection                  = function (obj) {
  obj.setAttribute ('unselectable', 'off')
  obj.style.WebkitTapHighlightColor = ''
  obj.style.WebkitHighlightColor    = ''
  obj.style.MozUserSelect           = 'text'
  obj.style.OUserSelect             = 'text'
  obj.style.KhtmlUserSelect         = 'text'
  obj.style.WebkitUserSelect        = 'text'
  obj.style.MsUserSelect            = 'text'
  obj.style.userSelect= 'text'
 }
 h.add_background_filter_image       = function (init) {
  var parent       = init.parent
  var filter_image = init.filter
  var opacity      = init.opacity || 100
  var zIndex       = init.zIndex  || 100
  var filter = document.createElement ('img')
  filter.src = filter_image
  filter.style.position = 'absolute'
  filter.style.border  = 0
  filter.style.margin  = 0
  filter.style.padding = 0
  filter.style.left    = 0
  filter.style.top     = 0
  filter.style.width   = '100%'
  filter.style.height  = '100%'
  filter.style.display = 'block'
  filter.style.zIndex  = zIndex
  filter.style.opacity = opacity
  parent.appendChild (filter)
  this.remove = function () {
   if (filter.parentNode == null) return
   (filter.parentNode).removeChild (filter)
  }
 }
 h.hide_siblings                     = function (obj) {
  var parent = obj.parentNode
  for (var i = 0, curlen = parent.childNodes.length; i < curlen; i++) {
   var current_child = parent.childNodes[i]
   if (current_child == obj) {obj.style.display = null; continue}
   current_child.style.display = "none"
  }
 }
 h.make_label_and_input              = function (init) {
  var parent             = init.parent
  var label_text         = init.label
  var input_name         = init.name
  var pre                = init.pre
  var post               = init.post
  var input_type         = init.input_type
  var input_attributes   = init.input_attributes
  var input_sub_elements = init.input_sub_elements
  var input_element      = init.input_element
  var use_default_styles = (typeof init.use_default_styles == "undefined") ? true : (init.use_default_styles)
  var nest_input         = (typeof init.nest_input == "undefined") ? false : (init.nest_input)
  var main = document.createElement ('div');
  if (use_default_styles) main.style.display = "block"
  var label = document.createElement ('label'); label.innerHTML = label_text
  if (typeof pre != "undefined") {
   var templabel = document.createElement ('div')
   templabel.innerHTML = pre
   label.appendChild (templabel)
   if (use_default_styles) {
    templabel.style.display       = "inline-block"
    templabel.style.right         = 0
    templabel.style.verticalAlign = "middle"
    templabel.style.position      = 'absolute'
   }
  }
  if (typeof input_type == "undefined") input_type = "text"
  if (typeof input_element == "undefined") input_element = "input"
  var input = document.createElement (input_element)
  if (typeof init.value != "undefined") input.value = init.value
  if (typeof init.disabled != "undefined") input.disabled = init.disabled
  if (typeof init.readonly != "undefined") {
   if (init.readonly == true) init.readonly = "readonly"
   input.readOnly = init.readonly
  }
  if (input_element == "input") input.type = input_type
  input.oncontextmenu = function () {return true}
  input.name = input_name
  if (typeof init.checked != "undefined") input.checked = init.checked
  if (use_default_styles) input.style.display = "inline-block"
  if (nest_input == true) {
   var input_wrapper = document.createElement ('span')
   input_wrapper.className = (typeof init.input_wrapper_cssclass != 'undefined') ? init.input_wrapper_cssclass : "input_wrapper_default"
   if (typeof init.input_wrapper_style != "undefined") add_style (input_wrapper, init.input_wrapper_style)
   input_wrapper.appendChild (input)
  }
  var input_to_append = (nest_input == true) ? input_wrapper : input
  if (init.input_first == true) {
   main.appendChild (input_to_append); main.appendChild (label)
  } else {
   main.appendChild (label); main.appendChild (input_to_append)
  }
  if (typeof post != "undefined") {
   var templabel = document.createElement ('div')
   templabel.innerHTML = post
   if (use_default_styles) templabel.style.display = "inline-block"
   main.appendChild (templabel)
  }
  main.className  = (typeof init.cssclass       != 'undefined') ? init.cssclass       : "input_main_default"
  label.className = (typeof init.label_cssclass != 'undefined') ? init.label_cssclass : "input_label_default"
  input.className = (typeof init.input_cssclass != 'undefined') ? init.input_cssclass : "input_input_default"
  if (typeof init.label_style != "undefined") add_style (label, init.label_style)
  if (typeof init.input_style != "undefined") add_style (input, init.input_style)
  if (typeof init.style       != "undefined") add_style (main , init.style)
  for (var attribute_name in input_attributes) {
   input[attribute_name] = input_attributes[attribute_name]
  }
  if (typeof input_sub_elements != "undefined") {
   var curlen = input_sub_elements.length; for (var i = 0; i < curlen; i++) {input.appendChild(input_sub_elements[i])}
  }
  parent.appendChild (main)
  main.input = input
  main.label = label
  return main
 }
 h.make_text                         = function (init) {
  var parent = init.parent
  if (typeof init.element_type == "undefined") init.element_type = "p"
  if (typeof init.link != "undefined") {
   var text_element = document.createElement ("a")
   text_element.href = init.link
  } else {
   var text_element = document.createElement (init.element_type)
  }
  text_element.innerHTML = init.text
  if (typeof init.cssclass != "undefined") text_element.className = init.cssclass
  if (typeof init.style    != "undefined") add_style (text_element, init.style)
  parent.appendChild (text_element)
  return text_element
 }
 // Replace a function property with an error if the program tries to run it.
 h.prevent_native                    = function (obj, native_function) {
  obj[native_function] = function () {throw new Error('Error: "' + native_function+ '()" is not allowed for this object!')}
 }
 // Append a <br>.
 h.append_br                         = function (parent) {return parent.appendChild (document.createElement('br'))}
 // Set the obj's display to "none" if all children have display set to "none". Otherwiset, set to "regular_display".
 h.set_display_based_on_children     = function (obj, regular_display) {
  var children    = obj.childNodes, curlen = children.length, all_hidden = true, new_display = "none"
  for (var i = 0; i < curlen; i++) {
   if (children[i].style.display != "none") {new_display = regular_display; all_hidden = false; break}
  }
  obj.style.display = new_display
 }
 // Set an object's class name for the selected value(s) found in the key/value list.
 h.set_object_class_by_value         = function (init) {
  var key_value_list = init.key_value_list, class_name_string = ""
  if (!(init.value instanceof Array)) {var value = [init.value]} else {var value = init.value}
  var curlen = init.value
  for (var i = 0; i < curlen; i++) {class_name_string += (init.key_value_list)[value[i]]}
  (init.obj).className = class_name_string
 }
 h.convert_form_elements_to_string   = function (form_obj) {
  var input_elements = form_obj.elements
  var curlen         = input_elements.length
  var result_string  = ""
  for (var i = 0; i < curlen; i++) {
   var curelement = input_elements[i]
   if ((typeof curelement.name == "undefined") || (curelement.name == "")) continue
   if ((curelement.type == "select-multiple") && (curelement.multiple == true)) {
    var result_list = []
    var curlen_j = curelement.options.length
    for (var j = 0; j < curlen_j; j++) {
     var current_option = curelement.options[j]
     if (current_option.selected == false) continue
     result_list.push (encodeURIComponent(current_option.value))
    }
    var result_value = result_list.join(',')
   } else {
    if ((curelement.type == "radio") || (curelement.type == "checkbox")) {if (curelement.checked == false) continue}
    var result_value = encodeURIComponent(curelement.value)
   }
   result_string += "&" + curelement.name + "=" + result_value
  }
  return result_string
 }
 h.make_label_and_textbox            = function (init) {
  var textarea = document.createElement ('textarea')
  textarea.rows = init.rows
  var merged_init = merge_objects ({primary: init, secondary:{input_type:textarea}})
  return make_label_and_input (merged_init)
 }
 h.parent_get_elements_by_name       = function (parent, test_name) {
  var elements = [parent.getElementsByTagName("*")]
  var result_array = []
  var curlen_i = elements.length
  for (var i = 0; i < curlen_i; i++) {
   var sub_elements = elements[i]
   var curlen_j = sub_elements.length
   for (var j = 0; j < curlen_j; j++) {
    if (sub_elements[j].getAttribute('name') == test_name) result_array.push (sub_elements[j])
   }
  }
  return result_array
 }
 h.focus_default_text                = function (focus_obj, default_text) {if (focus_obj.value == default_text) focus_obj.value = ""}
 h.blur_default_text                 = function (focus_obj, default_text) {if (focus_obj.value == '') focus_obj.value = default_text}
 h.create_dom_option_list            = function (option_text_array) {
  var curlen = option_text_array.length
  var dom_option_list = new Array (curlen)
  for (var i = 0; i < curlen; i++) {
   var current_option_data = option_text_array[i]
   var current_option = document.createElement ('option')
   dom_option_list[i] = current_option
   switch (typeof current_option_data) {
    case "string" : 
     current_option.value     = current_option_data
     current_option.innerHTML = capitalize_first_letter(current_option_data)
    break
    case "number" : 
     current_option.value     = current_option_data
     current_option.innerHTML = current_option_data
    break
    default :
     for (var attribute_name in current_option_data) {current_option[attribute_name] = current_option_data[attribute_name]}
    break
   }
  }
  return dom_option_list
 }
 h.get_data_string_from_input_list   = function (input_object_list) {
  var data_array = []
  for (var input_object_name in input_object_list) {
   var current_string_fragment = "&" + input_object_name + "=" + encodeURIComponent(input_object_list[input_object_name].input.value)
   data_array.push (current_string_fragment)
  }
  return data_array.join("")
 }
 h.create_empty_dom_row              = function (init) {
  var row = document.createElement (init.dom_type)
  var leftdiv = document.createElement (init.leftdiv_dom_type)
  leftdiv.className = init.leftdiv_cssclass
  setStyle (leftdiv, init.leftdiv_style)
  row.appendChild (leftdiv)
  var rightdiv = document.createElement (init.rightdiv_dom_type)
  rightdiv.className = init.rightdiv_cssclass
  setStyle (rightdiv, init.rightdiv_style)
  row.appendChild (rightdiv)
  row.className = init.cssclass
  setStyle (row, init.style)
  var parent = init.parent
  init.parent.appendChild (row)
  row.leftdiv = leftdiv
  row.rightdiv = rightdiv
  return row
 }
 h.set_to_biggest_width              = function (arr) {
  var biggest_width = 0
  arr.forEach (function (obj) {if (biggest_width < obj.offsetWidth) biggest_width = obj.offsetWidth})
  arr.forEach (function (obj) {obj.style.width = biggest_width + "px"})
 }
 h.dom_object_intersects_line        = function (obj, x, y) {
  var xy = findabspos (obj)
  if (x < xy[0]) return false
  if (y < xy[1]) return false
  if (xy[0] + obj.clientWidth  > x) return false
  if (xy[1] + obj.clientHeight > y) return false
  return true
 }
 h.timed_remove                      = function (element, ms) {
  return setTimeout (function () {
   parent = element.parentNode
   if (parent == null) return
   parent.removeChild (element)
  }, ms)
 }
 h.dom_to_static_element_list        = function (html_collection) {return Array.prototype.slice.call (html_collection)}
 h.convert_to_px_units               = function (parent, measure) {
  var mydiv = document.createElement('div'); mydiv.style.visibility = 'hidden'; mydiv.style.width = '1' + measure
  parent.appendChild (mydiv); w = mydiv.getBoundingClientRect().width; parent.removeChild (mydiv)
  return w
 }
 h.get_rem_units                     = function (obj, property) {
  return parseFloat(window.getComputedStyle(obj)[property]) / parseFloat(document.documentElement.style.fontSize)
 }
 h.css_set_scale                     = function (sw, sh, obj) {obj.setAttribute('transform', 'scale(' + sw + ' ' + sh +')')}
 // Add headers to a table.
 h.table_add_headers                 = function (init) {
  function resort (evt) {
   var attribute_name = evt.currentTarget.sort_attribute
   var curlen = sort_order.length
   for (var i = 0; i < curlen; i++) {
    if (sort_order[i][0] != attribute_name) continue
    var attribute_direction = sort_order[i][1]
    if (i == 0) attribute_direction = !attribute_direction
    sort_order.splice (i, 1)
    sort_order.splice (0, 0, [attribute_name, attribute_direction])
   }
   if (typeof sort_callback != "undefined") sort_callback ()
  }
  
  var parent        = init.parent
  var header_list   = init.header_list
  var sort_order    = init.sort_order
  var sort_callback = init.sort_callback
  
  var temp_tr = document.createElement ('tr')
  parent.appendChild (temp_tr)
  var curlen = header_list.length
  for (var i = 0; i < curlen; i++) {
   var temp_th = document.createElement ('th')
   temp_th.style.cursor = "pointer"
   if (typeof header_list[i] == "string") {
    var header_text = header_list[i]
    temp_th.sort_attribute = header_text.toLowerCase ()
   } else {
    var header_text        = header_list[i].text.toLowerCase ()
    temp_th.sort_attribute = header_list[i].attribute.toLowerCase ()
   }
   temp_th.innerHTML = capitalize_first_letter(header_text)
   if (typeof sort_order != "undefined") addEvent (temp_th, 'click', resort)
   temp_tr.appendChild (temp_th)
  }
 }
 h.sort_by_order                     = function (obj, order_list) {
  obj.sort (function (a, b) {
   var curlen = order_list.length
   for (var i = 0; i < curlen; i++) {
    var attribute_name  = order_list[i][0]
    var sort_down       = order_list[i][1]
    var custom_function = order_list[i][2]
    if (typeof custom_function != "undefined") {
     var result = custom_function (a[attribute_name], b[attribute_name])
     if (result != 0) {if (sort_down) {return result} else {return -result}}
     continue
    }
    if (a[attribute_name] != b[attribute_name]) {
     if (sort_down == true) {
      if (a[attribute_name] > b[attribute_name]) {return 1} else {return -1}
     } else {
      if (a[attribute_name] < b[attribute_name]) {return 1} else {return -1}
     }
    }
   }
   return 0
  })
 }

 // <Extra DOM things -- including a duplicated isAttached. Should we rework all dom-specific functions to this model?>
 // "dom.create", "dom.createEventSubscriber", and "dom.databaseSyncSetter" are especially useful.
 var dom = h.dom = {}
 dom.enhanceNative = function (nativeToEnhanceList) {
  var enhanceList = {
   "addEventListener" : function () { // Allows an array of strings in addEventListener. Very non-standard!!!
    var addEventListenerNative = HTMLElement.prototype.addEventListener
    HTMLElement.prototype.addEventListener = function () {
     var args = Array.prototype.slice.call(arguments)
     if (typeof args[0] == "string") {addEventListenerNative.apply (this, args); return}
     if (Array.isArray(args[0])) {
      var args0 = args[0]
      args0.forEach (function (eventName) {args[0] = eventName; addEventListenerNative.apply (this, args)}, this)
     }
    }
   }
  }
  if (nativeToEnhanceList == "all") {enhanceList.forEach(function (func) {func()}); return}
  if (!Array.isArray(nativeToEnhanceList)) nativeToEnhanceList = [nativeToEnhanceList];
  nativeToEnhanceList.forEach (function (nativeToEnhance) {
   if (nativeToEnhance in enhanceList) enhanceList[nativeToEnhance]()
  })
 }
 
 dom.removeEventListeners = function (element) {
  element.dom.eventListenerArgumentList.forEach (function (eventListenerArgs) {
   element.removeEventListener.apply(element, eventListenerArgs)
  })
  element.dom.eventListenerArgumentList = []
 }
 
 dom.enableEventListenerTracking = function (element) {
  element.addEventListenerOriginal = element.addEventListener
  element.dom.eventListenerArgumentList = []
  element.addEventListener = function () {
   var args = Array.prototype.slice.call(arguments)
   element.dom.eventListenerArgumentList.push(args)
   element.addEventListenerOriginal.apply(element, args)
  }
  this.removeEventListenerOriginal = element.removeEventListener
  this.removeEventListener = function () {
   var args = Array.prototype.slice.call(arguments)
   element.dom.eventListenerArgumentList.some(function (eventListenerArgs) {
    if (eventListenerArgs.length != args.length) return
    return args.every(function (param, i) {return (param === eventListenerArgs[i])})
   })
   element.removeEventListenerOriginal.apply(element, args)
  }
 }
 
 dom.setWidthLikeDiv  = function (input) {dom.matchElementDimensions(input,  "width", "inline-block", "left",  "right", "div")}
 dom.setHeightLikeDiv = function (input) {dom.matchElementDimensions(input, "height",        "block",  "top", "bottom", "div")}
 dom.matchElementDimensions = function (input, dimension, temp_display_type, min_edge, max_edge, temporary_element_type) {
  function capitalize (obj) {return obj.toLowerCase().replace(/^[a-z]|\s[a-z]/g, conv); function conv () {return arguments[0].toUpperCase()}}
  var dimension_c = capitalize(dimension), min_edge_c = capitalize(min_edge), max_edge_c = capitalize(max_edge)
  input.style[dimension] = ""
  var s = window.getComputedStyle(input); var cousin = document.createElement (temporary_element_type)
  cousin.style.display = temp_display_type
  new Array("paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "fontFamily", "fontSize", "fontWeight", "letterSpacing", "fontKerning", "lineHeight", "textIndent").forEach (function (p) {cousin.style[p] = s[p]})
  // 1) Converts end-of-line to "<br/>&nbsp;".
  // 2) Any empty strings become "nbsp;".
  // 3) Converts any trailing spaces into sets of "&nbsp;".
  cousin.innerHTML = input.value.replace(/[\n\r]/g, "<br/>&nbsp;").replace(/^$/, '&nbsp;').replace(/ +$/, function(count) {return '&nbsp;'.repeat(count.length)})
  input.parentNode.insertBefore(cousin, input)
  input.style[dimension] = (
   cousin["client" + dimension_c] +
   parseFloat(s["border"  + min_edge_c + "Width"]) + parseFloat(s["border"  + max_edge_c + "Width"]) +
   parseFloat(s["margin"  + min_edge_c])           + parseFloat(s["margin"  + max_edge_c])
  ) + "px"
  cousin.parentNode.removeChild (cousin)
 }
 dom.isAttached = function (obj) {
  while (true) {
   obj = obj.parentNode
   if (obj == document.documentElement) return true
   if (obj == null) return false
  }
 }
 dom.appendChildren = function (init) {var parent = init.parent, children = init.children; children.forEach (function (child) {parent.appendChild (child)})}
 dom.detachAll = function (parent, recursive) {
  Array.prototype.slice.call(parent.childNodes).forEach(function (child) {
   parent.removeChild (child); if (recursive) dom.detachAll (child, recursive)
  })
 }
 dom.detachAllOtherSiblings = function (exceptedChildren, recursive) {
  if (!Array.isArray(exceptedChildren)) exceptedChildren = [exceptedChildren]
  var parent = exceptedChildren[0].parentNode
  Array.prototype.slice.call(parent.childNodes).forEach(function (child) {
   if (exceptedChildren.find(function (testchild) {return testchild == child})) return
   parent.removeChild (child); if (recursive) dom.detachAll (child, recursive)
  })
 }
 dom.detachAllRecursive = function (parent) {return dom.detachAll(parent, true)}
 dom.detachAllOtherSiblingsRecursive = function (exceptedChildren, parent) {return dom.detachAllOtherSiblings(exceptedChildren, parent, true)}
 dom.onRemoved = function (element, callback) {
  var MutationObserver = window.MutationObserver || window.WebkitMutationObserver
  var observer = new MutationObserver(function () {
   if (!isAttached(element)) {callback(element); observer.disconnect()}
   function isAttached (element) {
    while (true) {
     element = element.parentNode
     if (element == document.documentElement) return true
     if (element == null) return false
    }
   }
  })
  observer.observe(document, {childList: true, subtree: true})
  return observer
 }
 dom.insertBefore = function (element, sibling) {element.parentNode.insertBefore(element, sibling); return element}
 dom.create = function (type, init) {
  // Note that an event in the event list with a "," (e.g.: "input, change") is split up into multiple events.
  var init = init || {}
  var children = init.children, events = init.events, parent = init.parent; delete (init.children); delete (init.events); delete (init.parent)
  var element = document.createElement(type)
  if (init.className && dom.processCss) {element.className = dom.processCss(init.className); delete (init.className)}
  if (init.style) {
   var style = init.style
   for (var prop in style) {element.style[prop] = style[prop]}
   delete (init.style)
  }
  for (var prop in init) {if (typeof prop != "undefined") element[prop] = init[prop]}
  if (typeof events != "undefined") {
   for (var eventNameList in events) {
    var event = events[eventNameList]
    if (eventNameList.indexOf(",") != -1) {eventNameList = eventNameList.split(",").map(function (n) {return n.trim()})} else {eventNameList = [eventNameList]}
    eventNameList.forEach(function (eventName) {
     element.addEventListener(eventName, event)
    })
   }
  }
  if (typeof parent != "undefined") parent.appendChild(element)
  element.dom = {
   insertBefore: function (sibling) {return dom.insertBefore(element, sibling)},
   classList: {
    add: function (string) {element.classList.add.apply(element.classList, string.split(" ")); return element.dom},
    remove: function (string) {element.classList.remove.apply(element.classList, string.split(" ")); return element.dom}
   },
   children: {}
  }
  if (children) {
   children.forEach(function (arr) {
    var childName = arr[0], tagTypeName = arr[1], childData = arr[2]
    var child = dom.create(tagTypeName, childData)
    element.dom.children[childName] = child
    element.appendChild(child)
   })
  }
  return element
 }
 dom.createEventSubscriber = function (subscribeTarget, init) {
  init = init || {}
  var subscribeToEventName      = ("subscribeToEvent"      in init) ? init.subscribeToEvent      : "subscribeToEvent"
  var dispatchEventName         = ("dispatchEvent"         in init) ? init.dispatchEvent         : "dispatchEvent"
  var dispatchEventOriginalName = ("dispatchEventOriginal" in init) ? init.dispatchEventOriginal : "dispatchEventOriginal"
  
  subscribeTarget[dispatchEventOriginalName] = subscribeTarget.dispatchEvent
  var dispatchEventFunction = function (eventName, evt) {
   if (typeof eventName != "string") {subscribeTarget[dispatchEventOriginalName].apply (this, arguments); return}
   subscribeTarget[dispatchEventName] (new CustomEvent(eventName, {detail: evt}))
  }
  subscribeTarget[dispatchEventName] = dispatchEventFunction
  
  var subscriber = function (element, eventNameList, func, doNotRemoveIfDetached) {
   if (!("nodeName" in element)) {
    var init = element, element = init.element, func = init.callback
    if ("column" in init) {var eventNameList = {}; eventNameList[init.event] = init.column} else {var eventNameList = init.event}
   }
   
   if (!Array.isArray(eventNameList)) eventNameList = [eventNameList]
   eventNameList.forEach (function (eventName) {
    if (typeof eventName == "object") {var columnAffected = Object.values(eventName)[0]; eventName = Object.keys(eventName)[0]}
    var functionwrapper = function (evt) {
     Object.defineProperty(evt, "type", {enumerable: true, configurable: true, writable: true})
     if (evt.detail) {
      var detail = evt.detail
      Object.defineProperty(evt, "detail", {enumerable: true, configurable: true, writable: true})
      delete (evt.detail)
      Object.assign (evt, detail)
     }
     if (!('name'     in evt)) evt.name   = eventName
     if (!('target'   in evt)) evt.target = element
     if (!doNotRemoveIfDetached && (!dom.isAttached(element))) {subscribeTarget.removeEventListener (eventName, functionwrapper); return}
     if ((typeof columnAffected != "undefined") && !(evt.columnsAffected.includes(columnAffected))) return
     func.apply (element, [evt])
    }
    subscribeTarget.addEventListener (eventName, functionwrapper)
   })
  }
  subscribeTarget[subscribeToEventName] = subscriber
  return subscriber
 }
 dom.databaseSyncSetter = function (init) {
  var entry_name             = init.entry_name
  var database_action        = init.database_action
  var action_type            = init.action_type
  var entry_id_string        = init.entry_id
  var entry_container_string = init.entry_container
  var central_data           = init.central_data
  var query_parameters       = init.query_parameters
  var event_name             = init.event_name
  var event_dispatcher       = init.event_dispatcher
  var dbrequest_queue        = init.dbrequest_queue
  var wait_for_result        = (action_type == "create" || action_type == "remove") ? true : (("wait_for_result" in init) ? init.wait_for_result : false)
  var init                   = init.init
  
  var entry_id = init[entry_id_string]
  var entry_container = central_data[entry_container_string]
  
  if (action_type == "set") {
   var entry = get_entry_object({container: entry_container, entry_id: entry_id})
   var entry_original = Object.assign({}, entry)
   var additions = {}, columns_affected = []
   query_parameters.forEach (function (prop) {if (prop in init) {additions[prop] = init[prop]; columns_affected.push (prop)}})
   Object.assign (entry, additions)
   event_name = (typeof event_name == "string") ? event_name : event_name(additions)
   var id_param = {}; id_param[entry_name] = entry // id_param is the thing being sent to the event listeners. E.G.: "{fragment: fragment}".
   if (!wait_for_result) event_dispatcher.dispatchEvent (event_name, Object.assign ({}, id_param, {columnsAffected: columns_affected}, additions))
  }
  
  if (typeof init.callback == "undefined") init.callback = function () {}
  var callback_original = init.callback
  init.callback = function (result) {
   if (result && result.error) {
    additions = {}
    if (action_type == "set") {
     query_parameters.forEach (function (prop) {if (prop in init) additions[prop] = entry_original[prop]})
     event_dispatcher.dispatchEvent (event_name, Object.assign ({}, id_param, {columnsAffected: columns_affected}, additions))
    }
   } else if (wait_for_result) {
    var effects = (typeof result == "object") ? result.effects : undefined
    if (effects) {
     dispatch_events (effects)
    } else {
     event_dispatcher.dispatchEvent (event_name, Object.assign ({}, id_param, {columnsAffected: columns_affected}, additions))
    }
   }
   callback_original (result)
  }
  dbrequest_queue (database_action, query_parameters.concat(entry_id_string), init)
  
  function get_entry_object (init) {
   var container = init.container, entry_id = init.entry_id
   if (Array.isArray(container)) {
    return container.find(function (test_entry) {return test_entry.id == entry_id})
   } else {
    return container[entry_id]
   }
  }
  function set_entry_object (init) {
   var container = init.container, entry_id = init.entry_id, entry = init.entry_data
   var sort_column = init.sort_column, sort_direction = init.sort_direction
   if (!Array.isArray(container)) {
    container[entry_id] = entry
   } else {
    if (!sort_column) {
     container.push(entry)
    } else {
     var insert_position = container.findIndex(
      (!sort_direction || sort_direction.toLowerCase() == "asc") ?
      function (test_entry) {return entry[sort_column]  < test_entry[sort_column]} :
      function (test_entry) {return entry[sort_column] >= test_entry[sort_column]}
     )
     if (insert_position == -1) insert_position = container.length
     container.splice(insert_position, 0, entry)
    }
   }
   return entry
  }
  function delete_entry_object (init) {
   var container = init.container, entry_id = init.entry_id
   if (!Array.isArray(container)) {
    var entry = container[entry_id]
    delete (container[entry_id])
   } else {
    var entry_index = container.findIndex(function (entry) {if (entry.id == entry_id) return true})
    var entry = container[entry_index]
    container.splice(entry_index, 1)
   }
   return entry
  }
  
  function dispatch_events (event_list) {
   var dispatch_list = []
   for (var event_name in event_list) {
    var event = event_list[event_name]
    var columns_affected = [], id_param_list = {}, additions = {}
    for (var entry_name in event) {
     var entry_descriptor = event[entry_name]
     var location = entry_descriptor.location, data = entry_descriptor.data
     var entry_container_string = location.container, entry_id = location.id

     // If data is undefined, we are removing an object, not modifying or creating it.
     if (typeof data == "undefined") {
      var entry = delete_entry_object({container: central_data[entry_container_string], entry_id: entry_id})
     } else {
      // If data is set, modify or create an object.
      var entry = get_entry_object({container: central_data[entry_container_string], entry_id: entry_id})
      columns_affected = columns_affected.concat(Object.keys(data))
      
      if (typeof entry == "undefined") {
       var entry = set_entry_object({container: central_data[entry_container_string], entry_id: entry_id, entry_data: data, sort_column: location.sort_column, sort_direction: location.sort_direction})
       entry.id = entry_id
      } else {
       Object.assign(entry, data)
      }
      Object.assign(additions, data)
     }
     id_param_list[entry_name] = entry
    }
    dispatch_list.push([event_name, Object.assign({}, id_param_list, {columnsAffected: columns_affected}, (Object.keys(event).length == 1 ? additions : {}))])
   }
   dispatch_list.forEach (function (dispatch_data) {event_dispatcher.dispatchEvent.apply(null, dispatch_data)})
  }
 }
 // </Extra DOM things -- including a duplicated isAttached. Should we rework all dom-specific functions to this model?>
}
// </DOM manipulation functions.>

// <Domain and directory functions. TAG: form, TAG: uri component, TAG: domain, TAG: directory, TAG: path.>
// Get URL variables from window.location and put them into variable_object as key/value pairs. Returns variable_object.
if (h.library_settings.domain_and_directory) {
 h.get_url_vars             = function (variable_object) {
  if ((typeof variable_object != "object") || (variable_object == null)) variable_object = {}
  var variable_list = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
  var curlen = variable_list.length
  for (var i = 0; i < curlen; i++) {
   var current_variable = variable_list[i].split('=')
   if (typeof current_variable[1] == "undefined") continue
   variable_object[current_variable[0]] = decodeURIComponent(current_variable[1])
  }
  return variable_object
 }
 // Form a GET URL string from an array.
 h.form_url_vars            = function (variable_list, options) {
  if (typeof options           == "undefined") options = {}
  if (typeof options.record_undefined_values == "undefined") options.record_undefined_values = true
  var return_value = ""
  for (var i in variable_list) {
  if ((typeof variable_list[i] != "undefined") || (options.record_undefined_values == true)) return_value += "&" + i + "=" + variable_list[i]}
  if (return_value != "") return_value = "?" + return_value.slice(1, return_value.length)
  return return_value
 }
 h.directory_normalize      = function (dirpath) {
  var part_list = dirpath.split('/')
  loop1:
  for (var i = 0, curlen = part_list.length; i < curlen; i++) {
   if (part_list[i] == '..') {
    for (var j = i - 1; j >= 0; j--) {
     if ((part_list[j] == '..') || (part_list[j] == '')) continue
     part_list[j] = ''; part_list[i] = ''
     continue loop1
    }
   }
   part_list[i] = '/' + part_list[i]
  }
  var dirpath = part_list.join ('')
  dirpath = dirpath.substr(1, dirpath.length - 1)
  return dirpath
 }
 h.strip_domain             = function (url) {
  var startAt = url.indexOf('://');
  if (startAt == -1) return url
  startAt = startAt == -1 ? 0 : startAt+3;
  var first_index = url.indexOf("/", startAt) + 1
  if (first_index == 0) return url
  return url.substring(first_index)
 }
 h.get_domain_and_directory = function (url) {var last_index = url.lastIndexOf("/") + 1; return url.substring(0, last_index)}
 h.strip_from_base_href     = function (url) {
  var startAt = url.indexOf('://');
  if (startAt == -1) return url
  startAt = startAt == -1 ? 0 : startAt+3;
  var first_index = url.indexOf("/", startAt) + 1
  if (first_index == 0) return url
  return url.substring(first_index)
 }
 h.strip_directory          = function (url) {var last_index = url.lastIndexOf("/") + 1; if (last_index == 0) return url; return url.substring(last_index)}
 h.strip_extension          = function (url) {return url.substring(0, url.lastIndexOf("."))}
 h.remove_base_url          = function (url) {
  var url_original = url
  var base_url_pattern = /^https?:\/\/[a-z\:0-9.]+/
  var result = ""
  var match = base_url_pattern.exec(url)
  if (match != null) result = match[0]
  if (result.length > 0) url = url.replace(result, "").substr(1)
  // Check if there is a base element, and if so, remove its href from the beginning of the URL.
  var base_element = document.querySelector('base')
  if (base_element != null) {
   var base_href = base_element.getAttribute("href")
   base_href = base_href.substr(base_href.indexOf('/') + 1) + "/"
   url = url.replace(new RegExp("^(" + base_href + "\.)"), '')
  }
  return url
 }
 h.modify_href_if_relative  = function (prefix_src, current_src) {if (current_src.substr(0, 7) != "http://") {return prefix_src + current_src} else {return current_src}}
}
// <Domain and directory functions.>

// <Audio functions. TAG: audio, TAG: play.>
if (h.library_settings.audio) {
 var play_audio = h.play_audio = function (filename, init) {
  if (typeof init == "undefined") init = {}
  if (init.play_howl) return new playHowl (filename, init)
  
  // Check if the file is already loaded.
  if (typeof init.container != "undefined") {
   if ((typeof init.container[filename] != "undefined") && (!init.force_refresh)) {
    var main = init.container[filename]
    main.loop        = init.loop   || false
    main.volume      = init.volume || 1
    main.start       = (typeof init.start != "undefined") ? init.start : true
    main.stopped     = false
    if (main.start == true) {
     main.audio.play ()
     if (main.loop == true) main.addEventListener ('ended', main.play)
    } else {
     if (main.loop == true) {main.audio.loop = true}
    }
    return main
   }
  }
  
  if ((typeof this == "undefined") || (this == window)) return new play_audio (filename, init)
  var main = this
  
  // Add this object to the container, if it exists.
  if (typeof init.container != "undefined") init.container[filename] = main
  
  Object.defineProperty (main, "duration", {get: function () {return main.audio.duration}})
  Object.defineProperty (main, "currentTime", {
   get : function () {return main.audio.currentTime},
   set : function (new_time) {
    if (main.audio.readyState != 0) {main.audio.currentTime = new_time; return}
    main.audio.addEventListener ('loadedmetadata', set_new)
    function set_new () {main.audio.removeEventListener ('loadedmetadata', set_new); main.audio.currentTime = new_time}
  }})
  Object.defineProperty (main, "volume"  , {get: function () {return main.audio.volume}, set: function (new_volume) {main.audio.volume = new_volume}})
  Object.defineProperty (main, "paused"  , {get: function () {return main.audio.paused}})
  main.addEventListener    = function () {return main.audio.addEventListener    (arguments[0], arguments[1], false || arguments[2])}
  main.removeEventListener = function () {return main.audio.removeEventListener (arguments[0], arguments[1], false || arguments[2])}
  main.play = main.play_track = function () {main.audio.play ()}
  main.stop       = function () {main.stopped = true; main.audio.pause (); if (main.audio.readyState != 0) main.audio.currentTime = 0; main.removeEventListener ('ended', main.play_track)}
  main.pause      = function () {main.stopped = true; main.audio.pause (); main.removeEventListener ('ended', main.play)}
  main.play       = function () {main.resume ()}
  main.resume     = function () {
   if (main.stopped == true) {main.stopped = false; main.play ()} else {main.audio.play ()}
   if (main.loop    == true) {main.audio.loop = true; main.audio.addEventListener ('ended', main.play)}
  }
  main.set_loop    = function (loop_value) {
   if (loop_value == true) {
    main.loop       = true
    main.audio.loop = true
    main.addEventListener ('ended', main.play)
   } else {
    main.loop       = false
    main.audio.loop = false
    main.removeEventListener ('ended', main.play)
   }
  }
  main.restart    = function () {main.play ()}
  main.set_volume = function (new_volume) {main.volume = new_volume}
  main.loop       = init.loop  ; if (typeof main.loop   == "undefined") main.loop   = false
  main.start      = init.start ; if (typeof main.start  == "undefined") main.start  = true
  main.loaded     = true
  main.filename   = filename
  main.stopped    = false
  main.audio      = new Audio ()
  if (((typeof init.no_source_tags != "undefined") && (init.no_source_tags == true)) || ((extension != ".ogg") && (extension != ".mp3") && (extension != ".wav"))) {
   main.audio.src = main.filename
  } else {
   var extension = main.filename.slice(-4)
   var source = document.createElement("source")
   switch (extension) {
    case ".ogg" : source.type = "audio/ogg";  break
    case ".mp3" : source.type = "audio/mpeg"; break
    case ".wav" : source.type = "audio/wav";  break
   }
   source.src = main.filename
   main.audio.appendChild (source)
  }
  main.volume = init.volume || 1
  if (main.start == true) {
   main.audio.play ()
   if (main.loop == true) main.addEventListener ('ended', main.play)
  } else {
   if (main.loop == true) {main.audio.loop = true}
  }
  return main
 }
 h.play_howl  = function (src, init) {
  if (typeof init == "undefined") init = {}
  
  // Check if the file is already loaded.
  if (typeof init.container != "undefined") {
   if ((typeof init.container[src] != "undefined") && (!init.force_refresh)) {
    var main = init.container[src]
    main.volume = init.volume || 1
    if ((typeof init.start == "undefined") || init.start == true) main.play ()
    return main
   }
  }
  
  if ((typeof this == "undefined") || (this == window)) return new playHowl (src, init)
  var main = this
  
  // Add this object to the container, if it exists.
  if (typeof init.container != "undefined") init.container[src] = main
  
  Object.defineProperty (main, "duration", {get: function () {return main.audio.duration}})
  
  Object.defineProperty (main, "currentTime", {
   get : function () {return main.audio.position},
   set : function (new_time) {
    if (main.loaded) {main.audio.position = new_time; return}
    main.addEventListener ('load', set_new)
    function set_new () {main.audio.position = new_time; main.removeEventListener ('load', set_new)}
  }})
  
  Object.defineProperty (main, "volume", {get: function () {return main.audio.volume}, set: function (new_volume) {main.audio.volume = new_volume}})
  
  main.pause  = function () {main.audio.pause (); main.paused = true}
  main.play   = function () {main.audio.play  (); main.paused = false}
  main.stop   = function () {main.audio.pause (); main.paused = true; main.currentTime = 0}
  main.loaded = false
  main.src    = src
  main.paused = true
  var listeners = []
  main.addEventListener    = function () {listeners.push ([arguments[0], arguments[1], arguments[2] || false])}
  main.removeEventListener = function () {
   var input_arguments = arguments
   var index = listeners.findIndex (function (listener) {
    if (listener[0] !== input_arguments[0]) return false
    if (listener[1] !== input_arguments[1]) return false
    if (listener[2] !== (input_arguments[2] || false)) return false
    return true
   })
   if (index != -1) listeners.splice (index, 1)
  }
  
  main.audio = new Howl ({
   src         : main.src,
   buffersize  : init.preload_buffer_size,
   bufferfile  : init.preload_buffer_file,
   autoplay    : ((typeof init.start == "undefined") || init.start == true),
   onend       : function () {main.paused = true;  listeners.forEach (function (listener) {if (listener[0] != "ended")     return; listener[1] ()})},
   onload      : function () {main.loaded = true;  listeners.forEach (function (listener) {if (listener[0] != "load")      return; listener[1] ()})},
   onloaderror : function () {main.paused = true;  listeners.forEach (function (listener) {if (listener[0] != "loaderror") return; listener[1] ()})},
   onpause     : function () {main.paused = true;  listeners.forEach (function (listener) {if (listener[0] != "pause")     return; listener[1] ()})},
   onplay      : function () {main.paused = false; listeners.forEach (function (listener) {if (listener[0] != "play")      return; listener[1] ()})}
  })
  
  main.volume = init.volume || 1
  return main
 }
 h.proto.HTMLElement.playAudio = function (obj) {
  function is_attached (obj) {
   while (true) {
    obj = obj.parentNode
    if (obj == document.documentElement) return true
    if (obj == null) return false
   }
  }
  function parentNode_test () {
   if (is_attached(obj)) {setTimeout (parentNode_test, 50); return}
   audio_object.stop ()
   if (typeof audio_object.release != "undefined") audio_object.release ()
  }
  
  parentNode_test ()
  var args = Array.prototype.slice.call(arguments)
  console.log (args)
  var audio_object = play_audio.apply (null, args)
  return audio_object
 }
}
// </ Audio functions.>

// <Graphics/image/canvas functions. TAG: graphics, TAG: <canvas>, TAG: canvas. TAG: image.>
// Function to help preload an image or list of images.
if (h.library_settings.graphics) {
 h.image_preload                      = function (cursrc, init) {
  if (typeof cursrc == "string") {
   var new_image = new Image ()
   if (typeof init != "undefined") {
    if (typeof init.success != "undefined") {new_image.onload  = function () {init.success (new_image)}}
    if (typeof init.error   != "undefined") {new_image.onerror = function () {init.error   (new_image)}}
   }
   new_image.src = cursrc
   return new_image
  } else {
   var init = cursrc
  }
  var dir_prefix = ((typeof init == "undefined") || (typeof init.dir == "undefined")) ? "" : init.dir
  
  var image_list = init.image_list
  var curlen = image_list.length
  var load_counter = curlen
  for (var i = 0; i < curlen; i++) {
   var image_temp = new Image ()
   image_temp.onload  = function () {load_counter -= 1}
   image_temp.onerror = function () {load_counter -= 1}
   image_temp.src = dir_prefix + image_list[i]
  }
  var test_load_complete_interval = setTimeout (test_load_complete, 30)
  function test_load_complete () {
   if (load_counter != 0) {test_load_complete_interval = setTimeout (test_load_complete, 30); return}
   clearInterval (test_load_complete_interval)
   if (typeof init.callback != "undefined") init.callback ()
  }
 }
 h.set_text_shadow_color              = function (element, text_shadow_color) {
  // The element must be appended to the DOM for this function to work.
  var text_shadow_string = window.getComputedStyle(element).textShadow
  
  // Split the text shadow into an array with "{color}, {px}, {px}" items.
  var text_shadow_array = text_shadow_string.split('rgb')
  text_shadow_array.shift()
  text_shadow_array.forEach (function(item, i, arr) {
   // Remove the rest of the rgb() section and clear out the extraneous comma at the end.
   var modified_item = item.slice(0, item.length - 2).split(") ")[1]
   // Insert the new color in each item.
   arr[i] = text_shadow_color + " " + modified_item
  })
  element.style.textShadow = text_shadow_array
 }
 h.add_webkit_text_stroke             = function  (init) {
  var source_element = init.element
  var text           = source_element.innerHTML
  var size_list      = init.size
  var color_list     = init.color
  var stroke_units = stroke_units || "px"
  if (typeof size_list  == "string") size_list  = [size_list]
  if (typeof color_list == "string") color_list = [color_list]
  var lineheight_1_string = window.getComputedStyle(source_element).lineHeight
  if (lineheight_1_string == "normal") {
   var lineheight_adjustment = 0
  } else {
   var lineheight_1 = parseInt(lineheight_1_string)
   if (Number.isNaN(lineheight_1)) lineheight_1 = 0
   var test_element = document.createElement ('div')
   test_element.style.whiteSpace = "nowrap"
   test_element.style.fontSize   = "100px"
   test_element.innerHTML = source_element.innerHTML
   document.body.appendChild (test_element)
   test_element.style.fontFamily = window.getComputedStyle(source_element).fontFamily
   var lineheight_saved = source_element.style.lineHeight
   source_element.style.lineHeight = test_element.getBoundingClientRect().height / 100
   document.body.removeChild (test_element)
   var lineheight_adjustment = ((parseFloat(window.getComputedStyle(source_element).lineHeight)) - lineheight_1) / 2
   source_element.style.lineHeight = lineheight_saved
  }
  source_element.innerHTML = ""
  for (var n = 0, curlen = text.length; n < curlen; n++) {
   var sub = document.createElement ('span')
   sub.style.position = "relative"
   source_element.appendChild (sub)
   sub.innerHTML = "<span style=\"position:relative; z-index:" + size_list.length + "\"/>" + text[n] + "</span>"
   size_list.forEach (function (current_stroke_size, i) {
    var current_stroke_size_unit = current_stroke_size.substr(current_stroke_size.match(/([A-Z])/i).index, current_stroke_size.length)
    var stroke_element = document.createElement ('div')
    stroke_element.style.position = "absolute"
    stroke_element.style.left     = 0
    stroke_element.style.top      = lineheight_adjustment + "px"
    stroke_element.style.zIndex   = size_list.length - i - 1
    stroke_element.style.color    = color_list[i]
    stroke_element.style.WebkitTextStrokeColor = color_list[i]
    stroke_element.style.WebkitTextStrokeWidth = parseFloat(current_stroke_size) * 2 + current_stroke_size_unit
    stroke_element.innerHTML = text[n]
    sub.appendChild (stroke_element)
   })
  }
 }
 // Colorize (eg: grayscale if the values are 1/1/1)
 h.canvas_colorize                    = function (ctx, rpercent, gpercent, bpercent, octx) {
  var i = 0, curwidth = ctx.canvas.width, curheight = ctx.canvas.height
  var pixels = ctx.getImageData (0, 0, curwidth, curheight)
  var pixels_data = pixels.data
  for (var x = 0; x < curwidth; x++) {
   for (var y = 0; y < curheight; y++) {
    var pixelavg = (pixels_data[i] + pixels_data[i + 1] + pixels_data[i + 2]) / 3
    var r = Math.round(pixelavg * rpercent); pixels_data[i] = (r <= 255) ? r : 255; i++
    var g = Math.round(pixelavg * gpercent); pixels_data[i] = (g <= 255) ? g : 255; i++
    var b = Math.round(pixelavg * bpercent); pixels_data[i] = (b <= 255) ? b : 255; i++
    i++
   }
  }
  octx.putImageData (pixels, 0, 0, 0, 0, curwidth, curheight)
 }
 h.create_composite_set               = function  (init) {
  var load_counter = 0
  var result_list = []
  function result_push (result, current_name) {result.name = current_name; result_list.push (result); load_counter -=1}
  var object_list = init.object_list
  for (var current_name in object_list) {
   var curobj = object_list[current_name]
   load_counter += 1
   void function (current_name) {
    create_composite ({
     layer_dir  : init.layer_dir,
     layer_name : current_name,
     color_list : curobj.color_list,
     callback   : function (result) {result_push(result, current_name)}
    })
   } (current_name)
  }
  var test_load_complete_interval = setTimeout (test_load_complete, 30)
  function test_load_complete () {
   if (load_counter != 0) {test_load_complete_interval = setTimeout (test_load_complete, 30); return}
   clearInterval (test_load_complete_interval)
   init.callback (result_list)
  }
 }
 h.create_composite                   = function (init) {
  var current_data = {}
  current_data.layer_name       = init.layer_name
  current_data.layer_color_list = init.color_list
  var layer_name_list = []
  // Generate the appropriate image names based on the length of the layer_colors array.
  for (var i = 0; i <  current_data.layer_color_list.length; i++) {
   layer_name_list.push (init.layer_dir + current_data.layer_name + '-' + i + '.png')
  }
  merge_and_colorize ({image_name_list:layer_name_list, color_list:current_data.layer_color_list, callback: init.callback})
 }
 var merge_and_colorize =
 h.merge_and_colorize                 = function (init) {
  var image_name_list = init.image_name_list
  var color_list = init.color_list
  // Load in all the images.
  var load_counter = image_name_list.length
  var image_list = []
  for (var i = 0; i < image_name_list.length; i++) {
   image_list[i] = new Image ()
   image_list[i].onload = function () {load_counter -= 1}
   image_list[i].src = image_name_list[i]
  }
  var test_load_complete_interval = setTimeout (test_load_complete, 30)
  function test_load_complete () {
   if (load_counter != 0) {test_load_complete_interval = setTimeout (test_load_complete, 30); return}
   clearInterval (test_load_complete_interval)
   do_merge_and_colorize ()
  }
  function do_merge_and_colorize () {
   // Create the canvas.
   var target = document.createElement ('canvas')
   var imagedata_target = target.getContext('2d')
   var canvas_width  = target.width  = image_list[0].width
   var canvas_height = target.height = image_list[0].height
   var imagedata_target_get  = imagedata_target.getImageData (0, 0, canvas_width, canvas_height)
   var imagedata_target_data = imagedata_target_get.data
   imagedata_target.globalCompositeOperation = 'source-over'
   
   // Merge the pixels.
   var r = 0, g = 0, b = 0
   var ctx_source_data_list = []
   var source_list          = []
   var rgb_list = []
   for (var i = 0; i < image_name_list.length; i++) {
    var source = document.createElement ('canvas')
    var ctx_source = source.getContext('2d')
    source.width  = image_list[i].width
    source.height = image_list[i].height
    ctx_source.drawImage (image_list[i], 0, 0)
    var rgb = hex_to_rgb (color_list[i])
    rgb_list.push ({r: rgb.r / 255, g: rgb.g / 255, b: rgb.b / 255})
    source_list.push (source)
    ctx_source_data_list.push (ctx_source.getImageData(0, 0, source.width, source.height))
   }
   var curlen = ctx_source_data_list[0].data.length
   for (var c = image_name_list.length - 1; c >= 0; c--) {
    var imagedata_source_data = ctx_source_data_list[c].data
    var current_rgb = rgb_list[c]
    for (var i = 0; i < curlen; i+=4) {
     var r = imagedata_source_data[i]  ; r *= current_rgb.r
     var g = imagedata_source_data[i+1]; g *= current_rgb.g
     var b = imagedata_source_data[i+2]; b *= current_rgb.b
     imagedata_source_data[i]     = (r > 255) ? 255 : r
     imagedata_source_data[i + 1] = (g > 255) ? 255 : g
     imagedata_source_data[i + 2] = (b > 255) ? 255 : b
    }
    var ctx = source_list[c].getContext('2d')
    ctx.putImageData(ctx_source_data_list[c], 0, 0)
    imagedata_target.drawImage(source_list[c], 0, 0)
   }
   init.callback (target)
  }
 }
var hex_to_color = h.hex_to_color = function (hex) {
  if (hex[0] == "#") hex = hex.substr(1)
  // Expand shorthand form (e.g. "#03F") to full form (e.g. "#0033FF")
  if (hex.length / 2 != Math.round(hex.length / 2)) hex = hex.split("").reduce(function(accumulator, value) {return accumulator + value + value}, "")
  function hex2dec (v) {return parseInt(v, 16)}
  var result = []; for (var i = 0; i < hex.length / 2; i++) {
   result[i] = hex2dec(hex[i * 2] + hex[i * 2 + 1])
  }
  return result
 }
 h.hex_to_rgb = function (hex) {var result = hex_to_color(hex); return {r: result[0], g: result[1], b: result[2]}}
 h.hex_to_rgba = function (hex) {var result = hex_to_color(hex); return {r: result[0], g: result[1], b: result[2], a: result[3]}}
 h.rgb_to_hex = h.rgba_to_hex = h.color_to_hex = function () {
  function dec2hex (v) {var hex = v.toString(16); if (hex.length == 1) hex = "0" + hex; return hex}
  var args = Array.prototype.slice.call(arguments)
  return "#" + args.reduce(function(accumulator, value) {return accumulator + dec2hex(value)}, "")
 }
 h.create_single_color_image_elements = function (init) {
  var obj_list = {}
  var n = 0
  for (var i in init.files) {
   n += 1
   obj_list[i] = document.createElement ('img')
   void function (refobject, refproperty, image_src) {
    color_fill ({
     image_src : image_src,
     color      : init.color,
     callback   : function (result) {
      refobject[refproperty] = result; refobject[refproperty].className = init.class
      n -= 1
      if (n == 0) init.callback (obj_list)
     }
    })
   } (obj_list, i, init.files[i])
  }
  return obj_list
 }
 h.color_fill                         = function (init) {
  // Does a color fill on an image (with an image_src provided), an image element, or canvas element.
  // If init.create_new is true and a canvas image is sent as the source image, then a new image is created.
  var return_result = ((typeof init.return_result != "undefined") && (init.return_result == true)) ? true : false
  // Load in the image.
  if (typeof init.image == "undefined") {
   var image_obj = new Image ()
   image_obj.src = init.image_src
   if (return_result == true) {return do_color_fill ()} else {
    if (init.fix_ie_bug) {load_timeout (image_obj, do_color_fill)} else {image_obj.addEventListener ('load', do_color_fill)}
   }
  } else {
   var image_obj = init.image
   if (init.image instanceof HTMLImageElement) {
    if (typeof init.image_src != "undefined") image_obj.src = init.image_src
    if (return_result == true) {return do_color_fill ()} else {
     if (init.fix_ie_bug) {load_timeout (image_obj, do_color_fill)} else {image_obj.addEventListener ('load', do_color_fill)}
    }
   }
   if (init.image instanceof HTMLCanvasElement) {
    if (return_result == true) {return do_color_fill ()} else {do_color_fill ()}
   }
  }
  
  // For IE10 and under:
  function load_timeout (element, callback) {
   test_size ()
   function test_size () {
    if ((typeof element.naturalWidth == "undefined") || (element.complete == false) || (element.naturalWidth == 0)) {var test = setTimeout (test_size, 20); return}
    element.width  = element.naturalWidth
    element.height = element.naturalHeight
    callback ()
   }
  }
  
  // Put the image into a canvas, colorize it with init.color, and run the callback with the result.
  function do_color_fill () {
   var rect_source = document.createElement ('canvas'); var rect_source_ctx = rect_source.getContext('2d')
   // IE10 fix.
   if ((init.image instanceof HTMLImageElement) && (init.fix_ie_bug)) {
    rect_source.width  = image_obj.naturalWidth
    rect_source.height = image_obj.naturalHeight
   } else {
    rect_source.width  = image_obj.width
    rect_source.height = image_obj.height
   }
   rect_source_ctx.fillStyle = init.color
   rect_source_ctx.fillRect (0, 0, rect_source.width, rect_source.height)
   if ((typeof init.image == "undefined") || (init.image instanceof HTMLImageElement) || ((typeof init.create_new != "undefined") && (init.create_new == true))) {
    var target = document.createElement ('canvas'); var target_ctx = target.getContext('2d')
    // IE10 fix.
    if ((init.image instanceof HTMLImageElement) && (init.fix_ie_bug)) {
     target.width  = image_obj.naturalWidth
     target.height = image_obj.naturalHeight
    } else {
     target.width  = image_obj.width
     target.height = image_obj.height
    }
    target_ctx.globalCompositeOperation = 'source-over'
    target_ctx.drawImage (image_obj, 0, 0)
   }
   if ((init.image instanceof HTMLCanvasElement) && ((typeof init.create_new == "undefined") || (init.create_new != true))) {
    var target = init.image; var target_ctx = target.getContext('2d')
   }
   target_ctx.globalCompositeOperation = 'source-in'
   target_ctx.drawImage (rect_source, 0, 0)
   if (typeof init.callback != "undefined") init.callback (target)
   if (return_result == true) return target
  }
 }
 h.canvas_filter                      = function (source, target, filter_function) {
  // Canvas per pixel filter. Filters an object with an isolated per-pixel filter function. Example:
  // canvas_filter (source, target, function (buffer, position) {
  // // r = buffer[position], g = buffer[position + 1], b = buffer[position + 2], a = buffer[position + 3]
  // // Example: converts black & white to transparency. rgba(b, b, b, 255) -> rgba(0, 0, 0, 255 - b)
  // // Assumes initial values of r equalling g and b, and a equalling 255.
  //  var r = buffer[position]
  //  buffer[position] = buffer[position + 1] = buffer[position + 2] = 0
  //  buffer[position + 3] = r
  // })
  var ctx = source.getContext ('2d')
  var canvas_width = source.width, canvas_height = source.height
  var source_data = source.getContext('2d').getImageData (0, 0, canvas_width, canvas_height)
  var source_data_buffer = source_data.data
  for (var i = 0, curlen = source_data_buffer.length; i < curlen; i += 4) {
   filter_function (source_data_buffer, i)
  }
  target.getContext('2d').putImageData (source_data, 0, 0)
 }
 h.canvas_clone                       = function (canvas) {
  var new_canvas = document.createElement('canvas')
  for (var property in canvas) {
   try {new_canvas[property] = canvas[property]} catch (err) {}
  }
  for (var property in canvas.style) {new_canvas.style[property] = canvas.style[property]}
  canvas.className = canvas
  var ctx = new_canvas.getContext('2d')  
  ctx.drawImage (canvas, 0, 0)
  return new_canvas
 }
 // Trim the top/bottom/left/right bounds of a canvas image.
 h.canvas_trim_empty_space            = function (init) {
  if (init instanceof HTMLElement) {
   var source_canvas = init
  } else {
   var source_canvas    = init.source
   var coordinates_only = ((typeof init.coordinates_only == "undefined") ? false : coordinates_only)
  }
  var canvas_initial_width = source_canvas.width, canvas_initial_height = source_canvas.height
  var ctx = source_canvas.getContext ('2d')
  var canvas_data = ctx.getImageData (0, 0, canvas_initial_width, canvas_initial_height)
  var canvas_data_data = canvas_data.data
  var curlen = canvas_data_data.length
  var x0 = 0, x1 = canvas_initial_width, y0 = 0, y1 = canvas_initial_height
  for (var y = 0; y < canvas_initial_height; y++) {
   var y_address = y * canvas_initial_width
   var all_empty = true
   for (var x = 0; x < canvas_initial_width; x++) {
    var a = canvas_data_data[(y_address + x) * 4 + 3]
    if (a != 0) {all_empty = false; break}
   }
   if (all_empty == false) {y0 = y; break}
  }
  for (var y = canvas_initial_height - 1; y >= 0; y--) {
   var y_address = y * canvas_initial_width
   var all_empty = true
   for (var x = 0; x < canvas_initial_width; x++) {
    var a = canvas_data_data[(y_address + x) * 4 + 3]
    if (a != 0) {all_empty = false; break}
   }
   if (all_empty == false) {y1 = y; break}
  }
  for (var x = 0; x < canvas_initial_width; x++) {
   var all_empty = true
   for (var y = 0; y < canvas_initial_height; y++) {
    var a = canvas_data_data[(y * canvas_initial_width + x) * 4 + 3]
    if (a != 0) {all_empty = false; break}
   }
   if (all_empty == false) {x0 = x; break}
  }
  for (var x = canvas_initial_width - 1; x >= 0; x--) {
   var all_empty = true
   for (var y = 0; y < canvas_initial_height; y++) {
    var a = canvas_data_data[(y * canvas_initial_width + x) * 4 + 3]
    if (a != 0) {all_empty = false; break}
   }
   if (all_empty == false) {x1 = x; break}
  }
  var new_width = x1 - x0 + 1, new_height = y1 - y0 + 1
  var result = {x0: x0, x1: x1, y0: y0, y1: y1}
  if (!init.coordinates_only) {
   var target_canvas = document.createElement ('canvas')
   var target_ctx = target_canvas.getContext ('2d')
   target_canvas.width  = new_width
   target_canvas.height = new_height
   target_ctx.drawImage (source_canvas, x0, y0, new_width, new_height, 0, 0, new_width, new_height)
   result.canvas = target_canvas
  }
  return result
 }
 // Create a simple SVG path from a string and draw it onto a canvas. Derived from kineticJS under MIT license.
 h.canvas_draw_path                   = function (init) {
  var x           = init.x || 0
  var y           = init.y || 0
  var scale       = init.scale || 1
  var data_string = init.data
  var canvas      = init.canvas
  
  var data_array = get_data_array_from_string (data_string)
  draw_func (data_array, canvas)
  
  function draw_func (data_array, canvas) {
   var context = canvas.getContext('2d')
   
   if (typeof init.lineWidth   != "undefined") context.lineWidth   = init.lineWidth
   if (typeof init.strokeStyle != "undefined") context.strokeStyle = init.strokeStyle
   if (typeof init.lineJoin    != "undefined") context.lineJoin    = init.lineJoin
   if (typeof init.lineCap     != "undefined") context.lineCap     = init.lineCap
   
   context.beginPath ()
   context.translate (init.x * scale, init.y * scale)
   for (var n = 0; n < data_array.length; n++) {
    var c = data_array[n].command
    var p = data_array[n].points
    switch (c) {
     case 'L' : context.lineTo (p[0], p[1]); break
     case 'M' : context.moveTo (p[0], p[1]); break
     case 'C' : context.bezierCurveTo (p[0], p[1], p[2], p[3], p[4], p[5]); break
     case 'z' : context.closePath (); break
    }
   }
   if ((typeof init.lineWidth == "undefined") || (init.lineWidth != 0)) context.stroke ()
   if ((typeof init.fillPatternImage != "undefined") || (typeof init.fillStyle != "undefined")) {
    if (typeof init.fillPatternImage != "undefined") {
     var pattern = context.createPattern(init.fillPatternImage, 'no-repeat')
     if (typeof init.fillPatternOffset != "undefined") {
      context.save ()
      context.translate (-init.fillPatternOffset[0] * scale, 0)
      context.translate (0, -init.fillPatternOffset[1] * scale)
     }
     context.fillStyle = pattern
    } else {
     // fillStyle is subordinate to fillPatternImage.
     context.fillStyle = init.fillStyle
    }
    context.fill ()
   }
   if (typeof init.fillPatternOffset != "undefined") context.restore ()
  }
  
  function get_data_array_from_string (data_string) {
   // Command string.
   var cs = data_string
   
   // Command chars.
   var cc = ['M', 'L', 'C']
   
   // Convert white spaces to commas.
   cs = cs.replace (new RegExp(' ', 'g'), ',')
   
   // Create pipes so that we can split the data.
   for (var n = 0; n < cc.length; n++) {cs = cs.replace (new RegExp(cc[n], 'g'), '|' + cc[n])}
   
   // Create the array.
   var arr = cs.split('|')
   var ca = []
   
   // Init the context point.
   var cpx = 0, cpy = 0
   for (n = 1; n < arr.length; n++) {
    var str = arr[n]
    var c = str.charAt(0)
    str = str.slice(1)
    
    // Remove ,- for consistency.
    str = str.replace (new RegExp(',-', 'g'), '-')
    
    // Add commas so that it's easy to split.
    str = str.replace (new RegExp('-', 'g'), ',-')
    str = str.replace (new RegExp('e,-', 'g'), 'e-')
    var p = str.split(',')
    if (p.length > 0 && p[0] === '') p.shift()
    
    // Convert numbers in strings to floats.
    for (var i = 0; i < p.length; i++) {p[i] = parseFloat(p[i]) * scale}
    
    while (p.length > 0) {
     if (isNaN(p[0])) break // Case for a trailing comma before next command.
     var cmd = null
     var points = []
     var startX = cpx, startY = cpy
     switch (c) {
      case 'L' :
       cpx = p.shift ()
       cpy = p.shift ()
       points.push (cpx, cpy)
       break
      case 'M' :
       // Subsequent points are treated as absolute lineTo.
       cpx = p.shift ()
       cpy = p.shift ()
       cmd = 'M'
       points.push (cpx, cpy)
       c = 'L'
       break
      case 'C' :
       points.push (p.shift(), p.shift(), p.shift(), p.shift())
       cpx = p.shift ()
       cpy = p.shift ()
       points.push (cpx, cpy)
       break
     }
     ca.push ({
      command : cmd || c,
      points  : points,
      start   : {x: startX, y: startY}
     })
    }
    if ((c === 'z') || (c === 'Z')) ca.push ({command: 'z', points: [], start: undefined})
   }
   return ca
  }
 }
 // Scale a path2d / svg path string.
 h.path2d_scale                       = function (path, scale) {
  var numstring   = ""
  var otherstring = ""
  var bigstring   = ""
  for (var i = 0, curlen = path.length; i < curlen; i++) {
   var s = path[i]
   if ((s == "-") || (s == "+") || (s == ".") || (s == "0") || (s == "1") || (s == "2") || (s == "3") || (s == "4") || (s == "5") || (s == "6") || (s == "7") || (s == "8") || (s == "9")) {
    if (otherstring.length > 0) {bigstring += otherstring; otherstring = ""}
    numstring += s
   } else {
    if (numstring.length > 0) {bigstring += parseFloat(numstring) * scale; numstring = ""}
    otherstring += s  
   }
  }
  if (otherstring.length > 0) bigstring += otherstring
  if (numstring.length > 0) bigstring += parseFloat(numstring) * scale
  return bigstring
 }
 h.on_background_image_url_load       = function (current_div, callback) {
  function get_domain_and_directory (url) {
   var last_index = url.lastIndexOf("/") + 1
   return url.substring(0, last_index)
  }
  var background_image_raw = current_div.style.backgroundImage
  if ((background_image_raw == "") || (background_image_raw == "none")) {
   // If there is no background image inline, checks the computed style. This mechanism will ignore seniority granted by "!important" inside the stylesheet.
   background_image_raw = window.getComputedStyle(current_div)['backgroundImage']
   if ((background_image_raw == "") || (background_image_raw == "none")) callback (null)
  }
  var base_dir = get_domain_and_directory (window.location.href)
  background_image_raw = background_image_raw.replace('url("' + base_dir, '').replace('")', '')
  background_image_raw = background_image_raw.replace("url('" + base_dir, '').replace("')", "")
  background_image_raw = background_image_raw.replace("url("  + base_dir, '').replace( ")", "")
  background_image_raw = background_image_raw.replace('url("', '').replace('")', '')
  background_image_raw = background_image_raw.replace("url('" , '').replace("')", "")
  background_image_raw = background_image_raw.replace("url("  , '').replace( ")", "")
  var temp_image = new Image ()
  temp_image.onload = function () {callback (temp_image)}
  temp_image.src = background_image_raw
 }
 h.handle_css_hover_effects           = function (init) {
  var init = init || {}
  var handle_touch_events = init.handle_touch_events || true
  var handle_mouse_events = init.handle_mouse_events || true
  var hover_class         = init.hover_class         || "hover"
  var delay_preferences   = init.delay_preferences   || {touch: {add: 500, remove: 500}}
  function default_handler (curobj, input_type, op) {
   var hovered_element_selector = "*" + ((op == "add") ? ":hover" : ("." + hover_class))
   var hovered_elements = Array.prototype.slice.call(document.body.querySelectorAll(hovered_element_selector))
   var modified_list = []
   while (true) {
    if ((curobj == null) || (curobj == document.documentElement)) break
    if (hovered_elements.indexOf(curobj) != -1) modified_list.push (curobj)
    curobj = curobj.parentNode
   }
   function do_hover_change () {modified_list.forEach (function (curobj) {curobj.classList[op](hover_class)})}
   if ((!delay_preferences[input_type]) || (!delay_preferences[input_type][op])) {
    do_hover_change ()
   } else {
    setTimeout (do_hover_change, delay_preferences[input_type][op])
   }
  }
  
  if (handle_mouse_events) {
   document.body.addEventListener ('mouseover' , function (evt) {var curobj = evt.target; default_handler (curobj, "mouse", "add")})
   document.body.addEventListener ('mouseout'  , function (evt) {var curobj = evt.target; default_handler (curobj, "mouse", "remove")})
   document.body.addEventListener ('click'     , function (evt) {var curobj = evt.target; default_handler (curobj, "mouse", "remove")})
  }
  
  if (handle_touch_events) {
   document.body.addEventListener ('touchstart', function (evt) {var curobj = evt.target; default_handler (curobj, "touch", "add")})
   document.body.addEventListener ('touchend'  , function (evt) {var curobj = evt.target; default_handler (curobj, "touch", "remove")})
   document.body.addEventListener ('touchmove',  function (evt) {
    var curobj = evt.target
    var hovered_elements = Array.prototype.slice.call(document.body.querySelectorAll("*:hover"))
    var lastobj = null
    evt = evt.changedTouches[0]
    var elements_at_point = get_elements_at_point (evt.pageX, evt.pageY)
    // Get the last element that isn't at the current point but is still hovered over, and remove only its hover attribute.
    while (true) {
     if ((curobj == null) || (curobj == document.documentElement)) break
     if ((hovered_elements.indexOf(curobj) != -1) && (elements_at_point.indexOf(curobj) == -1)) lastobj = curobj
     curobj = curobj.parentNode
    }
    if (lastobj == null) return
    if ((!delay_preferences.touch) || (!delay_preferences.touch.remove)) {
     lastobj.classList.remove(hover_class)
    } else {
     setTimeout (function () {lastobj.classList.remove(hover_class)}, delay_preferences.touch.remove)
    }
    
    function get_elements_at_point (x, y) {
     var el_list = [], pe_list = []
     while (true) {
      var curobj = document.elementFromPoint(x, y)
      if ((curobj == null) || (curobj == document.documentElement)) break
      el_list.push (curobj); pe_list.push (curobj.style.pointerEvents)
      curobj.style.pointerEvents = "none"
     }
     el_list.forEach (function (current_element, i) {current_element.style.pointerEvents = pe_list[i]})
     return el_list
    }
   })
  }
 }
 h.hex_color_blend = function (color1, color2, strength) {
  if (color1[0] == "#") color1 = color1.substr(1)
  if (color2[0] == "#") color2 = color2.substr(1)
  // Can be used to average RGB/RGBA hex values or to average individual components.
  function dec2hex (v) {var hex = v.toString(16); if (hex.length == 1) hex = "0" + hex; return hex}
  function hex2dec (v) {return parseInt(v, 16)}
  return ("#" + Array(color1.length / 2).fill(0, 0, color1.length / 2).reduce(function(accumulator, value, n) {
   var start = n * 2, end = (n + 1) * 2
   var color = Math.round(hex2dec(color1.slice(start, end)) * strength + hex2dec(color2.slice(start, end)) * (1 - strength))
   if (color > 256) color = 256
   return accumulator + dec2hex(color)
  }, ""))
 }
 h.cleanup_canvases                   = function (parent) {
  check_children (parent)
  function check_children (parent) {
   var children = parent.childNodes
   for (var i = 0, curlen = children.length; i < curlen; i++) {
    var curchild = children[i]
    if (curchild instanceof HTMLCanvasElement) {curchild.width = 0; curchild.height = 0; continue}
    check_children (curchild)
   }
  }
 }
}
// </Graphics/image/canvas functions.>

// <Feature/property detection functions. TAG: detection functions, TAG: detect device type, TAG: detect scrollbar size.>
if (h.library_settings.feature_detection) {
 h.detect_device_type         = function (obj) {
  var ua = navigator.userAgent.toLowerCase()
  obj.is_iphone          = /iphone/i.test(ua)
  obj.is_ipad            = /ipad/i.test(ua)
  obj.is_idevice         = obj.is_iphone || obj.is_ipad
  obj.is_android         = /android/i.test(ua)
  obj.is_chromium        = /chrome/i.test(ua)
  obj.is_windows_phone   = /windows phone/i.test(ua)
  obj.is_phone_or_tablet = ('ontouchstart' in window) || (obj.is_idevice || obj.is_android || obj.is_windows_phone)
 }
 h.detect_scrollbar_thickness = function () {
  // Create the measurement node.
  var scrollDiv = document.createElement("div")
  scrollDiv.style.width    = '100px'
  scrollDiv.style.height   = '100px'
  scrollDiv.style.overflow = 'scroll'
  scrollDiv.style.position = 'absolute'
  scrollDiv.style.top      = '-9999px'
  document.body.appendChild(scrollDiv)
  // Get the scrollbar width.
  var scrollbar_width = scrollDiv.offsetWidth - scrollDiv.clientWidth
  // Delete the DIV 
  document.body.removeChild (scrollDiv)
  return scrollbar_width
 }
 h.detect_event_is_supported  = function (event_name) {
  var TAGNAMES = {
   'select' : 'input',
   'change' : 'input',
   'submit' : 'form',
   'reset'  : 'form',
   'error'  : 'img',
   'load'   : 'img',
   'abort'  : 'img'
  }
  if (typeof window['on' + event_name] != "undefined") return true
  var element = document.createElement('div' || TAGNAMES[event_name])
  event_name = 'on' + event_name
  var is_supported = (typeof element[event_name] != "undefined")
  return is_supported
 }
 h.detect_pixels_per_inch     = function () {
  var dom_body = document.getElementsByTagName('body')[0]
  var dom_div  = document.createElement('div')
  dom_div.style = 'width: 1in; visibility:hidden'
  dom_body.appendChild (dom_div)
  var w = document.defaultView.getComputedStyle(dom_div, null).width
  dom_body.removeChild (dom_div)
  return parseInt(w)
 }
}
// </Feature/property detection functions.>

// <Cookie/localStorage functions. TAG: cookie, TAG: localstorage.>
if (h.library_settings.cookie) {
 h.readcookie = function (name) {
  var name_eq = name + "=", ca = document.cookie.split(";")
  for (var i = 0; i < ca.length; i++) {
   var c = ca[i]
   while (c.charAt(0) == " ") {c = c.substring(1, c.length)}
   if (c.indexOf(name_eq) == 0) return decodeURIComponent(c.substring(name_eq.length, c.length))
  }
  return null
 }
}
// </Cookie/localStorage functions.>

// <Font loading/handling functions. TAG: text, TAG: fonts, TAG: font loading.>
if (h.library_settings.font_loading) {
 // Check that a list of fonts have loaded, and if so, run the specified callback functions.
 h.load_web_fonts = function (font_list, callback, timeout_attempt_limit) {
  var timeout_attempt_limit = (typeof timeout_attempt_limit == "undefined") ? 300 : timeout_attempt_limit
  var loaded_font_amount = 0
  font_list.forEach (function (font_family) {
   if (typeof font_family == "string") {load_font_by_family_and_size (font_family, "normal"); return}
   var font_weight_list = font_family.font_weight, font_family = font_family.font_family
   font_weight_list.forEach (function (font_weight) {load_font_by_family_and_size (font_family, font_weight)})
  })
  
  if (typeof callback == "undefined") return
  
  check_that_all_fonts_have_loaded ()
  
  function load_font_by_family_and_size (font_family, font_weight) {
   var node = document.createElement ('span')
   // Set characters that vary significantly among different fonts.
   node.innerHTML = 'giItT1WQy@!-/#'
   // Visible - so we can measure it - but not on the screen.
   node.style.fontFamily    = 'sans-serif'
   node.style.position      = 'absolute'
   node.style.left          = '-10000px'
   node.style.top           = '-10000px'
   // Large font size makes even subtle changes obvious.
   node.style.fontSize      = '300px'
   // Reset any font properties.
   node.style.fontVariant   = 'normal'
   node.style.fontWeight    = font_weight
   node.style.letterSpacing = '0'
   document.body.appendChild (node)
   // Remember width with no applied web font.
   node.original_width = node.getBoundingClientRect().width
   node.style.fontFamily = font_family
   check_font (node, 0)
  }
  
  function check_font (node, timeout_attempt) {
   // Compare current width with original width.
   if (node.offsetWidth == node.original_width && timeout_attempt < timeout_attempt_limit) {
    timeout_attempt += 1
    var check_font_timeout = setTimeout (function () {check_font(node, timeout_attempt)}, 30); return
   }
   loaded_font_amount += 1
   node.parentNode.removeChild (node)
  }
  
  function check_that_all_fonts_have_loaded () {
   if (loaded_font_amount < font_list.length) {setTimeout (check_that_all_fonts_have_loaded, 30); return}
   callback ()
  }
 }
 
 // Thanks to ImBcmDth for helping with this.
 h.fit_text_to_parent = function (element, init, transform_scale) {
  if (typeof init == "undefined") init = {}
  var unit_type       = (typeof init.unit_type       != "undefined") ? init.unit_type       : "px"
  var transform_scale = (typeof init.transform_scale != "undefined") ? init.transform_scale : 1
  var iteration_max   = (typeof init.iteration_max   != "undefined") ? init.iteration_max   : 200
  var parent_rectangle = element.parentNode.getBoundingClientRect()
  var height = parent_rectangle.height / transform_scale
  var width  = parent_rectangle.width  / transform_scale
  
  // Might have to change the decimal precision above to work with "large" units like inches and cm.
  var iterations = 0
  function find_best_size (min_size, max_size, best_size) {
   var middle_size = +((max_size + min_size) / 2).toFixed(2)
   element.style.fontSize = middle_size + unit_type
   var rect = element.getBoundingClientRect()
   var inner_height = element.scrollHeight + (parseInt(rect.height / transform_scale) - rect.height / transform_scale)
   var inner_width  = element.scrollWidth  + (parseInt(rect.width  / transform_scale)  - rect.width / transform_scale)
   
   if (min_size === middle_size || max_size === middle_size) return best_size
   if (iterations < iteration_max) {
    if (inner_height > height || inner_width > width)   {iterations += 1; return find_best_size (min_size, middle_size, best_size)}
    if (inner_height <= height && inner_width <= width) {iterations += 1; return find_best_size (middle_size, max_size, middle_size)}
   }
   return best_size
  }
  var best = find_best_size (
   (typeof init.min_size  != "undefined") ? init.min_size  : 0,
   (typeof init.max_size  != "undefined") ? init.max_size  : 120,
   (typeof init.best_size != "undefined") ? init.best_size : 0
  )
  if (typeof init.min_size != "undefined") {if (best < init.min_size) best = init.min_size}
  element.style.fontSize = best + unit_type
 }
 
 // Another fit_text function. This one allows multiple child elements to be fitted.
 h.fit_text_horizontally = function (init) {
  var parent           = init.parent
  var children         = init.children
  var scale_ratio_max  = init.scale_ratio_max
  var scale_ratio_step = init.scale_ratio_step
  var adjust_elements  = init.adjust_elements
  if (!Array.isArray(children))        children = [children]
  if (!Array.isArray(adjust_elements)) adjust_elements = [adjust_elements]
  
  var adjust_elements_font_size = []
  adjust_elements.forEach (function (adjust_element, i) {
   adjust_elements_font_size[i] = parseFloat(window.getComputedStyle(adjust_element).getPropertyValue("font-size"))
  })
  
  while (true) {
   parent.style.width = "auto"
   var scale_ratio = parent.clientWidth
   parent.style.width = ""
   scale_ratio /= parent.clientWidth
   if (scale_ratio <= scale_ratio_max) break
   adjust_elements.forEach (function (adjust_element, i) {
    adjust_elements_font_size[i] *= scale_ratio_step
    adjust_element.style.fontSize = adjust_elements_font_size[i] + "px"
   })
  }
 }
}
// </Font loading/handling functions.>

// <Misc functions. In other words, I have no idea where they go.>
if (h.library_settings.misc) {
 // Deferred function processing.
 h.time_defer       = function (init, timeout_in_ms) {
  var condition_function = init.condition
  var result_function    = init.result
  void function function_test () {
   if (!condition_function()) {setTimeout (function_test, timeout_in_ms); return}
   result_function ()
  } ()
 }
 h.callback_compose = function (function_list, result, callback) {
  var n = 0, next_callback = function () {n += 1; inner ()}
  function inner () {
   if (n == function_list.length - 1) next_callback = callback
   function_list[n] (result, next_callback)
  }
  inner ()
 }
}
// </Misc functions.>

// Process .use_camelcases, use_underscores, and .use_prototypes.
void function () {
 var convert_to_prototypes = h.convert_to_prototypes = function (obj, window) {
  var proto = obj.proto
  for (var target_name in proto) {
   if ((target_name == "is_library_container") || (target_name == "isLibraryContainer")) continue
   var target = proto[target_name]
   for (var func_name in target) {
    if ((func_name == "is_library_container") || (func_name == "isLibraryContainer")) continue
    var func = target[func_name]
    void function (func) {
     window[target_name].prototype[func_name] = function () {
      return func.apply (null, [this].concat(Array.prototype.slice.call(arguments)))
     }
    } (func)
   }
  }
 }
 var convert_subproto_to_regular_functions = convert_subproto_to_regular_functions = function (obj) {
  var proto = obj.proto
  for (var target_name in proto) {
   if ((target_name == "is_library_container") || (target_name == "isLibraryContainer")) continue
   var target = proto[target_name]
   for (var func_name in target) {
    if ((func_name == "is_library_container") || (func_name == "isLibraryContainer")) continue
    var func = target[func_name]
    if (!obj[func_name]) obj[func_name] = func
   }
  }
 }

 if (h.library_settings.use_camelcases) {
  h.convert_to_camelcase = function (obj) {
   function camelize (str) {
    return str.replace(/_([a-zA-Z])/g, function (match) {return match.slice(1).toUpperCase()})
   }
   convert_props (obj)
   function convert_props (obj) {
    var camelCaseList = {}
    for (var prop in obj) {
     if ((typeof obj[prop] != "object") && (typeof obj[prop] != "function")) continue
     if (obj[prop].is_library_container) convert_props (obj[prop])
     camelCaseList[camelize(prop)] = obj[prop]
    }
    for (var prop in camelCaseList) {obj[prop] = camelCaseList[prop]}
   }
  }
  h.convert_to_camelcase (h)
 }
 
 if (!h.library_settings.use_underscores) {
  void function (obj) {
   remove_props (obj)
   function remove_props (obj) {
    for (var prop in obj) {
     if ((typeof obj[prop] != "object") && (typeof obj[prop] != "function")) continue
     if (obj[prop].is_library_container) remove_props (obj[prop])
     if (prop.indexOf("_") == -1) continue
     delete (obj[prop])
    }
   }
  } (h)
 }
 
 if (h.library_settings.use_prototypes) convert_to_prototypes (h, window)
 convert_subproto_to_regular_functions (h)
} ()
} ()
