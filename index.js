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
        view_path = options.view_path ? options.view_path : think.app_path + '/view';

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
    } else if (lib.isString(templateFile)) {
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
/**
 * default options
 */
const defaultOptions = {
    view_path: think.app_path + '/view', //模板目录
    engine_type: 'ejs', //模版引擎名称
    engine_config: { cache: true }, //模版引擎配置
    content_type: 'text/html', //模版输出类型
    file_suffix: '.html', //模版文件名后缀
    file_depr: '_', //controller和action之间的分隔符
    default_theme: 'default', //默认模板主题
};

module.exports = function (options) {
    options = options ? lib.extend(defaultOptions, options, true) : defaultOptions;
    think.app.once('appReady', () => {
        const engine = require(`./lib/adapter/${options.engine_type || 'ejs'}`);
        think._caches._view = new engine(options.engine_config || {});
    });

    return function (ctx, next) {
        /**
         * 
         * 
         * @param {any} templateFile 
         * @param {any} data 
         * @returns 
         */
        lib.define(ctx, 'fatch', function (templateFile, data) {
            let tplFile = locateTpl(templateFile, ctx, options);
            if (!tplFile || !lib.isFile(tplFile)) {
                ctx.throw(404, `can\'t find template file ${tplFile || ''}`);
            }
            return think._caches._view.fatch(tplFile, data);
        });

        /**
         * 
         * 
         * @param {any} templateFile 
         * @param {any} data 
         * @param {any} charset 
         * @param {any} contentType 
         * @returns 
         */
        lib.define(ctx, 'render', function (templateFile, data, charset, contentType) {
            let tplFile = locateTpl(templateFile, ctx, options);
            if (!tplFile || !lib.isFile(tplFile)) {
                ctx.throw(404, `can\'t find template file ${tplFile || ''}`);
            }
            charset = charset || think._caches.configs.config['encoding'] || 'utf-8';
            contentType = contentType || 'text/html';
            ctx.type(contentType, charset);
            return think._caches._view.fatch(tplFile, data).then(res => {
                ctx.body = res;
            });
        });

        return next();
    };
};