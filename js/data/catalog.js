/* ============================================================================
   PHANTOM ONLINE — CATALOG DATA (CMS)
   ----------------------------------------------------------------------------
   Это "база" каталога. Все продукты динамически редактируются либо здесь,
   либо через страницу Админ (cms.html), которая сохраняет правки в localStorage.

   СТРУКТУРА ТОВАРА (product):
   {
     id: "merc-vapor-1",            // уникальный
     name: "Nike Mercurial Vapor 16",
     brand: "Nike",
     category: "boots" | "analogue" | "jersey" | "retro" | "training" | "shorts" | "socks" | "accessories" | "gk" | "balls" | "street",
     subcategory: "SPEED BOOTS" | "CONTROL BOOTS" | ...,
     productType: "Speed boots" | "Home shirt" | ...,
     league: "premier-league" | "la-liga" | ... | null,   // только для футболок/шорт
     club: "Manchester United" | ... | null,
     season: "2025/26" | null,
     kind: "player" | "fan" | "long-sleeve" | null,        // только футболки
     price: 89900,
     oldPrice: 109900 | null,
     discount: 18 | null,
     sizes: ["EU 39","EU 40",...] | ["S","M","L",...],
     surface: ["FG","AG"] | null,                          // только обувь
     level: "ELITE" | "PRO" | "ACADEMY" | "ENTRY" | null,
     playerProfile: "Speed / Attack" | null,
     material: "..." | null,
     weight: "185 г" | null,
     fit: "Тесная" | "Комфортная" | null,
     upper: "..." | null,           // верх обуви
     soleplate: "..." | null,       // подошва обуви
     generation: "2025" | null,
     purpose: "Match" | "Training" | ... | null,
     description: "...",
     image: "emoji" | null,          // плейсхолдер-иконка (без внешних картинок)
     featured: true|false,
     bestseller: true|false,
     isNew: true|false,
     sale: true|false,
     stock: 15,
     collection: "speed"|"control"|"agility"|"matchday"|"training"|"street"|null
   }

   Правки в localStorage (admin-страница) перекрывают значения ниже.
   ============================================================================ */

