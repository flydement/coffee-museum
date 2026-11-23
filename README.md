# 拾光咖啡博物馆 · Atelier Café Museum

一套代码同时覆盖 **Web / PWA、PC 桌面端（Electron）与移动端 App（Capacitor iOS/Android）** 的精品咖啡风味策展与交互式冲煮工坊。

## 核心功能

1. **风味策展台（Flavor Curator）**
   - 通过饮品类型、温度质感、四维风味滑块（明亮果酸 / 甘甜顺滑 / 口感醇厚 / 烘焙苦韵）与香气联想标签，实时匹配最契合的馆藏咖啡。
   - 支持「今日盲盒风味」随机推荐。
2. **世界咖啡馆藏展厅（Museum Gallery）**
   - 收录 10 款代表性馆藏咖啡（耶加雪菲日晒 V60、巴拿马瑰夏、黄金曼特宁深烘、经典意式浓缩、墨尔本澳白、丝绒拿铁、桂花燕麦 Dirty、京都雪莉桶冷萃、西西里柠檬气泡美式、经典八角摩卡壶）。
   - 每款展品配备策展手记、五维风味雷达图、研磨粗细刻度、器具清单与**实时粉水比/杯数换算器**。
3. **沉浸式分步冲煮工坊（Interactive Brewing Studio）**
   - 按器具定制动态 SVG 萃取动画（手冲水流与闷蒸气泡、意式浓缩黄金油脂、奶咖拉花融合、Dirty 冷热分层、冰滴与摩卡壶）。
   - 实时环形倒计时器、分步累计目标液重、防翻车咖啡师秘诀、柔和 Web Audio 提示音（支持静音）、PC 键盘快捷键（`Space` 开始/暂停计时，`←`/`→` 切换步骤）。
4. **出杯仪式与个人咖啡馆藏（Tasting Archive）**
   - 冲煮完成后可打分、写品鉴手记、分配唯一馆藏编号（如 `#2026-001`）并持久化保存至本地。
   - 支持一键导出高清 **PNG 复古博物馆纪念明信片**，并解锁 5 枚博物馆策展徽章。

---

## 多端运行与打包指南

### 1. Web / PWA 网页版

```bash
npm install
npm run dev      # 启动本地开发服务器
npm run build    # 构建生产版本（输出到 dist/）
```

部署到 HTTPS 域名后，手机与桌面浏览器均支持「添加到主屏幕 / 安装应用」离线作为 PWA 使用（已内置 `public/manifest.webmanifest` 与 `public/sw.js`）。

### 2. PC 桌面客户端（Windows / macOS / Linux · Electron）

已内置 `electron/main.cjs`、`electron/preload.cjs` 与 `electron-builder.json`。首次打包桌面端时安装桌面工具链：

```bash
npm install -D electron electron-builder
```

然后运行：

```bash
npm run desktop:start   # 构建并以 PC 桌面窗口启动
npm run desktop:build   # 打包生成 macOS (.dmg) / Windows (.exe) / Linux (.AppImage) 安装包
```

### 3. 移动端原生 App（iOS / Android · Capacitor）

已内置 `capacitor.config.ts` 与移动端底部导航及 `safe-area` 适配。首次打包原生 App 时安装 Capacitor：

```bash
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

同步并打开 Xcode / Android Studio 构建原生安装包：

```bash
npm run mobile:sync     # 构建 dist 并同步至原生工程
npm run mobile:ios      # 同步并打开 Xcode
npm run mobile:android  # 同步并打开 Android Studio
```
