# AI导航 — Cloudflare Pages 部署教程

## 概览

需要配置 2 个 GitHub Secrets，让 GitHub Actions 自动部署到 Cloudflare Pages。

| Secret 名称 | 来源 |
|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard 首页 |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 令牌页面创建 |

---

## 第一步：获取 Cloudflare Account ID

1. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com)，登录你的账号
2. 进入首页后，点击左侧菜单 **「Workers 和 Pages」**
3. 在右侧边栏找到 **「账户 ID」**（Account ID），点击复制
   - 这是一串 32 位的十六进制字符串，类似：`a1b2c3d4e5f6...`
4. **保存好这个值**，稍后要用

> 如果右侧栏没有显示，也可以在：账户首页 → 右下角「API」区域找到

---

## 第二步：创建 Cloudflare API Token

1. 打开 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - 或者：右上角头像 → **「我的个人资料」** → 左侧 **「API 令牌」**
2. 点击 **「创建令牌」**（Create Token）
3. 在模板列表中，找到 **「Edit Cloudflare Workers」**，点击右侧 **「使用模板」**
4. 权限配置（模板已预填，确认即可）：
   - Account / Cloudflare Pages → **Edit**
   - Zone / Zone → **Read**（可选）
5. 账户资源：选择 **你的账户**
6. 点击 **「继续以显示摘要」** → **「创建令牌」**
7. **立即复制 Token 值**（只显示一次！）
   - 类似：`Abc123Xyz456...` 的长字符串

---

## 第三步：在 GitHub 添加 Secrets

你当前已在此页面：`Settings → Secrets and variables → Actions`

### 添加第 1 个 Secret：CLOUDFLARE_ACCOUNT_ID

1. 点击绿色按钮 **「New repository secret」**
2. 填写：
   - **Name**: `CLOUDFLARE_ACCOUNT_ID`
   - **Secret**: 粘贴第一步复制的 Account ID
3. 点击 **「Add secret」**

### 添加第 2 个 Secret：CLOUDFLARE_API_TOKEN

1. 再次点击 **「New repository secret」**
2. 填写：
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Secret**: 粘贴第二步创建的 API Token
3. 点击 **「Add secret」**

### 添加完成后

页面应显示：

```
Repository secrets
┌─────────────────────────────────┐
│ CLOUDFLARE_ACCOUNT_ID  Updated just now  │
│ CLOUDFLARE_API_TOKEN   Updated just now  │
└─────────────────────────────────┘
```

---

## 第四步：触发部署

Secrets 配好后，有两种方式触发：

### 方式 A：推送代码（自动触发）
```bash
git commit --allow-empty -m "ci: trigger deploy"
git push
```

### 方式 B：手动触发
1. 打开仓库 → **「Actions」** 标签页
2. 选择 **「Build & Deploy」** workflow
3. 如果有 `workflow_dispatch` 可手动运行；否则用方式 A

---

## 第五步：验证部署

1. 打开仓库 **「Actions」** 标签页，查看 workflow 运行状态
2. 绿色 ✓ 表示成功
3. 打开 [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages**
4. 找到 **ai-navigator** 项目，点击查看部署 URL
5. 默认域名格式：`ai-navigator.pages.dev`

---

## 自定义域名（可选）

1. Cloudflare Dashboard → Workers & Pages → ai-navigator
2. 点击 **「自定义域」** 标签
3. 点击 **「设置自定义域」**
4. 输入你的域名（如 `nav.yourdomain.com`）
5. 如果域名在 Cloudflare 管理，DNS 记录会自动添加

---

## 常见问题

| 问题 | 解决方案 |
|---|---|
| Actions 运行失败 "Authentication error" | 检查 CLOUDFLARE_API_TOKEN 是否正确复制，重新创建一个 |
| "Account not found" | 检查 CLOUDFLARE_ACCOUNT_ID 是否正确 |
| 构建失败 "npm ci failed" | 确保 web/package-lock.json 已提交 |
| 页面显示 404 | 确认 build output 是 `web/dist`，检查 `_redirects` 文件 |
