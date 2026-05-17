# AI导航 — UI/UX 设计方案 v4

> 项目名称: AI Navigator  
> 技术栈: React + TypeScript + Tailwind CSS + Browser Extension (Manifest V3)  
> 设计风格: Glassmorphism + 明暗双模式 + 统一卡片网格  
> 更新日期: 2026-05-17

---

## 一、交互模型: 两态切换

### 状态 1 — Landing (默认)

```
┌──────────────────────────────────────────┐
│                               [⚙] [☀/🌙] │  ← 右上浮动: 设置(隐藏) + 主题
├──────────────────────────────────────────┤
│                                          │
│                                          │
│               ◇ (绿色图标)               │  ← padding-top: 35vh
│                                          │
│      ┌────────────────────────────┐      │
│      │ 在 百度 中搜索...       🔍  │      │  ← 纯净搜索栏
│      └────────────────────────────┘      │
│                                          │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

- 页面垂直居中 (padding-top: 35vh), 仅展示图标 + 搜索框
- **无标题文字、无副标题、无提示文字**
- 搜索引擎切换按钮、分类标签、书签卡片全部隐藏
- 右上角仅主题切换按钮可见; 设置按钮 (⚙) 隐藏 (opacity:0)
- 搜索框 placeholder 显示当前引擎名称
- 回车搜索 / 点击搜索图标直接用当前引擎搜索
- 点击任意空白区域触发 → Expanded 状态

### 状态 2 — Expanded (点击空白处触发)

```
┌──────────────────────────────────────────────────┐
│                                      [⚙] [☀/🌙] │  ← 设置按钮渐入
├──────────────────────────────────────────────────┤
│  ◇ (图标)                                        │  ← 图标上移
│  ┌──────────────────────────────┐                │
│  │ 在 百度 中搜索...         🔍  │                │
│  └──────────────────────────────┘                │
├──────────────────────────────────────────────────┤
│  [AI 官网][开发工具][API 服务][常用网站]            │
│  [国际网站][技术社区][影音娱乐][设计资源]           │
│  [教育学习][新闻资讯][金融理财][云服务]             │
│  [自定义]                                          │  ← 分类 pill
├──────────────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ...        │
│  │icon│ │icon│ │icon│ │icon│ │icon│             │
│  │名称│ │名称│ │名称│ │名称│ │名称│             │  ← 统一尺寸卡片
│  │描述│ │描述│ │描述│ │描述│ │描述│             │
│  └────┘ └────┘ └────┘ └────┘ └────┘             │
│  ...                                             │
├──────────────────────────────────────────────────┤
│  AI导航 v1.0.0                                    │
└──────────────────────────────────────────────────┘
```

- 点击任意空白区域触发展开
- 设置按钮 (⚙) 渐入显示 (revealable → show)
- 分类标签、卡片网格、Footer 依次从下方滑入 (stagger 80ms)
- 图标 + 搜索栏上移到顶部 (padding-top: 35vh → 24px)
- **展开后再次点击空白区域收起**, 回到 Landing 状态
- 点击卡片、分类标签、搜索框、设置/主题按钮不触发收起

---

## 二、设计系统

### 2.1 色彩 (暗色/亮色双模式)

| 角色 | 暗色 | 亮色 |
|------|------|------|
| 背景 | `#0F172A` | `#F1F5F9` |
| 卡片 glass | `rgba(255,255,255,0.05)` | `rgba(255,255,255,0.6)` |
| 卡片 glass-strong | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.75)` |
| 边框 | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.06)` |
| CTA / 主色 | `#22C55E` | `#22C55E` |
| 主文本 (t1) | `#F8FAFC` | `#0F172A` |
| 次文本 (t2) | `#94A3B8` | `#64748B` |
| 淡文本 (t3) | `#64748B` | `#94A3B8` |

### 2.2 字体

- 标题/代码: JetBrains Mono 400-700
- 正文: IBM Plex Sans 300-700
- 中文: Noto Sans SC 400-700

### 2.3 卡片尺寸 (统一)

