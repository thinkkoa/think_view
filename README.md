# 介绍
-----

[![npm version](https://badge.fury.io/js/think_view.svg)](https://badge.fury.io/js/think_view)

View engine Middleware for ThinkKoa.

# 安装
-----

```
npm i think_view
```

# 使用
-----

## Thinkkoa

1、项目中增加中间件 

```
think middleware view
```

2、修改 middleware/view.js:
```
module.exports = require('think_view');
```

3、项目中间件配置 config/middleware.js:
```
list: [...,'view'], //加载的中间件列表
config: { //中间件配置
    ...,
    view: {
        view_path: process.env.APP_PATH + '/view', //模板目录
        engine_type: 'ejs', //模版引擎名称 ejs, pug
        engine_config: { cache: true }, //模版引擎配置
        content_type: 'text/html', //模版输出类型
        file_suffix: '.html', //模版文件名后缀
        file_depr: '_', //controller和action之间的分隔符
        default_theme: 'default', //默认模板主题
    }
}
```

## Koatty

1、项目中增加中间件

```shell
koatty middleware view;
```

2、修改 middleware/View.ts:

```
import { Middleware, Helper } from "koatty";
import { App } from '../App';
const jwt = require("think_view");

@Middleware()
export class View {
    run(options: any, app: App) {
        return view(options, app);
    }
}
```

3、项目中间件配置 config/middleware.ts:
```
list: [...,'View'], //加载的中间件列表
config: { //中间件配置
    ...,
    View: {
        view_path: process.env.APP_PATH + '/view', //模板目录
        engine_type: 'ejs', //模版引擎名称 ejs, pug
        engine_config: { cache: true }, //模版引擎配置
        content_type: 'text/html', //模版输出类型
        file_suffix: '.html', //模版文件名后缀
        file_depr: '_', //controller和action之间的分隔符
        default_theme: 'default', //默认模板主题
    }
}

```

# 渲染模板

```js
// controller
this.assign("test", "aa"); //assign to template
return this.render(process.env.ROOT_PATH + '/static/html/index.html');
....

```