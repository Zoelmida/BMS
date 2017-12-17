# **BMS** 

> ## BMS系统是基于vue开发的一套cms系统。
> ### 前端：Vue、Vuex、Vue-router、ELEMENT-UI 
> ### 后端：nodejs、express

> ## 项目架构图：

```
    bms
    |--.vscode
    |    |--launch.json
    | 
    |--app    
    |    |--api(后台controller)
    |    |--components(前台vue组件)    
    |    |--dao(后台数据库操作)
    |    |--router(前端路由)
    |    |--static(前端静态文件)
    |    |--store(vuex，用来组建之间数据共享)
    |    |--util(前端常用函数的封装，包括插件)
    |    |--dev-client.js
    |    |--index.html
    |    |--README.MD
    |    |--server.js
    |--genAppAndDao(自动生成后端controller和mapper) 
    |--webpack(webpack配置文件)
    |--.eslintrc.js(eslint配置文件)
    |--.gitignore
    |......
```
> ## 登陆界面如下：

### 登陆页
![login](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/bms/login.jpg?raw=true)
### 主页
![index](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/bms/index.jpg?raw=true)
### 权限赋予
![rightGiven](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/bms/rightGiven.jpg?raw=true)
### 角色管理
![roleManage](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/bms/roleManage.jpg?raw=true)
### 用户管理
![userManage](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/bms/userManage.jpg?raw=true)
### 菜单管理
![menuManage](https://github.com/wangyi7099/pictureCdn/blob/master/allPic/bms/menuManage.jpg?raw=true)

> ## 项目启动方式：
* 首先乣从npm上下载依赖包。建议把registry设置成淘宝的registry，命令：```npm set registry https://registry.npm.taobao.org``` 
* 运行命令 ```npm install```
* 运行npm run dev,然后访问8888端口即可.
