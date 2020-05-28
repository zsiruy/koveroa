(function(window) {
    'use strict';

    var Helpers = window.Helpers = {
        qs: function(s) {
            return document.querySelectorAll(s);
        },
        domReady: function(fn) {
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', fn);
            } else {
                var readyStateCheckInterval = setInterval(function() {
                    if (document.readyState === "complete") {
                        clearInterval(readyStateCheckInterval);
                        fn();
                    }
                }, 5);
            }
        },
        getCookie:function (name) {
          var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
          ));
          return matches ? decodeURIComponent(matches[1]) : undefined;
        },
        on: function(el, eventName, callback, context) {
            if (el.addEventListener) {
                el.addEventListener(eventName, function (e) {
                    callback.call(context, e);
                }, false);
            } else if(el.attachEvent) {
                el.attachEvent('on' + eventName, function (e) {
                    callback.call(context, e);
                });
            }
        },
        each: function(array, fn) {
            for (var i = 0, l = array.length; i < l; i++) {
                fn(array[i], i);
            }
        },
        indexOf: function(obj, start) {
            for (var i = (start || 0); i < this.length; i++) {
                if (this[i] == obj) {
                    return i;
                }
            }
            return -1;
        },
        extend: function(defaults, options) {
            var extended = {},
                prop;
            for (prop in defaults) {
                if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                    extended[prop] = defaults[prop];
                }
            }
            for (prop in options) {
                if (Object.prototype.hasOwnProperty.call(options, prop)) {
                    extended[prop] = options[prop];
                }
            }
            return extended;
        },
        serialize: function(form) {
            var obj = {};
            for (var i = 0, l = form.length; i < l; i++) {
                obj[form[i].getAttribute('name')] = form[i].value;
            }
            return obj;
        },
        bi: function(id) {
            return document.getElementById(id);
        },
        bt: function(tagName) {
            return document.getElementsByTagName(tagName);
        },
        urlGET: function(name) {
            if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search));
            return (name === null) ? '' : decodeURIComponent(name[1]);
        },
        objectToGet: function (object) {
            var GETString = '';
            var encode = '';
            for(var key in object) {
                encode = encodeURIComponent(object[key]);
                GETString += '&'+key+'=' + encode;
            }
            return GETString;
        },
        JSONP: function(url, options) {
            var script = document.createElement('script');
                script.async = true;
                script.setAttribute('src', url);

            document.body.appendChild(script);
            script.onload = function(event) {
                if (options && typeof options.onLoad == 'function') {
                    options.onLoad(event, url);
                }
            };
            script.onerror = function(event) {
                if (options && typeof options.onError == 'function') {
                    options.onError(event, url);
                }
            };
        },
        // Кроссбраузерный вариант для xhr
        xhrCreate: function() {
            var xmlhttp;
            
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                try {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (E) {
                    xmlhttp = false;
                }
            }
            if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
                xmlhttp = new XMLHttpRequest();
            }
            return xmlhttp;
        },
        xhrPOST: function(options) {
            var xhr = this.xhrCreate();

            options = Helpers.extend({
                ecntype: 'application/x-www-form-urlencoded',
                async: true
            }, options);

            xhr.open("POST", options.url, options.async)
            xhr.setRequestHeader('Content-type', options.ecntype);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && typeof options.callback == 'function') {
                    options.callback(xhr.response, xhr.status, xhr);
                }
            };
            xhr.send(options.data);
        },
        isPhone: function(value) {
            return value.length > 7 ? true : false;
        },
        isName: function(value) {
            return value.length > 2 ? true : false;
        },
        isEmail: function(value) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(value);
        }
    };

    // Request paths
    var Requests = function (name, type) {
        var pathnameWithoutSlash = document.location.pathname.replace(new RegExp(/\/$/), "");
        return {
            default: {
                cookieCheck: "http://%dynamicDomain%/index.php?r=api/cookie&jsoncallback=lShakes.setCookieDomain&site=" + lShakes.config.location + '&tid=' + window.tid,
                orderSubmit: 'http://' + lShakes.config.cookie_domain + '/index.php?r=api/request/index',
                emailSubmit: 'http://' + lShakes.config.cookie_domain + '/index.php?r=api/email',
                // Old order.html
                // orderRedirect: '/order.html?request_id=%requestID%&tid=' + window.tid + '&orderType=' + Helpers.urlGET('orderType'),
                orderRedirect: '/success.%langCode%.html?request_id=%requestID%&tid=' + window.tid + '&orderType=' + Helpers.urlGET('orderType'),
                apiScripts: 'http://' + lShakes.config.cookie_domain + '/index.php?r=api/js&site=' + lShakes.config.location + '&tid=' + window.tid,
                returnerCheck: 'http://' + lShakes.config.cookie_domain + '/comebackerSettings?site=' + lShakes.config.location + '&tid=' + window.tid,
                jsLogging: '/api/jsLog',
            },
            parking: {
                tid: '/api/track' + document.location.search + (document.location.search == '' ? '?' : '&') +'code=' + document.location.pathname.split('/')[1],
                orderSubmit: '/api/request?',
                emailSubmit: '/api/email?',
                // Old order.html
                // orderRedirect: document.location.pathname.slice(0, -1) + '/order.html?request_id=%requestID%&tid=' + window.tid + '&orderType=' + Helpers.urlGET('orderType') + '&ver=' + Helpers.urlGET('ver'),
                orderRedirect: pathnameWithoutSlash + '/success.%langCode%.html?request_id=%requestID%&tid=' + window.tid + '&orderType=' + Helpers.urlGET('orderType') + (Helpers.urlGET('ver') ? '&ver=' + Helpers.urlGET('ver') : ''),
                apiScripts: "/api/js?referer=" + document.location.hostname + pathnameWithoutSlash + '&tid=' + window.tid,
                returnerCheck: '/api/comebackerSettings?referer=' + document.location.hostname + pathnameWithoutSlash + '&tid=' + window.tid,
                jsLogging: '/api/jsLog',
            }
        }[lShakes.domainType][name] || false;
    };

    // Scripts
    var Scripts = function() {
        this.paths = {
            adsCheck: '/cdn/js/ads_check.js',
            landingFeatures: '/cdn/js/landingfeatures.js',
            returner: '/cdn/js/comebacker.js',
            testScript: '/cdn/js/test_shakes.js'
        }
    };

    Scripts.prototype.initialize = function() {
        var _this = this,
            scriptsParams = {},
            script = document.createElement('script');

        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", Requests('apiScripts'));
        document.body.appendChild(script);

        script.onload = function() {
            // Не инициализируем дополнительный функционал для страницы заказа (success)
            if (window.location.pathname.search('/success') > -1) {
                return;
            }
            // Не инициализируем скрипт КБ для айфрейма, созданного КБ
            if (window.self.name == 'returner') {
                return;
            }

            _this.initReturner();
            // Не инициализируем остальные скрипты для фреймов
            if (window.self !== window.top) {
                return;
            }

            //Set geoinfo data
            if (typeof GeoInfo != 'undefined' && typeof lCountries != 'undefined') {
                lCountries.updateCurrentCityHelper(window.GeoInfo.city);
                lCountries.nginxCountryCode = GeoInfo.countryCode.toLowerCase();
                lCountries.defaultCountry = GeoInfo.countryCode.toLowerCase();
            }
            _this.initLandingFeatures();
        };
    };
    Scripts.prototype.initBlockChecker = function(options) {
        Helpers.JSONP(this.paths.adsCheck, options);
    };
    Scripts.prototype.initLandingFeatures = function() {
        if (!window.landingFeatures) {
            return;
        }

        var _this = this;

        Helpers.JSONP(this.paths.landingFeatures, {
            onLoad: function() {
                _this.LandingFeatures = new LandingFeatures(window.landingFeatures);
            },
            onError: function() {
                _this.sendLog({
                    action: 'LandingFeatures loading',
                    message: 'Script wasn\'t loaded',
                    actionUrl: _this.paths.landingFeatures,
                });
            },
        });
    };
    Scripts.prototype.initReturner = function() {
        var _this = this;

        if (!window.pageType || window.pageType != 'layer') {
            return;
        }

        Helpers.JSONP(Requests('returnerCheck'), {
            onLoad: function() {
                if (!window.CB) {
                    return;
                }

                window.CB.beforeRender = _this.handleRedirectLinks(window.CB.landingUrl);
                window.CB.iframeSrc = window.CB.landingUrl + '?tid=' + window.tid + window.location.hash;
                Helpers.JSONP(_this.paths.returner, {
                    onLoad: function() {
                        _this.returner = new ComeBacker(window.CB);
                    },
                    onError: function() {
                        _this.sendLog({
                            action: 'Returner (CB) loading',
                            message: 'Script wasn\'t loaded',
                            actionUrl: _this.paths.returner
                        });
                    },
                });
            },
            onError: function() {
                _this.sendLog({
                    action: 'Returner (CB) data check',
                    message: 'Data for script wasn\'t loaded',
                    actionUrl: Requests('returnerCheck')
                });
            },
        });
    };
    // Обработка ссылок транзитки (редирект)
    Scripts.prototype.handleRedirectLinks = function(redirectUrl) {
        Helpers.each(document.getElementsByTagName('a'), function(element, index) {
            element.style.cursor = 'pointer';
            element.setAttribute('href', redirectUrl);
            element.setAttribute('target', '_blank');

            element.onclick = function(event) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;

                window.onbeforeunload = function() {}; // Отменяем КБ обработчик
                if (window.showCase && window.showCase.isActive) {
                    // Если активирована витрина, то переходим на неё
                    window.location = '//shakesnews.com/?tid=' + window.tid;
                }
                window.open(redirectUrl + window.location.search, '_blank'); // Открываем в новой вкладке лендинг (не актуально)
                return false;
            };
        });
    };

    var Shakes = function(params) {
        var _this = this;

        this.domainType = params.domainType;
        this.config = {};
        this.state = {};
        this.Scripts = new Scripts();
        this.isDevMode = (window.location.hash === '#devmode');
        this.isBlockerHere = undefined;
        this.trans = this.getLang();

        Helpers.domReady(function() {
            _this.config = Helpers.extend({
                cookie_times: [],
                cookie_statuses: [],
                location: document.location.hostname + document.location.pathname
            }, params);
            _this.state = {
                cookieDomainsCheckedCount: 0
            };

            if (_this.domainType == 'parking') {
                _this.parkingInitialize.call(_this);
            } else {
                _this.defaultInitialize.call(_this);
            }
        });
    };
    Shakes.prototype.defaultInitialize = function() {
        window.tid = Helpers.urlGET('tid');
        this.checkBrowsers();
        this.checkDevMode();
        this.checkTest();
        this.initEvents();
        this.checkBlocker();
        this.sendCookies();
    };
    Shakes.prototype.parkingInitialize = function() {
        this.checkBlocker();

        window.tid = Helpers.urlGET('tid');
        if (!window.tid) {
            this.getTid();
        } else {
            this.initEvents();
            this.Scripts.initialize();
        }
    };
    Shakes.prototype.checkBlocker = function() {
        var _this = this;

        this.Scripts.initBlockChecker({
            onError: function() {
                _this.sendLog({
                    action: 'AdBlock checking',
                    message: 'AdBlock is on or script wasn\'t found',
                    actionUrl: _this.Scripts.paths.adsCheck
                });
            }
        });
    };
    Shakes.prototype.sendLog = function(data, callback) {
        data = Helpers.extend({
            date: new Date(),
            action: 'no action',
            message: 'no message',
            actionUrl: '-unspecified-',
            domain: location.hostname,
            page: location.pathname,
            URLparams: location.search,
            URLhash: location.hash,
            pageUrl: location.href
        }, data);

        Helpers.xhrPOST({
            url: Requests('jsLogging'),
            data: Helpers.objectToGet({data: JSON.stringify(data)}),
            callback: function(response, status) {
                if (typeof callback == 'function') {
                    callback(response, status);
                }
            },
        });
    };

    // --- Default methods
    Shakes.prototype.checkBrowsers = function() {
        if (typeof window.yandex === 'undefined') {
            // this.config.cookie_domains.push('shakeson.ru'); // DEPRECATED
        }
    };
    Shakes.prototype.checkDevMode = function() {
        if (this.isDevMode) {
            console.info('Dev mode enabled');
            //  Заменяем домены для дев мода
            this.config.cookie_domain = 'test.sha'+'kesin.com';
            this.config.cookie_domains = ['test.sha'+'kesin.com'];
        }
    };
    Shakes.prototype.checkTest = function (event) {
        if (window.location.hash === '#testshakes') {
            var jsTest = document.createElement('script');
                jsTest.setAttribute('src', this.Scripts.paths.testScript);
            
            document.body.appendChild(jsTest);
        }
    };
    Shakes.prototype.onLoadPix = function (UID, src) {
        var script = document.createElement('script');
            script.src = src + '?UID=' + UID + '&checkId=' + window.tid;
            script.async = true;
            
        document.body.appendChild(script);
    };  
    Shakes.prototype.sendCookies = function() {
        var _this = this;
        for (var key in this.config.cookie_domains) {
            var domain = _this.config.cookie_domains[key];

            if (typeof domain == "string") {
                var request = Requests('cookieCheck').replace('%dynamicDomain%', domain);

                Helpers.JSONP(request, {
                    onError: function(event, urlRequest) {
                        _this.sendLog({
                            action: 'Cookies check: domain '+domain,
                            message: 'Request error',
                            actionUrl: urlRequest,
                        });
                    },
                });
            }
        }
    };
    Shakes.prototype.setCookieDomain = function(data) {
        var cookie_time = 0,
            config = this.config;

        if (data.status === true) {
            if (typeof data.time !== 'undefined') {
                cookie_time = data.time;
            }
        }

        var domainIndex = config.cookie_domains.indexOf(data.domain);

        if (domainIndex !== -1) {
            config.cookie_times[domainIndex] = parseInt(cookie_time);
            config.cookie_statuses[domainIndex] = data.status;
        }

        this.state.cookieDomainsCheckedCount++;

        if (config.cookie_domains.length <= this.state.cookieDomainsCheckedCount) {
            for (var i = 0; i < config.cookie_times.length; i++) {
                if (typeof config.cookie_times[i] == 'undefined') {
                    config.cookie_times[i] = 0;
                }
            }

            var last_time = Math.max.apply(Math, config.cookie_times);

            if (last_time == 0) {
                var status_true_index = config.cookie_statuses.indexOf(true);
                if (-1 < status_true_index) {
                    config.cookie_domain = config.cookie_domains[status_true_index];
                }
            } else {
                var last_time_index = config.cookie_times.indexOf(last_time);
                if(last_time_index > -1) {
                    config.cookie_domain = config.cookie_domains[last_time_index];
                }
            }

            this.Scripts.initialize();
        }
    };
    // --- Parking methods
    Shakes.prototype.getTid = function() {
        var _this = this;

        Helpers.JSONP(Requests('tid'), {
            onLoad: function() {
                _this.initEvents();
                _this.Scripts.initialize();
            },
            onError: function() {
                _this.sendLog({
                    action: 'Get TID',
                    message: 'Script loading was failed',
                    actionUrl: Requests('tid')
                });
            },
        });
    };
    // --- Common methods
    Shakes.prototype.initEvents = function() {
        var _this = this,
            orderForms = Helpers.qs('.order_form'),
            mailForms = Helpers.qs('.mail_form');

        for (var i = 0, l = orderForms.length; i < l; i++) {
            orderForms[i].onsubmit = function (event) {
                _this.submitOrderForm.call(_this, event);
            };
        }
        for (i = 0, l = mailForms.length; i < l; i++) {
            mailForms[i].onsubmit = function (event) {
                _this.submitEmailForm.call(_this, event);
            };
        }
    };
    // Получение объекта с переводами
    Shakes.prototype.getLang = function() {
        if (window.lCountries) {
            // отталкиваемся от гео, полученного в lCountries
            return window.lCountries.countries[lCountries.userCountryCode];
        } else if (window.countryList) {
            // отталкиваемся от гео, полученного в get-параметрах
            var geo = 'ru';

            if (Helpers.urlGET('c')) {
                geo = Helpers.urlGET('c');
            } else if (window.location.pathname.search('/success') > -1) {
                geo = location.pathname.replace('/success.', '').replace('.html', '');
            }
            return window.countryList[geo];
        }
        return {};
    };
    // Сабмит формы с заказом
    Shakes.prototype.submitOrderForm = function(event) {
            event = event || window.event;
        
        var _this = this,
            form = event.currentTarget || event.srcElement,
            sendData;

        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        
        if (!this.checkAnyForm(form)) {
            return false;
        }

        sendData = Helpers.extend(Helpers.serialize(form), {
            tid: window.tid,
            orderType: Helpers.urlGET('orderType'),
            location: this.config.location,
            site: this.config.location,
            jsoncallback: 'lShakes.orderConfirm'
        });
        sendData = this.checkFormDataArray(sendData);

        Helpers.JSONP(Requests('orderSubmit') + Helpers.objectToGet(sendData), {
            onError: function() {
                _this.sendLog({
                    action: 'Order submit',
                    message: 'Request error',
                    actionUrl: Requests('orderSubmit') + Helpers.objectToGet(sendData),
                });
            },
        });
        return false;
    };
    Shakes.prototype.orderConfirm = function(data) {
        var langCode = data.langCode ? data.langCode : 'ru';

        if (this.config.orderRedirect !== '') {
            this.config.orderRedirect = Requests('orderRedirect').replace('%requestID%', data.request_id).replace('%langCode%', langCode);
            document.location.href = this.config.orderRedirect;
        }
    };
    // Сабмит формы с подпиской на почту
    Shakes.prototype.submitEmailForm = function (event) {
            event = event || window.event;

        var _this = this,
            form = event.currentTarget || event.srcElement,
            sendData;

        event.preventDefault ? event.preventDefault() : event.returnValue = false;

        if (!this.checkAnyForm(form)) {
            return false;
        }

        sendData = Helpers.extend(Helpers.serialize(form), {
            site: this.config.location,
            tid: window.tid,
        });
        sendData = this.checkFormDataArray(sendData);

        Helpers.JSONP(Requests('emailSubmit') + Helpers.objectToGet(sendData), {
            onLoad: function() {
                form.innerHTML = _this.trans.emailSuccess;
            },
            onError: function() {
                _this.sendLog({
                    action: 'Email submit',
                    message: 'Request error',
                    actionUrl: Requests('emailSubmit') + Helpers.objectToGet(sendData),
                });
            },
        });

        return false;
    };
    // Проверка полей формы
    Shakes.prototype.checkAnyForm = function(form) {
        for (var i = 0, l = form.length; i < l; i++) {
            var input = form[i];

            if (input.getAttribute('name') === 'phone') {
                if (Helpers.isPhone(input.value) === false) {
                    alert(this.trans.phoneError);
                    return false;
                }
            }
            if (input.getAttribute('name') === 'name') {
                if(Helpers.isName(input.value) === false) {
                    alert(this.trans.nameError);
                    return false;
                }
            }
            if (input.getAttribute('name') === 'email') {
                if (Helpers.isEmail(input.value) === false) {
                    alert(this.trans.emailError);
                    return false;
                }
            }
        }
        return true;
    };
    // Проверка на ключи с именем 'null'
    Shakes.prototype.checkFormDataArray = function(data) {
        // fix: null появляется в формах, где присутствует какой-то инпут без имени (обычно кнопка сабмита)
        if (typeof data['null'] !== 'undefined') {
            delete data['null'];
        }

        return data;
    };

    if (Helpers.getCookie('parking') == 1 || (Helpers.urlGET('ver') && Helpers.urlGET('ver') == 1)) {
        // Сценарий паркинга
        window.lShakes = new Shakes({
            domainType: 'parking',
        });
    } else {
        // Дефолтный сценарий
        window.lShakes = new Shakes({
            domainType: 'default',
            cookie_domain: 'sha'+'kesstream.com',
            cookie_domains: ['shak'+'eshakepoto'+'k.com', 'seka'+'hspot'+'ok.com', 'sha'+'kepo'+'tok.com', 'r.sha'+'kesstream.com', 'sha'+'kesstream.com', 'new'+'good'+'sshake.com', 'goods'+'shake.com', 'shak'+'esspot.com', 'shak'+'escash.com', 'shak'+'esclick.com', 'sha'+'kesin.com', 'shake'+'spoint.com'],
            comeBacker: {
                status: true,
            },
        });
    }

})(window);

function getTid() {
    var regex = new RegExp("[\\?\\&]tid\\=(\\d+)"),
        results = regex.exec(location.search);
    return results === null ? "" : '&tid=' + results[1];
}