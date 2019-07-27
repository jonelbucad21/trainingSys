(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["quonmanager-quonmanager-module"],{

/***/ "./node_modules/angular2-jwt/angular2-jwt.js":
/*!***************************************************!*\
  !*** ./node_modules/angular2-jwt/angular2-jwt.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var http_1 = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var core_1 = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var Observable_1 = __webpack_require__(/*! rxjs/Observable */ "./node_modules/rxjs/_esm5/Observable.js");
__webpack_require__(/*! rxjs/add/observable/fromPromise */ "./node_modules/rxjs/_esm5/add/observable/fromPromise.js");
__webpack_require__(/*! rxjs/add/observable/defer */ "./node_modules/rxjs/_esm5/add/observable/defer.js");
__webpack_require__(/*! rxjs/add/operator/mergeMap */ "./node_modules/rxjs/_esm5/add/operator/mergeMap.js");
var AuthConfigConsts = (function () {
    function AuthConfigConsts() {
    }
    return AuthConfigConsts;
}());
AuthConfigConsts.DEFAULT_TOKEN_NAME = 'token';
AuthConfigConsts.DEFAULT_HEADER_NAME = 'Authorization';
AuthConfigConsts.HEADER_PREFIX_BEARER = 'Bearer ';
exports.AuthConfigConsts = AuthConfigConsts;
var AuthConfigDefaults = {
    headerName: AuthConfigConsts.DEFAULT_HEADER_NAME,
    headerPrefix: null,
    tokenName: AuthConfigConsts.DEFAULT_TOKEN_NAME,
    tokenGetter: function () { return localStorage.getItem(AuthConfigDefaults.tokenName); },
    noJwtError: false,
    noClientCheck: false,
    globalHeaders: [],
    noTokenScheme: false
};
/**
 * Sets up the authentication configuration.
 */
var AuthConfig = (function () {
    function AuthConfig(config) {
        config = config || {};
        this._config = objectAssign({}, AuthConfigDefaults, config);
        if (this._config.headerPrefix) {
            this._config.headerPrefix += ' ';
        }
        else if (this._config.noTokenScheme) {
            this._config.headerPrefix = '';
        }
        else {
            this._config.headerPrefix = AuthConfigConsts.HEADER_PREFIX_BEARER;
        }
        if (config.tokenName && !config.tokenGetter) {
            this._config.tokenGetter = function () { return localStorage.getItem(config.tokenName); };
        }
    }
    AuthConfig.prototype.getConfig = function () {
        return this._config;
    };
    return AuthConfig;
}());
exports.AuthConfig = AuthConfig;
var AuthHttpError = (function (_super) {
    __extends(AuthHttpError, _super);
    function AuthHttpError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return AuthHttpError;
}(Error));
exports.AuthHttpError = AuthHttpError;
/**
 * Allows for explicit authenticated HTTP requests.
 */
var AuthHttp = (function () {
    function AuthHttp(options, http, defOpts) {
        var _this = this;
        this.http = http;
        this.defOpts = defOpts;
        this.config = options.getConfig();
        this.tokenStream = new Observable_1.Observable(function (obs) {
            obs.next(_this.config.tokenGetter());
        });
    }
    AuthHttp.prototype.mergeOptions = function (providedOpts, defaultOpts) {
        var newOptions = defaultOpts || new http_1.RequestOptions();
        if (this.config.globalHeaders) {
            this.setGlobalHeaders(this.config.globalHeaders, providedOpts);
        }
        newOptions = newOptions.merge(new http_1.RequestOptions(providedOpts));
        return newOptions;
    };
    AuthHttp.prototype.requestHelper = function (requestArgs, additionalOptions) {
        var options = new http_1.RequestOptions(requestArgs);
        if (additionalOptions) {
            options = options.merge(additionalOptions);
        }
        return this.request(new http_1.Request(this.mergeOptions(options, this.defOpts)));
    };
    AuthHttp.prototype.requestWithToken = function (req, token) {
        if (!this.config.noClientCheck && !tokenNotExpired(undefined, token)) {
            if (!this.config.noJwtError) {
                return new Observable_1.Observable(function (obs) {
                    obs.error(new AuthHttpError('No JWT present or has expired'));
                });
            }
        }
        else {
            req.headers.set(this.config.headerName, this.config.headerPrefix + token);
        }
        return this.http.request(req);
    };
    AuthHttp.prototype.setGlobalHeaders = function (headers, request) {
        if (!request.headers) {
            request.headers = new http_1.Headers();
        }
        headers.forEach(function (header) {
            var key = Object.keys(header)[0];
            var headerValue = header[key];
            request.headers.set(key, headerValue);
        });
    };
    AuthHttp.prototype.request = function (url, options) {
        var _this = this;
        if (typeof url === 'string') {
            return this.get(url, options); // Recursion: transform url from String to Request
        }
        // else if ( ! url instanceof Request ) {
        //   throw new Error('First argument must be a url string or Request instance.');
        // }
        // from this point url is always an instance of Request;
        var req = url;
        // Create a cold observable and load the token just in time
        return Observable_1.Observable.defer(function () {
            var token = _this.config.tokenGetter();
            if (token instanceof Promise) {
                return Observable_1.Observable.fromPromise(token).mergeMap(function (jwtToken) { return _this.requestWithToken(req, jwtToken); });
            }
            else {
                return _this.requestWithToken(req, token);
            }
        });
    };
    AuthHttp.prototype.get = function (url, options) {
        return this.requestHelper({ body: '', method: http_1.RequestMethod.Get, url: url }, options);
    };
    AuthHttp.prototype.post = function (url, body, options) {
        return this.requestHelper({ body: body, method: http_1.RequestMethod.Post, url: url }, options);
    };
    AuthHttp.prototype.put = function (url, body, options) {
        return this.requestHelper({ body: body, method: http_1.RequestMethod.Put, url: url }, options);
    };
    AuthHttp.prototype.delete = function (url, options) {
        return this.requestHelper({ body: '', method: http_1.RequestMethod.Delete, url: url }, options);
    };
    AuthHttp.prototype.patch = function (url, body, options) {
        return this.requestHelper({ body: body, method: http_1.RequestMethod.Patch, url: url }, options);
    };
    AuthHttp.prototype.head = function (url, options) {
        return this.requestHelper({ body: '', method: http_1.RequestMethod.Head, url: url }, options);
    };
    AuthHttp.prototype.options = function (url, options) {
        return this.requestHelper({ body: '', method: http_1.RequestMethod.Options, url: url }, options);
    };
    return AuthHttp;
}());
AuthHttp = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [AuthConfig, http_1.Http, http_1.RequestOptions])
], AuthHttp);
exports.AuthHttp = AuthHttp;
/**
 * Helper class to decode and find JWT expiration.
 */
var JwtHelper = (function () {
    function JwtHelper() {
    }
    JwtHelper.prototype.urlBase64Decode = function (str) {
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0: {
                break;
            }
            case 2: {
                output += '==';
                break;
            }
            case 3: {
                output += '=';
                break;
            }
            default: {
                throw 'Illegal base64url string!';
            }
        }
        return this.b64DecodeUnicode(output);
    };
    // credits for decoder goes to https://github.com/atk
    JwtHelper.prototype.b64decode = function (str) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var output = '';
        str = String(str).replace(/=+$/, '');
        if (str.length % 4 == 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }
        for (
        // initialize result and counters
        var bc = 0, bs = void 0, buffer = void 0, idx = 0;
        // get next character
        buffer = str.charAt(idx++);
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            // and if not first of each 4 characters,
            // convert the first 8 bits to one ascii character
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
            // try to find character in table (0-63, not found => -1)
            buffer = chars.indexOf(buffer);
        }
        return output;
    };
    // https://developer.mozilla.org/en/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    JwtHelper.prototype.b64DecodeUnicode = function (str) {
        return decodeURIComponent(Array.prototype.map.call(this.b64decode(str), function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    };
    JwtHelper.prototype.decodeToken = function (token) {
        var parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('JWT must have 3 parts');
        }
        var decoded = this.urlBase64Decode(parts[1]);
        if (!decoded) {
            throw new Error('Cannot decode the token');
        }
        return JSON.parse(decoded);
    };
    JwtHelper.prototype.getTokenExpirationDate = function (token) {
        var decoded;
        decoded = this.decodeToken(token);
        if (!decoded.hasOwnProperty('exp')) {
            return null;
        }
        var date = new Date(0); // The 0 here is the key, which sets the date to the epoch
        date.setUTCSeconds(decoded.exp);
        return date;
    };
    JwtHelper.prototype.isTokenExpired = function (token, offsetSeconds) {
        var date = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;
        if (date == null) {
            return false;
        }
        // Token expired?
        return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    };
    return JwtHelper;
}());
exports.JwtHelper = JwtHelper;
/**
 * Checks for presence of token and that token hasn't expired.
 * For use with the @CanActivate router decorator and NgIf
 */
function tokenNotExpired(tokenName, jwt) {
    if (tokenName === void 0) { tokenName = AuthConfigConsts.DEFAULT_TOKEN_NAME; }
    var token = jwt || localStorage.getItem(tokenName);
    var jwtHelper = new JwtHelper();
    return token != null && !jwtHelper.isTokenExpired(token);
}
exports.tokenNotExpired = tokenNotExpired;
exports.AUTH_PROVIDERS = [
    {
        provide: AuthHttp,
        deps: [http_1.Http, http_1.RequestOptions],
        useFactory: function (http, options) {
            return new AuthHttp(new AuthConfig(), http, options);
        }
    }
];
function provideAuth(config) {
    return [
        {
            provide: AuthHttp,
            deps: [http_1.Http, http_1.RequestOptions],
            useFactory: function (http, options) {
                return new AuthHttp(new AuthConfig(config), http, options);
            }
        }
    ];
}
exports.provideAuth = provideAuth;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;
function toObject(val) {
    if (val === null || val === undefined) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
    }
    return Object(val);
}
function objectAssign(target) {
    var source = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        source[_i - 1] = arguments[_i];
    }
    var from;
    var to = toObject(target);
    var symbols;
    for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);
        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                to[key] = from[key];
            }
        }
        if (Object.getOwnPropertySymbols) {
            symbols = Object.getOwnPropertySymbols(from);
            for (var i = 0; i < symbols.length; i++) {
                if (propIsEnumerable.call(from, symbols[i])) {
                    to[symbols[i]] = from[symbols[i]];
                }
            }
        }
    }
    return to;
}
/**
 * Module for angular2-jwt
 * @experimental
 */
var AuthModule = AuthModule_1 = (function () {
    function AuthModule(parentModule) {
        if (parentModule) {
            throw new Error('AuthModule is already loaded. Import it in the AppModule only');
        }
    }
    AuthModule.forRoot = function (config) {
        return {
            ngModule: AuthModule_1,
            providers: [
                { provide: AuthConfig, useValue: config }
            ]
        };
    };
    return AuthModule;
}());
AuthModule = AuthModule_1 = __decorate([
    core_1.NgModule({
        imports: [http_1.HttpModule],
        providers: [AuthHttp, JwtHelper]
    }),
    __param(0, core_1.Optional()), __param(0, core_1.SkipSelf()),
    __metadata("design:paramtypes", [AuthModule])
], AuthModule);
exports.AuthModule = AuthModule;
var AuthModule_1;
//# sourceMappingURL=angular2-jwt.js.map

/***/ }),

/***/ "./node_modules/rxjs/_esm5/add/observable/defer.js":
/*!*********************************************************!*\
  !*** ./node_modules/rxjs/_esm5/add/observable/defer.js ***!
  \*********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Observable */ "./node_modules/rxjs/_esm5/Observable.js");
/* harmony import */ var _observable_defer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../observable/defer */ "./node_modules/rxjs/_esm5/observable/defer.js");
/** PURE_IMPORTS_START .._.._Observable,.._.._observable_defer PURE_IMPORTS_END */


_Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"].defer = _observable_defer__WEBPACK_IMPORTED_MODULE_1__["defer"];
//# sourceMappingURL=defer.js.map


/***/ }),

/***/ "./node_modules/rxjs/_esm5/add/observable/fromPromise.js":
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/_esm5/add/observable/fromPromise.js ***!
  \***************************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Observable */ "./node_modules/rxjs/_esm5/Observable.js");
/* harmony import */ var _observable_fromPromise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../observable/fromPromise */ "./node_modules/rxjs/_esm5/observable/fromPromise.js");
/** PURE_IMPORTS_START .._.._Observable,.._.._observable_fromPromise PURE_IMPORTS_END */


_Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"].fromPromise = _observable_fromPromise__WEBPACK_IMPORTED_MODULE_1__["fromPromise"];
//# sourceMappingURL=fromPromise.js.map


/***/ }),

/***/ "./node_modules/rxjs/_esm5/add/operator/mergeMap.js":
/*!**********************************************************!*\
  !*** ./node_modules/rxjs/_esm5/add/operator/mergeMap.js ***!
  \**********************************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../Observable */ "./node_modules/rxjs/_esm5/Observable.js");
/* harmony import */ var _operator_mergeMap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../operator/mergeMap */ "./node_modules/rxjs/_esm5/operator/mergeMap.js");
/** PURE_IMPORTS_START .._.._Observable,.._.._operator_mergeMap PURE_IMPORTS_END */


_Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"].prototype.mergeMap = _operator_mergeMap__WEBPACK_IMPORTED_MODULE_1__["mergeMap"];
_Observable__WEBPACK_IMPORTED_MODULE_0__["Observable"].prototype.flatMap = _operator_mergeMap__WEBPACK_IMPORTED_MODULE_1__["mergeMap"];
//# sourceMappingURL=mergeMap.js.map


/***/ }),

/***/ "./src/app/quonmanager/components/adviser-form/adviser-form.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/adviser-form/adviser-form.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  adviser-form works!\n</p>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/adviser-form/adviser-form.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/adviser-form/adviser-form.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/adviser-form/adviser-form.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/quonmanager/components/adviser-form/adviser-form.component.ts ***!
  \*******************************************************************************/
/*! exports provided: AdviserFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdviserFormComponent", function() { return AdviserFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdviserFormComponent = (function () {
    function AdviserFormComponent() {
    }
    AdviserFormComponent.prototype.ngOnInit = function () {
    };
    AdviserFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-adviser-form',
            template: __webpack_require__(/*! ./adviser-form.component.html */ "./src/app/quonmanager/components/adviser-form/adviser-form.component.html"),
            styles: [__webpack_require__(/*! ./adviser-form.component.scss */ "./src/app/quonmanager/components/adviser-form/adviser-form.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], AdviserFormComponent);
    return AdviserFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/adviser-list/adviser-list.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/adviser-list/adviser-list.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  adviser-list works!\n</p>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/adviser-list/adviser-list.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/adviser-list/adviser-list.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/adviser-list/adviser-list.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/quonmanager/components/adviser-list/adviser-list.component.ts ***!
  \*******************************************************************************/
/*! exports provided: AdviserListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdviserListComponent", function() { return AdviserListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AdviserListComponent = (function () {
    function AdviserListComponent() {
    }
    AdviserListComponent.prototype.ngOnInit = function () {
    };
    AdviserListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-adviser-list',
            template: __webpack_require__(/*! ./adviser-list.component.html */ "./src/app/quonmanager/components/adviser-list/adviser-list.component.html"),
            styles: [__webpack_require__(/*! ./adviser-list.component.scss */ "./src/app/quonmanager/components/adviser-list/adviser-list.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], AdviserListComponent);
    return AdviserListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/dashboard/dashboard.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/quonmanager/components/dashboard/dashboard.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h5 class=\"material\">School ID : {{ authService.decodedToken.SchoolId }}</h5>\n<h5 class=\"material\">Employee Number : {{ authService.decodedToken.EmployeeNumber }}</h5>\n<h5 class=\"material\">Name : {{ authService.decodedToken.given_name }}</h5>\n<h5 class=\"material\">Position : {{ authService.decodedToken.Position }}</h5>\n<h5 class=\"material\">Station : {{ authService.decodedToken.Station }}</h5>"

/***/ }),

/***/ "./src/app/quonmanager/components/dashboard/dashboard.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/quonmanager/components/dashboard/dashboard.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".material {\n  font-family: cursive; }\n\n.material h1, h2, h3, h4, h5 {\n  font-family: cursive; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/dashboard/dashboard.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/quonmanager/components/dashboard/dashboard.component.ts ***!
  \*************************************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/auth.service */ "./src/app/quonmanager/services/auth.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DashboardComponent = (function () {
    function DashboardComponent(authService) {
        this.authService = authService;
    }
    DashboardComponent.prototype.ngOnInit = function () {
    };
    DashboardComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/quonmanager/components/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.scss */ "./src/app/quonmanager/components/dashboard/dashboard.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_auth_service__WEBPACK_IMPORTED_MODULE_0__["AuthService"]])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/employee-details/employee-details.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-details/employee-details.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n  <mat-card class=\"example-card\">\n    <mat-card-header>\n      <mat-card-title>{{ employee.employeeNumber }}</mat-card-title>\n      <mat-card-subtitle>{{ employee.person.title }} {{ employee.person.firstName }} {{ employee.person.middleName }} {{ employee.person.lastName }} {{ employee.person.suffixName }}</mat-card-subtitle>\n    </mat-card-header>\n\n    <mat-card-content>\n\n      <mat-tab-group>\n        <mat-tab label=\"Position History\"> <app-employee-position-details [positions]=\"employee.employeePositions\"></app-employee-position-details> </mat-tab>\n        <mat-tab label=\"Station History\"> <app-employee-station-details [stations]=\"employee.employeeStations\"></app-employee-station-details> </mat-tab>\n      </mat-tab-group>\n\n    </mat-card-content>\n  </mat-card>\n</div>\n\n<ng-template>\n  <mat-spinner></mat-spinner>\n</ng-template>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/employee-details/employee-details.component.scss":
/*!*****************************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-details/employee-details.component.scss ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/employee-details/employee-details.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-details/employee-details.component.ts ***!
  \***************************************************************************************/
/*! exports provided: EmployeeDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmployeeDetailsComponent", function() { return EmployeeDetailsComponent; });
/* harmony import */ var _services_employee_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/employee.service */ "./src/app/quonmanager/services/employee.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var EmployeeDetailsComponent = (function () {
    function EmployeeDetailsComponent(route, employeeService) {
        var _this = this;
        this.route = route;
        this.employeeService = employeeService;
        this.route.params.subscribe(function (params) { return _this.id = params['id']; });
    }
    EmployeeDetailsComponent.prototype.ngOnInit = function () {
        this.loadRecord();
    };
    EmployeeDetailsComponent.prototype.loadRecord = function () {
        var _this = this;
        this.employeeService.getById(this.id)
            .subscribe(function (response) {
            _this.employee = response.json();
        });
    };
    EmployeeDetailsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-employee-details',
            template: __webpack_require__(/*! ./employee-details.component.html */ "./src/app/quonmanager/components/employee-details/employee-details.component.html"),
            styles: [__webpack_require__(/*! ./employee-details.component.scss */ "./src/app/quonmanager/components/employee-details/employee-details.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], _services_employee_service__WEBPACK_IMPORTED_MODULE_0__["EmployeeService"]])
    ], EmployeeDetailsComponent);
    return EmployeeDetailsComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/employee-form/employee-form.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-form/employee-form.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"stations else loading\">\n\n  <mat-toolbar color=\"primary\">\n    <mat-icon style=\"padding-right:15em\">group_add</mat-icon>\n    New Employee\n  </mat-toolbar>\n\n  <br>\n  <br>\n\n  <form [formGroup]=\"empFormGroup\">\n    <mat-dialog-content>\n      <div class=\"example-container\">\n        <mat-form-field hintLabel=\"7 digits\">\n          <input matInput placeholder=\"Employee Number\" formControlName=\"employeeNumber\" required maxlength=\"7\" minlength=\"7\" pattern=\"[0-9]+\">\n          <mat-error *ngIf=\"empFormGroup.get('employeeNumber').invalid\">{{getErrorMessage('employeeNumber')}}</mat-error>\n          <mat-hint align=\"end\">{{empFormGroup.get('employeeNumber').value?.length || 0}}/7</mat-hint>\n        </mat-form-field>\n\n        <br>\n        <mat-divider></mat-divider>\n        <br>\n\n        <mat-accordion>\n          <mat-expansion-panel [expanded]=\"panelOpenState\">\n            <mat-expansion-panel-header>\n              <mat-panel-title>\n                Basic Information\n              </mat-panel-title>\n              <mat-panel-description>\n                Enter Basic Information\n              </mat-panel-description>\n            </mat-expansion-panel-header>\n\n            <div class=\"example-container\" formGroupName=\"person\">\n              <mat-form-field>\n                <input matInput placeholder=\"title\">\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Minimum 3 characters\">\n                <input matInput placeholder=\"First Name\" formControlName=\"firstName\" required minlength=\"3\" pattern=\"[a-zA-Z][a-zA-Z ]+\">\n                <mat-error *ngIf=\"empFormGroup.get('person.firstName').invalid\">{{getErrorMessage('person.firstName')}}</mat-error>\n                <mat-hint align=\"end\">{{empFormGroup.get('person.firstName').value?.length || 0}}/3</mat-hint>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Minimum 3 characters\">\n                <input matInput placeholder=\"Middle Name\" formControlName=\"middleName\" required minlength=\"3\" pattern=\"[a-zA-Z][a-zA-Z ]+\">\n                <mat-error *ngIf=\"empFormGroup.get('person.middleName').invalid\">{{getErrorMessage('person.middleName')}}</mat-error>\n                <mat-hint align=\"end\">{{empFormGroup.get('person.middleName').value?.length || 0}}/3</mat-hint>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Minimum 3 characters\">\n                <input matInput placeholder=\"Last Name\" formControlName=\"lastName\" required minlength=\"3\" pattern=\"[a-zA-Z][a-zA-Z ]+\">\n                <mat-error *ngIf=\"empFormGroup.get('person.lastName').invalid\">{{getErrorMessage('person.lastName')}}</mat-error>\n                <mat-hint align=\"end\">{{empFormGroup.get('person.lastName').value?.length || 0}}/3</mat-hint>\n              </mat-form-field>\n\n              <mat-form-field>\n                <input matInput placeholder=\"Suffix\" formControlName=\"suffixName\">\n              </mat-form-field>\n\n              <mat-form-field>\n                <input matInput [matDatepicker]=\"birthdate\" placeholder=\"Birth Date\" formControlName=\"birthDate\" required>\n                <mat-datepicker-toggle matSuffix [for]=\"birthdate\"></mat-datepicker-toggle>\n                <mat-datepicker #birthdate></mat-datepicker>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Minimum 5 characters\">\n                <input matInput placeholder=\"Place of Birth\" formControlName=\"placeOfBirth\" required minlength=\"5\" pattern=\"[a-zA-Z][a-zA-Z ]+\">\n                <mat-error *ngIf=\"empFormGroup.get('person.placeOfBirth').invalid\">{{getErrorMessage('person.placeOfBirth')}}</mat-error>\n                <mat-hint align=\"end\">{{empFormGroup.get('person.placeOfBirth').value?.length || 0}}/3</mat-hint>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Select Gender\">\n                <mat-select placeholder=\"Gender\" formControlName=\"genderId\" required>\n                  <mat-option *ngFor=\"let gender of genders\" [value]=\"gender.id\">{{gender.name}}</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Select Civil Status\">\n                <mat-select placeholder=\"Civil Status\" formControlName=\"civilStatusId\" required>\n                  <mat-option *ngFor=\"let civilstatus of civilStatuses\" [value]=\"civilstatus.id\">{{civilstatus.name}}</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Select CitizenShip\">\n                <mat-select placeholder=\"CitizenShip\" formControlName=\"citizenShipId\" required>\n                  <mat-option *ngFor=\"let citizenShip of citizenShips\" [value]=\"citizenShip.id\">{{citizenShip.name}}</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Select Mother Tongue\">\n                <mat-select placeholder=\"Mother Tongue\" formControlName=\"motherTongueId\" required>\n                  <mat-option *ngFor=\"let motherTongues of motherTongues\" [value]=\"motherTongues.id\">{{motherTongues.name}}</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              \n              <mat-form-field hintLabel=\"digits\">\n                <input matInput placeholder=\"Height in centimeter\" formControlName=\"height\" maxlength=\"3\" minlength=\"2\" pattern=\"[0-9]+\">\n                <mat-error *ngIf=\"empFormGroup.get('person.height').invalid\">{{getErrorMessage('person.height')}}</mat-error>\n                <mat-hint align=\"end\">{{empFormGroup.get('person.height').value?.length || 0}}/3</mat-hint>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"digits\">\n                <input matInput placeholder=\"Weight in Kilogram\" formControlName=\"weight\" maxlength=\"3\" minlength=\"2\" pattern=\"[0-9]+\">\n                <mat-error *ngIf=\"empFormGroup.get('person.weight').invalid\">{{getErrorMessage('person.weight')}}</mat-error>\n                <mat-hint align=\"end\">{{empFormGroup.get('person.weight').value?.length || 0}}/3</mat-hint>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Select Blood Type\">\n                <mat-select placeholder=\"Blood Type\" formControlName=\"bloodTypeId\" required>\n                  <mat-option *ngFor=\"let bloodType of bloodTypes\" [value]=\"bloodType.id\">{{bloodType.name}}</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field hintLabel=\"Select Religion\">\n                <mat-select placeholder=\"Religion\" formControlName=\"religionId\" required>\n                  <mat-option *ngFor=\"let religion of religions\" [value]=\"religion.id\">{{religion.name}}</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n            \n            </div>\n\n          </mat-expansion-panel>\n\n        </mat-accordion>\n      </div>\n\n      <br>\n      <mat-divider></mat-divider>\n      <br>\n\n      <mat-accordion>\n        <mat-expansion-panel [expanded]=\"panelOpenState\">\n          <mat-expansion-panel-header>\n            <mat-panel-title>\n              Employee Position\n            </mat-panel-title>\n            <mat-panel-description>\n              Enter Position\n            </mat-panel-description>\n          </mat-expansion-panel-header>\n          <br> \n          <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!employeePositions.valid\" (click)=\"addPosition()\">New Position</button>\n          <br><br>\n          <div class=\"example-container\" formArrayName=\"employeePositions\"\n            *ngFor=\"let position of empFormGroup.get('employeePositions').controls; let i=index;\">\n            \n            <div class=\"example-container\" [formGroupName]=\"i\">\n              <mat-form-field hintLabel=\"Select Position\">\n                <mat-select placeholder=\"Position\" formControlName=\"positionId\" required>\n                  <mat-option *ngFor=\"let position of positions\" [value]=\"position.id\">{{position.name}}</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field>\n                <input matInput [matDatepicker]=\"positionstartdate\" placeholder=\"Start Date\" formControlName=\"startDate\" required>\n                <mat-datepicker-toggle matSuffix [for]=\"positionstartdate\"></mat-datepicker-toggle>\n                <mat-datepicker #positionstartdate></mat-datepicker>\n              </mat-form-field>\n\n              <mat-form-field>\n                <input matInput [matDatepicker]=\"positionenddate\" placeholder=\"End Date\" formControlName=\"endDate\" required>\n                <mat-datepicker-toggle matSuffix [for]=\"positionenddate\" ></mat-datepicker-toggle>\n                <mat-datepicker #positionenddate></mat-datepicker>\n              </mat-form-field>\n              <br>\n              <mat-divider></mat-divider>\n              <a mat-button [disabled]=\"!employeePositions.valid\" (click)=\"deletePosition(i)\"> <mat-icon color=\"warn\">delete </mat-icon>Delete Position</a>\n              <mat-divider></mat-divider>\n              <br>\n            </div>\n          </div>\n\n        </mat-expansion-panel>\n\n      </mat-accordion>\n\n      <br>\n      <mat-divider></mat-divider>\n      <br>\n\n      <mat-accordion>\n        <mat-expansion-panel [expanded]=\"panelOpenState\">\n          <mat-expansion-panel-header>\n            <mat-panel-title>\n              Employee Station\n            </mat-panel-title>\n            <mat-panel-description>\n              Enter Station\n            </mat-panel-description>\n          </mat-expansion-panel-header>\n          <br> \n          <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!employeeStations.valid\" (click)=\"addStation()\">New Station</button>\n          <br><br>\n          <div class=\"example-container\" formArrayName=\"employeeStations\" \n            *ngFor=\"let station of empFormGroup.get('employeeStations').controls; let i = index;\">\n            <div class=\"example-container\" [formGroupName]=\"i\">\n                \n              <mat-form-field hintLabel=\"Select Station\">\n                <mat-select placeholder=\"Station\" formControlName=\"stationId\" required>\n                  <mat-option *ngFor=\"let station of stations\" [value]=\"station.id\">{{station.name}}</mat-option>\n                </mat-select>\n              </mat-form-field>\n\n              <mat-form-field>\n                <input matInput [matDatepicker]=\"Stationstartdate\" placeholder=\"Start Date\" formControlName=\"startDate\" required>\n                <mat-datepicker-toggle matSuffix [for]=\"Stationstartdate\"></mat-datepicker-toggle>\n                <mat-datepicker #Stationstartdate></mat-datepicker>\n              </mat-form-field>\n\n              <mat-form-field>\n                <input matInput [matDatepicker]=\"Stationenddate\" placeholder=\"End Date\" formControlName=\"endDate\" required>\n                <mat-datepicker-toggle matSuffix [for]=\"Stationenddate\"></mat-datepicker-toggle>\n                <mat-datepicker #Stationenddate></mat-datepicker>\n              </mat-form-field>\n              <br>\n              <mat-divider></mat-divider>\n              <a mat-button [disabled]=\"!employeeStations.valid\" (click)=\"deleteStation()\"> <mat-icon color=\"warn\">delete </mat-icon>Delete Station </a>\n              <mat-divider></mat-divider>\n              <br>\n            </div>\n          </div>\n        \n        </mat-expansion-panel>\n\n      </mat-accordion>\n\n      <br>\n      <mat-divider></mat-divider>\n      <br>\n\n    </mat-dialog-content>\n  </form>\n\n  <mat-dialog-actions>\n    <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!empFormGroup.valid\" (click)=\"create()\">\n      <mat-icon>save</mat-icon> Save\n    </button>\n    <button mat-raised-button color=\"primary\" (click)=\"redirectToList()\">\n      <mat-icon>cancel</mat-icon> Cancel\n    </button>\n  </mat-dialog-actions>\n</div>\n\n<ng-template #loading>\n  <mat-spinner style=\"margin:0 auto;\" mode=\"indeterminate\"></mat-spinner>\n</ng-template>"

/***/ }),