const DEFAULT_CATALOG = [
  /* ─────────────────────────── БУТСЫ · SPEED ─────────────────────────── */
  {
    id: "nike-merc-vapor", name: "Nike Mercurial Vapor 16", brand: "Nike",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 98900, oldPrice: 119900, discount: 18, sizes: ["EU 40","EU 40.5","EU 41","EU 42","EU 42.5","EU 43","EU 44","EU 45"],
    surface: ["FG"], level: "ELITE", playerProfile: "Speed / Attack",
    material: "Flyknit", weight: "188 г", fit: "Тесная / гоночная",
    upper: "Vaporposite легчайший сетчатый верх", soleplate: "CarbonFiber карбоновая пластина", generation: "2025",
    description: "Силуэт главного ускорителя. Гоночная посадка, максимальная отдача на шаге. Создан для фланговых атак и рывков на скорости — идеален для вингеров и нападающих.",
    image: "⚡", featured: true, bestseller: true, isNew: true, sale: true, stock: 12, collection: "speed"
  },
  {
    id: "nike-merc-superfly", name: "Nike Mercurial Superfly 10", brand: "Nike",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 142900, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG"], level: "ELITE", playerProfile: "Speed / Attack",
    material: "Flyknit высокая посадка", weight: "225 г", fit: "Фиксация с голеностопом",
    upper: "Vaporposite 3.0", soleplate: "Aerotrack", generation: "2025",
    description: "Флагманская версия Mercurial с высокой посадкой и тотальной фиксацией. Лёгкая конструкция и агрессивная геометрия для взрывных стартов.",
    image: "🚀", featured: true, isNew: true, stock: 8, collection: "speed"
  },
  {
    id: "adidas-f50", name: "adidas F50 Elite", brand: "adidas",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 124900, oldPrice: 139900, discount: 11, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG"], level: "ELITE", playerProfile: "Speed / Acceleration",
    material: "Сетка с покрытием", weight: "205 г", fit: "Средняя",
    upper: "HybridTouch", soleplate: "SprintFrame 360", generation: "2024",
    description: "Скоростная серия с низкопрофильной подошвой для мгновенного ускорения. Лёгкий верх с точным контролем на высокой скорости.",
    image: "🏃", featured: true, bestseller: true, stock: 15, collection: "speed"
  },
  {
    id: "puma-ultra", name: "Puma Ultra Ultimate", brand: "Puma",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 94900, oldPrice: 110000, discount: 14, sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG"], level: "PRO", playerProfile: "Speed / Lightweight",
    material: "UTHC лёгкий верх", weight: "195 г", fit: "Тесная",
    upper: "ULTRAWEAVE", soleplate: "SpeedUnit", generation: "2024",
    description: "Одна из самых лёгких моделей на рынке. Ультралёгкая конструкция для постоянного давления на оборону и максимальной скорости.",
    image: "💨", isNew: true, stock: 10, collection: "speed"
  },

  /* ─────────────────────────── БУТСЫ · CONTROL ───────────────────────── */
  {
    id: "nike-phantom", name: "Nike Phantom GX Elite", brand: "Nike",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control boots",
    price: 132900, oldPrice: 149900, discount: 11, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG","AG"], level: "ELITE", playerProfile: "Control / Passing / Finishing",
    material: "Flyknit", weight: "240 г", fit: "Комфортная",
    upper: "FlyTouch для приёма мяча", soleplate: "Nike GX", generation: "2025",
    description: "Плеймейкерская классика. Разработана для точного паса, чистого приёма и завершения. Максимальная зона касания для творчества в центре поля.",
    image: "🎯", featured: true, bestseller: true, isNew: true, stock: 9, collection: "control"
  },
  {
    id: "adidas-predator", name: "adidas Predator Elite", brand: "adidas",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control boots",
    price: 129900, sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG","AG"], level: "ELITE", playerProfile: "Ball control / Finishing",
    material: "Кожа HybridTouch", weight: "250 г", fit: "Комфортная",
    upper: "HybridTouch с рифлением", soleplate: "ControlFrame", generation: "2025",
    description: "Легендарная линия с усиленными зонами для удара и контроля. Демонический топспин и уверенный приём даже под давлением.",
    image: "👑", featured: true, bestseller: true, stock: 14, collection: "control"
  },
  {
    id: "puma-future", name: "Puma Future 7 Ultimate", brand: "Puma",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control / Agility boots",
    price: 99900, oldPrice: 115000, discount: 13, sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG","AG"], level: "ELITE", playerProfile: "Dribbling / Agility",
    material: "Сетчатый верх", weight: "230 г", fit: "Адаптивная",
    upper: "FUZIONFIT адаптивная посадка", soleplate: "RUBCAGE + Dynamic Motion", generation: "2025",
    description: "Создана для дриблинга: эластичная зона на бинтах даёт свободу и контроль. Идеальна для техничных игроков, обыгрывающих один в один.",
    image: "🪄", isNew: true, stock: 11, collection: "agility"
  },

  /* ──────────────────── БУТСЫ · доступные уровни / поверхности ───────── */
  {
    id: "nike-phantom-pro", name: "Nike Phantom GX Pro", brand: "Nike",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control boots",
    price: 82900, oldPrice: 90900, discount: 9, sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG","AG"], level: "PRO", playerProfile: "Control / Passing",
    material: "Микроволокно", weight: "252 г", fit: "Комфортная",
    upper: "Synthetic", soleplate: "GX", generation: "2024",
    description: "Продвинутая версия Phantom с проверенной накладкой для контроля. Оптимальный баланс цены и характеристик.",
    image: "🎯", stock: 16
  },
  {
    id: "adidas-f50-academy", name: "adidas F50 Academy", brand: "adidas",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 52900, oldPrice: 59900, discount: 12, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG","AG","TF"], level: "ACADEMY", playerProfile: "Speed",
    material: "Синтетика", weight: "265 г", fit: "Средняя",
    upper: "Synthetic", soleplate: "Multi-surface", generation: "2024",
    description: "Доступная скоростная модель для серьёзных игроков. Проверенная геометрия F50 на повседневном уровне.",
    image: "🏃", sale: true, stock: 20
  },
  {
    id: "puma-ultra-club", name: "Puma Ultra Play", brand: "Puma",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 32900, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43"],
    surface: ["TF","IC"], level: "ENTRY", playerProfile: "Speed / Training",
    material: "Синтетика", weight: "270 г", fit: "Средняя",
    upper: "Synthetic", soleplate: "Multi", generation: "2024",
    description: "Бюджетная стартовая модель с узнаваемым силуэтом Ultra. Подходит для тренировок и любительских игр.",
    image: "💨", stock: 24
  },
  {
    id: "nike-tiempo-lite", name: "Nike Tiempo Legend Lite", brand: "Nike",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control boots",
    price: 45900, oldPrice: 52900, discount: 13, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43"],
    surface: ["FG","AG"], level: "ACADEMY", playerProfile: "Control / Comfort",
    material: "Синтетическая кожа", weight: "258 г", fit: "Комфортная",
    upper: "Soft synthetic", soleplate: "Multi", generation: "2023",
    description: "Доступная классика с мягким верхом и комфортной посадкой для контроля мяча.",
    image: "🎯", stock: 18
  },
  {
    id: "adidas-copa-pure", name: "adidas Copa Pure Club", brand: "adidas",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control boots",
    price: 39900, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43"],
    surface: ["TF","FG"], level: "ENTRY", playerProfile: "Control / Comfort",
    material: "Синтетика", weight: "268 г", fit: "Комфортная",
    upper: "Synthetic", soleplate: "Multi", generation: "2024",
    description: "Бюджетная версия знаменитой линии Copa. Мягкий комфорт и контроль на тренировках.",
    image: "👑", stock: 22
  },

  /* ─────────────────────────── АНАЛОГИ ─────────────────────────── */
  {
    id: "analog-speed-1", name: "Phantom Speed Strike", brand: "PHANTOM",
    category: "analogue", subcategory: "Speed alternatives", productType: "Speed boots",
    price: 27900, oldPrice: 34900, discount: 20, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG","AG"], level: "ACADEMY", playerProfile: "Speed alternative",
    material: "Синтетика", weight: "240 г", fit: "Тесная",
    upper: "Synthetic low cut", soleplate: "Speed plate", generation: "2025",
    description: "Доступная альтернатива с силуэтом, вдохновлённым топовыми скоростными моделями. Похожий силуэт для скорости без большого бюджета.",
    image: "⚡", featured: true, bestseller: true, isNew: true, sale: true, stock: 30, collection: "speed"
  },
  {
    id: "analog-control-1", name: "Phantom Touch Control", brand: "PHANTOM",
    category: "analogue", subcategory: "Control alternatives", productType: "Control boots",
    price: 29900, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG","AG"], level: "ACADEMY", playerProfile: "Control alternative",
    material: "Синтетика", weight: "245 г", fit: "Комфортная",
    upper: "Textured synthetic", soleplate: "Control plate", generation: "2025",
    description: "Доступная альтернатива для контроля мяча. Похожий силуэт классических моделей с акцентом на касание и приём.",
    image: "🎯", featured: true, bestseller: true, stock: 26, collection: "control"
  },
  {
    id: "analog-lightweight-1", name: "Phantom Feather Lite", brand: "PHANTOM",
    category: "analogue", subcategory: "Lightweight alternatives", productType: "Speed boots",
    price: 26900, oldPrice: 32900, discount: 18, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43"],
    surface: ["FG"], level: "ACADEMY", playerProfile: "Lightweight alternative",
    material: "Сетка", weight: "225 г", fit: "Тесная",
    upper: "Mesh upper", soleplate: "Light plate", generation: "2025",
    description: "Максимально лёгкая доступная альтернатива для скорости. Похожий силуэт при минимальном весе.",
    image: "💨", isNew: true, stock: 18
  },
  {
    id: "analog-ag-1", name: "Phantom AG Ready", brand: "PHANTOM",
    category: "analogue", subcategory: "Artificial grass alternatives", productType: "AG boots",
    price: 24900, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["AG","TF"], level: "ENTRY", playerProfile: "Artificial grass",
    material: "Синтетика", weight: "250 г", fit: "Средняя",
    upper: "Durable synthetic", soleplate: "AG studs", generation: "2025",
    description: "Доступная альтернатива для искусственного поля. Усиленная подошва для AG и долгих тренировок.",
    image: "🌱", stock: 28
  },
  {
    id: "analog-tf-1", name: "Phantom Turf Master", brand: "PHANTOM",
    category: "analogue", subcategory: "Turf alternatives", productType: "TF boots",
    price: 21900, oldPrice: 25900, discount: 15, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43"],
    surface: ["TF"], level: "ENTRY", playerProfile: "Turf",
    material: "Синтетика", weight: "255 г", fit: "Средняя",
    upper: "Synthetic", soleplate: "Turf rubber", generation: "2025",
    description: "Доступный вариант для турф-покрытия с короткими резиновыми шипами. Универсальность для городских коробок.",
    image: "🧱", stock: 25
  },
  {
    id: "analog-ic-1", name: "Phantom Indoor Court", brand: "PHANTOM",
    category: "analogue", subcategory: "Indoor alternatives", productType: "Indoor shoes",
    price: 19900, sizes: ["EU 38","EU 39","EU 40","EU 41","EU 42","EU 43"],
    surface: ["IC"], level: "ENTRY", playerProfile: "Indoor",
    material: "Синтетика", weight: "240 г", fit: "Средняя",
    upper: "Synthetic", soleplate: "Flat rubber", generation: "2025",
    description: "Доступная альтернатива для индор и футзала. Плоская подошва с отличным сцеплением на твёрдых покрытиях.",
    image: "🏟", stock: 32
  },

  /* ─────────────────────────── ФУТБОЛКИ · ПРЕМЬЕР-ЛИГА ─────────────── */
  {
    id: "jrs-manutd-home", name: "Футболка Manchester United 2025/26", brand: "adidas",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Home shirt", league: "premier-league", club: "Manchester United",
    season: "2025/26", kind: "fan", price: 11900, oldPrice: 14900, discount: 20,
    sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell полиэстер", fit: "Регулярный",
    description: "Домашняя футболка Манчестер Юнайтед сезона 2025/26. Легендарный красный цвет и белые акценты. Версия для болельщиков.",
    image: "🔴", featured: true, bestseller: true, isNew: true, sale: true, stock: 40, collection: "matchday"
  },
  {
    id: "jrs-liv-home", name: "Футболка Liverpool 2025/26", brand: "Nike",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Home shirt", league: "premier-league", club: "Liverpool",
    season: "2025/26", kind: "fan", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT полиэстер", fit: "Регулярный",
    description: "Домашняя футболка Ливерпуля. Классический красный с деталями в стиле The Kop. Версия для болельщиков.",
    image: "❤", featured: true, bestseller: true, stock: 38, collection: "matchday"
  },
  {
    id: "jrs-mancity-home", name: "Футболка Manchester City 2025/26", brand: "Puma",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Home shirt", league: "premier-league", club: "Manchester City",
    season: "2025/26", kind: "fan", price: 11500, sizes: ["S","M","L","XL","XXL"], material: "dryCELL полиэстер", fit: "Регулярный",
    description: "Домашняя футболка Ман Сити. Голубой цвет небес и фирменные детали. Версия для болельщиков.",
    image: "🔵", featured: true, stock: 35, collection: "matchday"
  },
  {
    id: "jrs-arsenal-home", name: "Футболка Arsenal 2025/26", brand: "adidas",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Home shirt", league: "premier-league", club: "Arsenal",
    season: "2025/26", kind: "fan", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell полиэстер", fit: "Регулярный",
    description: "Домашняя футболка Арсенала. Красный фирменный цвет с белыми рукавами. Версия для болельщиков.",
    image: "🔺", bestseller: true, stock: 30, collection: "matchday"
  },
  {
    id: "jrs-chelsea-home", name: "Футболка Chelsea 2025/26", brand: "Nike",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Home shirt", league: "premier-league", club: "Chelsea",
    season: "2025/26", kind: "fan", price: 11500, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Регулярный",
    description: "Домашняя футболка Челси. Королевский синий с фирменными деталями Stamford Bridge.",
    image: "🔷", stock: 22
  },
  {
    id: "jrs-spurs-home", name: "Футболка Tottenham Hotspur 2025/26", brand: "Nike",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Home shirt", league: "premier-league", club: "Tottenham Hotspur",
    season: "2025/26", kind: "fan", price: 11500, oldPrice: 13900, discount: 17, sizes: ["S","M","L","XL"], material: "Dri-FIT", fit: "Регулярный",
    description: "Домашняя футболка Тоттенхэма — классический белый с синими акцентами. Версия для болельщиков.",
    image: "⚪", stock: 18
  },
  {
    id: "jrs-newcastle-home", name: "Футболка Newcastle United 2025/26", brand: "adidas",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Home shirt", league: "premier-league", club: "Newcastle United",
    season: "2025/26", kind: "fan", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Регулярный",
    description: "Домашняя футболка Ньюкасла — чёрно-белые полосы St. James' Park. Версия для болельщиков.",
    image: "⚫", stock: 16
  },
  {
    id: "jrs-astonvilla-home", name: "Футболка Aston Villa 2025/26", brand: "adidas",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Home shirt", league: "premier-league", club: "Aston Villa",
    season: "2025/26", kind: "fan", price: 11900, sizes: ["S","M","L","XL"], material: "Dry-Cell", fit: "Регулярный",
    description: "Домашняя футболка Астон Виллы в клaret-and-blue фирменной гамме. Версия для болельщиков.",
    image: "🔶", isNew: true, stock: 14
  },

  /* ──────── ФУТБОЛКИ · ЛА ЛИГА ──────── */
  {
    id: "jrs-realmadrid-home", name: "Футболка Real Madrid 2025/26", brand: "adidas",
    category: "jersey", subcategory: "LA LIGA", productType: "Home shirt", league: "la-liga", club: "Real Madrid",
    season: "2025/26", kind: "fan", price: 11900, oldPrice: 14500, discount: 18,
    sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Регулярный",
    description: "Домашняя футболка мадридского «Реала» — легендарный белый цвет Santiago Bernabéu. Версия для болельщиков.",
    image: "🤍", featured: true, bestseller: true, sale: true, stock: 42, collection: "matchday"
  },
  {
    id: "jrs-barcelona-home", name: "Футболка Barcelona 2025/26", brand: "Nike",
    category: "jersey", subcategory: "LA LIGA", productType: "Home shirt", league: "la-liga", club: "Barcelona",
    season: "2025/26", kind: "fan", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Регулярный",
    description: "Домашняя футболка «Барселоны» — блауграна с сеньерскими полосами Camp Nou. Версия для болельщиков.",
    image: "🔵", featured: true, bestseller: true, stock: 40, collection: "matchday"
  },
  {
    id: "jrs-atletico-home", name: "Футболка Atlético Madrid 2025/26", brand: "Nike",
    category: "jersey", subcategory: "LA LIGA", productType: "Home shirt", league: "la-liga", club: "Atlético Madrid",
    season: "2025/26", kind: "fan", price: 11500, sizes: ["S","M","L","XL"], material: "Dri-FIT", fit: "Регулярный",
    description: "Полосатая красно-белая домашняя футболка «Атлетико». Версия для болельщиков.",
    image: "🔴", stock: 20
  },

  /* ──────── ФУТБОЛКИ · СЕРИЯ А ──────── */
  {
    id: "jrs-inter-home", name: "Футболка Inter 2025/26", brand: "Nike",
    category: "jersey", subcategory: "SERIE A", productType: "Home shirt", league: "serie-a", club: "Inter",
    season: "2025/26", kind: "fan", price: 11500, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Регулярный",
    description: "Домашняя футболка «Интера» — чёрно-синие полосы San Siro. Версия для болельщиков.",
    image: "🟦", stock: 24
  },
  {
    id: "jrs-amilan-home", name: "Футболка AC Milan 2025/26", brand: "Puma",
    category: "jersey", subcategory: "SERIE A", productType: "Home shirt", league: "serie-a", club: "AC Milan",
    season: "2025/26", kind: "fan", price: 11500, oldPrice: 13500, discount: 15, sizes: ["S","M","L","XL","XXL"], material: "dryCELL", fit: "Регулярный",
    description: "Домашняя футболка «Милана» — красно-чёрные полосы. Версия для болельщиков.",
    image: "⚫", bestseller: true, stock: 28
  },
  {
    id: "jrs-juventus-home", name: "Футболка Juventus 2025/26", brand: "adidas",
    category: "jersey", subcategory: "SERIE A", productType: "Home shirt", league: "serie-a", club: "Juventus",
    season: "2025/26", kind: "fan", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Регулярный",
    description: "Домашняя футболка «Ювентуса» — классические чёрно-белые полосы Allianz Stadium. Версия для болельщиков.",
    image: "⬛", stock: 21
  },
  {
    id: "jrs-napoli-home", name: "Футболка Napoli 2025/26", brand: "EA7 / adidas",
    category: "jersey", subcategory: "SERIE A", productType: "Home shirt", league: "serie-a", club: "Napoli",
    season: "2025/26", kind: "fan", price: 11500, sizes: ["S","M","L","XL"], material: "Dry-Cell", fit: "Регулярный",
    description: "Домашняя футболка «Наполи» в фирменном небесно-голубом цвете. Версия для болельщиков.",
    image: "🔷", isNew: true, stock: 17
  },

  /* ──────── ФУТБОЛКИ · БУНДЕСЛИГА ──────── */
  {
    id: "jrs-bayern-home", name: "Футболка Bayern Munich 2025/26", brand: "adidas",
    category: "jersey", subcategory: "BUNDESLIGA", productType: "Home shirt", league: "bundesliga", club: "Bayern Munich",
    season: "2025/26", kind: "fan", price: 11900, oldPrice: 13900, discount: 14, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Регулярный",
    description: "Домашняя футболка «Баварии» — белый с красными акцентами Allianz Arena. Версия для болельщиков.",
    image: "⚪", featured: true, stock: 26
  },
  {
    id: "jrs-dortmund-home", name: "Футболка Borussia Dortmund 2025/26", brand: "Puma",
    category: "jersey", subcategory: "BUNDESLIGA", productType: "Home shirt", league: "bundesliga", club: "Borussia Dortmund",
    season: "2025/26", kind: "fan", price: 11500, sizes: ["S","M","L","XL","XXL"], material: "dryCELL", fit: "Регулярный",
    description: "Домашняя футболка «Боруссии» в жёлто-чёрной гамме Signal Iduna Park. Версия для болельщиков.",
    image: "🟨", stock: 19
  },

  /* ──────── ФУТБОЛКИ · ЛИГА 1 ──────── */
  {
    id: "jrs-psg-home", name: "Футболка PSG 2025/26", brand: "Nike",
    category: "jersey", subcategory: "LIGUE 1", productType: "Home shirt", league: "ligue-1", club: "Paris Saint-Germain",
    season: "2025/26", kind: "fan", price: 11900, oldPrice: 14500, discount: 18, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Регулярный",
    description: "Домашняя футболка ПСЖ — тёмно-синий цвет с красным кантом Parc des Princes. Версия для болельщиков.",
    image: "🟦", featured: true, bestseller: true, sale: true, stock: 33, collection: "matchday"
  },
  {
    id: "jrs-om-home", name: "Футболка Marseille 2025/26", brand: "Puma",
    category: "jersey", subcategory: "LIGUE 1", productType: "Home shirt", league: "ligue-1", club: "Marseille",
    season: "2025/26", kind: "fan", price: 11500, sizes: ["S","M","L","XL"], material: "dryCELL", fit: "Регулярный",
    description: "Домашняя футболка «Марселя» — бело-голубая гамма Vélodrome. Версия для болельщиков.",
    image: "🔵", stock: 15
  },

  /* ─────────────────────────── RETRO ─────────────────────────── */
  {
    id: "retro-mu-90s", name: "Retro Manchester United 1999", brand: "PHANTOM Retro",
    category: "retro", subcategory: "Classic club shirts", productType: "Retro shirt", league: "premier-league", club: "Manchester United",
    season: "1998/99", kind: "fan", price: 9900, oldPrice: 12900, discount: 23,
    sizes: ["S","M","L","XL","XXL"], material: "Полиэстер, винтажная фактура", fit: "Свободный оверсайз",
    description: "Винтажная футболка в духе эпохи трипла. Вдохновлена легендарным сезоном, ретро-силуэт и ностальгическая фактура.",
    image: "📼", featured: true, bestseller: true, sale: true, stock: 12
  },
  {
    id: "retro-brasil-2002", name: "Retro Brazil National 2002", brand: "PHANTOM Retro",
    category: "retro", subcategory: "Classic national team shirts", productType: "Retro shirt", league: null, club: "Brazil",
    season: "2002", kind: "fan", price: 10900, sizes: ["S","M","L","XL","XXL"], material: "Полиэстер", fit: "Оверсайз",
    description: "Классическая жёлтая футболка сборной Бразилии в ретро-стиле. Ностальгия по футбольному искусству нулевых.",
    image: "🟡", featured: true, stock: 14
  },
  {
    id: "retro-jacket-80s", name: "Retro Football Jacket 80s", brand: "PHANTOM Retro",
    category: "retro", subcategory: "Retro football jackets", productType: "Retro jacket", league: null, club: null,
    price: 13900, oldPrice: 16900, discount: 18, sizes: ["S","M","L","XL"], material: "Полиэстер, кант", fit: "Оверсайз",
    description: "Ретро-куртка в стиле восьмидесятых — контрастные рукава и спортивный силуэт. Premium ностальгия.",
    image: "🧥", stock: 9
  },
  {
    id: "retro-trainer-jkt", name: "Retro Training Jacket", brand: "PHANTOM Retro",
    category: "retro", subcategory: "Retro training jackets", productType: "Retro jacket", league: null, club: null,
    price: 12900, sizes: ["S","M","L","XL","XXL"], material: "Полиэстер", fit: "Свободный",
    description: "Ретро-тренировочная куртка с крупной строчкой. Урбанистичный премиальный винтаж.",
    image: "🎽", stock: 11
  },
  {
    id: "retro-germany-90", name: "Retro Germany 1990", brand: "PHANTOM Retro",
    category: "retro", subcategory: "Classic national team shirts", productType: "Retro shirt", league: null, club: "Germany",
    season: "1990", kind: "fan", price: 10900, sizes: ["S","M","L","XL","XXL"], material: "Полиэстер", fit: "Оверсайз",
    description: "Классическая белая футболка сборной Германии с reтро-чёрными деталями. Легенда Берлина.",
    image: "⚪", stock: 10
  },

  /* ─────────────────────────── ТРЕНИРОВОЧНАЯ ОДЕЖДА ─────────────── */
  {
    id: "tr-manutd-jacket", name: "Тренировочная куртка Man United 2025/26", brand: "adidas",
    category: "training", subcategory: "Training jackets", productType: "Training jacket", league: "premier-league", club: "Manchester United",
    season: "2025/26", price: 15900, oldPrice: 18900, discount: 16, sizes: ["S","M","L","XL","XXL"],
    material: "Dry-Cell полиэстер", fit: "Спортивная",
    description: "Легкая тренировочная куртка с зиппером и боковыми карманами. Для предматчевых разминок и повседневного спорта.",
    image: "🧥", featured: true, bestseller: true, sale: true, stock: 20, collection: "training"
  },
  {
    id: "tr-liv-tracksuit", name: "Тренировочный костюм Liverpool 2025/26", brand: "Nike",
    category: "training", subcategory: "Tracksuits", productType: "Tracksuit", league: "premier-league", club: "Liverpool",
    season: "2025/26", price: 23900, oldPrice: 27900, discount: 14, sizes: ["M","L","XL","XXL"],
    material: "Dri-FIT", fit: "Спортивная",
    description: "Полный тренировочный комплект — куртка и брюки. Фирменные детали клуба и дышащая ткань.",
    image: "👔", featured: true, stock: 12, collection: "training"
  },
  {
    id: "tr-hoodie-phantom", name: "Hoodie PHANTOM Signature", brand: "PHANTOM",
    category: "training", subcategory: "Hoodies", productType: "Hoodie", league: null, club: null,
    price: 13900, oldPrice: 16900, discount: 18, sizes: ["S","M","L","XL","XXL"], material: "Футер с начёсом", fit: "Оверсайз",
    description: "Брендированный худи PHANTOM ONLINE с вышитым логотипом. Плотный футер для тренировок и города.",
    image: "🧢", isNew: true, stock: 26
  },
  {
    id: "tr-windbreaker", name: "Windbreaker PHANTOM", brand: "PHANTOM",
    category: "training", subcategory: "Windbreakers", productType: "Windbreaker", league: null, club: null,
    price: 12900, sizes: ["S","M","L","XL","XXL"], material: "Полиэстер, мембрана", fit: "Спортивная",
    description: "Лёгкая ветровка от ветра и дождя. Compact и практичная для любой погоды.",
    image: "🌬", stock: 18
  },
  {
    id: "tr-shorts-training", name: "Тренировочные шорты PHANTOM", brand: "PHANTOM",
    category: "training", subcategory: "Training shorts", productType: "Training shorts", league: null, club: null,
    price: 6900, oldPrice: 8900, discount: 22, sizes: ["S","M","L","XL","XXL"], material: "Полиэстер", fit: "Спортивная",
    description: "Лёгкие тренировочные шорты с внутренним шнурком и карманом. Повседневный комфорт.",
    image: "🩳", sale: true, stock: 34
  },
  {
    id: "tr-pants", name: "Тренировочные штаны PHANTOM", brand: "PHANTOM",
    category: "training", subcategory: "Training pants", productType: "Training pants", league: null, club: null,
    price: 9900, sizes: ["S","M","L","XL","XXL"], material: "Футер", fit: "Комфортная",
    description: "Универсальные штаны с эластичным поясом и утяжкой. Для разминки и повседневной носки.",
    image: "👖", stock: 22
  },
  {
    id: "tr-sweatshirt", name: "Свитшот PHANTOM Crew", brand: "PHANTOM",
    category: "training", subcategory: "Sweatshirts", productType: "Sweatshirt", league: null, club: null,
    price: 11900, oldPrice: 13900, discount: 14, sizes: ["S","M","L","XL","XXL"], material: "Футер", fit: "Оверсайз",
    description: "Мягкий свитшот с набивным принтом PHANTOM. Тёплый и стильный.",
    image: "🧵", stock: 16
  },
  {
    id: "tr-top", name: "Тренировочный топ PHANTOM", brand: "PHANTOM",
    category: "training", subcategory: "Training tops", productType: "Training top", league: null, club: null,
    price: 8900, sizes: ["S","M","L","XL"], material: "Полиэстер", fit: "Спортивная",
    description: "Дышащий тренировочный топ для интенсивных нагрузок.",
    image: "🎽", stock: 20
  },

  /* ─────────────────────────── ШОРТЫ ─────────────────────────── */
  {
    id: "shorts-mu-match", name: "Матчевые шорты Man United 2025/26", brand: "adidas",
    category: "shorts", subcategory: "Match shorts", productType: "Match shorts", league: "premier-league", club: "Manchester United",
    season: "2025/26", price: 7900, oldPrice: 9900, discount: 20, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Атлетическая",
    description: "Матчевые шорты в фирменном цвете клуба. Лёгкая спортивная ткань для игры.",
    image: "🩳", featured: true, sale: true, stock: 25
  },
  {
    id: "shorts-ph-club", name: "Клубные шорты PHANTOM", brand: "PHANTOM",
    category: "shorts", subcategory: "Club shorts", productType: "Club shorts", league: null, club: null,
    price: 5900, sizes: ["S","M","L","XL","XXL"], material: "Полиэстер", fit: "Спортивная",
    description: "Универсальные клубные шорты с резинкой и карманом. Для игры и тренировок.",
    image: "🩳", stock: 30
  },
  {
    id: "shorts-casual", name: "Казуальные шорты PHANTOM", brand: "PHANTOM",
    category: "shorts", subcategory: "Casual football shorts", productType: "Casual shorts", league: null, club: null,
    price: 6900, oldPrice: 7900, discount: 13, sizes: ["S","M","L","XL","XXL"], material: "Хлопок", fit: "Свободная",
    description: "Повседневные шорты с брендом. Мягкий хлопок для отдыха и улицы.",
    image: "🩳", stock: 20
  },

  /* ─────────────────────────── НОСКИ / ГЕТРЫ ───────────────────── */
  {
    id: "socks-match", name: "Матчевые гетры PHANTOM", brand: "PHANTOM",
    category: "socks", subcategory: "Match socks", productType: "Match socks", league: null, club: null,
    price: 3900, oldPrice: 4900, discount: 20, sizes: ["S (36-39)","M (40-42)","L (43-45)"], material: "Полиамид/хлопок", length: "Колено", grip: "No",
    description: "Высокие матчевые гетры с усиленной пяткой и мыском. Подходят для шипов.",
    image: "🧦", featured: true, sale: true, stock: 40
  },
  {
    id: "socks-grip", name: "Гетры с грипом PHANTOM", brand: "PHANTOM",
    category: "socks", subcategory: "Grip socks", productType: "Grip socks", league: null, club: null,
    price: 4900, sizes: ["M (40-42)","L (43-45)"], material: "Полиамид с силиконовым покрытием", length: "Щиколотка", grip: "Yes",
    description: "Носки с силиконовым грипом внутри для фиксации ноги в бутсе. Профилактика натираний.",
    image: "🧤", isNew: true, stock: 28
  },
  {
    id: "socks-train", name: "Тренировочные носки PHANTOM", brand: "PHANTOM",
    category: "socks", subcategory: "Training socks", productType: "Training socks", league: null, club: null,
    price: 2900, sizes: ["S","M","L"], material: "Хлопок/полиамид", length: "Щиколотка", grip: "No",
    description: "Удобные тренировочные носки средней высоты. Дышащая структура.",
    image: "🧦", stock: 50
  },
  {
    id: "socks-compress", name: "Компрессионные гетры PHANTOM", brand: "PHANTOM",
    category: "socks", subcategory: "Compression socks", productType: "Compression socks", league: null, club: null,
    price: 5500, oldPrice: 6500, discount: 15, sizes: ["S","M","L"], material: "Компрессионный трикотаж", length: "Колено", grip: "No",
    description: "Компрессионная поддержка для икр во время игры и восстановления.",
    image: "🦵", stock: 20
  },

  /* ─────────────────────────── АКСЕССУАРЫ ───────────────────────── */
  {
    id: "acc-ball-match", name: "Матчевый мяч PHANTOM Pro", brand: "PHANTOM",
    category: "accessories", subcategory: "Footballs", productType: "Match ball", league: null, club: null,
    price: 7900, oldPrice: 9900, discount: 20, sizes: ["Размер 5"], material: "ТПУ, панельная", purpose: "Match", surface: ["FG","AG"],
    description: "Матчевый мяч с шовной сварной поверхностью и хорошим отскоком. Сертифицированный размер 5.",
    image: "⚽", featured: true, bestseller: true, sale: true, stock: 24
  },
  {
    id: "acc-ball-train", name: "Тренировочный мяч PHANTOM", brand: "PHANTOM",
    category: "accessories", subcategory: "Footballs", productType: "Training ball", league: null, club: null,
    price: 4900, sizes: ["Размер 5","Размер 4"], material: "ПУ, машинная сшивка", purpose: "Training", surface: ["AG","TF"],
    description: "Надёжный тренировочный мяч для ежедневных занятий и уличных игр.",
    image: "⚽", stock: 30
  },
  {
    id: "acc-shin-guards", name: "Щитки PHANTOM Pro", brand: "PHANTOM",
    category: "accessories", subcategory: "Shin guards", productType: "Shin guards", league: null, club: null,
    price: 3900, oldPrice: 4900, discount: 20, sizes: ["S","M","L"], material: "ПП/ПУ с усилением", purpose: "Protection",
    description: "Лёгкие щитки с анатомической формой и фиксаторами. Надёжная защита голени.",
    image: "🛡", featured: true, sale: true, stock: 35
  },
  {
    id: "acc-gk-gloves", name: "Вратарские перчатки PHANTOM Grip", brand: "PHANTOM",
    category: "accessories", subcategory: "Goalkeeper gloves", productType: "GK gloves", league: null, club: null,
    price: 6900, oldPrice: 8900, discount: 22, sizes: ["7","8","9","10","11"], material: "Латекс, ПУ", purpose: "Grip",
    description: "Вратарские перчатки с латексной ладонью для сцепления. Фиксация на запястье.",
    image: "🧤", bestseller: true, sale: true, stock: 18
  },
  {
    id: "acc-bootbag", name: "Бутсбэг PHANTOM", brand: "PHANTOM",
    category: "accessories", subcategory: "Boot bags", productType: "Boot bag", league: null, club: null,
    price: 4900, sizes: ["One size"], material: "Кордура", purpose: "Storage",
    description: "Компактный бутсбэг с вентиляцией и отделением для аксессуаров.",
    image: "🎒", stock: 20
  },
  {
    id: "acc-sportbag", name: "Спортивная сумка PHANTOM Duffel", brand: "PHANTOM",
    category: "accessories", subcategory: "Sports bags", productType: "Sports bag", league: null, club: null,
    price: 12900, oldPrice: 15900, discount: 19, sizes: ["50L","70L"], material: "Оксфорд", purpose: "Storage",
    description: "Вместительная спортивная сумка с отдельными отсеками и лямкой.",
    image: "👜", featured: true, stock: 12
  },
  {
    id: "acc-bottle", name: "Бутылка для воды PHANTOM", brand: "PHANTOM",
    category: "accessories", subcategory: "Water bottles", productType: "Water bottle", league: null, club: null,
    price: 1900, sizes: ["600мл"], material: "Тритан", purpose: "Hydration",
    description: "Спортивная бутылка с держателем и закручивающейся крышкой.",
    image: "💧", stock: 40
  },
  {
    id: "acc-headband", name: "Повязка на голову PHANTOM", brand: "PHANTOM",
    category: "accessories", subcategory: "Headbands", productType: "Headband", league: null, club: null,
    price: 1500, sizes: ["One size"], material: "Эластичный полиэстер", purpose: "Training",
    description: "Спортивная повязка с логотипом. Отводит пот и держит волосы.",
    image: "🎗", sale: true, stock: 30
  },

  /* ─────────────────────────── ВРАТАРСКАЯ ───────────────────────── */
  {
    id: "gk-gloves-pro", name: "Перчатки PHANTOM ProGuard", brand: "PHANTOM",
    category: "gk", subcategory: "GK gloves", productType: "Goalkeeper gloves", league: null, club: null,
    price: 7900, oldPrice: 9900, discount: 20, sizes: ["8","9","10","11"],
    material: "Латекс 4мм, кордура", purpose: "Grip / Protection", surface: ["FG","AG"],
    description: "Профессиональные перчатки с латексной ладонью 4мм и усиленной защитой пальцев. Идеальный грип в любую погоду.",
    image: "🧤", featured: true, bestseller: true, sale: true, stock: 15
  },
  {
    id: "gk-shirt", name: "Вратарская футболка PHANTOM GK", brand: "PHANTOM",
    category: "gk", subcategory: "GK jerseys", productType: "Goalkeeper jersey", league: null, club: null,
    price: 8900, oldPrice: 10900, discount: 18, sizes: ["S","M","L","XL","XXL"], material: "Полиэстер, амортизация", fit: "Атлетическая",
    description: "Вратарская футболка с усиленными зонами на локтях и плечах. Повышенная амортизация при падениях.",
    image: "🧤", featured: true, stock: 14
  },
  {
    id: "gk-pants", name: "Вратарские штаны-подштанники PHANTOM", brand: "PHANTOM",
    category: "gk", subcategory: "GK pants", productType: "Goalkeeper pants", league: null, club: null,
    price: 6900, sizes: ["S","M","L","XL"], material: "Полиэстер", fit: "Атлетическая",
    description: "Вратарские штаны с усилением в зоне падений. Защита бёдер и колен.",
    image: "👖", stock: 12
  },
  {
    id: "gk-train-kit", name: "Вратарский тренировочный комплект PHANTOM", brand: "PHANTOM",
    category: "gk", subcategory: "GK training kits", productType: "GK training kit", league: null, club: null,
    price: 15900, oldPrice: 18900, discount: 16, sizes: ["M","L","XL"], material: "Полиэстер", fit: "Спортивная",
    description: "Полный вратарский тренировочный комплект: перчатки-щитки и форма для тренировок.",
    image: "🧤", stock: 8
  },
  {
    id: "gk-pro-coat", name: "Защитная вратарская экипировка PHANTOM", brand: "PHANTOM",
    category: "gk", subcategory: "Protective GK clothing", productType: "GK protection", league: null, club: null,
    price: 10900, sizes: ["S","M","L","XL"], material: "ПУ/ПП амортизация", purpose: "Protection",
    description: "Защитные накладки на локти и бёдра для уверенных падений на любом покрытии.",
    image: "🛡", isNew: true, stock: 10
  },

  /* ─────────────────────────── МЯЧИ ─────────────────────────── */
  {
    id: "ball-futsal", name: "Футзальный мяч PHANTOM Indoor", brand: "PHANTOM",
    category: "balls", subcategory: "Futsal balls", productType: "Futsal ball", league: null, club: null,
    price: 5900, sizes: ["Размер 4"], material: "ПУ, сшивка", purpose: "Futsal", surface: ["IC"],
    description: "Мяч для футзала с пониженным отскоком и усиленной поверхностью для твёрдых покрытий.",
    image: "⚽", isNew: true, stock: 18
  },
  {
    id: "ball-street", name: "Мяч для улицы PHANTOM Street", brand: "PHANTOM",
    category: "balls", subcategory: "Street football balls", productType: "Street ball", league: null, club: null,
    price: 3900, oldPrice: 4900, discount: 20, sizes: ["Размер 5","Размер 4"], material: "ПУ усиленный", purpose: "Street", surface: ["TF","AG"],
    description: "Прочный мяч для уличных игр и коробок. Устойчив к асфальту и гравию.",
    image: "⚽", stock: 26
  },
  {
    id: "ball-academy", name: "Мяч академии PHANTOM Academy", brand: "PHANTOM",
    category: "balls", subcategory: "Academy balls", productType: "Academy ball", league: null, club: null,
    price: 2900, sizes: ["Размер 3","Размер 4","Размер 5"], material: "ПУ, сшивка", purpose: "Academy", surface: ["AG","TF"],
    description: "Мяч для детских и юношеских тренировок. Доступный и надёжный.",
    image: "⚽", sale: true, stock: 40
  },

  /* ─────────────────────────── STREET FOOTBALL ─────────────────── */
  {
    id: "street-tf-boots", name: "Street TF бутсы PHANTOM", brand: "PHANTOM",
    category: "street", subcategory: "TF boots", productType: "TF boots", league: null, club: null,
    price: 23900, oldPrice: 29900, discount: 20, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["TF"], level: "ENTRY", playerProfile: "Street",
    material: "Синтетика", weight: "250 г", fit: "Средняя",
    upper: "Synthetic", soleplate: "Turf studs",
    description: "Уличные бутсы для турфа и коробок. Комфорт и сцепление в городских условиях.",
    image: "🏙", featured: true, bestseller: true, sale: true, stock: 20, collection: "street"
  },
  {
    id: "street-indoor", name: "Индора PHANTOM Street", brand: "PHANTOM",
    category: "street", subcategory: "Indoor shoes", productType: "Indoor shoes", league: null, club: null,
    price: 21900, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["IC"], level: "ENTRY", playerProfile: "Indoor / Street",
    material: "Синтетика", weight: "240 г", fit: "Средняя",
    upper: "Synthetic", soleplate: "Flat rubber",
    description: "Индора для футзала и залов. Плоская подошва с отличным сцеплением.",
    image: "🏟", isNew: true, stock: 16, collection: "street"
  },
  {
    id: "street-jersey", name: "Уличная футболка PHANTOM Street", brand: "PHANTOM",
    category: "street", subcategory: "Street jerseys", productType: "Street jersey", league: null, club: null,
    price: 7900, oldPrice: 9900, discount: 20, sizes: ["S","M","L","XL","XXL"], material: "Полиэстер", fit: "Оверсайз",
    description: "Уличная футболка с ярким принтом PHANTOM STREET. Городской стиль для коробок.",
    image: "🏙", featured: true, sale: true, stock: 22, collection: "street"
  },
  {
    id: "street-bag", name: "Сумка PHANTOM Street", brand: "PHANTOM",
    category: "street", subcategory: "Bags", productType: "Street bag", league: null, club: null,
    price: 10900, sizes: ["One size"], material: "Оксфорд", purpose: "Street",
    description: "Компактная уличная сумка в стиле street-culture для формы и мяча.",
    image: "🎒", stock: 12, collection: "street"
  }
];

