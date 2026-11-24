export interface OriginRegion {
  id: string
  name: string
  englishName: string
  continent: '非洲' | '亚洲' | '中美洲与加勒比' | '南美洲' | '欧洲与地中海'
  x: number // SVG map x (0..900)
  y: number // SVG map y (0..420)
  altitude: string
  climate: string
  varieties: string
  signatureFlavor: string
  story: string
  matchKeywords: string[]
}

export interface ProcessGuide {
  id: string
  name: string
  englishName: string
  tagline: string
  sweetness: number
  clarity: number
  body: number
  description: string
  matchKeywords: string[]
}

export interface RoastStage {
  level: number
  name: string
  tempRange: string
  milestone: string
  beanColor: string
  flavorSummary: string
  brewTip: string
}

export interface CoffeeTriviaQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  category: string
}

export interface ExhibitEditorialExtra {
  pairing: string
  tastingWindow: string
  fortune: string
}

export const COFFEE_ORIGINS: OriginRegion[] = [
  {
    id: 'ethiopia',
    name: '埃塞俄比亚 · 耶加雪菲',
    englishName: 'Ethiopia · Yirgacheffe',
    continent: '非洲',
    x: 525,
    y: 204,
    altitude: '1,800 – 2,200 m',
    climate: '东非高地昼夜温差大',
    varieties: '埃塞原生种 (Heirloom)',
    signatureFlavor: '茉莉白花 · 柑橘 · 白桃 · 乌龙茶韵',
    story:
      '阿拉比卡咖啡的基因故乡，拥有数千种未完全命名的野生原生种。高海拔冷凉气候让咖啡樱桃缓慢成熟，积累出令人惊叹的清透花香。',
    matchKeywords: ['埃塞'],
  },
  {
    id: 'kenya',
    name: '肯尼亚 · 涅里高地',
    englishName: 'Kenya · Nyeri',
    continent: '非洲',
    x: 522,
    y: 229,
    altitude: '1,700 – 2,050 m',
    climate: '赤道火山红土高地',
    varieties: 'SL28 / SL34',
    signatureFlavor: '黑加仑 · 圣女果 · 红西柚 · 果汁感',
    story:
      '肯尼亚独有的 72 小时双重水洗发酵工艺搭配富含磷酸盐的火山红土，赋予 SL28 品种炸裂般的黑莓与红酒酸质。',
    matchKeywords: ['肯尼亚'],
  },
  {
    id: 'yunnan',
    name: '中国云南 · 保山高黎贡',
    englishName: 'China · Yunnan Baoshan',
    continent: '亚洲',
    x: 682,
    y: 162,
    altitude: '1,400 – 1,750 m',
    climate: '北纬 25° 干热河谷与云雾带',
    varieties: '铁皮卡 / 卡蒂姆精选',
    signatureFlavor: '玫瑰花蜜 · 黑李红酒 · 东方红茶回甘',
    story:
      '百年小粒咖啡种植历史叠加近年精品厌氧与蜜处理浪潮，让云南保山与孟连成为亚洲最具东方茶韵与甜感潜力的新锐产区。',
    matchKeywords: ['云南'],
  },
  {
    id: 'sumatra',
    name: '印度尼西亚 · 苏门答腊',
    englishName: 'Indonesia · Sumatra',
    continent: '亚洲',
    x: 690,
    y: 234,
    altitude: '1,350 – 1,650 m',
    climate: '热带赤道火山雨林',
    varieties: '铁皮卡 / Ateng',
    signatureFlavor: '75% 黑巧 · 雪松草本 · 焦糖糖浆',
    story:
      '因潮湿多雨诞生了标志性的“湿刨法 (Giling Basah)”，赋予黄金曼特宁极低酸度与宛如红酒丝绒般的醇厚汤体。',
    matchKeywords: ['苏门答腊', '印度尼西亚'],
  },
  {
    id: 'panama',
    name: '巴拿马 · 波奎特火山谷',
    englishName: 'Panama · Boquete',
    continent: '中美洲与加勒比',
    x: 245,
    y: 202,
    altitude: '1,650 – 1,950 m',
    climate: '巴鲁火山云雾微气候',
    varieties: '瑰夏 (Geisha)',
    signatureFlavor: '佛手柑 · 橙花 · 槐花蜜 · 香槟质感',
    story:
      '2004 年翡翠庄园在最佳巴拿马杯测赛中以瑰夏震惊世界，自此开创了全球精品咖啡对高海拔花香品种的极致追求。',
    matchKeywords: ['巴拿马'],
  },
  {
    id: 'costa-rica',
    name: '哥斯达黎加 · 塔拉珠',
    englishName: 'Costa Rica · Tarrazú',
    continent: '中美洲与加勒比',
    x: 234,
    y: 196,
    altitude: '1,550 – 1,850 m',
    climate: '太平洋干湿季分明火山带',
    varieties: '卡杜拉 / 卡杜艾',
    signatureFlavor: '红糖果脯 · 葡萄干 · 烤杏仁脂香',
    story:
      '精妙绝伦的微型水洗处理厂发源地，擅长通过精确控制留存果胶比例（黄蜜、红蜜、黑蜜）雕琢如蜂蜜糖浆般的圆润甜感。',
    matchKeywords: ['哥斯达黎加'],
  },
  {
    id: 'guatemala',
    name: '危地马拉 · 安提瓜',
    englishName: 'Guatemala · Antigua',
    continent: '中美洲与加勒比',
    x: 215,
    y: 182,
    altitude: '1,500 – 1,800 m',
    climate: '三座活火山环抱的富矿盆地',
    varieties: '波旁 / 卡杜拉',
    signatureFlavor: '牛奶可可 · 蜜渍甜橙 · 丝滑坚果',
    story:
      '火山浮石土壤既排水良好又富含矿物质，孕育出酸甜平衡、带有独特淡雅火山烟熏与巧克力尾韵的优雅杯感。',
    matchKeywords: ['危地马拉'],
  },
  {
    id: 'jamaica',
    name: '牙买加 · 蓝山圣安德鲁斯',
    englishName: 'Jamaica · Blue Mountain',
    continent: '中美洲与加勒比',
    x: 264,
    y: 176,
    altitude: '1,500 – 1,800 m',
    climate: '加勒比海雾常年缭绕的陡坡',
    varieties: '传统蓝山铁皮卡',
    signatureFlavor: '绸缎般极度平衡 · 坚果奶油 · 熟苹果',
    story:
      '全世界唯一坚持用传统木桶封装出口的顶级法定产区。酸、甜、苦、香四维毫无棱角，是虹吸壶与吃茶馆的梦幻珍品。',
    matchKeywords: ['牙买加'],
  },
  {
    id: 'colombia',
    name: '哥伦比亚 · 慧兰产区',
    englishName: 'Colombia · Huila',
    continent: '南美洲',
    x: 263,
    y: 222,
    altitude: '1,600 – 1,950 m',
    climate: '安第斯山脉三重峡谷微气候',
    varieties: '粉红波旁 / 卡斯蒂略',
    signatureFlavor: '血橙 · 覆盆子 · 太妃糖 · 丝滑平衡',
    story:
      '得天独厚的安第斯高地让哥伦比亚一年可收获两季鲜果，近年稀有的粉红波旁品种更成为风味清晰度与甜感的代名词。',
    matchKeywords: ['哥伦比亚'],
  },
  {
    id: 'brazil',
    name: '巴西 · 喜拉多与米纳斯',
    englishName: 'Brazil · Cerrado & Minas',
    continent: '南美洲',
    x: 332,
    y: 268,
    altitude: '1,000 – 1,350 m',
    climate: '干燥晴朗的南美高原',
    varieties: '黄波旁 / 新世界',
    signatureFlavor: '烤榛果 · 黑可可 · 焦糖奶油 · 丰厚油脂',
    story:
      '世界第一大咖啡生产国，也是经典意式拼配不可或缺的基石。充足的日照晒出温暖圆润的坚果与巧克力基调。',
    matchKeywords: ['巴西'],
  },
  {
    id: 'mediterranean',
    name: '欧洲与地中海 · 咖啡器具摇篮',
    englishName: 'Italy · Vienna · Istanbul',
    continent: '欧洲与地中海',
    x: 492,
    y: 122,
    altitude: '咖啡文化与器具发源地',
    climate: '意式蒸汽 · 维也纳雪顶 · 奥斯曼铜壶',
    varieties: '浓缩拼配 / 土耳其超细粉 / 创意特调',
    signatureFlavor: '黄金虎斑油脂 · 绿豆蔻香料 · 绵密奶霜',
    story:
      '虽然不生长咖啡树，但伊斯坦布尔的铜壶、米兰的 9 Bar 意式浓缩与摩卡壶、维也纳的奶油雪顶，共同塑造了人类近五百年的咖啡馆浪漫。',
    matchKeywords: ['意大利', '西班牙', '洪都拉斯'],
  },
]

