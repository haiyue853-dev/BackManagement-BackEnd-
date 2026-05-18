# 后端项目说明

## 1. 环境准备

1. 将 `.env.example` 复制为 `.env`
2. 执行 `npm install`
3. 确保本地 MySQL 已启动，并创建好对应数据库
4. 执行 `npm run dev` 启动后端服务

## 2. 主要环境变量

- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `LOG_LEVEL`

## 3. 运行测试

```bash
npm test
```

## 4. 鉴权说明

- 登录成功后，后端会返回 JWT
- 受保护接口需要在请求头中携带：

```http
Authorization: Bearer <token>
```

- Token 过期时间由 `JWT_EXPIRES_IN` 控制

## 5. 接口文档

详细接口说明见：

- `backend/docs/API接口说明.md`

## 6. 当前能力

- JWT 鉴权
- bcrypt 密码加密
- 用户、商品、账号模块 CRUD
- 统一分页参数与列表响应
- 基础审计日志与错误响应
