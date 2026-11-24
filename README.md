# 拾光咖啡博物馆 · Atelier Café Museum (v2.0)

线上体验地址：**https://flydement.github.io/coffee-museum/**

一套代码同时覆盖 **Web / PWA、PC 桌面端（Electron）与移动端 App（Capacitor iOS/Android）** 的精品咖啡风味策展与交互式冲煮工坊。

## 核心亮点

1. **风味策展台与情境点单（Flavor Curator）**
   - 内置 **5 大生活情境一键调味**（清晨醒神·明亮花果 / 午后治愈·丝绒奶甜 / 夏日海风·冰爽特调 / 雨夜书房·深烘醇厚 / 微醺晚间·酒香慢萃）。
   - 四维风味滑块（明亮果酸 / 甘甜顺滑 / 口感醇厚 / 烘焙苦韵）与香气联想标签实时计算契合度，支持**想喝清单（♥）**收藏与**今日盲盒风味**。
2. **世界咖啡馆藏展厅与双豆雷达对比（Museum Gallery）**
   - 收录 **14 款代表性馆藏风味**（耶加雪菲 V60、巴拿马瑰夏、昭和深烘黄金曼特宁、经典意式浓缩、墨尔本澳白、丝绒拿铁、桂花燕麦 Dirty、京都雪莉桶冷萃、西西里柠檬气泡美式、八角摩卡壶、**生椰拿铁椰云特调**、**哥斯达黎加黑蜜法压壶**、**肯尼亚 AA 爱乐压冰闪萃**、**维也纳海盐雪顶爱因舒潘纳**）。
   - 支持按饮品分类、烘焙度光谱与想喝清单筛选；支持任选两款开启**「双展品五维风味雷达重叠对比」**。
3. **口味定制微调 & 沉浸式分步冲煮工坊（Interactive Brewing Studio）**
   - **口味定制微调（Taste Customizer）**：支持切换 `馆藏标准` / `更甜润柔和` / `更清爽花果` / `更浓郁醇厚`，动态调整粉量、水量、冲煮水温与防翻车提示。
   - **8 种动态器具 SVG 实时萃取演示**：V60 手冲、意式浓缩、奶咖拉花、Dirty 分层、冰爽气泡、摩卡壶、法压壶下压滤网、爱乐压气压冰闪萃，液面随倒计时连续上升。
   - **智能秤重导引与解放双手**：注水阶段实时动态滚动目标液重与建议流速（`ml/s`），支持**自动连贯跳步**、移动端屏幕常亮（Wake Lock）与 PC 键盘快捷键（`Space` 计时，`←`/`→` 切步）。
4. **声景氛围、日夜展馆灯光与三色明信片（Atmosphere & Archive）**
   - 零外部音频依赖的 Web Audio **「雨夜吃茶馆环境白噪音」** 与 **「日间暖白展厅 / 深夜吃茶馆暖暗模式」** 一键切换。
   - 出杯仪式与馆藏室支持 **3 款复古纸张主题**（经典羊皮暖白 / 深烘黑金典藏 / 植物志鼠尾草）实时预览并导出高清 PNG 明信片，支持 **JSON 跨端馆藏备份导入/导出** 与 **6 枚博物馆策展徽章**。

---

## 多端运行与打包指南

### 1. Web / PWA 网页版

```bash
npm install
npm run dev      # 启动本地开发服务器
npm run build    # 构建生产版本（输出到 dist/）
```

### 2. PC 桌面客户端（Windows / macOS / Linux · Electron）

```bash
npm install -D electron electron-builder
npm run desktop:start   # 构建并以 PC 桌面窗口启动
npm run desktop:build   # 打包生成 macOS (.dmg) / Windows (.exe) / Linux (.AppImage) 安装包
```

### 3. 移动端原生 App（iOS / Android · Capacitor）

```bash
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
npm run mobile:sync     # 构建 dist 并同步至原生工程
```
