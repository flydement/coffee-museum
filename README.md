# 拾光咖啡博物馆 · Atelier Café Museum (v5.3)

线上体验地址：**https://flydement.github.io/coffee-museum/**

一套代码同时覆盖 **Web / PWA、PC 桌面端（Electron）与移动端 App（Capacitor iOS / Android）** 的精品咖啡风味策展与沉浸式冲煮工坊。

## 核心亮点

1. **风味策展台与情境点单（Flavor Curator）**
   - 首页配备 **5 幅复古手绘常设展无缝循环轮播**（支持触控滑动、键盘焦点与系统减弱动效适配）及**今日馆长精选展签**。
   - 内置 **8 大生活情境一键调味**、四维风味调音台滑块、香气联想标签、**想喝清单（♥）**与**今日风味抽签盲盒**（含品鉴签文与甜点搭档）。
2. **世界咖啡馆藏展厅与双豆雷达对比（Museum Gallery）**
   - 收录 **32 款代表性世界馆藏风味**（覆盖手冲黑咖、意式奶咖、冰爽特调与复古器具四大展区）。
   - 支持按分类、烘焙度光谱、温度、难度、想喝清单与多维风味排序检索；支持任选两款开启**「双展品五维风味雷达重叠对比」**，以及一键复制完整文字配方。
3. **沉浸式分步冲煮工坊（Interactive Brewing Studio）**
   - **14 种动态 SVG 萃取器具实时演示**：V60 手冲、Chemex、聪明杯底阀放流、法压壶、爱乐压冰闪萃、虹吸真空壶、土耳其铜壶、越南 Phin 滴漏壶、八角摩卡壶、半自动意式机、奶咖拉花、Dirty 分层、冰滴与特调杯，液位随倒计时连续变化。
   - **口味定制微调（Taste Customizer）**：动态切换 `馆藏标准` / `更甜润柔和` / `更清爽花果` / `更浓郁醇厚`，自动换算粉量、总液量、分步累计目标与水温。
   - **解放持壶双手体验**：支持**实时跟随电子秤与注水流速导引（`ml/s`）**、全程萃取时间轴、**自动连贯跳步**、**中文语音播报导引**、移动端屏幕常亮（Wake Lock）与 PC 键盘快捷键（`Space` 计时/重跑，`←`/`→` 切步）。
4. **风味博物图鉴与诊断工具箱（World Coffee Atlas）**
   - **世界咖啡种植带交互地图**：覆盖南北回归线 15 大标志性咖啡产区与对应馆藏豆单。
   - **交互式 SCA 灵感风味轮 + 万能粉水与咖啡因计算器**：按 6 大风味家族展开探索全馆匹配展品；支持手冲、冷萃与意式浓缩（`1:1.5 Ristretto` ~ `1:2.5 Lungo`）粉水比与每日咖啡因占比换算。
   - **烘焙光谱与生豆处理法实验室**、**咖啡师翻车诊断室**与 **18 题随机抽题趣味问答**。
5. **馆内声景、日夜灯光、三色明信片与个人馆藏（Archive）**
   - 顶部栏一键切换**全馆提示音静音**、零依赖 Web Audio **雨夜吃茶馆白噪音**与**日间暖白 / 深夜吃茶馆暖暗主题**。
   - 自动生成**个人风味指纹雷达图**、**8 枚博物馆策展徽章**；支持行内编辑星级/手记、防误删二次确认、**3 款复古卡纸主题高清 PNG 明信片预览导出**，以及经字段校验的 **JSON 跨端馆藏备份导入/导出**。

---

## 本地开发与验证

```bash
npm install
npm run dev      # 启动本地开发服务器
npm run lint     # Oxlint 静态代码检查
npm test         # 运行零依赖单元测试与 32 款馆藏数据完整性校验
npm run build    # TypeScript 类型检查 + Vite 生产构建（输出到 dist/）
```

## 多端打包指南

### 1. PC 桌面客户端（Windows / macOS / Linux · Electron）

```bash
npm install -D electron electron-builder
npm run desktop:start   # 构建并以 PC 桌面窗口启动
npm run desktop:build   # 打包生成 macOS (.dmg) / Windows (.exe) / Linux (.AppImage) 安装包
```

### 2. 移动端原生 App（iOS / Android · Capacitor）

```bash
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
npm run mobile:sync     # 构建 dist 并同步至原生工程
```
