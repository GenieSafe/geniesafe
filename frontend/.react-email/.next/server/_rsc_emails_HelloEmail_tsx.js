"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_rsc_emails_HelloEmail_tsx";
exports.ids = ["_rsc_emails_HelloEmail_tsx"];
exports.modules = {

/***/ "(rsc)/./emails/HelloEmail.tsx":
/*!*******************************!*\
  !*** ./emails/HelloEmail.tsx ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _emails_HelloEmail_tsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../emails/HelloEmail.tsx */ \"(rsc)/../emails/HelloEmail.tsx\");\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_emails_HelloEmail_tsx__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9lbWFpbHMvSGVsbG9FbWFpbC50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBK0M7QUFDL0MsaUVBQWVBLDhEQUFJQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcmVhY3QtZW1haWwtY2xpZW50Ly4vZW1haWxzL0hlbGxvRW1haWwudHN4PzVjNWEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1haWwgZnJvbSAnLi4vLi4vZW1haWxzL0hlbGxvRW1haWwudHN4JztcbmV4cG9ydCBkZWZhdWx0IE1haWw7Il0sIm5hbWVzIjpbIk1haWwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./emails/HelloEmail.tsx\n");

/***/ }),

/***/ "(rsc)/../emails/HelloEmail.tsx":
/*!********************************!*\
  !*** ../emails/HelloEmail.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   HelloEmail: () => (/* binding */ HelloEmail),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/html/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/head/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/preview/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/body/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/container/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/img/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/heading/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/section/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/text/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/link/dist/index.mjs\");\n/* harmony import */ var _react_email_components__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @react-email/components */ \"(rsc)/../node_modules/@react-email/hr/dist/index.mjs\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-page/vendored/rsc/react.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nconst baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : \"\";\nconst HelloEmail = ({ magicLink = \"https://raycast.com\" })=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_2__.Html, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_3__.Head, {}, void 0, false, {\n                fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                lineNumber: 28,\n                columnNumber: 5\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_4__.Preview, {\n                children: \"Log in with this magic link.\"\n            }, void 0, false, {\n                fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                lineNumber: 29,\n                columnNumber: 5\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_5__.Body, {\n                style: main,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_6__.Container, {\n                    style: container,\n                    children: [\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_7__.Img, {\n                            src: `${baseUrl}/static/raycast-logo.png`,\n                            width: 48,\n                            height: 48,\n                            alt: \"Raycast\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                            lineNumber: 32,\n                            columnNumber: 9\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_8__.Heading, {\n                            style: heading,\n                            children: \"Your magic link\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                            lineNumber: 38,\n                            columnNumber: 9\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_9__.Section, {\n                            style: body,\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_10__.Text, {\n                                    style: paragraph,\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_11__.Link, {\n                                        style: link,\n                                        href: magicLink,\n                                        children: \"\\uD83D\\uDC49 Click here to sign in \\uD83D\\uDC48\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                                        lineNumber: 41,\n                                        columnNumber: 13\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                                    lineNumber: 40,\n                                    columnNumber: 11\n                                }, undefined),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_10__.Text, {\n                                    style: paragraph,\n                                    children: \"If you didn't request this, please ignore this email.\"\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                                    lineNumber: 45,\n                                    columnNumber: 11\n                                }, undefined)\n                            ]\n                        }, void 0, true, {\n                            fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                            lineNumber: 39,\n                            columnNumber: 9\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_10__.Text, {\n                            style: paragraph,\n                            children: [\n                                \"Best,\",\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"br\", {}, void 0, false, {\n                                    fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                                    lineNumber: 51,\n                                    columnNumber: 11\n                                }, undefined),\n                                \"- Raycast Team\"\n                            ]\n                        }, void 0, true, {\n                            fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                            lineNumber: 49,\n                            columnNumber: 9\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_12__.Hr, {\n                            style: hr\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                            lineNumber: 53,\n                            columnNumber: 9\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_7__.Img, {\n                            src: `${baseUrl}/static/raycast-logo.png`,\n                            width: 32,\n                            height: 32,\n                            style: {\n                                WebkitFilter: \"grayscale(100%)\",\n                                filter: \"grayscale(100%)\",\n                                margin: \"20px 0\"\n                            }\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                            lineNumber: 54,\n                            columnNumber: 9\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_10__.Text, {\n                            style: footer,\n                            children: \"Raycast Technologies Inc.\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                            lineNumber: 64,\n                            columnNumber: 9\n                        }, undefined),\n                        /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_react_email_components__WEBPACK_IMPORTED_MODULE_10__.Text, {\n                            style: footer,\n                            children: \"2093 Philadelphia Pike #3222, Claymont, DE 19703\"\n                        }, void 0, false, {\n                            fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                            lineNumber: 65,\n                            columnNumber: 9\n                        }, undefined)\n                    ]\n                }, void 0, true, {\n                    fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                    lineNumber: 31,\n                    columnNumber: 7\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n                lineNumber: 30,\n                columnNumber: 5\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Dev\\\\geniesafe\\\\frontend\\\\emails\\\\HelloEmail.tsx\",\n        lineNumber: 27,\n        columnNumber: 3\n    }, undefined);\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HelloEmail);\nconst main = {\n    backgroundColor: \"#ffffff\",\n    fontFamily: '-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",sans-serif'\n};\nconst container = {\n    margin: \"0 auto\",\n    padding: \"20px 25px 48px\",\n    backgroundImage: 'url(\"/assets/raycast-bg.png\")',\n    backgroundPosition: \"bottom\",\n    backgroundRepeat: \"no-repeat, no-repeat\"\n};\nconst heading = {\n    fontSize: \"28px\",\n    fontWeight: \"bold\",\n    marginTop: \"48px\"\n};\nconst body = {\n    margin: \"24px 0\"\n};\nconst paragraph = {\n    fontSize: \"16px\",\n    lineHeight: \"26px\"\n};\nconst link = {\n    color: \"#FF6363\"\n};\nconst hr = {\n    borderColor: \"#dddddd\",\n    marginTop: \"48px\"\n};\nconst footer = {\n    color: \"#8898aa\",\n    fontSize: \"12px\",\n    marginLeft: \"4px\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vZW1haWxzL0hlbGxvRW1haWwudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlnQztBQUNGO0FBTTlCLE1BQU1ZLFVBQVVDLFFBQVFDLEdBQUcsQ0FBQ0MsVUFBVSxHQUNsQyxDQUFDLFFBQVEsRUFBRUYsUUFBUUMsR0FBRyxDQUFDQyxVQUFVLENBQUMsQ0FBQyxHQUNuQztBQUVHLE1BQU1DLGFBQWEsQ0FBQyxFQUN6QkMsWUFBWSxxQkFBcUIsRUFDTixpQkFDM0IsOERBQUNaLHlEQUFJQTs7MEJBQ0gsOERBQUNILHlEQUFJQTs7Ozs7MEJBQ0wsOERBQUNNLDREQUFPQTswQkFBQzs7Ozs7OzBCQUNULDhEQUFDUix5REFBSUE7Z0JBQUNrQixPQUFPQzswQkFDWCw0RUFBQ2xCLDhEQUFTQTtvQkFBQ2lCLE9BQU9FOztzQ0FDaEIsOERBQUNkLHdEQUFHQTs0QkFDRmUsS0FBSyxDQUFDLEVBQUVULFFBQVEsd0JBQXdCLENBQUM7NEJBQ3pDVSxPQUFPOzRCQUNQQyxRQUFROzRCQUNSQyxLQUFJOzs7Ozs7c0NBRU4sOERBQUNyQiw0REFBT0E7NEJBQUNlLE9BQU9PO3NDQUFTOzs7Ozs7c0NBQ3pCLDhEQUFDaEIsNERBQU9BOzRCQUFDUyxPQUFPUTs7OENBQ2QsOERBQUNoQiwwREFBSUE7b0NBQUNRLE9BQU9TOzhDQUNYLDRFQUFDcEIsMERBQUlBO3dDQUFDVyxPQUFPVTt3Q0FBTUMsTUFBTVo7a0RBQVc7Ozs7Ozs7Ozs7OzhDQUl0Qyw4REFBQ1AsMERBQUlBO29DQUFDUSxPQUFPUzs4Q0FBVzs7Ozs7Ozs7Ozs7O3NDQUkxQiw4REFBQ2pCLDBEQUFJQTs0QkFBQ1EsT0FBT1M7O2dDQUFXOzhDQUV0Qiw4REFBQ0c7Ozs7O2dDQUFLOzs7Ozs7O3NDQUVSLDhEQUFDMUIsd0RBQUVBOzRCQUFDYyxPQUFPYTs7Ozs7O3NDQUNYLDhEQUFDekIsd0RBQUdBOzRCQUNGZSxLQUFLLENBQUMsRUFBRVQsUUFBUSx3QkFBd0IsQ0FBQzs0QkFDekNVLE9BQU87NEJBQ1BDLFFBQVE7NEJBQ1JMLE9BQU87Z0NBQ0xjLGNBQWM7Z0NBQ2RDLFFBQVE7Z0NBQ1JDLFFBQVE7NEJBQ1Y7Ozs7OztzQ0FFRiw4REFBQ3hCLDBEQUFJQTs0QkFBQ1EsT0FBT2lCO3NDQUFROzs7Ozs7c0NBQ3JCLDhEQUFDekIsMERBQUlBOzRCQUFDUSxPQUFPaUI7c0NBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBTTVCO0FBRUQsaUVBQWVuQixVQUFVQSxFQUFBO0FBRXpCLE1BQU1HLE9BQU87SUFDWGlCLGlCQUFpQjtJQUNqQkMsWUFDRTtBQUNKO0FBRUEsTUFBTWpCLFlBQVk7SUFDaEJjLFFBQVE7SUFDUkksU0FBUztJQUNUQyxpQkFBaUI7SUFDakJDLG9CQUFvQjtJQUNwQkMsa0JBQWtCO0FBQ3BCO0FBRUEsTUFBTWhCLFVBQVU7SUFDZGlCLFVBQVU7SUFDVkMsWUFBWTtJQUNaQyxXQUFXO0FBQ2I7QUFFQSxNQUFNbEIsT0FBTztJQUNYUSxRQUFRO0FBQ1Y7QUFFQSxNQUFNUCxZQUFZO0lBQ2hCZSxVQUFVO0lBQ1ZHLFlBQVk7QUFDZDtBQUVBLE1BQU1qQixPQUFPO0lBQ1hrQixPQUFPO0FBQ1Q7QUFFQSxNQUFNZixLQUFLO0lBQ1RnQixhQUFhO0lBQ2JILFdBQVc7QUFDYjtBQUVBLE1BQU1ULFNBQVM7SUFDYlcsT0FBTztJQUNQSixVQUFVO0lBQ1ZNLFlBQVk7QUFDZCIsInNvdXJjZXMiOlsid2VicGFjazovL3JlYWN0LWVtYWlsLWNsaWVudC8uLi9lbWFpbHMvSGVsbG9FbWFpbC50c3g/ZTBhNCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIEJvZHksXHJcbiAgQ29udGFpbmVyLFxyXG4gIEhlYWQsXHJcbiAgSGVhZGluZyxcclxuICBIcixcclxuICBIdG1sLFxyXG4gIEltZyxcclxuICBMaW5rLFxyXG4gIFByZXZpZXcsXHJcbiAgU2VjdGlvbixcclxuICBUZXh0LFxyXG59IGZyb20gJ0ByZWFjdC1lbWFpbC9jb21wb25lbnRzJ1xyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcclxuXHJcbmludGVyZmFjZSBSYXljYXN0TWFnaWNMaW5rRW1haWxQcm9wcyB7XHJcbiAgbWFnaWNMaW5rPzogc3RyaW5nXHJcbn1cclxuXHJcbmNvbnN0IGJhc2VVcmwgPSBwcm9jZXNzLmVudi5WRVJDRUxfVVJMXHJcbiAgPyBgaHR0cHM6Ly8ke3Byb2Nlc3MuZW52LlZFUkNFTF9VUkx9YFxyXG4gIDogJydcclxuXHJcbmV4cG9ydCBjb25zdCBIZWxsb0VtYWlsID0gKHtcclxuICBtYWdpY0xpbmsgPSAnaHR0cHM6Ly9yYXljYXN0LmNvbScsXHJcbn06IFJheWNhc3RNYWdpY0xpbmtFbWFpbFByb3BzKSA9PiAoXHJcbiAgPEh0bWw+XHJcbiAgICA8SGVhZCAvPlxyXG4gICAgPFByZXZpZXc+TG9nIGluIHdpdGggdGhpcyBtYWdpYyBsaW5rLjwvUHJldmlldz5cclxuICAgIDxCb2R5IHN0eWxlPXttYWlufT5cclxuICAgICAgPENvbnRhaW5lciBzdHlsZT17Y29udGFpbmVyfT5cclxuICAgICAgICA8SW1nXHJcbiAgICAgICAgICBzcmM9e2Ake2Jhc2VVcmx9L3N0YXRpYy9yYXljYXN0LWxvZ28ucG5nYH1cclxuICAgICAgICAgIHdpZHRoPXs0OH1cclxuICAgICAgICAgIGhlaWdodD17NDh9XHJcbiAgICAgICAgICBhbHQ9XCJSYXljYXN0XCJcclxuICAgICAgICAvPlxyXG4gICAgICAgIDxIZWFkaW5nIHN0eWxlPXtoZWFkaW5nfT5Zb3VyIG1hZ2ljIGxpbms8L0hlYWRpbmc+XHJcbiAgICAgICAgPFNlY3Rpb24gc3R5bGU9e2JvZHl9PlxyXG4gICAgICAgICAgPFRleHQgc3R5bGU9e3BhcmFncmFwaH0+XHJcbiAgICAgICAgICAgIDxMaW5rIHN0eWxlPXtsaW5rfSBocmVmPXttYWdpY0xpbmt9PlxyXG4gICAgICAgICAgICAgIPCfkYkgQ2xpY2sgaGVyZSB0byBzaWduIGluIPCfkYhcclxuICAgICAgICAgICAgPC9MaW5rPlxyXG4gICAgICAgICAgPC9UZXh0PlxyXG4gICAgICAgICAgPFRleHQgc3R5bGU9e3BhcmFncmFwaH0+XHJcbiAgICAgICAgICAgIElmIHlvdSBkaWRuJ3QgcmVxdWVzdCB0aGlzLCBwbGVhc2UgaWdub3JlIHRoaXMgZW1haWwuXHJcbiAgICAgICAgICA8L1RleHQ+XHJcbiAgICAgICAgPC9TZWN0aW9uPlxyXG4gICAgICAgIDxUZXh0IHN0eWxlPXtwYXJhZ3JhcGh9PlxyXG4gICAgICAgICAgQmVzdCxcclxuICAgICAgICAgIDxiciAvPi0gUmF5Y2FzdCBUZWFtXHJcbiAgICAgICAgPC9UZXh0PlxyXG4gICAgICAgIDxIciBzdHlsZT17aHJ9IC8+XHJcbiAgICAgICAgPEltZ1xyXG4gICAgICAgICAgc3JjPXtgJHtiYXNlVXJsfS9zdGF0aWMvcmF5Y2FzdC1sb2dvLnBuZ2B9XHJcbiAgICAgICAgICB3aWR0aD17MzJ9XHJcbiAgICAgICAgICBoZWlnaHQ9ezMyfVxyXG4gICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgV2Via2l0RmlsdGVyOiAnZ3JheXNjYWxlKDEwMCUpJyxcclxuICAgICAgICAgICAgZmlsdGVyOiAnZ3JheXNjYWxlKDEwMCUpJyxcclxuICAgICAgICAgICAgbWFyZ2luOiAnMjBweCAwJyxcclxuICAgICAgICAgIH19XHJcbiAgICAgICAgLz5cclxuICAgICAgICA8VGV4dCBzdHlsZT17Zm9vdGVyfT5SYXljYXN0IFRlY2hub2xvZ2llcyBJbmMuPC9UZXh0PlxyXG4gICAgICAgIDxUZXh0IHN0eWxlPXtmb290ZXJ9PlxyXG4gICAgICAgICAgMjA5MyBQaGlsYWRlbHBoaWEgUGlrZSAjMzIyMiwgQ2xheW1vbnQsIERFIDE5NzAzXHJcbiAgICAgICAgPC9UZXh0PlxyXG4gICAgICA8L0NvbnRhaW5lcj5cclxuICAgIDwvQm9keT5cclxuICA8L0h0bWw+XHJcbilcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhlbGxvRW1haWxcclxuXHJcbmNvbnN0IG1haW4gPSB7XHJcbiAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXHJcbiAgZm9udEZhbWlseTpcclxuICAgICctYXBwbGUtc3lzdGVtLEJsaW5rTWFjU3lzdGVtRm9udCxcIlNlZ29lIFVJXCIsUm9ib3RvLE94eWdlbi1TYW5zLFVidW50dSxDYW50YXJlbGwsXCJIZWx2ZXRpY2EgTmV1ZVwiLHNhbnMtc2VyaWYnLFxyXG59XHJcblxyXG5jb25zdCBjb250YWluZXIgPSB7XHJcbiAgbWFyZ2luOiAnMCBhdXRvJyxcclxuICBwYWRkaW5nOiAnMjBweCAyNXB4IDQ4cHgnLFxyXG4gIGJhY2tncm91bmRJbWFnZTogJ3VybChcIi9hc3NldHMvcmF5Y2FzdC1iZy5wbmdcIiknLFxyXG4gIGJhY2tncm91bmRQb3NpdGlvbjogJ2JvdHRvbScsXHJcbiAgYmFja2dyb3VuZFJlcGVhdDogJ25vLXJlcGVhdCwgbm8tcmVwZWF0JyxcclxufVxyXG5cclxuY29uc3QgaGVhZGluZyA9IHtcclxuICBmb250U2l6ZTogJzI4cHgnLFxyXG4gIGZvbnRXZWlnaHQ6ICdib2xkJyxcclxuICBtYXJnaW5Ub3A6ICc0OHB4JyxcclxufVxyXG5cclxuY29uc3QgYm9keSA9IHtcclxuICBtYXJnaW46ICcyNHB4IDAnLFxyXG59XHJcblxyXG5jb25zdCBwYXJhZ3JhcGggPSB7XHJcbiAgZm9udFNpemU6ICcxNnB4JyxcclxuICBsaW5lSGVpZ2h0OiAnMjZweCcsXHJcbn1cclxuXHJcbmNvbnN0IGxpbmsgPSB7XHJcbiAgY29sb3I6ICcjRkY2MzYzJyxcclxufVxyXG5cclxuY29uc3QgaHIgPSB7XHJcbiAgYm9yZGVyQ29sb3I6ICcjZGRkZGRkJyxcclxuICBtYXJnaW5Ub3A6ICc0OHB4JyxcclxufVxyXG5cclxuY29uc3QgZm9vdGVyID0ge1xyXG4gIGNvbG9yOiAnIzg4OThhYScsXHJcbiAgZm9udFNpemU6ICcxMnB4JyxcclxuICBtYXJnaW5MZWZ0OiAnNHB4JyxcclxufVxyXG4iXSwibmFtZXMiOlsiQm9keSIsIkNvbnRhaW5lciIsIkhlYWQiLCJIZWFkaW5nIiwiSHIiLCJIdG1sIiwiSW1nIiwiTGluayIsIlByZXZpZXciLCJTZWN0aW9uIiwiVGV4dCIsIlJlYWN0IiwiYmFzZVVybCIsInByb2Nlc3MiLCJlbnYiLCJWRVJDRUxfVVJMIiwiSGVsbG9FbWFpbCIsIm1hZ2ljTGluayIsInN0eWxlIiwibWFpbiIsImNvbnRhaW5lciIsInNyYyIsIndpZHRoIiwiaGVpZ2h0IiwiYWx0IiwiaGVhZGluZyIsImJvZHkiLCJwYXJhZ3JhcGgiLCJsaW5rIiwiaHJlZiIsImJyIiwiaHIiLCJXZWJraXRGaWx0ZXIiLCJmaWx0ZXIiLCJtYXJnaW4iLCJmb290ZXIiLCJiYWNrZ3JvdW5kQ29sb3IiLCJmb250RmFtaWx5IiwicGFkZGluZyIsImJhY2tncm91bmRJbWFnZSIsImJhY2tncm91bmRQb3NpdGlvbiIsImJhY2tncm91bmRSZXBlYXQiLCJmb250U2l6ZSIsImZvbnRXZWlnaHQiLCJtYXJnaW5Ub3AiLCJsaW5lSGVpZ2h0IiwiY29sb3IiLCJib3JkZXJDb2xvciIsIm1hcmdpbkxlZnQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/../emails/HelloEmail.tsx\n");

/***/ })

};
;