## 环境配置
- node
- redis
`brew install redis`  
or  
```
wget http://download.redis.io/redis-stable.tar.gz
tar xvzf redis-stable.tar.gz
cd redis-stable
make
```
千万记住要配置redis本地访问  

```
npm install -g gulp babel@^5.8.23 bower
npm install
bower install
```
注意：babel 6有bug，所以使用babel 5.8.23  


### 安装imagemagic
sudo apt-get update  
sudo apt-get install imagemagick --fix-missing

### Ubuntu
```
$ sudo apt-get update 
$ sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
```

### MAC
请安装 https://github.com/Automattic/node-canvas  
EI Capitan 下需要查看这条issue  
https://github.com/Automattic/node-canvas/issues/649  
xcode-select --install  
export PKG_CONFIG_PATH=/opt/X11/lib/pkgconfig  

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


## 兼容性
- IE 8 不兼容object defineProperty，因此，在es6中避免使用getter setter
- IE 8 不支持 background-size，使用2x图片的地方可以用bootstrap的 .img-retina，在ie 8上自动fallback到1倍图
- IE 8 不支持圆角，1. 忽悠设计接受在ie 8上显示直角，material design， metro style 2. 使用CSS pie
- IE 8 中使用react 习惯性的给所有元素都加key吧

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
### 运行
npm start

