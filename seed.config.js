/* 
* seed Config
* @version 2.0.0
* @author Kirill Ivanov
*/


'use strict';

// проверим существование объекта seed
if (!window.seed) {
	window.seed = {};
	seed = window.seed;
}

// список библиотек AMD ядра и зависимостей
seed.plugins = {
	'jquery.1.4.2' : {
		'path' : '/js/jquery/jquery-1.4.2.js',
		"callback" : function() {
			return jQuery;
		}
	},
	'jquery.1.7.1' : {
		'path' : '/js/jquery/jquery-1.7.1.js',
		"callback" : function() {
			return jQuery;
		}
	},
	'jquery.1.9.1' : {
		'path' : '/js/jquery/jquery-1.9.1.js',
		"callback" : function() {
			return jQuery;
		}
	},
	'jquery.2.0.1' : {
		'path' : '/js/jquery/jquery-2.0.1.js',
		"callback" : function() {
			return jQuery;
		}
	},
	'jquery.2.1.3' : {
		'path' : '/js/jquery/jquery-2.1.3.min.js',
		"callback" : function() {
			return jQuery;
		}
	},
	'jquery.2.1.4' : {
		'path' : '/js/jquery/jquery-2.1.4.min.js',
		"callback" : function() {
			return jQuery;
		}
	},

// Общие библиотеки
	"common.cookie" : {
		"path" : "/js/jquery/jquery.cookie.js"
	},
	"common.easing" : {
		"path" : "/js/jquery/jquery.easing.1.3.js"
	},
	"common.mousewheel" : {
		"path" : "/js/jquery/jquery.mousewheel.js"
	},
	"common.map" : {
		"path" : "/js/jquery/jquery.map.js"
	},
	"common.meta" : {
		"path" : "/js/jquery/jquery.metadata.js"
	},
	"common.tablesorter" : {
		"path" : "/js/jquery/jquery.tablesorter.2.10.js"
	},
	"common.tablednd-2.10" : {
		"path" : "/js/jquery/jquery.tablednd.js"
	},
	"common.synctranslit" : {
		"path" : "/js/jquery/jquery.synctranslit.min-utf8.js"
	},
	"common.base64" : {
		"path" : "/js/base64/base64.js",
		"callback" : function() {
			return Base64;
		}
	},
	"common.json" : {
		"path" : "/js/jquery/jquery.json.js"
	},

// библиотеки jQuery UI
	"ui.dialog" : {
		"path" : "/js/jquery/ui/jquery.ui.dialog.js"
	},
	"ui.datepicker" : {
		"path" : "/js/jquery/ui/jquery.ui.datepicker.js"
	},
	"ui.datepicker-ru" : {
		"path" : "/js/jquery/ui/jquery.ui.datepicker-ru-utf.js"
	},
	"ui.datepicker-extension" : {
		"path" : "/js/jquery/ui/jquery.ui.datepicker-extension.js"
	},
	"ui.timepicker" : {
		"path" : "/js/jquery/ui/jquery.ui.timepicker.js"
	},
	"ui.timepicker-ru" : {
		"path" : "/js/jquery/ui/jquery.ui.timepicker-ru.js"
	},
	"ui.mouse" : {
		"path" : "/js/jquery/ui/jquery.ui.mouse.js"
	},
	"ui.draggable" : {
		"path" : "/js/jquery/ui/jquery.ui.draggable.1.11.4.min.js"
	},
	"ui.slider" : {
		"path" : "/js/jquery/ui/jquery.ui.slider.1.11.4.js.js"
	},

// библиотеки html5
	"html5.jQueryPlugin" : {
		"path" : "/js/html5/jQueryPlugin.js"
	},
	"html5.HTML5Loader" : {
		"path" : "/js/html5/HTML5Loader.js"
	},
	"html5.HTML5Viewer" : {
		"path" : "/js/html5/HTML5Viewer.js"
	},

// библиотеки High Slide
	"high.slide" : {
		"path" : "/js/slide/highslide.4.1.13.packed.js"
	},
// библиотеки High Charts
	"high.charts" : {
		"path" : "/js/highstock/highcharts.4.1.9.js"
	},

// библиотеки seed
	"seed.core" : {
		"path" : "/js/seed/libs/jquery.seed.core.js"
	},
	"seed.buy" : {
		"path" : "/js/seed/libs/jquery.seed.buy.js"
	},
	"seed.basket" : {
		"path" : "/js/seed/libs/jquery.seed.basket.js",
		"depents": ['seed.gform', 'common.json']
	},
	"seed.carousel" : {
		"path" : "/js/seed/libs/jquery.seed.carousel.js",
		"depents": ['common.easing']
	},
	"seed.compare" : {
//			"path" : "/js/seed/libs/jquery.seed.compare.js"
	},
	"seed.dropdown" : {
		"path" : "/js/seed/libs/jquery.seed.dropdown.js"
	},
	"seed.filter" : {
		"path" : "/js/seed/libs/jquery.seed.filter.js",
		"depents": ['common.cookie']
	},
	"seed.gallery" : {
		"path" : "/js/seed/libs/jquery.seed.gallery.js"
	},
	"seed.gform" : {
		"path" : "/js/seed/libs/jquery.seed.gform.js",
		"depents" : ['seed.tooltip']
	},
	"seed.modal" : {
		"path" : "/js/seed/libs/jquery.seed.modal.js",
		"depents" : ['ui.draggable']
	},
	"seed.page" : {
		"path" : "/js/seed/libs/jquery.seed.page.js",
		"depents": ['common.cookie']
	},
	"seed.tab" : {
		"path" : "/js/seed/libs/jquery.seed.tab.js"
	},
	"seed.tooltip" : {
		"path" : "/js/seed/libs/jquery.seed.tooltip.js"
	},
	"seed.select" : {
		"path" : "/js/seed/libs/jquery.seed.select.js",
		"depents": ['seed.dropdown']
	},
	"seed.ui" : {
		"path" : "/js/seed/libs/jquery.seed.ui.js",
		"depents": ['seed.modal', 'seed.gform']
	},
	"seed.zoom" : {
		"path" : "/js/seed/libs/jquery.seed.zoom.js"
	}
};