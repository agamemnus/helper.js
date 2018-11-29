"use strict";

// Thanos.js version 0.1.

// Modifications or additions to native functionality:
// 1) In .misc_polyfills: polyfills or fixes to IE.

void function () {
 var h = {}
 if (typeof module == "undefined") var module = {}
 module.exports = h
 if (typeof window != "undefined") var global = window
 if (global) global.helperjs = h
 
 // Settings.
 h.library_settings = {
  misc_polyfills        : true,
  object_manipulation   : true,
  physical_control      : true,
  dom_position          : true,
  download              : true,
  gui_widgets           : true,
  dom_manipulation      : true,
  domain_and_directory  : true,
  graphics              : true,
  feature_detection     : true,
  cookie                : true,
  font_loading          : true,
  misc                  : true,
 }
 
 var add_style = function (element, text) {
  // Multiple element support.
  if ((typeof element == "object") && (element instanceof Array)) {element.forEach(function (current_element) {add_style (current_element, text)}); return}
  if (element.getAttribute("style") == null) {element.setAttribute("style", element, text); return}
  element.setAttribute("style", element, element.getAttribute("style") + "; " + text)
 }
 
 // <Miscellaneous browser fixes and polyfills. TAG: polyfills.>
 if (h.library_settings.misc_polyfills) {
  // Fix errors caused by console (or console.log) not being defined in certain browsers.
  if (typeof console == "undefined") console = {}
  if (typeof console.log == "undefined") console.log = function () {}
  
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
       this.removeChild(childNodes[0])
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
 
 // <Object manipulation functions. TAG: array, TAG: arrays, TAG: array manipulation, TAG: object manipulation, TAG: copy, TAG: test.>
 if (h.library_settings.object_manipulation) {
  h.Array = {}
  h.Array.shuffle = function (arr) {
   for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var x = arr[i]
    arr[i] = arr[j]
    arr[j] = x
   }
   return arr
  }
 }
 // <Object manipulation functions.>
 
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
    target_obj.addEventListener('touchend'    , end_effect)
    target_obj.addEventListener('touchcancel' , end_effect)
    target_obj.addEventListener('touchleave'  , end_effect)
    target_obj.addEventListener('touchstart'  , pinch)
    target_obj.addEventListener('touchmove'   , pinch)
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
    target_obj.addEventListener(init.is_mobile ? 'touchstart'  : 'mousedown', swipe_start_event)
    target_obj.addEventListener(init.is_mobile ? 'touchmove'   : 'mousemove', swipe_event)
    target_obj.addEventListener(init.is_mobile ? 'touchend'    : 'mouseup'  , function (evt) {if (swipe_in_effect == false) return; swipe_end_event (evt)})
    target_obj.addEventListener(init.is_mobile ? 'touchleave'  : 'mouseout' , function (evt) {if (swipe_in_effect == false) return; swipe_end_event (evt)})
    target_obj.addEventListener(init.is_mobile ? 'touchcancel' : 'blur'     , function (evt) {if (swipe_in_effect == false) return; swipe_end (evt)})
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
    ["success", "error", "callback"].forEach(function (func) {
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
    run_list.forEach(function (params, i) {func_list[i].apply (null, params)})
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
  
  function make_request (url, data, send_data_as_plaintext, charset, is_asynchronous, response_type, header_list, request_method) {
   if ((typeof send_data_as_plaintext == "undefined") || (send_data_as_plaintext !== true)) send_data_as_plaintext = false
   if ((typeof is_asynchronous == "undefined") || (is_asynchronous != false)) is_asynchronous = true
   if (typeof charset == "undefined" || charset == '') {charset = ''} else {charset = '; charset=' + charset}
   var http_request = new XMLHttpRequest()
   if (!http_request) {alert ("Cannot create an XMLHTTP instance for some reason. Please try reloading the page.")}
   if (typeof request_method == "undefined") var request_method = ((data === null || data === '') ? "GET" : "POST")
   if (request_method == "GET") {
    if (typeof data == "string") {
     // Add a "?" or "&" if the "?" doesn't already exist in the ending part of the url.
     var altchar = (data[0] != "&") ? "&" : ""
     var connecting_character = (url.indexOf("?") == -1) ? "?" : altchar
     url += connecting_character + data
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
    header_list.forEach(function (header) {http_request.setRequestHeader(header.name, header.content)})
   }
   http_request.send(data)
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
  h.sliderbar = function (init) {
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
   
   var zoom_level_fixed = undefined
   // Add a linked textbox object if it is set.
   if (main.textbox_enabled != true) {
    var textbox = main.textbox = undefined
   } else {
    var textbox = main.textbox = document.createElement('div')
    textbox.className = init.textbox_class || ''; add_style(textbox, init.textbox_style || '')
    parent.appendChild(textbox)
    if (typeof init.textbox_prefix != "undefined") {
     var textbox_prefix = document.createElement('div')
     textbox_prefix.className = init.textbox_prefix_class || ''; add_style(textbox_prefix, init.textbox_prefix_style || '')
     textbox_prefix.innerHTML = init.textbox_prefix || ''
     textbox.appendChild(textbox_prefix)
    }
    var textbox_number = document.createElement('input')
    add_style(textbox_number, init.textbox_number_style || ''); textbox_number.className = init.textbox_number_class || ''
    textbox_number.type = "text"
    textbox_number.readOnly = false
    textbox_number.addEventListener('input', textbox_change)
    textbox_number.addEventListener('keypress', textbox_keypress)
    textbox.appendChild(textbox_number)
    if (typeof init.textbox_suffix != "undefined") {
     var textbox_suffix = document.createElement('div')
     textbox_suffix.className = init.textbox_suffix_class  || ''; add_style(textbox_suffix, init.textbox_suffix_style || '')
     textbox_suffix.innerHTML = init.textbox_suffix || ''
     textbox.appendChild(textbox_suffix)
    }
   }
   
   // Set the main object (background) class and style. Don't override the original style with a blank if a new one isn't defined.
   main.className = init.background_class || ''; if (typeof background_style != "undefined") add_style(main, background_style)
   
   // Create the "background_beyond_max" object and set its class and style.
   if ((typeof background_beyond_max_style != 'undefined') || (typeof background_beyond_max_class != 'undefined')) {
    main.background_beyond_max = document.createElement('div'); main.background_beyond_max.className = init.background_beyond_max_class || ''; add_style(main.background_beyond_max, background_beyond_max_style || '')
    main.appendChild(main.background_beyond_max)
   }
   
   // Create the foreground object and set its class and style.
   main.foreground_container = document.createElement('div'); add_style(main.foreground_container, "position: relative; overflow: hidden; "+width_height+": 100%; line-height: 0")
   main.foreground_container.className = foreground_container_class || ''; add_style(main.foreground_container, foreground_container_style || '')
   main.appendChild(main.foreground_container)
   main.foreground_container.style.pointerEvents = "none"
   
   main.foreground = document.createElement('div'); main.foreground.className = foreground_class || ''; add_style(main.foreground, foreground_style || '')
   main.foreground_container.appendChild(main.foreground)
   main.foreground.style.pointerEvents = "none"
   
   main.foreground_inverse = document.createElement('div'); main.foreground_inverse.className = foreground_inverse_class || ''; add_style(main.foreground_inverse, foreground_inverse_style || '')
   main.foreground_container.appendChild(main.foreground_inverse)
   main.foreground_inverse.style.pointerEvents = "none"
   
   // Create the control object and set its class and style.
   var control_element_type = (typeof control_image_src != "undefined") ? "img" : "div"
   main.control = document.createElement(control_element_type)
   main.control.style.pointerEvents = "none"
   main.control.className = control_class || ''
   add_style(main.control, control_style || '')
   
   if (typeof control_image_src != "undefined") main.control.src = control_image_src
   main.appendChild(main.control)
   
   // Now make the pivot slice element.
   if (typeof pivot_slice_style != 'undefined') {
    main.pivot_slice = document.createElement('div'); main.pivot_slice.className = pivot_slice_class || ''; add_style(main.pivot_slice, pivot_slice_style || '')
    main.appendChild(main.pivot_slice)
   }
   
   // Calculate the physical control position max, calculate the logical control position max, and set the initial physical control position.
   main.update = function () {update(main)}
   main.update()
   
   var startscroll = false, startxy = 0, offsetxy = 0     
   if (use_mouse_events) {  
    main.addEventListener     ('mousedown', mousedown)
    main.addEventListener     ('mouseover', mousemove)
    main.addEventListener     ('mousemove', mousemove)
    document.addEventListener('mouseup'  , mouseup_or_blur)
    window.addEventListener   ('blur'     , mouseup_or_blur)
    window.addEventListener   ('mouseout' , mouseout)
   }
   if (use_touch_events) {
    main.addEventListener     ('touchstart' , touchstart)
    main.addEventListener     ('touchmove'  , mousemove)
    document.addEventListener('touchend'   , mouseup_or_blur)
    window.addEventListener   ('touchcancel', mouseup_or_blur)
    window.addEventListener   ('touchleave' , mouseup_or_blur)
   }
   if (main.textbox) {
    document.removeEventListener       ((!use_touch_events) ? 'mousedown' : 'touchstart', textbox_blur)
    textbox_number.removeEventListener ((!use_touch_events) ? 'click'     : 'touchend',  textbox_focus)
    textbox_number.removeEventListener ('input'   , textbox_change)
    textbox_number.removeEventListener ('keypress', textbox_keypress)
   }
   
   main.update_position = function (pxc, zoom_level) {
    if (typeof pxc        == "undefined") pxc        = px_to_css_unit_type()
    if (typeof zoom_level == "undefined") zoom_level = calculate_zoom_level()
    startxy = findabspos_zoom(main) / (pxc * zoom_level)
   }
   main.set_position = function (new_position, trigger_update_event, pxc, evt) {return set_position(new_position, trigger_update_event, pxc, evt)}
   main.set_position_percent = function (new_point_value, trigger_update_event, evt) {
    main.set_position(main.position_physical_max * new_point_value / main.point_upper_limit, trigger_update_event, px_to_css_unit_type(), evt)
   }
   main.get_position_percent = function () {return (main.position / main.position_physical_max * main.point_upper_limit)}
   main.destroy = function () {return destroy(main, use_mouse_events, use_touch_events)}
   
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
    if (isNaN(border_and_padding_adjustment)) border_and_padding_adjustment = 0
    var is_not_border_box = (box_sizing != "border-box") ? 1 : 0
    return (main.getBoundingClientRect()[width_height] - main.control.getBoundingClientRect()[width_height]) / (pxc * zoom_level) - border_and_padding_adjustment / pxc - main.control_unit_offset * 2
   }
   function calculate_zoom_level () {
    if ((!main.recalculate_size) && (typeof zoom_level_fixed != "undefined")) return zoom_level_fixed
    var zoom_level = h.get_inherited_transform(main, {transform_type: "scale", xy: orientation_xy})
    if (!main.recalculate_size) zoom_level_fixed = zoom_level
    return zoom_level
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
   function update_foreground_width_height () {
    main.foreground.style[width_height]         = (((main.position + main.control_unit_offset) >= 0) ? main.position : 0) + main.css_unit_type
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
   function update (main) {
    var pxc        = px_to_css_unit_type()
    var zoom_level = calculate_zoom_level()
    main.position_physical_max = calculate_physical_max(pxc, zoom_level)
    if (main.point_upper_limit != 0) {
     main.position_logical_max  = main.position_physical_max * (main.point_maximum / main.point_upper_limit)
    }
    if (typeof main.position != "undefined" && main.position_logical_max != 0) {
     var logical_position = main.position / main.position_logical_max
    }
    if (typeof main.position == "undefined") {
     if (main.point_upper_limit != 0) {
      main.position = main.position_physical_max * (point_initial / main.point_upper_limit)
     }
    } else {
     if (typeof main.position_logical_max != "undefined" && typeof logical_position != "undefined") {
      main.position = logical_position * main.position_logical_max
     }
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
   function set_position (new_position, trigger_update_event, pxc, evt) {
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
   function destroy (main, use_mouse_events, use_touch_events) {
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
  }
 }
 // </DOM-widget functions.>
  
 // <DOM manipulation functions. TAG: px, TAG: CSS, TAG: DOM, TAG: dom, TAG: style.>
 if (h.library_settings.dom_manipulation) {
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
       args0.forEach(function (eventName) {args[0] = eventName; addEventListenerNative.apply (this, args)}, this)
      }
     }
    }
   }
   if (nativeToEnhanceList == "all") {enhanceList.forEach(function (func) {func()}); return}
   if (!Array.isArray(nativeToEnhanceList)) nativeToEnhanceList = [nativeToEnhanceList];
   nativeToEnhanceList.forEach(function (nativeToEnhance) {
    if (nativeToEnhance in enhanceList) enhanceList[nativeToEnhance]()
   })
  }
  dom.removeEventListeners = function (element) {
   element.dom.eventListenerArgumentList.forEach(function (eventListenerArgs) {
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
   var s = window.getComputedStyle(input); var cousin = document.createElement(temporary_element_type)
   cousin.style.display = temp_display_type
   new Array("paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "fontFamily", "fontSize", "fontWeight", "letterSpacing", "fontKerning", "lineHeight", "textIndent").forEach(function (p) {cousin.style[p] = s[p]})
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
   cousin.parentNode.removeChild(cousin)
  }
  dom.isAttached = function (obj) {
   while (true) {
    obj = obj.parentNode
    if (obj == document.documentElement) return true
    if (obj == null) return false
   }
  }
  dom.appendChildren = function (init) {var parent = init.parent, children = init.children; children.forEach(function (child) {parent.appendChild(child)})}
  dom.detachAll = function (parent, recursive) {
   Array.prototype.slice.call(parent.childNodes).forEach(function (child) {
    parent.removeChild(child); if (recursive) dom.detachAll (child, recursive)
   })
  }
  dom.detachAllOtherSiblings = function (exceptedChildren, recursive) {
   if (!Array.isArray(exceptedChildren)) exceptedChildren = [exceptedChildren]
   var parent = exceptedChildren[0].parentNode
   Array.prototype.slice.call(parent.childNodes).forEach(function (child) {
    if (exceptedChildren.find(function (testchild) {return testchild == child})) return
    parent.removeChild(child); if (recursive) dom.detachAll (child, recursive)
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
    eventNameList.forEach(function (eventName) {
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
      func.apply(element, [evt])
     }
     subscribeTarget.addEventListener(eventName, functionwrapper)
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
    query_parameters.forEach(function (prop) {if (prop in init) {additions[prop] = init[prop]; columns_affected.push (prop)}})
    Object.assign(entry, additions)
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
      query_parameters.forEach(function (prop) {if (prop in init) additions[prop] = entry_original[prop]})
      event_dispatcher.dispatchEvent(event_name, Object.assign ({}, id_param, {columnsAffected: columns_affected}, additions))
     }
    } else if (wait_for_result) {
     var effects = (typeof result == "object") ? result.effects : undefined
     if (effects) {
      dispatch_events (effects)
     } else {
      event_dispatcher.dispatchEvent (event_name, Object.assign ({}, id_param, {columnsAffected: columns_affected}, additions))
     }
    }
    callback_original(result)
   }
   dbrequest_queue(database_action, query_parameters.concat(entry_id_string), init)
   
   function get_entry_object (init) {
    var container = init.container, entry_id = init.entry_id
    if (typeof entry_id == "undefined") return container
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
    dispatch_list.forEach(function (dispatch_data) {event_dispatcher.dispatchEvent.apply(null, dispatch_data)})
   }
  }
  dom.setToBiggestWidth = function (arr) {
   var biggestWidth = 0
   arr.forEach(function (obj) {if (biggestWidth < obj.offsetWidth) biggestWidth = obj.offsetWidth})
   arr.forEach(function (obj) {obj.style.width = biggestWidth + "px"})
  }
  dom.makeLabelAndInput = function (init) {
   var parent           = init.parent
   var labelText        = init.label
   var inputName        = init.name
   var pre              = init.pre
   var post             = init.post
   var inputType        = init.type
   var inputAttributes  = init.attributes
   var inputSubElements = init.subElements
   var inputElement     = init.inputElement
   var useDefaultStyles = (typeof init.useDefaultStyles == "undefined") ? true : (init.useDefaultStyles)
   var nestInput        = (typeof init.nestInput == "undefined") ? false : (init.nestInput)
   var main = document.createElement('div')
   if (useDefaultStyles) main.style.display = "block"
   var label = document.createElement('label'); label.innerHTML = labelText
   if (typeof pre != "undefined") {
    var templabel = document.createElement('div')
    templabel.innerHTML = pre
    label.appendChild(templabel)
    if (useDefaultStyles) {
     templabel.style.display       = "inline-block"
     templabel.style.right         = 0
     templabel.style.verticalAlign = "middle"
     templabel.style.position      = 'absolute'
    }
   }
   if (typeof inputType == "undefined") inputType = "text"
   if (typeof inputElement == "undefined") inputElement = "input"
   var input = document.createElement(inputElement)
   if (typeof init.value != "undefined") input.value = init.value
   if (typeof init.disabled != "undefined") input.disabled = init.disabled
   if (typeof init.readonly != "undefined") {
    if (init.readonly == true) init.readonly = "readonly"
    input.readOnly = init.readonly
   }
   if (inputElement == "input") input.type = inputType
   input.oncontextmenu = function () {return true}
   input.name = inputName
   if (typeof init.checked != "undefined") input.checked = init.checked
   if (useDefaultStyles) input.style.display = "inline-block"
   if (nestInput == true) {
    var inputWrapper = document.createElement('span')
    inputWrapper.className = (typeof init.inputWrapperClassName != 'undefined') ? init.inputWrapperClassName : "input_wrapper_default"
    if (typeof init.inputWrapperStyle != "undefined") add_style(inputWrapper, init.inputWrapperStyle)
    inputWrapper.appendChild(input)
   }
   var inputToAppend = (nestInput == true) ? inputWrapper : input
   if (init.inputFirst == true) {
    main.appendChild(inputToAppend); main.appendChild(label)
   } else {
    main.appendChild(label); main.appendChild(inputToAppend)
   }
   if (typeof post != "undefined") {
    var templabel = document.createElement('div')
    templabel.innerHTML = post
    if (useDefaultStyles) templabel.style.display = "inline-block"
    main.appendChild(templabel)
   }
   main.className  = (typeof init.className      != 'undefined') ? init.className      : "input_main_default"
   label.className = (typeof init.labelClassName != 'undefined') ? init.labelClassName : "input_label_default"
   input.className = (typeof init.inputClassName != 'undefined') ? init.inputClassName : "input_input_default"
   if (typeof init.labelStyle != "undefined") add_style(label, init.labelStyle)
   if (typeof init.inputStyle != "undefined") add_style(input, init.inputStyle)
   if (typeof init.style       != "undefined") add_style(main , init.style)
   for (var attributeName in inputAttributes) {
    input[attributeName] = inputAttributes[attributeName]
   }
   if (typeof inputSubElements != "undefined") {
    var curlen = inputSubElements.length; for (var i = 0; i < curlen; i++) {input.appendChild(inputSubElements[i])}
   }
   parent.appendChild(main)
   main.input = input
   main.label = label
   return main
  }
  dom.clearfocus = function () {
   var hocuspocus = document.createElement('input')
   document.body.appendChild(hocuspocus); hocuspocus.focus()
   document.body.removeChild(hocuspocus); hocuspocus = null
  }
  // <DOM-based interval handler/wrapper functions. TAG: setInterval, TAG: setTimeout.>
  dom.setTimeout = function (element, functionCallOriginal) {
  var args = Array.prototype.slice.call(arguments); args.shift()
  var argsShift = args.slice(2)
  args[0] = function () {if (dom.isAttached(element)) functionCallOriginal(args)}
  var curtime = new Date().getTime()
  var timeout = {
   timeLeft : args[1],
   start    : curtime,
   pause    : function () {
    if (timeout.paused) return
    timeout.paused = true
    timeout.timeLeft = new Date().getTime() - timeout.start
    if (timeout.timeLeft <= 0) return
    window.clearTimeout(timeout.id)
   },
   resume   : function () {
    if (!timeout.paused) return
    delete (timeout.paused)
    timeout.start = new Date().getTime()
    args[1] = timeout.timeLeft
    timeout.id = window.setTimeout.apply(window, args)
   },
   restart  : function () {
    if (timeout.paused) delete (timeout.paused)
    window.clearTimeout(timeout.id)
    timeout.start = new Date().getTime()
    timeout.id = window.setTimeout.apply(window, args)
   },
   id       : setTimeout.apply(window, args)
  }
  return timeout
 }
  dom.setInterval = function (element, functionCallOriginal) {
   var args = Array.prototype.slice.call(arguments); args.shift()
   var argsShift = args.slice(2)
   args[0] = function () {
    interval.timeLeft = args[1]
    interval.start = new Date().getTime()
    if (interval.partial) {
     interval.partial = false
     interval.id = window.setInterval.apply(window, args)
    }
    if (dom.isAttached(element)) functionCallOriginal(argsShift)
   }
   var curtime = new Date().getTime()
   var interval = {
    timeLeft : args[1],
    start    : curtime,
    pause    : function () {
     if (interval.paused) return
     interval.paused = true
     interval.timeLeft = new Date().getTime() - interval.start
     if (interval.timeLeft <= 0) return
     if (interval.partial) {window.clearTimeout(interval.id)} else {window.clearInterval(interval.id)}
    },
    resume   : function () {
     if (!interval.paused) return
     delete (interval.paused)
     interval.start = new Date().getTime()
     interval.partial = true
     interval.id = window.setTimeout.apply(window, args)
    },
    restart  : function () {
     if (interval.paused) delete (interval.paused)
     window.clearTimeout(interval.id)
     interval.start = new Date().getTime()
     interval.id = window.setInterval.apply(window, args)
    },
    id       : setInterval.apply(window, args)
   }
   return interval
  }
 }
 // </DOM-based interval handler/wrapper functions.>
 // </DOM manipulation functions.>
 
 // <Domain and directory functions. TAG: form, TAG: uri component, TAG: domain, TAG: directory, TAG: path.>
 // Get URL variables from window.location and put them into variable_object as key/value pairs. Returns variable_object.
 if (h.library_settings.domain_and_directory) {
  h.getUrlVars             = function (variable_object) {
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
  h.formUrlVars            = function (variable_list, options) {
   if (typeof options           == "undefined") options = {}
   if (typeof options.record_undefined_values == "undefined") options.record_undefined_values = true
   var return_value = ""
   for (var i in variable_list) {
   if ((typeof variable_list[i] != "undefined") || (options.record_undefined_values == true)) return_value += "&" + i + "=" + variable_list[i]}
   if (return_value != "") return_value = "?" + return_value.slice(1, return_value.length)
   return return_value
  }
  h.directoryNormalize    = function (dirpath) {
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
  h.stripDomain           = function (url) {
   var startAt = url.indexOf('://');
   if (startAt == -1) return url
   startAt = startAt == -1 ? 0 : startAt+3;
   var first_index = url.indexOf("/", startAt) + 1
   if (first_index == 0) return url
   return url.substring(first_index)
  }
  h.getDomainAndDirectory = function (url) {var last_index = url.lastIndexOf("/") + 1; return url.substring(0, last_index)}
  h.stripFromBaseHref     = function (url) {
   var startAt = url.indexOf('://');
   if (startAt == -1) return url
   startAt = startAt == -1 ? 0 : startAt+3;
   var first_index = url.indexOf("/", startAt) + 1
   if (first_index == 0) return url
   return url.substring(first_index)
  }
  h.stripDirectory        = function (url) {var last_index = url.lastIndexOf("/") + 1; if (last_index == 0) return url; return url.substring(last_index)}
  h.stripExtension        = function (url) {return url.substring(0, url.lastIndexOf("."))}
  h.removeBaseUrl         = function (url) {
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
  h.modifyHrefIfRelative  = function (prefix_src, current_src) {if (current_src.substr(0, 7) != "http://") {return prefix_src + current_src} else {return current_src}}
 }
 // <Domain and directory functions.>

 // <Graphics/image/canvas functions. TAG: graphics, TAG: <canvas>, TAG: canvas. TAG: image.>
 // Function to help preload an image or list of images.
 if (h.library_settings.graphics) {
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
   // Delete the <div>.
   document.body.removeChild(scrollDiv)
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
  h.detect_pixels_per_inch = function () {
   var dom_body = document.getElementsByTagName('body')[0]
   var dom_div  = document.createElement('div')
   dom_div.style = 'width: 1in; visibility:hidden'
   dom_body.appendChild(dom_div)
   var w = document.defaultView.getComputedStyle(dom_div, null).width
   dom_body.removeChild(dom_div)
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
   font_list.forEach(function (font_family) {
    if (typeof font_family == "string") {load_font_by_family_and_size (font_family, "normal"); return}
    var font_weight_list = font_family.font_weight, font_family = font_family.font_family
    font_weight_list.forEach(function (font_weight) {load_font_by_family_and_size (font_family, font_weight)})
   })
   
   if (typeof callback == "undefined") return
   
   check_that_all_fonts_have_loaded ()
   
   function load_font_by_family_and_size (font_family, font_weight) {
    var node = document.createElement('span')
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
    document.body.appendChild(node)
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
    node.parentNode.removeChild(node)
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
   adjust_elements.forEach(function (adjust_element, i) {
    adjust_elements_font_size[i] = parseFloat(window.getComputedStyle(adjust_element).getPropertyValue("font-size"))
   })
   
   while (true) {
    parent.style.width = "auto"
    var scale_ratio = parent.clientWidth
    parent.style.width = ""
    scale_ratio /= parent.clientWidth
    if (scale_ratio <= scale_ratio_max) break
    adjust_elements.forEach(function (adjust_element, i) {
     adjust_elements_font_size[i] *= scale_ratio_step
     adjust_element.style.fontSize = adjust_elements_font_size[i] + "px"
    })
   }
  }
 }
 // </Font loading/handling functions.>
} ()