export const PROCESS_GUIDES: ProcessGuide[] = [
  {
    id: 'washed',
    name: '传统水洗法',
    englishName: 'Washed / Wet Process',
    tagline: '极高干净度 · 忠实呈现高海拔风土与明亮花酸',
    sweetness: 76,
    clarity: 96,
    body: 52,
    description:
      '去皮后经水槽发酵分解果胶再彻底洗净晾干。风味纯净通透如高山清泉，最适合展现瑰夏、肯尼亚与粉红波旁的优雅花果酸质。',
    matchKeywords: ['水洗'],
  },
  {
    id: 'natural',
    name: '全红果日晒',
    englishName: 'Natural / Dry Process',
    tagline: '浓郁热带果酱甜 · 饱满醇厚与微醺花蜜香',
    sweetness: 92,
    clarity: 74,
    body: 78,
    description:
      '保留完整咖啡果皮与果肉直接在高架床日晒干燥，果糖缓慢渗入生豆内核，带来熟白桃、莓果酱与烤榛果般的澎湃甜感。',
    matchKeywords: ['日晒'],
  },
  {
    id: 'honey',
    name: '蜜处理工艺',
    englishName: 'Honey / Pulped Natural',
    tagline: '水洗的优雅 × 日晒的红糖果脯甜润',
    sweetness: 90,
    clarity: 84,
    body: 76,
    description:
      '去除果皮但按比例保留黏滑香甜的果胶层晾晒（按保留程度分黄/红/黑蜜），入口自带古法红糖、葡萄干与焦糖布丁般的圆润感。',
    matchKeywords: ['蜜处理', '黑蜜'],
  },
  {
    id: 'wethulled',
    name: '苏门答腊湿刨法',
    englishName: 'Wet-Hulled / Giling Basah',
    tagline: '极低酸度 · 草本雪松与糖浆般厚重黑巧',
    sweetness: 74,
    clarity: 62,
    body: 95,
    description:
      '印尼雨林独创工艺：豆子在高含水率时提前脱去羊皮壳再二次晒干，形成迷人的蓝绿色生豆与深烘后无可替代的浓醇厚重感。',
    matchKeywords: ['湿刨'],
  },
  {
    id: 'anaerobic',
    name: '密闭厌氧与桶发酵',
    englishName: 'Anaerobic & Barrel-Aged',
    tagline: '当代风味魔法 · 玫瑰红酒与雪莉威士忌尾韵',
    sweetness: 88,
    clarity: 80,
    body: 74,
    description:
      '借鉴精品葡萄酒与威士忌酿造思路，在无氧不锈钢罐或雪莉橡木桶中精准控温发酵，创造出极具辨识度的黑李、玫瑰蜜与酒心巧克力香。',
    matchKeywords: ['厌氧', '橡木桶'],
  },
]

