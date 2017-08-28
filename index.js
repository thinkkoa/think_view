/**
 *
 * @author     richen
 * @copyright  Copyright (c) 2017 - <richenlin(at)gmail.com>
 * @license    MIT
 * @version    17/6/12
 */
const lib = require('think_lib');
const view = require('./lib/view.js');

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
        templateFile.push(options.default_theme || '');
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
        templateFile.push(options.default_theme || '');
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
    engine_type: 'ejs', //模版引擎名称 ejs, pug
    engine_config: { cache: true }, //模版引擎配置
    content_type: 'text/html', //模版输出类型
    file_suffix: '.html', //模版文件名后缀
    file_depr: '_', //controller和action之间的分隔符
    default_theme: 'default', //默认模板主题
};

module.exports = function (options) {
    options = options ? lib.extend(defaultOptions, options, true) : defaultOptions;
    think.app.once('appReady', () => {
        think._caches._view = view.getInstance(options.engine_config || {}, options.engine_type || 'ejs');
    });

    return function (ctx, next) {

        /**
         * 模板赋值
         * 
         * @param {any} name 
         * @param {any} value 
         * @returns 
         */
        lib.define(ctx, 'assign', function (name, value) {
            if (!ctx._assign) {
                lib.define(ctx, '_assign', {}, 1);
            }
            if (name === undefined) {
                return ctx._assign;
            }
            if (think.isString(name) && arguments.length === 1) {
                return ctx._assign[name];
            }
            if (think.isObject(name)) {
                for (let key in name) {
                    ctx._assign[key] = name[key];
                }
            } else {
                ctx._assign[name] = value;
            }
            return null;
        });

        /**
         * 渲染模板并返回内容
         * 
         * @param {any} templateFile 
         * @param {any} data 
         * @returns 
         */
        lib.define(ctx, 'compile', function (templateFile, data) {
            let tplFile = locateTpl(templateFile, ctx, options);
            if (!tplFile || !lib.isFile(tplFile)) {
                ctx.throw(404, `can\'t find template file ${tplFile || ''}`);
            }
            return think._caches._view.compile(tplFile, data || ctx._assign);
        });

        /**
         * 定位、渲染、输出模板
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
            if (charset !== false && contentType.toLowerCase().indexOf('charset=') === -1) {
                contentType += '; charset=' + charset;
            }
            ctx.type = contentType;

            return think._caches._view.compile(tplFile, data || ctx._assign).then(res => {
                ctx.body = res;
                return think.prevent();
            });
        });

        return next();
    };
};