/***/ "./src/app/quonmanager/components/employee-form/employee-form.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-form/employee-form.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column; }\n\n.example-container > * {\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/employee-form/employee-form.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-form/employee-form.component.ts ***!
  \*********************************************************************************/
/*! exports provided: EmployeeFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmployeeFormComponent", function() { return EmployeeFormComponent; });
/* harmony import */ var _services_religion_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/religion.service */ "./src/app/quonmanager/services/religion.service.ts");
/* harmony import */ var _services_gender_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../services/gender.service */ "./src/app/quonmanager/services/gender.service.ts");
/* harmony import */ var _services_bloodtype_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../services/bloodtype.service */ "./src/app/quonmanager/services/bloodtype.service.ts");
/* harmony import */ var _services_mothertongue_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/mothertongue.service */ "./src/app/quonmanager/services/mothertongue.service.ts");
/* harmony import */ var _services_citizenship_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../services/citizenship.service */ "./src/app/quonmanager/services/citizenship.service.ts");
/* harmony import */ var _services_civilstatus_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../services/civilstatus.service */ "./src/app/quonmanager/services/civilstatus.service.ts");
/* harmony import */ var _common_bad_request_error__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../../common/bad-request-error */ "./src/app/common/bad-request-error.ts");
/* harmony import */ var _services_employee_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../services/employee.service */ "./src/app/quonmanager/services/employee.service.ts");
/* harmony import */ var _services_position_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./../../services/position.service */ "./src/app/quonmanager/services/position.service.ts");
/* harmony import */ var _services_station_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./../../services/station.service */ "./src/app/quonmanager/services/station.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _models_employee__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../models/employee */ "./src/app/quonmanager/models/employee.ts");
/* harmony import */ var _models_person__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../models/person */ "./src/app/quonmanager/models/person.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

















var EmployeeFormComponent = (function () {
    function EmployeeFormComponent(fb, positionService, stationService, genderService, civilStatusService, citizenShipService, motherTongueService, bloodTypeService, religionService, employeeService, snackBar, router, route) {
        var _this = this;
        this.fb = fb;
        this.positionService = positionService;
        this.stationService = stationService;
        this.genderService = genderService;
        this.civilStatusService = civilStatusService;
        this.citizenShipService = citizenShipService;
        this.motherTongueService = motherTongueService;
        this.bloodTypeService = bloodTypeService;
        this.religionService = religionService;
        this.employeeService = employeeService;
        this.snackBar = snackBar;
        this.router = router;
        this.route = route;
        this.panelOpenState = true;
        this.route.params.subscribe(function (params) { return _this.id = params['id']; });
    }
    Object.defineProperty(EmployeeFormComponent.prototype, "employeeStations", {
        get: function () {
            return this.empFormGroup.get('employeeStations');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EmployeeFormComponent.prototype, "employeePositions", {
        get: function () {
            return this.empFormGroup.get('employeePositions');
        },
        enumerable: true,
        configurable: true
    });
    EmployeeFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createEmployeeFormGroup();
        this.populatePositions();
        this.populateStations();
        this.populateGenders();
        this.populateCitizenShips();
        this.populateCivilStatuses();
        this.populateMotherBloodTypes();
        this.populateMotherTongues();
        this.populateReligions();
        if (this.id != null) {
            this.employeeService.getById(this.id)
                .subscribe(function (response) {
                _this.employee = response.json();
                _this.populateForm();
            }, function (error) {
                if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__["NoConnectionError"]) {
                    _this.snackBar.open('Loading Failed', 'No Connection', {
                        duration: 2000,
                    });
                }
            });
        }
    };
    EmployeeFormComponent.prototype.createEmployeeFormGroup = function () {
        this.employee = new _models_employee__WEBPACK_IMPORTED_MODULE_14__["Employee"]();
        this.employee.person = new _models_person__WEBPACK_IMPORTED_MODULE_15__["Person"]();
        this.empFormGroup = this.fb.group({
            id: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.id),
            employeeNumber: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.employeeNumber, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].maxLength(7), _angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].minLength(7)]),
            personId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.personId),
            person: this.fb.group({
                id: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.id),
                title: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.title),
                firstName: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.firstName, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].minLength(3)]),
                middleName: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.middleName, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].minLength(3)]),
                lastName: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.lastName, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].minLength(3)]),
                suffixName: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.suffixName),
                birthDate: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.birthDate, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                placeOfBirth: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.placeOfBirth, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                genderId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.genderId, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                civilStatusId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.civilStatusId, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                citizenShipId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.citizenShipId, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                motherTongueId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.motherTongueId, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                bloodTypeId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.bloodTypeId, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                religionId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.religionId, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                height: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.height, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                weight: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.person.weight, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
                personAddresses: this.fb.array([this.createPersonAddress()])
            }),
            employeeStations: this.fb.array([this.createStation()]),
            employeePositions: this.fb.array([this.createPosition()])
        });
    };
    // create and initialize a position {FormGroup}
    EmployeeFormComponent.prototype.createPosition = function () {
        return this.fb.group({
            id: 0,
            employeeId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.id),
            positionId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
            startDate: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
            endDate: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required])
        });
    };
    // create and initialize a station {FormGroup}
    EmployeeFormComponent.prototype.createStation = function () {
        return this.fb.group({
            id: 0,
            employeeId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"](this.employee.id),
            stationId: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
            startDate: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required]),
            endDate: new _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["Validators"].required])
        });
    };
    // create and initialize a personAddress {FormGroup}
    EmployeeFormComponent.prototype.createPersonAddress = function () {
        return this.fb.group({
            id: 0,
        });
    };
    // push the created formGroup to {employeeStations} FormArray
    EmployeeFormComponent.prototype.addStation = function () {
        this.employeeStations.push(this.createStation());
    };
    // push the created formGroup to {employeePositions} FormArray
    EmployeeFormComponent.prototype.addPosition = function () {
        this.employeePositions.push(this.createPosition());
    };
    // pop the create formGroup
    EmployeeFormComponent.prototype.deleteStation = function (index) {
        this.employeeStations.removeAt(index);
    };
    // pop the create formGroup
    EmployeeFormComponent.prototype.deletePosition = function (index) {
        this.employeePositions.removeAt(index);
    };
    EmployeeFormComponent.prototype.populatePositions = function () {
        var _this = this;
        this.positionService.getAll()
            .subscribe(function (response) {
            _this.positions = response.json().positions;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    EmployeeFormComponent.prototype.populateStations = function () {
        var _this = this;
        this.stationService.getAll()
            .subscribe(function (response) {
            _this.stations = response.json().stations;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    EmployeeFormComponent.prototype.populateGenders = function () {
        var _this = this;
        this.genderService.getAll()
            .subscribe(function (response) {
            _this.genders = response.json().genders;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    EmployeeFormComponent.prototype.populateCivilStatuses = function () {
        var _this = this;
        this.civilStatusService.getAll()
            .subscribe(function (response) {
            _this.civilStatuses = response.json().civilStatuses;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    EmployeeFormComponent.prototype.populateCitizenShips = function () {
        var _this = this;
        this.citizenShipService.getAll()
            .subscribe(function (response) {
            _this.citizenShips = response.json().citizenShips;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    EmployeeFormComponent.prototype.populateMotherTongues = function () {
        var _this = this;
        this.motherTongueService.getAll()
            .subscribe(function (response) {
            _this.motherTongues = response.json().motherTongues;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    EmployeeFormComponent.prototype.populateMotherBloodTypes = function () {
        var _this = this;
        this.bloodTypeService.getAll()
            .subscribe(function (response) {
            _this.bloodTypes = response.json().bloodTypes;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    EmployeeFormComponent.prototype.populateReligions = function () {
        var _this = this;
        this.religionService.getAll()
            .subscribe(function (response) {
            _this.religions = response.json().religions;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_13__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    // populate form when the id param has value
    EmployeeFormComponent.prototype.populateForm = function () {
        var _this = this;
        this.empFormGroup.patchValue({
            id: this.employee.id,
            employeeNumber: this.employee.employeeNumber,
            personId: this.employee.personId,
            person: this.employee.person,
        });
        // remove first the one that is initialize when building the formGroup
        this.employeePositions.removeAt(0);
        // loop through values of the employeePositions
        // push the value of [employee.EmployeePositions] to {employeePositions} FormArray
        this.employee.employeePositions.forEach(function (element) {
            var empPosition = _this.createPosition();
            empPosition.patchValue(element);
            _this.employeePositions.push(empPosition);
        });
        // remove first the one that is initialize when building the formGroup
        this.employeeStations.removeAt(0);
        // loop through values of the employeeStations
        // push the value of [employee.EmployeeStations] to {employeeStations} FormArray
        this.employee.employeeStations.forEach(function (element) {
            var empStation = _this.createStation();
            empStation.patchValue(element);
            _this.employeeStations.push(empStation);
        });
    };
    // creating and updating form values
    EmployeeFormComponent.prototype.create = function () {
        var _this = this;
        // convert all date inputs | bug in matDatePicker
        this.convertDateInputs();
        // check the employee.id if has value if it is for creating or updating
        if (this.employee.id == null) {
            // disable ids that are unneccessary
            this.disableIdsinForm();
            this.employeeService.create(this.empFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'Employee Created', {
                    duration: 2000,
                });
                _this.redirectToList();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_6__["BadRequestError"]) {
                    _this.empFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Employee not Created', {
                        duration: 2000,
                    });
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Employee not Created', {
                        duration: 2000,
                    });
                }
            });
        }
        else {
            this.employeeService.update(this.empFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'Employee Updated', {
                    duration: 2000,
                });
                _this.redirectToList();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_6__["BadRequestError"]) {
                    _this.empFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Employee not Updated', {
                        duration: 2000,
                    });
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Employee not Updated', {
                        duration: 2000,
                    });
                }
            });
        }
    };
    // matDatapicker bug solution
    EmployeeFormComponent.prototype.convertDateInputs = function () {
        for (var index = 0; index < this.employeePositions.length; index++) {
            var startDate = new Date(this.employeePositions.at(index).get('startDate').value);
            var endDate = new Date(this.employeePositions.at(index).get('endDate').value);
            // startDate
            var convertedStartDate = this.convertDate(startDate);
            this.employeePositions.at(index).get('startDate').setValue(convertedStartDate);
            // endDate
            var convertedEndDate = this.convertDate(endDate);
            this.employeePositions.at(index).get('endDate').setValue(convertedEndDate);
        }
        for (var index = 0; index < this.employeeStations.length; index++) {
            var startDate = new Date(this.employeeStations.at(index).get('startDate').value);
            var endDate = new Date(this.employeeStations.at(index).get('endDate').value);
            // startDate
            var convertedStartDate = this.convertDate(startDate);
            this.employeeStations.at(index).get('startDate').setValue(convertedStartDate);
            // endDate
            var convertedEndDate = this.convertDate(endDate);
            this.employeeStations.at(index).get('endDate').setValue(convertedEndDate);
        }
    };
    // convert date to current date
    EmployeeFormComponent.prototype.convertDate = function (dateToConvert) {
        var convertedDate = dateToConvert.setMinutes((dateToConvert.getTimezoneOffset() * -1));
        return new Date(convertedDate);
    };
    // disable ids in form for creating
    EmployeeFormComponent.prototype.disableIdsinForm = function () {
        this.empFormGroup.get('id').disable();
        this.empFormGroup.get('personId').disable();
        this.empFormGroup.get('person.id').disable();
        // loop and disable the ids in employeePositions
        for (var index = 0; index < this.employeePositions.length; index++) {
            this.employeePositions.at(index).get('id').disable();
            this.employeePositions.at(index).get('employeeId').disable();
        }
        // loop and disable the ids in employeeStations
        for (var index = 0; index < this.employeeStations.length; index++) {
            this.employeeStations.at(index).get('id').disable();
            this.employeeStations.at(index).get('employeeId').disable();
        }
    };
    // back to employee-list
    EmployeeFormComponent.prototype.redirectToList = function () {
        this.router.navigate(['/quonmanager/employee-list']);
    };
    // form error
    EmployeeFormComponent.prototype.getErrorMessage = function (controlName) {
        if (controlName === 'employeeNumber') {
            return this.empFormGroup.get(controlName).hasError('minlength') ? 'You must enter 7 digits' :
                this.empFormGroup.get(controlName).hasError('pattern') ? 'You must enter digits only' : '';
        }
        else {
            return this.empFormGroup.get(controlName).hasError('required') ? 'You must enter a value' :
                this.empFormGroup.get(controlName).hasError('minlength') ? 'You must enter atleast 3 characters' :
                    this.empFormGroup.get(controlName).hasError('pattern') ? 'You must enter alphabet characters only' :
                        '';
        }
    };
    EmployeeFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_10__["Component"])({
            selector: 'app-employee-form',
            template: __webpack_require__(/*! ./employee-form.component.html */ "./src/app/quonmanager/components/employee-form/employee-form.component.html"),
            styles: [__webpack_require__(/*! ./employee-form.component.scss */ "./src/app/quonmanager/components/employee-form/employee-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormBuilder"],
            _services_position_service__WEBPACK_IMPORTED_MODULE_8__["PositionService"],
            _services_station_service__WEBPACK_IMPORTED_MODULE_9__["StationService"],
            _services_gender_service__WEBPACK_IMPORTED_MODULE_1__["GenderService"],
            _services_civilstatus_service__WEBPACK_IMPORTED_MODULE_5__["CivilStatusService"],
            _services_citizenship_service__WEBPACK_IMPORTED_MODULE_4__["CitizenShipService"],
            _services_mothertongue_service__WEBPACK_IMPORTED_MODULE_3__["MotherTongueService"],
            _services_bloodtype_service__WEBPACK_IMPORTED_MODULE_2__["BloodTypeService"],
            _services_religion_service__WEBPACK_IMPORTED_MODULE_0__["ReligionService"],
            _services_employee_service__WEBPACK_IMPORTED_MODULE_7__["EmployeeService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_12__["MatSnackBar"],
            _angular_router__WEBPACK_IMPORTED_MODULE_16__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_16__["ActivatedRoute"]])
    ], EmployeeFormComponent);
    return EmployeeFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/employee-list/employee-list.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-list/employee-list.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"material\">\n  <mat-card>\n    <div *ngIf=\"employees else loading\">\n      <button mat-raised-button color=\"primary\" [routerLink]=\"['/quonmanager/employee-form']\" class=\"material\">\n        Add Employee\n      </button>\n\n      <br>\n      <br>\n      <mat-divider></mat-divider>\n      <mat-accordion>\n        <mat-expansion-panel  class=\"example-container\" #matExpansionPanel>\n          <mat-expansion-panel-header>\n            <mat-panel-title>\n            </mat-panel-title>\n            <mat-panel-description style=\"font-family: cursive\">\n                Search Options\n              </mat-panel-description>\n          </mat-expansion-panel-header>\n          <div class=\"example-container material\">\n            <mat-form-field hintLabel=\"7 digits\" style=\"font-family: cursive\">\n              <input matInput placeholder=\"Employee Number\" [(ngModel)]=\"employeeQuery.employeeNumber\" style=\"font-family: cursive\">\n            </mat-form-field>\n            <mat-form-field hintLabel=\"Title\">\n              <input matInput placeholder=\"Title\" [(ngModel)]=\"employeeQuery.title\">\n            </mat-form-field>\n            <mat-form-field hintLabel=\"Minimum 3 characters\">\n              <input matInput placeholder=\"First Name\" [(ngModel)]=\"employeeQuery.firstName\">\n            </mat-form-field>\n            <mat-form-field hintLabel=\"Minimum 3 characters\">\n              <input matInput placeholder=\"Middle Name\" [(ngModel)]=\"employeeQuery.middleName\">\n            </mat-form-field>\n            <mat-form-field hintLabel=\"Minimum 3 characters\">\n              <input matInput placeholder=\"Last Name\" [(ngModel)]=\"employeeQuery.lastName\">\n            </mat-form-field>\n            <mat-form-field hintLabel=\"Minimum 3 characters\">\n              <input matInput placeholder=\"Suffix Name\" [(ngModel)]=\"employeeQuery.suffixName\">\n            </mat-form-field>\n          </div>\n          <br>\n          <mat-action-row>\n            <button mat-raised-button color=\"primary\" (click)=\"search(matExpansionPanel, paginator)\">Search</button>\n            <button mat-raised-button color=\"primary\" (click)=\"reset(matExpansionPanel, paginator)\">Reset</button>\n        </mat-action-row>\n        </mat-expansion-panel>\n      </mat-accordion>\n      <br>\n      <mat-divider></mat-divider>\n      <div class=\"material\">\n        <mat-table #table [dataSource]=\"dataSource\">\n          <!-- Name Column -->\n          <ng-container matColumnDef=\"EmployeeNumber\">\n            <mat-header-cell *matHeaderCellDef>ID </mat-header-cell>\n            <mat-cell *matCellDef=\"let employee\">\n              <a matLine [routerLink]=\"['/quonmanager/employee-details', employee.id]\">{{ employee.employeeNumber }} </a>\n            </mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"Name\">\n            <mat-header-cell *matHeaderCellDef class=\"material\">Name</mat-header-cell>\n            <mat-cell *matCellDef=\"let employee\" class=\"material\"> {{ employee.person.firstName }} {{ employee.person.middleName }} {{ employee.person.lastName }}</mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"Edit\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Edit </mat-header-cell>\n            <mat-cell *matCellDef=\"let employee\">\n                <a mat-button [routerLink]=\"['/quonmanager/employee-form', employee.id]\"><mat-icon color=\"primary\">edit</mat-icon> </a> \n            </mat-cell>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"Delete\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Delete </mat-header-cell>\n            <mat-cell *matCellDef=\"let employee\"> \n              <a mat-button (click)=\"DeleteEmployee(employee.id)\"> <mat-icon color=\"warn\">delete </mat-icon> </a>\n            </mat-cell>\n          </ng-container>\n\n          <mat-header-row *matHeaderRowDef=\"displayedColumns\" class=\"material\"></mat-header-row>\n          <mat-row *matRowDef=\"let row; columns: displayedColumns;\" class=\"material\"></mat-row>\n\n        </mat-table>\n\n        <mat-paginator #paginator [length]=\"employeeQuery.length\" [pageSize]=\"employeeQuery.pageSize\" [pageSizeOptions]=\"pageSizeOptions\" [pageIndex]=\"pageIndex\" (page)=\"pageEvent = $event; onPaginateChange($event)\"\n          class=\"material\">\n        </mat-paginator>\n\n      </div>\n\n    </div>\n\n    <ng-template #loading>\n      <mat-progress-spinner style=\"margin:0 auto;\" [mode]=\"behavior\"></mat-progress-spinner>\n    </ng-template>\n  </mat-card>\n</div>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/employee-list/employee-list.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-list/employee-list.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n  max-height: 500px;\n  min-width: 300px; }\n\n.mat-table {\n  overflow: auto;\n  max-height: 500px; }\n\n.mat-column-EmployeeNumber {\n  flex: 0 0 20%; }\n\n.mat-column-Name {\n  flex: 0 0 30%; }\n\n.mat-column-Delete {\n  flex: 0 0 25%; }\n\n.mat-column-Edit {\n  flex: 0 0 25%; }\n\n.material {\n  font-family: cursive; }\n\n.material mat-paginator {\n  font-style: italic; }\n\n.material mat-header-cell {\n  font-weight: bold;\n  font-size: medium;\n  color: #3F51B5; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/employee-list/employee-list.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-list/employee-list.component.ts ***!
  \*********************************************************************************/
/*! exports provided: EmployeeListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmployeeListComponent", function() { return EmployeeListComponent; });
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _services_employee_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/employee.service */ "./src/app/quonmanager/services/employee.service.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _models_EmployeeQuery__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../models/EmployeeQuery */ "./src/app/quonmanager/models/EmployeeQuery.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var EmployeeListComponent = (function () {
    function EmployeeListComponent(employeeService, dialog, snackBar) {
        this.employeeService = employeeService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        // filtering
        this.employeeQuery = new _models_EmployeeQuery__WEBPACK_IMPORTED_MODULE_4__["EmployeeQuery"]();
        // mat-datatable
        this.displayedColumns = ['EmployeeNumber', 'Name', 'Edit', 'Delete'];
        this.pageSizeOptions = [5, 10, 25, 50, 100];
        this.pageIndex = 0;
        this.pageSize = 5;
        // mat-spinner
        this.behavior = 'indeterminate';
    }
    EmployeeListComponent.prototype.ngOnInit = function () {
        this.employeeQuery.pageIndex = this.pageIndex + 1;
        this.employeeQuery.pageSize = this.pageSize;
        this.loadRecords(this.employeeQuery);
    };
    EmployeeListComponent.prototype.loadRecords = function (employeeQuery) {
        var _this = this;
        this.employeeService.all(employeeQuery)
            .subscribe(function (response) {
            _this.employees = response.json().employees;
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatTableDataSource"](_this.employees);
            _this.employeeQuery.length = response.json().count;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_3__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.behavior = 'determinate';
            }
        });
    };
    EmployeeListComponent.prototype.onPaginateChange = function ($event) {
        this.pageSize = this.pageEvent.pageSize;
        this.pageIndex = this.pageEvent.pageIndex;
        this.ngOnInit();
    };
    EmployeeListComponent.prototype.search = function (matExpansionPanel, paginator) {
        this.onFilterChange(matExpansionPanel, paginator);
    };
    EmployeeListComponent.prototype.reset = function (matExpansionPanel, paginator) {
        this.employeeQuery = new _models_EmployeeQuery__WEBPACK_IMPORTED_MODULE_4__["EmployeeQuery"]();
        this.onFilterChange(matExpansionPanel, paginator);
    };
    EmployeeListComponent.prototype.onFilterChange = function (matExpansionPanel, paginator) {
        matExpansionPanel.close();
        this.employeeQuery.pageIndex = 1;
        this.employeeQuery.pageSize = this.pageSize;
        this.loadRecords(this.employeeQuery);
        paginator.pageIndex = 0;
    };
    EmployeeListComponent.prototype.DeleteEmployee = function (id) {
        var _this = this;
        this.employeeService.delete(id)
            .subscribe(function (response) {
            _this.snackBar.open('Employee Deleted', 'Successful', {
                duration: 2000,
            });
            _this.ngOnInit();
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_3__["NoConnectionError"]) {
                _this.snackBar.open('Employee not Deleted', 'Failed', {
                    duration: 2000,
                });
            }
        });
    };
    EmployeeListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-main-content',
            template: __webpack_require__(/*! ./employee-list.component.html */ "./src/app/quonmanager/components/employee-list/employee-list.component.html"),
            styles: [__webpack_require__(/*! ./employee-list.component.scss */ "./src/app/quonmanager/components/employee-list/employee-list.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_employee_service__WEBPACK_IMPORTED_MODULE_2__["EmployeeService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatDialog"],
            _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatSnackBar"]])
    ], EmployeeListComponent);
    return EmployeeListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/employee-position-details/employee-position-details.component.html":
/*!***********************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-position-details/employee-position-details.component.html ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ul>\n  <li *ngFor=\"let position of positions\">\n    Position : {{ position.name }}\n    <br> \n    Appointment Date: {{ position.startDate | date }}\n  </li>\n</ul>"

/***/ }),

/***/ "./src/app/quonmanager/components/employee-position-details/employee-position-details.component.scss":
/*!***********************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-position-details/employee-position-details.component.scss ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/employee-position-details/employee-position-details.component.ts":
/*!*********************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-position-details/employee-position-details.component.ts ***!
  \*********************************************************************************************************/
/*! exports provided: EmployeePositionDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmployeePositionDetailsComponent", function() { return EmployeePositionDetailsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EmployeePositionDetailsComponent = (function () {
    function EmployeePositionDetailsComponent() {
    }
    EmployeePositionDetailsComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], EmployeePositionDetailsComponent.prototype, "positions", void 0);
    EmployeePositionDetailsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-employee-position-details',
            template: __webpack_require__(/*! ./employee-position-details.component.html */ "./src/app/quonmanager/components/employee-position-details/employee-position-details.component.html"),
            styles: [__webpack_require__(/*! ./employee-position-details.component.scss */ "./src/app/quonmanager/components/employee-position-details/employee-position-details.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], EmployeePositionDetailsComponent);
    return EmployeePositionDetailsComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/employee-station-details/employee-station-details.component.html":
/*!*********************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-station-details/employee-station-details.component.html ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ul>\n  <li *ngFor=\"let station of stations\">\n    Station : {{ station.name }}\n    <br>\n    Effective Date : {{ station.startDate }}\n  </li>\n</ul>"

/***/ }),

/***/ "./src/app/quonmanager/components/employee-station-details/employee-station-details.component.scss":
/*!*********************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-station-details/employee-station-details.component.scss ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/employee-station-details/employee-station-details.component.ts":
/*!*******************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/employee-station-details/employee-station-details.component.ts ***!
  \*******************************************************************************************************/
/*! exports provided: EmployeeStationDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmployeeStationDetailsComponent", function() { return EmployeeStationDetailsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EmployeeStationDetailsComponent = (function () {
    function EmployeeStationDetailsComponent() {
    }
    EmployeeStationDetailsComponent.prototype.ngOnInit = function () {
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"])(),
        __metadata("design:type", Array)
    ], EmployeeStationDetailsComponent.prototype, "stations", void 0);
    EmployeeStationDetailsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-employee-station-details',
            template: __webpack_require__(/*! ./employee-station-details.component.html */ "./src/app/quonmanager/components/employee-station-details/employee-station-details.component.html"),
            styles: [__webpack_require__(/*! ./employee-station-details.component.scss */ "./src/app/quonmanager/components/employee-station-details/employee-station-details.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], EmployeeStationDetailsComponent);
    return EmployeeStationDetailsComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/guidancecouncilor-form/guidancecouncilor-form.component.html":
/*!*****************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/guidancecouncilor-form/guidancecouncilor-form.component.html ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  guidancecouncilor-form works!\n</p>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/guidancecouncilor-form/guidancecouncilor-form.component.scss":
/*!*****************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/guidancecouncilor-form/guidancecouncilor-form.component.scss ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/guidancecouncilor-form/guidancecouncilor-form.component.ts":
/*!***************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/guidancecouncilor-form/guidancecouncilor-form.component.ts ***!
  \***************************************************************************************************/
/*! exports provided: GuidancecouncilorFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuidancecouncilorFormComponent", function() { return GuidancecouncilorFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var GuidancecouncilorFormComponent = (function () {
    function GuidancecouncilorFormComponent() {
    }
    GuidancecouncilorFormComponent.prototype.ngOnInit = function () {
    };
    GuidancecouncilorFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-guidancecouncilor-form',
            template: __webpack_require__(/*! ./guidancecouncilor-form.component.html */ "./src/app/quonmanager/components/guidancecouncilor-form/guidancecouncilor-form.component.html"),
            styles: [__webpack_require__(/*! ./guidancecouncilor-form.component.scss */ "./src/app/quonmanager/components/guidancecouncilor-form/guidancecouncilor-form.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], GuidancecouncilorFormComponent);
    return GuidancecouncilorFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/guidancecouncilor-list/guidancecouncilor-list.component.html":
/*!*****************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/guidancecouncilor-list/guidancecouncilor-list.component.html ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  guidancecouncilor-list works!\n</p>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/guidancecouncilor-list/guidancecouncilor-list.component.scss":
/*!*****************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/guidancecouncilor-list/guidancecouncilor-list.component.scss ***!
  \*****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/guidancecouncilor-list/guidancecouncilor-list.component.ts":
/*!***************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/guidancecouncilor-list/guidancecouncilor-list.component.ts ***!
  \***************************************************************************************************/
/*! exports provided: GuidancecouncilorListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GuidancecouncilorListComponent", function() { return GuidancecouncilorListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var GuidancecouncilorListComponent = (function () {
    function GuidancecouncilorListComponent() {
    }
    GuidancecouncilorListComponent.prototype.ngOnInit = function () {
    };
    GuidancecouncilorListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-guidancecouncilor-list',
            template: __webpack_require__(/*! ./guidancecouncilor-list.component.html */ "./src/app/quonmanager/components/guidancecouncilor-list/guidancecouncilor-list.component.html"),
            styles: [__webpack_require__(/*! ./guidancecouncilor-list.component.scss */ "./src/app/quonmanager/components/guidancecouncilor-list/guidancecouncilor-list.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], GuidancecouncilorListComponent);
    return GuidancecouncilorListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/levelsection-form/levelsection-form.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/quonmanager/components/levelsection-form/levelsection-form.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"advisers else loading\">\n  <mat-toolbar color=\"primary\">\n    <mat-icon style=\"padding-right:4em\">clear_all</mat-icon>New Section Assignment\n  </mat-toolbar>\n\n  <br>\n  <br>\n\n  <form [formGroup]=\"levelSectionFormGroup\">\n    <mat-dialog-content>\n      <div class=\"example-container\">\n        <!-- School Year-->\n        <mat-form-field hintLabel=\"Select School Year\">\n          <mat-select placeholder=\"School Year\" formControlName=\"schoolYear\" required>\n            <mat-option *ngFor=\"let schoolyear of schoolYears\" [value]=\"schoolyear\">{{ schoolyear }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n        <!-- Level -->\n        <mat-form-field hintLabel=\"Select Level\">\n          <mat-select placeholder=\"Level\" formControlName=\"levelId\" required>\n            <mat-option *ngFor=\"let level of levels\" [value]=\"level.id\">{{ level.name }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n        <!-- Section -->\n        <mat-form-field hintLabel=\"Select Section\">\n          <mat-select placeholder=\"Section\" formControlName=\"sectionId\" required>\n            <mat-option *ngFor=\"let section of sections\" [value]=\"section.id\">{{ section.name }}</mat-option>\n          </mat-select>\n        </mat-form-field>\n        <!-- AdviserId -->\n        <div class=\"example-container\" formGroupName=\"sectionAdviser\">\n          <mat-form-field hintLabel=\"Select Adviser\">\n            <mat-select placeholder=\"Adviser\" formControlName=\"adviserId\" required>\n              <mat-option *ngFor=\"let adviser of advisers\" [value]=\"adviser.id\">{{ adviser.employee.person.firstName }} {{ adviser.employee.person.lastName }}</mat-option>\n            </mat-select>\n          </mat-form-field>\n        </div>\n      </div>\n    </mat-dialog-content>\n    <br>\n    <br>\n    <mat-divider></mat-divider>\n    <br>\n  \n    <mat-dialog-actions>\n      <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!levelSectionFormGroup.valid\" (click)=\"create()\">\n        <mat-icon>save</mat-icon> Save\n      </button>\n      <button mat-raised-button color=\"primary\" (click)=\"close()\">\n        <mat-icon>cancel</mat-icon> Cancel\n      </button>      \n    </mat-dialog-actions>\n  </form>\n</div>\n\n<ng-template #loading>\n  <mat-spinner style=\"margin:0 auto;\" mode=\"indeterminate\"></mat-spinner>\n</ng-template>\n\n<p>{{ levelSectionFormGroup.value | json }}</p>"

/***/ }),

/***/ "./src/app/quonmanager/components/levelsection-form/levelsection-form.component.scss":
/*!*******************************************************************************************!*\
  !*** ./src/app/quonmanager/components/levelsection-form/levelsection-form.component.scss ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column; }\n\n.example-container > * {\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/levelsection-form/levelsection-form.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/quonmanager/components/levelsection-form/levelsection-form.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: LevelsectionFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelsectionFormComponent", function() { return LevelsectionFormComponent; });
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/auth.service */ "./src/app/quonmanager/services/auth.service.ts");
/* harmony import */ var _services_section_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../services/section.service */ "./src/app/quonmanager/services/section.service.ts");
/* harmony import */ var _services_levelsection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../services/levelsection.service */ "./src/app/quonmanager/services/levelsection.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _common_bad_request_error__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../common/bad-request-error */ "./src/app/common/bad-request-error.ts");
/* harmony import */ var _services_level_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../services/level.service */ "./src/app/quonmanager/services/level.service.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _services_adviser_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../services/adviser.service */ "./src/app/quonmanager/services/adviser.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var LevelsectionFormComponent = (function () {
    function LevelsectionFormComponent(dialogRef, fb, authService, levelSectionService, levelService, sectionService, adviserService, snackBar) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.authService = authService;
        this.levelSectionService = levelSectionService;
        this.levelService = levelService;
        this.sectionService = sectionService;
        this.adviserService = adviserService;
        this.snackBar = snackBar;
        // [select] - school - year
        this.schoolYears = [2018, 2019, 2020];
    }
    LevelsectionFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.levelSectionFormGroup = this.fb.group({
            id: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](this.levelSection.id),
            schoolYear: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](this.levelSection.schoolYear, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required]),
            levelId: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](this.levelSection.levelId, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required]),
            sectionId: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](this.levelSection.sectionId, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required]),
            stationId: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](this.authService.decodedToken.StationId),
            sectionAdviser: this.fb.group({
                adviserId: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"](this.levelSection.sectionAdviser.adviserId, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required])
            })
        });
        // getAll Levels
        this.levelService.getAll()
            .subscribe(function (response) {
            _this.levels = response.json().levels;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_8__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.dialogRef.close();
            }
        });
        // getAll Sections
        this.sectionService.getAll()
            .subscribe(function (response) {
            _this.sections = response.json().sections;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_8__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.dialogRef.close();
            }
        });
        // getAll Advisers
        this.adviserService.getAll()
            .subscribe(function (response) {
            _this.advisers = response.json().advisers;
            console.log(response.json().advisers);
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_8__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.dialogRef.close();
            }
        });
    };
    LevelsectionFormComponent.prototype.create = function () {
        var _this = this;
        if (this.levelSection.id == null) {
            this.levelSectionFormGroup.get('id').disable();
            this.levelSectionService.create(this.levelSectionFormGroup.value)
                .subscribe(function (response) {
                console.log(response);
                _this.snackBar.open('Successful!', 'Level Section Created', {
                    duration: 2000,
                });
                _this.close();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_6__["BadRequestError"]) {
                    _this.levelSectionFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Level Section not created', {
                        duration: 2000,
                    });
                    _this.close();
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Level Section not created', {
                        duration: 2000,
                    });
                }
            });
        }
        else {
            this.levelSectionService.update(this.levelSectionFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'Level Section Updated', {
                    duration: 2000,
                });
                _this.close();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_6__["BadRequestError"]) {
                    _this.levelSectionFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Level Section not updated', {
                        duration: 2000,
                    });
                    _this.close();
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Level Section not updated', {
                        duration: 2000,
                    });
                }
            });
        }
    };
    LevelsectionFormComponent.prototype.close = function () {
        this.dialogRef.close();
    };
    LevelsectionFormComponent.prototype.getErrorMessage = function (controlName) {
        return this.levelSectionFormGroup.get(controlName).hasError('required') ? 'You must enter a value' :
            this.levelSectionFormGroup.get(controlName).hasError('minlength') ? 'You must enter atleast 3 characters' :
                this.levelSectionFormGroup.get(controlName).hasError('pattern') ? 'You must enter alphabet characters only' :
                    '';
    };
    LevelsectionFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'app-levelsection-form',
            template: __webpack_require__(/*! ./levelsection-form.component.html */ "./src/app/quonmanager/components/levelsection-form/levelsection-form.component.html"),
            styles: [__webpack_require__(/*! ./levelsection-form.component.scss */ "./src/app/quonmanager/components/levelsection-form/levelsection-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_5__["MatDialogRef"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_0__["AuthService"],
            _services_levelsection_service__WEBPACK_IMPORTED_MODULE_2__["LevelSectionService"],
            _services_level_service__WEBPACK_IMPORTED_MODULE_7__["LevelService"],
            _services_section_service__WEBPACK_IMPORTED_MODULE_1__["SectionService"],
            _services_adviser_service__WEBPACK_IMPORTED_MODULE_9__["AdviserService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_5__["MatSnackBar"]])
    ], LevelsectionFormComponent);
    return LevelsectionFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/levelsection-list/levelsection-list.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/quonmanager/components/levelsection-list/levelsection-list.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"material\">\n  <mat-card>\n    <div *ngIf=\"levelSections else loading\">\n      <button class=\"material\" mat-raised-button color=\"primary\" (click)=\"AddLevelSectionFormDialog()\">\n        Add Level Section\n      </button>\n\n      <br>\n      <br>\n      <mat-divider></mat-divider>\n      <div class=\"example-container mat-elevation-z8\" class=\"material\">\n\n        <mat-table #table [dataSource]=\"dataSource\">\n\n          <ng-container matColumnDef=\"SchoolYear\">\n            <mat-header-cell *matHeaderCellDef class=\"material\">\n              <h3 class=\"matheader\">School Year</h3>\n            </mat-header-cell>\n            <mat-cell *matCellDef=\"let levelSection\"> {{ levelSection.schoolYear }}</mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"Section\">\n            <mat-header-cell *matHeaderCellDef class=\"material\">\n              <h3 class=\"matheader\">Level-Section</h3>\n            </mat-header-cell>\n            <mat-cell *matCellDef=\"let levelSection\"> {{ levelSection.level.name }} - {{ levelSection.section.name }}</mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"Adviser\">\n            <mat-header-cell *matHeaderCellDef class=\"material\">\n              <h3 class=\"matheader\">Adviser</h3>\n            </mat-header-cell>\n            <mat-cell *matCellDef=\"let levelSection\"> {{ levelSection.sectionAdviser.adviser.employee.person.firstName }} {{ levelSection.sectionAdviser.adviser.employee.person.lastName\n              }}</mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"Edit\">\n            <mat-header-cell *matHeaderCellDef class=\"material\">\n              <h3 class=\"matheader\">Edit</h3>\n            </mat-header-cell>\n            <mat-cell *matCellDef=\"let section\">\n              <a mat-button (click)=\"EditLevelSectionFormDialog(section)\">\n                <mat-icon color=\"primary\">edit</mat-icon>\n              </a>\n            </mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"Delete\">\n            <mat-header-cell *matHeaderCellDef class=\"material\">\n              <h3 class=\"matheader\">Delete</h3>\n            </mat-header-cell>\n            <mat-cell *matCellDef=\"let section\">\n              <a mat-button (click)=\"EditLevelSectionFormDialog(section)\">\n                <mat-icon color=\"warn\">delete </mat-icon>\n              </a>\n            </mat-cell>\n          </ng-container>\n\n          <mat-header-row *matHeaderRowDef=\"displayedColumns\" class=\"material\"></mat-header-row>\n          <mat-row *matRowDef=\"let row; columns: displayedColumns;\" class=\"material\"></mat-row>\n\n        </mat-table>\n\n        <mat-paginator [length]=\"length\" [pageSize]=\"pageSize\" [pageSizeOptions]=\"pageSizeOptions\" [pageIndex]=\"pageIndex\" (page)=\"pageEvent = $event; onPaginateChange($event)\">\n        </mat-paginator>\n\n      </div>\n    </div>\n\n\n    <ng-template #loading>\n      <mat-progress-spinner style=\"margin:0 auto;\" [mode]=\"behavior\">\n      </mat-progress-spinner>\n    </ng-template>\n\n  </mat-card>\n</div>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/levelsection-list/levelsection-list.component.scss":
/*!*******************************************************************************************!*\
  !*** ./src/app/quonmanager/components/levelsection-list/levelsection-list.component.scss ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n  max-height: 500px;\n  min-width: 300px; }\n\n.mat-table {\n  overflow: auto;\n  max-height: 500px; }\n\n.material {\n  font-family: cursive; }\n\n.material mat-paginator {\n  font-style: italic; }\n\n.material mat-header-cell {\n  font-weight: bold;\n  font-size: medium;\n  color: #3F51B5; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/levelsection-list/levelsection-list.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/quonmanager/components/levelsection-list/levelsection-list.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: LevelsectionListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelsectionListComponent", function() { return LevelsectionListComponent; });
/* harmony import */ var _models_levelsection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../models/levelsection */ "./src/app/quonmanager/models/levelsection.ts");
/* harmony import */ var _levelsection_form_levelsection_form_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../levelsection-form/levelsection-form.component */ "./src/app/quonmanager/components/levelsection-form/levelsection-form.component.ts");
/* harmony import */ var _services_levelsection_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../services/levelsection.service */ "./src/app/quonmanager/services/levelsection.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _models_sectionAdviser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../models/sectionAdviser */ "./src/app/quonmanager/models/sectionAdviser.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var LevelsectionListComponent = (function () {
    function LevelsectionListComponent(levelSectionService, dialog, snackBar) {
        this.levelSectionService = levelSectionService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        // mat-table
        this.displayedColumns = ['SchoolYear', 'Section', 'Adviser', 'Edit', 'Delete'];
        this.pageSize = 10;
        this.pageSizeOptions = [5, 10, 25, 50, 100];
        // loading
        this.behavior = 'indeterminate';
    }
    LevelsectionListComponent.prototype.ngOnInit = function () {
        this.loadRecords(1, this.pageSize);
    };
    LevelsectionListComponent.prototype.onPaginateChange = function ($event) {
        this.loadRecords(this.pageEvent.pageIndex + 1, this.pageEvent.pageSize);
    };
    LevelsectionListComponent.prototype.loadRecords = function (pageIndex, pageSize) {
        var _this = this;
        this.levelSectionService.get(pageIndex, pageSize)
            .subscribe(function (response) {
            _this.levelSections = response.json().levelSections;
            _this.length = response.json().count;
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatTableDataSource"](_this.levelSections);
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_5__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.behavior = 'determinate';
            }
        });
    };
    LevelsectionListComponent.prototype.AddLevelSectionFormDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_levelsection_form_levelsection_form_component__WEBPACK_IMPORTED_MODULE_1__["LevelsectionFormComponent"], {
            width: '450px'
        });
        dialogRef.componentInstance.levelSection = new _models_levelsection__WEBPACK_IMPORTED_MODULE_0__["LevelSection"]();
        dialogRef.componentInstance.levelSection.sectionAdviser = new _models_sectionAdviser__WEBPACK_IMPORTED_MODULE_6__["SectionAdviser"]();
        dialogRef.afterClosed().subscribe(function (result) { _this.ngOnInit(); });
    };
    LevelsectionListComponent.prototype.EditLevelSectionFormDialog = function (levelSectionPassed) {
        var _this = this;
        var dialogRef = this.dialog.open(_levelsection_form_levelsection_form_component__WEBPACK_IMPORTED_MODULE_1__["LevelsectionFormComponent"], {
            width: '450px'
        });
        dialogRef.componentInstance.levelSection = new _models_levelsection__WEBPACK_IMPORTED_MODULE_0__["LevelSection"]();
        dialogRef.componentInstance.levelSection.sectionAdviser = new _models_sectionAdviser__WEBPACK_IMPORTED_MODULE_6__["SectionAdviser"]();
        dialogRef.componentInstance.levelSection.id = levelSectionPassed.id;
        dialogRef.componentInstance.levelSection.levelId = levelSectionPassed.levelId;
        dialogRef.componentInstance.levelSection.schoolYear = levelSectionPassed.schoolYear;
        dialogRef.componentInstance.levelSection.sectionId = levelSectionPassed.sectionId;
        dialogRef.componentInstance.levelSection.stationId = levelSectionPassed.stationId;
        dialogRef.componentInstance.levelSection.sectionAdviser.adviserId = levelSectionPassed.sectionAdviser.adviserId;
        dialogRef.afterClosed().subscribe(function (result) { _this.ngOnInit(); });
    };
    LevelsectionListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'app-levelsection-list',
            template: __webpack_require__(/*! ./levelsection-list.component.html */ "./src/app/quonmanager/components/levelsection-list/levelsection-list.component.html"),
            styles: [__webpack_require__(/*! ./levelsection-list.component.scss */ "./src/app/quonmanager/components/levelsection-list/levelsection-list.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_levelsection_service__WEBPACK_IMPORTED_MODULE_2__["LevelSectionService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatDialog"],
            _angular_material__WEBPACK_IMPORTED_MODULE_4__["MatSnackBar"]])
    ], LevelsectionListComponent);
    return LevelsectionListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/login-form/login-form.component.html":
