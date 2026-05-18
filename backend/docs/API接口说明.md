# 后台管理系统接口说明

## 1. 鉴权说明

- 登录接口：`POST /permission/getMenu`
- 除登录接口外，`/users`、`/malls`、`/accounts`、`/profile`、`/home`、`/permission/logout` 都需要携带 JWT
- 请求头格式：

```http
Authorization: Bearer <token>
```

## 2. 统一响应格式

成功响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "requestId": "9b9b5c2d-xxxx"
}
```

失败响应：

```json
{
  "code": 400,
  "message": "参数错误",
  "data": null,
  "requestId": "9b9b5c2d-xxxx"
}
```

## 3. 分页查询约定

列表接口统一支持以下参数：

- `page`：页码，默认 `1`
- `pageSize`：每页条数，默认 `10`，最大 `100`
- `keyword`：关键字搜索

兼容别名：

- `GET /users` 兼容 `name`
- `GET /malls` 兼容 `name`
- `GET /accounts` 兼容 `username`

统一分页响应：

```json
{
  "list": [],
  "count": 0,
  "page": 1,
  "pageSize": 10
}
```

## 4. 健康检查

### 根接口

- `GET /`

### 健康检查接口

- `GET /health`

示例响应：

```json
{
  "code": 200,
  "message": "服务运行正常",
  "data": {
    "service": "backend",
    "version": "0.1.0",
    "status": "ok",
    "database": "connected",
    "timestamp": "2026-05-18T13:00:00.000Z"
  },
  "requestId": "..."
}
```

## 5. 用户管理

### 查询用户列表

- `GET /users`
- 参数：`page`、`pageSize`、`keyword`

示例：

```http
GET /users?page=1&pageSize=10&keyword=张
```

### 新增用户

- `POST /users`

请求体：

```json
{
  "name": "张三",
  "age": 24,
  "sex": 1,
  "birth": "2001-01-01",
  "addr": "Shanghai"
}
```

### 编辑用户

- `PUT /users/:id`

### 删除用户

- `DELETE /users/:id`

## 6. 商品管理

### 查询商品列表

- `GET /malls`
- 参数：`page`、`pageSize`、`keyword`

### 新增商品

- `POST /malls`

请求体：

```json
{
  "name": "蓝牙耳机",
  "category": "数码",
  "price": 299,
  "stock": 80,
  "status": "上架",
  "coverTag": "new",
  "desc": "热销商品"
}
```

### 编辑商品

- `PUT /malls/:id`

### 删除商品

- `DELETE /malls/:id`

## 7. 账号管理

### 查询账号列表

- `GET /accounts`
- 参数：`page`、`pageSize`、`keyword`

### 新增账号

- `POST /accounts`

请求体：

```json
{
  "username": "editor01",
  "password": "123456",
  "role": "editor",
  "status": "active"
}
```

### 编辑账号角色和状态

- `PUT /accounts/:id`

### 重置账号密码

- `PUT /accounts/:id/password`

请求体：

```json
{
  "password": "newpassword"
}
```

### 删除账号

- `DELETE /accounts/:id`

## 8. 个人中心

### 获取当前资料

- `GET /profile`

### 更新个人资料

- `PUT /profile`

请求体：

```json
{
  "username": "admin",
  "role": "超级管理员",
  "avatar": "user",
  "signature": "欢迎使用后台管理系统",
  "lastLoginTime": "2026-05-18 10:00:00",
  "lastLoginCity": "上海"
}
```

## 9. 首页数据

### 表格数据

- `GET /home/getTableData`

### 卡片统计

- `GET /home/getCountData`

### 图表数据

- `GET /home/getChartData`

## 10. 常见状态码

- `400`：请求参数错误
- `401`：未登录或登录已失效
- `403`：无权限访问
- `404`：资源不存在
- `409`：资源冲突，例如账号已存在
- `500`：服务器内部错误
