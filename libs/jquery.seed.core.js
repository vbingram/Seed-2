﻿/* 
 * Seed Lib Core
 * @version 2.0.28
 * @author Kirill Ivanov
 */

// предваряющие точка с запятой предотвращают ошибки соединений с предыдущими скриптами, которые, возможно не были верно «закрыты».
;(function ($, seed, window, document, undefined) {
	'use strict';

	// ядро seed lib
	function core(name, library) {
		this._name = name;
		this._label = name.replace('seed','seed.').toLowerCase();
		this._method = library || $.seed[name];

		this._defaults = {
			'debug': false,
			'dynamic' : false,
			'lazy' : true,
			'evented' : false,
			'fullscreen' : false,
			'lazy' : true,
			'selector': {
				'auto' : null
			},
			'class': {},
			'event' : {
				'__on' : null,
				'__off' : null
			},
			'url' : {
				'current': null,
				'ajax':null
			},
			'func' : {
				'ready' : null,
				'callback_item' : null
			},
			'module' : {
				'main' : null,
				'function' : null
			},
			'locale' : {
				'error' : {
					'data-name': 'не задано имя',
					'title': 'не задан title'
				}
			},
			'touch' : 'ontouchstart' in document.documentElement
		};
		
		this._stack = 0;
		this._seedCount = 0;
		
		this._init();
	}

	// прототип ядра seed lib
	core.fn = core.prototype = {
		_name: 'seedCore',
		// логирование клиентских ошибок в JS
		_log: function(msg, url, line) {
			msg = 'SEED: '+ msg;
			new Image().src = "/cgi-bin/log.cgi?message=" + decodeURIComponent(msg) + "&url="+ decodeURIComponent(url) + "&line=" + decodeURIComponent(line);
		},
		// перезапустим библиотеку еще раз, заставим обновлить список this._$list
		
		_reinit: function() {
			console.log('_reinit', arguments);
			return false;
		},
		
		// функционал Fullscreen API 
		_fullscreen: function() {
			// если уже есть созданный метод в глобальном пространстве, то ничего не делаем
			if( window.fullScreenApi ) { return window.fullScreenApi; }

			// если нет, то создаем его
			var fullScreenApi = {
				supportsFullScreen: false,
				isFullScreen: function() { return false; },
				requestFullScreen: function() {},
				cancelFullScreen: function() {},
				fullScreenEventName: '',
				prefix: ''
		        };
			var browserPrefixes = 'webkit moz o ms khtml'.split(' ');
 
			// проверяем поддерживает ли браузер Fullscreen API
			if (typeof document.cancelFullScreen != 'undefined') {
				fullScreenApi.supportsFullScreen = true;
			}
			// проверяем поддерживает ли браузер Fullscreen API через префикс
			else {
				for (var i = 0, il = browserPrefixes.length; i < il; i++ ) {
					fullScreenApi.prefix = browserPrefixes[i];
					if (typeof document[fullScreenApi.prefix + 'CancelFullScreen' ] != 'undefined' ) {
						fullScreenApi.supportsFullScreen = true;
						break;
					}
				}
			}
 
			// обновляем метод, добавляя функционал
			if (fullScreenApi.supportsFullScreen) {
				fullScreenApi.fullScreenEventName = fullScreenApi.prefix + 'fullscreenchange';
				fullScreenApi.isFullScreen = function() {
					switch (this.prefix) {
						case '': return document.fullScreen;
						case 'webkit': return document.webkitIsFullScreen;
						default: return document[this.prefix + 'FullScreen'];
					}
				}
				fullScreenApi.requestFullScreen = function(el) {
					return (this.prefix === '') ? el.requestFullScreen() : el[this.prefix + 'RequestFullScreen']();
				}
				fullScreenApi.cancelFullScreen = function(el) {
					return (this.prefix === '') ? document.cancelFullScreen() : document[this.prefix + 'CancelFullScreen']();
				}
			}

			// добавляем метод к методам jQuery 
			if (typeof jQuery != 'undefined') {
				jQuery.fn.requestFullScreen = function() {
					return this.each(function() {
						if (fullScreenApi.supportsFullScreen) fullScreenApi.requestFullScreen(this);
					});
				};
				jQuery.fn.cancelFullScreen = function() {
					return this.each(function() {
						if (fullScreenApi.supportsFullScreen) fullScreenApi.cancelFullScreen(this);
					});
				};
			}
 
			// экспортируем метод в глобальное пространство
			window.fullScreenApi = fullScreenApi;
			return fullScreenApi;
		},
		
		_lazy: function(target, func) {
			
			return new Promise(function(resolve, reject) {
				try {
					observer.disconnect();
				}
				catch(e) {}
		
				// создаем экземпляр наблюдателя
				var observer = new MutationObserver(function(mutations) { 
					mutations.forEach(function(mutation) {
						if (mutation.type === 'childList') {
							var nodes = $(mutation.addedNodes).filter(target.selector);
							if(nodes.length) {
								nodes.selector = target.selector;
								observer.disconnect();
								resolve(nodes);
							}
						}
					});
				});
				
				// настраиваем наблюдатель, указываем что на интересует только добавление дочерних элементов
				var config = {
					childList: true,
					subtree: true,
					attributes: false,
					characterData: false
				}
				 
				// передаем элемент и настройки в наблюдатель
				observer.observe(document.body, config);
				
			});
		},		
		
		_init: function() {
			var core = this;
//			this.defaults = {};
			
			// конструктор плагина
			function Seed(element, data /*list, dynamic, options, e */) {
				if( !element ) return false;
				
				var self = this;
				this.el = element;
				this.$el = $(element);

				this._core = core;
				this._name = core._name;
				this._label = core._label;
				this._$list = data.list;
				this._list = data.list.get(0);
				this._index = this._$list.index(this.$el)+1;
				
				// если е - обьект события, сохраним его
				if( typeof data.e == 'object') this._event = data.e;
				this._time = new Date().getTime();
				
				this.init(data);
				
				return this;
			}

			// прототипируем конструктор
			Seed.fn = Seed.prototype = $.extend(true, {
				defaults: {},
				
				// инициализация библиотеки
				init: function(data) {
					var self = this;

					// обновим кофниг из переданных параметров
					this._config(data.options);

					// построим библиотеку
					this.build();

					// если элемент был последний в списке, вызовем callback-функцию инициализации библиотеки, если она определена
					if( this._$list.length == this._index && $.isFunction(this.config.func.ready) ) {
						(self.config.func.ready)(self);
					}
					
					// создаем обсервер для ленивого запуска библиотеки при необходимости
					if( this.config.lazy && this._$list.length == this._index ) {
						this._lazy = core.__proto__._lazy;
						this.lazy = this._lazy(this._$list).then(function(nodes) {
							nodes[core._name]();
						});
					}

					return this;
				},
				
				// создает объект конфига
				_config: function(options) {
					/*
						сначала мы получаем объект конфига, который определен в ядре - core._defaults
						далее мы читаем конфиг конкретной библиотеки - this.defaults
						после читаем определенные глобальные опции для всех библиотек - seed.config.defaults
						после читаем определенные глобальные локализации для всех библиотек - seed.config.locale
						и в конце читаем локальные опции вызова библиотеки
					*/
					
					/*
						console.log('CORE DEFAULTS', core._defaults);
						console.log('LIB DEFAULTS', this.defaults);
						console.log('GLOBAL LIB OPTIONS', seed.config.libs);
						console.log('LIB OPTIONS', options);
					*/
					
					// создает объект конфига, объединяе в него конфиг ядра и конфиг библиотеки
					this.config = $.extend(true, {}, core._defaults, this.defaults);

					// добавляем глобальные опции для библиотек
					this.config = $.extend(true, this.config, seed.config.defaults);					
					
					 // добавляем в конфиг глобально определенную локализацию
					if( seed.config.locale[self._name] ) {
						this.config.locale = $.extend(true, this.config.locale, seed.config.locale[self._name]);
					}
					
					// добавляем локальные опции вызова
					this.config = $.extend({}, this.config, options);

					// проверяем поддержку сторонних API
					this.config.fullscreen = this.$el.attr('data-fullscreen') || this.config.fullscreen;
					
					// запустим API Fullscreen описанне в ядре
					if( this.config.fullscreen ) {
						core._fullscreen();
						// если браузер не поддерживает API отключим эту настройку
						if( !window.fullScreenApi.supportsFullScreen ) this.config.fullscreen = false;
					}
					
					return this;
				},
				
				// метод получения значения атрибута
				_getAttr: function(attr) {
					try {
						var value = this.$el.attr(attr) || this.$el.attr('data-'+attr) || this.config[attr];
						if( value === "true" ) value = true;
						if( value === "false" ) value = false;
						return value;
					}
					catch(e) {
						this._error(e, value);
					}
				},

				// метод отключения библиотеки
				_destroy: function() {
					this.$el.removeData(this._label);
					try {
						delete this;
					}
					catch(e) {
						this._error(e, value);
					}

					return false;
				},

				_error: function(e, value) {
					console.error(this._name+' error: '+this.config.locale.error[value], value);
				},

				// функционал создания декоратора для метода
				hook: function() {
					seed.hook.apply(this, arguments);
				},

				// функционал удаления декоратора для метода
				unhook: function() {
					seed.unhook.apply(this, arguments);
				},

				build: function() {
					this.bind();
				},

				bind: function() {

				}
			}, core._method);

			// определения плагина
			function Plugin(setting, config) {
				var list = this;

				// получим дефолтные параметры и расширим их переданными при запуски библиотеки
				var defaults = Seed.fn.defaults;
				var evented = (typeof setting == 'object') ? ( (setting.evented === false || setting.evented === true) ? setting.evented : Seed.fn.defaults.evented) : Seed.fn.defaults.evented;
				var uniq = ('.'+core._seedCount++);

				if( seed.isObject(setting) ) defaults = $.extend({}, defaults, setting);
				
				// инициализация плагина
				var init = function(e, dynamic) {
					// если инициализация вызвана через событие, то проверим, чтобы делегирующий и целевой элемент не совпадали
					if( e.currentTarget ) {
						if( e.currentTarget === e.delegateTarget ) {
							return false;
						}
					}

					var element = this;
					var $element = $(element);

					var option = setting || ((typeof e == 'object') ? e.data.option : false);
					var options = typeof setting == 'object' && setting;
					var data = $element.data(core._label);

					// если обьект библиотеки еще не создан, то нужно его инициализировать
					if( !data ) {
						$element.data(core._label, (data = new Seed(element, {list:list, dynamic:dynamic, options:options, e:e} )));

						// сохраним данные о том какие объекты были обработаны
						if(!$.seed[core._name]._inited[uniq] && !evented) {
							$.seed[core._name]._inited.push({
								'uniq' : uniq,
								'selector' : list.selector,
								'dynamic' : defaults.dynamic,
								'config' : options
							});
						}
					}
					
					// обновим конфиг
					if( typeof option == 'string' ) {
						if(config) { data['_config'](config); }
						data[option]();
					}

					if( e.originalEvent ) {
						try {
							e.stopPropagation();
							e.preventDefault();
						} catch(error) {
//							//core._log(error);
						}
					}

					return (typeof e == 'number') ? data : false;
				}

				// если включена опция обработки динамечески созданных элементов
				if( evented && typeof setting != 'string' ) {
 					// создадим дополнительный индефикатор для namepace события, чтобы при вывозе одной и тоже библиотеки несколько раз, не было накладки одинаковых событий друг на друга
					$('body').off(defaults.event.on+uniq +' '+ defaults.event.__on+uniq, this.selector).on(defaults.event.on+uniq, this.selector, { option:setting }, init);
				}

				// если библиотека только динамическая, то проверим если ли функция ready - определенная по умолчанияю
				// если библиотека не только динамическая, то обработаем каждый элемент списка с помощью нее сразу
				return (evented) ? false : list.each(init);
			}

			var noConflict = $.fn[core._name];

			$.fn[core._name] = Plugin;
			$.fn[core._name].Constructor = Seed;
			
			seed[core._name] = Plugin;

// noConflict для библиотеки
			$.fn[core._name].noConflict = function() {
				$.fn[core._name] = noConflict;
				return this;
			}

// автозапуск библиотеки для элементов определенных по умолчанию
			seed.ready(function() {
// автозапуск элементов обработки по DOM ready
				if(Seed.fn.defaults.selector.auto) { $(Seed.fn.defaults.selector.auto)[core._name]({'evented':false}); }

// автозапуск элементов обработки по евентами определнных в библиотеки по умолчанию
				if(Seed.fn.defaults.selector.evented) { $(Seed.fn.defaults.selector.evented)[core._name]({'evented':true}); }
			});
		}
	}

	seed.core = $.fn.seedCore = core;
	return $;
})(jQuery, seed, window, document);