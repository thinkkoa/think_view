# 介绍
-----

[![npm version](https://badge.fury.io/js/think_view.svg)](https://badge.fury.io/js/think_view)
[![Dependency Status](https://david-dm.org/richenlin/think_view.svg)](https://david-dm.org/richenlin/think_view)

View engine for ThinkKoa.

# 安装
-----

```
npm i think_view
```

# 使用
-----

1、项目中增加中间件 middleware/view.js
```
module.exports = require('think_view');
```

2、项目中间件配置 config/middleware.js:
```
list: [...,'view'], //加载的中间件列表
config: { //中间件配置
    ...,
    view: {
        view_path: think.app_path + '/view', //模板目录
        engine_type: 'ejs', //模版引擎名称
        engine_config: { cache: true }, //模版引擎配置
        content_type: 'text/html', //模版输出类型
        file_suffix: '.html', //模版文件名后缀
        file_depr: '_', //controller和action之间的分隔符
        default_theme: 'default', //默认模板主题
    }
}
```