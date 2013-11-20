// HelperJS version 2.4.

// Prototypes and Math. property-functions always camel-case.

// camelCase functions and variables, by design:
// var monthName
// var shortMonthName
//
// function addEvent
// function removeEvent
// var customEventList
// function runCustomEvents
// function addCustomEvent
// function removeCustomEvent
// function setTimeoutUpgraded
// function setIntervalUpgraded
// function intervalListAdd
// function intervalListClear
// function getRightClick
// function getWheelData
// function getKeyCodeString
//
// function getXY
// function getX
// function getY
// function getXY_zoom
// function getX_zoom
// function getY_zoom
// function getInheritedTransform
// function getTransformString
//
// function setScrollTop
// function setStyle
// function addStyle
// function getVendorSpecificPropertyName
// function getStylesheetPropertyValue
// function addStyleSheetRule
// function removeAllStyleSheetRules
// function removeAllDescendantsAndSelf
// function getClientWidthFull
// function getClientHeightFull
// function getCaretPosition
// function setCaretPosition
//
// Potentially case non-compliant functions and variables:
// function sortLinkedArrays
// function getArrayIndices
// function addArrayIgnoreDuplicates
// function ArrayFill
// function bitClear
// function bitSet
// function bitToggle
// function bitIsSet
// function countBits
// function isEmpty
// function String.prototype.indexOfMultiSingle (remove?)
// function queueDBDataAdd
// function queueDBDataAddMultiAccumulate
// function queueDBDataAddMultiRun
// function queueDBDataProcess
// function queueDBDataShift
// function setDBData
// function getTextData
// function getDBData_2Dintarray
// function getDBData_2Dintarray_zipped
// function getDBData_json
// function getDBData_binary
// function getDBData
// function addLIMenuOptions
// function makeListMenuObj
// function makeTipObjArray
// function loadTipStyling
// function loadingbarObject
// function getUrlVars
// function formUrlVars
// function playAudio

// Fix errors caused by console (or console.log) not being defined in certain browsers.
if (typeof console == "undefined") console = {}
if (typeof console.log == "undefined") console.log = function () {}


// <DOM object prototypes. TAG: DOM, TAG: DOM objects, TAG: prototypes.>
// Others: adoptChildren, stealChildren, window.childServices. Props to averyvery on the last one!
HTMLDivElement.prototype.appendChildrenOf = function (source) {
 while (source.firstChild) {this.appendChild (source.firstChild)}
 return this
}
// </DOM object prototypes.>


// <Event and interval handler/wrapper functions. TAG: event listener, TAG: event, TAG: setInterval, TAG: setTimeout.>
if (typeof addEvent != 'function') {
 var addEvent = function (o, t, f, l) {
  var d = 'addEventListener', n = 'on' + t
  if (o[d] && !l) return o[d](t, f, false)
  if (!o._evts) o._evts = {}
  if (!o._evts[t]) {
   o._evts[t] = {}
   if (o[n]) addEvent(o, t, o[n], l)
   o[n] = new Function('e',
    'var r = true, o = this, a = o._evts["' + t + '"], i; for (i in a) {' +
    'o._f = a[i]; if (o._f._i) r = o._f(e||window.event) != false && r;' +
    '} o._f = null; return r')
  }
  if (!f._i) f._i = addEvent._i++
  o._evts[t][f._i] = f
  if (t != 'unload') addEvent(window, 'unload', function() {removeEvent(o, t, f, l)})
 }
 addEvent._i = 1
 var removeEvent = function (o, t, f, l) {
  var d = 'removeEventListener'
  if (o[d] && !l) return o[d](t, f, false)
  if (o._evts && o._evts[t] && f._i) delete o._evts[t][f._i]
 }
}

// Custom events.
var customEventList = []
function runCustomEvents (event_name) {
 var event_list = customEventList[event_name]
 if (typeof event_list == "undefined") return
 for (var i in event_list) {event_list[i]()}
}
function addCustomEvent (event_handle, event_name, event_func) {
 if (typeof customEventList[event_name] == "undefined") customEventList[event_name] = {}
 customEventList[event_name][event_handle] = event_func
}
function removeCustomEvent (event_handle, event_name) {
 if (typeof customEventList[event_name] == "undefined") return
 if (typeof customEventList[event_name][event_handle] == "undefined") return
 delete (customEventList[event_name][event_handle])
}

// setTimeOut replacement.
window.setTimeoutUpgraded = function (func_param, delay, returnObject) {
 if ((typeof returnObject != "undefined") && (returnObject)) {
  var curtime = new Date().getTime()
  return {
          timeLeft : 0,
          start    : curtime,
          pause    : function () {
                      this.timeLeft = new Date().getTime() - this.start
                      if (this.timeLeft <= 0) return
                      window.clearTimeout (this.id)
                     },
          resume   : function () {
                      this.start = new Date().getTime()
                      this.id = setTimeout (func_param, this.timeLeft)
                     },
          id       : setTimeout (func_param, delay)
         }
 } else {
  return setTimeout (func_param, delay)
 }
}

// setInterval replacement.
window.setIntervalUpgraded = function (func_param, delay, returnObject) {
 if ((typeof returnObject != "undefined") && (returnObject)) {
  return {
          paused   : false,
          pause    : function () {if (this.paused == false) {window.clearInterval (this.id); this.paused = true}},
          resume   : function () {if (this.paused == true) {this.id = setInterval (func_param, delay); this.paused = false}},
          id       : setInterval (func_param, delay)
         }
 } else {
  return setInterval (func_param, delay)
 }
}

// Interval auto-clear functions for set-and-forget intervals.
function intervalListAdd (init) {
 if (typeof init.parent.intervalList == "undefined") init.parent.intervalList = []
 init.parent.intervalList.push [init.interval]
}

function intervalListClear (obj) {
 if (typeof parent.intervalList == "undefined") return
 var interval_list = obj.intervalList
 var curlen = interval_list.length
 for (var i = 0; i < curlen; i++) {
  clearInterval (interval_list[i])
 }
}

function getRightClick (evt) {
 if (evt.which) return (evt.which == 3)
 if (evt.button) return (evt.button == 2)
}

function getWheelData (evt) {
 return evt.detail ? evt.detail * -1 : evt.wheelDelta / 40;
}
	
function getKeyCodeString (evt) {
 if (typeof evt == "undefined") evt = window.event
 var keyCode = evt.keyCode
 switch (keyCode) {
  case  37 : return "left"
  case  38 : return "up"
  case  39 : return "right"
  case  40 : return "down"
  case 107 : case 187 : return "+"
  case 109 : case 189 : return "-"
  case  16 : return "shift"
  case  27 : return "escape"
  case  13 : return "enter"
  default  : return String.fromCharCode(keyCode).toUpperCase()
 } 
}

function add_pinch_controls (init) {
 void function (init) {
  var target_obj = init.target, current_distance = false, zoom_x = undefined, zoom_y = undefined
  target_obj.addEventListener ('touchstart', pinch)
  target_obj.addEventListener ('touchmove' , pinch)
  function pinch (evt) {
   if (evt.touches.length < 2) {current_distance = false; return}
   if (evt.type == 'touchmove') {
    if (current_distance == false) {return} else {var last_distance = current_distance}
   } else {
    if ((typeof init.start_condition != "undefined") && (init.start_condition (evt) === false)) return
   }
   var xy0 = getXY_zoom(evt.touches[0], target_obj); var x0 = xy0[0]; var y0 = xy0[1]
   var xy1 = getXY_zoom(evt.touches[1], target_obj); var x1 = xy1[0]; var y1 = xy1[1]
   if ((init.always_recalculate_zoom_target === true) || (current_distance == false)) {
    zoom_x = (x0 + x1) / 2, zoom_y = (y0 + y1) / 2
   }
   current_distance = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2))
   if (evt.type == 'touchstart') {
    if (typeof init.start_effect != "undefined") init.start_effect (evt)
    return
   }
   init.result_function (current_distance / last_distance, zoom_x, zoom_y)
   if (typeof init.move_effect != "undefined") init.move_effect ()
  }
 } (init)
}

