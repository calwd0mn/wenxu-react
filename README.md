# 问序

`问序` 是一个可自主部署的问卷系统，包含管理后台、问卷填写端、Nest API 和 MongoDB 数据存储，并已接入 AI 问卷生成与单题优化能力。

## 项目结构

- `src`：React 管理后台
- `next/wenjuan-next`：Next.js 问卷填写端
- `nest-service`：NestJS 后端 API
- `service`：旧版 mock / legacy 服务代码

## 页面示例
<img width="1882" height="1709" alt="image" src="https://github.com/user-attachments/assets/d7003f98-0d92-442b-b3d0-39ab98736805" />

<img width="1882" height="1709" alt="image" src="https://github.com/user-attachments/assets/818aa262-7ca0-4d5b-80a7-ae7ae460cdde" />

<img width="1905" height="1707" alt="image" src="https://github.com/user-attachments/assets/5e8d6d8a-0a9b-47d9-8f55-03421f43284f" />

<img width="1905" height="1707" alt="image" src="https://github.com/user-attachments/assets/a000d993-7524-4e11-8f68-2561121df0ef" />

<img width="1905" height="1206" alt="image" src="https://github.com/user-attachments/assets/407a9626-fc82-45fd-a72e-f39df4221843" />


## 当前能力

- 问卷创建、编辑、删除、标星、发布
- 题目拖拽排序、属性编辑、图层管理
- 统计页与答卷回收
- AI 整页生成问卷
- AI 优化当前题目
- 局域网访问填写端的基础能力

## 推荐本地运行方式

本项目本地开发通常需要同时启动 4 个部分：

1. MongoDB
2. Nest 后端
3. React 管理后台
4. Next 问卷填写端

### 1. 启动 MongoDB

如果你使用 Docker：

```powershell
pwsh -NoLogo -Command "docker start wenjuan-mongo"
```

如果是第一次创建容器：

```powershell
pwsh -NoLogo -Command "docker run -d --name wenjuan-mongo -p 27017:27017 mongo:7"
```

### 2. 启动 Nest 后端

```powershell
pwsh -NoLogo -Command "cd nest-service; npm install; npm run start:dev"
```

默认端口：

- `3003`

### 3. 启动 React 管理后台

在仓库根目录执行：

```powershell
pwsh -NoLogo -Command "npm install; npm start"
```

默认端口：

- `5000`

### 4. 启动 Next 问卷填写端

```powershell
pwsh -NoLogo -Command "cd next/wenjuan-next; npm install; npm run dev"
```

默认端口：

- `8001`

## 环境变量

### 根目录前端 `.env.development`

文件：

- [`.env.development`](D:/Cdocument/desktop/QZH/a前端/project/wenjuan/react-wenjaunxing/.env.development)

推荐内容：

```env
REACT_APP_API_BASE_URL=/api
PORT=5000
```

说明：

- 管理后台通过 `/api` 代理到本地 Nest 服务

### Nest 后端 `nest-service/.env`

文件：

- [`nest-service/.env`](D:/Cdocument/desktop/QZH/a前端/project/wenjuan/react-wenjaunxing/nest-service/.env)

推荐内容：

```env
PORT=3003
MONGO_URL=mongodb://127.0.0.1:27017/wenjuan
SECRET=your_jwt_secret

AI_API_KEY=your_api_key
AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
AI_MODEL=qwen-plus
AI_TIMEOUT=30000
```

说明：

- `AI_BASE_URL` 当前使用 OpenAI 兼容格式，已验证可接 Qwen
- 修改 `.env` 后需要重启 Nest

### Next 填写端 `next/wenjuan-next/.env.local`

先复制模板：

```powershell
pwsh -NoLogo -Command "Copy-Item 'next/wenjuan-next/.env.local.example' 'next/wenjuan-next/.env.local'"
```

推荐内容：

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3003
SERVER_API_BASE_URL=http://127.0.0.1:3003
```

说明：

- 本地默认仍可回退到 `http://127.0.0.1:3003`
- 后续部署到服务器时，只需要改这里，不需要改代码

## 本地访问地址

### 管理后台

```text
http://localhost:5000
```

### 问卷填写端

```text
http://localhost:8001/question/<questionId>
```

注意：

- 发布后的问卷不是从管理后台端口直接访问
- 需要通过 Next 填写端访问

## AI 功能说明

AI 请求由 Nest 后端发起，因此测试 AI 时必须保证：

1. 已配置 `nest-service/.env`
2. 后端已重启
3. 当前前端处于登录状态

如果未登录，AI 接口会被鉴权拦截。

## 局域网访问填写端

填写端已经支持监听局域网地址。

### 第一步：确认电脑当前 IPv4

```powershell
pwsh -NoLogo -Command "ipconfig"
```

例如电脑 IPv4 为：

```text
172.26.124.113
```

### 第二步：手机访问电脑地址

```text
http://172.26.124.113:8001/question/<questionId>
```

注意：

- 手机访问时要填“电脑的 IPv4”
- 不是填手机自己的 IPv4

### 如果手机访问不了

常见原因：

- 校园网 / 宿舍网启用了设备隔离
- 当前网络不允许终端互访

如果电脑自己能访问 `http://电脑IPv4:8001/...`，但手机不能访问，通常就不是项目代码问题，而是网络环境限制。

推荐替代方案：

- 使用手机热点给电脑联网
- 换到允许局域网互访的 Wi‑Fi
- 使用内网穿透工具做临时公网分享

## 构建检查

### React 管理后台

```powershell
pwsh -NoLogo -Command "npm run build"
```

### Nest 后端

```powershell
pwsh -NoLogo -Command "cd nest-service; npm run build"
```

### Next 填写端

```powershell
pwsh -NoLogo -Command "cd next/wenjuan-next; npm run build"
```

## 当前开发建议

如果你继续迭代这个项目，推荐优先做：

1. 条件显示 / 跳题逻辑
2. AI 问卷诊断与整卷优化
3. 文本答卷 AI 总结
4. 版本历史 / 草稿恢复
5. 服务器部署与正式分享链接

## 备注

- 仓库里同时保留了 React 管理后台和 Next 填写端
- `service` 目录属于旧实现，可后续按需要清理
- 真正上线分享给他人填写时，建议把 API、填写端、数据库都部署到公网服务器或自有内网服务器