/* ============================================================================
   Мастер-данные: лиги, клубы, поверхности, уровни
   ============================================================================ */

const LEAGUES = [
  { key: "premier-league", name: "PREMIER LEAGUE", country: "Англия", color: "#3d195b",
    clubs: ["Manchester United","Liverpool","Manchester City","Arsenal","Chelsea","Tottenham Hotspur","Newcastle United","Aston Villa","West Ham United","Everton","Brighton","Crystal Palace","Nottingham Forest","Fulham","Wolverhampton","Bournemouth","Brentford","Leeds United","Sunderland"] },
  { key: "la-liga", name: "LA LIGA", country: "Испания", color: "#7a2417",
    clubs: ["Real Madrid","Barcelona","Atlético Madrid","Athletic Club","Real Sociedad","Sevilla","Villarreal"] },
  { key: "serie-a", name: "SERIE A", country: "Италия", color: "#1a3d7a",
    clubs: ["Inter","AC Milan","Juventus","Napoli","Roma","Lazio","Atalanta"] },
  { key: "bundesliga", name: "BUNDESLIGA", country: "Германия", color: "#b3202c",
    clubs: ["Bayern Munich","Borussia Dortmund","Bayer Leverkusen","RB Leipzig","Eintracht Frankfurt"] },
  { key: "ligue-1", name: "LIGUE 1", country: "Франция", color: "#173a6b",
    clubs: ["Paris Saint-Germain","Marseille","Lyon","Monaco","Lille"] }
];

