// ==UserScript==
// @name         le-h5
// @namespace    https://github.com/gooyie/le-h5
// @homepageURL  https://github.com/gooyie/le-h5
// @supportURL   https://github.com/gooyie/le-h5/issues
// @updateURL    https://raw.githubusercontent.com/gooyie/le-h5/master/le-h5.user.js
// @version      0.1.0
// @description  letv html5 player
// @author       gooyie
// @license      MIT License
//
// @include      *://*.le.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    class Hooker {

        static hookCall(cb = ()=>{}) {

            const call = Function.prototype.call;
            Function.prototype.call = function(...args) {
                let ret = call.bind(this)(...args);
                if (args) cb(...args);
                return ret;
            };

            Function.prototype.call.toString = Function.prototype.call.toLocaleString = function() {
                return 'function call() { [native code] }';
            };

        }

        static _isFactoryCall(args) { // module.exports, module, module.exports, require
            return args.length === 4 && 'object' === typeof args[1] && args[1].hasOwnProperty('exports');
        }

        static hookFactoryCall(cb = ()=>{}) {
            this.hookCall((...args) => {if (this._isFactoryCall(args)) cb(...args);});
        }

        static _isH5adFactoryCall(exports = {}) {
            return 'function' === typeof exports && exports.prototype.hasOwnProperty('refreshAd');
        }

        static hookH5ad(cb = ()=>{}) {
            this.hookFactoryCall((...args) => {if (this._isH5adFactoryCall(args[1].exports)) cb(args[1]);});
        }

    }

    class Faker {

        static fakeMacSafari() {
            const UA_MAC_SAFARI = "macintosh safari";
            Object.defineProperty(navigator, 'userAgent', {get: () => UA_MAC_SAFARI});
        }

    }

    class Mocker {

        static mock() {
            Faker.fakeMacSafari();
            this.hackH5ad();
        }

        static hackH5ad() {
            Hooker.hookH5ad(module => module.exports = null);
        }

    }


    Mocker.mock();

})();
