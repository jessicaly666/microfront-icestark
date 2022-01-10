# 主应用

```js
npm init ice icestark-layout @icedesign/stark-layout-scaffold
yarn start
```

```js
// src/app.ts
icestark: {
  Layout: FrameworkLayout,
  getApps: async () => {
    const apps = [{
      path: '/test',
      title: '测试微应用',
      loadScriptMode: 'import',
      url: [
        '//localhost:3334/build/js/index.js',
        '//localhost:3334/build/js/vendor.js',
        '//localhost:3334/build/css/index.css',
      ],
      props: {
        name: 'liyan',
      },
    }];
    return apps;
  }
}

```

# 子应用

```js
npm init ice icestark-child @icedesign/stark-child-scaffold
yarn start
```

## 子应用的打包模式

第一种，打包 Es Module

- vite:true 就默认的打包 es module(Vite 会默认打包出符合标准的 ES modules 的脚本资源)
- 打包的 js 有 import 语法，报错 Cannot use import statement outside a module
  解决：script 标签从 type="text/javascript" 改成 type="module"

```js
// 子应用 build.json
"vite": true,
"plugins": [
  [
    "build-plugin-icestark",
    {
      "type": "child",
    }
  ],
]

// 主应用 app.ts
{
    path: '/test',
    title: '测试微应用',
    loadScriptMode: 'import',
    url: [
      '//localhost:3334/build/js/index.js',
      '//localhost:3334/build/js/vendor.js',
      '//localhost:3334/build/css/index.css',
    ],
}
```

第二种，打包 UMD

- umd--模块同时兼容 AMD 和 Commonjs。多被一些需要同时支持客户端和服务端的第三方库所使用
- 在微应用层面可以更少的降低跟主应用的耦合
- 条件：主应用 @ice/stark 版本需要高于 1.6.0 微应用依赖的 build-plugin-icestark 版本需要高于 2.0.0

```js
// 子应用 build.json
"vite": false,
"plugins": [
  [
    "build-plugin-icestark",
    {
      "type": "child",
      "umd": true
    }
  ],
]

// 主应用 app.ts
{
  path: '/test',
  title: '测试微应用',
  loadScriptMode: 'script',
  url: [
    '//localhost:3334/js/index.js',
    '//localhost:3334/css/index.css',
  ]
}

```

## 子应用监听路由切换

在 layout 组件中实现相关钩子的监听（onRouteChange、onAppEnter 和 onAppLeave）

```js
const BasicLayout = ({ pathname, appLeave, appEnter, children }) => {
  useEffect(() => {
    console.log(`微应用路由发生变化：${pathname}`);
  }, [pathname]);

  useEffect(() => {
    console.log(`卸载微应用：${appLeave.path}`);
  }, [appLeave]);

  useEffect(() => {
    console.log(`渲染微应用：${appEnter.path}`);
  }, [appEnter]);

  return <div>{children}</div>;
};
```

## 子应用请求

1.配置代理(代理到真实的后端接口)

```js
// build.json
"proxy": {
  "/api": {
    "enable": true,
    "target": "https://photo-test-community.shijue.me",
    "pathRewrite": {
      "^/api": ""
    }
  }
},
```

2.配置环境变量

```js
// /src/config.ts
// 测试的后端接口local  真实的测试环境后端接口stage   真实的生产环境后端接口prod
export default {
  local: {
    baseURL: 'https://test-e-contract-backend.visualchina.com',
  },
  stage: {
    baseURL: 'https://stage-e-contract-backend.visualchina.com',
  },
  prod: {
    baseURL: 'https://vcg-contract-backend.visualchina.com',
  },
};

// src/app.ts
import { runApp, IAppConfig, config } from 'ice';
const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
  },
  request: {
    baseURL: config.baseURL,
  },
};

// package.json
"scripts": {
  "start": "icejs start --port=3334 --mode local --https"
}
// 端口号，配置的local环境变量，支持https
```

## 应用间的样式规范

页面运行同时只会存在一个微应用。

- 多个微应用之间不存在样式污染
- 主应用和微应用之间存在样式污染

  样式约定：

- 1.主应用和子应用统一用 css module
- 2.主应用的 ui 组件库改前缀

```js
[
  "build-plugin-fusion",
  {
    "disableModularImport": true,
    "themePackage": "@alifd/theme-design-pro",
    "themeConfig": {
      // 防止与微应用里的基础组件 css prefix 冲突
      "css-prefix": "next-icestark-"
    }
  }
],
```

- 3.全局重置样式统一在主应用引入就可以了。子应用避免再进行全局样式重置

## 应用间的跳转

```js
import { AppLink, appHistory } from '@ice/stark-app';
// 示例1
const navItem = <AppLink to="/seller" hashType>{item.name}</AppLink>);
// 示例2
appHistory.push('/seller', true);
```

## 应用间的传值

1.Props
主应用在 getApp 中配置 props
子应用:

```js
export default function Home(props) {
  console.log("props", props);
  const {
    frameworkProps: { name },
  } = props;
}
```

2.通过@ice/stark-data 插件

```js
// 主应用
import { store, event } from '@ice/stark-data';
store.set('language', defaultLang);
// 子应用
import { store, event } from '@ice/stark-data';
store.on('language', (lang) => {
    ...
}, true); // true 则表示初始化注册过程中，会强制执行一次
```

```js
// 主应用中监听事件：
import { event } from "@ice/stark-data";
event.on("freshMessage", () => {
  // 重新获取消息数
});
// 子应用触发事件：
event.emit("freshMessage");
```
