# 全栈后台管理项目

这是一个前后端分离的后台管理系统练手项目，当前已经完成核心模块开发、前后端联调、基础测试和接口文档整理。

## 项目结构

- `BackEnd/backend`
  后端服务，技术栈为 `Node.js + Koa + Sequelize + MySQL`
- `BackManagement`
  前端管理台，技术栈为 `Vue 3 + Vite + Element Plus + Pinia + Vue Router`

## 当前完成情况

- 登录鉴权：JWT 登录、401/403 控制、管理员权限限制
- 用户管理：列表、搜索、分页、新增、编辑、删除
- 商品管理：列表、搜索、分页、新增、编辑、删除
- 账号管理：列表、角色状态编辑、密码重置、删除
- 个人中心：资料查询与更新
- 首页看板：表格、卡片统计、图表数据
- 基础工程化：统一响应格式、统一分页参数、健康检查、基础日志、接口文档、自动化测试

## 仓库说明

这是两个独立仓库协作的项目：

- 后端仓库：`BackEnd`
- 前端仓库：`BackManagement`

如果要单独运行，请分别进入对应目录执行命令。

## 快速开始

### 1. 启动后端

进入：

```bash
cd BackEnd/backend
```

参考 `.env.example` 创建 `.env` 后执行：

```bash
npm install
npm run dev
```

### 2. 启动前端

进入：

```bash
cd BackManagement
```

安装依赖并启动：

```bash
npm install
npm run dev
```

## 文档入口

- 后端接口文档：[BackEnd/backend/docs/API接口说明.md](./backend/docs/API接口说明.md)
- 后端说明文档：[BackEnd/backend/README.md](./backend/README.md)
- 前端说明文档：请查看前端仓库 `BackManagement` 下的 `README.md`

## 当前建议的收尾顺序

1. 完整手工联调首页、用户管理、商品管理、个人中心
2. 本地或云服务器做一次部署演练
3. 再考虑包体积优化、细化权限、日志增强等进阶优化