export const ROAST_STAGES: RoastStage[] = [
  {
    level: 1,
    name: '极浅烘 · Light Cinnamon',
    tempRange: '195 – 200 °C',
    milestone: '一爆初期出炉',
    beanColor: '#A9784F',
    flavorSummary: '最大程度保留原生花香、佛手柑与明亮柠檬酸质，几乎无烘焙苦味。',
    brewTip: '豆质紧实密度高，建议提高水温至 92–93°C 并略微拉大粉水比至 1:16。',
  },
  {
    level: 2,
    name: '浅烘 / 中浅烘 · City Roast',
    tempRange: '201 – 208 °C',
    milestone: '一爆中后段结束',
    beanColor: '#8B5935',
    flavorSummary: '花果香气与柑橘果酸达到甜美平衡，茶感清透、余韵甘甜。',
    brewTip: '手冲与冰闪萃黄金烘焙度，90–92°C 水温能兼顾香气上扬与圆润甜感。',
  },
  {
    level: 3,
    name: '中度烘焙 · Full City',
    tempRange: '209 – 215 °C',
    milestone: '焦糖化充分发展',
    beanColor: '#693D22',
    flavorSummary: '焦糖、烤杏仁、红糖与牛奶巧克力浮现，酸度柔和，受众最广。',
    brewTip: '百搭烘焙度！法压、虹吸、Chemex 与奶咖均能稳稳出彩，水温 90–92°C。',
  },
  {
    level: 4,
    name: '中深烘 · Vienna Roast',
    tempRange: '216 – 222 °C',
    milestone: '逼近二爆前夕',
    beanColor: '#4A2816',
    flavorSummary: '浓郁烤榛果、黑可可与丰沛油脂感，与牛奶、椰乳、冰淇淋绝配。',
    brewTip: '意式浓缩、澳白、卡布奇诺与 Dirty 的灵魂，萃取时注意防止过萃发涩。',
  },
  {
    level: 5,
    name: '深度烘焙 · French / Italian',
    tempRange: '223 – 230 °C',
    milestone: '二爆开启 · 表面微泛油光',
    beanColor: '#2E180E',
    flavorSummary: '几乎无酸、如 75% 黑巧与雪松烟熏般醇厚回甘，充满吃茶馆复古氛围。',
    brewTip: '豆体疏松极易溶出苦味！手冲务必降至 85°C 并调粗研磨、提前截流收口。',
  },
]