/*!*****************************************************************************!*\
  !*** ./src/app/quonmanager/components/login-form/login-form.component.html ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n\n  <mat-toolbar color=\"primary\">\n    <mat-icon style=\"padding-right:4em\">portrait</mat-icon>Login Account\n  </mat-toolbar>\n  <br>\n  <mat-divider></mat-divider>\n  <br>\n\n  <form [formGroup]=\"loginFormGroup\">\n    <mat-dialog-content>\n      <div class=\"example-container\">\n        <!-- EmployeeNumber -->\n        <mat-form-field hintLabel=\"7 digits\">\n          <input matInput placeholder=\"Employee Number\" formControlName=\"employeeNumber\" required maxlength=\"7\" minlength=\"7\" pattern=\"[0-9]+\">\n          <mat-error *ngIf=\"loginFormGroup.get('employeeNumber').invalid\">{{getErrorMessage('employeeNumber')}}</mat-error>\n          <mat-hint align=\"end\">{{loginFormGroup.get('employeeNumber').value?.length || 0}}/6</mat-hint>\n        </mat-form-field>\n\n        <br>\n        <mat-divider></mat-divider>\n        <br>\n\n        <!-- Password -->\n        <mat-form-field hintLabel=\"10 characters\">\n          <input matInput placeholder=\"Enter your password\" [type]=\"hide ? 'password' : 'text'\" formControlName=\"password\" required\n            maxlength=\"10\" minlength=\"10\">\n          <mat-icon matSuffix (click)=\"hide = !hide\">{{hide ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-error *ngIf=\"loginFormGroup.get('password').invalid\">{{getErrorMessage('password')}}</mat-error>\n          <mat-hint align=\"end\">{{loginFormGroup.get('password').value?.length || 0}}/10</mat-hint>\n        </mat-form-field>\n\n        <br>\n        <mat-divider></mat-divider>\n        <br>\n      \n      </div>\n    </mat-dialog-content>\n\n    <mat-dialog-actions>\n        <button mat-button color=\"primary\" [disabled]=\"!loginFormGroup.valid\" (click)=\"login()\">\n          <mat-icon>save</mat-icon> Login\n        </button>\n        <button mat-button color=\"primary\" (click)=\"close()\">\n          <mat-icon>cancel</mat-icon> Cancel\n        </button>\n      </mat-dialog-actions>\n  </form>\n</div>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/login-form/login-form.component.scss":
/*!*****************************************************************************!*\
  !*** ./src/app/quonmanager/components/login-form/login-form.component.scss ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column; }\n\n.example-container > * {\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/login-form/login-form.component.ts":
/*!***************************************************************************!*\
  !*** ./src/app/quonmanager/components/login-form/login-form.component.ts ***!
  \***************************************************************************/
/*! exports provided: LoginFormComponent, Login */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginFormComponent", function() { return LoginFormComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Login", function() { return Login; });
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/auth.service */ "./src/app/quonmanager/services/auth.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _common_unauthorized_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../common/unauthorized-error */ "./src/app/common/unauthorized-error.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var LoginFormComponent = (function () {
    function LoginFormComponent(dialogRef, authService, fb, snackBar, router, route) {
        this.dialogRef = dialogRef;
        this.authService = authService;
        this.fb = fb;
        this.snackBar = snackBar;
        this.router = router;
        this.route = route;
        // for password input
        this.hide = true;
        this.behavior = 'indeterminate';
    }
    LoginFormComponent.prototype.ngOnInit = function () {
        this.loginFormGroup = this.fb.group({
            employeeNumber: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(7), _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(7)]),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(10), _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(10)])
        });
    };
    LoginFormComponent.prototype.login = function () {
        var _this = this;
        this.loginCredentials = this.loginFormGroup.value;
        this.authService.login(this.loginCredentials)
            .subscribe(function (response) {
            _this.snackBar.open('Access Granted', '', { duration: 5000 });
            var returnUrl = _this.route.snapshot.queryParamMap.get('returnUrl');
            _this.router.navigate([returnUrl || '/quonmanager/dashboard']);
            _this.close();
        }, function (error) {
            if (error instanceof _common_unauthorized_error__WEBPACK_IMPORTED_MODULE_4__["UnauthorizedError"]) {
                _this.loginFormGroup.setErrors(['unauthorized']);
                _this.snackBar.open('Login Failed', 'Employee Number and Password are invalid', {
                    duration: 2000,
                });
            }
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_5__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.behavior = 'determinate';
            }
        });
    };
    LoginFormComponent.prototype.close = function () {
        this.dialogRef.close(null);
    };
    LoginFormComponent.prototype.getErrorMessage = function (controlName) {
        if (controlName === 'employeeNumber') {
            return this.loginFormGroup.get(controlName).hasError('minlength') ? 'You must enter 6 digits' :
                this.loginFormGroup.get(controlName).hasError('pattern') ? 'You must enter digits only' : '';
        }
        else {
            return this.loginFormGroup.get(controlName).hasError('required') ? 'You must enter a value' :
                this.loginFormGroup.get(controlName).hasError('minlength') ? 'You must enter 10 password characters' :
                    this.loginFormGroup.get(controlName).hasError('pattern') ? 'You must enter alphabet characters only' :
                        '';
        }
    };
    LoginFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-login-form',
            template: __webpack_require__(/*! ./login-form.component.html */ "./src/app/quonmanager/components/login-form/login-form.component.html"),
            styles: [__webpack_require__(/*! ./login-form.component.scss */ "./src/app/quonmanager/components/login-form/login-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialogRef"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_0__["AuthService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSnackBar"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_6__["ActivatedRoute"]])
    ], LoginFormComponent);
    return LoginFormComponent;
}());

