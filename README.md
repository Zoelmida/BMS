### **BMS** 

BMS基础管理系统 nodejs 版本。  本版本 前端采用了 element-UI的方式 后端采用了nodejs。  数据库采用了mysql。  系统有自动生成dao和mapper的工具。 各个目录的名称在项目结构图中都有注释，欢迎大家多多提提意见！谢谢！

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
#项目启动方式：

    * 从npm上下载包。建议用淘宝的cnpm。 运行命令 cnpm install
    * 运行npm run start即可

    如有bug和疑点请+QQ群 667358564   欢迎一起讨论。