export const COFFEE_TRIVIA_QUESTIONS: CoffeeTriviaQuestion[] = [
  {
    id: 'q1',
    category: '冲煮科学',
    question: '手冲咖啡最开始的「闷蒸（Blooming）」步骤，最主要的物理作用是什么？',
    options: [
      '把咖啡粉彻底煮熟增加苦味',
      '排出新鲜咖啡粉中的二氧化碳，让后续水流均匀萃取',
      '快速降低滤杯温度防止烫嘴',
      '让滤纸吸收多余的咖啡油脂',
    ],
    correctIndex: 1,
    explanation:
      '烘焙后的新鲜咖啡豆内部封存了大量二氧化碳。闷蒸让气体充分释放，避免后续注水时气泡阻挡粉水接触导致萃取不均。',
  },
  {
    id: 'q2',
    category: '奶咖艺术',
    question: '制作拿铁或澳白打发牛奶时，牛奶的天然乳糖甜感在哪个温度区间达到巅峰？',
    options: ['35 – 42 °C', '55 – 62 °C', '75 – 82 °C', '90 – 95 °C 沸腾前'],
    correctIndex: 1,
    explanation:
      '55–62°C 是乳糖甜感最突出且蛋白质结构最丝滑的黄金区间；超过 70°C 蛋白质变性，容易出现“煮奶味”并失去甜润感。',
  },
  {
    id: 'q3',
    category: '精品豆单',
    question: '在 2004 年最佳巴拿马（BOP）杯测赛上一鸣惊人、被誉为“咖啡界香槟”的品种是？',
    options: ['铁皮卡 (Typica)', '卡蒂姆 (Catimor)', '瑰夏 (Geisha)', '罗布斯塔 (Robusta)'],
    correctIndex: 2,
    explanation:
      '翡翠庄园的巴拿马波奎特瑰夏以惊艳的佛手柑、橙花与白桃香气彻底改写了世界精品咖啡历史。',
  },
  {
    id: 'q4',
    category: '器具秘技',
    question: '使用意大利经典八角摩卡壶（Moka Pot）时，装填咖啡粉最关键的防翻车原则是？',
    options: [
      '像半自动意式机一样用力压实压紧',
      '自然装满粉槽并轻刮平整，切忌压粉',
      '下壶必须装冰水慢煮 15 分钟',
      '等咖啡猛烈喷气发出响声后再煮 2 分钟',
    ],
    correctIndex: 1,
    explanation:
      '摩卡壶只有约 1.5–2 Bar 温和蒸汽压力，压粉会导致压力过高、水流受阻甚至焦苦；用温热水起步并轻刮平整才是甘甜关键。',
  },
  {
    id: 'q5',
    category: '非遗文化',
    question: '以下哪一种咖啡冲煮文化在 2013 年被联合国教科文组织列入人类非物质文化遗产名录？',
    options: ['日式冰滴咖啡', '土耳其铜壶咖啡 (Turkish Coffee)', '美式滤泡壶', '爱乐压气压萃取'],
    correctIndex: 1,
    explanation:
      '传统土耳其咖啡（Cezve 铜壶极细粉慢煮与待客礼仪）传承超过五百年，象征着热情好客与慢节奏社交哲学。',
  },
  {
    id: 'q6',
    category: '风味化学',
    question: '冲煮深烘黄金曼特宁手冲时，为什么咖啡师通常会把水温降到 85°C 左右并调粗研磨？',
    options: [
      '为了省电节能',
      '深烘豆结构疏松溶出快，低温粗粉可避免萃出焦苦与木质涩味',
      '85°C 才能萃出强烈柑橘酸',
      '防止玻璃分享壶受热变形',
    ],
    correctIndex: 1,
    explanation:
      '深烘豆经过更长时间的高温脱水，细胞壁多孔脆弱。降低水温与调粗研磨可以柔和萃出黑巧焦糖甜感，大幅抑制过萃苦涩。',
  },
  {
    id: 'q7',
    category: '特调美学',
    question: '品尝一杯正宗的 Dirty（脏咖啡）时，咖啡师最推荐的喝法是？',
    options: [
      '插入吸管彻底搅拌均匀后慢慢喝',
      '不加冰块、不搅拌，3 分钟内大口饮下体验冷热与浓淡分层变化',
      '先静置半小时等完全变凉',
      '加满碎冰块并用勺子挖着喝',
    ],
    correctIndex: 1,
    explanation:
      'Dirty 的灵魂在于“冷热分层与浓郁渐变”——第一大口先是滚烫浓香油脂，随后冰镇鲜奶/燕麦奶涌入口腔，每一口都在变化。',
  },
  {
    id: 'q8',
    category: '工业设计',
    question: '哪一款由化学家于 1941 年发明的沙漏造型木领玻璃手冲壶，被纽约现代艺术博物馆（MoMA）列为永久藏品？',
    options: ['V60 锥形滤杯', 'Chemex 沙漏手冲壶', '法压壶', '爱乐压'],
    correctIndex: 1,
    explanation:
      '彼得·施伦鲍姆设计的 Chemex 融合了实验室烧瓶与包豪斯美学，凭借加厚滤纸带来极致纯净的口感，是设计与咖啡的双重传奇。',
  },
  {
    id: 'q9',
    category: '意式风味',
    question: '西班牙经典奶咖「可塔朵（Cortado）」名称源自西班牙语 Cortar（切割），它的标准浓缩与温奶比例大约是？',
    options: ['1 : 6', '1 : 4', '1 : 1', '1 : 10'],
    correctIndex: 2,
    explanation:
      '约 1:1 的等量温润微泡奶恰好“切开”浓缩过于尖锐的酸苦，却保留了饱满醇厚的咖啡本体风味。',
  },
  {
    id: 'q10',
    category: '冷萃美学',
    question: '日式急冷冰手冲（Flash Brew）相比 10 小时冷水浸泡冷萃（Cold Brew），最迷人的风味优势是？',
    options: [
      '咖啡因含量为零',
      '既有高温萃取出的明亮花果酸香，又通过冰块急冷瞬间锁香、清爽不氧化',
      '不需要任何滤纸',
      '味道一定更苦更厚重',
    ],
    correctIndex: 1,
    explanation:
      '许多精细的柑橘与白花酯类芳香物质只有在 90°C 以上才能充分溶解，直接滴落在冰块上瞬间冷却，兼顾了极高香气与冰爽口感。',
  },
  {
    id: 'q11',
    category: '风土产区',
    question: '以下哪项处理法是印度尼西亚苏门答腊曼特宁最具代表性的独特工艺？',
    options: ['肯尼亚双重水洗', '湿刨法 (Giling Basah)', '二氧化碳浸渍', '冷冻干燥法'],
    correctIndex: 1,
    explanation:
      '湿刨法在高含水率阶段脱去羊皮壳并二次晒干，赋予苏门答腊咖啡标志性的草本雪松、黑巧厚重质感与极低酸度。',
  },
  {
    id: 'q12',
    category: '甜品咖啡',
    question: '意大利经典甜品咖啡「阿芙佳朵（Affogato）」在意大利语中的字面意思是？',
    options: ['晨光初照', '淹没 / 溺水', '雪山之巅', '琥珀瀑布'],
    correctIndex: 1,
    explanation:
      'Affogato 意为“淹没”——指一颗冰凉扎实的香草 Gelato 被刚萃出的滚烫双份意式浓缩缓缓浇淋包裹，冰火交融。',
  },
]