var Login = (function () {
    function Login() {
    }
    return Login;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/main-content/main-content.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/main-content/main-content.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/main-content/main-content.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/main-content/main-content.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n  max-height: 500px;\n  min-width: 300px; }\n\n.mat-table {\n  overflow: auto;\n  max-height: 500px; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/main-content/main-content.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/quonmanager/components/main-content/main-content.component.ts ***!
  \*******************************************************************************/
/*! exports provided: MainContentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainContentComponent", function() { return MainContentComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MainContentComponent = (function () {
    function MainContentComponent() {
    }
    MainContentComponent.prototype.ngOnInit = function () {
    };
    MainContentComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-main-content',
            template: __webpack_require__(/*! ./main-content.component.html */ "./src/app/quonmanager/components/main-content/main-content.component.html"),
            styles: [__webpack_require__(/*! ./main-content.component.scss */ "./src/app/quonmanager/components/main-content/main-content.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], MainContentComponent);
    return MainContentComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/no-access/no-access.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/quonmanager/components/no-access/no-access.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1>\n  Please Login to continue.\n</h1>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/no-access/no-access.component.scss":
/*!***************************************************************************!*\
  !*** ./src/app/quonmanager/components/no-access/no-access.component.scss ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/no-access/no-access.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/quonmanager/components/no-access/no-access.component.ts ***!
  \*************************************************************************/
/*! exports provided: NoAccessComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NoAccessComponent", function() { return NoAccessComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NoAccessComponent = (function () {
    function NoAccessComponent() {
    }
    NoAccessComponent.prototype.ngOnInit = function () {
    };
    NoAccessComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-no-access',
            template: __webpack_require__(/*! ./no-access.component.html */ "./src/app/quonmanager/components/no-access/no-access.component.html"),
            styles: [__webpack_require__(/*! ./no-access.component.scss */ "./src/app/quonmanager/components/no-access/no-access.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], NoAccessComponent);
    return NoAccessComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/page-not-found/page-not-found.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/quonmanager/components/page-not-found/page-not-found.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "PAGE NOT FOUND"

/***/ }),

/***/ "./src/app/quonmanager/components/page-not-found/page-not-found.component.scss":
/*!*************************************************************************************!*\
  !*** ./src/app/quonmanager/components/page-not-found/page-not-found.component.scss ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/page-not-found/page-not-found.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/page-not-found/page-not-found.component.ts ***!
  \***********************************************************************************/
/*! exports provided: PageNotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageNotFoundComponent", function() { return PageNotFoundComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PageNotFoundComponent = (function () {
    function PageNotFoundComponent() {
    }
    PageNotFoundComponent.prototype.ngOnInit = function () {
    };
    PageNotFoundComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-page-not-found',
            template: __webpack_require__(/*! ./page-not-found.component.html */ "./src/app/quonmanager/components/page-not-found/page-not-found.component.html"),
            styles: [__webpack_require__(/*! ./page-not-found.component.scss */ "./src/app/quonmanager/components/page-not-found/page-not-found.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], PageNotFoundComponent);
    return PageNotFoundComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/participant-form/participant-form.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/quonmanager/components/participant-form/participant-form.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-card>\n<div class=\"wrapperHeading\">\n    <p>\n        {{ training.title }}\n    </p>\n    <p>\n        {{ training.sourceMemo.name}} Memo : {{ training.number }} - {{ training.year }}\n    </p>\n    <p>\n        {{ training.sourceMemo.relativeExpenses}}\n    </p>\n</div>\n<div class=\"wrapperContent\">\n\n    <div>\n\n        <form [formGroup]=\"participantFormGroup\">\n\n            <mat-card class=\"wrapperForm\">\n                <mat-form-field hintLabel=\"Select Venue\">\n                    <mat-select placeholder=\"Venue\" formControlName=\"trainingVenueId\">\n                        <mat-option  *ngFor=\"let venue of training.trainingVenues\" [value]=\"id\" [disabled]=\"false\">{{ venue.venue }}</mat-option>\n                    </mat-select>\n                </mat-form-field>\n                <button mat-button color=primary (click)=\"showParticipants()\">Show</button>\n                \n                <mat-form-field hintLabel=\"7 digits\">\n                    <input matInput placeholder=\"Employee Number\" formControlName=\"employeeNumber\" required maxlength=\"7\" minlength=\"7\" pattern=\"[0-9]+\">\n                </mat-form-field>\n                <br>\n                <button mat-raised-button color=\"primary\" (click)=\"create()\">Add Employee</button>\n            \n            </mat-card>\n        </form>\n\n    </div>\n\n    <div>\n        <mat-card *ngFor=\"let participant of participants\">\n            {{ participant.employee.person.firstName }} {{ participant.employee.person.middleName }} {{ participant.employee.person.lastName }}  \n        </mat-card>\n    </div>\n</div>\n</mat-card>\n\n<p>{{ participantFormGroup.value | json }} </p>"

/***/ }),

/***/ "./src/app/quonmanager/components/participant-form/participant-form.component.scss":
/*!*****************************************************************************************!*\
  !*** ./src/app/quonmanager/components/participant-form/participant-form.component.scss ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".wrapperHeading {\n  display: -ms-grid;\n  display: grid;\n  -ms-grid-columns: 1fr;\n      grid-template-columns: 1fr;\n  grid-auto-rows: auto; }\n\n.wrapperHeading > p {\n  -ms-grid-column-align: center;\n      justify-self: center; }\n\n.wrapperContent {\n  display: -ms-grid;\n  display: grid;\n  -ms-grid-columns: 2.5fr 2fr;\n      grid-template-columns: 2.5fr 2fr;\n  grid-gap: 1em;\n  grid-auto-rows: minmax(500px, auto); }\n\n.wrapperForm {\n  display: -ms-grid;\n  display: grid;\n  -ms-grid-columns: 1fr .5fr;\n      grid-template-columns: 1fr .5fr;\n  grid-auto-rows: auto;\n  grid-gap: 1em; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/participant-form/participant-form.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/quonmanager/components/participant-form/participant-form.component.ts ***!
  \***************************************************************************************/
/*! exports provided: ParticipantFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParticipantFormComponent", function() { return ParticipantFormComponent; });
/* harmony import */ var _services_employee_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/employee.service */ "./src/app/quonmanager/services/employee.service.ts");
/* harmony import */ var _common_bad_request_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../common/bad-request-error */ "./src/app/common/bad-request-error.ts");
/* harmony import */ var _models_participantQuery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../models/participantQuery */ "./src/app/quonmanager/models/participantQuery.ts");
/* harmony import */ var _services_participant_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/participant.service */ "./src/app/quonmanager/services/participant.service.ts");
/* harmony import */ var _models_participant__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../models/participant */ "./src/app/quonmanager/models/participant.ts");
/* harmony import */ var _models_training__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./../../models/training */ "./src/app/quonmanager/models/training.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _services_training_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./../../services/training.service */ "./src/app/quonmanager/services/training.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _models_sourceMemo__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../models/sourceMemo */ "./src/app/quonmanager/models/sourceMemo.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var ParticipantFormComponent = (function () {
    function ParticipantFormComponent(fb, router, route, snackBar, trainingService, participantService, employeeService) {
        var _this = this;
        this.fb = fb;
        this.router = router;
        this.route = route;
        this.snackBar = snackBar;
        this.trainingService = trainingService;
        this.participantService = participantService;
        this.employeeService = employeeService;
        this.route.params.subscribe(function (params) { return _this.id = params['id']; });
    }
    ParticipantFormComponent.prototype.ngOnInit = function () {
        this.populateTraining();
        this.createParticipantFormGroup();
    };
    ParticipantFormComponent.prototype.populateTraining = function () {
        var _this = this;
        this.trainingService.getById(this.id)
            .subscribe(function (response) {
            _this.training = response.json();
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_6__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    ParticipantFormComponent.prototype.createParticipantFormGroup = function () {
        this.training = new _models_training__WEBPACK_IMPORTED_MODULE_5__["Training"]();
        this.training.sourceMemo = new _models_sourceMemo__WEBPACK_IMPORTED_MODULE_12__["SourceMemo"]();
        this.participant = new _models_participant__WEBPACK_IMPORTED_MODULE_4__["Participant"]();
        this.participantFormGroup = this.fb.group({
            id: new _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormControl"](this.participant.id),
            trainingVenueId: new _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormControl"](this.participant.trainingVenueId),
            employeeId: new _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormControl"](this.participant.employeeId),
            employeeNumber: new _angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormControl"]('')
        });
    };
    ParticipantFormComponent.prototype.showParticipants = function () {
        var _this = this;
        var participantQuery = new _models_participantQuery__WEBPACK_IMPORTED_MODULE_2__["ParticipantQuery"]();
        participantQuery.trainingVenueId = this.participantFormGroup.get('trainingVenueId').value;
        this.participantService.all(participantQuery)
            .subscribe(function (response) {
            _this.participants = response.json().participants;
            console.log(_this.participants);
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_6__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    ParticipantFormComponent.prototype.create = function () {
        var _this = this;
        var employeeNumber = this.participantFormGroup.get('employeeNumber').value;
        this.employeeService.getByUrl(this.employeeService.getByEmployeeNumber)
            .subscribe(function (response) {
            _this.employeeId = response.json().id;
        });
        this.participantFormGroup.get('employeeNumber').disable();
        this.participantFormGroup.patchValue({
            employeeId: this.employeeId
        });
        this.participantService.create(this.participantFormGroup.value)
            .subscribe(function (response) {
            _this.snackBar.open('Successful!', 'Participant Created', {
                duration: 2000,
            });
        }, function (error) {
            if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_1__["BadRequestError"]) {
                _this.participantFormGroup.setErrors(['BadRequest']);
                _this.snackBar.open('Bad Request!', 'Participant not Created', {
                    duration: 2000,
                });
            }
            else {
                _this.snackBar.open('Unknown Error!', 'Participant not Created', {
                    duration: 2000,
                });
            }
        });
    };
    ParticipantFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_11__["Component"])({
            selector: 'app-participant-form',
            template: __webpack_require__(/*! ./participant-form.component.html */ "./src/app/quonmanager/components/participant-form/participant-form.component.html"),
            styles: [__webpack_require__(/*! ./participant-form.component.scss */ "./src/app/quonmanager/components/participant-form/participant-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_8__["FormBuilder"],
            _angular_router__WEBPACK_IMPORTED_MODULE_10__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_10__["ActivatedRoute"],
            _angular_material__WEBPACK_IMPORTED_MODULE_9__["MatSnackBar"],
            _services_training_service__WEBPACK_IMPORTED_MODULE_7__["TrainingService"],
            _services_participant_service__WEBPACK_IMPORTED_MODULE_3__["ParticipantService"],
            _services_employee_service__WEBPACK_IMPORTED_MODULE_0__["EmployeeService"]])
    ], ParticipantFormComponent);
    return ParticipantFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/position-form/position-form.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/position-form/position-form.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\r\n  <mat-toolbar color=\"primary\">\r\n    <mat-icon style=\"padding-right:4em\">clear_all</mat-icon> {{ heading }}\r\n  </mat-toolbar>\r\n\r\n<br>\r\n<br>\r\n\r\n<form [formGroup]=\"positionFormGroup\">\r\n  <mat-dialog-content>\r\n    <div class=\"example-container\">\r\n      <!-- Section Name-->\r\n      <mat-form-field hintLabel=\"atleast 10 characters\">\r\n        <input matInput placeholder=\"Section\" formControlName=\"name\" required maxlength=\"100\" minlength=\"10\" pattern=\"[a-zA-Z][a-zA-Z ]+\">\r\n        <mat-error *ngIf=\"positionFormGroup.get('name').invalid\">{{getErrorMessage('name')}}</mat-error>\r\n        <mat-hint align=\"end\">{{positionFormGroup.get('name').value?.length || 0}}/10</mat-hint>\r\n      </mat-form-field>\r\n    \r\n    </div>\r\n  </mat-dialog-content>\r\n\r\n  <br>\r\n  <mat-divider></mat-divider>\r\n  <br>\r\n\r\n  <mat-dialog-actions>\r\n    <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!positionFormGroup.valid\" (click)=\"create()\">\r\n      <mat-icon>save</mat-icon> Save\r\n    </button>\r\n    <button mat-raised-button color=\"primary\" (click)=\"close()\">\r\n      <mat-icon>cancel</mat-icon> Cancel\r\n    </button>      \r\n  </mat-dialog-actions>\r\n  \r\n</form>\r\n"

/***/ }),

/***/ "./src/app/quonmanager/components/position-form/position-form.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/position-form/position-form.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column; }\n\n.example-container > * {\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/position-form/position-form.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/position-form/position-form.component.ts ***!
  \*********************************************************************************/
/*! exports provided: PositionFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PositionFormComponent", function() { return PositionFormComponent; });
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _common_bad_request_error__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../common/bad-request-error */ "./src/app/common/bad-request-error.ts");
/* harmony import */ var _services_position_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/position.service */ "./src/app/quonmanager/services/position.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PositionFormComponent = (function () {
    function PositionFormComponent(dialogRef, fb, positionService, snackBar) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.positionService = positionService;
        this.snackBar = snackBar;
        this.heading = 'New Position';
    }
    PositionFormComponent.prototype.ngOnInit = function () {
        this.positionFormGroup = this.fb.group({
            id: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.position.Id),
            name: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.position.Name, [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(10)])
        });
    };
    PositionFormComponent.prototype.create = function () {
        var _this = this;
        if (this.position.Id == null) {
            this.positionFormGroup.get('id').disable();
            this.positionService.create(this.positionFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'Position Created', {
                    duration: 2000,
                });
                _this.close();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_3__["BadRequestError"]) {
                    _this.positionFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Position not created', {
                        duration: 2000,
                    });
                    _this.close();
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Position not created', {
                        duration: 2000,
                    });
                }
            });
        }
        else {
            this.positionService.update(this.positionFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'Position Updated', {
                    duration: 2000,
                });
                _this.close();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_3__["BadRequestError"]) {
                    _this.positionFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Position not updated', {
                        duration: 2000,
                    });
                    _this.close();
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Position not updated', {
                        duration: 2000,
                    });
                }
            });
        }
    };
    PositionFormComponent.prototype.close = function () {
        this.dialogRef.close(null);
    };
    PositionFormComponent.prototype.getErrorMessage = function (controlName) {
        return this.positionFormGroup.get(controlName).hasError('required') ? 'You must enter a value' :
            this.positionFormGroup.get(controlName).hasError('minlength') ? 'You must enter atleast 10 characters' :
                this.positionFormGroup.get(controlName).hasError('pattern') ? 'digit is not allowed' :
                    '';
    };
    PositionFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-position-form',
            template: __webpack_require__(/*! ./position-form.component.html */ "./src/app/quonmanager/components/position-form/position-form.component.html"),
            styles: [__webpack_require__(/*! ./position-form.component.scss */ "./src/app/quonmanager/components/position-form/position-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_0__["MatDialogRef"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _services_position_service__WEBPACK_IMPORTED_MODULE_4__["PositionService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatSnackBar"]])
    ], PositionFormComponent);
    return PositionFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/position-list/position-list.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/position-list/position-list.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"material\">\n  <mat-card>\n    <div *ngIf=\"positions else loading\">\n      <button mat-raised-button color=\"primary\" (click)=\"AddPositionFormDialog()\" class=\"material\">\n        Add Position\n      </button>\n\n      <br>\n      <br>\n      <mat-divider></mat-divider>\n      <div class=\"example-container mat-elevation-z8\" class=\"material\">\n        <mat-table #table [dataSource]=\"dataSource\">\n\n          <ng-container matColumnDef=\"Name\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Position </mat-header-cell>\n            <mat-cell *matCellDef=\"let position\" class=\"material\"> {{ position.name }}</mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"edit\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Edit </mat-header-cell>\n            <mat-cell *matCellDef=\"let position\">\n              <a mat-button (click)=\"EditPositionFormDialog(position)\">\n                <mat-icon color=\"primary\">edit</mat-icon>\n              </a>\n            </mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"delete\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Delete </mat-header-cell>\n            <mat-cell *matCellDef=\"let position\">\n              <a mat-button (click)=\"EditPositionFormDialog(position)\">\n                <mat-icon color=\"warn\">delete </mat-icon>\n              </a>\n            </mat-cell>\n          </ng-container>\n\n          <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\n          <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\n\n        </mat-table>\n\n        <mat-paginator class=\"material\" [length]=\"length\" [pageSize]=\"pageSize\" [pageSizeOptions]=\"pageSizeOptions\" [pageIndex]=\"pageIndex\"\n          (page)=\"pageEvent = $event; onPaginateChange($event)\">\n        </mat-paginator>\n\n      </div>\n    </div>\n\n    <ng-template #loading>\n      <mat-progress-spinner style=\"margin:0 auto;\" [mode]=\"behavior\">\n      </mat-progress-spinner>\n    </ng-template>\n  </mat-card>\n\n</div>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/position-list/position-list.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/position-list/position-list.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n  max-height: 500px;\n  min-width: 300px; }\n\n.mat-table {\n  overflow: auto;\n  max-height: 500px; }\n\n.material {\n  font-family: cursive; }\n\n.material.mat-paginator {\n  font-style: italic; }\n\n.material.mat-header-cell {\n  font-weight: bold;\n  font-size: medium;\n  color: #3F51B5; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/position-list/position-list.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/position-list/position-list.component.ts ***!
  \*********************************************************************************/
/*! exports provided: PositionListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PositionListComponent", function() { return PositionListComponent; });
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _models_Position__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/Position */ "./src/app/quonmanager/models/Position.ts");
/* harmony import */ var _services_position_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/position.service */ "./src/app/quonmanager/services/position.service.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _position_form_position_form_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../position-form/position-form.component */ "./src/app/quonmanager/components/position-form/position-form.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var PositionListComponent = (function () {
    function PositionListComponent(sectionService, dialog, snackBar) {
        this.sectionService = sectionService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        // mat-table
        this.displayedColumns = ['Name', 'edit', 'delete'];
        this.pageSize = 10;
        this.pageSizeOptions = [5, 10, 25, 50, 100];
        // loading
        this.behavior = 'indeterminate';
    }
    PositionListComponent.prototype.ngOnInit = function () {
        this.loadRecords(1, this.pageSize);
    };
    PositionListComponent.prototype.onPaginateChange = function ($event) {
        this.loadRecords(this.pageEvent.pageIndex + 1, this.pageEvent.pageSize);
    };
    PositionListComponent.prototype.loadRecords = function (pageIndex, pageSize) {
        var _this = this;
        this.sectionService.get(pageIndex, pageSize)
            .subscribe(function (response) {
            _this.positions = response.json().positions;
            _this.length = response.json().count;
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatTableDataSource"](_this.positions);
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_4__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.behavior = 'determinate';
            }
        });
    };
    PositionListComponent.prototype.AddPositionFormDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_position_form_position_form_component__WEBPACK_IMPORTED_MODULE_5__["PositionFormComponent"], {
            width: '450px'
        });
        dialogRef.componentInstance.position = new _models_Position__WEBPACK_IMPORTED_MODULE_2__["Position"]();
        dialogRef.afterClosed().subscribe(function (result) { _this.ngOnInit(); });
    };
    PositionListComponent.prototype.EditPositionFormDialog = function (positionPassed) {
        var _this = this;
        var dialogRef = this.dialog.open(_position_form_position_form_component__WEBPACK_IMPORTED_MODULE_5__["PositionFormComponent"], { width: '450px' });
        dialogRef.componentInstance.position = new _models_Position__WEBPACK_IMPORTED_MODULE_2__["Position"]();
        dialogRef.componentInstance.position.Id = positionPassed.id;
        dialogRef.componentInstance.position.Name = positionPassed.name;
        dialogRef.componentInstance.heading = 'Edit Position';
        dialogRef.afterClosed().subscribe(function (result) { _this.ngOnInit(); });
    };
    PositionListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-position-list',
            template: __webpack_require__(/*! ./position-list.component.html */ "./src/app/quonmanager/components/position-list/position-list.component.html"),
            styles: [__webpack_require__(/*! ./position-list.component.scss */ "./src/app/quonmanager/components/position-list/position-list.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_position_service__WEBPACK_IMPORTED_MODULE_3__["PositionService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatDialog"],
            _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatSnackBar"]])
    ], PositionListComponent);
    return PositionListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/prefectofdiscipline-form/prefectofdiscipline-form.component.html":
/*!*********************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/prefectofdiscipline-form/prefectofdiscipline-form.component.html ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  prefectofdiscipline-form works!\n</p>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/prefectofdiscipline-form/prefectofdiscipline-form.component.scss":
/*!*********************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/prefectofdiscipline-form/prefectofdiscipline-form.component.scss ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/prefectofdiscipline-form/prefectofdiscipline-form.component.ts":
/*!*******************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/prefectofdiscipline-form/prefectofdiscipline-form.component.ts ***!
  \*******************************************************************************************************/
/*! exports provided: PrefectofdisciplineFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrefectofdisciplineFormComponent", function() { return PrefectofdisciplineFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PrefectofdisciplineFormComponent = (function () {
    function PrefectofdisciplineFormComponent() {
    }
    PrefectofdisciplineFormComponent.prototype.ngOnInit = function () {
    };
    PrefectofdisciplineFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-prefectofdiscipline-form',
            template: __webpack_require__(/*! ./prefectofdiscipline-form.component.html */ "./src/app/quonmanager/components/prefectofdiscipline-form/prefectofdiscipline-form.component.html"),
            styles: [__webpack_require__(/*! ./prefectofdiscipline-form.component.scss */ "./src/app/quonmanager/components/prefectofdiscipline-form/prefectofdiscipline-form.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], PrefectofdisciplineFormComponent);
    return PrefectofdisciplineFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/prefectofdiscipline-list/prefectofdiscipline-list.component.html":
/*!*********************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/prefectofdiscipline-list/prefectofdiscipline-list.component.html ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  prefectofdiscipline-list works!\n</p>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/prefectofdiscipline-list/prefectofdiscipline-list.component.scss":
/*!*********************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/prefectofdiscipline-list/prefectofdiscipline-list.component.scss ***!
  \*********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/prefectofdiscipline-list/prefectofdiscipline-list.component.ts":
/*!*******************************************************************************************************!*\
  !*** ./src/app/quonmanager/components/prefectofdiscipline-list/prefectofdiscipline-list.component.ts ***!
  \*******************************************************************************************************/
/*! exports provided: PrefectofdisciplineListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrefectofdisciplineListComponent", function() { return PrefectofdisciplineListComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var PrefectofdisciplineListComponent = (function () {
    function PrefectofdisciplineListComponent() {
    }
    PrefectofdisciplineListComponent.prototype.ngOnInit = function () {
    };
    PrefectofdisciplineListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-prefectofdiscipline-list',
            template: __webpack_require__(/*! ./prefectofdiscipline-list.component.html */ "./src/app/quonmanager/components/prefectofdiscipline-list/prefectofdiscipline-list.component.html"),
            styles: [__webpack_require__(/*! ./prefectofdiscipline-list.component.scss */ "./src/app/quonmanager/components/prefectofdiscipline-list/prefectofdiscipline-list.component.scss")]
        }),
        __metadata("design:paramtypes", [])
    ], PrefectofdisciplineListComponent);
    return PrefectofdisciplineListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/principal-form/principal-form.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/quonmanager/components/principal-form/principal-form.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/principal-form/principal-form.component.scss":
/*!*************************************************************************************!*\
  !*** ./src/app/quonmanager/components/principal-form/principal-form.component.scss ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/principal-form/principal-form.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/principal-form/principal-form.component.ts ***!
  \***********************************************************************************/
/*! exports provided: PrincipalFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrincipalFormComponent", function() { return PrincipalFormComponent; });
/* harmony import */ var _services_principal_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/principal.service */ "./src/app/quonmanager/services/principal.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var PrincipalFormComponent = (function () {
    // Constructor Injections
    function PrincipalFormComponent(dialogRef, fb, snackbar, principalService) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.snackbar = snackbar;
        this.principalService = principalService;
    }
    PrincipalFormComponent.prototype.ngOnInit = function () {
        this.principalFormGroup = this.fb.group({
            employeeId: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].maxLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(6)])
        });
    };
    PrincipalFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'app-principal-form',
            template: __webpack_require__(/*! ./principal-form.component.html */ "./src/app/quonmanager/components/principal-form/principal-form.component.html"),
            styles: [__webpack_require__(/*! ./principal-form.component.scss */ "./src/app/quonmanager/components/principal-form/principal-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"],
            _services_principal_service__WEBPACK_IMPORTED_MODULE_0__["PrincipalService"]])
    ], PrincipalFormComponent);
    return PrincipalFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/principal-list/principal-list.component.html":
/*!*************************************************************************************!*\
  !*** ./src/app/quonmanager/components/principal-list/principal-list.component.html ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"principals else loading\">\n<button mat-button color=\"primary\" (click) =\"AddPrincipalFormDialog()\">\n  <mat-icon>person_add</mat-icon> New Principal\n</button>\n\n<br>\n<br>\n<div class=\"example-container mat-elevation-z8\">\n  <mat-table #table [dataSource]=\"dataSource\">\n\n        <!-- Name Column -->\n        <ng-container matColumnDef=\"schoolId\">\n          <mat-header-cell *matHeaderCellDef> SchoolId </mat-header-cell>\n          <mat-cell *matCellDef=\"let principal\"><a routerLink=\"#\">{{ principal.schoolId}} </a></mat-cell>\n        </ng-container>\n\n    <!-- Name Column -->\n    <ng-container matColumnDef=\"school\">\n      <mat-header-cell *matHeaderCellDef> School </mat-header-cell>\n      <mat-cell *matCellDef=\"let principal\"><a routerLink=\"#\">{{ principal.station}} </a></mat-cell>\n    </ng-container>\n\n    <ng-container matColumnDef=\"name\">\n      <mat-header-cell *matHeaderCellDef> Name </mat-header-cell>\n      <mat-cell *matCellDef=\"let principal\"> {{ principal.firstName }} {{ principal.middleName }} {{ principal.lastName }}</mat-cell>\n    </ng-container>\n\n    <ng-container matColumnDef=\"position\">\n      <mat-header-cell *matHeaderCellDef> Position </mat-header-cell>\n      <mat-cell *matCellDef=\"let principal\"> {{ principal.position}} </mat-cell>\n    </ng-container>\n\n    <ng-container matColumnDef=\"schoolYear\">\n      <mat-header-cell *matHeaderCellDef> SchoolYear </mat-header-cell>\n      <mat-cell *matCellDef=\"let principal\"> {{ principal.schoolYear}} </mat-cell>\n    </ng-container>\n\n    <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\n    <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\n\n\n  </mat-table>\n\n  <mat-paginator [length]=\"length\"\n                 [pageSize]=\"pageSize\"\n                 [pageSizeOptions]=\"pageSizeOptions\"\n                 [pageIndex] =\"pageIndex\"\n                 (page)=\"pageEvent = $event; onPaginateChange($event)\">\n  </mat-paginator>\n\n</div>\n</div>\n\n<ng-template #loading>\n  <mat-progress-spinner style=\"margin:0 auto;\" [mode]=\"behavior\"></mat-progress-spinner>\n</ng-template>"

/***/ }),

/***/ "./src/app/quonmanager/components/principal-list/principal-list.component.scss":
/*!*************************************************************************************!*\
  !*** ./src/app/quonmanager/components/principal-list/principal-list.component.scss ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/principal-list/principal-list.component.ts":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/principal-list/principal-list.component.ts ***!
  \***********************************************************************************/
/*! exports provided: PrincipalListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrincipalListComponent", function() { return PrincipalListComponent; });
/* harmony import */ var _principal_form_principal_form_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../principal-form/principal-form.component */ "./src/app/quonmanager/components/principal-form/principal-form.component.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _services_principal_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./../../services/principal.service */ "./src/app/quonmanager/services/principal.service.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var PrincipalListComponent = (function () {
    // behavior = 'determinate';
    function PrincipalListComponent(principalService, dialog, snackBar) {
        this.principalService = principalService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this.displayedColumns = ['schoolId', 'school', 'name', 'position', 'schoolYear'];
        this.pageSize = 10;
        this.pageSizeOptions = [5, 10, 25, 100];
        // for mat-spinner
        this.behavior = 'indeterminate';
    }
    PrincipalListComponent.prototype.ngOnInit = function () {
        this.loadRecords(1, this.pageSize);
    };
    PrincipalListComponent.prototype.onPaginateChange = function ($event) {
        this.loadRecords(this.pageEvent.pageIndex + 1, this.pageEvent.pageSize);
    };
    PrincipalListComponent.prototype.loadRecords = function (pageIndex, pageSize) {
        var _this = this;
        this.principalService.get(pageIndex, pageSize)
            .subscribe(function (response) {
            _this.principals = response.json().principals;
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatTableDataSource"](_this.principals);
            _this.length = response.json().count;
            console.log(response);
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_4__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.behavior = 'determinate';
            }
        });
    };
    PrincipalListComponent.prototype.AddPrincipalFormDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_principal_form_principal_form_component__WEBPACK_IMPORTED_MODULE_0__["PrincipalFormComponent"], {
            width: '450px'
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.ngOnInit();
        });
    };
    PrincipalListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-principal-list',
            template: __webpack_require__(/*! ./principal-list.component.html */ "./src/app/quonmanager/components/principal-list/principal-list.component.html"),
            styles: [__webpack_require__(/*! ./principal-list.component.scss */ "./src/app/quonmanager/components/principal-list/principal-list.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_principal_service__WEBPACK_IMPORTED_MODULE_3__["PrincipalService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"]])
    ], PrincipalListComponent);
    return PrincipalListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/registration-form/registration-form.component.html":
/*!*******************************************************************************************!*\
  !*** ./src/app/quonmanager/components/registration-form/registration-form.component.html ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"employees else loading\">\n\n  <mat-toolbar color=\"primary\">\n    <mat-icon style=\"padding-right:4em\">vpn_key</mat-icon>Registration Form\n  </mat-toolbar>\n\n  <br>\n  <br>\n\n  <form [formGroup]=\"registrationFormGroup\">\n    <mat-dialog-content>\n      <div class=\"example-container\">\n        <!-- Roles -->\n        \n        <div class=\"example-container\" formGroupName=\"userRole\">\n            <mat-form-field hintLabel=\"Select Role\">\n              <mat-select placeholder=\"Role\" formControlName=\"roleId\" required>\n                <mat-option *ngFor=\"let role of roles\" [value]=\"role.id\">{{role.name}}</mat-option>\n              </mat-select>\n            </mat-form-field>\n        </div>\n        <br>\n        <mat-divider></mat-divider>\n        <br>\n        <!-- EmployeeNumber -->\n        <mat-form-field hintLabel=\"7 digits\">\n          <input type=\"text\" placeholder=\"Employee Number\" aria-label=\"Number\" matInput formControlName=\"employeeNumber\" [matAutocomplete]=\"auto\" (blur)=\"onBlur()\">\n          <mat-autocomplete autoActiveFirstOption #auto=\"matAutocomplete\">\n            <mat-option *ngFor=\"let option of filteredOptions | async\" [value]=\"option\">\n              {{ option }}\n            </mat-option>\n          </mat-autocomplete>\n        </mat-form-field>\n        <br>\n        <mat-divider></mat-divider>\n        <br>\n        <!-- Password -->\n        <mat-form-field hintLabel=\"10 characters\">\n          <input matInput placeholder=\"Enter your password\" [type]=\"hide1 ? 'password' : 'text'\" formControlName=\"password\" required\n            maxlength=\"10\" minlength=\"10\">\n          <mat-icon matSuffix (click)=\"hide1 = !hide1\">{{hide1 ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-error *ngIf=\"registrationFormGroup.get('password').invalid\">{{getErrorMessage('password')}}</mat-error>\n          <mat-hint align=\"end\">{{registrationFormGroup.get('password').value?.length || 0}}/10</mat-hint>\n        </mat-form-field>\n\n        <br>\n        <mat-divider></mat-divider>\n        <br>\n        <!-- confirm password -->\n        <mat-form-field hintLabel=\"10 characters\">\n          <input matInput placeholder=\"Re-Enter your password\" [type]=\"hide2 ? 'password' : 'text'\" required maxlength=\"10\" minlength=\"10\"\n            required [errorStateMatcher]=\"matcher\">\n          <mat-icon matSuffix (click)=\"hide2 = !hide2\">{{hide2 ? 'visibility' : 'visibility_off'}}</mat-icon>\n          <mat-error *ngIf=\"true\">password doesnt match</mat-error>\n        </mat-form-field>\n\n      </div>\n    </mat-dialog-content>\n  </form>\n\n  <mat-dialog-actions>\n    <button mat-button color=\"primary\" [disabled]=\"!registrationFormGroup.valid\" (click)=\"create()\">\n      <mat-icon>save</mat-icon> Register\n    </button>\n    <button mat-button color=\"primary\" (click)=\"close()\">\n      <mat-icon>cancel</mat-icon> Cancel\n    </button>\n  </mat-dialog-actions>\n</div>\n\n\n\n<ng-template #loading>\n  <mat-spinner style=\"margin:0 auto;\" mode=\"indeterminate\"></mat-spinner>\n</ng-template>\n\n<p>  {{ registrationFormGroup.value | json }} </p>"

/***/ }),

