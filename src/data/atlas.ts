export interface OriginRegion {
  id: string
  name: string
  englishName: string
  continent: '非洲' | '亚洲' | '中美洲与加勒比' | '南美洲' | '欧洲与地中海' | '太平洋与大洋洲'
  x: number // SVG map x (0..900)
  y: number // SVG map y (0..420)
  labelDx: number // Horizontal offset from pin center for collision-free label
  labelDy: number // Vertical offset from pin center for collision-free label
  labelAnchor: 'start' | 'middle' | 'end'
  altitudeMidM?: number // Representative numeric altitude (meters) for altitude ruler
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

export interface BrewTroubleshootCase {
  id: string
  symptom: string
  englishTag: string
  diagnosis: string
  rootCause: string
  fixes: {
    lever: string
    action: string
  }[]
  practiceExhibitId: string
}

export interface FlavorWheelFamily {
  id: string
  name: string
  englishName: string
  color: string
  lightColor: string
  subNotes: string[]
  description: string
  matchKeywords: string[]
}

export const COFFEE_ORIGINS: OriginRegion[] = [
  {
    id: 'ethiopia',
    name: '埃塞俄比亚 · 耶加雪菲',
    englishName: 'Ethiopia · Yirgacheffe',
    continent: '非洲',
    x: 525,
    y: 204,
    labelDx: 18,
    labelDy: -3,
    labelAnchor: 'start',
    altitudeMidM: 2000,
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
    name: '东非高地 · 肯尼亚与坦桑尼亚',
    englishName: 'Kenya Nyeri & Tanzania Kilimanjaro',
    continent: '非洲',
    x: 522,
    y: 229,
    labelDx: 18,
    labelDy: 10,
    labelAnchor: 'start',
    altitudeMidM: 1850,
    altitude: '1,650 – 2,050 m',
    climate: '赤道火山红土与乞力马扎罗雪山斜坡',
    varieties: 'SL28 / SL34 / 乞力马扎罗 PB 圆豆',
    signatureFlavor: '黑加仑 · 黑醋栗 · 圣女果 · 红西柚汁感',
    story:
      '肯尼亚独有的 72 小时双重水洗发酵工艺搭配火山红土赋予 SL28 炸裂浆果酸质；南邻乞力马扎罗雪山仅占 5% 的珍稀 PB 圆豆则以凝练饱满的黑醋栗甜感著称。',
    matchKeywords: ['肯尼亚', '坦桑尼亚'],
  },
  {
    id: 'rwanda',
    name: '卢旺达 · 基伍湖千丘',
    englishName: 'Rwanda · Lake Kivu',
    continent: '非洲',
    x: 500,
    y: 235,
    labelDx: -16,
    labelDy: 10,
    labelAnchor: 'end',
    altitudeMidM: 1875,
    altitude: '1,750 – 2,000 m',
    climate: '东非火山千丘湖岸高地',
    varieties: '高海拔红波旁 (Red Bourbon)',
    signatureFlavor: '血橙红茶 · 红醋栗 · 黑糖甜尾',
    story:
      '肥沃火山土壤与充沛湖风孕育出极具优雅红茶感与明亮浆果酸质的红波旁，是近年精品手冲与聪明杯的宝藏产区。',
    matchKeywords: ['卢旺达'],
  },
  {
    id: 'india',
    name: '印度 · 马拉巴尔海岸',
    englishName: 'India · Malabar Coast',
    continent: '亚洲',
    x: 622,
    y: 196,
    labelDx: 0,
    labelDy: 20,
    labelAnchor: 'middle',
    altitudeMidM: 1275,
    altitude: '1,100 – 1,450 m',
    climate: '西南季风湿润海洋季风带',
    varieties: '肯特 (Kent) / S795 季风豆',
    signatureFlavor: '烤腰果 · 暖肉豆蔻 · 极低酸黑巧',
    story:
      '十九世纪帆船季风意外成就了独一无二的“季风风渍处理法”，使豆体金黄膨大、酸度归零、香料醇厚度惊艳。',
    matchKeywords: ['印度'],
  },
  {
    id: 'yemen',
    name: '也门 · 巴尼马塔里梯田',
    englishName: 'Yemen · Bani Mattar',
    continent: '亚洲',
    x: 556,
    y: 174,
    labelDx: 12,
    labelDy: -12,
    labelAnchor: 'start',
    altitudeMidM: 2200,
    altitude: '2,000 – 2,400 m',
    climate: '干旱高海拔石造梯田',
    varieties: '古老也门原生种 (Mattari)',
    signatureFlavor: '天然黑可可 · 无花果干 · 红酒肉桂',
    story:
      '十五世纪起便经红海摩卡港销往欧洲与奥斯曼帝国的咖啡圣地，“摩卡”一词正是源自也门摩卡港对天然黑巧风味豆的美称。',
    matchKeywords: ['也门'],
  },
  {
    id: 'vietnam',
    name: '越南 · 大叻、河内与西贡',
    englishName: 'Vietnam · Da Lat, Hanoi & Saigon',
    continent: '亚洲',
    x: 702,
    y: 190,
    labelDx: 16,
    labelDy: 4,
    labelAnchor: 'start',
    altitudeMidM: 1250,
    altitude: '800 – 1,650 m',
    climate: '中部火山高原与南北法式咖啡文化交融',
    varieties: '大叻阿拉比卡 × 邦美蜀精品罗布斯塔拼配',
    signatureFlavor: '焦糖炼乳 · 提拉米苏蛋奶霜 · 深烘可可',
    story:
      '全球第二大咖啡产国。北有 1946 年诞生的丝滑河内焦糖蛋咖啡，南有街头金属 Phin 壶慢滴加冰的西贡冰炼乳滴漏，共同构成独树一帜的南洋浓甜美学。',
    matchKeywords: ['越南'],
  },
  {
    id: 'yunnan',
    name: '中国云南 · 普洱与保山',
    englishName: 'China · Yunnan Pu-erh & Baoshan',
    continent: '亚洲',
    x: 682,
    y: 162,
    labelDx: 0,
    labelDy: -15,
    labelAnchor: 'middle',
    altitudeMidM: 1575,
    altitude: '1,400 – 1,750 m',
    climate: '北纬 23°–25° 云雾高山与干热河谷',
    varieties: '铁皮卡 / 卡蒂姆精选',
    signatureFlavor: '百花野蜜 · 熟黄桃 · 滇红茶回甘',
    story:
      '百年小粒咖啡种植底蕴叠加近年精品百花蜜处理与厌氧浪潮，让云南普洱思茅、保山与孟连成为亚洲最具东方蜜茶韵味的新锐产区。',
    matchKeywords: ['云南', '普洱'],
  },
  {
    id: 'sumatra',
    name: '印度尼西亚 · 苏门答腊',
    englishName: 'Indonesia · Sumatra',
    continent: '亚洲',
    x: 690,
    y: 234,
    labelDx: 0,
    labelDy: 21,
    labelAnchor: 'middle',
    altitudeMidM: 1500,
    altitude: '1,350 – 1,650 m',
    climate: '热带赤道火山雨林',
    varieties: '铁皮卡 / Ateng',
    signatureFlavor: '75% 黑巧 · 雪松草本 · 焦糖糖浆',
    story:
      '因潮湿多雨诞生了标志性的“湿刨法 (Giling Basah)”，赋予黄金曼特宁极低酸度与宛如红酒丝绒般的醇厚汤体。',
    matchKeywords: ['苏门答腊', '印度尼西亚'],
  },
  {
    id: 'hawaii',
    name: '夏威夷 · 可纳火山岛',
    englishName: 'USA · Hawaii Kona Coast',
    continent: '太平洋与大洋洲',
    x: 92,
    y: 174,
    labelDx: 0,
    labelDy: -15,
    labelAnchor: 'middle',
    altitudeMidM: 650,
    altitude: '450 – 850 m',
    climate: '晨光晴朗、午后云雾遮荫的海岛火山斜坡',
    varieties: '可纳铁皮卡 (Kona Typica)',
    signatureFlavor: '烤夏威夷果 · 牛奶巧克力 · 红糖丝滑甜',
    story:
      '太平洋火山岛得天独厚的富矿熔岩土壤与“上午日照、下午云雾”的微气候，让可纳铁皮卡无需极高海拔也能绽放奶油坚果般的极度顺滑甘甜。',
    matchKeywords: ['夏威夷', '可纳'],
  },
  {
    id: 'panama',
    name: '巴拿马 · 波奎特火山谷',
    englishName: 'Panama · Boquete',
    continent: '中美洲与加勒比',
    x: 245,
    y: 202,
    labelDx: 30,
    labelDy: -4,
    labelAnchor: 'start',
    altitudeMidM: 1800,
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
    labelDx: -22,
    labelDy: 24,
    labelAnchor: 'end',
    altitudeMidM: 1700,
    altitude: '1,550 – 1,850 m',
    climate: '太平洋干湿季分明火山带',
    varieties: '卡杜拉 / 卡杜艾 / 莫扎特音乐家系列',
    signatureFlavor: '玫瑰葡萄干蜜 · 红糖果脯 · 烤杏仁脂香',
    story:
      '精妙绝伦的微型水洗处理厂发源地，擅长通过精确控制留存果胶比例与风靡全球的“莫扎特葡萄干蜜处理”雕琢如蜂蜜果脯般的圆润甜感。',
    matchKeywords: ['哥斯达黎加'],
  },
  {
    id: 'guatemala',
    name: '危地马拉 · 安提瓜与萨尔瓦多',
    englishName: 'Guatemala Antigua & El Salvador',
    continent: '中美洲与加勒比',
    x: 215,
    y: 182,
    labelDx: -16,
    labelDy: -22,
    labelAnchor: 'end',
    altitudeMidM: 1675,
    altitude: '1,500 – 1,850 m',
    climate: '活火山环抱的富矿中美洲火山带',
    varieties: '波旁 / 卡杜拉 / 萨尔瓦多帕卡马拉',
    signatureFlavor: '牛奶可可 · 蜜渍甜橙 · 丝滑坚果',
    story:
      '火山浮石土壤既排水良好又富含矿物质，危地马拉安提瓜与邻国萨尔瓦多象豆帕卡马拉皆以酸甜平衡、巧克力圆润尾韵闻名于世。',
    matchKeywords: ['危地马拉', '萨尔瓦多'],
  },
  {
    id: 'jamaica',
    name: '牙买加 · 蓝山圣安德鲁斯',
    englishName: 'Jamaica · Blue Mountain',
    continent: '中美洲与加勒比',
    x: 264,
    y: 176,
    labelDx: 18,
    labelDy: -18,
    labelAnchor: 'start',
    altitudeMidM: 1650,
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
    labelDx: 22,
    labelDy: 10,
    labelAnchor: 'start',
    altitudeMidM: 1775,
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
    labelDx: 0,
    labelDy: 20,
    labelAnchor: 'middle',
    altitudeMidM: 1175,
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
    labelDx: 0,
    labelDy: -15,
    labelAnchor: 'middle',
    altitude: '咖啡文化与器具发源地',
    climate: '意式蒸汽 · 维也纳雪顶 · 奥斯曼铜壶',
    varieties: '浓缩拼配 / 土耳其超细粉 / 创意特调',
    signatureFlavor: '黄金虎斑油脂 · 绿豆蔻香料 · 绵密奶霜',
    story:
      '虽然不生长咖啡树，但伊斯坦布尔的铜壶、米兰的 9 Bar 意式浓缩与摩卡壶、维也纳的奶油雪顶，共同塑造了人类近五百年的咖啡馆浪漫。',
    matchKeywords: ['意大利', '西班牙', '洪都拉斯', '希腊', '爱尔兰'],
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
  {
    id: 'q13',
    category: '咖啡历史',
    question: '人们常说的“摩卡（Mocha）”最初其实并不是指巧克力酱，而是源自哪里？',
    options: [
      '意大利米兰的一家百年甜品店',
      '15 世纪也门红海边著名的咖啡贸易港口“摩卡港”',
      '巴西最大的可可种植园名称',
      '法国宫廷咖啡师的姓氏',
    ],
    correctIndex: 1,
    explanation:
      '也门高地古法日晒豆经摩卡港销往世界，天生自带迷人的黑巧克力与香料风味，后世才衍生出加入巧克力调制的“摩卡拿铁”。',
  },
  {
    id: 'q14',
    category: '世界风情',
    question: '1946 年在河内诞生的越南国民名饮「河内蛋咖啡（Cà Phê Trứng）」，顶层如提拉米苏般绵密的金霜主要由什么打发而成？',
    options: [
      '蛋白与海盐',
      '无菌蛋黄、甜炼乳与少许香草/蜂蜜',
      '纯椰浆与椰糖',
      '马斯卡彭芝士与淡奶油',
    ],
    correctIndex: 1,
    explanation:
      '当年鲜奶稀缺，调酒师阮文江用蛋黄与甜炼乳高速打发出蓬松香甜的黄金蛋奶霜，完美托住了越南 Phin 滴漏黑咖的醇厚苦香。',
  },
  {
    id: 'q15',
    category: '特调原理',
    question: '制作经典「爱尔兰咖啡」时，往滚烫黑咖中先充分融化红糖除了调味，还有一个巧妙的物理作用是？',
    options: [
      '让咖啡迅速冷却结冰',
      '提高下层咖啡液密度，让顶层冰凉淡奶油稳稳漂浮不下沉',
      '中和掉全部咖啡因',
      '让杯壁自动产生气泡',
    ],
    correctIndex: 1,
    explanation:
      '糖分溶入咖啡提高了下层液体比重，配合勺背轻缓引流，即可让 6 分发冰凉动物鲜奶油如雪白浮云般平整漂浮在热咖之上。',
  },
  {
    id: 'q16',
    category: '奇趣工艺',
    question: '印度传奇豆种「季风马拉巴尔（Monsooned Malabar）」几乎毫无尖酸、口感如坚果丝绒，它的独特风味源自什么？',
    options: [
      '用海水直接煮熟咖啡豆',
      '将生豆敞开置于印度洋湿润季风中吹拂数月完成自然风渍',
      '在零下 30°C 冰川中冷冻半年',
      '烘焙时加入大量印度咖喱粉',
    ],
    correctIndex: 1,
    explanation:
      '大航海时代运往欧洲的印度咖啡豆在季风海运中受湿气影响膨胀成金黄色，意外造就了极低酸、高醇厚与暖香料尾韵的独特风味。',
  },
  {
    id: 'q17',
    category: '器具秘技',
    question: '使用「聪明杯（Clever Dripper）」冲煮精品咖啡时，世界冠军强烈推荐的防堵滤纸秘技是？',
    options: [
      '把咖啡粉磨成面粉一样细',
      '采用“先注热水、再倒咖啡粉”顺序，避免细粉提前沉底堵死滤纸',
      '不放滤纸直接倒进杯中',
      '必须使用冰水浸泡 3 小时',
    ],
    correctIndex: 1,
    explanation:
      '先注水再入粉能避免水流冲击把细粉压实到滤纸底部，放流下水速度会快且均匀得多，萃取出的茶汤格外干净甜润。',
  },
  {
    id: 'q18',
    category: '茶咖特调',
    question: '调制「宇治抹茶浓缩三重奏」时，手刷抹茶液的最佳水温是多少？',
    options: ['100°C 刚滚开的沸水', '75 – 80°C 温热水', '0°C 冰水', '98°C 高温蒸汽'],
    correctIndex: 1,
    explanation:
      '75–80°C 既能迅速把细微抹茶粉点打出绵密翡翠茶沫，又不会烫熟茶叶激发出苦涩味，保留最鲜甜的海苔旨味。',
  },
]

export const FLAVOR_WHEEL_FAMILIES: FlavorWheelFamily[] = [
  {
    id: 'floral',
    name: '白花茶韵',
    englishName: 'Floral & Tea',
    color: '#C7825A',
    lightColor: 'rgba(199, 130, 90, 0.18)',
    subNotes: ['茉莉白花', '橙花佛手柑', '金桂花蜜', '乌龙/伯爵茶感'],
    description: '高海拔水洗浅烘原生种与瑰夏的迷人签名，入口清雅如高山茶汤。',
    matchKeywords: ['茉莉', '橙花', '佛手柑', '桂花', '玫瑰', '乌龙', '红茶', '茶韵'],
  },
  {
    id: 'citrus',
    name: '柑橘莓果',
    englishName: 'Citrus & Berry',
    color: '#D49A3E',
    lightColor: 'rgba(212, 154, 62, 0.18)',
    subNotes: ['鲜榨脐橙', '黄柠檬青柠', '血橙西柚', '黑加仑覆盆子'],
    description: '鲜亮活泼的有机果酸与果汁感，在冰手冲、爱乐压闪萃与柑橘特调中最具生命力。',
    matchKeywords: ['柑', '橙', '柠檬', '柚', '莓', '桃', '黑加仑', '覆盆子', '醋栗'],
  },
  {
    id: 'nutty',
    name: '坚果焦糖',
    englishName: 'Nutty & Caramel',
    color: '#A96B38',
    lightColor: 'rgba(169, 107, 56, 0.18)',
    subNotes: ['烤榛果杏仁', '太妃糖布丁', '古法红糖', '烤腰果饼干'],
    description: '中烘与中深烘梅纳焦糖化带来的温暖甜香，百搭且最受大众欢迎。',
    matchKeywords: ['榛果', '杏仁', '核桃', '腰果', '焦糖', '太妃', '红糖', '黑糖', '坚果'],
  },
  {
    id: 'cocoa',
    name: '黑巧可可',
    englishName: 'Dark Cocoa',
    color: '#5C311B',
    lightColor: 'rgba(92, 49, 27, 0.18)',
    subNotes: ['75% 黑巧克力', '法芙娜生巧', '可可粉', '深烘奶油油脂'],
    description: '深烘豆与意式高压萃取的醇厚骨架，微苦回甘、余韵厚重持久。',
    matchKeywords: ['黑巧', '可可', '巧克力', '油脂'],
  },
  {
    id: 'spice',
    name: '香料草本',
    englishName: 'Spice & Herbal',
    color: '#54735A',
    lightColor: 'rgba(84, 115, 90, 0.18)',
    subNotes: ['鲜碾绿豆蔻', '雪松草本', '肉桂肉豆蔻', '宇治抹茶海苔'],
    description: '极具地域风土辨识度的东方草本、中东香料与雨林木质调性。',
    matchKeywords: ['豆蔻', '肉桂', '雪松', '草本', '香料', '抹茶', '海苔', '熟普'],
  },
  {
    id: 'velvet',
    name: '酒香奶韵',
    englishName: 'Boozy & Creamy',
    color: '#8E493C',
    lightColor: 'rgba(142, 73, 60, 0.18)',
    subNotes: ['雪莉橡木桶', '红酒无花果', '海盐奶霜', '香草提拉米苏'],
    description: '冷萃桶发酵微醺感、丝绒鲜奶乳糖甜与意式甜品奶霜的治愈二重奏。',
    matchKeywords: ['酒', '桶', '奶', '椰', '香草', '提拉米苏', '蛋霜', '麦芽'],
  },
]

export const BREW_TROUBLESHOOT_CASES: BrewTroubleshootCase[] = [
  {
    id: 'too-sour',
    symptom: '入口尖酸刺激、发涩空洞',
    englishTag: 'UNDER-EXTRACTION · 萃取不足',
    diagnosis: '酸味物质最先溶出，而甜感与醇厚尚未充分萃出就结束了萃取。',
    rootCause: '研磨过粗、水温偏低、闷蒸不充分或总注水时间过短（如 V60 不足 1 分 45 秒）。',
    fixes: [
      { lever: '调细研磨', action: '把磨豆机调细 1–2 格，增加粉水接触面积并减缓下水速度。' },
      { lever: '提高水温', action: '浅烘豆建议提高至 92–93°C，充分打开果胶甜感柔化尖酸。' },
      { lever: '延长闷蒸与分段', action: '确保 30–35 秒充分排气闷蒸，分 2–3 段绕圈注水延长萃取至 2 分 15 秒。' },
    ],
    practiceExhibitId: 'yirgacheffe-v60',
  },
  {
    id: 'too-bitter',
    symptom: '焦苦发干、舌根锁喉涩感',
    englishTag: 'OVER-EXTRACTION · 过度萃取',
    diagnosis: '高温与过长时间将尾段大分子苦涩木质素与焦苦味过度溶出。',
    rootCause: '深烘豆水温过高（>90°C）、研磨过细、细粉堵塞滤纸或冲煮时间超过 3 分钟。',
    fixes: [
      { lever: '降低水温', action: '中深/深烘豆直接降温至 85–88°C，苦感会立刻变得柔和回甘。' },
      { lever: '调粗研磨', action: '调粗 1–2 格减少细粉堵塞，让下水通畅干净。' },
      { lever: '提前截流收口', action: '尾段滤杯尚留少许残液时果断移杯，舍弃最苦涩的末尾 10ml 尾水。' },
    ],
    practiceExhibitId: 'mandheling-nel',
  },
  {
    id: 'too-watery',
    symptom: '水感寡淡、香气薄弱没层次',
    englishTag: 'LOW STRENGTH · 浓度偏低 / 通道效应',
    diagnosis: '粉水比过大或水流直接沿滤纸边缘流走，没有真正穿过咖啡粉层。',
    rootCause: '注水冲刷滤纸壁形成“旁路通道”、粉量偏少，或咖啡豆已烘焙超过 2 个月失香。',
    fixes: [
      { lever: '缩小粉水比', action: '从 1:16 收紧至 1:14.5–1:15，或直接使用工坊「更浓郁醇厚」口味档。' },
      { lever: '专注中心绕圈', action: '水流始终保持在粉床中央三分之二区域，绝不直接冲洗滤纸边缘。' },
      { lever: '检查新鲜度', action: '选用烘焙后 7–35 天内的新鲜豆，现磨现冲香气提升立竿见影。' },
    ],
    practiceExhibitId: 'guatemala-antigua-chemex',
  },
  {
    id: 'muddy-flavor',
    symptom: '口感浑浊、杯底有泥沙杂味',
    englishTag: 'FINES MIGRATION · 细粉过多 / 过度搅动',
    diagnosis: '过多极细粉穿过金属网或堵塞滤纸，带来浑浊的干涩与沉闷感。',
    rootCause: '磨豆机刀盘均匀度不足、注水水流过猛剧烈冲翻粉床，或法压壶压杆压得太狠。',
    fixes: [
      { lever: '放低注水高度', action: '壶嘴尽量贴近液面 3–4cm 轻柔注水，减少把细粉冲到底部滤孔的扰动。' },
      { lever: '法压壶撇沫秘技', action: '浸泡后先破渣并撇掉表层浮沫，压网仅停在液面、杯底留 10ml 不倒。' },
      { lever: '换用加厚滤纸', action: 'Chemex 或 V60 漂白滤纸能牢牢锁住细粉与杂油，干净度瞬间飙升。' },
    ],
    practiceExhibitId: 'costa-rica-french-press',
  },
  {
    id: 'coarse-foam',
    symptom: '奶泡大气泡粗糙、拉花沉底散开',
    englishTag: 'MICROFOAM · 进气过久或奶温过高',
    diagnosis: '打发奶泡时进气时间太长或未形成高速漩涡，未能将大气泡打碎融合。',
    rootCause: '蒸汽棒长期浮在液面发出刺耳大泡声，或加热超过 70°C 破坏牛奶蛋白质。',
    fixes: [
      { lever: '精准控制进气 3–5 秒', action: '澳白仅轻听“嘶嘶”纸撕声 3 秒，随后立刻将蒸汽棒埋深 1cm 形成旋涡打绵。' },
      { lever: '控温 55–62°C 停机', action: '手贴拉花缸感到温热微烫立刻关蒸汽，这是乳糖最甜、光泽如镜面的温度。' },
      { lever: '轻震摇匀再注入', action: '出缸后在桌面轻敲 2 下消大泡并画圈摇晃，让奶泡与热奶丝滑一体。' },
    ],
    practiceExhibitId: 'velvet-flat-white',
  },
  {
    id: 'moka-burnt',
    symptom: '摩卡壶剧烈喷溅、有金属焦糊味',
    englishTag: 'MOKA OVERHEAT · 火力过大或冷水慢烤',
    diagnosis: '下壶冷水加热太久把粉饼提前烤糊，且大火让过热蒸汽猛穿粉层。',
    rootCause: '下壶装冷水起步、用力压实了粉槽，或火焰超出壶底且没有及时离火。',
    fixes: [
      { lever: '下壶直接用 85°C 热水', action: '大幅缩短加热时间，让咖啡粉在萃取前不被滚烫铝壶干烤发苦。' },
      { lever: '切忌压粉 + 极小火', action: '粉槽自然装满轻刮平整即可；火焰绝不超过壶底，开盖观察慢涌如蜂蜜。' },
      { lever: '冷毛巾立刻止萃', action: '咖啡刚开始发白即将咕嘟喷气前立刻离火，湿冷毛巾包下壶底 5 秒终止余热。' },
    ],
    practiceExhibitId: 'italian-moka-pot',
  },
]

