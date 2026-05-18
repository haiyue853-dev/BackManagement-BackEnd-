# 后端服务说明

这是后台管理系统的后端服务，基于 `Node.js + Koa + Sequelize + MySQL` 实现。

## 1. 功能概览

当前已完成：

- JWT 登录鉴权
- 用户管理 CRUD
- 商品管理 CRUD
- 账号管理 CRUD
- 管理员权限控制
- 个人中心资料维护
- 首页统计数据接口
- 健康检查接口
- 基础日志与审计日志
- 自动化测试

## 2. 目录说明

- `app.js`
  Koa 应用入口
- `bin/www`
  服务启动文件
- `config`
  数据库和环境变量配置
- `controllers`
  控制器层
- `services`
  业务逻辑层
- `models`
  Sequelize 模型
- `routes`
  路由层
- `middleware`
  中间件
- `utils`
  工具方法、校验、日志、分页等
- `tests`
  自动化测试
- `docs`
  接口文档和部署文档

## 3. 本地启动

### 第一步：准备环境变量

复制：

```bash
.env.example -> .env
```

示例变量：

- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DB_SYNC_ENABLED`
- `DB_SYNC_ALTER`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `LOG_LEVEL`

### 第二步：安装依赖

```bash
npm install
```

### 第三步：启动开发环境

```bash
npm run dev
```

默认访问地址：

```text
http://localhost:3000
```

## 4. 常用命令

启动生产模式：

```bash
npm start
```

开发模式：

```bash
npm run dev
```

运行测试：

```bash
npm test
```

修复账号重复索引：

```bash
npm run db:repair:accounts
```

## 5. 安全与数据说明

- 登录成功后返回 JWT，前端通过 `Authorization: Bearer <token>` 访问受保护接口
- 管理员接口使用角色校验限制
- 密码使用 `bcrypt` 哈希存储
- 默认情况下建议使用：

```env
DB_SYNC_ENABLED=true
DB_SYNC_ALTER=false
```

这样可以避免开发阶段误用 `alter` 影响已有结构

## 6. 文档入口

- 接口文档：`docs/API接口说明.md`
- 部署说明：`docs/部署说明.md`

## 7. 当前状态

当前后端已经具备作为作品项目、演示项目、联调用后端的完整基础能力。  
如果要继续往生产环境靠近，下一步建议继续补：

- 更细粒度权限
- 更完整的异常分类
- 更标准的日志落盘规范
- 数据迁移方案
- 部署自动化