/***/ "./src/app/quonmanager/components/registration-form/registration-form.component.scss":
/*!*******************************************************************************************!*\
  !*** ./src/app/quonmanager/components/registration-form/registration-form.component.scss ***!
  \*******************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column; }\n\n.example-container > * {\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/registration-form/registration-form.component.ts":
/*!*****************************************************************************************!*\
  !*** ./src/app/quonmanager/components/registration-form/registration-form.component.ts ***!
  \*****************************************************************************************/
/*! exports provided: RegistrationFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegistrationFormComponent", function() { return RegistrationFormComponent; });
/* harmony import */ var _services_role_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/role.service */ "./src/app/quonmanager/services/role.service.ts");
/* harmony import */ var _services_employee_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../services/employee.service */ "./src/app/quonmanager/services/employee.service.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./../../services/user.service */ "./src/app/quonmanager/services/user.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var rxjs_operators_startWith__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators/startWith */ "./node_modules/rxjs/_esm5/operators/startWith.js");
/* harmony import */ var rxjs_operators_map__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators/map */ "./node_modules/rxjs/_esm5/operators/map.js");
/* harmony import */ var _common_bad_request_error__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../common/bad-request-error */ "./src/app/common/bad-request-error.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var RegistrationFormComponent = (function () {
    function RegistrationFormComponent(dialogRef, fb, userService, employeeService, roleService, snackBar) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.userService = userService;
        this.employeeService = employeeService;
        this.roleService = roleService;
        this.snackBar = snackBar;
        this.hide1 = true;
        this.hide2 = true;
    }
    RegistrationFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        // create formGroup
        this.registrationFormGroup = this.fb.group({
            employeeNumber: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(7), _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].minLength(7)]),
            password: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].maxLength(10), _angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].minLength(10)]),
            employeeId: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required]),
            userRole: this.fb.group({
                roleId: new _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["Validators"].required])
            })
        });
        // call all employees that are for registrations
        this.employeeService.getByUrl(this.employeeService.urlForRegistration)
            .subscribe(function (response) {
            _this.employees = response.json();
            _this.options = _this.employees.map(function (p) { return p.employeeNumber; });
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_9__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.dialogRef.close();
            }
        });
        // call roles for populate dropdown
        this.roleService.getAll()
            .subscribe(function (response) {
            _this.roles = response.json();
        });
        // autocomplete in input
        this.filteredOptions = this.registrationFormGroup.get('employeeNumber').valueChanges.pipe(Object(rxjs_operators_startWith__WEBPACK_IMPORTED_MODULE_6__["startWith"])(''), Object(rxjs_operators_map__WEBPACK_IMPORTED_MODULE_7__["map"])(function (val) { return _this.filter(val); }));
    };
    RegistrationFormComponent.prototype.create = function () {
        var _this = this;
        this.user = this.registrationFormGroup.value;
        this.userService.create(this.user)
            .subscribe(function (response) {
            _this.snackBar.open('Successful', 'User Created', {
                duration: 2000,
            });
            _this.close();
        }, function (error) {
            if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_8__["BadRequestError"]) {
                _this.registrationFormGroup.setErrors(['BadRequest']);
                _this.snackBar.open('Bad Request!', 'User not created', {
                    duration: 2000,
                });
                _this.close();
            }
            else {
                _this.snackBar.open('Unknown Error!', 'User not created', {
                    duration: 2000,
                });
            }
        });
    };
    RegistrationFormComponent.prototype.close = function () {
        this.dialogRef.close(null);
    };
    RegistrationFormComponent.prototype.onBlur = function () {
        var _this = this;
        var id = +this.employees
            .filter(function (p) { return p.employeeNumber === _this.registrationFormGroup.get('employeeNumber').value; })
            .map(function (p) { return p.id; });
        this.registrationFormGroup.get('employeeId').setValue(id);
    };
    RegistrationFormComponent.prototype.getErrorMessage = function (controlName) {
        if (controlName === 'employeeNumber') {
            return this.registrationFormGroup.get(controlName).hasError('minlength') ? 'You must enter 7 digits' :
                this.registrationFormGroup.get(controlName).hasError('pattern') ? 'You must enter digits only' : '';
        }
        else {
            return this.registrationFormGroup.get(controlName).hasError('required') ? 'You must enter a value' :
                this.registrationFormGroup.get(controlName).hasError('minlength') ? 'You must enter 10 characters' :
                    this.registrationFormGroup.get(controlName).hasError('pattern') ? 'You must enter alphabet characters only' :
                        '';
        }
    };
    RegistrationFormComponent.prototype.filter = function (val) {
        return this.options.filter(function (opt) { return opt.toString().toLowerCase().indexOf(val.toString().toLowerCase()) === 0; });
    };
    RegistrationFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_5__["Component"])({
            selector: 'app-registration-form',
            template: __webpack_require__(/*! ./registration-form.component.html */ "./src/app/quonmanager/components/registration-form/registration-form.component.html"),
            styles: [__webpack_require__(/*! ./registration-form.component.scss */ "./src/app/quonmanager/components/registration-form/registration-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_3__["MatDialogRef"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormBuilder"],
            _services_user_service__WEBPACK_IMPORTED_MODULE_2__["UserService"],
            _services_employee_service__WEBPACK_IMPORTED_MODULE_1__["EmployeeService"],
            _services_role_service__WEBPACK_IMPORTED_MODULE_0__["RoleService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSnackBar"]])
    ], RegistrationFormComponent);
    return RegistrationFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/section-form/section-form.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/section-form/section-form.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n  <mat-toolbar color=\"primary\" class=\"example-container\">\n    <mat-icon style=\"padding-right:4em\">clear_all</mat-icon> {{ heading }}\n  </mat-toolbar>\n\n<br>\n<br>\n\n<form [formGroup]=\"sectionFormGroup\">\n  <mat-dialog-content>\n    <div class=\"example-container\">\n      <!-- Section Name-->\n      <mat-form-field hintLabel=\"atleast 3 characters\">\n        <input matInput placeholder=\"Section\" formControlName=\"name\" required maxlength=\"20\" minlength=\"3\" pattern=\"[a-zA-Z][a-zA-Z .,]+\">\n        <mat-error *ngIf=\"sectionFormGroup.get('name').invalid\">{{getErrorMessage('name')}}</mat-error>\n        <mat-hint align=\"end\">{{sectionFormGroup.get('name').value?.length || 0}}/20</mat-hint>\n      </mat-form-field>\n    \n    </div>\n  </mat-dialog-content>\n\n  <br>\n  <mat-divider></mat-divider>\n  <br>\n\n  <mat-dialog-actions>\n    <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!sectionFormGroup.valid\" (click)=\"create()\">\n      <mat-icon>save</mat-icon> Save\n    </button>\n    <button mat-raised-button color=\"primary\" (click)=\"close()\">\n      <mat-icon>cancel</mat-icon> Cancel\n    </button>      \n  </mat-dialog-actions>\n  \n</form>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/section-form/section-form.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/section-form/section-form.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  margin-top: 0%;\n  padding: 0%;\n  margin-right: 20px;\n  font-family: cursive; }\n\n.example-container > * {\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/section-form/section-form.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/quonmanager/components/section-form/section-form.component.ts ***!
  \*******************************************************************************/
/*! exports provided: SectionFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SectionFormComponent", function() { return SectionFormComponent; });
/* harmony import */ var _services_section_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/section.service */ "./src/app/quonmanager/services/section.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _common_bad_request_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../common/bad-request-error */ "./src/app/common/bad-request-error.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SectionFormComponent = (function () {
    function SectionFormComponent(dialogRef, fb, sectionService, snackBar) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.sectionService = sectionService;
        this.snackBar = snackBar;
        this.heading = 'New Section';
    }
    SectionFormComponent.prototype.ngOnInit = function () {
        this.sectionFormGroup = this.fb.group({
            id: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.section.Id),
            name: new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.section.Name, [_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].minLength(3)])
        });
    };
    SectionFormComponent.prototype.create = function () {
        var _this = this;
        if (this.section.Id == null) {
            this.sectionFormGroup.get('id').disable();
            this.sectionService.create(this.sectionFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'Section Created', {
                    duration: 2000,
                });
                _this.close();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_4__["BadRequestError"]) {
                    _this.sectionFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Section not created', {
                        duration: 2000,
                    });
                    _this.close();
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Section not created', {
                        duration: 2000,
                    });
                }
            });
        }
        else {
            this.sectionService.update(this.sectionFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'Section Updated', {
                    duration: 2000,
                });
                _this.close();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_4__["BadRequestError"]) {
                    _this.sectionFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Section not updated', {
                        duration: 2000,
                    });
                    _this.close();
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Section not updated', {
                        duration: 2000,
                    });
                }
            });
        }
    };
    SectionFormComponent.prototype.close = function () {
        this.dialogRef.close(null);
    };
    SectionFormComponent.prototype.getErrorMessage = function (controlName) {
        return this.sectionFormGroup.get(controlName).hasError('required') ? 'You must enter a value' :
            this.sectionFormGroup.get(controlName).hasError('minlength') ? 'You must enter atleast 3 characters' :
                this.sectionFormGroup.get(controlName).hasError('pattern') ? 'digit is not allowed' :
                    '';
    };
    SectionFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-section-form',
            template: __webpack_require__(/*! ./section-form.component.html */ "./src/app/quonmanager/components/section-form/section-form.component.html"),
            styles: [__webpack_require__(/*! ./section-form.component.scss */ "./src/app/quonmanager/components/section-form/section-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormBuilder"],
            _services_section_service__WEBPACK_IMPORTED_MODULE_0__["SectionService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"]])
    ], SectionFormComponent);
    return SectionFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/section-list/section-list.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/section-list/section-list.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"material\">\n  <mat-card>\n    <div *ngIf=\"sections else loading\" class=\"material\">\n\n      <button mat-raised-button color=\"primary\" (click)=\"AddSectionFormDialog()\" class=\"material\">\n        Add Section\n      </button>\n\n      <br>\n      <br>\n      <mat-divider></mat-divider>\n      <div class=\"example-container mat-elevation-z8\" class=\"material\">\n        <mat-table #table [dataSource]=\"dataSource\">\n\n          <ng-container matColumnDef=\"Name\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Section </mat-header-cell>\n            <mat-cell *matCellDef=\"let section\" class=\"material\"> {{ section.name }}</mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"edit\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Edit </mat-header-cell>\n            <mat-cell *matCellDef=\"let section\">\n              <a mat-button (click)=\"EditSectionFormDialog(section)\">\n                <mat-icon color=\"primary\">edit</mat-icon>\n              </a>\n            </mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"delete\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Delete </mat-header-cell>\n            <mat-cell *matCellDef=\"let section\">\n              <a mat-button (click)=\"EditSectionFormDialog(section)\">\n                <mat-icon color=\"warn\">delete </mat-icon>\n              </a>\n            </mat-cell>\n          </ng-container>\n\n          <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\n          <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\n\n        </mat-table>\n\n        <mat-paginator class=\"material\" [length]=\"length\" [pageSize]=\"pageSize\" [pageSizeOptions]=\"pageSizeOptions\" [pageIndex]=\"pageIndex\"\n          (page)=\"pageEvent = $event; onPaginateChange($event)\">\n        </mat-paginator>\n\n      </div>\n    </div>\n  </mat-card>\n  <ng-template #loading>\n    <mat-progress-spinner style=\"margin:0 auto;\" [mode]=\"behavior\">\n    </mat-progress-spinner>\n  </ng-template>\n</div>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/section-list/section-list.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/section-list/section-list.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n  max-height: 500px;\n  min-width: 300px; }\n\n.mat-table {\n  overflow: auto;\n  max-height: 500px; }\n\n.material {\n  font-family: cursive; }\n\n.material h1, h2, h3, h4, h5 {\n  text-align: center;\n  color: purple; }\n\n.material.mat-paginator {\n  font-style: italic; }\n\n.material.mat-header-cell {\n  font-weight: bold;\n  font-size: medium;\n  color: #3F51B5; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/section-list/section-list.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/quonmanager/components/section-list/section-list.component.ts ***!
  \*******************************************************************************/
/*! exports provided: SectionListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SectionListComponent", function() { return SectionListComponent; });
/* harmony import */ var _section_form_section_form_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../section-form/section-form.component */ "./src/app/quonmanager/components/section-form/section-form.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _models_section__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/section */ "./src/app/quonmanager/models/section.ts");
/* harmony import */ var _services_section_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/section.service */ "./src/app/quonmanager/services/section.service.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var SectionListComponent = (function () {
    function SectionListComponent(sectionService, dialog, snackBar) {
        this.sectionService = sectionService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        // mat-table
        this.displayedColumns = ['Name', 'edit', 'delete'];
        this.pageSize = 10;
        this.pageSizeOptions = [5, 10, 25, 50, 100];
        // loading
        this.behavior = 'indeterminate';
    }
    SectionListComponent.prototype.ngOnInit = function () {
        this.loadRecords(1, this.pageSize);
    };
    SectionListComponent.prototype.onPaginateChange = function ($event) {
        this.loadRecords(this.pageEvent.pageIndex + 1, this.pageEvent.pageSize);
    };
    SectionListComponent.prototype.loadRecords = function (pageIndex, pageSize) {
        var _this = this;
        this.sectionService.get(pageIndex, pageSize)
            .subscribe(function (response) {
            _this.sections = response.json().sections;
            _this.length = response.json().count;
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatTableDataSource"](_this.sections);
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_5__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.behavior = 'determinate';
            }
        });
    };
    SectionListComponent.prototype.AddSectionFormDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_section_form_section_form_component__WEBPACK_IMPORTED_MODULE_0__["SectionFormComponent"], {
            width: '450px'
        });
        dialogRef.componentInstance.section = new _models_section__WEBPACK_IMPORTED_MODULE_3__["Section"]();
        dialogRef.afterClosed().subscribe(function (result) { _this.ngOnInit(); });
    };
    SectionListComponent.prototype.EditSectionFormDialog = function (sectionPassed) {
        var _this = this;
        var dialogRef = this.dialog.open(_section_form_section_form_component__WEBPACK_IMPORTED_MODULE_0__["SectionFormComponent"], { width: '450px' });
        dialogRef.componentInstance.section = new _models_section__WEBPACK_IMPORTED_MODULE_3__["Section"]();
        dialogRef.componentInstance.section.Id = sectionPassed.id;
        dialogRef.componentInstance.section.Name = sectionPassed.name;
        dialogRef.componentInstance.heading = 'Edit Section';
        dialogRef.afterClosed().subscribe(function (result) { _this.ngOnInit(); });
    };
    SectionListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-section-list',
            template: __webpack_require__(/*! ./section-list.component.html */ "./src/app/quonmanager/components/section-list/section-list.component.html"),
            styles: [__webpack_require__(/*! ./section-list.component.scss */ "./src/app/quonmanager/components/section-list/section-list.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_section_service__WEBPACK_IMPORTED_MODULE_4__["SectionService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"]])
    ], SectionListComponent);
    return SectionListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/sidenav/sidenav.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/quonmanager/components/sidenav/sidenav.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<mat-sidenav-container class=\"app-sidenav-container\">\n <!-- <mat-sidenav #sidenav class=\"app-sidenav mat-elevation-z10\" [opened]=\"authService.isLoggedIn()\" [mode]=\"isScreenSmall() ? 'over' : 'side'\"> -->\n  <mat-sidenav #sidenav class=\"app-sidenav mat-elevation-z10\" [opened]=\"!isScreenSmall() && authService.isLoggedIn()\" [mode]=\"isScreenSmall() ? 'over' : 'side'\">\n    <mat-toolbar color=\"primary\" class=\"material\">\n      Gui-Col Sys\n    </mat-toolbar>\n    <mat-nav-list class=\"material\">\n\n        <a mat-list-item [routerLink]=\"['/quonmanager/dashboard']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">dashboard</mat-icon>\n          <span class=\"title\" mat-line>Dashboard</span>\n        </a>\n\n        <a mat-list-item [routerLink]=\"['/quonmanager/station-list']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">location_city</mat-icon>\n          <span class=\"title\" mat-line>Stations</span>\n        </a>\n\n        <a mat-list-item [routerLink]=\"['/quonmanager/position-list']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">local_parking</mat-icon>\n          <span class=\"title\" mat-line>Positions</span>\n        </a>\n\n        <a mat-list-item [routerLink]=\"['/quonmanager/section-list']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">account_balance</mat-icon>\n          <span class=\"title\" mat-line>Sections</span>\n        </a>\n\n        <a mat-list-item [routerLink]=\"['/quonmanager/employee-list']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">group</mat-icon>\n          <span class=\"title\" mat-line>Employees</span>\n        </a>\n\n        <a mat-list-item [routerLink]=\"['/quonmanager/guardian-list']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">vpn_lock</mat-icon>\n          <span class=\"title\" mat-line>Guardians</span>\n        </a>\n\n        <a mat-list-item [routerLink]=\"['/quonmanager/student-list']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">device_hub</mat-icon>\n          <span class=\"title\" mat-line>Students</span>\n        </a>\n\n        <a mat-list-item [routerLink]=\"['/quonmanager/levelsection-list']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">wc</mat-icon>\n          <span class=\"title\" mat-line class=\"material\">Section Assignment</span>\n        </a>\n\n\n\n        <a mat-list-item [routerLink]=\"['/quonmanager']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">vpn_lock</mat-icon>\n          <span class=\"title\" mat-line>Prefect of Disciplines</span>\n        </a>\n\n        <a mat-list-item [routerLink]=\"['/quonmanager']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">local_library</mat-icon>\n          <span class=\"title\" mat-line >Guidance Councilors</span>\n        </a>\n\n        <a mat-list-item [routerLink]=\"['/quonmanager/training-list']\" class=\"material\">\n          <mat-icon mat-list-icon color=\"primary\">local_library</mat-icon>\n          <span class=\"title\" mat-line >Seminars/Trainings</span>\n        </a>\n  \n    </mat-nav-list>\n\n  </mat-sidenav>\n\n\n  <div class=\"app-sidenav-content\">\n    <app-toolbar (toggleSidenav)=\"sidenav.toggle()\"></app-toolbar> \n    <div class=\"wrapper\">\n      <router-outlet></router-outlet>\n    </div>\n  </div>\n</mat-sidenav-container>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/sidenav/sidenav.component.scss":
/*!***********************************************************************!*\
  !*** ./src/app/quonmanager/components/sidenav/sidenav.component.scss ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".app-sidenav-container {\n  flex: 1;\n  position: fixed;\n  width: 100%;\n  min-width: 100%;\n  height: 100%;\n  min-height: 100%; }\n\n.app-sidenav-content {\n  display: flex;\n  height: 100%;\n  flex-direction: column;\n  padding-top: 0%; }\n\n.app-sidenav {\n  width: 270px; }\n\n.wrapper {\n  margin: 50px; }\n\n.material {\n  font-family: cursive;\n  font-weight: bold; }\n\n.material.mat-toolbar {\n  margin-bottom: 0%; }\n\n.material.mat-nav-list {\n  margin-top: 0%; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/sidenav/sidenav.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/quonmanager/components/sidenav/sidenav.component.ts ***!
  \*********************************************************************/
/*! exports provided: SidenavComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SidenavComponent", function() { return SidenavComponent; });
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/auth.service */ "./src/app/quonmanager/services/auth.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SMALL_WIDTH_BREAKPOINT = 720;
var SidenavComponent = (function () {
    function SidenavComponent(zone, authService) {
        var _this = this;
        this.authService = authService;
        this.mediaMatcher = matchMedia("(max-width: " + SMALL_WIDTH_BREAKPOINT + "px)");
        this.mediaMatcher.addListener(function (mql) {
            return zone.run(function () { return _this.mediaMatcher = mql; });
        });
    }
    SidenavComponent.prototype.ngOnInit = function () {
    };
    SidenavComponent.prototype.isScreenSmall = function () {
        return this.mediaMatcher.matches;
    };
    SidenavComponent.prototype.isOpened = function () {
        this.isAuthenticated = this.authService.isLoggedIn();
        if (this.isAuthenticated) {
            return true;
        }
        return false;
    };
    SidenavComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-sidenav',
            template: __webpack_require__(/*! ./sidenav.component.html */ "./src/app/quonmanager/components/sidenav/sidenav.component.html"),
            styles: [__webpack_require__(/*! ./sidenav.component.scss */ "./src/app/quonmanager/components/sidenav/sidenav.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgZone"], _services_auth_service__WEBPACK_IMPORTED_MODULE_0__["AuthService"]])
    ], SidenavComponent);
    return SidenavComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/station-form/station-form.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/station-form/station-form.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-toolbar color=\"primary\">\n  <mat-icon style=\"padding-right:4em\">clear_all</mat-icon> {{ heading }}\n</mat-toolbar>\n\n<br>\n<br>\n\n<form [formGroup]=\"stationFormGroup\">\n  <mat-dialog-content>\n    <div class=\"example-container\">\n      <!-- School ID-->\n      <mat-form-field hintLabel=\"6 digits\">\n        <input matInput placeholder=\"School ID\" formControlName=\"schoolId\"  minlength=\"6\" maxlength=\"6\" pattern=\"[0-9]+\">\n        <mat-error *ngIf=\"stationFormGroup.get('schoolId').invalid\">{{getErrorMessage('schoolId')}}</mat-error>\n        <mat-hint align=\"end\">{{stationFormGroup.get('schoolId').value?.length || 0}}/6</mat-hint>\n      </mat-form-field>\n      <!-- Station ID -->\n      <mat-form-field hintLabel=\"3 digits\">\n        <input matInput placeholder=\"Station ID\" formControlName=\"stationNumber\" required maxlength=\"3\" minlength=\"3\" pattern=\"[0-9]+\">\n        <mat-error *ngIf=\"stationFormGroup.get('stationNumber').invalid\">{{getErrorMessage('stationNumber')}}</mat-error>\n        <mat-hint align=\"end\">{{stationFormGroup.get('stationNumber').value?.length || 0}}/3</mat-hint>\n      </mat-form-field>\n      <!-- Section Name-->\n      <mat-form-field hintLabel=\"atleast 25 characters\">\n        <input matInput placeholder=\"Station\" formControlName=\"name\" required  minlength=\"25\" pattern=\"[a-zA-Z][a-zA-Z ,.]+\">\n        <mat-error *ngIf=\"stationFormGroup.get('name').invalid\">{{getErrorMessage('name')}}</mat-error>\n        <mat-hint align=\"end\">{{stationFormGroup.get('name').value?.length || 0}}/25</mat-hint>\n      </mat-form-field>\n\n    </div>\n  </mat-dialog-content>\n\n  <br>\n  <mat-divider></mat-divider>\n  <br>\n\n  <mat-dialog-actions>\n    <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!stationFormGroup.valid\" (click)=\"create()\">\n      <mat-icon>save</mat-icon> Save\n    </button>\n    <button mat-raised-button color=\"primary\" (click)=\"close()\">\n      <mat-icon>cancel</mat-icon> Cancel\n    </button>\n  </mat-dialog-actions>\n\n</form>"

/***/ }),

/***/ "./src/app/quonmanager/components/station-form/station-form.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/station-form/station-form.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column; }\n\n.example-container > * {\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/station-form/station-form.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/quonmanager/components/station-form/station-form.component.ts ***!
  \*******************************************************************************/
/*! exports provided: StationFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StationFormComponent", function() { return StationFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _services_station_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/station.service */ "./src/app/quonmanager/services/station.service.ts");
/* harmony import */ var _common_bad_request_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../common/bad-request-error */ "./src/app/common/bad-request-error.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var StationFormComponent = (function () {
    function StationFormComponent(dialogRef, fb, stationService, snackBar) {
        this.dialogRef = dialogRef;
        this.fb = fb;
        this.stationService = stationService;
        this.snackBar = snackBar;
        this.heading = 'New Station';
    }
    StationFormComponent.prototype.ngOnInit = function () {
        this.stationFormGroup = this.fb.group({
            id: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.station.Id),
            name: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.station.Name, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(25)]),
            schoolId: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.station.SchoolId, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(6), _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(6)]),
            stationNumber: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.station.StationNumber, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].maxLength(3), _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(3)])
        });
    };
    StationFormComponent.prototype.create = function () {
        var _this = this;
        if (this.station.Id == null) {
            this.stationFormGroup.get('id').disable();
            this.stationService.create(this.stationFormGroup.value)
                .subscribe(function (response) {
                console.log(response);
                _this.snackBar.open('Successful', 'Station Created', {
                    duration: 2000,
                });
                _this.close();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_4__["BadRequestError"]) {
                    _this.stationFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Station not created', {
                        duration: 2000,
                    });
                    _this.close();
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Station not created', {
                        duration: 2000,
                    });
                }
            });
        }
        else {
            this.stationService.update(this.stationFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'Station Updated', {
                    duration: 2000,
                });
                _this.close();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_4__["BadRequestError"]) {
                    _this.stationFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'Station not updated', {
                        duration: 2000,
                    });
                    _this.close();
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'Station not updated', {
                        duration: 2000,
                    });
                }
            });
        }
    };
    StationFormComponent.prototype.close = function () {
        this.dialogRef.close(null);
    };
    StationFormComponent.prototype.getErrorMessage = function (controlName) {
        if (controlName == 'schoolId') {
            return this.stationFormGroup.get(controlName).hasError('required') ? 'You must enter a value' :
                this.stationFormGroup.get(controlName).hasError('minlength') ? 'You must enter 6 digit' :
                    this.stationFormGroup.get(controlName).hasError('pattern') ? 'character is not allowed' :
                        '';
        }
        else if (controlName == 'stationNumber') {
            return this.stationFormGroup.get(controlName).hasError('required') ? 'You must enter a value' :
                this.stationFormGroup.get(controlName).hasError('minlength') ? 'You must enter 3 digit' :
                    this.stationFormGroup.get(controlName).hasError('pattern') ? 'character is not allowed' :
                        '';
        }
        else {
            return this.stationFormGroup.get(controlName).hasError('required') ? 'You must enter a value' :
                this.stationFormGroup.get(controlName).hasError('minlength') ? 'You must enter atleast 25 characters' :
                    this.stationFormGroup.get(controlName).hasError('pattern') ? 'character is not allowed' :
                        '';
        }
    };
    StationFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-station-form',
            template: __webpack_require__(/*! ./station-form.component.html */ "./src/app/quonmanager/components/station-form/station-form.component.html"),
            styles: [__webpack_require__(/*! ./station-form.component.scss */ "./src/app/quonmanager/components/station-form/station-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _services_station_service__WEBPACK_IMPORTED_MODULE_3__["StationService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"]])
    ], StationFormComponent);
    return StationFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/station-list/station-list.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/station-list/station-list.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"material\">\n  <mat-card> \n  \n  <div *ngIf=\"stations else loading\">\n    <button mat-raised-button color=\"primary\" (click)=\"AddStationFormDialog()\" class=\"material\">\n      Add Station\n    </button>\n\n    <br>\n    <br>\n    <mat-divider></mat-divider>\n    <div class=\"example-container mat-elevation-z8\" class=\"material\">\n      <mat-table #table [dataSource]=\"dataSource\">\n\n        <ng-container matColumnDef=\"Station\">\n          <mat-header-cell *matHeaderCellDef class=\"material\"> Station </mat-header-cell>\n          <mat-cell *matCellDef=\"let station\" class=\"material\"> {{ station.name }}</mat-cell>\n        </ng-container>\n\n        <ng-container matColumnDef=\"SchoolId\">\n          <mat-header-cell *matHeaderCellDef class=\"material\"> School ID </mat-header-cell>\n          <mat-cell *matCellDef=\"let station\" class=\"material\"> {{ station.schoolId }}</mat-cell>\n        </ng-container>\n\n        <ng-container matColumnDef=\"StationNumber\">\n          <mat-header-cell *matHeaderCellDef class=\"material\"> ID </mat-header-cell>\n          <mat-cell *matCellDef=\"let station\" class=\"material\"> {{ station.stationNumber }}</mat-cell>\n        </ng-container>\n\n        <ng-container matColumnDef=\"Edit\">\n          <mat-header-cell *matHeaderCellDef class=\"material\"> Edit </mat-header-cell>\n          <mat-cell *matCellDef=\"let station\">\n              <a mat-button (click)=\"EditStationFormDialog(station)\"><mat-icon color=\"primary\">edit</mat-icon> </a> \n          </mat-cell>\n        </ng-container>\n\n        <ng-container matColumnDef=\"Delete\">\n          <mat-header-cell *matHeaderCellDef class=\"material\"> Delete </mat-header-cell>\n          <mat-cell *matCellDef=\"let station\"> \n            <a mat-button (click)=\"EditStationFormDialog(station)\"> <mat-icon color=\"warn\">delete </mat-icon> </a>\n          </mat-cell>\n        </ng-container>\n\n        <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\n        <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\n\n      </mat-table>\n\n      <mat-paginator class=\"material\" [length]=\"length\" [pageSize]=\"pageSize\" [pageSizeOptions]=\"pageSizeOptions\" [pageIndex]=\"pageIndex\" (page)=\"pageEvent = $event; onPaginateChange($event)\">\n      </mat-paginator>\n\n    </div>\n  </div>\n\n  <ng-template #loading>\n    <mat-progress-spinner  style=\"margin:0 auto;\" [mode]=\"behavior\">\n    </mat-progress-spinner>\n  </ng-template>\n</mat-card>\n</div>"

