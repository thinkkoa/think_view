'use strict';

/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/7/5
 */
const lib = require('think_lib');
const adapters = {
    ejs: __dirname + '/adapter/ejs.js',
    pug: __dirname + '/adapter/pug.js'
};

module.exports = class {
    constructor(options = {}, driver) {
        if (!driver) {
            throw Error('please install ejs module');
        }
        this.driver = driver;
        this.options = lib.extend({}, options);
    }

    static getInstance(options, type) {
        if (options && type in adapters) {
            let driver;
            switch (type) {
                case 'ejs':
                    driver = require('ejs');
                    break;
                case 'pug':
                    driver = require('pug');
                    break;
                default:
                    driver = require('ejs');
                    break;
            }
            const adapter = lib.require(adapters[type]);
            return new adapter(options, driver);
        } else {
            return null;
        }
    }
};