- 宽度: 网格自动等分
- 高度: **固定 110px**
- 内容: 居中 — favicon (32x32) + 标题 + 描述/URL
- 圆角: 12px (`rounded-xl`)
- 间距: 10px (`gap-2.5`)

### 2.4 图标

- 网站图标: Google Favicon API (`https://www.google.com/s2/favicons?sz=64&domain=`)
- UI 图标: 内联 SVG (Heroicons 风格, stroke-width:2)
- 图标加载失败: 显示绿色背景 + 首字母 fallback

---

## 三、主题切换动画 (Ripple)

```
点击 [☀/🌙] →
  1. 从按钮中心创建圆形 div
  2. 圆形颜色 = 目标主题背景色 (暗→#0F172A, 亮→#F1F5F9)
  3. transform: scale(0) → scale(1), 半径覆盖全屏
  4. z-index: 1 (粒子 z:0 < ripple z:1 < 内容 z:10)
  5. transitionend 事件触发后:
     a. 注入全局 style 禁用所有 transition (防闪烁)
     b. 切换 .dark class (body 无 background transition, 仅 color .3s)
     c. 强制 reflow, 移除 ripple
     d. 下一帧恢复 transition
```

- **body 仅保留 `transition: color .3s`**, 移除 background 过渡防止闪烁
- 使用 `transitionend` 替代 `setTimeout`, 确保 ripple 完全展开后才切换
- 切换瞬间注入 `* { transition-duration: 0s !important }` 防止所有元素闪烁
- 动画期间书签卡片和搜索框保持可见 (z:10 > ripple z:1)
- 粒子背景被 ripple 覆盖 (z:0 < z:1)
- cubic-bezier(.4,0,.2,1) 缓动

---

## 四、分类与网站收录

### 13 个分类, 共计 310+ 网站

| 分类 | 数量 | 代表网站 |
|------|------|---------|
| AI 官网 | 30 | ChatGPT, Claude, Gemini, Perplexity, Midjourney, Suno, Kimi, 通义千问, 文心一言, 豆包, DeepSeek, 智谱清言, 讯飞星火, Grok, Copilot, Runway, ElevenLabs, 扣子, 海螺AI, 秘塔搜索, Luma AI, Ideogram, 通义万相 |
| 开发工具 | 62 | GitHub, GitLab, Gitee, VS Code, Cursor, Windsurf, Zed, JetBrains, Docker Hub, Vercel, Netlify, Supabase, Firebase, Figma, Notion, Linear, Postman, Bruno, Cloudflare, Sentry, Grafana, Warp, CodePen, StackBlitz, Replit, CodeSandbox, npm, PyPI, MDN, Regex101, TypeScript, Tailwind, Vite, DevDocs, Codeium, Sourcegraph, Trae, Claude Code, Codex, Lovable, Bolt, v0, AiPy, Qoder, CodeBuddy, 灵珠, 码上飞, 美团NoCode, Devin, GitHub Copilot |
| API 服务 | 22 | OpenAI, Anthropic, Google AI, Hugging Face, Replicate, Together AI, 硅基流动, Groq, Mistral, AWS Bedrock, Azure AI, OpenRouter, 百炼, Pinecone, Weaviate, LangChain, Stripe, Twilio, Algolia |
| 常用网站 | 32 | 百度, B站, 知乎, 微博, 淘宝, 京东, 拼多多, 抖音, 小红书, 今日头条, 豆瓣, 飞书, 钉钉, 语雀, WPS, 腾讯文档, 携程, 美团, 12306, 高德地图, 天眼查, 闲鱼, 唯品会, 苏宁, 58同城, 链家, 汽车之家 |
| 国际网站 | 26 | Google, Wikipedia, Reddit, X/Twitter, Facebook, Instagram, LinkedIn, Amazon, eBay, WhatsApp, Telegram, Discord, Slack, Medium, TikTok, Zoom, Pinterest, Airbnb, Uber, Booking, PayPal, Etsy |
| 技术社区 | 18 | CSDN, 掘金, SegmentFault, V2EX, Stack Overflow, Dev.to, Hacker News, Product Hunt, InfoQ, OSChina, LeetCode, 牛客, Hashnode, 36氪, 少数派, Lobsters, Ruby China, IndieHackers |
| 影音娱乐 | 23 | YouTube, Netflix, Spotify, Disney+, B站, 爱奇艺, 优酷, 腾讯视频, 芒果TV, 网易云音乐, QQ音乐, Twitch, 斗鱼, 虎牙, Steam, Epic Games, IMDb, Apple Music, Max, Prime Video, 咪咕视频, 酷狗音乐, SoundCloud |
| 设计资源 | 20 | Dribbble, Behance, Pinterest, Unsplash, Pexels, IconFont, Lucide, Heroicons, Coolors, Mobbin, Awwwards, Canva, Remove.bg, LottieFiles, Framer, Whimsical, Adobe Color, Material Design, Ant Design, Figma Community |
| 教育学习 | 20 | Coursera, Udemy, edX, Khan Academy, Codecademy, freeCodeCamp, W3Schools, Kaggle, Brilliant, Duolingo, 中国大学MOOC, 学堂在线, 慕课网, 网易公开课, 极客时间, Skillshare, Pluralsight, LinkedIn Learning, 腾讯课堂, 知乎知学堂 |
| 新闻资讯 | 18 | 新华网, 人民网, 央视网, 澎湃新闻, 界面新闻, 观察者网, 凤凰网, 南方周末, BBC, CNN, Reuters, The Verge, TechCrunch, Wired, Ars Technica, The Guardian, AP News, NHK |
| 金融理财 | 16 | 东方财富, 同花顺, 雪球, 富途牛牛, 老虎证券, 天天基金, 蚂蚁财富, Bloomberg, Yahoo Finance, MarketWatch, Investing, CoinMarketCap, CoinGecko, Binance, 招商银行, 支付宝 |
| 云服务 | 18 | AWS, Google Cloud, Azure, 阿里云, 腾讯云, 华为云, 百度智能云, 火山引擎, DigitalOcean, Vultr, Linode, Hetzner, Fly.io, PlanetScale, Neon, Upstash, Zeabur, 京东云 |
| 自定义 | 0+ | 用户自行添加 |

