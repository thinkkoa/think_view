'use strict';

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/6/12
 */
const ejs = require('ejs');
const lib = require('think_lib');

module.exports = class {
    constructor(options = {}) {
        this.options = lib.extend({}, options);
    }

    /**
     * 
     * 
     * @param {any} templateFile 
     * @param {any} data 
     */
    fatch(templateFile, data) {
        var _this = this;

        return (0, _asyncToGenerator3.default)(function* () {
            _this.options.filename = templateFile;
            let content = yield lib.readFile(templateFile);
            return ejs.compile(content, _this.options)(data);
        })();
    }
};