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
    async fatch(templateFile, data) {
        this.options.filename = templateFile;
        let content = await lib.readFile(templateFile);
        return ejs.compile(content, this.options)(data);
    }
};