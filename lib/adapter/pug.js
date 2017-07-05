'use strict';

/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/6/12
 */
const lib = require('think_lib');
const view = require('../view.js');

module.exports = class extends view {
    constructor(options = {}, driver) {
        super(options, driver);
        this.options = lib.extend({
            cache: true,
            debug: false
        }, options);
    }

    /**
     * 
     * 
     * @param {any} templateFile 
     * @param {any} data 
     */
    fatch(templateFile, data) {
        const compileFile = lib.promisify(this.driver.compileFile, this.driver);
        return compileFile(templateFile, this.options)(data);
    }
};