/***/ }),

/***/ "./src/app/quonmanager/components/station-list/station-list.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/station-list/station-list.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n  max-height: 500px;\n  min-width: 300px; }\n\n.mat-table {\n  overflow: auto;\n  max-height: 500px; }\n\n.material {\n  font-family: cursive; }\n\n.material.mat-paginator {\n  font-style: italic; }\n\n.material.mat-header-cell {\n  font-weight: bold;\n  font-size: medium;\n  color: #3F51B5; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/station-list/station-list.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/quonmanager/components/station-list/station-list.component.ts ***!
  \*******************************************************************************/
/*! exports provided: StationListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StationListComponent", function() { return StationListComponent; });
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _models_Station__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/Station */ "./src/app/quonmanager/models/Station.ts");
/* harmony import */ var _services_station_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/station.service */ "./src/app/quonmanager/services/station.service.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _station_form_station_form_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../station-form/station-form.component */ "./src/app/quonmanager/components/station-form/station-form.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var StationListComponent = (function () {
    function StationListComponent(stationService, dialog, snackBar) {
        this.stationService = stationService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        // mat-table
        this.displayedColumns = ['StationNumber', 'SchoolId', 'Station', 'Edit', 'Delete'];
        this.pageSize = 10;
        this.pageSizeOptions = [5, 10, 25, 50, 100];
        // loading
        this.behavior = 'indeterminate';
    }
    StationListComponent.prototype.ngOnInit = function () {
        this.loadRecords(1, this.pageSize);
    };
    StationListComponent.prototype.onPaginateChange = function ($event) {
        this.loadRecords(this.pageEvent.pageIndex + 1, this.pageEvent.pageSize);
    };
    StationListComponent.prototype.loadRecords = function (pageIndex, pageSize) {
        var _this = this;
        this.stationService.get(pageIndex, pageSize)
            .subscribe(function (response) {
            _this.stations = response.json().stations;
            _this.length = response.json().count;
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatTableDataSource"](_this.stations);
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_4__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.behavior = 'determinate';
            }
        });
    };
    StationListComponent.prototype.AddStationFormDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_station_form_station_form_component__WEBPACK_IMPORTED_MODULE_5__["StationFormComponent"], {
            width: '450px'
        });
        dialogRef.componentInstance.station = new _models_Station__WEBPACK_IMPORTED_MODULE_2__["Station"]();
        dialogRef.afterClosed().subscribe(function (result) { _this.ngOnInit(); });
    };
    StationListComponent.prototype.EditStationFormDialog = function (stationPassed) {
        var _this = this;
        var dialogRef = this.dialog.open(_station_form_station_form_component__WEBPACK_IMPORTED_MODULE_5__["StationFormComponent"], { width: '450px' });
        dialogRef.componentInstance.station = new _models_Station__WEBPACK_IMPORTED_MODULE_2__["Station"]();
        dialogRef.componentInstance.station.Id = stationPassed.id;
        dialogRef.componentInstance.station.Name = stationPassed.name;
        dialogRef.componentInstance.station.SchoolId = stationPassed.schoolId;
        dialogRef.componentInstance.station.StationNumber = stationPassed.stationNumber;
        dialogRef.componentInstance.heading = "Edit Station";
        dialogRef.afterClosed().subscribe(function (result) { _this.ngOnInit(); });
    };
    StationListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-station-list',
            template: __webpack_require__(/*! ./station-list.component.html */ "./src/app/quonmanager/components/station-list/station-list.component.html"),
            styles: [__webpack_require__(/*! ./station-list.component.scss */ "./src/app/quonmanager/components/station-list/station-list.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_station_service__WEBPACK_IMPORTED_MODULE_3__["StationService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatDialog"],
            _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatSnackBar"]])
    ], StationListComponent);
    return StationListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/student-form/student-form.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/student-form/student-form.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  student-form works!\n</p>\n\n{{ studentFormGroup.value | json }}"

/***/ }),

/***/ "./src/app/quonmanager/components/student-form/student-form.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/student-form/student-form.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/quonmanager/components/student-form/student-form.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/quonmanager/components/student-form/student-form.component.ts ***!
  \*******************************************************************************/
/*! exports provided: StudentFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StudentFormComponent", function() { return StudentFormComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _services_student_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/student.service */ "./src/app/quonmanager/services/student.service.ts");
/* harmony import */ var _models_person__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../models/person */ "./src/app/quonmanager/models/person.ts");
/* harmony import */ var _models_guardian__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../models/guardian */ "./src/app/quonmanager/models/guardian.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var StudentFormComponent = (function () {
    function StudentFormComponent(fb, studentService, snackBar) {
        this.fb = fb;
        this.studentService = studentService;
        this.snackBar = snackBar;
        this.heading = 'New Student';
    }
    StudentFormComponent.prototype.ngOnInit = function () {
        // prevent error of type undefined
        this.student.Person = new _models_person__WEBPACK_IMPORTED_MODULE_4__["Person"]();
        this.student.Guardian = new _models_guardian__WEBPACK_IMPORTED_MODULE_5__["Guardian"]();
        this.student.Guardian.Person = new _models_person__WEBPACK_IMPORTED_MODULE_4__["Person"]();
        this.studentFormGroup = this.fb.group({
            id: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Id),
            lrnNumber: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.LrnNumber, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
            person: this.fb.group({
                firstName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Person.firstName, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
                middleName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Person.middleName, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
                lastName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Person.lastName, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
                suffixName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Person.suffixName)
            }),
            genderId: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.GenderId, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
            contact: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Contact),
            birthDate: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.BirthDate, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
            studentAddresses: this.fb.array([
                this.studentAddress = this.fb.group({
                    barangayId: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
                    municipalityId: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
                    provinceId: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required])
                })
            ]),
            guardian: this.fb.group({
                person: this.fb.group({
                    title: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Person.title),
                    firstName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Person.firstName, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
                    middleName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Person.middleName, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
                    lastName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Person.lastName, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
                    suffixName: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Person.suffixName)
                }),
                contact: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Guardian.Contact, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]),
                relationId: new _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormControl"](this.student.Guardian.Contact, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required])
            })
        });
    };
    StudentFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-student-form',
            template: __webpack_require__(/*! ./student-form.component.html */ "./src/app/quonmanager/components/student-form/student-form.component.html"),
            styles: [__webpack_require__(/*! ./student-form.component.scss */ "./src/app/quonmanager/components/student-form/student-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"],
            _services_student_service__WEBPACK_IMPORTED_MODULE_3__["StudentService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatSnackBar"]])
    ], StudentFormComponent);
    return StudentFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/student-list/student-list.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/student-list/student-list.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"material\">\r\n    <mat-card>\r\n      <div *ngIf=\"students else loading\" class=\"material\">\r\n        \r\n          <h3>List of Students</h3>\r\n          <mat-divider></mat-divider>\r\n        \r\n          <br>\r\n          <br>\r\n        <button mat-raised-button color=\"primary\" (click)=\"AddStudentFormDialog()\" class=\"material\">\r\n          Add Student\r\n        </button>\r\n    \r\n        <br>\r\n        <br>\r\n        <mat-divider></mat-divider>\r\n        <div class=\"example-container mat-elevation-z8\" class=\"material\">\r\n          <mat-table #table [dataSource]=\"dataSource\">\r\n\r\n            <ng-container matColumnDef=\"LrnNumber\">\r\n              <mat-header-cell *matHeaderCellDef class=\"material\"> Lrn </mat-header-cell>\r\n              <mat-cell *matCellDef=\"let student\" class=\"material\"> {{ student.lrnNumber }} </mat-cell>\r\n            </ng-container>\r\n\r\n            <ng-container matColumnDef=\"Name\">\r\n              <mat-header-cell *matHeaderCellDef class=\"material\"> Name </mat-header-cell>\r\n              <mat-cell *matCellDef=\"let student\" class=\"material\"> {{ student.person.firstName }}  {{ student.person.lastName }}</mat-cell>\r\n            </ng-container>\r\n  \r\n            <ng-container matColumnDef=\"edit\">\r\n              <mat-header-cell *matHeaderCellDef class=\"material\"> Edit </mat-header-cell>\r\n              <mat-cell *matCellDef=\"let student\">\r\n                <a mat-button (click)=\"EditSectionFormDialog(section)\">\r\n                  <mat-icon color=\"primary\">edit</mat-icon>\r\n                </a>\r\n              </mat-cell>\r\n            </ng-container>\r\n\r\n            <ng-container matColumnDef=\"Gender\">\r\n              <mat-header-cell *matHeaderCellDef class=\"material\"> Gender </mat-header-cell>\r\n              <mat-cell *matCellDef=\"let student\" class=\"material\"> {{ student.gender.name }} </mat-cell>\r\n            </ng-container>\r\n  \r\n            <ng-container matColumnDef=\"BirthDate\">\r\n              <mat-header-cell *matHeaderCellDef class=\"material\"> BirthDate </mat-header-cell>\r\n              <mat-cell *matCellDef=\"let student\" class=\"material\"> {{ student.birthDate | date }}   </mat-cell>\r\n            </ng-container>\r\n\r\n            <ng-container matColumnDef=\"delete\">\r\n              <mat-header-cell *matHeaderCellDef class=\"material\"> Delete </mat-header-cell>\r\n              <mat-cell *matCellDef=\"let section\">\r\n                <a mat-button (click)=\"EditSectionFormDialog(section)\">\r\n                  <mat-icon color=\"warn\">delete </mat-icon>\r\n                </a>\r\n              </mat-cell>\r\n            </ng-container>\r\n  \r\n            <mat-header-row *matHeaderRowDef=\"displayedColumns\"></mat-header-row>\r\n            <mat-row *matRowDef=\"let row; columns: displayedColumns;\"></mat-row>\r\n  \r\n          </mat-table>\r\n  \r\n          <mat-paginator class=\"material\" [length]=\"length\" [pageSize]=\"pageSize\" [pageSizeOptions]=\"pageSizeOptions\" [pageIndex]=\"pageIndex\"\r\n            (page)=\"pageEvent = $event; onPaginateChange($event)\">\r\n          </mat-paginator>\r\n  \r\n        </div>\r\n      </div>\r\n    </mat-card>\r\n    <ng-template #loading>\r\n      <mat-progress-spinner style=\"margin:0 auto;\" [mode]=\"behavior\">\r\n      </mat-progress-spinner>\r\n    </ng-template>\r\n  </div>\r\n  "

/***/ }),

/***/ "./src/app/quonmanager/components/student-list/student-list.component.scss":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/student-list/student-list.component.scss ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n  max-height: 500px;\n  min-width: 300px; }\n\n.mat-table {\n  overflow: auto;\n  max-height: 500px; }\n\n.material {\n  font-family: cursive; }\n\n.material h1, h2, h3, h4, h5 {\n  text-align: center;\n  color: purple; }\n\n.material.mat-paginator {\n  font-style: italic; }\n\n.material.mat-header-cell {\n  font-weight: bold;\n  font-size: medium;\n  color: #3F51B5; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/student-list/student-list.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/quonmanager/components/student-list/student-list.component.ts ***!
  \*******************************************************************************/
/*! exports provided: StudentListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StudentListComponent", function() { return StudentListComponent; });
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _models_student__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/student */ "./src/app/quonmanager/models/student.ts");
/* harmony import */ var _services_student_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/student.service */ "./src/app/quonmanager/services/student.service.ts");
/* harmony import */ var _student_form_student_form_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../student-form/student-form.component */ "./src/app/quonmanager/components/student-form/student-form.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var StudentListComponent = (function () {
    function StudentListComponent(studentService, dialog, snackBar) {
        this.studentService = studentService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        // mat-table
        this.displayedColumns = ['LrnNumber', 'Name', 'Gender', 'BirthDate'];
        this.pageSize = 10;
        this.pageSizeOptions = [5, 10, 25, 50, 100];
        // loading
        this.behavior = 'indeterminate';
    }
    StudentListComponent.prototype.ngOnInit = function () {
        this.loadRecords(1, this.pageSize);
    };
    StudentListComponent.prototype.onPaginateChange = function ($event) {
        this.loadRecords(this.pageEvent.pageIndex + 1, this.pageEvent.pageSize);
    };
    StudentListComponent.prototype.loadRecords = function (pageIndex, pageSize) {
        var _this = this;
        this.studentService.get(pageIndex, pageSize)
            .subscribe(function (response) {
            _this.students = response.json().students;
            _this.length = response.json().count;
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatTableDataSource"](_this.students);
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_2__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.behavior = 'determinate';
            }
        });
    };
    StudentListComponent.prototype.AddStudentFormDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_student_form_student_form_component__WEBPACK_IMPORTED_MODULE_5__["StudentFormComponent"], {
            width: '800px'
        });
        dialogRef.componentInstance.student = new _models_student__WEBPACK_IMPORTED_MODULE_3__["Student"]();
        dialogRef.afterClosed().subscribe(function (result) { _this.ngOnInit(); });
    };
    StudentListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-student-list',
            template: __webpack_require__(/*! ./student-list.component.html */ "./src/app/quonmanager/components/student-list/student-list.component.html"),
            styles: [__webpack_require__(/*! ./student-list.component.scss */ "./src/app/quonmanager/components/student-list/student-list.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_student_service__WEBPACK_IMPORTED_MODULE_4__["StudentService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatDialog"],
            _angular_material__WEBPACK_IMPORTED_MODULE_0__["MatSnackBar"]])
    ], StudentListComponent);
    return StudentListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/toolbar/toolbar.component.html":
/*!***********************************************************************!*\
  !*** ./src/app/quonmanager/components/toolbar/toolbar.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-toolbar color=\"primary\" class=\"material\">\n  <button mat-button class=\"sidenav-toggle\" (click)=\"toggleSidenav.emit()\">\n    <mat-icon [hidden] *ngIf=\"authService.isLoggedIn()\">menu</mat-icon>\n  </button>\n  \n  <span class=\"example-spacer\"></span>\n   <span>Welcome {{ name }}!</span>\n  \n  <button mat-button [matMenuTriggerFor]=\"menu\">\n      <mat-icon>more_vert</mat-icon>\n  </button>\n  <mat-menu #menu=\"matMenu\"> \n    <button mat-menu-item (click)=\"openLoginForm()\" *ngIf=\"!authService.isLoggedIn()\" class=\"material\">Login Account</button>\n    <button mat-menu-item (click)=\"openRegistrationForm()\" *ngIf=\"authService.isLoggedIn() && authService.decodedToken.Role=='Administrator'\" class=\"material\">New User</button> \n    <button mat-menu-item (click)=\"authService.logout(); \" *ngIf=\"authService.isLoggedIn()\" [routerLink]=\"['/quonmanager']\" class=\"material\">Logout</button>\n  </mat-menu>\n</mat-toolbar>\n\n\n"

/***/ }),

/***/ "./src/app/quonmanager/components/toolbar/toolbar.component.scss":
/*!***********************************************************************!*\
  !*** ./src/app/quonmanager/components/toolbar/toolbar.component.scss ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-spacer {\n  flex: 1 1 auto; }\n\n.sidenav-toggle {\n  display: none;\n  padding: 0;\n  margin: 8px;\n  min-width: 56px; }\n\n@media (max-width: 720px) {\n    .sidenav-toggle {\n      display: flex;\n      align-items: center;\n      justify-content: center; } }\n\n.sidenav-toggle mat-icon {\n    font-size: 30px;\n    height: 56px;\n    width: 56px;\n    line-height: 56px;\n    color: white; }\n\n.material {\n  font-family: cursive; }\n\nmain {\n  overflow-y: auto; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/toolbar/toolbar.component.ts":
/*!*********************************************************************!*\
  !*** ./src/app/quonmanager/components/toolbar/toolbar.component.ts ***!
  \*********************************************************************/
