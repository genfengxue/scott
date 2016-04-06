## 环境配置

#### 安装 node
```
  - 0.12.x
  - 5.4.0
  - 5.9.0
```

#### 安装 redis
```
# 通过brew 安装
$ brew install redis

# 或者
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
```
千万记住要配置redis本地访问  

#### 安装包管理工具
```
npm install -g gulp bower
```

#### 安装项目依赖
```
npm install
bower install
```
注意：

 * babel 6有bug，所以项目默认使用babel 5.8.23  
 * 执行npm install时，如果node-canvas安装失败，执行
 
```
xcode-select --install  
export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig  
```
更多信息：
###### MAC
* 请安装 https://github.com/Automattic/node-canvas  
* EI Capitan 下需要查看这条issue(https://github.com/Automattic/node-canvas/issues/649)

###### Ubuntu
```
$ sudo apt-get update 
$ sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
```

#### 运行本地端口
```
# 默认开启 8000 端口
$ gulp
```

### 安装imagemagic
sudo apt-get update  
sudo apt-get install imagemagick --fix-missing


## 部署
### 创建rsa  
```
cd $HOME/.ssh/
openssl genrsa -out server.pem 2048
openssl rsa -in server.pem -pubout -out server.pub
```


## 发布
### 测试
```
NODE_ENV=test gulp build --release # 测试环境编译
NODE_ENV=test pm2 start build/app.js --name "scott-test"
```

### 真实
```
NODE_ENV=production gulp build --release # 发布环境编译
NODE_ENV=production pm2 start build/app.js --name "scott-prod"
```
或者
```
sh deploy/prod.sh
```

## 贡献代码
`npm install -g commitizen`  
git message必须符合规范, 使用ghook限制，初次提交代码前，执行`chmod +x validate-commit-msg.js`  
使用`git commit`的地方用`git cz`代替。


### 创建一个express页面
在`app/views/`目录下新增一个[ejs](http://www.embeddedjs.com/)文件  
app/views/new.ejs  
```html
<% layout('layout') -%>
<% title = 'new' %>
<% stylesheet('/css/new.css') -%>
<% script('/js/new.js') -%>
<div class="new">
  <div class="content">
    <h4>
      This is new
    </h4>
  </div>
</div>
```
如果需要使用父模版，ejs文件头部加：`<% layout('layout') -%>`  
如果有js文件，或者css文件，ejs文件头部加：`<% script('/js/new.js') -%>`, `<% stylesheet('/css/new.css') -%>`，同时，在`public/js/`, `public/css/`下创建js文件，和less文件。  
为什么引用处使用css，而原文件是less？gulpfile中有一个task会把less文件编译为css放入项目运行目录下 `build/public/css/`  
如果添加js文件，除了在`public/js/`下创建js文件，还需要在gulpfile中定义js入口文件。  
![](./docs/add_entry_js.gif)

### 创建一个express route
创建完页面后，需要加上对应的路由才可以访问到页面  
两种方式：  
1. 在已有的路由文件中添加子路由，比如在`app/controllers/home.js`中添加一个url为`/home/new/`，http method 为`get`的路由，
```javascript
router.get('/new/', async (req, res) => {
  try {
    const local = {message: 'new'};
    res.render('new', local);
  } catch (err) {
    next(err);
  }
});
```
2. 创建一个新的路由文件，然后在`app/config/express.js`中引用
![](./docs/router.png)

### 创建一个express api
在`app/api/`目录下创建api文件，然后在`app/config/express.js`中引用
![](./docs/api_router.png)

### 创建一个redux页面
- 在`public/js/redux`目录下创建一个reducer
![](./docs/reducer.gif)
- 在`homeReducer.js`中引入上一步创建的reducer，
```
import homeViewState from './homeViewState';
import user from './user';
import updateMobileState from './updateMobileState';
import updateEmailState from './updateEmailState';
import {combineReducers} from 'redux';
import newReducer from './new'; // 这里引入文件

export default combineReducers({
  homeViewState, user, updateMobileState, updateEmailState,
  newReducer: newReducer // 这里给reducer分配一个key，这个key之后可以在整个state中访问
});
```
这个时候，已经可以在整个app的state中访问到这个reducer了
- 在`public/views/`目录下创建一个view
```
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import {actions} from '../redux/newReducer';
const mapStateToProps = ({newReducer}) => ({
  newReducer,
});
class NewView extends Component {
  static propTypes = {
    newEvent: PropTypes.func, // 可以在props中调用newReducer中的action
    newReducer: PropTypes.object, // 可以在props中取到newReducer
  };
  render() {
    return (
      <div className="new-view">
        {this.props.newReducer}
      </div>
    );
  }
}
export default connect(
  mapStateToProps, 
  actions, 
)(NewView); // 这一步实现了view和reducer的绑定。
```
- 暴露路由，创建好了页面和reducer，还需要设置路由才能访问该页面  
在`public/js/routes/home.js`中设置路由
```
<Route path="/" component={CoreLayout}>
  ...
  <Route path="/home/new" component={NewView} />
  ...
</Route>
```
注意，此处的路由都是在#后面的(.com/#/home/new)，之所以这样是因为安卓微信不支持h5 history api，如果使用h5路由(.com/home/new)的话，需要在服务器端也做相应配置，  
```
router.get('/home/*', async (req, res) => {
  try {
    res.render('index', {});
  } catch (err) {
    res.redirect('/login/');
  }
});
```
这里，所有home开头的路由都会指向这个react-redux app入口页面。

## [Roadmap](./Roadmap.md)

## [Changelog](./Changelog.md)


## CMS
该文档用于wind-cms  
https://coding.net/u/cagegong/p/wind-cms/git  
### 环境
- node // 我们使用nvm来管理node版本
- mongo // 绑定到本地端口访问，提高安全性
- ffmpeg // https://trac.ffmpeg.org/wiki/CompilationGuide/Ubuntu
```
npm install gulp bower -g
npm install
```
- 创建.env文件
```
COOKIE_SECRET=c0272b28ce1b4de1d48898cf8eccd2dcca24c4adb5657edcabedfd6d32df667ec4cfe4b67447976a75cb0c45c0ce7f31ecf40a44226b9f6e3645188f545d8d4d
CLOUDINARY_URL=cloudinary://333779167276662:_8jbSi9FB3sWYrfimcl8VKh34rI@keystone-demo
```
### 运行
npm start