---

## 五、统一设置面板

右上角齿轮按钮打开模态框, 包含 5 个标签页:

### 5.1 书签管理

- 输入: 网址 + 标题 + 描述(可选) + 分类(下拉)
- 分类下拉包含所有 13 个分类
- 添加后实时刷新当前分类网格
- 自定义分类书签持久化到 localStorage

### 5.2 搜索引擎

- 显示当前引擎 (图标色块 + 名称)
- 预置引擎网格 (8 个), 点击切换, 选中态 ring 高亮
- 自定义引擎列表 (hover 显示删除按钮)
- 添加自定义引擎: 名称 + URL (`%s` 占位符)
- 引擎选择持久化到 localStorage

### 5.3 云同步

- 启用/关闭开关 (toggle switch)
- 同步状态指示 (绿点 + "已同步")
- 上次同步时间
- 书签总数统计
- 导出/导入数据按钮

### 5.4 账号

- 用户头像 (未登录显示渐变色 "?")
- 登录状态文案
- 第三方 OAuth 登录按钮:
  - Google (官方四色 SVG logo)
  - GitHub (Octocat SVG)
  - 微信 (#07C160 绿色 SVG)
  - QQ (#12B7F5 蓝色 SVG)
  - Apple (系统色 SVG)
- 点击触发 OAuth 授权流程 (当前为 mock alert)

### 5.5 浏览器扩展

- 三个功能说明卡片 (图标 + 标题 + 描述):
  - 新标签页替换 (绿色图标)
  - 一键收藏 (蓝色图标)
  - 跨设备同步 (紫色图标)
- manifest.json 代码预览块

---

## 六、搜索引擎管理

### 预置引擎 (12 个, 默认百度)

| 引擎 | 标识 | 色值 | URL 模板 |
|------|------|------|---------|
| 百度 (默认) | B | `#3245FF` | `https://www.baidu.com/s?wd=` |
| Google | G | `#4285F4` | `https://www.google.com/search?q=` |
| 必应 | B | `#00897B` | `https://www.bing.com/search?q=` |
| 搜狗 | S | `#FF6600` | `https://www.sogou.com/web?query=` |
| Yandex | Y | `#FF0000` | `https://yandex.com/search/?text=` |
| DuckDuckGo | D | `#DE5833` | `https://duckduckgo.com/?q=` |
| Perplexity | P | `#20B2AA` | `https://www.perplexity.ai/search?q=` |
| ChatGPT | C | `#10A37F` | `https://chat.openai.com/?q=` |
| 纳米搜索 | N | `#6366F1` | `https://www.n.cn?q=` |
| 秘塔搜索 | 秘 | `#4F46E5` | `https://metaso.cn/?q=` |
| 天工AI | 天 | `#0EA5E9` | `https://www.tiangong.cn/search?q=` |
| 豆包 | 豆 | `#6C5CE7` | `https://www.doubao.com/search?q=` |

### 自定义引擎

- 通过设置面板 "搜索引擎" 标签添加
- 输入名称 + URL 模板 (`%s` 占位符)
- 支持删除自定义引擎 (hover 显示 X)
- 引擎选择持久化到 localStorage (`ainav_eng`)

**Landing 页搜索栏不显示引擎切换 UI**, placeholder 显示 "在 {引擎名} 中搜索..."。

---

## 七、浏览器扩展

```json
{
  "manifest_version": 3,
  "name": "AI导航",
  "version": "1.0.0",
  "chrome_url_overrides": { "newtab": "index.html" },
  "action": { "default_popup": "popup.html" },
  "permissions": ["storage", "activeTab"]
}
```

1. **新标签页替换** — `newtab` override
2. **一键收藏** — popup 自动填充当前页 title + URL
3. **云同步** — `chrome.storage.sync`

---

## 八、响应式网格

| 断点 | 列数 |
|------|------|
| >= 1280px (xl) | 10 列 |
| >= 1024px (lg) | 8 列 |
| >= 768px (md) | 6 列 |
| >= 640px (sm) | 4 列 |
| < 640px | 3 列 |

---

## 九、数据持久化

| 数据 | Key | 存储 |
|------|-----|------|
| 主题 | `ainav_th` | localStorage |
| 当前引擎 | `ainav_eng` | localStorage |
| 自定义书签 | `ainav_bm` | localStorage |
| 自定义引擎 | `ainav_ce` | localStorage |

扩展模式下使用 `chrome.storage.sync` 实现跨设备同步。

---

## 十、动效系统

| 元素 | 动效 | 时长 | 缓动 |
|------|------|------|------|
| Hero 区域上移/下移 | padding-top 过渡 | 500ms | cubic-bezier(.4,0,.2,1) |
| 导航内容滑入 | opacity + translateY | 400ms | ease, stagger 80ms |
| 主题切换 ripple | transform scale(0→1) | 600ms | cubic-bezier(.4,0,.2,1) |
| 卡片出场 | opacity + translateY(8px→0) | 250ms | ease, stagger 20ms |
| 卡片 hover | translateY(-2px) + shadow | 200ms | ease |
| 设置模态框 | scale(.95→1) + opacity | 200ms | ease |
| 分类 pill 切换 | background + color | 150ms | linear |
| 粒子浮动 | translateY + scale + opacity | 8-22s | linear, infinite |

---

## 十一、组件层级 (z-index)

| 层 | z-index | 元素 |
|----|---------|------|
| 粒子背景 | 0 | `.particles` |
| 主题 ripple | 1 | `.theme-ripple` |
| 主内容 | 10 | hero, categories, grid, footer |
| 浮动按钮 | 50 | 设置 + 主题切换 |
| 模态遮罩 | 500 | `.overlay` |

---

## 十二、无障碍 & 性能

- `prefers-reduced-motion: reduce` 时禁用所有动画
- 图片 `loading="lazy"` 懒加载
- favicon 加载失败显示首字母 fallback
- 自定义滚动条 (5px 宽, 透明轨道)
- 小屏 (< 640px) 隐藏部分辅助元素 (`.hm`)
- 所有交互元素 `cursor:pointer`
- 键盘可达 (tab 导航)