/*! exports provided: ToolbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ToolbarComponent", function() { return ToolbarComponent; });
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/auth.service */ "./src/app/quonmanager/services/auth.service.ts");
/* harmony import */ var _registration_form_registration_form_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../registration-form/registration-form.component */ "./src/app/quonmanager/components/registration-form/registration-form.component.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _login_form_login_form_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../login-form/login-form.component */ "./src/app/quonmanager/components/login-form/login-form.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ToolbarComponent = (function () {
    function ToolbarComponent(dialog, authService) {
        this.dialog = dialog;
        this.authService = authService;
        this.toggleSidenav = new _angular_core__WEBPACK_IMPORTED_MODULE_3__["EventEmitter"]();
    }
    ToolbarComponent.prototype.ngOnInit = function () { };
    Object.defineProperty(ToolbarComponent.prototype, "stationid", {
        get: function () {
            if (!this.authService.isLoggedIn()) {
                return 'Guest';
            }
            else
                return this.authService.decodedToken.StationId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarComponent.prototype, "station", {
        get: function () {
            if (!this.authService.isLoggedIn()) {
                return 'Guest';
            }
            else
                return this.authService.decodedToken.Station;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarComponent.prototype, "name", {
        get: function () {
            if (!this.authService.isLoggedIn()) {
                return 'Guest';
            }
            else
                return this.authService.decodedToken.given_name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToolbarComponent.prototype, "role", {
        get: function () {
            if (!this.authService.isLoggedIn()) {
                return '';
            }
            else
                return this.authService.decodedToken.Role;
        },
        enumerable: true,
        configurable: true
    });
    ToolbarComponent.prototype.openLoginForm = function () {
        this.dialog.open(_login_form_login_form_component__WEBPACK_IMPORTED_MODULE_4__["LoginFormComponent"], {
            width: '450px'
        });
    };
    ToolbarComponent.prototype.openRegistrationForm = function () {
        this.dialog.open(_registration_form_registration_form_component__WEBPACK_IMPORTED_MODULE_1__["RegistrationFormComponent"], {
            width: '450px'
        });
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Output"])(),
        __metadata("design:type", Object)
    ], ToolbarComponent.prototype, "toggleSidenav", void 0);
    ToolbarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
            selector: 'app-toolbar',
            template: __webpack_require__(/*! ./toolbar.component.html */ "./src/app/quonmanager/components/toolbar/toolbar.component.html"),
            styles: [__webpack_require__(/*! ./toolbar.component.scss */ "./src/app/quonmanager/components/toolbar/toolbar.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_2__["MatDialog"],
            _services_auth_service__WEBPACK_IMPORTED_MODULE_0__["AuthService"]])
    ], ToolbarComponent);
    return ToolbarComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/training-form/training-form.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/training-form/training-form.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"sourceMemos else loading\">\r\n\r\n    <mat-toolbar color=\"primary\">\r\n        <mat-icon style=\"padding-right:15em\">group_add</mat-icon>\r\n        New Training\r\n    </mat-toolbar>\r\n\r\n    <br>\r\n    <br>\r\n\r\n    <form [formGroup]=\"trainingFormGroup\">\r\n        <mat-dialog-content>\r\n\r\n            <mat-accordion>\r\n                <mat-expansion-panel [expanded]=\"panelOpenState\">\r\n                    <mat-expansion-panel-header>\r\n                        <mat-panel-title>\r\n                            Training Information\r\n                        </mat-panel-title>\r\n                        <mat-panel-description>\r\n                            Enter Training Information\r\n                        </mat-panel-description>\r\n                    </mat-expansion-panel-header>\r\n\r\n                    <div class=\"example-container\">\r\n\r\n                        <mat-form-field hintLabel=\"Select Year\">\r\n                            <mat-select placeholder=\"Source Memo\" formControlName=\"sourceMemoId\" required>\r\n                                <mat-option *ngFor=\"let sourceMemo of sourceMemos\" [value]=\"sourceMemo.id\">{{ sourceMemo.name}}</mat-option>\r\n                            </mat-select>\r\n                        </mat-form-field>\r\n\r\n                        <mat-form-field hintLabel=\"Select Year\">\r\n                            <mat-select placeholder=\"Year\" formControlName=\"year\" required>\r\n                                <mat-option [value]=2018>2018</mat-option>\r\n                                <mat-option [value]=2018>2019</mat-option>\r\n                                <mat-option [value]=2018>2020</mat-option>\r\n                            </mat-select>\r\n                        </mat-form-field>\r\n\r\n                        <mat-form-field hintLabel=\"minimum 3 digits\">\r\n                            <input matInput placeholder=\"Memo Number\" formControlName=\"number\" required maxlength=\"7\" minlength=\"3\" pattern=\"[0-9]+\">\r\n                            <mat-error *ngIf=\"trainingFormGroup.get('number').invalid\">{{getErrorMessage('number')}}</mat-error>\r\n                            <mat-hint align=\"end\">{{trainingFormGroup.get('number').value?.length || 0}}/3</mat-hint>\r\n                        </mat-form-field>\r\n\r\n                        <mat-form-field hintLabel=\"Minimum 15 characters\">\r\n                            <input matInput placeholder=\"Seminar / Training\" formControlName=\"title\" required minlength=\"15\" pattern=\"[a-zA-Z][a-zA-Z ]+\">\r\n                            <mat-error *ngIf=\"trainingFormGroup.get('title').invalid\">{{getErrorMessage('title')}}</mat-error>\r\n                            <mat-hint align=\"end\">{{trainingFormGroup.get('title').value?.length || 0}}/15</mat-hint>\r\n                        </mat-form-field>\r\n                        <mat-form-field hintLabel=\"Minimum 15 characters\">\r\n                            <input matInput placeholder=\"Relative Expenses\" formControlName=\"relativeExpenses\" required minlength=\"15\" pattern=\"[a-zA-Z][a-zA-Z ]+\">\r\n                            <mat-error *ngIf=\"trainingFormGroup.get('relativeExpenses').invalid\">{{getErrorMessage('relativeExpenses')}}</mat-error>\r\n                            <mat-hint align=\"end\">{{trainingFormGroup.get('relativeExpenses').value?.length || 0}}/15</mat-hint>\r\n                        </mat-form-field>\r\n\r\n                        <br>\r\n                        <mat-divider></mat-divider>\r\n                        <br>\r\n                    </div>\r\n\r\n                    <br>\r\n                    <mat-divider></mat-divider>\r\n                    <br>\r\n                </mat-expansion-panel>\r\n            </mat-accordion>\r\n            <br>\r\n            <mat-accordion>\r\n                <mat-expansion-panel [expanded]=\"panelOpenState\">\r\n                    <mat-expansion-panel-header>\r\n                        <mat-panel-title>\r\n                            Training Dates\r\n                        </mat-panel-title>\r\n                        <mat-panel-description>\r\n                            Enter Dates\r\n                        </mat-panel-description>\r\n                    </mat-expansion-panel-header>\r\n                    <br>\r\n                    <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!trainingDates.valid\" (click)=\"addTrainingDate()\">New Date</button>\r\n                    <br>\r\n                    <br>\r\n                    <div class=\"example-container\" formArrayName=\"trainingDates\" *ngFor=\"let trainingDate of trainingFormGroup.get('trainingDates').controls; let i=index;\">\r\n\r\n                        <div class=\"example-container\" [formGroupName]=\"i\">\r\n\r\n                            <mat-form-field>\r\n                                <input matInput [matDatepicker]=\"date\" placeholder=\"Date\" formControlName=\"date\" required>\r\n                                <mat-datepicker-toggle matSuffix [for]=\"date\"></mat-datepicker-toggle>\r\n                                <mat-datepicker #date></mat-datepicker>\r\n                            </mat-form-field>\r\n\r\n                            <br>\r\n                            <mat-divider></mat-divider>\r\n                            <a mat-button [disabled]=\"!trainingDates.valid\" (click)=\"deleteTrainingDate(i)\">\r\n                                <mat-icon color=\"warn\">delete </mat-icon>Delete Date</a>\r\n                            <mat-divider></mat-divider>\r\n                            <br>\r\n                        </div>\r\n                    </div>\r\n\r\n                </mat-expansion-panel>\r\n            </mat-accordion>\r\n            <br>\r\n            <mat-accordion>\r\n                <mat-expansion-panel [expanded]=\"panelOpenState\">\r\n                    <mat-expansion-panel-header>\r\n                        <mat-panel-title>\r\n                            Training Venue\r\n                        </mat-panel-title>\r\n                        <mat-panel-description>\r\n                            Enter Venue\r\n                        </mat-panel-description>\r\n                    </mat-expansion-panel-header>\r\n                    <br>\r\n                    <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!trainingVenues.valid\" (click)=\"addTrainingVenue()\">New Venue</button>\r\n                    <br>\r\n                    <br>\r\n                    <div class=\"example-container\" formArrayName=\"trainingVenues\" *ngFor=\"let trainingVenue of trainingFormGroup.get('trainingVenues').controls; let i=index;\">\r\n\r\n                        <div class=\"example-container\" [formGroupName]=\"i\">\r\n\r\n                            <mat-form-field hintLabel=\"Minimum 5 characters\">\r\n                                <input matInput placeholder=\"Venue\" formControlName=\"venue\" required minlength=\"5\" pattern=\"[a-zA-Z][a-zA-Z ]+\">\r\n                            </mat-form-field>\r\n                            <br>\r\n                            <mat-divider></mat-divider>\r\n                            <a mat-button [disabled]=\"!trainingVenues.valid\" (click)=\"deleteTrainingVenue(i)\">\r\n                                <mat-icon color=\"warn\">delete </mat-icon>Delete Venue</a>\r\n                            <mat-divider></mat-divider>\r\n                            <br>\r\n                        </div>\r\n                    </div>\r\n\r\n                </mat-expansion-panel>\r\n\r\n            </mat-accordion>\r\n            <br>\r\n            <mat-accordion>\r\n                <mat-expansion-panel [expanded]=\"panelOpenState\">\r\n                    <mat-expansion-panel-header>\r\n                        <mat-panel-title>\r\n                            Training Speaker\r\n                        </mat-panel-title>\r\n                        <mat-panel-description>\r\n                            Enter Speaker\r\n                        </mat-panel-description>\r\n                    </mat-expansion-panel-header>\r\n                    <br>\r\n                    <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!trainingSpeakers.valid\" (click)=\"addTrainingSpeaker()\">New Speaker</button>\r\n                    <br>\r\n                    <br>\r\n                    <div class=\"example-container\" formArrayName=\"trainingSpeakers\" *ngFor=\"let trainingSpeaker of trainingFormGroup.get('trainingSpeakers').controls; let i=index;\">\r\n\r\n                        <div class=\"example-container\" [formGroupName]=\"i\">\r\n\r\n\r\n                            <mat-form-field hintLabel=\"Select Speaker\">\r\n                                <mat-select placeholder=\"Speaker\" formControlName=\"speakerId\" required>\r\n                                    <mat-option *ngFor=\"let speaker of speakers\" [value]=\"speaker.id\">{{ speaker.title}} {{ speaker.firstName}} {{ speaker.middleName}} {{ speaker.lastName}}\r\n                                        {{ speaker.suffixName }}</mat-option>\r\n                                </mat-select>\r\n                            </mat-form-field>\r\n\r\n                            <mat-form-field hintLabel=\"Minimum 15 characters\">\r\n                                <input matInput placeholder=\"Topic\" formControlName=\"topic\" required minlength=\"15\" pattern=\"[a-zA-Z][a-zA-Z ]+\">\r\n                            </mat-form-field>\r\n                            <br>\r\n                            <mat-divider></mat-divider>\r\n                            <a mat-button [disabled]=\"!trainingSpeakers.valid\" (click)=\"deleteTrainingSpeaker(i)\">\r\n                                <mat-icon color=\"warn\">delete </mat-icon>Delete Speaker</a>\r\n                            <mat-divider></mat-divider>\r\n                            <br>\r\n                        </div>\r\n                    </div>\r\n\r\n                </mat-expansion-panel>\r\n\r\n            </mat-accordion>\r\n\r\n        </mat-dialog-content>\r\n    </form>\r\n    <br>\r\n    <br>\r\n    <mat-dialog-actions>\r\n        <button mat-raised-button color=\"primary\" color=\"primary\" [disabled]=\"!trainingFormGroup.valid\" (click)=\"create()\">\r\n            <mat-icon>save</mat-icon> Save\r\n        </button>\r\n        <button mat-raised-button color=\"primary\" (click)=\"redirectToList()\">\r\n            <mat-icon>cancel</mat-icon> Cancel\r\n        </button>\r\n    </mat-dialog-actions>\r\n</div>\r\n\r\n<ng-template #loading>\r\n    <mat-spinner style=\"margin:0 auto;\" mode=\"indeterminate\"></mat-spinner>\r\n</ng-template>\r\n\r\n"

/***/ }),

/***/ "./src/app/quonmanager/components/training-form/training-form.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/training-form/training-form.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column; }\n\n.example-container > * {\n  width: 100%; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/training-form/training-form.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/training-form/training-form.component.ts ***!
  \*********************************************************************************/
/*! exports provided: TrainingFormComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrainingFormComponent", function() { return TrainingFormComponent; });
/* harmony import */ var _common_bad_request_error__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../../common/bad-request-error */ "./src/app/common/bad-request-error.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _services_training_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./../../services/training.service */ "./src/app/quonmanager/services/training.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _models_training__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../models/training */ "./src/app/quonmanager/models/training.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var TrainingFormComponent = (function () {
    function TrainingFormComponent(fb, trainingService, snackBar, router, route) {
        var _this = this;
        this.fb = fb;
        this.trainingService = trainingService;
        this.snackBar = snackBar;
        this.router = router;
        this.route = route;
        this.panelOpenState = true;
        this.route.params.subscribe(function (params) { return _this.id = params['id']; });
    }
    Object.defineProperty(TrainingFormComponent.prototype, "trainingDates", {
        get: function () {
            return this.trainingFormGroup.get('trainingDates');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrainingFormComponent.prototype, "trainingVenues", {
        get: function () {
            return this.trainingFormGroup.get('trainingVenues');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TrainingFormComponent.prototype, "trainingSpeakers", {
        get: function () {
            return this.trainingFormGroup.get('trainingSpeakers');
        },
        enumerable: true,
        configurable: true
    });
    TrainingFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.createFormGroup();
        this.populateSourceMemo();
        this.populateSpeaker();
        if (this.id != null) {
            this.trainingService.getById(this.id)
                .subscribe(function (response) {
                _this.training = response.json();
                _this.populateForm();
            }, function (error) {
                if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_1__["NoConnectionError"]) {
                    _this.snackBar.open('Loading Failed', 'No Connection', {
                        duration: 2000,
                    });
                }
            });
        }
    };
    TrainingFormComponent.prototype.createFormGroup = function () {
        this.training = new _models_training__WEBPACK_IMPORTED_MODULE_7__["Training"]();
        this.trainingFormGroup = this.fb.group({
            id: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.training.id),
            title: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.training.title, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].minLength(15)]),
            sourceMemoId: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.training.sourceMemoId, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]),
            year: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.training.year, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]),
            number: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.training.number, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]),
            relativeExpenses: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.training.relativeExpenses, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].minLength(3)]),
            trainingDates: this.fb.array([this.createTrainingDate()]),
            trainingVenues: this.fb.array([this.createTrainingVenue()]),
            trainingSpeakers: this.fb.array([this.createTrainingSpeaker()])
        });
    };
    TrainingFormComponent.prototype.createTrainingDate = function () {
        return this.fb.group({
            id: 0,
            trainingId: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.training.id),
            date: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required])
        });
    };
    TrainingFormComponent.prototype.createTrainingVenue = function () {
        return this.fb.group({
            id: 0,
            trainingId: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.training.id),
            venue: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required])
        });
    };
    TrainingFormComponent.prototype.createTrainingSpeaker = function () {
        return this.fb.group({
            id: 0,
            trainingId: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"](this.training.id),
            speakerId: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required]),
            topic: new _angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormControl"]('', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["Validators"].required])
        });
    };
    TrainingFormComponent.prototype.addTrainingDate = function () {
        this.trainingDates.push(this.createTrainingDate());
    };
    TrainingFormComponent.prototype.addTrainingVenue = function () {
        this.trainingVenues.push(this.createTrainingVenue());
    };
    TrainingFormComponent.prototype.addTrainingSpeaker = function () {
        this.trainingSpeakers.push(this.createTrainingSpeaker());
    };
    TrainingFormComponent.prototype.deleteTrainingDate = function (index) {
        this.trainingDates.removeAt(index);
    };
    TrainingFormComponent.prototype.deleteTrainingVenue = function (index) {
        this.trainingVenues.removeAt(index);
    };
    TrainingFormComponent.prototype.deleteTrainingSpeaker = function (index) {
        this.trainingSpeakers.removeAt(index);
    };
    TrainingFormComponent.prototype.populateSourceMemo = function () {
        var _this = this;
        var urlSourceMemos = this.trainingService.sourceMemos;
        this.trainingService.getByUrl(urlSourceMemos)
            .subscribe(function (response) {
            _this.sourceMemos = response.json().sourceMemos;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_1__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    TrainingFormComponent.prototype.populateSpeaker = function () {
        var _this = this;
        var urlSpeakers = this.trainingService.speakers;
        this.trainingService.getByUrl(urlSpeakers)
            .subscribe(function (response) {
            _this.speakers = response.json().speakers;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_1__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
            }
        });
    };
    TrainingFormComponent.prototype.populateForm = function () {
        var _this = this;
        this.trainingFormGroup.patchValue({
            id: this.training.id,
            title: this.training.title,
            sourceMemoId: this.training.sourceMemoId,
            year: this.training.year,
            number: this.training.number,
            relativeExpenses: this.training.relativeExpenses
        });
        this.trainingDates.removeAt(0);
        this.trainingVenues.removeAt(0);
        this.trainingSpeakers.removeAt(0);
        this.training.trainingDates.forEach(function (element) {
            var trainingDate = _this.createTrainingDate();
            trainingDate.patchValue(element);
            _this.trainingDates.push(trainingDate);
        });
        this.training.trainingSpeakers.forEach(function (element) {
            var trainingSpeaker = _this.createTrainingSpeaker();
            trainingSpeaker.patchValue(element);
            _this.trainingSpeakers.push(trainingSpeaker);
        });
        this.training.trainingVenues.forEach(function (element) {
            var trainingVenue = _this.createTrainingVenue();
            trainingVenue.patchValue(element);
            _this.trainingVenues.push(trainingVenue);
        });
    };
    TrainingFormComponent.prototype.create = function () {
        var _this = this;
        // convert all date inputs | bug in matDatePicker
        this.convertDateInputs();
        // check the employee.id if has value if it is for creating or updating
        if (this.training.id == null) {
            // disable ids that are unneccessary
            this.disableIdsinForm();
            this.trainingService.create(this.trainingFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'training Created', {
                    duration: 2000,
                });
                _this.redirectToList();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_0__["BadRequestError"]) {
                    _this.trainingFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'training not Created', {
                        duration: 2000,
                    });
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'training not Created', {
                        duration: 2000,
                    });
                }
            });
        }
        else {
            this.trainingService.update(this.trainingFormGroup.value)
                .subscribe(function (response) {
                _this.snackBar.open('Successful!', 'training Updated', {
                    duration: 2000,
                });
                _this.redirectToList();
            }, function (error) {
                if (error instanceof _common_bad_request_error__WEBPACK_IMPORTED_MODULE_0__["BadRequestError"]) {
                    _this.trainingFormGroup.setErrors(['BadRequest']);
                    _this.snackBar.open('Bad Request!', 'training not Updated', {
                        duration: 2000,
                    });
                }
                else {
                    _this.snackBar.open('Unknown Error!', 'training not Updated', {
                        duration: 2000,
                    });
                }
            });
        }
    };
    // matDatapicker bug solution
    TrainingFormComponent.prototype.convertDateInputs = function () {
        for (var index = 0; index < this.trainingDates.length; index++) {
            var trainingDate = new Date(this.trainingDates.at(index).get('date').value);
            // Date
            var convertedDate = this.convertDate(trainingDate);
            this.trainingDates.at(index).get('date').setValue(convertedDate);
        }
    };
    // convert date to current date
    TrainingFormComponent.prototype.convertDate = function (dateToConvert) {
        var convertedDate = dateToConvert.setMinutes((dateToConvert.getTimezoneOffset() * -1));
        return new Date(convertedDate);
    };
    // disable ids in form for creating
    TrainingFormComponent.prototype.disableIdsinForm = function () {
        this.trainingFormGroup.get('id').disable();
        for (var index = 0; index < this.trainingDates.length; index++) {
            this.trainingDates.at(index).get('id').disable();
            this.trainingDates.at(index).get('trainingId').disable();
        }
        // loop and disable the ids in employeeStations
        for (var index = 0; index < this.trainingSpeakers.length; index++) {
            this.trainingSpeakers.at(index).get('id').disable();
            this.trainingSpeakers.at(index).get('trainingId').disable();
        }
        for (var index = 0; index < this.trainingVenues.length; index++) {
            this.trainingVenues.at(index).get('id').disable();
            this.trainingVenues.at(index).get('trainingId').disable();
        }
    };
    // back to employee-list
    TrainingFormComponent.prototype.redirectToList = function () {
        this.router.navigate(['/quonmanager/training-list']);
    };
    TrainingFormComponent.prototype.getErrorMessage = function (controlName) {
        return this.trainingFormGroup.get(controlName).hasError('required') ? 'You must enter or select a value' :
            this.trainingFormGroup.get(controlName).hasError('minlength') ? 'You must enter atleast 15 characters' :
                '';
    };
    TrainingFormComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_6__["Component"])({
            selector: 'app-training-form',
            template: __webpack_require__(/*! ./training-form.component.html */ "./src/app/quonmanager/components/training-form/training-form.component.html"),
            styles: [__webpack_require__(/*! ./training-form.component.scss */ "./src/app/quonmanager/components/training-form/training-form.component.scss")]
        }),
        __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_5__["FormBuilder"],
            _services_training_service__WEBPACK_IMPORTED_MODULE_4__["TrainingService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_3__["MatSnackBar"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"]])
    ], TrainingFormComponent);
    return TrainingFormComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/components/training-list/training-list.component.html":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/training-list/training-list.component.html ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"material\">\n  <mat-card>\n    <div *ngIf=\"trainings else loading\">\n      <button mat-raised-button color=\"primary\" [routerLink]=\"['/quonmanager/training-form']\" class=\"material\">\n        Add Seminar/Training\n      </button>\n\n      <br>\n      <br>\n      <mat-divider></mat-divider>\n      <mat-accordion>\n        <mat-expansion-panel  class=\"example-container\" #matExpansionPanel>\n          <mat-expansion-panel-header>\n            <mat-panel-title>\n            </mat-panel-title>\n            <mat-panel-description style=\"font-family: cursive\">\n                Search Options\n              </mat-panel-description>\n          </mat-expansion-panel-header>\n          <div class=\"example-container material\">\n            <mat-form-field hintLabel=\"characters\" style=\"font-family: cursive\">\n              <input matInput placeholder=\"title\" [(ngModel)]=\"trainingQuery.title\" style=\"font-family: cursive\">\n            </mat-form-field>\n          </div>\n          <br>\n          <mat-action-row>\n            <button mat-raised-button color=\"primary\" (click)=\"search(matExpansionPanel, paginator)\">Search</button>\n            <button mat-raised-button color=\"primary\" (click)=\"reset(matExpansionPanel, paginator)\">Reset</button>\n        </mat-action-row>\n        </mat-expansion-panel>\n      </mat-accordion>\n      <br>\n      <mat-divider></mat-divider>\n      <div class=\"material\">\n        <mat-table #table [dataSource]=\"dataSource\">\n          <!-- Name Column -->\n          <ng-container matColumnDef=\"ID\">\n            <mat-header-cell *matHeaderCellDef>ID </mat-header-cell>\n              <mat-cell *matCellDef=\"let training\" class=\"material\"> {{ training.sourceMemo.name }}: {{ training.year }} - {{ training.number }}</mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"Title\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Title </mat-header-cell>\n            <mat-cell *matCellDef=\"let training\" class=\"material\"> \n                <a mat-line [routerLink]=\"['/quonmanager/participant-form', training.id]\"> {{ training.title }} </a>   \n            </mat-cell>\n          </ng-container>\n\n          <ng-container matColumnDef=\"Edit\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Edit </mat-header-cell>\n            <mat-cell *matCellDef=\"let training\">\n                <a mat-button [routerLink]=\"['/quonmanager/training-form', training.id]\"><mat-icon color=\"primary\">edit</mat-icon> </a> \n            </mat-cell>\n          </ng-container>\n  \n          <ng-container matColumnDef=\"Delete\">\n            <mat-header-cell *matHeaderCellDef class=\"material\"> Delete </mat-header-cell>\n            <mat-cell *matCellDef=\"let training\"> \n              <a mat-button (click)=\"DeleteTraining(training.id)\"> <mat-icon color=\"warn\">delete </mat-icon> </a>\n            </mat-cell>\n          </ng-container>\n\n          <mat-header-row *matHeaderRowDef=\"displayedColumns\" class=\"material\"></mat-header-row>\n          <mat-row *matRowDef=\"let row; columns: displayedColumns;\" class=\"material\"></mat-row>\n\n        </mat-table>\n\n        <mat-paginator #paginator [length]=\"trainingQuery.length\" [pageSize]=\"trainingQuery.pageSize\" [pageSizeOptions]=\"pageSizeOptions\" [pageIndex]=\"pageIndex\" (page)=\"pageEvent = $event; onPaginateChange($event)\"\n          class=\"material\">\n        </mat-paginator>\n\n      </div>\n\n    </div>\n\n    <ng-template #loading>\n      <mat-progress-spinner style=\"margin:0 auto;\" [mode]=\"behavior\"></mat-progress-spinner>\n    </ng-template>\n  </mat-card>\n</div>\n"

/***/ }),

/***/ "./src/app/quonmanager/components/training-list/training-list.component.scss":
/*!***********************************************************************************!*\
  !*** ./src/app/quonmanager/components/training-list/training-list.component.scss ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-container {\n  display: flex;\n  flex-direction: column;\n  max-height: 500px;\n  min-width: 300px; }\n\n.mat-table {\n  overflow: auto;\n  max-height: 500px; }\n\n.mat-column-EmployeeNumber {\n  flex: 0 0 20%; }\n\n.mat-column-Name {\n  flex: 0 0 30%; }\n\n.mat-column-Delete {\n  flex: 0 0 25%; }\n\n.mat-column-Edit {\n  flex: 0 0 25%; }\n\n.material {\n  font-family: cursive; }\n\n.material mat-paginator {\n  font-style: italic; }\n\n.material mat-header-cell {\n  font-weight: bold;\n  font-size: medium;\n  color: #3F51B5; }\n"

/***/ }),

/***/ "./src/app/quonmanager/components/training-list/training-list.component.ts":
/*!*********************************************************************************!*\
  !*** ./src/app/quonmanager/components/training-list/training-list.component.ts ***!
  \*********************************************************************************/
