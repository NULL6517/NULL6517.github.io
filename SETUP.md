# 装修材料管理系统设置指南

## 1. 数据库设置

### 1.1 安装MySQL
确保您的计算机上已安装MySQL数据库。如果没有安装，可以从[MySQL官网](https://dev.mysql.com/downloads/mysql/)下载并安装。

### 1.2 创建数据库和表

1. 打开MySQL客户端（如Navicat、MySQL Workbench等），连接到您的MySQL服务器。
2. 创建一个名为`ruishenghe_db`的数据库。
3. 执行`ruishenghe_decoration.sql`文件中的SQL语句，创建材料表、作品集表、管理员表、分类表和品牌表，并插入初始数据。

## 2. 项目设置

### 2.1 安装依赖

在项目根目录下运行以下命令安装依赖：

```bash
npm install
```

### 2.2 配置数据库连接

编辑`db.js`文件，根据您的MySQL服务器配置修改以下参数：

```javascript
const pool = mysql.createPool({
  host: 'localhost',      // MySQL服务器地址
  user: 'root',           // MySQL用户名
  password: '',           // MySQL密码
  database: 'ruishenghe_db',  // 数据库名称
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

## 3. 启动服务器

在项目根目录下运行以下命令启动服务器：

```bash
npm start
```

服务器将在`http://localhost:3002`上运行。

## 4. 访问系统

### 4.1 管理端

打开浏览器，访问以下地址进入管理端：

```
http://localhost:3002/admin/html/material-management.html
```

### 4.2 用户端

打开浏览器，访问以下地址进入用户端：

```
http://localhost:3002/user/html/index.html
```

## 5. 功能说明

### 5.1 管理端功能
- 查看所有材料
- 添加新材料
- 编辑现有材料
- 删除材料
- 搜索和筛选材料
- 管理作品集

### 5.2 用户端功能
- 浏览材料列表
- 按类别、价格、品牌、风格筛选材料
- 查看材料详情
- 将材料加入采购单
- 浏览作品集
- 查看公司简介

## 6. 数据同步

系统使用MySQL数据库存储数据，所有操作都会实时同步到数据库。这意味着：

- 管理端的任何修改都会立即保存到数据库
- 不同设备访问系统时都会看到最新的数据
- 前端页面会从数据库获取最新数据，确保数据实时同步

## 7. 注意事项

- 确保MySQL服务正在运行
- 确保数据库连接配置正确
- 确保服务器正在运行
- 所有API请求都指向`http://localhost:3002/api`

## 8. 项目结构

### 8.1 管理端
- `admin/html/`：管理端页面
  - `material-management.html`：材料管理页面
  - `add-material.html`：添加材料页面
  - `portfolio-management.html`：作品集管理页面
- `admin/js/`：管理端脚本
  - `material-management.js`：材料管理脚本
  - `add-material.js`：添加材料脚本
  - `portfolio-management.js`：作品集管理脚本
- `admin/css/`：管理端样式
  - `common.css`：公共样式
  - `material-management.css`：材料管理样式

### 8.2 用户端
- `user/html/`：用户端页面
  - `index.html`：首页
  - `material-hub.html`：材料中心页面
  - `material-detail.html`：材料详情页面
  - `cart.html`：采购单页面
  - `portfolio.html`：作品集页面
  - `about-us.html`：关于我们页面
- `user/js/`：用户端脚本
  - `common.js`：公共脚本
  - `material-hub.js`：材料中心脚本
  - `material-detail.js`：材料详情脚本
  - `cart.js`：采购单脚本
- `user/css/`：用户端样式
  - `common.css`：公共样式
  - `material-detail.css`：材料详情样式
  - `material-hub.css`：材料中心样式

### 8.3 服务器
- `server.js`：服务器主文件
- `db.js`：数据库连接配置

### 8.4 数据
- `ruishenghe_decoration.sql`：数据库初始化SQL文件
- `materials.json`：材料数据备份
- `portfolio.json`：作品集数据备份

## 9. API接口

### 9.1 材料相关
- `GET /api/materials`：获取所有材料
- `GET /api/materials/:id`：获取单个材料
- `POST /api/materials`：添加材料
- `PUT /api/materials/:id`：更新材料
- `DELETE /api/materials/:id`：删除材料

### 9.2 作品集相关
（待实现）

### 9.3 分类相关
（待实现）

### 9.4 品牌相关
（待实现）