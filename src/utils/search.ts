import type { AppView, AtlasSection, CoffeeExhibit } from '../types/coffee'

export interface MuseumShortcutItem {
  id: string
  kind: 'hall' | 'atlas'
  title: string
  subtitle: string
  keywords: string[]
  view: AppView
  atlasSection?: AtlasSection
}

export const MUSEUM_SHORTCUT_ITEMS: MuseumShortcutItem[] = [
  {
    id: 'hall-curator',
    kind: 'hall',
    title: '风味策展台',
    subtitle: '情境点单 · 四维风味滑块与今日盲盒',
    keywords: ['首页', '策展', '推荐', '盲盒', '滑块', 'curator'],
    view: 'curator',
  },
  {
    id: 'hall-gallery',
    kind: 'hall',
    title: '世界咖啡馆藏展厅',
    subtitle: '52 款永久馆藏检索、筛选与双豆对比',
    keywords: ['展厅', '全部', '清单', '对比', 'gallery'],
    view: 'gallery',
  },
  {
    id: 'hall-studio',
    kind: 'hall',
    title: '沉浸式冲煮工坊',
    subtitle: '14 种动态器具实时计时、虚拟秤重与语音播报',
    keywords: ['冲煮', '计时器', '手冲', '拉花', 'studio', 'brew'],
    view: 'studio',
  },
  {
    id: 'atlas-map',
    kind: 'atlas',
    title: '世界咖啡种植带地图',
    subtitle: '风味博物 · 探索全球产区海拔与风土签名',
    keywords: ['地图', '产区', '咖啡带', 'map', 'origin', 'atlas'],
    view: 'atlas',
    atlasSection: 'map',
  },
  {
    id: 'atlas-wheel',
    kind: 'atlas',
    title: '交互式风味轮与粉水比计算器',
    subtitle: '风味博物 · 六大香气家族与手冲/冷萃/意式比例换算',
    keywords: ['风味轮', '计算器', '粉水比', '咖啡因', 'wheel', 'ratio'],
    view: 'atlas',
    atlasSection: 'wheel',
  },
  {
    id: 'atlas-craft',
    kind: 'atlas',
    title: '烘焙度曲线与处理法图鉴',
    subtitle: '风味博物 · 浅烘到深烘演变及水洗/日晒/蜜处理对比',
    keywords: ['烘焙', '处理法', '水洗', '日晒', '蜜处理', 'roast', 'process'],
    view: 'atlas',
    atlasSection: 'craft',
  },
  {
    id: 'atlas-troubleshoot',
    kind: 'atlas',
    title: '冲煮翻车诊断室',
    subtitle: '风味博物 · 过酸/过苦/水感/通道效应一键排错',
    keywords: ['翻车', '诊断', '苦涩', '太酸', '排错', 'troubleshoot'],
    view: 'atlas',
    atlasSection: 'troubleshoot',
  },
  {
    id: 'atlas-quiz',
    kind: 'atlas',
    title: '馆长快问快答挑战',
    subtitle: '风味博物 · 精品咖啡知识问答解锁学者徽章',
    keywords: ['问答', '挑战', '测验', '徽章', 'quiz', 'trivia'],
    view: 'atlas',
    atlasSection: 'quiz',
  },
  {
    id: 'hall-archive',
    kind: 'hall',
    title: '我的个人品鉴馆藏',
    subtitle: '个人风味画像、想喝清单、明信片导出与 JSON 备份',
    keywords: ['馆藏', '记录', '明信片', '备份', '想喝', 'archive'],
    view: 'archive',
  },
]

export interface QuickSearchResult {
  exhibits: CoffeeExhibit[]
  shortcuts: MuseumShortcutItem[]
}

