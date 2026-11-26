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
}

export function getDailyFeaturedIndex(total: number): number {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
  return total > 0 ? dayOfYear % total : 0
}
