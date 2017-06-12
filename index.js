/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/6/12
 */
const lib = require('think_lib');

/**
 * 
 * 
 * @param {any} templateFile 
 * @param {any} ctx 
 * @param {any} options 
 * @returns 
 */
const locateTpl = function (templateFile, ctx, options) {
    let group = ctx.group ? ctx.group : '',
        controller = ctx.controller ? ctx.controller : '',
        action = ctx.action ? ctx.action : '',
        view_path = options.view_path ? options.view_path : process.cwd();

    if (lib.isEmpty(templateFile)) {
        templateFile = [view_path, lib.sep];
        if (group) {
            templateFile.push(group);
            templateFile.push(lib.sep);
        }
        templateFile.push(options.default_theme || 'default');
        templateFile.push(lib.sep);

        templateFile.push(controller);
        templateFile.push(options.file_depr || '_');

        templateFile.push(action);
        templateFile.push(options.file_suffix || '.html');
        return templateFile.join('');
    } else if(lib.isString(templateFile)){
        if (lib.isFile(templateFile)) {
            return templateFile;
        }
        let tplPath = templateFile.split('/');
        action = tplPath.pop().toLowerCase() || action;
        controller = tplPath.pop().toLowerCase() || controller;
        group = tplPath.pop();
        templateFile = [view_path, lib.sep];
        if (group) {
            templateFile.push(group.toLowerCase());
            templateFile.push(lib.sep);
        }
        templateFile.push(options.default_theme || 'default');
        templateFile.push(lib.sep);

        templateFile.push(controller);
        templateFile.push(options.file_depr || '_');

        templateFile.push(action);
        templateFile.push(options.file_suffix || '.html');
        return templateFile.join('');
    }
    return null;
};


module.exports = function (options) {
    think.app.once('appReady', () => {
        const engine = require(`./lib/adapter/${options.engine_type || 'ejs'}`);
        think._view = new engine(options.engine_config || {});
    });

    return function (ctx, next) {
        ctx.fatch = function (templateFile, data) {
            let tplFile = locateTpl(templateFile, ctx, options);
            if (!tplFile || !lib.isFile(tplFile)) {
                ctx.throw(404, `can\'t find template file ${tplFile || ''}`);
            }
            return think._view.fatch(tplFile, data);
        };
        
        ctx.render = function (templateFile, data, charset, contentType) {
            let tplFile = locateTpl(templateFile, ctx, options);
            if (!tplFile || !lib.isFile(tplFile)) {
                ctx.throw(404, `can\'t find template file ${tplFile || ''}`);
            }
            charset = charset || think._caches.configs.config['encoding'] || 'utf-8';
            contentType = contentType || 'text/html';
            ctx.types(contentType, charset);
            return think._view.fatch(tplFile, data).then(res => {
                ctx.body = res;
            });
        };
        return next();
    };
};