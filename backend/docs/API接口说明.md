# 后端接口说明

## 1. 鉴权方式

- 登录接口：`POST /permission/getMenu`
- 除登录接口外，`/users`、`/malls`、`/accounts`、`/profile`、`/home` 相关接口都需要携带 JWT
- 请求头格式：

```http
Authorization: Bearer <token>
```

## 2. 通用响应结构

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
  "message": "参数错误说明",
  "data": null,
  "requestId": "9b9b5c2d-xxxx"
}
```

## 3. 统一列表查询规则

三个列表接口统一支持以下参数：

- `page`：页码，默认 `1`
- `pageSize`：每页条数，默认 `10`
- `keyword`：统一搜索关键字，默认空字符串

兼容旧参数：

- `GET /users` 仍兼容 `name`
- `GET /malls` 仍兼容 `name`
- `GET /accounts` 仍兼容 `username`

统一列表返回：

```json
{
  "list": [],
  "count": 0,
  "page": 1,
  "pageSize": 10
}
```

## 4. 用户管理接口

### 4.1 查询用户列表

- 方法：`GET /users`
- 参数：
  - `page`
  - `pageSize`
  - `keyword`

示例：

```http
GET /users?page=1&pageSize=10&keyword=张
```

### 4.2 新增用户

- 方法：`POST /users`

请求体示例：

```json
{
  "name": "张三",
  "age": 24,
  "sex": 1,
  "birth": "2001-01-01",
  "addr": "Shanghai"
}
```

### 4.3 修改用户

- 方法：`PUT /users/:id`

### 4.4 删除用户

- 方法：`DELETE /users/:id`

## 5. 商品管理接口

### 5.1 查询商品列表

- 方法：`GET /malls`
- 参数：
  - `page`
  - `pageSize`
  - `keyword`

### 5.2 新增商品

- 方法：`POST /malls`

请求体示例：

```json
{
  "name": "蓝牙耳机",
  "category": "数码",
  "price": 299,
  "stock": 80,
  "status": "上架",
  "coverTag": "new",
  "desc": "主动降噪"
}
```

### 5.3 修改商品

- 方法：`PUT /malls/:id`

### 5.4 删除商品

- 方法：`DELETE /malls/:id`

## 6. 账号管理接口

### 6.1 查询账号列表

- 方法：`GET /accounts`
- 权限：仅管理员
- 参数：
  - `page`
  - `pageSize`
  - `keyword`

### 6.2 新增账号

- 方法：`POST /accounts`
- 权限：仅管理员

请求体示例：

```json
{
  "username": "editor01",
  "password": "123456",
  "role": "editor",
  "status": "active"
}
```

### 6.3 修改账号状态和角色

- 方法：`PUT /accounts/:id`

### 6.4 重置账号密码

- 方法：`PUT /accounts/:id/password`

请求体示例：

```json
{
  "password": "newpassword"
}
```

### 6.5 删除账号

- 方法：`DELETE /accounts/:id`

## 7. 常见错误码

- `400`：参数错误、格式错误、业务前置条件不满足
- `401`：未登录或登录已过期
- `403`：无权限访问，或账号被禁用
- `404`：资源不存在
- `409`：资源冲突，例如账号已存在
- `500`：服务器内部异常
