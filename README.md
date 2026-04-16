# 瑞圣合空间有限公司 - 材料管理系统

## 项目结构

```
瑞圣合/
├── index.html                          # 项目入口页面
├── user端/                             # 用户端
│   ├── css/                            # 用户端样式文件
│   │   ├── common.css                  # 公共样式
│   │   ├── material-hub.css            # 材料库页面样式
│   │   └── material-detail.css         # 材料详情页面样式
│   ├── js/                             # 用户端JavaScript文件
│   │   ├── common.js                   # 公共JavaScript
│   │   ├── material-hub.js             # 材料库功能
│   │   └── material-detail.js          # 材料详情功能
│   └── html/                           # 用户端HTML页面
│       ├── index.html                  # 用户端首页
│       ├── material-hub.html           # 材料库页面
│       ├── material-detail.html        # 材料详情页面
│       └── about-us.html               # 关于我们页面
├── admin端/                            # 管理员端
│   ├── css/                            # 管理员端样式文件
│   │   ├── common.css                  # 公共样式
│   │   └── material-management.css     # 材料管理页面样式
│   ├── js/                             # 管理员端JavaScript文件
│   │   ├── common.js                   # 公共JavaScript
│   │   ├── material-management.js      # 材料管理功能
│   │   └── add-material.js             # 添加材料功能
│   └── html/                           # 管理员端HTML页面
│       ├── material-management.html    # 材料管理页面
│       └── add-material.html           # 添加材料页面
└── img/                                # 图片资源目录
```

## 功能说明

### 用户端功能

1. **首页** ([index.html](user端/html/index.html))
   - 公司介绍和展示
   - 材料分类导航
   - 精选材料展示
   - 快速入口

2. **材料库** ([material-hub.html](user端/html/material-hub.html))
   - 浏览所有材料
   - 按类别筛选（地板、瓷砖、涂料、门窗、五金、卫浴）
   - 按价格范围筛选
   - 按品牌筛选
   - 搜索功能
   - 排序功能（默认、价格从低到高、价格从高到低、新品优先）
   - 查看材料详情
   - 加入采购单

3. **材料详情** ([material-detail.html](user端/html/material-detail.html))
   - 查看材料详细信息
   - 查看材料图片
   - 查看价格、规格、库存等信息
   - 查看相关材料推荐
   - 加入采购单

4. **关于我们** ([about-us.html](user端/html/about-us.html))
   - 公司简介
   - 核心价值观
   - 发展历程
   - 核心团队介绍
   - 联系方式和地图

### 管理员端功能

1. **材料管理** ([material-management.html](admin端/html/material-management.html))
   - 查看所有材料列表
   - 搜索材料
   - 按类别筛选
   - 查看材料详情
   - 编辑材料信息
   - 删除材料
   - 添加新材料
   - 导出材料数据
   - 分页显示

2. **添加材料** ([add-material.html](admin端/html/add-material.html))
   - 填写材料基本信息
   - 设置材料类别和品牌
   - 设置价格和库存
   - 上传材料图片
   - 添加材料描述
   - 设置标签
   - 设置推荐和新品标识

## 技术栈

- **前端框架**: Bootstrap 4
- **JavaScript库**: jQuery 3.5.1
- **图标库**: Font Awesome 6.4.0
- **字体**: Noto Sans SC (Google Fonts)
- **地图**: 腾讯地图 API

## 使用说明

### 启动项目

1. 直接打开 `index.html` 文件即可访问项目入口页面
2. 在入口页面选择进入用户端或管理员端

### 用户端使用

1. 浏览材料库，使用筛选和搜索功能查找需要的材料
2. 点击"查看详情"查看材料详细信息
3. 点击"加入采购单"将材料加入采购单

### 管理员端使用

1. 在材料管理页面查看所有材料
2. 使用搜索和筛选功能快速找到材料
3. 点击"查看"查看材料详情
4. 点击"编辑"修改材料信息
5. 点击"删除"删除材料
6. 点击"添加新材料"添加新的材料到材料库

## 数据存储

当前版本使用浏览器本地存储(localStorage)来存储材料数据，数据在页面刷新后仍然保留。

## 浏览器兼容性

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 联系方式

- 电话: 13607171285
- 地址: 古田二路龙湖春江郦城二期底商13栋-402
- 邮箱: info@ruishenghe.com

## 版权信息

&copy; 2025 瑞圣合空间有限公司