const SURFACES = {
  "FG": "Firm Ground — для натурального газона",
  "AG": "Artificial Ground — для искусственного газона",
  "TF": "Turf — для искусственного покрытия с короткими гранулами",
  "MG": "Multi Ground — универсальный вариант",
  "IC": "Indoor Court — для индора и твёрдых покрытий"
};

const LEVELS = ["ELITE","PRO","ACADEMY","ENTRY"];

const COLLECTIONS = [
  { key: "speed", name: "SPEED", color: "ct-speed", desc: "Mercurial · F50 · Ultra", tagline: "Быстрота" },
  { key: "control", name: "CONTROL", color: "ct-control", desc: "Phantom · Predator", tagline: "Контроль" },
  { key: "agility", name: "AGILITY", color: "ct-agility", desc: "Future", tagline: "Ловкость" },
  { key: "matchday", name: "MATCH DAY", color: "ct-matchday", desc: "Jerseys · Shorts · Socks", tagline: "Игровой день" },
  { key: "training", name: "TRAINING", color: "ct-training", desc: "Shirts · Shorts · Tracksuits", tagline: "Тренировки" },
  { key: "street", name: "STREET", color: "ct-street", desc: "TF · IC · Street clothing", tagline: "Улица" }
];

const CATEGORIES_META = {
  boots: { ru: "Бутсы", code: "БУТСЫ" },
  analogue: { ru: "Аналоги", code: "АНАЛОГИ" },
  jersey: { ru: "Футболки", code: "ФУТБОЛКИ" },
  retro: { ru: "Ретро", code: "RETRO" },
  training: { ru: "Тренировочная одежда", code: "ТРЕНИРОВОЧНАЯ ОДЕЖДА" },
  shorts: { ru: "Шорты", code: "ФУТБОЛЬНЫЕ ШОРТЫ" },
  socks: { ru: "Гетры и носки", code: "ГЕТРЫ И НОСКИ" },
  accessories: { ru: "Аксессуары", code: "АКСЕССУАРЫ" },
  gk: { ru: "Вратарская экипировка", code: "ВРАТАРСКАЯ ЭКИПИРОВКА" },
  balls: { ru: "Мячи", code: "МЯЧИ" },
  street: { ru: "Street Football", code: "STREET FOOTBALL" }
};

