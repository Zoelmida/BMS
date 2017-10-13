# **BMS** 

#### BMS基础管理系统 nodejs 版本。系统是一个单页SPA应用，分为前后端。  前端采用了 element-UI,Vue框架, 后端是nodejs，借鉴了java的的文件结构，既DAO+controller形式。数据库用的是mysql。本系统扩展性极强，如果你想增加某个菜单，请先在数据库里增加一个表，然后运行系统目录的配套自动生成工具genAppAndDao，即可自动生成DAO+CONTROLLER层，实现了对数据的增删改查功能。如果想要添加更多功能，请自行在对应的文件增加功能。

```
项目架构图：
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
项目启动方式：
====
    * 从npm上下载包。建议用淘宝的cnpm。 运行命令 cnpm install
    * 运行npm run start即可

    如有bug和疑点请+QQ群 667358564   欢迎一起讨论。
   