const SEARCH_SYNONYMS: Record<string, string[]> = {
  艺伎: ['瑰夏', 'geisha'],
  瑰夏: ['艺伎', 'geisha'],
  脏咖: ['dirty'],
  dirty: ['脏咖'],
  澳白: ['flat white', '馥芮白'],
  馥芮白: ['澳白', 'flat white'],
  冷萃: ['cold brew', '冰滴'],
  浓缩: ['espresso'],
  拿铁: ['latte'],
  抹茶: ['matcha'],
  蛋咖: ['蛋咖啡', 'phin'],
  百花蜜: ['蜜处理', '野蜜', '普洱'],
  浅中烘: ['中浅烘'],
  浅中烘焙: ['中浅烘', '浅中烘焙'],
  花魁: ['hambela', '古吉'],
  鸳鸯: ['yuanyang', '港式'],
  青提: ['muscat', '葡萄'],
  汤力: ['tonic'],
  玛奇朵: ['macchiato'],
  莫扎特: ['mozart', '葡萄干蜜', '音乐家'],
  天堂庄园: ['el paraiso', '荔枝兰'],
  可纳: ['kona', '夏威夷'],
  夏威夷: ['kona', '可纳'],
  开心果: ['pistachio', '西西里'],
  magic: ['魔法', '墨尔本'],
  魔法: ['magic', '墨尔本'],
  大黄蜂: ['bumble', '蜂蜜橙'],
  bumble: ['大黄蜂', '蜂蜜橙'],
  冰博克: ['eisbock', '厚乳'],
  白桃乌龙: ['peach oolong', '冰摇'],
  炼乳: ['sua da', '西贡', '越南'],
  西贡: ['saigon', '越南', '炼乳'],
  黄波旁: ['yellow bourbon', '巴西'],
  圆豆: ['peaberry', 'pb', '乞力马扎罗', '坦桑尼亚'],
  乞力马扎罗: ['kilimanjaro', '坦桑尼亚', '圆豆'],
  黑糖: ['brown sugar', '肉桂'],
}

function expandTokenAliases(token: string): string[] {
  const aliases = SEARCH_SYNONYMS[token]
  return aliases ? [token, ...aliases] : [token]
}

export function searchMuseumCatalog(
  query: string,
  exhibits: readonly CoffeeExhibit[],
  limit = 8
): QuickSearchResult {
  const q = query.trim().toLowerCase()
  if (!q) {
    return {
      exhibits: exhibits.slice(0, 6),
      shortcuts: MUSEUM_SHORTCUT_ITEMS,
    }
  }

  const tokens = q.split(/\s+/).filter(Boolean)

  const scoredExhibits = exhibits
    .map((coffee) => {
      const name = coffee.name.toLowerCase()
      const en = coffee.englishName.toLowerCase()
      const no = coffee.exhibitNo.toLowerCase()
      const origin = coffee.origin.toLowerCase()
      const method = coffee.methodLabel.toLowerCase()
      const category = coffee.category.toLowerCase()
      const roast = coffee.roast.toLowerCase()
      const process = coffee.process.toLowerCase()
      const notes = coffee.flavorNotes.join(' ').toLowerCase()
      const subtitle = coffee.subtitle.toLowerCase()
      const haystack = `${name} ${en} ${no} ${origin} ${method} ${category} ${roast} ${process} ${notes} ${subtitle}`

      if (
        !tokens.every((t) =>
          expandTokenAliases(t).some((alias) => haystack.includes(alias))
        )
      ) {
        return { coffee, score: 0 }
      }

      let score = 10
      for (const token of tokens) {
        const aliases = expandTokenAliases(token)
        if (no === token || name.startsWith(token)) score += 65
        else if (name.includes(token)) score += 48
        else if (aliases.some((term) => name.includes(term))) score += 32

        if (en.includes(token)) score += 28
        else if (aliases.some((term) => en.includes(term))) score += 18

        if (notes.includes(token)) score += 26
        else if (aliases.some((term) => notes.includes(term))) score += 14

        if (origin.includes(token)) score += 22
        else if (aliases.some((term) => origin.includes(term))) score += 12

        if (method.includes(token)) score += 20
        if (process.includes(token) || roast.includes(token)) score += 16
        else if (aliases.some((term) => process.includes(term) || roast.includes(term))) score += 10
      }
      return { coffee, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.coffee)

  const matchedShortcuts = MUSEUM_SHORTCUT_ITEMS.filter((item) => {
    const haystack = `${item.title} ${item.subtitle} ${item.keywords.join(' ')}`.toLowerCase()
    return tokens.every((t) =>
      expandTokenAliases(t).some((alias) => haystack.includes(alias))
    )
  })

  return {
    exhibits: scoredExhibits,
    shortcuts: matchedShortcuts,
  }
}
