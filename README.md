# AI导航

智能书签导航，聚合 300+ AI工具、开发工具、常用网站。Glassmorphism 设计风格，支持明暗双模式。

## 功能

- **13 个分类、310+ 站点** — AI 官网、开发工具、API 服务、常用网站、国际网站、技术社区等
- **12 个搜索引擎** — 百度、Google、Perplexity、ChatGPT、纳米搜索、秘塔搜索等
- **智能书签添加** — 输入 URL 自动识别标题/描述/分类（本地匹配 + Microlink API）
- **两态交互** — Landing 极简搜索 ↔ Expanded 全量导航
- **主题切换** — Ripple 动画明暗切换，无闪烁
- **浏览器扩展** — Chrome Extension (Manifest V3)，新标签页替换 + 一键收藏
- **PWA 支持** — 可安装为桌面应用，离线可用

## 项目结构

```
├── AI导航.html          # 单文件完整版（可直接打开）
├── extension/           # Chrome 扩展
│   ├── manifest.json
│   ├── index.html       # 新标签页
│   ├── popup.html/js    # 快速收藏弹窗
│   └── icons/
├── web/                 # Vite 生产构建
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   │   ├── style.css    # Tailwind v4 + 自定义样式
│   │   ├── main.js      # 应用逻辑
│   │   ├── data.js      # 310+ 站点数据
│   │   └── engines.js   # 搜索引擎配置
│   └── public/
│       ├── favicon.svg
│       ├── manifest.json # PWA manifest
│       └── sw.js         # Service Worker
├── docs/
│   └── AI导航-UI设计方案.md
└── .github/workflows/   # CI/CD
```

## 快速开始

### 方式一：直接打开
```bash
# 浏览器打开单文件版
open AI导航.html
```

### 方式二：开发模式
```bash
cd web
npm install
npm run dev
```

### 方式三：安装扩展
1. 打开 `chrome://extensions/`
2. 启用「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择 `extension/` 目录

## 构建部署

```bash
# 构建生产版本
cd web && npm run build

# 预览
npm run preview

# 打包扩展
cd .. && zip -r ai-navigator-extension.zip extension/
```

## 技术栈

- **前端**: Tailwind CSS v4 + Vite
- **字体**: JetBrains Mono + IBM Plex Sans + Noto Sans SC
- **图标**: Google Favicon API + Heroicons SVG
- **API**: Microlink (网站标题识别)
- **扩展**: Chrome Manifest V3 + chrome.storage.sync

## License

MIT