/*! exports provided: TrainingListComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrainingListComponent", function() { return TrainingListComponent; });
/* harmony import */ var _services_training_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/training.service */ "./src/app/quonmanager/services/training.service.ts");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _models_trainingQuery__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../models/trainingQuery */ "./src/app/quonmanager/models/trainingQuery.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var TrainingListComponent = (function () {
    function TrainingListComponent(trainingService, dialog, snackBar) {
        this.trainingService = trainingService;
        this.dialog = dialog;
        this.snackBar = snackBar;
        this.trainingQuery = new _models_trainingQuery__WEBPACK_IMPORTED_MODULE_3__["TrainingQuery"]();
        this.displayedColumns = ['ID', 'Title', 'Edit', 'Delete'];
        this.pageSizeOptions = [5, 10, 25, 50, 100];
        this.pageIndex = 0;
        this.pageSize = 5;
        this.behavior = 'indeterminate';
    }
    TrainingListComponent.prototype.ngOnInit = function () {
        this.trainingQuery.pageIndex = this.pageIndex + 1;
        this.trainingQuery.pageSize = this.pageSize;
        this.loadRecords(this.trainingQuery);
    };
    TrainingListComponent.prototype.loadRecords = function (trainingQuery) {
        var _this = this;
        this.trainingService.all(trainingQuery)
            .subscribe(function (response) {
            _this.trainings = response.json().trainings;
            _this.dataSource = new _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatTableDataSource"](_this.trainings);
            _this.trainingQuery.length = response.json().count;
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_4__["NoConnectionError"]) {
                _this.snackBar.open('Loading Failed', 'No Connection', {
                    duration: 2000,
                });
                _this.behavior = 'determinate';
            }
        });
    };
    TrainingListComponent.prototype.onPaginateChange = function ($event) {
        this.pageSize = this.pageEvent.pageSize;
        this.pageIndex = this.pageEvent.pageIndex;
        this.ngOnInit();
    };
    TrainingListComponent.prototype.search = function (matExpansionPanel, paginator) {
        this.onFilterChange(matExpansionPanel, paginator);
    };
    TrainingListComponent.prototype.reset = function (matExpansionPanel, paginator) {
        this.trainingQuery = new _models_trainingQuery__WEBPACK_IMPORTED_MODULE_3__["TrainingQuery"]();
        this.onFilterChange(matExpansionPanel, paginator);
    };
    TrainingListComponent.prototype.onFilterChange = function (matExpansionPanel, paginator) {
        matExpansionPanel.close();
        this.trainingQuery.pageIndex = 1;
        this.trainingQuery.pageSize = this.pageSize;
        this.loadRecords(this.trainingQuery);
        paginator.pageIndex = 0;
    };
    TrainingListComponent.prototype.DeleteTraining = function (id) {
        var _this = this;
        this.trainingService.delete(id)
            .subscribe(function (response) {
            _this.snackBar.open('Training Deleted', 'Successful', {
                duration: 2000,
            });
            _this.ngOnInit();
        }, function (error) {
            if (error instanceof _common_no_connection_error__WEBPACK_IMPORTED_MODULE_4__["NoConnectionError"]) {
                _this.snackBar.open('Training not Deleted', 'Failed', {
                    duration: 2000,
                });
            }
        });
    };
    TrainingListComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["Component"])({
            selector: 'app-training-list',
            template: __webpack_require__(/*! ./training-list.component.html */ "./src/app/quonmanager/components/training-list/training-list.component.html"),
            styles: [__webpack_require__(/*! ./training-list.component.scss */ "./src/app/quonmanager/components/training-list/training-list.component.scss")]
        }),
        __metadata("design:paramtypes", [_services_training_service__WEBPACK_IMPORTED_MODULE_0__["TrainingService"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"]])
    ], TrainingListComponent);
    return TrainingListComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/EmployeeQuery.ts":
/*!*****************************************************!*\
  !*** ./src/app/quonmanager/models/EmployeeQuery.ts ***!
  \*****************************************************/
/*! exports provided: EmployeeQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EmployeeQuery", function() { return EmployeeQuery; });
var EmployeeQuery = (function () {
    function EmployeeQuery() {
    }
    return EmployeeQuery;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/Position.ts":
/*!************************************************!*\
  !*** ./src/app/quonmanager/models/Position.ts ***!
  \************************************************/
/*! exports provided: Position */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Position", function() { return Position; });
var Position = (function () {
    function Position() {
    }
    return Position;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/Station.ts":
/*!***********************************************!*\
  !*** ./src/app/quonmanager/models/Station.ts ***!
  \***********************************************/
/*! exports provided: Station */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Station", function() { return Station; });
var Station = (function () {
    function Station() {
    }
    return Station;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/employee.ts":
/*!************************************************!*\
  !*** ./src/app/quonmanager/models/employee.ts ***!
  \************************************************/
/*! exports provided: Employee */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Employee", function() { return Employee; });
var Employee = (function () {
    function Employee() {
    }
    return Employee;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/guardian.ts":
/*!************************************************!*\
  !*** ./src/app/quonmanager/models/guardian.ts ***!
  \************************************************/
/*! exports provided: Guardian */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Guardian", function() { return Guardian; });
var Guardian = (function () {
    function Guardian() {
    }
    return Guardian;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/levelsection.ts":
/*!****************************************************!*\
  !*** ./src/app/quonmanager/models/levelsection.ts ***!
  \****************************************************/
/*! exports provided: LevelSection */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelSection", function() { return LevelSection; });
var LevelSection = (function () {
    function LevelSection() {
    }
    return LevelSection;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/participant.ts":
/*!***************************************************!*\
  !*** ./src/app/quonmanager/models/participant.ts ***!
  \***************************************************/
/*! exports provided: Participant */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Participant", function() { return Participant; });
var Participant = (function () {
    function Participant() {
    }
    return Participant;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/participantQuery.ts":
/*!********************************************************!*\
  !*** ./src/app/quonmanager/models/participantQuery.ts ***!
  \********************************************************/
/*! exports provided: ParticipantQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParticipantQuery", function() { return ParticipantQuery; });
var ParticipantQuery = (function () {
    function ParticipantQuery() {
    }
    return ParticipantQuery;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/person.ts":
/*!**********************************************!*\
  !*** ./src/app/quonmanager/models/person.ts ***!
  \**********************************************/
/*! exports provided: Person */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Person", function() { return Person; });
var Person = (function () {
    function Person() {
    }
    return Person;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/section.ts":
/*!***********************************************!*\
  !*** ./src/app/quonmanager/models/section.ts ***!
  \***********************************************/
/*! exports provided: Section */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Section", function() { return Section; });
var Section = (function () {
    function Section() {
    }
    return Section;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/sectionAdviser.ts":
/*!******************************************************!*\
  !*** ./src/app/quonmanager/models/sectionAdviser.ts ***!
  \******************************************************/
/*! exports provided: SectionAdviser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SectionAdviser", function() { return SectionAdviser; });
var SectionAdviser = (function () {
    function SectionAdviser() {
    }
    return SectionAdviser;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/sourceMemo.ts":
/*!**************************************************!*\
  !*** ./src/app/quonmanager/models/sourceMemo.ts ***!
  \**************************************************/
/*! exports provided: SourceMemo */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SourceMemo", function() { return SourceMemo; });
var SourceMemo = (function () {
    function SourceMemo() {
    }
    return SourceMemo;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/student.ts":
/*!***********************************************!*\
  !*** ./src/app/quonmanager/models/student.ts ***!
  \***********************************************/
/*! exports provided: Student */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Student", function() { return Student; });
var Student = (function () {
    function Student() {
    }
    return Student;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/training.ts":
/*!************************************************!*\
  !*** ./src/app/quonmanager/models/training.ts ***!
  \************************************************/
/*! exports provided: Training */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Training", function() { return Training; });
var Training = (function () {
    function Training() {
    }
    return Training;
}());



/***/ }),

/***/ "./src/app/quonmanager/models/trainingQuery.ts":
/*!*****************************************************!*\
  !*** ./src/app/quonmanager/models/trainingQuery.ts ***!
  \*****************************************************/
/*! exports provided: TrainingQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrainingQuery", function() { return TrainingQuery; });
var TrainingQuery = (function () {
    function TrainingQuery() {
    }
    return TrainingQuery;
}());



/***/ }),

/***/ "./src/app/quonmanager/quonmanager-app.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/quonmanager/quonmanager-app.component.ts ***!
  \**********************************************************/
/*! exports provided: QuonmanagerAppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuonmanagerAppComponent", function() { return QuonmanagerAppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/esm5/platform-browser.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var QuonmanagerAppComponent = (function () {
    function QuonmanagerAppComponent(iconRegistry, sanitizer) {
        iconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl('assets/avatars.svg'));
    }
    QuonmanagerAppComponent.prototype.ngOnInit = function () {
    };
    QuonmanagerAppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-quonmanager',
            template: "\n    <app-sidenav> </app-sidenav>\n  ",
            styles: []
        }),
        __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatIconRegistry"], _angular_platform_browser__WEBPACK_IMPORTED_MODULE_2__["DomSanitizer"]])
    ], QuonmanagerAppComponent);
    return QuonmanagerAppComponent;
}());



/***/ }),

/***/ "./src/app/quonmanager/quonmanager.module.ts":
/*!***************************************************!*\
  !*** ./src/app/quonmanager/quonmanager.module.ts ***!
  \***************************************************/
/*! exports provided: QuonmanagerModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QuonmanagerModule", function() { return QuonmanagerModule; });
/* harmony import */ var _services_participant_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services/participant.service */ "./src/app/quonmanager/services/participant.service.ts");
/* harmony import */ var _services_training_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./services/training.service */ "./src/app/quonmanager/services/training.service.ts");
/* harmony import */ var _components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/page-not-found/page-not-found.component */ "./src/app/quonmanager/components/page-not-found/page-not-found.component.ts");
/* harmony import */ var _services_levelsection_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./services/levelsection.service */ "./src/app/quonmanager/services/levelsection.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/esm5/common.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/esm5/http.js");
/* harmony import */ var _material_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../material.module */ "./src/material.module.ts");
/* harmony import */ var _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/flex-layout */ "./node_modules/@angular/flex-layout/esm5/flex-layout.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/esm5/forms.js");
/* harmony import */ var _quonmanager_app_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./quonmanager-app.component */ "./src/app/quonmanager/quonmanager-app.component.ts");
/* harmony import */ var _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/toolbar/toolbar.component */ "./src/app/quonmanager/components/toolbar/toolbar.component.ts");
/* harmony import */ var _components_main_content_main_content_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/main-content/main-content.component */ "./src/app/quonmanager/components/main-content/main-content.component.ts");
/* harmony import */ var _components_sidenav_sidenav_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/sidenav/sidenav.component */ "./src/app/quonmanager/components/sidenav/sidenav.component.ts");
/* harmony import */ var _components_employee_list_employee_list_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/employee-list/employee-list.component */ "./src/app/quonmanager/components/employee-list/employee-list.component.ts");
/* harmony import */ var _components_employee_form_employee_form_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/employee-form/employee-form.component */ "./src/app/quonmanager/components/employee-form/employee-form.component.ts");
/* harmony import */ var _components_principal_form_principal_form_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/principal-form/principal-form.component */ "./src/app/quonmanager/components/principal-form/principal-form.component.ts");
/* harmony import */ var _components_principal_list_principal_list_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/principal-list/principal-list.component */ "./src/app/quonmanager/components/principal-list/principal-list.component.ts");
/* harmony import */ var _components_adviser_list_adviser_list_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./components/adviser-list/adviser-list.component */ "./src/app/quonmanager/components/adviser-list/adviser-list.component.ts");
/* harmony import */ var _components_adviser_form_adviser_form_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./components/adviser-form/adviser-form.component */ "./src/app/quonmanager/components/adviser-form/adviser-form.component.ts");
/* harmony import */ var _components_prefectofdiscipline_form_prefectofdiscipline_form_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./components/prefectofdiscipline-form/prefectofdiscipline-form.component */ "./src/app/quonmanager/components/prefectofdiscipline-form/prefectofdiscipline-form.component.ts");
/* harmony import */ var _components_prefectofdiscipline_list_prefectofdiscipline_list_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./components/prefectofdiscipline-list/prefectofdiscipline-list.component */ "./src/app/quonmanager/components/prefectofdiscipline-list/prefectofdiscipline-list.component.ts");
/* harmony import */ var _components_student_list_student_list_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./components/student-list/student-list.component */ "./src/app/quonmanager/components/student-list/student-list.component.ts");
/* harmony import */ var _components_student_form_student_form_component__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./components/student-form/student-form.component */ "./src/app/quonmanager/components/student-form/student-form.component.ts");
/* harmony import */ var _components_guidancecouncilor_form_guidancecouncilor_form_component__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./components/guidancecouncilor-form/guidancecouncilor-form.component */ "./src/app/quonmanager/components/guidancecouncilor-form/guidancecouncilor-form.component.ts");
/* harmony import */ var _components_guidancecouncilor_list_guidancecouncilor_list_component__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./components/guidancecouncilor-list/guidancecouncilor-list.component */ "./src/app/quonmanager/components/guidancecouncilor-list/guidancecouncilor-list.component.ts");
/* harmony import */ var _services_employee_service__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./services/employee.service */ "./src/app/quonmanager/services/employee.service.ts");
/* harmony import */ var _services_position_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./services/position.service */ "./src/app/quonmanager/services/position.service.ts");
/* harmony import */ var _services_station_service__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./services/station.service */ "./src/app/quonmanager/services/station.service.ts");
/* harmony import */ var _services_principal_service__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./services/principal.service */ "./src/app/quonmanager/services/principal.service.ts");
/* harmony import */ var _components_employee_details_employee_details_component__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./components/employee-details/employee-details.component */ "./src/app/quonmanager/components/employee-details/employee-details.component.ts");
/* harmony import */ var _components_employee_position_details_employee_position_details_component__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./components/employee-position-details/employee-position-details.component */ "./src/app/quonmanager/components/employee-position-details/employee-position-details.component.ts");
/* harmony import */ var _components_employee_station_details_employee_station_details_component__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./components/employee-station-details/employee-station-details.component */ "./src/app/quonmanager/components/employee-station-details/employee-station-details.component.ts");
/* harmony import */ var _components_registration_form_registration_form_component__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./components/registration-form/registration-form.component */ "./src/app/quonmanager/components/registration-form/registration-form.component.ts");
/* harmony import */ var _components_login_form_login_form_component__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./components/login-form/login-form.component */ "./src/app/quonmanager/components/login-form/login-form.component.ts");
/* harmony import */ var _services_role_service__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./services/role.service */ "./src/app/quonmanager/services/role.service.ts");
/* harmony import */ var _components_no_access_no_access_component__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./components/no-access/no-access.component */ "./src/app/quonmanager/components/no-access/no-access.component.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./services/user.service */ "./src/app/quonmanager/services/user.service.ts");
/* harmony import */ var _services_auth_service__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./services/auth.service */ "./src/app/quonmanager/services/auth.service.ts");
/* harmony import */ var _services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./services/auth-guard.service */ "./src/app/quonmanager/services/auth-guard.service.ts");
/* harmony import */ var _services_student_service__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./services/student.service */ "./src/app/quonmanager/services/student.service.ts");
/* harmony import */ var _services_bloodtype_service__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./services/bloodtype.service */ "./src/app/quonmanager/services/bloodtype.service.ts");
/* harmony import */ var _services_mothertongue_service__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./services/mothertongue.service */ "./src/app/quonmanager/services/mothertongue.service.ts");
/* harmony import */ var _services_citizenship_service__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./services/citizenship.service */ "./src/app/quonmanager/services/citizenship.service.ts");
/* harmony import */ var _services_civilstatus_service__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./services/civilstatus.service */ "./src/app/quonmanager/services/civilstatus.service.ts");
/* harmony import */ var _services_gender_service__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./services/gender.service */ "./src/app/quonmanager/services/gender.service.ts");
/* harmony import */ var _services_religion_service__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./services/religion.service */ "./src/app/quonmanager/services/religion.service.ts");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
/* harmony import */ var _components_section_list_section_list_component__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./components/section-list/section-list.component */ "./src/app/quonmanager/components/section-list/section-list.component.ts");
/* harmony import */ var _components_section_form_section_form_component__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./components/section-form/section-form.component */ "./src/app/quonmanager/components/section-form/section-form.component.ts");
/* harmony import */ var _services_section_service__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./services/section.service */ "./src/app/quonmanager/services/section.service.ts");
/* harmony import */ var _components_levelsection_list_levelsection_list_component__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ./components/levelsection-list/levelsection-list.component */ "./src/app/quonmanager/components/levelsection-list/levelsection-list.component.ts");
/* harmony import */ var _components_levelsection_form_levelsection_form_component__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(/*! ./components/levelsection-form/levelsection-form.component */ "./src/app/quonmanager/components/levelsection-form/levelsection-form.component.ts");
/* harmony import */ var _services_level_service__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(/*! ./services/level.service */ "./src/app/quonmanager/services/level.service.ts");
/* harmony import */ var _services_adviser_service__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(/*! ./services/adviser.service */ "./src/app/quonmanager/services/adviser.service.ts");
/* harmony import */ var _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(/*! ./components/dashboard/dashboard.component */ "./src/app/quonmanager/components/dashboard/dashboard.component.ts");
/* harmony import */ var _components_position_list_position_list_component__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(/*! ./components/position-list/position-list.component */ "./src/app/quonmanager/components/position-list/position-list.component.ts");
/* harmony import */ var _components_position_form_position_form_component__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(/*! ./components/position-form/position-form.component */ "./src/app/quonmanager/components/position-form/position-form.component.ts");
/* harmony import */ var _components_station_form_station_form_component__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(/*! ./components/station-form/station-form.component */ "./src/app/quonmanager/components/station-form/station-form.component.ts");
/* harmony import */ var _components_station_list_station_list_component__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(/*! ./components/station-list/station-list.component */ "./src/app/quonmanager/components/station-list/station-list.component.ts");
/* harmony import */ var _components_training_list_training_list_component__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(/*! ./components/training-list/training-list.component */ "./src/app/quonmanager/components/training-list/training-list.component.ts");
/* harmony import */ var _components_training_form_training_form_component__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(/*! ./components/training-form/training-form.component */ "./src/app/quonmanager/components/training-form/training-form.component.ts");
/* harmony import */ var _components_participant_form_participant_form_component__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(/*! ./components/participant-form/participant-form.component */ "./src/app/quonmanager/components/participant-form/participant-form.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
































































var routes = [
    { path: '', component: _quonmanager_app_component__WEBPACK_IMPORTED_MODULE_11__["QuonmanagerAppComponent"],
        children: [{ path: 'dashboard', component: _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_56__["DashboardComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'no-access', component: _components_no_access_no_access_component__WEBPACK_IMPORTED_MODULE_37__["NoAccessComponent"] },
            { path: 'employee-details/:id', component: _components_employee_details_employee_details_component__WEBPACK_IMPORTED_MODULE_31__["EmployeeDetailsComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'employee-list', component: _components_employee_list_employee_list_component__WEBPACK_IMPORTED_MODULE_15__["EmployeeListComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'employee-form/:id', component: _components_employee_form_employee_form_component__WEBPACK_IMPORTED_MODULE_16__["EmployeeFormComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'employee-form', component: _components_employee_form_employee_form_component__WEBPACK_IMPORTED_MODULE_16__["EmployeeFormComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'adviser-list', component: _components_adviser_list_adviser_list_component__WEBPACK_IMPORTED_MODULE_19__["AdviserListComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'section-list', component: _components_section_list_section_list_component__WEBPACK_IMPORTED_MODULE_49__["SectionListComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'section-form', component: _components_section_form_section_form_component__WEBPACK_IMPORTED_MODULE_50__["SectionFormComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'levelsection-list', component: _components_levelsection_list_levelsection_list_component__WEBPACK_IMPORTED_MODULE_52__["LevelsectionListComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'station-list', component: _components_station_list_station_list_component__WEBPACK_IMPORTED_MODULE_60__["StationListComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'position-list', component: _components_position_list_position_list_component__WEBPACK_IMPORTED_MODULE_57__["PositionListComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'student-list', component: _components_student_list_student_list_component__WEBPACK_IMPORTED_MODULE_23__["StudentListComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'student-form', component: _components_student_form_student_form_component__WEBPACK_IMPORTED_MODULE_24__["StudentFormComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'training-list', component: _components_training_list_training_list_component__WEBPACK_IMPORTED_MODULE_61__["TrainingListComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'training-form', component: _components_training_form_training_form_component__WEBPACK_IMPORTED_MODULE_62__["TrainingFormComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'training-form/:id', component: _components_training_form_training_form_component__WEBPACK_IMPORTED_MODULE_62__["TrainingFormComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] },
            { path: 'participant-form/:id', component: _components_participant_form_participant_form_component__WEBPACK_IMPORTED_MODULE_63__["ParticipantFormComponent"], canActivate: [_services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"]] }
        ]
    },
    { path: '**', component: _components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_2__["PageNotFoundComponent"] }
];
var QuonmanagerModule = (function () {
    function QuonmanagerModule() {
    }
    QuonmanagerModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_4__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_5__["CommonModule"],
                _material_module__WEBPACK_IMPORTED_MODULE_8__["MaterialModule"],
                _angular_flex_layout__WEBPACK_IMPORTED_MODULE_9__["FlexLayoutModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_10__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_10__["ReactiveFormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_7__["HttpClientModule"],
                _angular_http__WEBPACK_IMPORTED_MODULE_48__["HttpModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_6__["RouterModule"].forChild(routes)
            ],
            providers: [
                _services_employee_service__WEBPACK_IMPORTED_MODULE_27__["EmployeeService"],
                _services_position_service__WEBPACK_IMPORTED_MODULE_28__["PositionService"],
                _services_station_service__WEBPACK_IMPORTED_MODULE_29__["StationService"],
                _services_principal_service__WEBPACK_IMPORTED_MODULE_30__["PrincipalService"],
                _services_user_service__WEBPACK_IMPORTED_MODULE_38__["UserService"],
                _services_role_service__WEBPACK_IMPORTED_MODULE_36__["RoleService"],
                _services_auth_service__WEBPACK_IMPORTED_MODULE_39__["AuthService"],
                _services_auth_guard_service__WEBPACK_IMPORTED_MODULE_40__["AuthGuard"],
                _services_section_service__WEBPACK_IMPORTED_MODULE_51__["SectionService"],
                _services_levelsection_service__WEBPACK_IMPORTED_MODULE_3__["LevelSectionService"],
                _services_level_service__WEBPACK_IMPORTED_MODULE_54__["LevelService"],
                _services_adviser_service__WEBPACK_IMPORTED_MODULE_55__["AdviserService"],
                _services_student_service__WEBPACK_IMPORTED_MODULE_41__["StudentService"],
                _services_gender_service__WEBPACK_IMPORTED_MODULE_46__["GenderService"],
                _services_civilstatus_service__WEBPACK_IMPORTED_MODULE_45__["CivilStatusService"],
                _services_citizenship_service__WEBPACK_IMPORTED_MODULE_44__["CitizenShipService"],
                _services_mothertongue_service__WEBPACK_IMPORTED_MODULE_43__["MotherTongueService"],
                _services_bloodtype_service__WEBPACK_IMPORTED_MODULE_42__["BloodTypeService"],
                _services_religion_service__WEBPACK_IMPORTED_MODULE_47__["ReligionService"],
                _services_training_service__WEBPACK_IMPORTED_MODULE_1__["TrainingService"],
                _services_participant_service__WEBPACK_IMPORTED_MODULE_0__["ParticipantService"]
            ],
            declarations: [_quonmanager_app_component__WEBPACK_IMPORTED_MODULE_11__["QuonmanagerAppComponent"], _components_toolbar_toolbar_component__WEBPACK_IMPORTED_MODULE_12__["ToolbarComponent"], _components_main_content_main_content_component__WEBPACK_IMPORTED_MODULE_13__["MainContentComponent"], _components_sidenav_sidenav_component__WEBPACK_IMPORTED_MODULE_14__["SidenavComponent"], _components_employee_list_employee_list_component__WEBPACK_IMPORTED_MODULE_15__["EmployeeListComponent"], _components_employee_form_employee_form_component__WEBPACK_IMPORTED_MODULE_16__["EmployeeFormComponent"], _components_principal_form_principal_form_component__WEBPACK_IMPORTED_MODULE_17__["PrincipalFormComponent"], _components_principal_list_principal_list_component__WEBPACK_IMPORTED_MODULE_18__["PrincipalListComponent"], _components_adviser_list_adviser_list_component__WEBPACK_IMPORTED_MODULE_19__["AdviserListComponent"], _components_adviser_form_adviser_form_component__WEBPACK_IMPORTED_MODULE_20__["AdviserFormComponent"], _components_prefectofdiscipline_form_prefectofdiscipline_form_component__WEBPACK_IMPORTED_MODULE_21__["PrefectofdisciplineFormComponent"], _components_prefectofdiscipline_list_prefectofdiscipline_list_component__WEBPACK_IMPORTED_MODULE_22__["PrefectofdisciplineListComponent"], _components_student_list_student_list_component__WEBPACK_IMPORTED_MODULE_23__["StudentListComponent"], _components_student_form_student_form_component__WEBPACK_IMPORTED_MODULE_24__["StudentFormComponent"], _components_guidancecouncilor_form_guidancecouncilor_form_component__WEBPACK_IMPORTED_MODULE_25__["GuidancecouncilorFormComponent"], _components_guidancecouncilor_list_guidancecouncilor_list_component__WEBPACK_IMPORTED_MODULE_26__["GuidancecouncilorListComponent"], _components_employee_details_employee_details_component__WEBPACK_IMPORTED_MODULE_31__["EmployeeDetailsComponent"], _components_employee_position_details_employee_position_details_component__WEBPACK_IMPORTED_MODULE_32__["EmployeePositionDetailsComponent"], _components_employee_station_details_employee_station_details_component__WEBPACK_IMPORTED_MODULE_33__["EmployeeStationDetailsComponent"], _components_registration_form_registration_form_component__WEBPACK_IMPORTED_MODULE_34__["RegistrationFormComponent"], _components_login_form_login_form_component__WEBPACK_IMPORTED_MODULE_35__["LoginFormComponent"], _components_no_access_no_access_component__WEBPACK_IMPORTED_MODULE_37__["NoAccessComponent"], _components_section_list_section_list_component__WEBPACK_IMPORTED_MODULE_49__["SectionListComponent"], _components_section_form_section_form_component__WEBPACK_IMPORTED_MODULE_50__["SectionFormComponent"], _components_levelsection_list_levelsection_list_component__WEBPACK_IMPORTED_MODULE_52__["LevelsectionListComponent"], _components_levelsection_form_levelsection_form_component__WEBPACK_IMPORTED_MODULE_53__["LevelsectionFormComponent"], _components_dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_56__["DashboardComponent"], _components_position_list_position_list_component__WEBPACK_IMPORTED_MODULE_57__["PositionListComponent"], _components_position_form_position_form_component__WEBPACK_IMPORTED_MODULE_58__["PositionFormComponent"], _components_station_form_station_form_component__WEBPACK_IMPORTED_MODULE_59__["StationFormComponent"], _components_station_list_station_list_component__WEBPACK_IMPORTED_MODULE_60__["StationListComponent"], _components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_2__["PageNotFoundComponent"], _components_training_list_training_list_component__WEBPACK_IMPORTED_MODULE_61__["TrainingListComponent"], _components_training_form_training_form_component__WEBPACK_IMPORTED_MODULE_62__["TrainingFormComponent"], _components_participant_form_participant_form_component__WEBPACK_IMPORTED_MODULE_63__["ParticipantFormComponent"]],
            entryComponents: [
                _components_employee_form_employee_form_component__WEBPACK_IMPORTED_MODULE_16__["EmployeeFormComponent"],
                _components_principal_form_principal_form_component__WEBPACK_IMPORTED_MODULE_17__["PrincipalFormComponent"],
                _components_login_form_login_form_component__WEBPACK_IMPORTED_MODULE_35__["LoginFormComponent"],
                _components_registration_form_registration_form_component__WEBPACK_IMPORTED_MODULE_34__["RegistrationFormComponent"],
                _components_station_form_station_form_component__WEBPACK_IMPORTED_MODULE_59__["StationFormComponent"],
                _components_position_form_position_form_component__WEBPACK_IMPORTED_MODULE_58__["PositionFormComponent"],
                _components_student_form_student_form_component__WEBPACK_IMPORTED_MODULE_24__["StudentFormComponent"],
                _components_levelsection_form_levelsection_form_component__WEBPACK_IMPORTED_MODULE_53__["LevelsectionFormComponent"]
            ]
        })
    ], QuonmanagerModule);
    return QuonmanagerModule;
}());



/***/ }),

/***/ "./src/app/quonmanager/services/adviser.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/quonmanager/services/adviser.service.ts ***!
  \*********************************************************/
/*! exports provided: AdviserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdviserService", function() { return AdviserService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AdviserService = (function (_super) {
    __extends(AdviserService, _super);
    function AdviserService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/advisers', http) || this;
    }
    AdviserService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], AdviserService);
    return AdviserService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/auth-guard.service.ts":
/*!************************************************************!*\
  !*** ./src/app/quonmanager/services/auth-guard.service.ts ***!
  \************************************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/esm5/router.js");
/* harmony import */ var _auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth.service */ "./src/app/quonmanager/services/auth.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthGuard = (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        if (this.authService.isLoggedIn())
            return true;
        this.router.navigate(['/quonmanager/no-access'], { queryParams: { returnUrl: state.url } });
        return true;
    };
    AuthGuard = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_auth_service__WEBPACK_IMPORTED_MODULE_2__["AuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/quonmanager/services/auth.service.ts":
/*!******************************************************!*\
  !*** ./src/app/quonmanager/services/auth.service.ts ***!
  \******************************************************/
/*! exports provided: AuthService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthService", function() { return AuthService; });
/* harmony import */ var angular2_jwt__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular2-jwt */ "./node_modules/angular2-jwt/angular2-jwt.js");
/* harmony import */ var angular2_jwt__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular2_jwt__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/Observable */ "./node_modules/rxjs/_esm5/Observable.js");
/* harmony import */ var _common_bad_request_error__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/bad-request-error */ "./src/app/common/bad-request-error.ts");
/* harmony import */ var _common_not_found_error__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../common/not-found-error */ "./src/app/common/not-found-error.ts");
/* harmony import */ var _common_unauthorized_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../common/unauthorized-error */ "./src/app/common/unauthorized-error.ts");
/* harmony import */ var _common_no_connection_error__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../common/no-connection-error */ "./src/app/common/no-connection-error.ts");
/* harmony import */ var _common_app_error__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../common/app-error */ "./src/app/common/app-error.ts");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var AuthService = (function () {
    function AuthService(http) {
        this.http = http;
        this.url = 'http://jonelbucad21-001-site1.ftempurl.com/api/users/login';
    }
    AuthService.prototype.login = function (resource) {
        var _this = this;
        return this.http.post(this.url, resource)
            .map(function (result) {
            _this.response = result;
            localStorage.setItem('token', _this.response.json().token);
        })
            .catch(this.handleError);
    };
    AuthService.prototype.logout = function () {
        localStorage.removeItem('token');
    };
    AuthService.prototype.isLoggedIn = function () {
        return Object(angular2_jwt__WEBPACK_IMPORTED_MODULE_0__["tokenNotExpired"])();
    };
    Object.defineProperty(AuthService.prototype, "decodedToken", {
        get: function () {
            var token = localStorage.getItem('token');
            if (!token)
                return null;
            return new angular2_jwt__WEBPACK_IMPORTED_MODULE_0__["JwtHelper"]().decodeToken(token);
        },
        enumerable: true,
        configurable: true
    });
    AuthService.prototype.handleError = function (error) {
        if (error.status === 400) {
            return rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"].throw(new _common_bad_request_error__WEBPACK_IMPORTED_MODULE_3__["BadRequestError"](error));
        }
        if (error.status === 404) {
            return rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"].throw(new _common_not_found_error__WEBPACK_IMPORTED_MODULE_4__["NotFoundError"](error));
        }
        if (error.status === 401) {
            return rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"].throw(new _common_unauthorized_error__WEBPACK_IMPORTED_MODULE_5__["UnauthorizedError"](error));
        }
        if (error.status === 0) {
            return rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"].throw(new _common_no_connection_error__WEBPACK_IMPORTED_MODULE_6__["NoConnectionError"](error));
        }
        return rxjs_Observable__WEBPACK_IMPORTED_MODULE_2__["Observable"].throw(new _common_app_error__WEBPACK_IMPORTED_MODULE_7__["AppError"](error));
    };
    AuthService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_8__["Http"]])
    ], AuthService);
    return AuthService;
}());



/***/ }),

/***/ "./src/app/quonmanager/services/bloodtype.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/quonmanager/services/bloodtype.service.ts ***!
  \***********************************************************/
/*! exports provided: BloodTypeService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BloodTypeService", function() { return BloodTypeService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var BloodTypeService = (function (_super) {
    __extends(BloodTypeService, _super);
    function BloodTypeService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/bloodtypes', http) || this;
    }
    BloodTypeService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], BloodTypeService);
    return BloodTypeService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/citizenship.service.ts":
/*!*************************************************************!*\
  !*** ./src/app/quonmanager/services/citizenship.service.ts ***!
  \*************************************************************/
/*! exports provided: CitizenShipService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CitizenShipService", function() { return CitizenShipService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CitizenShipService = (function (_super) {
    __extends(CitizenShipService, _super);
    function CitizenShipService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/citizenships', http) || this;
    }
    CitizenShipService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], CitizenShipService);
    return CitizenShipService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/civilstatus.service.ts":
/*!*************************************************************!*\
  !*** ./src/app/quonmanager/services/civilstatus.service.ts ***!
  \*************************************************************/
/*! exports provided: CivilStatusService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CivilStatusService", function() { return CivilStatusService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var CivilStatusService = (function (_super) {
    __extends(CivilStatusService, _super);
    function CivilStatusService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/civilstatuses', http) || this;
    }
    CivilStatusService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], CivilStatusService);
    return CivilStatusService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/gender.service.ts":
/*!********************************************************!*\
  !*** ./src/app/quonmanager/services/gender.service.ts ***!
  \********************************************************/
/*! exports provided: GenderService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GenderService", function() { return GenderService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var GenderService = (function (_super) {
    __extends(GenderService, _super);
    function GenderService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/genders', http) || this;
    }
    GenderService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], GenderService);
    return GenderService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/level.service.ts":
/*!*******************************************************!*\
  !*** ./src/app/quonmanager/services/level.service.ts ***!
  \*******************************************************/
/*! exports provided: LevelService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelService", function() { return LevelService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LevelService = (function (_super) {
    __extends(LevelService, _super);
    function LevelService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/levels', http) || this;
    }
    LevelService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], LevelService);
    return LevelService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/levelsection.service.ts":
/*!**************************************************************!*\
  !*** ./src/app/quonmanager/services/levelsection.service.ts ***!
  \**************************************************************/
/*! exports provided: LevelSectionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LevelSectionService", function() { return LevelSectionService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var LevelSectionService = (function (_super) {
    __extends(LevelSectionService, _super);
    function LevelSectionService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/levelsections', http) || this;
    }
    LevelSectionService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], LevelSectionService);
    return LevelSectionService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/mothertongue.service.ts":
/*!**************************************************************!*\
  !*** ./src/app/quonmanager/services/mothertongue.service.ts ***!
  \**************************************************************/
/*! exports provided: MotherTongueService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MotherTongueService", function() { return MotherTongueService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var MotherTongueService = (function (_super) {
    __extends(MotherTongueService, _super);
    function MotherTongueService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/motherTongues', http) || this;
    }
    MotherTongueService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], MotherTongueService);
    return MotherTongueService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/participant.service.ts":
/*!*************************************************************!*\
  !*** ./src/app/quonmanager/services/participant.service.ts ***!
  \*************************************************************/
/*! exports provided: ParticipantService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ParticipantService", function() { return ParticipantService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ParticipantService = (function (_super) {
    __extends(ParticipantService, _super);
    function ParticipantService(http) {
        return _super.call(this, 'http://depedpampanga-tmis.asia/api/participants', http) || this;
    }
    ParticipantService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], ParticipantService);
    return ParticipantService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/position.service.ts":
/*!**********************************************************!*\
  !*** ./src/app/quonmanager/services/position.service.ts ***!
  \**********************************************************/
/*! exports provided: PositionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PositionService", function() { return PositionService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PositionService = (function (_super) {
    __extends(PositionService, _super);
    function PositionService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/positions', http) || this;
    }
    PositionService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], PositionService);
    return PositionService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/principal.service.ts":
/*!***********************************************************!*\
  !*** ./src/app/quonmanager/services/principal.service.ts ***!
  \***********************************************************/
/*! exports provided: PrincipalService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PrincipalService", function() { return PrincipalService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var PrincipalService = (function (_super) {
    __extends(PrincipalService, _super);
    function PrincipalService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/principals', http) || this;
    }
    PrincipalService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], PrincipalService);
    return PrincipalService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/religion.service.ts":
/*!**********************************************************!*\
  !*** ./src/app/quonmanager/services/religion.service.ts ***!
  \**********************************************************/
/*! exports provided: ReligionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReligionService", function() { return ReligionService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ReligionService = (function (_super) {
    __extends(ReligionService, _super);
    function ReligionService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/religions', http) || this;
    }
    ReligionService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], ReligionService);
    return ReligionService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/role.service.ts":
/*!******************************************************!*\
  !*** ./src/app/quonmanager/services/role.service.ts ***!
  \******************************************************/
/*! exports provided: RoleService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RoleService", function() { return RoleService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var RoleService = (function (_super) {
    __extends(RoleService, _super);
    function RoleService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/roles', http) || this;
    }
    RoleService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], RoleService);
    return RoleService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/section.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/quonmanager/services/section.service.ts ***!
  \*********************************************************/
/*! exports provided: SectionService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SectionService", function() { return SectionService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SectionService = (function (_super) {
    __extends(SectionService, _super);
    function SectionService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/sections', http) || this;
    }
    SectionService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], SectionService);
    return SectionService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/station.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/quonmanager/services/station.service.ts ***!
  \*********************************************************/
/*! exports provided: StationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StationService", function() { return StationService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var StationService = (function (_super) {
    __extends(StationService, _super);
    function StationService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/stations', http) || this;
    }
    StationService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], StationService);
    return StationService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_1__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/student.service.ts":
/*!*********************************************************!*\
  !*** ./src/app/quonmanager/services/student.service.ts ***!
  \*********************************************************/
/*! exports provided: StudentService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StudentService", function() { return StudentService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var StudentService = (function (_super) {
    __extends(StudentService, _super);
    function StudentService(http) {
        return _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/students', http) || this;
    }
    StudentService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], StudentService);
    return StudentService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/training.service.ts":
/*!**********************************************************!*\
  !*** ./src/app/quonmanager/services/training.service.ts ***!
  \**********************************************************/
/*! exports provided: TrainingService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TrainingService", function() { return TrainingService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var TrainingService = (function (_super) {
    __extends(TrainingService, _super);
    function TrainingService(http) {
        var _this = _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/trainings', http) || this;
        _this.sourceMemos = 'http://jonelbucad21-001-site1.ftempurl.com/api/trainings/sourceMemos';
        _this.speakers = 'http://jonelbucad21-001-site1.ftempurl.com/api/trainings/speakers';
        return _this;
    }
    TrainingService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], TrainingService);
    return TrainingService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ }),

/***/ "./src/app/quonmanager/services/user.service.ts":
/*!******************************************************!*\
  !*** ./src/app/quonmanager/services/user.service.ts ***!
  \******************************************************/
/*! exports provided: UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var _services_data_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../../services/data.service */ "./src/app/services/data.service.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/esm5/core.js");
/* harmony import */ var _angular_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/http */ "./node_modules/@angular/http/esm5/http.js");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var UserService = (function (_super) {
    __extends(UserService, _super);
    function UserService(http) {
        var _this = _super.call(this, 'http://jonelbucad21-001-site1.ftempurl.com/api/users', http) || this;
        _this.urlForLogin = 'http://jonelbucad21-001-site1.ftempurl.com/api/users/login';
        return _this;
    }
    UserService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        __metadata("design:paramtypes", [_angular_http__WEBPACK_IMPORTED_MODULE_2__["Http"]])
    ], UserService);
    return UserService;
}(_services_data_service__WEBPACK_IMPORTED_MODULE_0__["DataService"]));



/***/ })

}]);
//# sourceMappingURL=quonmanager-quonmanager-module.js.map