function add_swipe_controls (init) {
 void function (init) {
  var target_obj = init.target, initial_x, initial_y, current_x, current_y, swipe_in_effect = false
  target_obj.addEventListener ('touchstart' , swipe_start_event)
  target_obj.addEventListener ('touchmove'  , function (evt) {swipe_event (evt)})
  target_obj.addEventListener ('touchend'   , function (evt) {if (swipe_in_effect == false) return; swipe_end_event (evt)})
  target_obj.addEventListener ('touchleave' , function (evt) {if (swipe_in_effect == false) return; swipe_end_event (evt)})
  target_obj.addEventListener ('touchcancel', function (evt) {if (swipe_in_effect == false) return; swipe_end (evt)})
  function swipe_end (evt) {
   if (swipe_in_effect == false) return
   swipe_in_effect = false
   if (typeof init.end_effect != "undefined") init.end_effect (evt)
  }
  function swipe_start_event (evt) {
   if ((typeof init.start_condition != "undefined") && (init.start_condition (evt) == false)) return
   if (evt.touches.length != 1) return
   var xy = getXY_zoom(evt.touches[0], target_obj); initial_x = xy[0]; initial_y = xy[1]
   if (swipe_in_effect == true) return
   swipe_in_effect = true
   if (typeof init.start_effect != "undefined") init.start_effect (evt)
  }
  function swipe_event (evt) {
   if ((evt.touches.length != 1) || ((typeof init.continue_condition != "undefined") && (init.continue_condition(evt) === false))) {swipe_end (evt); return}
   var xy = getXY_zoom(evt.touches[0], target_obj); current_x = xy[0]; current_y = xy[1]
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
 } (init)
}
// </Event and interval handler/wrapper functions.>


// <Array sorting functions. TAG: array, TAG: sorting.>
function alpha_sort (string_to_sort) {
 return string_to_sort.split('').sort(alpha_sort_inner_function).join('')
}

function alpha_sort_inner_function (a, b) {
 a = a.toLowerCase ()
 b = b.toLowerCase ()
 if (a > b) return  1
 if (a < b) return -1
 return 0
}
function case_insensitive_sort (a, b) {return alpha_sort_inner_function (a, b)}

// Sorts "linked arrays", or "array pairs".
// Sample sort function is: function (a, b) {if (a[0] > b[0]) return 1; return -(a[0] < b[0])}
function sortLinkedArrays (input_array, linked_array, sort_function) {
 if (typeof sort_function == "undefined") {
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
 input_array_obj.sort (sort_function)
 for (var i = 0; i < curlen; i++) {
  input_array[i]  = input_array_obj[i][0]
  linked_array[i] = input_array_obj[i][1]
 }
}

function getArrayIndices (input_array) {
 if (typeof sort_function == "undefined") var sort_function = function (a, b) {if (a[0] > b[0]) return 1; return -(a[0] < b[0])}
 var curlen = input_array.length
 var input_array_obj = new Array(curlen)
 for (var i = 0; i < curlen; i++) {
  input_array_obj[i] = [input_array[i], i]
 }
 input_array_obj.sort (sort_function)
 var output_array = new Array(curlen)
 for (var i = 0; i < curlen; i++) {
  output_array[input_array_obj[i][1]] = i
 }
 return output_array
}
// </Array sorting functions.>


// <Array manipulation functions. TAG: array, TAG: arrays, TAG: array manipulation.>
function addArrayIgnoreDuplicates (init) {
 var source = init["source"]
 var target = init["target"]
 var current_entry = null
 var target_found  = null
 var source_length = source.length
 var target_length = target.length
 for (var i = 0; i < source_length; i++) {
  current_entry = source[i]
  target_found = false
  for (var j = 0; j < target_length; j++) {
   if (target[j] != current_entry) continue
   if (target[j] == current_entry) {target_found = true; break}
  }
  if (target_found != true) {
   target.push (current_entry)
   target_length += 1
  }
 }
}

Array.prototype.sendToFront = function (obj) {
 var curlen = this.length
 if (typeof obj == "object") {
  for (var i = 0; i < curlen; i++) {
   if (!(objects_are_equal(obj, this[i]))) continue
   this.splice (i, 1)
   this.splice (0, 0, obj)
   return true
  }
 } else {
  for (var i = 0; i < curlen; i++) {
   if (obj != this[i]) continue
   this.splice (i, 1)
   this.splice (0, 0, obj)
   return true
  }
 }
 return false
}

Array.prototype.trim = function () {
 for (var i = 0, curlen = this.length; i < curlen; i++) {this[i] = this[i].replace(/^\s+|\s+$/g,"")}
 return this
}

Array.prototype.removeEmptyStrings = function () {
 for (var i = 0, curlen = this.length; i < curlen; i++) {
  if (this[i] != "") continue
  this.splice (i, 1)
  curlen -= 1
  i -= 1
 }
 return this
}

Array.prototype.multiply = function (mult_value) {
 for (var i = 0, curlen = this.length; i < curlen; i++) {
  this[i] = Math.round(this[i] * mult_value)
 }
 return this
}

Array.prototype.round = function () {
 for (var i = 0, curlen = this.length; i < curlen; i++) {
  this[i] = Math.round(this[i])
 }
 return this
}

Array.prototype.add = function (add_value) {
 var curlen = this.length
 for (var i = 0; i < curlen; i++) {
  this[i] += add_value
 }
 return this
}

Array.prototype.shuffle = function () {
 for (var i = this.length - 1; i > 0; i--) {
  var j = Math.floor(Math.random() * (i + 1))
  var tmp = this[i]
  this[i] = this[j]
  this[j] = tmp
 }
 return this
}


Array.prototype.fill = function (size, fill_value) {
 if (typeof fill_value == "undefined") {fill_value = size; obj = this; size = this.length} else {var obj = new Array(size)}
 for (var i = 0; i < size; i++) {obj[i] = fill_value}
 return obj
}
Array.fill = Array.prototype.fill

function search_array_of_objects (init) {
 var text_list        = init.text; if ((typeof text_list == "undefined") || (!(text_list instanceof Array) && (text_list.trim() == ""))) return init.array
 if (!(text_list instanceof Array)) text_list = [text_list]
 var input_array      = init.array
 var attribute_list   = init.attribute
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
// </Array manipulation functions.>


// <Generic logic functions. TAG: logic, TAG: logic functions, TAG: bits, TAG: bit manipulation, TAG: data, TAG: data manipulation.>

// Converts a 0 or 1 (or a string version of it) to a true/false value. Returns true if '1' or 1; otherwise, returns false.
function numeric_to_truthy (value) {if (+value == 1) {return true} else {return false}}
// Converts a true/false value to 0 (not true) or 1 (true).
function truthy_to_numeric (value) {if (value == true) {return 1} else {return 0}}
// Clear a bit n in the pth position, starting from 0.
function bitClear (n, p) {return n &= ~(1 << p)}
// Set a bit n in the pth position, starting from 0.
function bitSet (n, p) {return n |= (1 << p)}
// Toggle a bit n in the pth position, starting from 0.
function bitToggle (n, p) {return n ^= (1 << p)}
// Check if a bit n is set in the pth position, starting from 0.
function bitIsSet (n, p) {return (n & (1 << p) != 0)}
// Count the bits of a 32-bit integer.
function countBits (n) {
 n = n - ((n >> 1) & 0x55555555)                    // Reuse input as temporary.
 n = (n & 0x33333333) + ((n >> 2) & 0x33333333)     // Temp.
 return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24 // Count.
}

function objects_are_equal (a, b) {
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

function shallowcopy (obj) {
 if ((typeof obj !== 'object') || (obj == null)) return obj
 var c = ((obj instanceof Array) ? [] : {})
 for (var i in obj) {
  var prop = obj[i]
  if ((typeof prop != 'object') || (!(prop instanceof Array))) {c[i] = prop; continue}
  c[i] = []
  for (var j = 0, curlen = prop.length; j < curlen; j++) {
   c[i].push(prop[j])
  }
 }
 return c
}

function deepcopy (obj) {
 if ((typeof obj !== 'object') || (obj == null)) return obj
 var c = ((obj instanceof Array) ? [] : {})
 for (var i in obj) {
  var prop = obj[i]
  if (typeof prop != 'object') {c[i] = prop; continue}
  if (!(prop instanceof Array)) {c[i] = deepcopy(prop); continue}
  c[i] = []
  for (var j = 0, curlen = prop.length; j < curlen; j++) {
   if (typeof prop[j] != 'object') {c[i].push(prop[j]); continue}
   c[i].push(deepcopy(prop[j]))
  }
 }
 return c
}

function deep_extend (destination, source) {
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

// replace_property.
// Replace a property.. with something else.
//replace_property ({
// search_object    : {1: {11: {Control: function () {return 111}}}, 2: {21: {211: {Control: 2111}}}},
// search_property  : 'Control',
// replace_function : function (value) {return value}
//})
function replace_property (init) {
 var obj              = init.search_object
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

function grid_create (target, xsize, ysize, constructor) {
 var x = 0, y = 0
 if (constructor == null) {for (x = 0; x < xsize; x++) {target[x] = new Array()}; return}
 for (x = 0; x < xsize; x++) {
  target[x] = new Array()
  for (y = 0; y < ysize; y++) {
   target[x][y] = constructor
  }
 }
}
function grid_clone (source, target, xsize, ysize) {
 var x = 0, y = 0
 for (x = 0; x < xsize; x++) {
  target[x] = new Array()
  for (y = 0; y < ysize; y++) {
   target[x][y] = source[x][y]
  }
 }
}
// Unlike deepcopy, assumes arrays are already in place on the target and source/target xsize and ysize are the same.
function grid_copy (source, target, xsize, ysize) {
 var x = 0, y = 0
 for (x = 0; x < xsize; x++) {
  for (y = 0; y < ysize; y++) {
   target[x][y] = source[x][y]
  }
 }
}
function grid_normalize (curobj, xsize, ysize, oldmax, newmax, toint) {
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
   for (y = 0; y< ysize; y++) {
    curobj[x][y] = parseInt(curobj[x][y] / oldmax * newmax * 100) / 100
   }
  }
 }
}
function grid_clear (target, xsize, ysize) {
 var x = 0, y = 0
 for (x = 0; x < xsize; x++) {
  for (y = 0; y < ysize; y++) {
   delete (target[x][y])
  }
 }
}
function grid_set (target, xsize, ysize, value) {
 var x = 0, y = 0
 for (x = 0; x < xsize; x++) {
  for (y = 0; y < ysize; y++) {
   target[x][y] = value
  }
 }
}


function isEmpty (o) {
 for (var p in o) {if (o[p] != o.constructor.prototype[p]) return false}
 return true
}

function mapobject (fun, obj) {
 var result = new Object()
 for (var i in obj) {result[i] = fun(i, obj[i])}
 return result
}

function extend (source, target) {
 var target = target || new Object ()
 mapobject (function (k, v) {try {target[k] = v} catch (err) {console.log(err)}}, source)
 return target
}

function time_defer (init, timeout_in_ms) {
 var condition_function = init.condition
 var result_function    = init.result
 function_test ()
 function function_test () {
  if (!condition_function()) {setTimeout (function_test, timeout_in_ms); return}
  result_function ()
 }
}
// </Generic logic functions.>


// <Math manipulation functions. TAG: math, TAG: math manipulation.>
Math.rad      = function (degree) {return Math.PI / 180 * degree}
Math.randInt  = function (min, max) {return min + Math.floor(Math.random() * (max - min + 1))}
Math.randBool = function () {return (0 == Math.floor(Math.random() * 2))}
Math.GCD = function () {
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
Math.randBMT = function () {
 var x = 0, y = 0, rds, c
 // Get a random numbers from 0 to 1, with the mean at .5.
 
 // If the radius is zero or greater than 1, throw them out and pick two new ones
 // Rejection sampling throws away about 20% of the pairs.
 do {
  x = Math.random() * 2 - 1
  y = Math.random() * 2 - 1
  rds = x*x + y*y
 }
 while (rds == 0 || rds > 1)
 // This magic is the Box-Muller Transform.
 c = Math.sqrt(-2 * Math.log(rds) / rds)
 // It always creates a pair of numbers. I'll return them in an array.
 // This function is quite efficient so don't be afraid to throw one away if you don't need both.
 var x = (x*c + 1) / 2
 if (x > 1) {x = 1} else {if (x < 0) x = 0}
 return x
}
Math.eval = function (expression, replace_list) {
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

function pow (a, b) {
 return Math.pow (a,b)
}

// Get the final width/height of a rotated object.
function get_rotated_size (width, height, degrees) {
 degrees = degrees % 180
 width = degrees < 90 ? width : - width
 var radians = Math.rad(degrees), cosine  = Math.cos(radians), sine  = Math.sin(radians)
 return [Math.ceil(Math.abs(cosine * width + sine * height)), Math.ceil(Math.abs(cosine * height + sine * width))]
}
// </Math manipulation functions.>


// <Date manipulation functions. TAG: date.>
var monthName      = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var shortMonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
Date.prototype.getUTCTime = function() {return this.getTime() - -this.getTimezoneOffset()*60000}
Date.prototype.getMonthName = function() {return monthName[this.getMonth()]}
Date.prototype.getShortMonthName = function() {return shortMonthName[this.getMonth()]}
Date.prototype.getHHMMLocaleTimeString = function() {return shortMonthName[this.getMonth()]}
Date.prototype.daysInAMonth = function() {var d = new Date(this.getFullYear(), this.getMonth()+1, 0); return d.getDate()}
Date.prototype.setTimeObject = function (n) {this.setTime(n); return this}

// Get a date object from a string in the format of the Mysql DATETIME string, or vice-versa.
function get_date_from_mysql_format (mysql_string) {
 var mysql_array = mysql_string.split(" ")
 var ymd = mysql_array[0].split("-")
 var hms = mysql_array[1].split(":")
 return new Date(ymd[0], ymd[1]-1, ymd[2], hms[0], hms[1], hms[2], 0)
}
function get_mysql_format_from_date (unix_timestamp) {
 var date = new Date (unix_timestamp * 1000)
 var current_month  = date.getUTCMonth() + 1; if (current_month  < 10) current_month  = "0" + current_month
 var current_day    = date.getUTCDate()     ; if (current_day    < 10) current_day    = "0" + current_day
 var current_hour   = date.getUTCHours()    ; if (current_hour   < 10) current_hour   = "0" + current_hour
 var current_minute = date.getUTCMinutes()  ; if (current_minute < 10) current_minute = "0" + current_minute
 var current_second = date.getUTCSeconds()  ; if (current_second < 10) current_second = "0" + current_second
 return date.getUTCFullYear() + "-" + current_month + "-" + current_day + " " + current_hour + ":" + current_minute + ":" + current_second
}

// Mysql date (just date, no time) <-> unix timestamp conversion functions.
function mysql_date (unix_timestamp) {return mysql_date_from_unix_timestamp (unix_timestamp)}
function mysql_date_from_unix_timestamp (unix_timestamp) {
 var date = new Date (unix_timestamp * 1000)
 var current_month = date.getUTCMonth() + 1
 if (current_month < 10) current_month = "0" + current_month
 var current_day = date.getUTCDate()
 if (current_day < 10) current_day = "0" + current_day
 return date.getUTCFullYear() + "-" + current_month + "-" + current_day
}
function unix_timestamp_from_mysql_date (mysql_date) {
 var mysql_date_array = mysql_date.split("-")
 return parseInt((new Date (mysql_date_array[0], mysql_date_array[1]-1, mysql_date_array[2], 0, 0, 0, 0)).getUTCTime() / 1000)
}

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
// The mask defaults to dateFormat.masks.default.

var dateFormat = function () {
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
dateFormat.masks = {
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
dateFormat.i18n = {
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
Date.prototype.format = function (mask, utc) {return dateFormat(this, mask, utc)}
// <Date manipulation functions.>


// <String manipulation functions. TAG: string, string manipulation.>
String.prototype.repeat = function (num) {return new Array(num + 1).join(this)}
// Remove this?
String.prototype.indexOfMultiSingle = function (searchstring, startpos) {
 if (typeof startpos == "undefined") startpos = 0
 var curlen = this.length
 for (var i = startpos; i < curlen; i++) {if (searchstring.indexOf (this[i]) != -1) return i}
 return -1
}
// 16 bit. (2 bytes)
String.prototype.cushort = function () {return ( ((this.charCodeAt(1)&0xff)<<8) + (this.charCodeAt(0)&0xff) )}
// 32-bit. (4 bytes)
String.prototype.cuint = function () {return ((this.charCodeAt(3)&0xff)<<24) + ((this.charCodeAt(2)&0xff)<<16) + ((this.charCodeAt(1)&0xff)<<8) + (this.charCodeAt(0)&0xff)}
String.prototype.l2br = function () {return this.replace(/(\r\n|\n\r|\r|\n)/g, "<br/>")}
String.prototype.trim = function () {return this.replace(/^\s+|\s+$/g,"")}
String.prototype.ltrim = function () {return this.replace(/^\s+/,"")}
String.prototype.rtrim = function () {return this.replace(/\s+$/,"")}
// Splits by the specified divisor, then right-trims and left-trims, removing 0-character strings.
String.prototype.splitAndTrim = function (divisor) {
 if (this == null) return []
 var result = this.split(divisor)
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
String.prototype.capitalize = function() {
 return this.toLowerCase().replace(/^[a-z]|\s[a-z]/g, conv)
 function conv() {return arguments[0].toUpperCase()}
}
String.prototype.capitalizeFirstLetter = function() {
 return this.charAt(0).toUpperCase() + this.slice(1)
}
String.prototype.stripslashes = function () {
 return (this + '').replace(/\\(.?)/g, function (s, n1) {
  switch (n1) {
   case '\\' : return '\\'
   case '0'  : return '\u0000'
   case ''   : return ''
   default   : return n1
  }
 })
}
function shortenText (text, maximum_length) {
 if (text.length > maximum_length) text = text.slice (0, maximum_length - 4) + "..."
 return text
}
// Split a string into sentences.
function split_into_sentences (curobj) {
 var curobj = curobj.match(/.*?[.?!][")}\]]*( |$)/g), curlen = curobj.length
 for (var i = 0; i < curlen; i++) {curobj[i] = curobj[i].trim ()}
 return curobj
}

function addCommas (curstr) {
 curstr += ''
 x = curstr.split('.')
 x1 = x[0]
 x2 = x.length > 1 ? '.' + x[1] : ''
 var rgx = /(\d+)(\d{3})/
 while (rgx.test(x1)) {
  x1 = x1.replace(rgx, '$1' + ',' + '$2')
 }
 return x1 + x2
}

var grammar = {
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
// </String manipulation functions.>


// <Mouse/DOM object position functions. TAG: mouse, TAG: mouse position, TAG: positions, TAG: object positions, TAG: element positions.>

// Does not account for CSS transforms.
function getXY (evt, target) {
 if (typeof target == "undefined") target = evt.target
 if (typeof evt.pageX  != "undefined") {
  var obj = findabspos (target)
  return [evt.pageX - obj[0], evt.pageY - obj[1]]
 }
 if (typeof evt.offsetX != "undefined") return [evt.offsetX, evt.offsetY]
 if (typeof evt.layerY != "undefined") return [evt.layerX, evt.layerY]
}
function getX (evt, target) {
 if (typeof target == "undefined") target = evt.target
 if (typeof evt.pageX   != "undefined") return evt.pageX - findabspos_x (target)
 if (typeof evt.offsetX != "undefined") return evt.offsetX
 if (typeof evt.layerX  != "undefined") return evt.layerX
}
function getY (evt, target) {
 if (typeof target == "undefined") target = evt.target
 if (typeof evt.pageY   != "undefined") return evt.pageY - findabspos_y (target)
 if (typeof evt.offsetY != "undefined") return evt.offsetY
 if (typeof evt.layerY  != "undefined") return evt.layerY
}


// Accounts for scale-type CSS transforms.
function getXY_zoom (evt, target) {
 if (typeof target == "undefined") target = evt.target
 if (typeof evt.pageX  != "undefined") {
  var obj = findabspos_zoom (target)
  return [evt.pageX - obj[0], evt.pageY - obj[1]]
 }
 if (typeof evt.offsetX != "undefined") return [evt.offsetX, evt.offsetY]
 if (typeof evt.layerY != "undefined") return [evt.layerX, evt.layerY]
}
function getX_zoom (evt, target) {
 if (typeof target == "undefined") target = evt.target
 if (typeof evt.pageX   != "undefined") return evt.pageX - findabspos_zoom_x (target)
 if (typeof evt.offsetX != "undefined") return evt.offsetX
 if (typeof evt.layerX  != "undefined") return evt.layerX
}
function getY_zoom (evt, target) {
 if (typeof target == "undefined") target = evt.target
 if (typeof evt.pageY   != "undefined") return evt.pageY - findabspos_zoom_y (target)
 if (typeof evt.offsetY != "undefined") return evt.offsetY
 if (typeof evt.layerY  != "undefined") return evt.layerY
}


// Function to find the absolute position of a DOM object.
function findabspos (obj, lastobj) {
 var curleft = 0, curtop = 0, borderWidthTest = 0
 if (typeof lastobj == "undefined") lastobj = null
 do {
  borderWidthTest = parseFloat(window.getComputedStyle(obj).getPropertyValue('border-left-width'))
  if (!isNaN(borderWidthTest)) curleft += borderWidthTest
  borderWidthTest = parseFloat(window.getComputedStyle(obj).getPropertyValue('border-top-width'))
  if (!isNaN(borderWidthTest)) curtop += borderWidthTest
  if (obj.offsetParent == lastobj) return [curleft, curtop] // If offsetParent is null, return the result.
  curleft += obj.offsetLeft
  curtop  += obj.offsetTop
  obj = obj.offsetParent
 } while (true)
}
// Function to find the absolute x-position of a DOM object.
function findabspos_x (obj, lastobj) {
 var curleft = 0, borderWidthTest = 0
 if (typeof lastobj == "undefined") lastobj = null
 do {
  borderWidthTest = parseFloat(getComputedStyle(obj).getPropertyValue('border-left-width'))
  if (!isNaN(borderWidthTest)) curleft += borderWidthTest
  if (obj.offsetParent == lastobj) return [curleft] // If offsetParent is null, return the result.
  curleft += obj.offsetLeft
  obj = obj.offsetParent
 } while (true)
}
// Function to find the absolute y-position of a DOM object.
function findabspos_y (obj, lastobj) {
 var curtop = 0, borderWidthTest = 0
 if (typeof lastobj == "undefined") lastobj = null
 do {
  borderWidthTest = parseFloat(getComputedStyle(obj).getPropertyValue('border-top-width'))
  if (!isNaN(borderWidthTest)) curtop += borderWidthTest
  if (obj.offsetParent == lastobj) return [curtop] // If offsetParent is null, return the result.
  curtop += obj.offsetTop
  obj = obj.offsetParent
 } while (true)
}

// Function to find the absolute position of a DOM object, taking CSS scale transforms into account.
function findabspos_zoom (obj, lastobj) {
 var curleft = 0, curtop = 0, zoom_level_x = 0, zoom_level_y = 0, borderWidthTest = 0
 if (typeof lastobj == "undefined") lastobj = null
 do {
  if (obj.offsetParent == lastobj) {
   zoom_level_x = 1; zoom_level_y = 1
  } else {
   zoom_level_x = getInheritedTransform(obj.offsetParent, {transform_type:"scale", xy:"x"})
   zoom_level_y = getInheritedTransform(obj.offsetParent, {transform_type:"scale", xy:"y"})
  }
  borderWidthTest = parseFloat(getComputedStyle(obj).getPropertyValue('border-left-width'))
  if (!isNaN(borderWidthTest)) curleft += borderWidthTest * zoom_level_x
  borderWidthTest = parseFloat(getComputedStyle(obj).getPropertyValue('border-top-width'))
  if (!isNaN(borderWidthTest)) curtop += borderWidthTest * zoom_level_y
  if (obj.offsetParent == lastobj) return [curleft, curtop] // If offsetParent is null, return the result.
  curleft += obj.offsetLeft * zoom_level_x
  curtop  += obj.offsetTop  * zoom_level_y
  obj = obj.offsetParent
 } while (true)
}
// Function to find the absolute x-position of a DOM objet, taking CSS scale transforms into account.
function findabspos_zoom_x (obj, lastobj) {
 var curleft = 0, zoom_level_x = 0, borderWidthTest = 0
 if (typeof lastobj == "undefined") lastobj = null
 do {
  if (obj.offsetParent == lastobj) {
   zoom_level_x = 1
  } else {
   zoom_level_x = getInheritedTransform(obj.offsetParent, {transform_type:"scale", xy:"x"})
  }
  borderWidthTest = parseFloat(getComputedStyle(obj).getPropertyValue('border-left-width'))
  if (!isNaN(borderWidthTest)) curleft += borderWidthTest * zoom_level_x
  if (obj.offsetParent == lastobj) return [curleft] // If offsetParent is null, return the result.
  curleft += obj.offsetLeft * zoom_level_x
  obj = obj.offsetParent
 } while (true)
}
// Function to find the absolute y-position of a DOM object, taking CSS scale transforms into account.
function findabspos_zoom_y (obj, lastobj) {
 var curtop = 0, zoom_level_y = 0, borderWidthTest = 0
 if (typeof lastobj == "undefined") lastobj = null
 do {
  if (obj.offsetParent == lastobj) {
   zoom_level_y = 1
  } else {
   zoom_level_y = getInheritedTransform(obj.offsetParent, {transform_type:"scale", xy:"y"})
  }
  borderWidthTest = parseFloat(getComputedStyle(obj).getPropertyValue('border-top-width'))
  if (!isNaN(borderWidthTest)) curtop += borderWidthTest * zoom_level_y
  if (obj.offsetParent == lastobj) return [curtop] // If offsetParent is null, return the result.
  curtop += obj.offsetTop * zoom_level_y
  obj = obj.offsetParent
 } while (true)
}

// Example usage: getInheritedTransform (obj, {transform_type:scale, xy:"x"})
function getInheritedTransform (obj, init) {
 var transform_type = init.transform_type
 var xy             = init.xy
 var transform_string = ""
 var transform_array  = new Array();
 switch (transform_type) {
  case "scale":
   var scale = 1
   while (true) {
    transform_string = getTransformString ()
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
 
 function getTransformString () {
  var transform_string = window.getComputedStyle(obj)["Transform"]
  if (typeof transform_string == "undefined") {transform_string = window.getComputedStyle(obj)["msTransform"]}
  if (typeof transform_string == "undefined") {transform_string = window.getComputedStyle(obj)["webkitTransform"]}
  if (typeof transform_string == "undefined") {transform_string = window.getComputedStyle(obj)["MozTransform"]}
  if (typeof transform_string == "undefined") {transform_string = window.getComputedStyle(obj)["OTransform"]}
  if ((typeof transform_string == "undefined") || (transform_string == "none")) return false
  return transform_string
 }
}
// </Mouse/DOM object position functions.>


// <Ajax / download functions. TAG: ajax, TAG: xhr, TAG: download, TAG: downloads.>

// Create a download prompt.
function file_download (url, data_array) {
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

var global_db_queue = []
var global_db_queue_stored = {}
var global_db_queue_locked = false

function queueDBDataAdd () {
 if (global_db_queue_locked == true) {global_db_queue.push ([Array.prototype.slice.call(arguments)]); return}
 queueDBDataProcess.apply (null, Array.prototype.slice.call(arguments))
}

function queueDBDataAddMultiAccumulate () {
 var args = Array.prototype.slice.call(arguments)
 var store_name = args[0]; args.shift ()
 if (typeof global_db_queue_stored[store_name] == "undefined") global_db_queue_stored[store_name] = []
 global_db_queue_stored[store_name].push (args)
}

function queueDBDataAddMultiRun (store_name) {
 var current_set = global_db_queue_stored[store_name]
 if (global_db_queue_locked == true) {global_db_queue.push (current_set); return}
 queueDBDataProcess(current_set)
 delete (global_db_queue_stored[store_name])
}

function queueDBDataProcess (run_array) {
 global_db_queue_locked = true
 if (!(run_array instanceof Array)) {
  run_array = [Array.prototype.slice.call(arguments)]
 }
 for (var i = 0; i < run_array.length; i++) {
  var args = run_array[i]
  var function_name = args[0]; args.shift ()
  // Only do auto-shift for single queues.
  if (run_array.length == 1) {
   switch (function_name) {
    case 'setDBData'                   : args[6]  = queueDBDataShift; break
    case 'getTextData'                 : args[6]  = queueDBDataShift; break
    case 'getDBData_2Dintarray'        : args[10] = queueDBDataShift; break
    case 'getDBData_2Dintarray_zipped' : args[10] = queueDBDataShift; break
    case 'getDBData_json'              : args[1]  = queueDBDataShift; break
    case 'getDBData_binary'            : args[1]  = queueDBDataShift; break
    case 'getDBData'                   : args[10] = queueDBDataShift; break
   }
  }
  switch (function_name) {
   case 'setDBData'                   : setDBData.apply                   (null, args); break
   case 'getTextData'                 : getTextData.apply                 (null, args); break
   case 'getDBData_2Dintarray'        : getDBData_2Dintarray.apply        (null, args); break
   case 'getDBData_2Dintarray_zipped' : getDBData_2Dintarray_zipped.apply (null, args); break
   case 'getDBData_json'              : getDBData_json.apply              (null, args); break
   case 'getDBData_binary'            : getDBData_binary.apply            (null, args); break
   case 'getDBData'                   : getDBData.apply                   (null, args); break
  }
 }
}

function queueDBDataShift () {
 if (global_db_queue.length == 0) {global_db_queue_locked = false; return}
 queueDBDataProcess (global_db_queue.shift())
}

// Use XMLHttpRequest to set a single row of data: runs successfunc on success.
function setDBData (input_tablename, params, successfunc, errorfunc, successparam, async, finishfunc) {
 async = (typeof async != "undefined") ? async : true
 if (typeof successfunc != "undefined") {if (successfunc == null) successfunc = undefined}
 if (typeof errorfunc   != "undefined") {if (errorfunc == null)   errorfunc = undefined}
 
 // Trim the column list of spaces, and don't do anything if the column list is blank!
 params = params.trim(); if (params == '') return
 
 // Convert request into POST data.
 var requeststring = "&request_type=write&input_tablename=" + input_tablename + params
 console.log (requeststring)
 // Call the request function.
 var make_request_result = make_request("dbrequest.php", requeststring, undefined, undefined, async)
 var http_request        = make_request_result["http_request"]
 
 if (async == false) return process_http_request ()
 http_request.onreadystatechange = function () {if ((http_request.readyState == 4) && (http_request.status == 200)) process_http_request ()}
 
 function process_http_request () {
  if (http_request.responseText.substr(0, 5) == 'Error') {
   if (typeof errorfunc == "undefined") errorfunc = function (errormessage) {messagebox.send_message (errormessage)}
   errorfunc (http_request.responseText); if (typeof finishfunc != "undefined") finishfunc ()
   return
  }
  if (typeof successfunc != "undefined") {
   if (http_request.responseText != '') {
    try {
     var response_value = JSON.parse(http_request.responseText)
    } catch (err) {
     var response_value = {"message": http_request.responseText}
    }
   }
   if (typeof successparam != "undefined") {successfunc (response_value, successparam)} else {successfunc (response_value)}
  }
  if (typeof finishfunc != "undefined") finishfunc ()
 }
}


// Use XMLHttpRequest to get text data from a file.
function getTextData (filename, successfunc, errorfunc, successparam, send_data_as_plaintext, async, finishfunc) {
 async = (typeof async != "undefined") ? async : true
 if ((typeof send_data_as_plaintext == "undefined") || (send_data_as_plaintext != true)) send_data_as_plaintext = false
 var make_request_result = make_request(filename, '', false, send_data_as_plaintext, async)
 var http_request        = make_request_result["http_request"]
 
 if (async == false) return process_http_request ()
 http_request.onreadystatechange = function () {if ((http_request.readyState == 4) && (http_request.status == 200)) process_http_request ()}
 
 function process_http_request () {
  var response_value = http_request.responseText
  if (typeof successparam != "undefined") {successfunc (response_value, successparam)} else {successfunc (response_value)}
  if (typeof finishfunc != "undefined") finishfunc ()
 }
}


// Use XMLHttpRequest to get a 32-bit integer 2D array from a static file.
function getDBData_2Dintarray (responsedatavar, bytesize, filename, sizex, sizey, successfunc, errorfunc, successparam, async, finishfunc) {
 async = (typeof async != "undefined") ? async : true
 if (typeof successfunc != "undefined") {if (successfunc == null) successfunc = undefined}
 if (typeof responsedatavar != "object") return false
 
 for (var x = 0; x < sizex; x++) {responsedatavar[x] = []}
 var make_request_result = make_request (filename, "", undefined, undefined, async)
 var http_request        = make_request_result["http_request"]

 if (async == false) return process_http_request ()
 http_request.onreadystatechange = function () {if ((http_request.readyState == 4) && (http_request.status == 200)) process_http_request ()}
 
 function process_http_request () {
  var response_value = http_request.responseText
  var i = 0, len = response_value.length, x = 0, y = 0
  switch (bytesize) {
   case 1: for (i = 0; i < len; i += 1) {responsedatavar[x][y] = response_value.charCodeAt(i); x++; if (x==sizey) {x=0; y+=1}} break
   case 2: for (i = 0; i < len; i += 2) {responsedatavar[x][y] = ((response_value.charCodeAt(i)&0xff)<<8)       +(response_value.charCodeAt(i+1)&0xff); x++; if (x==sizey) {x=0; y+=1}} break
   case 3: for (i = 0; i < len; i += 3) {responsedatavar[x][y] = ((response_value.charCodeAt(i)&0xff)<<16)      +((response_value.charCodeAt(i+1)&0xff)<<8)+(response_value.charCodeAt(i+2)&0xff); x++; if (x==sizey) {x=0; y+=1}} break
   case 4: for (i = 0; i < len; i += 3) {responsedatavar[x][y] = (((response_value.charCodeAt(j)&0xff)<<24)>>>0)+((response_value.charCodeAt(j+1)&0xff)<<16)+((response_value.charCodeAt(j+2)&0xff)<<8)+(response_value.charCodeAt(j+3)&0xff); x++; if (x == sizey) {x=0; y+=1}} break
  }
  if (typeof successparam != "undefined") {successfunc (successparam)} else {successfunc ()}
  if (typeof finishfunc != "undefined") finishfunc ()
 }
}


// Use XMLHttpRequest to get a 32-bit integer 2D array from a set of static zipped files.
// Requires the JSZip library: http://stuartk.com/jszip.
if (typeof JSZip != "undefined") {
 function zip_imagelist_object () {
  var zip_src_to_generated_src_list = this.zip_src_to_generated_src_list = {}
  var deferred_list = {}
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
     for (var i = 0, curlen = result_keys.length; i < curlen; i++) {
      var relative_url = filename_dir + result_keys[i]
      var img = new Image ()
      img.src = window.URL.createObjectURL(web_worker_output[i])
      zip_src_to_generated_src_list[relative_url] = img.src
      var test_deferred = deferred_list[relative_url]
      if (typeof test_deferred != "undefined") {
       for (var t = 0; t < test_deferred.length; t++) {
        var test_deferred_current = test_deferred[t]
        test_deferred_current[0][test_deferred_current[1]] = img.src
       }
       delete (deferred_list[relative_url])
      }
     }
     if (typeof init.callback != "undefined") init.callback ()
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
   return ((typeof zip_src_to_generated_src_list[zip_src] == "undefined") ? zip_src : zip_src_to_generated_src_list [zip_src])
  }
  this.get_src_deferred = function (zip_src, obj, prop) {
   if (zip_src.trim() == '') return ''
   if (typeof zip_src_to_generated_src_list[zip_src] == "undefined") {
    if (typeof deferred_list[zip_src] == "undefined") deferred_list[zip_src] = []
    deferred_list[zip_src].push ([obj, prop])
    return zip_src
   } else {
    return zip_src_to_generated_src_list [zip_src]
   }
  }
 }
 
 var zip_load_images = function (init) {
  var filename = init.filename
  var async    = (typeof init.async    != "undefined") ? init.async    : true
  var callback = (typeof init.callback != "undefined") ? init.callback : function () {}
  var charset  = (typeof init.charset  != "undefined") ? init.charset  : true
  
  var make_request_result = make_request (filename, "", undefined, charset, async, 'arraybuffer', undefined, 'GET')
  var http_request        = make_request_result["http_request"]
  
  if (async == false) return process_http_request ()
  http_request.onreadystatechange = function () {if ((http_request.readyState == 4) && (http_request.status == 200)) process_http_request ()}
  
  function process_http_request () {
   var URL = window.URL | window.webkitURL
   var webworker_func = function (evt) {
    var response = evt.data
    window = {}
    importScripts ('http://capitalopoly.com/js/plugins/jszip/jszip.js')
    importScripts ('http://capitalopoly.com/js/plugins/jszip/jszip-deflate.js', 'http://capitalopoly.com/js/plugins/jszip/jszip-inflate.js')
    importScripts ('http://capitalopoly.com/js/plugins/jszip/jszip-load.js')
    var zip = new JSZip (response)
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
   web_worker.postMessage (http_request.response)
  }
 }
 
 var getDBData_2Dintarray_zipped = function (responsedatavar_list, bytesize, filename, sizex, sizey, successfunc, errorfunc, successparam_list, async, callback) {
  if (typeof errorfunc == "undefined") errorfunc = function () {}
  async = (typeof async != "undefined") ? async : true
  if (typeof successfunc != "undefined") {if (successfunc == null) successfunc = undefined}
  for (var filename_in_loop in responsedatavar_list) {
   var responsedatavar = responsedatavar_list[filename_in_loop]
   if (typeof responsedatavar != "object") return false
   for (var x = 0; x < sizex; x++) {responsedatavar[x] = []}
  }
  var make_request_result = make_request(filename, "", undefined, undefined, async, undefined, undefined, 'GET')
  var http_request        = make_request_result["http_request"]
 
  if (async == false) return process_http_request ()
  http_request.onreadystatechange = function () {if ((http_request.readyState == 4) && (http_request.status == 200)) process_http_request ()}
  
  function process_http_request () {
   var response_value_zipped = http_request.responseText
   // Take the response_value data and unzip it with JSUnzip.
   var zip = new JSZip(response_value_zipped)
   for (var filename_in_loop in zip.files) {
    var buffer = zip.file(filename_in_loop).asArrayBuffer()
    switch (bytesize) {
     case 1: var response_value = new Uint8Array (buffer); break
     case 2: var response_value = new Uint16Array(buffer); break
     case 4: var response_value = new Uint32Array(buffer); break
    }
    var responsedatavar = responsedatavar_list[filename_in_loop]
    var curlen = response_value.length, x = 0, y = 0
    for (var i = 0; i < curlen; i++)  {responsedatavar[x][y] = response_value[i]; x++; if (x == sizey) {x = 0; y++}}
    if (typeof successparam_list[filename_in_loop] != "undefined") {successfunc (successparam_list[filename_in_loop])} else {successfunc ()}
   }
   if (typeof callback != "undefined") callback ()
  }
 }
}

// Use XMLHttpRequest to request for table data in JSON form.
function getDBData_json (init, finishfunc) {
 getDBData (init['table'], init['column list'], init['success'], init['where params'], init['where values'], false, init['success value'], init['extra params'], init['async'], init['request method'], finishfunc)
}

// Use XMLHttpRequest to request for table data in binary form.
function getDBData_binary (init, finishfunc) {
 getDBData (init['table'], init['column list'], init['success'], init['where params'], init['where values'], true, init['success value'], init['extra params'], init['async'], init['request method'], finishfunc)
}


// Use XMLHttpRequest to request table data.
function getDBData (input_tablename, columnlist, successfunc, input_where, input_values, send_data_as_binary_func_param, successparam, extra_params, async, request_method, finishfunc) {
 var async = (typeof async != "undefined") ? async : true
 if (typeof request_method == "undefined") request_method = "POST"
 if (typeof successfunc != "undefined") {if (successfunc == null) successfunc = undefined}
 if (typeof errorfunc   != "undefined") {if (errorfunc   == null)   errorfunc = undefined}
 
 // Add custom "where" with associated values.
 var input_where_and_values = ''
 if (typeof input_values != "undefined") {
  if (input_values) {
   if (!(input_values instanceof Array)) input_values = [input_values] // Make input_values an array if it isn't.
   input_where_and_values = '&input_where=' + input_where.toString() + '&input_values=' + encodeURIComponent(JSON.stringify(input_values))
  }
 }
 
 // Trim the column list of spaces, and don't do anything if the column list is blank!
 columnlist = columnlist.trim(); if (columnlist == '') return
 var orderby_string_location = columnlist.search(/&orderby=/i)
 
 // Check for an orderby parameter.
 var orderby = ''
 if (orderby_string_location != -1) {
  orderby    = columnlist.substr(orderby_string_location)
  columnlist = columnlist.substr(0, orderby_string_location)
 }
 
 // Convert request into POST data.
 if ((typeof send_data_as_binary_func_param != "undefined") && (send_data_as_binary_func_param == true)) {
  var send_data_as_binary = true ; var send_data_as_binary_string = "&send_data_as_binary=true"
 } else {
  var send_data_as_binary = false; var send_data_as_binary_string = ""
 }
 
 var requeststring = '&request_type=read&input_tablename=' + input_tablename + '&columnlist=' + encodeURIComponent(columnlist) + orderby + input_where_and_values + send_data_as_binary_string + ((typeof extra_params != "undefined") ? extra_params : '')
 console.log (requeststring)
 // Set up the temp string and call the request function.
 var make_request_result = make_request ("dbrequest.php", requeststring, !send_data_as_binary, undefined, async, undefined, undefined, request_method)
 var http_request        = make_request_result["http_request"]
 
 if (async == false) {return process_http_request ()}
 http_request.onreadystatechange = function () {if ((http_request.readyState == 4) && (http_request.status == 200)) process_http_request ()}
 
 function process_http_request () {
  if (http_request.responseText.substr(0, 5) == 'Error') {messagebox.send_message (http_request.responseText); return}
  if (http_request.responseText.substr(0, 5) == 'Error') {
   if (typeof errorfunc == "undefined") errorfunc = function (errormessage) {messagebox.send_message (errormessage)}
   errorfunc (http_request.responseText); if (typeof finishfunc != "undefined") finishfunc ()
   return
  }
  // If the data is sent back as json, parse it using JSON.parse and return. 
  if (send_data_as_binary == false) {
   if (typeof successfunc != "undefined") {
    if (http_request.responseText != '') {
     try {
      var response_value = JSON.parse(http_request.responseText)
     } catch (err) {
      var response_value = {"message": http_request.responseText}
     }
    }
    if (typeof successparam != "undefined") {successfunc (response_value, successparam)} else {successfunc (response_value)}
   }
   if (typeof finishfunc != "undefined") finishfunc ()
   return
  }
  
  // Get the data if it is sent back as binary. Note: the byte array response type can't handle signed values!
  var tempdata = http_request.responseText
  var header_version = tempdata.charCodeAt(0)
  if (header_version != 0) {messagebox.send_message ('Unable to cope with this response text header version. ('+tempdata.slice(0,30)+') (' + requeststring+', '+header_version+')'); return}
  var column_amount = tempdata.charCodeAt(1)
  var len = column_amount*9+2
  var targetarray = new Array ()
  var x = 0
  for (i = 2; i < len; i += 9) {
   var cursubarray_bytetype    = tempdata.charCodeAt(i) + 1
   var cursubarray_indexlength = ((tempdata.charCodeAt(i+1)&0xff)<<8)+(tempdata.charCodeAt(i+2)&0xff)
   var cursubarray_startread   = ((tempdata.charCodeAt(i+3)&0xff)<<16)+((tempdata.charCodeAt(i+4)&0xff)<<8)+(tempdata.charCodeAt(i+5)&0xff)
   var cursubarray_endread     = ((tempdata.charCodeAt(i+6)&0xff)<<16)+((tempdata.charCodeAt(i+7)&0xff)<<8)+(tempdata.charCodeAt(i+8)&0xff)
   var y = 0
   // "Must have (tempdata.charCodeAt(j+3)&0xff)", not "tempdata.charCodeAt(j+3)&0xff":
   // "&" operates after "+"!
   var j = 0, k = 0
   
   switch (cursubarray_bytetype) {
    case 21: // Varchar.
     var endread1 = cursubarray_startread + cursubarray_indexlength * 2 //- 1
     splitarray = new Array ()
     for (j = cursubarray_startread; j <= endread1; j=j+2) {
      splitarray[k] = ((tempdata.charCodeAt(j)&0xff)<<8)+(tempdata.charCodeAt(j+1)&0xff); k++
     }
     k = 0; var curpointer = endread1
     if (typeof targetarray[x] == "undefined") targetarray[x] = new Array()
     for (j = 0; j < cursubarray_indexlength; j++) {
      targetarray[x][y] = tempdata.substr(curpointer, splitarray[j])
      y++; curpointer += splitarray[j]
     }
    case 22: // Varbinary.
     var endread1 = cursubarray_startread + cursubarray_indexlength * 2 //- 1
     var splitarray  = new Array ()
     for (j = cursubarray_startread; j <= endread1; j=j+2) {
      splitarray[k] = ((tempdata.charCodeAt(j)&0xff)<<8)+(tempdata.charCodeAt(j+1)&0xff); k++
     }
     k = 0; var curpointer = endread1
     if (typeof targetarray[x] == "undefined") targetarray[x] = new Array()
     for (j=0; j<cursubarray_indexlength; j++) {
      targetarray[x][y] = tempdata.substr(curpointer, splitarray[j])
      y++; curpointer += splitarray[j]
     }
    break  
    case 1: // Byte ("tinyint").
     for (j = cursubarray_startread; j<=cursubarray_endread; j++) {
      if (typeof targetarray[x] == "undefined") targetarray[x] = new Array()
      targetarray[x][y] = tempdata.charCodeAt(j); y++
     }
    break
    case 2: // Double-byte ("smallint").
     if (typeof targetarray[x] == "undefined") targetarray[x] = new Array()
     for (j = cursubarray_startread; j<=cursubarray_endread; j += 2) {
      targetarray[x][y] = ((tempdata.charCodeAt(j)&0xff)<<8)+(tempdata.charCodeAt(j+1)&0xff); y++
     }
    break
    case 3: // Three bytes ("mediumint").
     if (typeof targetarray[x] == "undefined") targetarray[x] = new Array()
     for (j = cursubarray_startread; j <= cursubarray_endread; j += 3) {
      targetarray[x][y] = ((tempdata.charCodeAt(j)&0xff)<<16)+((tempdata.charCodeAt(j+1)&0xff)<<8)+(tempdata.charCodeAt(j+2)&0xff); y++
     }
    break
     case 4: // Unsigned integer ("int").
     if (typeof targetarray[x] == "undefined") targetarray[x] = new Array()
     for (j = cursubarray_startread; j <= cursubarray_endread; j += 4) {
      targetarray[x][y] = (((tempdata.charCodeAt(j)&0xff)<<24)>>>0)+((tempdata.charCodeAt(j+1)&0xff)<<16)+((tempdata.charCodeAt(j+2)&0xff)<<8)+(tempdata.charCodeAt(j+3)&0xff); y++
     }
    break
    case 6: // Unsigned long integer ("bigint"). Note: accuracy is limited since Javascript can only handle 56-bit floats, not uintegers, so we drop the first char.
     if (typeof targetarray[x] == "undefined") targetarray[x] = new Array()
     for (j = cursubarray_startread; j <= cursubarray_endread; j += 8) {
      targetarray[x][y] = ((tempdata.charCodeAt(j+1)&0xff)*281474976710656)+((tempdata.charCodeAt(j+2)&0xff)*1099511627776)+((tempdata.charCodeAt(j+3)&0xff)*4294967296) +
                          (((tempdata.charCodeAt(j+4)&0xff)<<24)>>>0)+((tempdata.charCodeAt(j+5)&0xff)<<16)+((tempdata.charCodeAt(j+6)&0xff)<<8)+(tempdata.charCodeAt(j+7)&0xff); y++
     }
    break
   }
   x += 1
  }
  
  if (typeof successparam != "undefined") {successfunc (targetarray, successparam)} else {successfunc (targetarray)}
  if (typeof finishfunc != "undefined") finishfunc ()
 }
}

function get_data (params) {
 // Convert request into POST data.
 var send_data_as_plaintext = params.send_data_as_plaintext
 if (typeof send_data_as_plaintext == "undefined") send_data_as_plaintext = params.plaintext
 var is_asynchronous = params.is_asynchronous
 if ((typeof is_asynchronous == "undefined")) is_asynchronous = params.async
 var charset         = params.charset
 if ((typeof send_data_as_plaintext == "undefined") || (send_data_as_plaintext != true)) send_data_as_plaintext = false
 if ((typeof is_asynchronous == "undefined") || (is_asynchronous != false)) is_asynchronous = true
 if (typeof charset == "undefined") charset = ''
 // Call the request function.
 var http_request_result = make_request (params.file, params.data, send_data_as_plaintext, charset, is_asynchronous)
 var http_request        = http_request_result["http_request"]

 if (is_asynchronous == false) {
  return process_http_request ()
 }
 
 http_request.onreadystatechange = function () {
  if ((http_request.readyState == 4) && (http_request.status == 200)) process_http_request ()
 }
 
 function process_http_request () {
  var response_text = http_request.responseText
  if ((send_data_as_plaintext != true) && (response_text != null)) {
   // Send an error if the text can't be parsed.
   try {
    response_text = JSON.parse (response_text)
   } catch (err) {
    response_text = {error:true, errormessage:response_text}
    if (is_asynchronous == false) {return response_text} else {params.error(response_text); return}
   }
   if ((response_text != null) && (response_text.error == true)) {
    if (typeof params.error != "undefined") if (is_asynchronous == false) {return response_text} else {return params.error(response_text)}
    return
   }
  }
  if (is_asynchronous == false) return response_text
  if (typeof params.success != "undefined") params.success(response_text)
 }
}


function make_request (url, data, send_data_as_plaintext, charset, is_asynchronous, response_type, extra_header_set, request_method) {
 if ((typeof send_data_as_plaintext == "undefined") || (send_data_as_plaintext != true)) send_data_as_plaintext = false
 if ((typeof is_asynchronous == "undefined") || (is_asynchronous != false)) is_asynchronous = true
 if (typeof charset == "undefined") {charset = ''} else {charset = '; charset=' + charset}
 var http_request = new XMLHttpRequest()
 if (!http_request) {messagebox.send_message ("Cannot create an XMLHTTP instance for some reason. Please try reloading the page."); return false}
 if (typeof request_method == "undefined") var request_method = ((data == null) ? "GET" : "POST")
 if (request_method == "GET") {url = url + "?" + data; data = null}
 http_request.open (request_method, url, is_asynchronous)
 if (typeof response_type != "undefined") http_request.responseType = response_type
 if (send_data_as_plaintext == true) {
  http_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded' + charset)
 } else {
  http_request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded' + charset)
  http_request.overrideMimeType("text/plain; charset=x-user-defined")
 }
 http_request.send (data)
 return {"http_request": http_request}
}

function get_script_if_not_loaded (init) {
 var loaded_object_counter = init.global
 if (typeof loaded_object_counter[init.name] != "undefined") {
  if (typeof init.success != "undefined") init.success()
  return
 }
 if (typeof init.success == "undefined")  {
  //$.ajax({async: init.async, url: init.name, dataType: "script", error: function(errormessage) {for (var i in errormessage) {send_error(i + ": " + errormessage[i])}}})
 } else {
  //$.ajax({async: init.async, url: init.name, dataType: "script", success: init.success, error: function(errormessage) {for (var i in errormessage) {send_error(i + ": " + errormessage[i])}}})
 }
 loaded_object_counter[init.name] = true
}

function set_innerHTML_from_url (file, obj, success_func) {
 get_data ({
  file                   : file,
  data                   : "",
  success                : function (result) {obj.innerHTML = result; success_func()},
  send_data_as_plaintext : true
 })
}
// </Ajax / download functions>


// <DOM-widget functions. TAG: DOM, TAG: widgets, TAG: DOM widgets.>
function helpbox (helpstring) {
 alert (helpstring)
}

var messagebox = new messagebox_object
function messagebox_object () {
 var main = this
 main.handle_function = {}
 main.messagebox_silent = false
 main.send_message = function (message) {
  if (main.messagebox_silent == true) return
  var error_type = {}
  error_type.too_many_queries = (message.substr(0, 27) == "Error: for security reasons")
  error_type.world_disabled   = (message.substr(0, 40) == "Error: this world is currently disabled.")
  error_type.logged_out       = (message.substr(0, 33) == "Error: looks like you logged out.")
  for (var i in error_type) {
   if (error_type[i] == false) continue
   if (typeof main.handle_function[i] != "undefined") {
    main.handle_function[i]()
   }
   main.messagebox_silent = true
  }
  alert (message)
 }
}

function addLIMenuOptions (parent, options) {
 var temp_li = null
 var temp_a  = null
 var curlen = options.length
 for (var i = 0; i < curlen; i++) {
  temp_li = document.createElement('li')
  temp_a  = document.createElement('a')
  parent.appendChild(temp_li)
  temp_li.appendChild(temp_a)
  temp_a.innerHTML = options[i].text
  addEvent (temp_a, 'click', options[i].func)
 }
}

function makeListMenuObj () {
 listMenu = new FSMenu('listMenu', true, 'display', 'block', 'none')
 if (listMenu.showDelay != 0) listMenu.showDelay = 250
 listMenu.switchDelay = 0
 if (listMenu.hideDelay != 0) listMenu.hideDelay = 200
 listMenu.animations[listMenu.animations.length] = FSMenu.animFade
 listMenu.animations[listMenu.animations.length] = FSMenu.animSwipeDown
 var arrow = null
 if (document.createElement && document.documentElement) {
  arrow = document.createElement('span')
  arrow.appendChild(document.createTextNode('>')); arrow.className = 'subInd'
 }
}

function makeTipObjArray (tipid, init, cssLines) {
 var tipid_q = tipid
 if (typeof tipid == 'string') tipid_q = "'" + tipid_q + "'"
 var tipobjname_new = 'mytips' + tipid
 mytips[tipid] = new TipObj(tipobjname_new, 'mytips['+tipid_q+']')
 var i = 0; var temp = document.getElementsByTagName('style')[0]
 if (typeof temp == "undefined") {temp=document.createElement('style'); temp.type='text/css'}
 
 var len = cssLines.length; for (var i = 0; i < len; i++) {
  var csstext = '.tipClass_'+tipobjname_new+' '+cssLines[i]+' '
  if (typeof temp.styleSheet != "undefined") {temp.styleSheet.cssText += csstext} else {temp.innerHTML += csstext}
 }
 var myheader = document.getElementsByTagName('head')[0]
 myheader.appendChild(temp)
 var temp = document.createElement('div')
 temp.id = tipobjname_new+'Layer'; temp.innerHTML = '&nbsp;'
 setStyle(temp, 'position: absolute; z-index: 10000; visibility: hidden; left: 0px; top: 0px; display:block')
 document.body.appendChild(temp)
 var current_tip = mytips[tipid]
 current_tip.hideDelay = init.hideDelay
 current_tip.showDelay = init.showDelay
 current_tip.tipStick  = init.tipStick
 current_tip.template  = '<div class="tipClass_' + tipobjname_new + '" style="background-color:#6699CC">%tiptext%</div>'
 current_tip.useMouseHandlersOnTip = false
}

function loadTipStyling () {
 mytips = {}
 mytips.refresh = function () {
  for (var i in this) {
   var curobj = this[i]
   if (typeof curobj != "object") continue
   curobj.refresh ()
  }
 }
 makeTipObjArray (0,                  {showDelay:500 , hideDelay:0, tipStick:1}, ['{font:1em Helvetica; color:white; padding:.5em; float:left; max-width:15em}', 'a {text-decoration: none; color: #FFFFCC}'])
 makeTipObjArray (1,                  {showDelay:1500, hideDelay:0, tipStick:1}, ['{font:1em Helvetica; color:white; padding:.5em; float:left; max-width:15em}', 'a {text-decoration: none; color: #FFFFCC}'])
 makeTipObjArray (2,                  {showDelay:500 , hideDelay:0, tipStick:1}, ['{font:1em Helvetica; color:white; padding:.5em; float:left; display:block}' , 'a {text-decoration: none; color: #FFFFCC}'])
 makeTipObjArray ('tip_instant_blue', {showDelay:0   , hideDelay:0, tipStick:1}, ['{font:1em Helvetica; color:white; padding:.5em; float:left; max-width:15em}', 'a {text-decoration: none; color: #FFFFCC}'])
}

function addtip (that, tiptype, inline) { 
 if (typeof addtip.tipamount == "undefined") addtip.tipamount = 0
 if (typeof tiptype == "undefined") tiptype = 1
 
 switch (tiptype) {
 case 0: var newtipfunc = function() {mytips[tiptype].newTip({parent:that, replace:{offset_x:5 , offset_y :5, 'tiptext':that.tiptext}})}; break;
 case 1: var newtipfunc = function() {mytips[tiptype].newTip({parent:that, replace:{offset_x:20, offset_y:40, 'tiptext':that.tiptext}})}; break;
 case 2: var newtipfunc = function() {mytips[tiptype].newTip({parent:that, replace:{offset_x:20, offset_y:40, 'tiptext':that.tiptext}})}; break;
 case 'tip_instant_blue': var newtipfunc = function() {mytips[tiptype].newTip({parent:that, replace:{offset_x:5, offset_y:5, 'tiptext':that.tiptext, 'parent':that}})}; break;
 }
 if (typeof inline == 'undefined') inline = true
 if (inline == true) {
  addEvent (that, 'mouseover', newtipfunc)
  addEvent (that, 'mouseout', function() {mytips[tiptype].hide()})
 } else {
  newtipfunc ()
 }
}

function button (init) {
 var main               = this
 var parent             = init['parent']
 var className          = init['className']
 var style              = init['style']
 var text               = init['text']
 var clicked_function   = init['clicked function']
 var mouseover_function = init['mouseover function']
 var mouseout_function  = init['mouseout function']

 main.mousedown = function (evt) {
  if (getRightClick(evt)) return
  clicked_function (evt)
 }

 main.mouseover = function (evt) {
  mouseover_function (evt)
 }

 main.mouseout = function (evt) {
  mouseout_function (evt)
 }

 main.destroy = function () {
  removeEvent (main.mainobj, 'mousedown', main.mousedown)
  if (typeof mouseover_function != 'undefined') removeEvent (main.mainobj, 'mouseover', main.mouseover)
  if (typeof mouseout_function  != 'undefined') removeEvent (main.mainobj, 'mouseout', main.mouseout)
 }

 main.mainobj = document.createElement ('div')
 main.mainobj.innerHTML = text
 if (typeof className != "undefined")  main.mainobj.className = className
 if (typeof style != "undefined") setStyle (main.mainobj, style)
 parent.appendChild (main.mainobj)

 addEvent (main.mainobj, 'mousedown', main.mousedown)
 if (typeof mouseover_function != 'undefined') addEvent (main.mainobj, 'mouseover', main.mouseover)
 if (typeof mouseout_function  != 'undefined') addEvent (main.mainobj, 'mouseout', main.mouseout)

 // Add all "main.mainobj" properties to "main".
 for (var i in main.mainobj) {
  main[i] = main.mainobj[i]
 }
 return
}

function gui_close_button (init) {
 var close_button = document.createElement('div')
 init.parent.appendChild (close_button)
 close_button.className = "gui-window-close_button"
 addEvent (close_button, 'click', function (evt) {init.close_function (); evt.stopPropagation(); return false})
 return close_button
}

function sliderbar (init) {
 var main                        = this
 var parent                      = init['parent']
 var style_background            = init['style background']
 var style_foreground            = init['style foreground']
 var style_background_beyond_max = init['style background beyond max']
 var style_pivot_slice           = init['style pivot slice']
 var style_control               = init['style control']
 var starting_point_value        = init['tracking var']
 var do_not_start_function       = init['do not start function']
 var update_function             = init['update function']
 var final_update_function       = init['final update function']
 var point_maximum               = init['point maximum']; if (typeof point_maximum == 'undefined') point_maximum = 100
 var pivot_point                 = init['pivot point']; if (typeof pivot_point == 'undefined') pivot_point = 0
 var use_update_function_param   = init['use update function param']
 var point_upper_limit           = init['point upper limit']; if (typeof point_upper_limit == 'undefined') point_upper_limit = 100
 if (point_upper_limit == 0) point_upper_limit = 1
 var textbox_enabled             = init['textbox enabled'] || false
 
 if (textbox_enabled == true) {
  var style_textbox  = init['style textbox']  || ''
  var textbox = document.createElement('div')
  setStyle (textbox, style_textbox)
  parent.appendChild (textbox)
  
  var textbox_prefix_text = init['textbox prefix'] || ''
  if (textbox_prefix_text != '') {
   var style_textbox_prefix = init['style textbox prefix']  || ''
   var textbox_prefix       = document.createElement('div')
   setStyle (textbox_prefix, style_textbox_prefix)
   textbox_prefix.innerHTML = textbox_prefix_text
   textbox.appendChild (textbox_prefix)
  }
  
  var style_textbox_number = init['style textbox number']  || ''
  var textbox_number       = document.createElement('input')
  setStyle (textbox_number, style_textbox_number)
  textbox_number.type = "text"
  textbox_number.readOnly = false
  addEvent (textbox_number, 'input', textbox_change)
  addEvent (textbox_number, 'keypress', textbox_keypress)
  textbox.appendChild (textbox_number)
  
  var textbox_suffix_text = init['textbox suffix'] || ''
  if (textbox_suffix_text != '') {
   var style_textbox_suffix = init['style textbox suffix']  || ''
   var textbox_suffix = document.createElement('div')
   setStyle (textbox_suffix, style_textbox_suffix)
   textbox_suffix.innerHTML = textbox_suffix_text
   textbox.appendChild (textbox_suffix)
  }
 }
 
 function textbox_change (evt) {
  var curvalue = parseFloat(textbox_number.value)
  if (isNaN(curvalue)) curvalue = 0
  if (curvalue < 0)    curvalue = 0
  if (curvalue > point_upper_limit) curvalue = point_upper_limit
  main.set_position_by_point_value (curvalue)
 }
 function textbox_keypress (evt) {
  var keyCode = evt.keyCode
  if (keyCode == 13) textbox_number.blur ()
 }
 function textbox_update_value () {
  textbox_number.value = Math.round((point_upper_limit*main.slider_position)/main.slider_position_upper_limit)
 }
 function textbox_blur (evt) {
  if (textbox_enabled == false) return
  if (evt.currentTarget == textbox_number) return
  textbox_number.blur ()
 }
 
 main.sliderbar_background = document.createElement('div'); parent.appendChild(main.sliderbar_background)
 setStyle(main.sliderbar_background, style_background)
 
 var zoom_level = getInheritedTransform(main.sliderbar_background, {transform_type:"scale", xy:"x"})
 
 main.slider_position_upper_limit = main.sliderbar_background.clientWidth
 
 main.slider_position_max         = Math.round(main.sliderbar_background.clientWidth * (point_maximum / point_upper_limit))
 main.slider_position             = (starting_point_value * main.slider_position_upper_limit) / point_upper_limit
 
 main.sliderbar_foreground = document.createElement('div'); main.sliderbar_background.appendChild(main.sliderbar_foreground)
 setStyle(main.sliderbar_foreground, style_foreground)
 main.sliderbar_foreground.style.width = main.slider_position + 'px'
 if (typeof style_background_beyond_max != 'undefined') {
  main.sliderbar_background_beyond_max = document.createElement('div'); main.sliderbar_background.appendChild(main.sliderbar_background_beyond_max)
  setStyle(main.sliderbar_background_beyond_max, style_background_beyond_max)
  main.sliderbar_background_beyond_max.style.width = (main.slider_position_upper_limit - main.slider_position_max) + 'px'
  main.sliderbar_background_beyond_max.style.left  = (main.slider_position_max + 1) + 'px'
 }
 
 if (typeof style_pivot_slice != 'undefined') {
  main.sliderbar_pivot_slice = document.createElement('div'); main.sliderbar_background.appendChild(main.sliderbar_pivot_slice)
  setStyle(main.sliderbar_pivot_slice, style_pivot_slice)
  
  main.slider_pivot_start  = Math.round(main.sliderbar_background.clientWidth * (pivot_point / point_upper_limit))
  main.slider_pivot_end    = parseFloat(main.slider_position)
  if (main.slider_pivot_end > main.slider_pivot_start) {
   main.sliderbar_pivot_slice.style.width = (main.slider_pivot_end - main.slider_pivot_start) + 'px'
   main.sliderbar_pivot_slice.style.left  = main.slider_pivot_start + 'px'
  } else {
   main.sliderbar_pivot_slice.style.width = (main.slider_pivot_start - main.slider_pivot_end) + 'px'
   main.sliderbar_pivot_slice.style.left  = main.slider_pivot_end + 'px'
  }
 }
 
 var sliderbar_control = document.createElement('div'); main.sliderbar_background.appendChild(sliderbar_control)
 setStyle(sliderbar_control, style_control)
 sliderbar_control.style.left = main.slider_position - parseFloat(sliderbar_control.style.width) / 2 + 'px'
 if (textbox_enabled == true) textbox_update_value ()
 
 var startscroll          = false
 var startx               = 0
 var offsetx              = 0
 addEvent (document.body             , 'mousemove', sliderbar_mousemove)
 addEvent (document.body             , 'mouseup'  , sliderbar_mouseup_or_blur)
 addEvent (document.body             , 'mousedown', textbox_blur)
 addEvent (window                    , 'blur'     , sliderbar_mouseup_or_blur)
 addEvent (window                    , 'mouseout' , sliderbar_mouseout)
 addEvent (sliderbar_control         , 'mousedown', sliderbar_control_mousedown)
 addEvent (main.sliderbar_background , 'mousedown', sliderbar_mousedown)
 
 main.update_position = function () {
  startx = (findabspos_zoom_x(main.sliderbar_background)/zoom_level - parseFloat(sliderbar_control.style.width) / 2)
 }
 
 main.destroy = function () {
  removeEvent (document.body            , 'mousemove', sliderbar_mousemove)
  removeEvent (document.body            , 'mouseup'  , sliderbar_mouseup_or_blur)
  removeEvent (window                   , 'blur'     , sliderbar_mouseup_or_blur)
  removeEvent (document.body            , 'mousedown', textbox_blur)
  removeEvent (window                   , 'mouseout' , sliderbar_mouseout)
  removeEvent (sliderbar_control        , 'mousedown', sliderbar_control_mousedown)
  removeEvent (main.sliderbar_background, 'mousedown', sliderbar_mousedown)
  if (textbox_enabled == true) {
   removeEvent (textbox_number, 'click'   , textbox_toggle)
   removeEvent (textbox_number, 'input'   , textbox_change)
   removeEvent (textbox_number, 'keypress', textbox_keypress)
  }
 }
 
 main.set_position = function (new_position) {
  main.slider_position = new_position
  
  if (main.slider_position > main.slider_position_max) {
   main.slider_position = main.slider_position_max
  } else {
   if (main.slider_position < 0) main.slider_position = 0
  }
  
  sliderbar_control.style.left = main.slider_position - parseFloat(sliderbar_control.style.width) / 2 + 'px'
  main.sliderbar_foreground.style.width = main.slider_position + 'px'
  
 if (typeof style_pivot_slice != 'undefined') {
   main.slider_pivot_start  = Math.round(main.sliderbar_background.clientWidth * (pivot_point / point_upper_limit))
   main.slider_pivot_end    = main.slider_position
   if (main.slider_pivot_end > main.slider_pivot_start) {
    main.sliderbar_pivot_slice.style.width = (main.slider_pivot_end - main.slider_pivot_start) + 'px'
    main.sliderbar_pivot_slice.style.left  = main.slider_pivot_start + 'px'
   } else {
    main.sliderbar_pivot_slice.style.width = (main.slider_pivot_start - main.slider_pivot_end) + 'px'
    main.sliderbar_pivot_slice.style.left  = main.slider_pivot_end + 'px'
   }
  }
  if (textbox_enabled == true) textbox_update_value ()
  if (use_update_function_param == true) {update_function (main.update_function_param)} else {update_function ()}
 }
 
 function sliderbar_mousemove (evt) {
  if (startscroll == false) return
  var x = evt.pageX/zoom_level
  main.set_position (x - offsetx - startx)
 }
 
 main.set_position_by_point_value = function (new_position) {
  main.set_position ((new_position * main.slider_position_upper_limit) / point_upper_limit)
 }
 
    
 function sliderbar_mousedown (evt) {
  if (getRightClick(evt)) return
  if (do_not_start_function()) return
  if (startscroll == true) return
  main.update_position ()
  offsetx = parseFloat(sliderbar_control.style.width) / 2
  startscroll = true
  sliderbar_mousemove (evt)
 }
 
 function sliderbar_control_mousedown (evt) {
  if (getRightClick(evt)) return
  if (do_not_start_function()) return
  if (startscroll == true) return
  main.update_position ()
  offsetx = (evt.pageX - findabspos_zoom_x (evt.target))/zoom_level
  startscroll = true
 }
 
 function sliderbar_mouseout (evt) {
  var mouseX = evt.pageX; var mouseY = evt.pageY
  var windowScrollX = window.scrollX; if (typeof windowScrollX == "undefined") windowScrollX = document.body.scrollLeft
  var windowScrollY = window.scrollY; if (typeof windowScrollY == "undefined") windowScrollY = document.body.scrollTop
  if (((mouseY >= 0)) && ((mouseY <= window.innerHeight + windowScrollY)) && ((mouseX >= 0) && mouseX <= (window.innerWidth + windowScrollX))) return
  sliderbar_mouseup_or_blur (evt)
 }
 
 function sliderbar_mouseup_or_blur (evt) {
  if (startscroll == false) return
  startscroll = false
  final_update_function ()
  return
 }
}


function sliderbar_v2 (init) {
 var main                        = this
 var parent                      = main.parent                      = init['parent']
 var style_background            = main.style_background            = init['style background'] || ""
 var style_foreground            = main.style_foreground            = init['style foreground'] || ""
 var class_background            = main.class_background            = init['background class']
 var class_foreground            = main.class_foreground            = init['foreground class']
 var style_background_beyond_max = main.style_background_beyond_max = init['style background beyond max']
 var style_pivot_slice           = main.style_pivot_slice           = init['style pivot slice']
 var style_control               = main.style_control               = init['style control'] || ""
 var class_control               = main.class_control               = init['control class']
 var starting_point_value        = main.starting_point_value        = init['tracking var']
 var do_not_start_function       = main.do_not_start_function       = init['do not start function']
 var update_function             = main.update_function             = init['update function']
 var final_update_function       = main.final_update_function       = init['final update function']
 var point_maximum               = init['point maximum']; if (typeof point_maximum == 'undefined') point_maximum = 100
 main.point_maximum = point_maximum
 var pivot_point                 = main.pivot_point                 = init['pivot point']; if (typeof pivot_point == 'undefined') pivot_point = 0
 var use_update_function_param   = main.use_update_function_param   = init['use update function param']
 var point_upper_limit           = init['point upper limit']; if (typeof point_upper_limit == 'undefined') point_upper_limit = 100
 if (point_upper_limit == 0) point_upper_limit = 1
 main.point_upper_limit = point_upper_limit
 var textbox_enabled             = main.textbox_enabled             = init['textbox enabled'] || false
 
 if (textbox_enabled == true) {
  var style_textbox  = init['style textbox']  || ''
  var textbox = document.createElement('div')
  setStyle (textbox, style_textbox)
  parent.appendChild (textbox)
  
  var textbox_prefix_text = init['textbox prefix'] || ''
  if (textbox_prefix_text != '') {
   var style_textbox_prefix = init['style textbox prefix']  || ''
   var textbox_prefix       = document.createElement('div')
   setStyle (textbox_prefix, style_textbox_prefix)
   textbox_prefix.innerHTML = textbox_prefix_text
   textbox.appendChild (textbox_prefix)
  }
  
  var style_textbox_number = init['style textbox number']  || ''
  var textbox_number       = document.createElement('input')
  setStyle (textbox_number, style_textbox_number)
  textbox_number.type = "text"
  textbox_number.readOnly = false
  addEvent (textbox_number, 'input', textbox_change)
  addEvent (textbox_number, 'keypress', textbox_keypress)
  textbox.appendChild (textbox_number)
  
  var textbox_suffix_text = init['textbox suffix'] || ''
  if (textbox_suffix_text != '') {
   var style_textbox_suffix = init['style textbox suffix']  || ''
   var textbox_suffix = document.createElement('div')
   setStyle (textbox_suffix, style_textbox_suffix)
   textbox_suffix.innerHTML = textbox_suffix_text
   textbox.appendChild (textbox_suffix)
  }
 }
 
 function textbox_change (evt) {
  var curvalue = parseFloat(textbox_number.value)
  if (isNaN(curvalue)) curvalue = 0
  if (curvalue < 0)    curvalue = 0
  if (curvalue > point_upper_limit) curvalue = point_upper_limit
  main.set_position_by_point_value (curvalue)
 }
 function textbox_keypress (evt) {
  var keyCode = evt.keyCode
  if (keyCode == 13) textbox_number.blur ()
 }
 function textbox_update_value () {
  textbox_number.value = Math.round((point_upper_limit*main.slider_position)/(main.sliderbar_background.clientWidth - getClientWidthFull(sliderbar_control)))
 }
 function textbox_blur (evt) {
  if (textbox_enabled == false) return
  if (evt.currentTarget == textbox_number) return
  textbox_number.blur ()
 }
 
 main.sliderbar_background = document.createElement('div'); parent.appendChild(main.sliderbar_background)
 if (typeof class_background != "undefined") main.sliderbar_background.className = class_background
 setStyle (main.sliderbar_background, style_background)
 
 var sliderbar_control = main.sliderbar_control = document.createElement('div'); main.sliderbar_background.appendChild(sliderbar_control)
 if (typeof class_control != "undefined") sliderbar_control.className = class_control
 setStyle (sliderbar_control, style_control)
 sliderbar_control.style.left = main.slider_position + 'px'
 
 var zoom_level = getInheritedTransform(main.sliderbar_background, {transform_type:"scale", xy:"x"})
 var preliminary_position_max     = main.sliderbar_background.clientWidth - getClientWidthFull(sliderbar_control)
 main.slider_position_max         = Math.round(preliminary_position_max * (point_maximum / point_upper_limit))
 main.slider_position             = (starting_point_value * preliminary_position_max) / point_upper_limit
 
 main.sliderbar_foreground = document.createElement('div'); main.sliderbar_background.appendChild(main.sliderbar_foreground)
 if (typeof class_foreground != "undefined") main.sliderbar_foreground.className = class_foreground
 setStyle (main.sliderbar_foreground, style_foreground)
 main.sliderbar_foreground.style.width = main.slider_position + 'px'
 if (typeof style_background_beyond_max != 'undefined') {
  main.sliderbar_background_beyond_max = document.createElement('div'); main.sliderbar_background.appendChild(main.sliderbar_background_beyond_max)
  setStyle(main.sliderbar_background_beyond_max, style_background_beyond_max)
  main.sliderbar_background_beyond_max.style.width = (preliminary_position_max - main.slider_position_max) + 'px'
  main.sliderbar_background_beyond_max.style.left  = (main.slider_position_max + 1) + 'px'
 }
 
 if (typeof style_pivot_slice != 'undefined') {
  main.sliderbar_pivot_slice = document.createElement('div'); main.sliderbar_background.appendChild(main.sliderbar_pivot_slice)
  setStyle (main.sliderbar_pivot_slice, style_pivot_slice)
  
  main.slider_pivot_start  = Math.round(preliminary_position_max * (pivot_point / point_upper_limit))
  main.slider_pivot_end    = parseFloat(main.slider_position)
  if (main.slider_pivot_end > main.slider_pivot_start) {
   main.sliderbar_pivot_slice.style.width = (main.slider_pivot_end - main.slider_pivot_start) + 'px'
   main.sliderbar_pivot_slice.style.left  = main.slider_pivot_start + 'px'
  } else {
   main.sliderbar_pivot_slice.style.width = (main.slider_pivot_start - main.slider_pivot_end) + 'px'
   main.sliderbar_pivot_slice.style.left  = main.slider_pivot_end + 'px'
  }
 }
 
 if (textbox_enabled == true) textbox_update_value ()
 
 var startscroll          = false
 var startx               = 0
 var offsetx              = 0
 addEvent (document.body             , 'mousemove', sliderbar_mousemove)
 addEvent (document.body             , 'mouseup'  , sliderbar_mouseup_or_blur)
 addEvent (document.body             , 'mousedown', textbox_blur)
 addEvent (window                    , 'blur'     , sliderbar_mouseup_or_blur)
 addEvent (window                    , 'mouseout' , sliderbar_mouseout)
 addEvent (sliderbar_control         , 'mousedown', sliderbar_control_mousedown)
 addEvent (main.sliderbar_background , 'mousedown', sliderbar_mousedown)
 
 main.update_position = function () {
  startx = findabspos_zoom_x(main.sliderbar_background)/zoom_level
 }
 
 main.destroy = function () {
  removeEvent (document.body            , 'mousemove', sliderbar_mousemove)
  removeEvent (document.body            , 'mouseup'  , sliderbar_mouseup_or_blur)
  removeEvent (window                   , 'blur'     , sliderbar_mouseup_or_blur)
  removeEvent (document.body            , 'mousedown', textbox_blur)
  removeEvent (window                   , 'mouseout' , sliderbar_mouseout)
  removeEvent (sliderbar_control        , 'mousedown', sliderbar_control_mousedown)
  removeEvent (main.sliderbar_background, 'mousedown', sliderbar_mousedown)
  if (textbox_enabled == true) {
   removeEvent (textbox_number, 'click'   , textbox_toggle)
   removeEvent (textbox_number, 'input'   , textbox_change)
   removeEvent (textbox_number, 'keypress', textbox_keypress)
  }
  var current_parent = main.sliderbar_background.parentNode; current_parent.removeChild (main.sliderbar_background)
 }
 
 main.set_position = function (new_position) {
  main.slider_position         = new_position
  var preliminary_position_max = main.sliderbar_background.clientWidth - getClientWidthFull(sliderbar_control)
  main.slider_position_max     = Math.round(preliminary_position_max * (point_maximum / point_upper_limit))
  
  if (main.slider_position > main.slider_position_max) {
   main.slider_position = main.slider_position_max
  } else {
   if (main.slider_position < 0) main.slider_position = 0
  }
  
  sliderbar_control.style.left = main.slider_position + 'px'
  main.sliderbar_foreground.style.width = main.slider_position + 'px'
  
 if (typeof style_pivot_slice != 'undefined') {
   main.slider_pivot_start  = Math.round(preliminary_position_max * (pivot_point / point_upper_limit))
   main.slider_pivot_end    = main.slider_position
   if (main.slider_pivot_end > main.slider_pivot_start) {
    main.sliderbar_pivot_slice.style.width = (main.slider_pivot_end - main.slider_pivot_start) + 'px'
    main.sliderbar_pivot_slice.style.left  = main.slider_pivot_start + 'px'
   } else {
    main.sliderbar_pivot_slice.style.width = (main.slider_pivot_start - main.slider_pivot_end) + 'px'
    main.sliderbar_pivot_slice.style.left  = main.slider_pivot_end + 'px'
   }
  }
  if (textbox_enabled == true) textbox_update_value ()
  if (use_update_function_param == true) {update_function (main.update_function_param)} else {update_function ()}
 }
 
 function sliderbar_mousemove (evt) {
  if (startscroll == false) return
  var x = evt.pageX/zoom_level
  main.set_position (x - offsetx - startx)
 }
 
 main.set_position_by_point_value = function (new_position) {
  main.set_position ((new_position * main.sliderbar_background.clientWidth) / point_upper_limit)
 }
 
    
 function sliderbar_mousedown (evt) {
  if (getRightClick(evt)) return
  if (do_not_start_function()) return
  if (startscroll == true) return
  main.update_position ()
  offsetx = main.sliderbar_control.clientWidth / 2
  startscroll = true
  sliderbar_mousemove (evt)
 }
 
 function sliderbar_control_mousedown (evt) {
  if (getRightClick(evt)) return
  if (do_not_start_function()) return
  if (startscroll == true) return
  main.update_position ()
  offsetx = (evt.pageX - findabspos_zoom_x (evt.target))/zoom_level
  startscroll = true
 }
 
 function sliderbar_mouseout (evt) {
  var mouseX = evt.pageX; var mouseY = evt.pageY
  var windowScrollX = window.scrollX; if (typeof windowScrollX == "undefined") windowScrollX = document.body.scrollLeft
  var windowScrollY = window.scrollY; if (typeof windowScrollY == "undefined") windowScrollY = document.body.scrollTop
  if (((mouseY >= 0)) && ((mouseY <= window.innerHeight + windowScrollY)) && ((mouseX >= 0) && mouseX <= (window.innerWidth + windowScrollX))) return
  sliderbar_mouseup_or_blur (evt)
 }
 
 function sliderbar_mouseup_or_blur (evt) {
  if (startscroll == false) return
  startscroll = false
  final_update_function ()
  return
 }
}


function red_blue_arrow (init) {
 var main        = this
 var parent      = init['parent']
 var style       = init['style']
 main.thickness  = parseFloat(init['thickness'])
 main.bar_length = parseFloat(init['bar length'])
 main.tip_length = parseFloat(init['tip length'])
 main.mainobj        = document.createElement('div') ; parent.appendChild(main.mainobj)
 main.mainobj.left   = document.createElement('img') ; main.mainobj.appendChild(main.mainobj.left)
 main.mainobj.middle = document.createElement('img') ; main.mainobj.appendChild(main.mainobj.middle)
 main.mainobj.right  = document.createElement('img') ; main.mainobj.appendChild(main.mainobj.right)
 if (typeof main.thickness  == 'undefined') main.thickness  = "63px"
 if (typeof main.bar_length == 'undefined') main.bar_length = "428px"
 if (typeof main.tip_length == 'undefined') main.tip_length = "32px"
 main.mainobj.left.src   = "images/gui/interface-blue-red arrow left.png"   ; setStyle(main.mainobj.left  , "position:absolute; height:" + main.thickness + "px; width:" + main.tip_length + 'px; top:0; left:0')
 main.mainobj.middle.src = "images/gui/interface-blue-red arrow middle.png" ; setStyle(main.mainobj.middle, "position:absolute; height:" + main.thickness + "px; width:" + main.bar_length + 'px; top:0; left:' + main.tip_length + 'px')
 main.mainobj.right.src  = "images/gui/interface-blue-red arrow right.png"  ; setStyle(main.mainobj.right , "position:absolute; height:" + main.thickness + "px; width:" + main.tip_length + 'px; top:0; left:' + (main.tip_length + main.bar_length) + 'px')
 setStyle(main.mainobj, style)
 main.mainobj.style.display = "inline-block"
 main.mainobj.style.width  = (main.tip_length * 2 + main.bar_length) + 'px'
 main.mainobj.style.height = main.thickness + 'px'
}


function loadingbarObject (init) {
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
 setStyle(loadingbar.loadingbartext1, 'position:absolute; left:0; top:0; margin:.125em; width:100%; text-align:center; color:#C0C0C0; font-size:1.5em; font-family:arial; display:block')
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
  if (rounded_percent >= 100) {removeAllDescendantsAndSelf (loadingbar); return}
  var percentstring = rounded_percent.toString()
  loadingbar.loadinginnerbar.style.width = percentstring + "%"
  loadingbar.loadingbartext1.innerHTML = loadingbar.loading_string + ((loadingbar.show_percent == true) ? (percentstring + "% done.") : "")
 }
 
 loadingbar.update ()
 return loadingbar
}
// </DOM-widget functions.>


// <DOM manipulation functions. TAG: DOM, TAG: dom, TAG: style.>
function convert_to_px_units (parent, measure) {
 var mydiv = document.createElement('div')
 mydiv.style.visibility = 'hidden'; mydiv.style.width = '1' + measure
 parent.appendChild(mydiv); w = mydiv.offsetWidth; parent.removeChild(mydiv)
 mydiv = null
 return w
}

function css_set_scale (sw, sh, obj) {obj.setAttribute('transform', 'scale(' + sw + ' ' + sh +')')}

function setScrollTop (amount, obj) {
 if ((typeof obj == 'undefined') || (obj == null)) {
  if (typeof window.opera == 'undefined') { // Opera detection
   document.body.scrollTop -= amount
   document.documentElement.scrollTop -= amount   
  }
 }
}

function clearfocus () {
 var hocuspocus = document.createElement('input');
 document.body.appendChild(hocuspocus); hocuspocus.focus()
 document.body.removeChild(hocuspocus); hocuspocus = null
}

function setStyle (element, text) {
 // Multiple-element support.
 if (typeof element == "object") {
  if (element instanceof Array) {
   var curlen = element.length
   for (var i = 0; i < curlen; i++) {setStyle (element[i], text)}
   return
  }
 }
 element.setAttribute("style", checkForMissingProperties (element, text))
}

function addStyle (element, text) {
 // Multiple-element support.
 if (typeof element == "object") {
  if (element instanceof Array) {
   var curlen = element.length
   for (var i = 0; i < curlen; i++) {addStyle (element[i], text)}
   return
  }
 }
 if (element.getAttribute("style") == null) {
  element.setAttribute("style", checkForMissingProperties(element, text))
 } else {
  element.setAttribute("style", checkForMissingProperties(element, element.getAttribute("style")) + "; " + text)
 }
}
function checkForMissingProperties (element, text) {
 if (!(getComputedStyle(document.documentElement,null)["BoxSizing"]) && !!(getComputedStyle(document.documentElement,null)["MozBoxSizing"])) text = text.replace(/box-sizing/g, '-moz-box-sizing')
 return text
}

var getVendorSpecificPropertyName = function(){
 var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms']
 function getVendorSpecificPropertyName (propName, element) {
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
 return getVendorSpecificPropertyName
} ()

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


function getStylesheetPropertyValue (className, propertyName) {
 var temp = document.createElement("div")
 temp.className = className
 document.body.appendChild (temp)
 var propertyValue = null
 if (window.getComputedStyle) {
  propertyValue = window.getComputedStyle(temp, null).getPropertyValue(propertyName)
 } else {
  if (temp.currentStyle) propertyValue = temp.currentStyle[propertyName]
 }
 document.body.removeChild (temp)
 return propertyValue
}


function addStyleSheetRule (obj, new_rule) {
 if (typeof obj.styleSheetRuleAmount == "undefined") obj.styleSheetRuleAmount = 0
 if (typeof obj.styleSheetRuleArray  == "undefined") obj.styleSheetRuleArray  = []
 document.styleSheets[0].insertRule (new_rule, 0)
 obj.styleSheetRuleArray.push (new_rule)
 obj.styleSheetRuleAmount += 1
}

function removeAllStyleSheetRules (obj) {
 if (typeof obj.styleSheetRuleAmount == "undefined") return
 var curlen = obj.styleSheetRuleAmount
 var styleSheetRuleArray = obj.styleSheetRuleArray
 for (var i = 0; i < curlen; i++) {
  document.styleSheets[0].deleteRule (styleSheetRuleArray[i])
 }
 obj.styleSheetRuleArray  = []
 obj.styleSheetRuleAmount = 0
}

function removeAllDescendantsAndSelf (cell) {
 if (cell.hasChildNodes()) {
  while (cell.childNodes.length >= 1) {
   removeAllDescendants (cell.firstChild)
   cell.removeChild(cell.firstChild)
  }
 }
 if (cell.parentNode) {(cell.parentNode).removeChild(cell)}
 cell = null
}

function removeAllDescendants (cell) {
 if (cell.hasChildNodes()) {
  var curlen = cell.childNodes.length
  while (cell.childNodes.length >= 1) {
   removeAllDescendants (cell.firstChild)
   cell.removeChild(cell.firstChild)
  }
 }
}

// Calculate the client width plus the left and right border widths and return the result.
function getClientWidthFull (obj, init) {
 var box_sizing = window.getComputedStyle(obj).getPropertyValue('box-sizing')
 if (box_sizing == "") {
  var box_sizing = window.getComputedStyle(obj).getPropertyValue('-moz-box-sizing')
 }
 if (box_sizing != "border-box") {
  var padding_and_margin = 0
 } else {
  var padding_and_margin = 
   parseFloat(window.getComputedStyle(obj).getPropertyValue('padding-left')) +
   parseFloat(window.getComputedStyle(obj).getPropertyValue('padding-right'))
  if ((typeof init != "undefined") && (typeof init.margin != "undefined") && (init.margin == true)) {
   padding_and_margin += 
    parseFloat(window.getComputedStyle(obj).getPropertyValue('margin-left')) +
    parseFloat(window.getComputedStyle(obj).getPropertyValue('margin-right'))
  }
 }
 return obj.clientWidth + padding_and_margin + 
 parseFloat(window.getComputedStyle(obj).getPropertyValue('border-left-width')) +
 parseFloat(window.getComputedStyle(obj).getPropertyValue('border-right-width'))
}
 
// Calculate the client height plus the top and bottom border widths and return the result.
function getClientHeightFull (obj, init) {
 var box_sizing = window.getComputedStyle(obj).getPropertyValue('box-sizing')
 if (box_sizing == "") {
  var box_sizing = window.getComputedStyle(obj).getPropertyValue('-moz-box-sizing')
 }
 if (box_sizing != "border-box") {
  var padding_and_margin = 0
 } else {
  var padding_and_margin = 
   parseFloat(window.getComputedStyle(obj).getPropertyValue('padding-top')) +
   parseFloat(window.getComputedStyle(obj).getPropertyValue('padding-bottom'))
  if ((typeof init != "undefined") && (typeof init.margin != "undefined") && (init.margin == true)) {
   padding_and_margin += 
    parseFloat(window.getComputedStyle(obj).getPropertyValue('margin-top')) +
    parseFloat(window.getComputedStyle(obj).getPropertyValue('margin-bottom'))
  }
 }
 return obj.clientHeight + padding_and_margin +
 parseFloat(window.getComputedStyle(obj).getPropertyValue('border-top-width')) +
 parseFloat(window.getComputedStyle(obj).getPropertyValue('border-bottom-width'))
}

// Merge two objects together.
function merge_objects (primary, secondary) {
 // The primary object's duplicate keys are superior. The secondary object's duplicate keys are inferior.
 if (typeof secondary == "undefined") var primary = primary.primary, secondary = primary.secondary
 var new_object = {}
 for (var property in secondary) {new_object[property] = secondary[property]}
 for (var property in primary)   {new_object[property] = primary  [property]}
 return new_object
}

// Get the [left, top] scroll position of the window / document / body.
function get_document_scroll_position () {
 return Array((document.documentElement && document.documentElement.scrollLeft) || window.pageXOffset || self.pageXOffset || document.body.scrollLeft, (document.documentElement && document.documentElement.scrollTop) || window.pageYOffset || self.pageYOffset || document.body.scrollTop)
}


// Set this object to selectable or otherwise.
function prevent_context_menu (obj, do_prevent, omitformtags) {
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
function move_to_top (evt) {
 var obj = evt.currentTarget, parent = obj.parentNode
 if (parent.childNodes[parent.childNodes.length - 1] == obj) return
 parent.appendChild (obj)
}

// Set this page to selectable or otherwise.
function disable_selection (obj, sub_rules) {
 obj.setAttribute ('unselectable', 'on')
 obj.style.WebkitTapHighlightColor = 'rgba(255, 255, 255, 0)'
 obj.style.WebkitHighlightColor    = 'transparent'
 obj.style.MozUserSelect           = 'none'
 obj.style.OUserSelect             = 'none'
 obj.style.KhtmlUserSelect         = 'none'
 obj.style.WebkitUserSelect        = 'none'
 obj.style.MsUserSelect            = 'none'
 obj.style.userSelect              = 'none'
}

function enable_selection (obj) {
 obj.setAttribute ('unselectable', 'off')
 obj.style.WebkitTapHighlightColor = ''
 obj.style.WebkitHighlightColor    = ''
 obj.style.MozUserSelect           = 'text'
 obj.style.OUserSelect             = 'text'
 obj.style.KhtmlUserSelect         = 'text'
 obj.style.WebkitUserSelect        = 'text'
 obj.style.MsUserSelect            = 'text'
 obj.style.userSelect              = 'text'
}

function add_background_filter_image (init) {
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


function hide_siblings (obj) {
 var parent = obj.parentNode
 for (var i = 0, curlen = parent.childNodes.length; i < curlen; i++) {
  var current_child = parent.childNodes[i]
  if (current_child == obj) {obj.style.display = null; continue}
  current_child.style.display = "none"
 }
}

function make_label_and_input (init) {
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
  if (typeof init.input_wrapper_style != "undefined") addStyle (input_wrapper, init.input_wrapper_style)
  input_wrapper.appendChild (input)
 }
 if (init.input_first == true) {
  if (nest_input == true) {main.appendChild (input_wrapper)} else {main.appendChild (input)}
  main.appendChild (label)
 } else {
  main.appendChild (label)
  if (nest_input == true) {main.appendChild (input_wrapper)} else {main.appendChild (input)}
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
 if (typeof init.label_style != "undefined") addStyle (label, init.label_style)
 if (typeof init.input_style != "undefined") addStyle (input, init.input_style)
 if (typeof init.style       != "undefined") addStyle (main , init.style)
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

function make_text (init) {
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
 if (typeof init.style    != "undefined") addStyle (text_element, init.style)
 parent.appendChild (text_element)
 return text_element
}

// Replace a function property with an error if the program tries to run it.
function prevent_native (obj, native_function) {
 obj[native_function] = function () {throw new Error('Error: "' + native_function+ '()" is not allowed for this object!')}
}

// Append a <br>.
function append_br (parent) {return parent.appendChild (document.createElement('br'))}

// Set the obj's display to "none" if all children have display set to "none". Otherwiset, set to "regular_display".
function set_display_based_on_children (obj, regular_display) {
 var children    = obj.childNodes, curlen = children.length, all_hidden = true, new_display = "none"
 for (var i = 0; i < curlen; i++) {
  if (children[i].style.display != "none") {new_display = regular_display; all_hidden = false; break}
 }
 obj.style.display = new_display
}

// Set an object's class name for the selected value(s) found in the key/value list.
function set_object_class_by_value (init) {
 var key_value_list = init.key_value_list, class_name_string = ""
 if (!(init.value instanceof Array)) {var value = [init.value]} else {var value = init.value}
 var curlen = init.value
 for (var i = 0; i < curlen; i++) {class_name_string += (init.key_value_list)[value[i]]}
 (init.obj).className = class_name_string
}

function convert_form_elements_to_string (form_obj) {
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

function make_label_and_textbox (init) {
 var textarea = document.createElement ('textarea')
 textarea.rows = init.rows
 var merged_init = merge_objects ({primary: init, secondary:{input_type:textarea}})
 return make_label_and_input (merged_init)
}

function parent_getElementsByName (parent, test_name) {
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
function focus_default_text (focus_obj, default_text) {if (focus_obj.value == default_text) focus_obj.value = ""}
function blur_default_text (focus_obj, default_text) {if (focus_obj.value == '') focus_obj.value = default_text}
function create_dom_option_list (option_text_array) {
 var curlen = option_text_array.length
 var dom_option_list = new Array (curlen)
 for (var i = 0; i < curlen; i++) {
  var current_option_data = option_text_array[i]
  var current_option = document.createElement ('option')
  dom_option_list[i] = current_option
  switch (typeof current_option_data) {
   case "string" : 
    current_option.value     = current_option_data
    current_option.innerHTML = current_option_data.capitalizeFirstLetter()
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
function get_data_string_from_input_list (input_object_list) {
 var data_array = new Array ()
 for (var input_object_name in input_object_list) {
  var current_string_fragment = "&" + input_object_name + "=" + encodeURIComponent(input_object_list[input_object_name].input.value)
  data_array.push (current_string_fragment)
 }
 return data_array.join("")
}
function create_empty_dom_row (init) {
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
function set_to_biggest_width (dom_object_array) {
 var biggest_width = 0
 var curlen = dom_object_array.length
 for (var i = 0; i < curlen; i++) {
  var current_width = getClientWidthFull (dom_object_array[i])
  if (biggest_width < current_width) biggest_width = current_width
 }
 for (var i = 0; i < curlen; i++) {
  dom_object_array[i].style.width = (biggest_width + 1) + "px"
 }
}

function dom_object_intersects_line (obj, x, y) {
 var xy = findabspos (obj)
 if (x < xy[0]) return false
 if (y < xy[1]) return false
 if (xy[0] + obj.clientWidth  > x) return false
 if (xy[1] + obj.clientHeight > y) return false
 return true
}

function timed_remove (element, ms) {
 setTimeout (function () {
  parent = element.parentNode
  if (parent == null) return
  parent.removeChild (element)
 }, ms)
}

function getCaretPosition (obj) { 
 if (obj.selectionStart) return obj.selectionStart
 if (document.selection) { 
  obj.focus()
 var r = document.selection.createRange() 
  if (r == null) return 0
  var re = obj.createTextRange()
  rc = re.duplicate()
  re.moveToBookmark(r.getBookmark())
  rc.setEndPoint('EndToStart', re)
  return rc.text.length
 }
 return 0
}

function setCaretPosition (obj, pos) {
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

function dom_to_static_element_list (html_collection) {return Array.prototype.slice.call (html_collection)}

// Add headers to a table.
function table_add_headers (init) {
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
  refresh_function ()
 }
 
 var parent           = init.parent
 var header_list      = init.header_list
 var sort_order       = init.sort_order
 var refresh_function = init.refresh_function
 
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
  temp_th.innerHTML = header_text.capitalizeFirstLetter()
  if (typeof sort_order != "undefined") addEvent (temp_th, 'click', resort)
  temp_tr.appendChild (temp_th)
 }
}

function sort_by_order (obj, order_list) {
 obj.sort (function (a, b) {
  var curlen = order_list.length
  for (var i = 0; i < curlen; i++) {
   var attribute_name = order_list[i][0]
   var sort_down      = order_list[i][1]
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
// </DOM manipulation functions.>


// <Domain and directory functions. TAG: uri component, TAG: domain, TAG: directory, TAG: path.>

// Reads a page's GET URL variables and returns them as an associative array.
function getUrlVars (variable_object) {
 if ((typeof variable_object != "object") || (variable_object == null)) var variable_object = {}
 var current_variable
 var variable_list = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
 var curlen = variable_list.length
 for (var i = 0; i < curlen; i++) {
  current_variable = variable_list[i].split('=')
  if (typeof current_variable[1] == "undefined") continue
  variable_object[current_variable[0]] = decodeURIComponent(current_variable[1])
 }
 return variable_object
}

// Form a GET URL string from an array.
function formUrlVars (variable_list) {
 var return_value = ""
 for (var i in variable_list) {return_value += "&" + i + "=" + variable_list[i]}
 if (return_value != "") return_value = "?" + return_value.slice(1, return_value.length)
 return return_value
}
function directory_normalize (dirpath) {
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
function strip_domain (url) {
 var startAt = url.indexOf('://');
 if (startAt == -1) return url
 startAt = startAt == -1 ? 0 : startAt+3;
 var first_index = url.indexOf("/", startAt) + 1
 if (first_index == 0) return url
 return url.substring(first_index)
}
function get_domain_and_directory (url) {
 var last_index = url.lastIndexOf("/") + 1
 return url.substring(0, last_index)
}
function strip_directory (url) {
 var last_index = url.lastIndexOf("/") + 1
 if (last_index == 0) return url
 return url.substring(last_index)
}
function strip_extension (url) {
 return url.substring(0, url.lastIndexOf("."))
}
function remove_base_url (url) {
 var base_url_pattern = /^https?:\/\/[a-z\:0-9.]+/
 var result = ""
 var match = base_url_pattern.exec (url)
 if (match != null) result = match[0]
 if (result.length > 0) url = url.replace(result, "").substr(1)
 return url
}
function modify_href_if_relative (prefix_src, current_src) {
 if (current_src.substr(0, 7) != "http://") {return prefix_src + current_src} else {return current_src}
}
// <Domain and directory functions.>


// <Audio functions. TAG: audio, TAG: play.>
function playAudio (filename, init) {
 if (typeof init == "undefined") return new playAudio (filename, {})
 var main = this
 main.play_track  = function () {main.audio.play ()}
 main.stop        = function () {main.stopped = true; main.audio.pause (); main.audio.currentTime = 0; removeEvent (main.audio, 'ended', main.play_track)}
 main.pause       = function () {main.stopped = true; main.audio.pause (); removeEvent (main.audio, 'ended', main.play_track)}
 main.play        = function () {main.resume ()}
 main.resume      = function () {
  if (main.stopped == true) {
   main.stopped = false
   main.play_track ()
  } else {
   main.audio.play ()
  }
  if (main.loop == true) {
   main.audio.loop = true
   addEvent (main.audio, 'ended', main.play_track)
  }
 }
 main.set_loop    = function (loop_value) {
  if (loop_value == true) {
   main.loop    = true
   main.audio.loop = true
   addEvent (main.audio, 'ended', main.play_track)
  } else {
   main.loop    = false
   main.audio.loop = false
   removeEvent (main.audio, 'ended', main.play_track)
  }
 }
 main.restart     = function () {main.play_track ()}
 main.set_volume  = function (fraction) {main.volume = fraction; main.audio.volume = fraction}
 main.loop     = init.loop   ; if (typeof main.loop   == "undefined") main.loop   = false
 main.volume   = init.volume ; if (typeof main.volume == "undefined") main.volume = 1
 main.start    = init.start  ; if (typeof main.start  == "undefined") main.start  = true
 var http = new XMLHttpRequest()
 http.open ('HEAD', filename, false)
 http.send ()
 if (http.status == 404) {main.loaded = false; return}
 main.loaded = true
 main.filename = filename
 main.stopped = false
 main.source = document.createElement("source")
 main.audio = new Audio()
 if (main.filename.slice(main.filename.length - 4) == ".ogg") {
  if (main.audio.canPlayType("audio/ogg")) {
   main.source.type = "audio/ogg"; main.source.src  = main.filename
  } else {
   main.source.type = "audio/mp3"; main.source.src  = main.filename.slice(0, -4) + ".mp3"
  }
 } else if (main.filename.slice(main.filename.length - 4) == ".mp3") {
  if (main.audio.canPlayType("audio/mp3")) {
   main.source.type = "audio/mp3"; main.source.src  = main.filename
  } else {
   main.source.type = "audio/ogg"; main.source.src  = main.filename.slice(0, -4) + ".ogg"
  }
 }
 main.audio.appendChild (main.source)
 main.audio.volume = main.volume
 if (main.start == true) {
  main.audio.play ()
  if (main.loop == true) addEvent (main.audio, 'ended', main.play_track)
 } else {
  if (main.loop == true) {main.audio.loop = true}
 }
 return main
}
// </ Audio functions.>


// <Graphics/image/canvas functions. TAG: graphics, TAG: <canvas>, TAG: canvas. TAG: image.>
window.requestAnimFrame = function () {
 return  window.requestAnimationFrame       || 
         window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame    || 
         window.oRequestAnimationFrame      || 
         window.msRequestAnimationFrame     || 
         function (callback) {
          window.setTimeout (callback, 1000 / 60)
         }
} ()

// Function to help preload an image or list of images.
function image_preload (cursrc, init) {
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
 
 var image_list = init.image_list
 var curlen = image_list.length
 var load_counter = curlen
 for (var i = 0; i < curlen; i++) {
  var image_temp = new Image ()
  image_temp.onload = function () {load_counter -= 1}
  image_temp.src = image_list[i]
 }
 var test_load_complete_interval = setTimeout (test_load_complete, 30)
 function test_load_complete () {
  if (load_counter != 0) {test_load_complete_interval = setTimeout (test_load_complete, 30); return}
  clearInterval (test_load_complete_interval)
  if (typeof init.callback != "undefined") init.callback ()
 }
}

// Colorize (eg: grayscale if the values are 1/1/1)
function canvas_colorize (ctx, rpercent, gpercent, bpercent, octx) {
 var pixelavg = 0, x = 0, y = 0, i = 0, curwidth = ctx.width, curheight = ctx.height
 var pixels = ctx.getImageData(0, 0, curwidth, curheight)
 for (x = 0; x < curwidth; x++) {
  for (y = 0; y < curheight; y++) {
   pixelavg = (pixels.data[i]+pixels.data[i+1]+pixels.data[i+2])/3
   pixels.data[i] = pixelavg*rpercent; i++
   pixels.data[i] = pixelavg*gpercent; i++
   pixels.data[i] = pixelavg*bpercent; i++
   i++
  }
 }
 octx.putImageData(pixels, 0, 0, 0, 0, curwidth, curheight)
}

function create_composite_set (init) {
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

function create_composite (init) {
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

function merge_and_colorize (init) {
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
   rgb_list.push ({r:rgb.r / 255, g:rgb.g / 255, b:rgb.b / 255})
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
function hex_to_rgb (hex) {
 // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
 var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
 hex = hex.replace(shorthandRegex, function(m, r, g, b) {
  return r + r + g + g + b + b
 })
 var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
 return result ? {
  r: parseInt(result[1], 16),
  g: parseInt(result[2], 16),
  b: parseInt(result[3], 16)
 } : null
}

function rgb_to_hex (r, g, b) {
 return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

function create_single_color_image_elements (init) {
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

// Does a color fill on an image (with an image_src provided), an image element, or canvas element.
// If init.create_new is true and a canvas image is sent as the source image, then a new image is created.
function color_fill (init) {
 var return_result = ((typeof init.return_result != "undefined") && (init.return_result == true)) ? true : false
 // Load in the image.
 if (typeof init.image == "undefined") {
  var image_obj = new Image ()
  image_obj.onload = do_color_fill
  image_obj.src = init.image_src
 } else {
  var image_obj = init.image
  if (init.image instanceof HTMLImageElement) {
   image_obj.onload = do_color_fill
   if (typeof init.image_src != "undefined") image_obj.src = init.image_src
  }
  if (init.image instanceof HTMLCanvasElement) {
   if (return_result == true) {return do_color_fill ()} else {do_color_fill ()}
  }
 }
 
 // Put the image into a canvas, colorize it with init.color, and run the callback with the result.
 function do_color_fill () {
  var rect_source = document.createElement ('canvas'); var rect_source_ctx = rect_source.getContext('2d')
  rect_source.width  = image_obj.width
  rect_source.height = image_obj.height
  rect_source_ctx.fillStyle = init.color
  rect_source_ctx.fillRect (0, 0, rect_source.width, rect_source.height)
  if ((typeof init.image == "undefined") || (init.image instanceof HTMLImageElement) || ((typeof init.create_new != "undefined") && (init.create_new == true))) {
   var target = document.createElement ('canvas'); var target_ctx = target.getContext('2d')
   target.width  = image_obj.width
   target.height = image_obj.height
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

// Canvas per pixel filter. Filters an object with an isolated per-pixel filter function. Example:
// canvas_filter (source, target, function (buffer, position) {
// // r = buffer[position], g = buffer[position + 1], b = buffer[position + 2], a = buffer[position + 3]
// // Example: converts black & white to transparency. rgba(b, b, b, 255) -> rgba(0, 0, 0, 255 - b)
// // Assumes initial values of r equalling g and b, and a equalling 255.
//  var r = buffer[position]
//  buffer[position] = buffer[position + 1] = buffer[position + 2] = 0
//  buffer[position + 3] = r
// })
function canvas_filter (source, target, filter_function) {
 var ctx = source.getContext ('2d')
 var canvas_width  = source.width, canvas_height = source.height
 var source_data = source.getContext('2d').getImageData (0, 0, canvas_width, canvas_height)
 var source_data_buffer = source_data.data
 for (var i = 0, curlen = source_data_buffer.length; i < curlen; i += 4) {
  filter_function (source_data_buffer, i)
 }
 target.getContext('2d').putImageData (source_data, 0, 0)
}

function canvas_clone (canvas) {
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
function canvas_trim_empty_space (source_canvas) {
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
 var new_width = x1-x0+1, new_height = y1-y0+1
 var target_canvas = document.createElement ('canvas')
 var target_ctx = target_canvas.getContext ('2d')
 target_canvas.width  = new_width
 target_canvas.height = new_height
 target_ctx.drawImage (source_canvas, x0, y0, new_width, new_height, 0, 0, new_width, new_height)
 return {canvas: target_canvas, x0: x0, x1: x1, y0: y0, y1: y1}
}

// Create a simple SVG path from a string and draw it onto a canvas. Derived from kineticJS under MIT license.
function canvas_draw_path (init) {
 var x           = init.x || 0
 var y           = init.y || 0
 var data_string = init.data
 var canvas      = init.canvas
 
 var data_array = get_data_array_from_string (data_string)
 draw_func (data_array, canvas)
 
 function draw_func (data_array, canvas) {
  var context = canvas.getContext('2d')
  
  if (typeof init.strokeWidth != "undefined") context.lineWidth   = init.strokeWidth
  if (typeof init.strokeColor != "undefined") context.strokeStyle = init.strokeColor
  if (typeof init.lineCap     != "undefined") context.lineCap     = init.lineCap
  
  context.beginPath()
  context.translate (init.x, init.y)
  for (var n = 0; n < data_array.length; n++) {
   var c = data_array[n].command
   var p = data_array[n].points
   switch (c) {
    case 'L' : context.lineTo(p[0], p[1]); break
    case 'M' : context.moveTo(p[0], p[1]); break
    case 'C' : context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]); break
    case 'z' : context.closePath(); break
   }
  }
  if ((typeof init.strokeWidth == "undefined") || (init.strokeWidth != 0)) context.stroke ()
  if (typeof init.fillPatternImage != "undefined") {
   var pattern = context.createPattern(init.fillPatternImage, 'no-repeat')
   if (typeof init.fillPatternOffset != "undefined") {
    context.save ()
    context.translate (-init.fillPatternOffset[0], 0)
    context.translate (0, -init.fillPatternOffset[1])
   }
   context.fillStyle = pattern
  } else {
   // fillColor is subordinate to fillPatternImage.
   if (typeof init.fillColor != "undefined") context.fillStyle = init.fillColor
  }
  context.fill ()
  if (typeof init.fillPatternOffset != "undefined") context.restore()
 }
 
 function get_data_array_from_string (data_string) {
  // Command string.
  var cs = data_string
  
  // Command chars.
  var cc = ['M', 'L', 'C']
  
  // Convert white spaces to commas.
  cs = cs.replace(new RegExp(' ', 'g'), ',')
  
  // Create pipes so that we can split the data.
  for (var n = 0; n < cc.length; n++) {
   cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n])
  }
  // Create the array.
  var arr = cs.split('|')
  var ca = []
  
  // Init the context point.
  var cpx = 0
  var cpy = 0
  for (n = 1; n < arr.length; n++) {
   var str = arr[n]
   var c = str.charAt(0)
   str = str.slice(1)
   
   // Remove ,- for consistency.
   str = str.replace(new RegExp(',-', 'g'), '-')
   
   // Add commas so that it's easy to split.
   str = str.replace(new RegExp('-', 'g'), ',-')
   str = str.replace(new RegExp('e,-', 'g'), 'e-')
   var p = str.split(',')
   if (p.length > 0 && p[0] === '') p.shift()
   
   // Convert strings to floats.
   for (var i = 0; i < p.length; i++) {p[i] = parseFloat(p[i])}
   
   while (p.length > 0) {
    if (isNaN(p[0])) break // Case for a trailing comma before next command.
    var cmd = null
    var points = []
    var startX = cpx, startY = cpy
    // Move var from within the switch to up here (jshint).
    var prevCmd, ctlPtx, ctlPty  // Ss, Tt
    var rx, ry, psi, fa, fs, x1, y1 // Aa
    switch (c) {
     // Note: Keep the lineTos above the moveTos in this switch.
     case 'L' :
      cpx = p.shift()
      cpy = p.shift()
      points.push(cpx, cpy)
      break
     case 'M' :
      cpx = p.shift()
      cpy = p.shift()
      cmd = 'M'
      points.push(cpx, cpy)
      c = 'L'
      // Subsequent points are treated as absolute lineTo.
      break
     case 'C' :
      points.push(p.shift(), p.shift(), p.shift(), p.shift())
      cpx = p.shift()
      cpy = p.shift()
      points.push(cpx, cpy)
      break
    }
    ca.push({
     command : cmd || c,
     points  : points,
     start   : {x: startX, y: startY}
    })
   }
   if ((c === 'z') || (c === 'Z')) ca.push({command: 'z', points: [], start: undefined})
  }
  return ca
 }
}

function on_background_image_url_load (current_div, callback) {
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
// </Graphics/image/canvas functions.>


// <Feature/property detection functions. TAG: detection functions, TAG: detect device type, TAG: detect scrollbar size.>
function detect_device_type (obj) {
 var ua = navigator.userAgent.toLowerCase()
 obj.is_idevice         = (ua.match(/ipad/i) || ua.match(/iphone/i) != null)
 obj.is_android         = (ua.match(/android/i) != null)
 obj.is_chromium        = (ua.match(/chrome/i) != null)
 obj.is_windows_phone   = (ua.match(/Windows Phone/i) != null)
 obj.is_phone_or_tablet = (obj.is_idevice || obj.is_android || obj.is_windows_phone)
}

function detect_scrollbar_thickness () {
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

function detect_event_is_supported (event_name) {
 var TAGNAMES = {
  'orientationchange' : 'window',
  'select'            : 'input',
  'change'            : 'input',
  'submit'            : 'form',
  'reset'             : 'form',
  'error'             : 'img',
  'load'              : 'img',
  'abort'             : 'img'
 }
 var element = document.createElement('div' || TAGNAMES[event_name])
 event_name = 'on' + event_name
 var is_supported = (typeof element[event_name] != "undefined")
 return is_supported
}
// </Feature/property detection functions.>


// <Cookie/localStorage functions. TAG: cookie, TAG: localstorage.>
function readcookie (name) {
 var name_eq = name + "=", ca = document.cookie.split(";")
 for (var i = 0; i < ca.length; i++) {
  var c = ca[i]
  while (c.charAt(0) == " ") {c = c.substring(1, c.length)}
  if (c.indexOf(name_eq) == 0) return decodeURIComponent(c.substring(name_eq.length, c.length))
 }
 return null
}
// </Cookie/localStorage functions.>
