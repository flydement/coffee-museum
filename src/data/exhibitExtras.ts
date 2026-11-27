export interface ExhibitEditorialExtra {
  pairing: string
  tastingWindow: string
  fortune: string
}

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
  'yemen-mocha-matari': {
    pairing: '阿拉伯蜜枣 / 无花果坚果欧包',
    tastingWindow: '从 65°C 品到 48°C，黑巧香料会逐渐化作迷人酒韵果甜',
    fortune: '跨越千年的古老航线提醒你：坚持本色，时间终会赋予厚度。',
  },
  'irish-velvet-coffee': {
    pairing: '黄油酥饼 (Shortbread) / 焦糖苹果派',
    tastingWindow: '趁热不搅拌，穿过 2cm 冰滑鲜奶油直啜黑糖浓咖',
    fortune: '外面哪怕风雨微凉，手心这一杯暖意足以温柔安放疲惫。',
  },
  'greek-iced-frappe': {
    pairing: '开心果蜂蜜千层酥 / 柠檬海盐饼干',
    tastingWindow: '趁 3cm 焦糖雪泡最绵厚时插吸管慢啜，越冰越清爽',
    fortune: '给生活摇出一点绵密气泡，轻松愉悦就是最好的解题姿态。',
  },
  'hanoi-egg-coffee': {
    pairing: '法棍脆片 / 焦糖布丁曲奇',
    tastingWindow: '杯底坐温水保温，先舀一口金黄蛋奶霜再搅匀慢品',
    fortune: '在物资匮乏里也能创造惊艳美味——创意总能点石成金。',
  },
  'monsoon-malabar-flannel': {
    pairing: '腰果酥 / 肉桂黄油司康',
    tastingWindow: '趁热 68°C 细品法兰绒保留的丰沛油脂与零酸丝滑',
    fortune: '历经风浪的温柔最为从容，今天的一切都将如丝绸般顺遂。',
  },
  'sydney-piccolo-latte': {
    pairing: '迷你可露丽 / 焦糖饼干',
    tastingWindow: '58°C 出杯即饮，小杯浓缩与奶甜在两三口间恰到好处',
    fortune: '轻巧而笃定的一小步，也能点亮整个午后的好心情。',
  },
  'uji-matcha-espresso-fusion': {
    pairing: '抹茶铜锣烧 / 白巧克力曲奇',
    tastingWindow: '先定格翡翠雪白琥珀三层，再自下而上搅匀畅饮',
    fortune: '东方茶韵与意式热情可以同杯共生，跨界总能撞出惊喜。',
  },
  'rwanda-bourbon-clever': {
    pairing: '柑橘磅蛋糕 / 蔓越莓玛芬',
    tastingWindow: '放流完毕后略凉至 60°C，红醋栗与红茶甜感最为明亮',
    fortune: '找到聪明省力的方法，好结果自然水到渠成。',
  },
  'yunnan-puer-wildflower-honey': {
    pairing: '云南鲜花饼 / 蜂蜜黄油吐司',
    tastingWindow: '从 65°C 热饮花香品到 52°C，百花野蜜与熟黄桃甜感最为充盈',
    fortune: '山野百花自有酝酿的时节，今日你的温柔坚持会结出清甜回甘。',
  },
  'colombia-rose-valley-v60': {
    pairing: '玫瑰荔枝马卡龙 / 白桃千层蛋糕',
    tastingWindow: '入杯晃香后趁 58°C 细啜，玫瑰花露与水蜜桃乌龙茶韵同步绽放',
    fortune: '自带芬芳的人走到哪里都会被温柔看见，愿今日浪漫如约而至。',
  },
  'salted-caramel-macchiato': {
    pairing: '海盐焦糖布朗尼 / 核桃肉桂卷',
    tastingWindow: '趁热不搅拌，第一口穿过微咸焦糖奶泡直触浓香浓缩层',
    fortune: '一点恰到好处的微咸，反而衬出生活最动人的甘甜。',
  },
  'hk-yuanyang-milk-coffee': {
    pairing: '冰火菠萝油 / 港式酥皮蛋挞',
    tastingWindow: '65°C 趁热大口品饮，锡兰红茶厚韵与曼特宁奶香一秒回魂',
    fortune: '兼容并蓄总能碰撞出经典，今天的跨界灵感会带来意外惊喜。',
  },
  'muscat-grape-coldbrew': {
    pairing: '青柠芝士挞 / 椰子脆片饼干',
    tastingWindow: '先定格翡翠琥珀双层，搅匀青提果肉后趁气泡最绵密畅饮',
    fortune: '把烦闷交给冰块与细密气泡，轻盈出发便是一路好风景。',
  },
  'espresso-tonic-citrus': {
    pairing: '迷迭香海盐佛卡夏 / 西柚果干司康',
    tastingWindow: '趁冰块清脆、气泡跳动时沿西柚香杯口大口冰爽品饮',
    fortune: '微苦之后是通透清亮，今天的难题终会化作清醒利落的答卷。',
  },
  'el-salvador-pacamara-syphon': {
    pairing: '无花果核桃欧包 / 黑糖年轮蛋糕',
    tastingWindow: '虹吸回流后静置 1 分钟至 65°C，黑糖蜜与无花果干层次全开',
    fortune: '沉淀越深，爆发出的甜度越令人惊艳——今天宜沉心静气。',
  },
  'ethiopia-guji-hambela-aeropress': {
    pairing: '草莓奶油蛋糕卷 / 百香果巴斯克',
    tastingWindow: '压毕略晃散去燥热，55°C 时草莓奶油与桂花蜜甜如同果汁',
    fortune: '只需 100 秒专注发力，就能压出高光时刻——今日好运如花绽放！',
  },
  'costa-rica-mozart-v60': {
    pairing: '玫瑰荔枝慕斯 / 葡萄干司康',
    tastingWindow: '从 62°C 玫瑰清香品到 48°C，葡萄干蜜甜层层绽放',
    fortune: '生活自带优美旋律，放慢节奏便能听见今日的动人乐章。',
  },
  'colombia-el-paraiso-lychee': {
    pairing: '白桃乳酸冻芝士 / 荔枝杨梅冰糕',
    tastingWindow: '略凉至 55°C 轻啜，鲜剥冰荔枝与白玉兰花露香气达到巅峰',
    fortune: '敢于跳出常规去尝试，生活自会回馈你一场意料之外的惊艳。',
  },
  'hawaii-kona-chemex': {
    pairing: '夏威夷果仁曲奇 / 枫糖黄油华夫饼',
    tastingWindow: '趁温热 64°C 细品太平洋岛豆零涩感的烤坚果与黑糖丝绒',
    fortune: '像午后的岛屿海风一样松弛从容，今天一切都会顺滑推进。',
  },
  'yunnan-brown-sugar-cinnamon-latte': {
    pairing: '红糖核桃软欧 / 肉桂苹果酥',
    tastingWindow: '60°C 趁热连同肉桂云顶奶泡一口抿下，古法黑糖暖意直抵心底',
    fortune: '温柔的烟火气最抚人心，今天记得好好善待自己。',
  },
  'pistachio-velvet-latte': {
    pairing: '西西里卡诺里甜卷 / 开心果费南雪',
    tastingWindow: '出杯 58°C 即饮，香脆开心果碎配温热坚果奶泡双倍治愈',
    fortune: '剥开坚硬的外壳，里面藏着满满翡翠般的丰盈收获。',
  },
  'melbourne-magic-coffee': {
    pairing: '焦糖海盐可颂 / 榛果巧克力塔',
    tastingWindow: '56°C 小口细品，双份精萃的浓缩甜感在三四口间一气呵成',
    fortune: '删繁就简、直取精华，今日的你会用最利落的方式施展魔法。',
  },
  'bumble-honey-orange-coffee': {
    pairing: '蜂蜜海绵蛋糕 / 糖渍橙片黑巧',
    tastingWindow: '先定格三层蜂纹渐变，拌匀焦糖蜂蜜与橙汁后趁冰爽畅饮',
    fortune: '明亮的色彩总能点亮情绪，愿今日满载维 C 般的明快活力！',
  },
  'eisbock-thick-milk-dirty': {
    pairing: '原味提拉米苏 / 手指海绵饼干',
    tastingWindow: '黄金 60 秒内严禁搅拌，三大口感受从炙热浓咖到冰甜厚乳的渐变',
    fortune: '浓缩沉淀后的厚重质感，总能带来无可替代的高光时刻。',
  },
  'peach-oolong-shaken-coffee': {
    pairing: '白桃大福 / 茉莉轻乳酪蛋糕',
    tastingWindow: '贴杯直饮不要插吸管，同时品尝绵密雪沫与清甜白桃乌龙',
    fortune: '轻盈自在也能香气四溢，今天适合带着微风去迎接新灵感。',
  },
  'saigon-ca-phe-sua-da': {
    pairing: '越式焦糖布丁 / 椰丝酥脆法棍',
    tastingWindow: '拌匀炼乳倾入满杯冰块，听着冰块清脆碰撞声大口提神畅饮',
    fortune: '慢滴三分钟换来一整天的满格能量，耐心终会酿出浓甜！',
  },
  'brazil-yellow-bourbon-moka': {
    pairing: '枫糖核桃派 / 牛奶巧克力玛芬',
    tastingWindow: '离火冷却后趁热 68°C 纯饮，或兑等量热鲜奶化身复古焦糖欧蕾',
    fortune: '金黄硕果源于脚踏实地的日晒雨露，今日稳扎稳打必有回甘。',
  },
  'tanzania-peaberry-clever': {
    pairing: '黑加仑果酱司康 / 橙香玛德琳',
    tastingWindow: '放流完毕略温至 58°C，雪山 PB 圆豆的黑醋栗与柑橘蜜感最饱满',
    fortune: '把全部养分凝聚于一处，独一无二的你自会闪耀出众光芒。',
  },
}

export function getDailyFeaturedIndex(total: number): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
  return total > 0 ? dayOfYear % total : 0
}