export const EXHIBIT_EXTRAS: Record<string, ExhibitEditorialExtra> = {
  'yirgacheffe-v60': {
    pairing: '柠檬磅蛋糕 / 杏仁可颂',
    tastingWindow: '65°C → 48°C 温度越降白桃甜感越明亮',
    fortune: '今日宜轻装上阵，像清晨第一缕穿过百叶窗的暖阳，明澈而充满灵感。',
  },
  'panama-geisha': {
    pairing: '白桃马卡龙 / 清淡司康',
    tastingWindow: '分热、温、凉三段细品，冷后佛手柑与蜜韵最惊艳',
    fortune: '不必追赶喧嚣，真正优雅的事物总自带留白与芬芳。',
  },
  'mandheling-nel': {
    pairing: '70% 生巧克力 / 焦糖布丁',
    tastingWindow: '趁热 68°C 品饮，体会吃茶馆木质书房般的醇厚包裹',
    fortune: '放慢脚步的时刻，往往藏着最扎实的力量与回甘。',
  },
  'classic-espresso': {
    pairing: '常温气泡水 + 意式杏仁脆饼 (Biscotti)',
    tastingWindow: '出杯 2 分钟黄金赏味窗，搅匀虎斑油脂一口饮尽',
    fortune: '干脆利落的一刻专注，足以点燃整日的灵感火花。',
  },
  'velvet-flat-white': {
    pairing: '肉桂卷 / 黄油牛角包',
    tastingWindow: '58°C 刚出杯即可大口抿入，微泡与浓咖同步抵舌',
    fortune: '刚柔并济是今日最佳状态——既有锋芒，亦不失温柔。',
  },
  'silky-latte': {
    pairing: '提拉米苏 / 芝士巴斯克',
    tastingWindow: '55–60°C 温柔慢饮，奶香与太妃糖韵持久治愈',
    fortune: '给自己留一段不设目标的午后，柔软即是疗愈。',
  },
  'osmanthus-oat-dirty': {
    pairing: '桂花绿豆糕 / 燕麦曲奇',
    tastingWindow: '出杯 3 分钟内不搅拌分 3–4 大口直饮',
    fortune: '打破常规的温柔碰撞，也许会带来今天最惊喜的收获。',
  },
  'kyoto-cold-brew': {
    pairing: '朗姆葡萄夹心饼干 / 黑巧塔',
    tastingWindow: '4°C 搭老冰球慢晃醒香，越品酒韵越柔和',
    fortune: '所有值得等待的事物，时间都在暗处替你静静酝酿。',
  },
  'sicilian-lemon-americano': {
    pairing: '柠檬塔 / 海盐苏打饼干',
    tastingWindow: '满冰气泡活跃时趁凉畅饮，瞬间扫除困倦',
    fortune: '把繁琐留给昨天，今天只管清爽上场、迎风前行。',
  },
  'italian-moka-pot': {
    pairing: '烤吐司配榛子酱 / 意式芝士卷',
    tastingWindow: '趁热纯饮或兑等量热奶，满屋都是复古厨房香气',
    fortune: '生活最动人的浪漫，藏在每天清晨咕嘟作响的烟火气里。',
  },
  'coconut-cloud-latte': {
    pairing: '芒果千层 / 椰丝玛德琳',
    tastingWindow: '先直饮绵密椰云顶，再搅匀大口感受海风清甜',
    fortune: '哪怕身处忙碌都市，心头也可以随时吹过一阵热带海风。',
  },
  'costa-rica-french-press': {
    pairing: '胡桃派 / 焦糖肉桂吐司',
    tastingWindow: '出杯静置 1 分钟再倒，保留脂香且杯底清亮',
    fortune: '不必追求完美滤镜，真实丰盈的本色本就迷人。',
  },
  'kenya-aeropress-iced': {
    pairing: '蓝莓麦芬 / 树莓酥挞',
    tastingWindow: '压毕摇冰即饮，体验红宝石果汁般的鲜活酸甜',
    fortune: '一次轻巧的创意尝试，也许会打开意想不到的新通道。',
  },
  'viennese-einspanner': {
    pairing: '维也纳萨赫巧克力蛋糕 / 苹果卷',
    tastingWindow: '不搅拌 45° 仰杯，同时抿到冰海盐奶霜与热黑咖',
    fortune: '微咸的温柔衬托滚烫的热爱，今天值得被好好犒赏。',
  },
  'yunnan-baoshan-v60': {
    pairing: '玫瑰鲜花饼 / 黑芝麻酥',
    tastingWindow: '温热至 55°C 时黑李果酒香与东方茶韵最立体',
    fortune: '扎根自己的风土节奏，自有独一无二的东方芬芳。',
  },
  'colombia-pink-bourbon-iced': {
    pairing: '覆盆子慕斯 / 伯爵茶曲奇',
    tastingWindow: '趁冰块清脆晃杯即饮，满口血橙红茶清冽感',
    fortune: '保持清澈与好奇，明亮的好运正在不远处向你挥手。',
  },
  'classic-cappuccino': {
    pairing: '现烤可颂 / 榛子酥',
    tastingWindow: '出杯趁云朵奶泡最挺括时享用，留下一抹俏皮奶胡子',
    fortune: '饱满的热情配上一朵蓬松的云，今天适合开启新篇章。',
  },
  'madrid-cortado': {
    pairing: '吉事果 (Churros) / 焦糖杏仁脆片',
    tastingWindow: '55°C 小杯三口细品，精致干练不拖泥带水',
    fortune: '少即是多，精准把握核心就能事半功倍。',
  },
  'florence-affogato': {
    pairing: '意大利手指饼干 / 烤榛果碎',
    tastingWindow: '现浇现舀，先食半融冰淇淋再饮杯底香草拿铁',
    fortune: '允许自己偶尔沉溺于甜蜜，快乐本身就是最好的生产力。',
  },
  'jamaica-blue-mountain-syphon': {
    pairing: '原味轻乳酪蛋糕 / 和果子',
    tastingWindow: '虹吸回流后略放 2 分钟至 68°C，感受绸缎般零棱角平衡',
    fortune: '当万物各得其所，从容优雅便会自然流露。',
  },
  'istanbul-turkish-cezve': {
    pairing: '玫瑰开心果土耳其软糖 (Lokum) + 冰清水',
    tastingWindow: '静置 45 秒待细粉沉底后小口啜饮，留渣于杯底',
    fortune: '古老的香料在低语：耐心守候火候，惊喜已在酝酿。',
  },
  'guatemala-antigua-chemex': {
    pairing: '柑橘黑巧司康 / 核桃布朗尼',
    tastingWindow: '手握木领轻轻摇杯醒香，适合与好友双人共享',
    fortune: '把好时光分给重要的人，清澈的香气会加倍绵长。',
  },
  'valrhona-dark-mocha': {
    pairing: '海盐焦糖可露丽 / 坚果曲奇',
    tastingWindow: '趁热 60°C 慢品融化的单源黑巧与海盐丝绒奶泡',
    fortune: '苦甜交织才是生活的真味，今日自有温柔回响。',
  },
  'orange-c-cold-americano': {
    pairing: '橙皮玛德琳 / 轻乳酪三明治',
    tastingWindow: '先定格日落双色渐变，搅匀后大口唤醒满满维 C 活力',
    fortune: '如明媚橙光撞进清晨，今天的你元气满格、闪闪发光！',
  },
}

export function getDailyFeaturedIndex(total: number): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
  return total > 0 ? dayOfYear % total : 0
}