const STORAGE_KEY = "phantom_catalog_overrides";

/* ============================================================================
   Хранилище: объединяет дефолтные данные с правками из localStorage (CMS)
   ============================================================================ */
const Catalog = {
  getAll() {
    let raw = localStorage.getItem(STORAGE_KEY);
    let overrides = [];
    if (raw) { try { overrides = JSON.parse(raw); } catch (e) { overrides = []; } }
    const map = new Map();
    DEFAULT_CATALOG.forEach(p => { const copy = Object.assign({}, p);
      if (p.image) { copy.image = p.image; } map.set(p.id, copy); });
    overrides.forEach(o => {
      if (o && o.id) {
        if (o._deleted) { map.delete(o.id); return; }
        map.set(o.id, Object.assign({}, o));
      }
    });
    return Array.from(map.values());
  },
  getById(id) {
    return this.getAll().find(p => p.id === id) || null;
  },
  byCategory(cat) { return this.getAll().filter(p => p.category === cat); },
  byCollection(coll) { return this.getAll().filter(p => p.collection === coll); },
  newArrivals() { return this.getAll().filter(p => p.isNew); },
  bestsellers() { return this.getAll().filter(p => p.bestseller); },
  onSale() { return this.getAll().filter(p => p.sale); },
  featured() { return this.getAll().filter(p => p.featured); },
  saveOverrides(overrides) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  },
  fmt(n) { return n.toLocaleString('ru-RU') + ' ₸'; }
};
