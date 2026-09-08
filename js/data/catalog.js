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
     productType: "Speed boots" | "Home shirt" | "Match kit" | "Training kit" | ...,
     league: "premier-league" | "la-liga" | ... | null,   // только для футболок/шорт/китов
     club: "Manchester United" | ... | null,
     season: "2026/27" | null,
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

  /* ═══════════════════════ БУТСЫ · FG · ELITE 2026 ══════════════════════ */
  {
    id: "nike-merc-vapor16",
    name: "Nike Mercurial Vapor 16 Elite",
    brand: "Nike",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 39","EU 40","EU 40.5","EU 41","EU 42","EU 42.5","EU 43","EU 44","EU 45"],
    surface: ["FG"], level: "ELITE", playerProfile: "Speed / Attack",
    material: "Flyknit", weight: "185 г", fit: "Тесная / гоночная",
    upper: "Vaporposite легчайший сетчатый верх", soleplate: "CarbonFiber карбоновая пластина", generation: "2026",
    description: "Силуэт главного ускорителя. Гоночная посадка, максимальная отдача на шаге. Создан для фланговых атак и рывков на скорости.",
    images: ["assets/img/boots/vapor16-1.webp","assets/img/boots/vapor16-2.jpg","assets/img/boots/vapor16-3.jpg","assets/img/boots/vapor16-4.jpg","assets/img/boots/vapor16-5.png","assets/img/boots/vapor16-6.avif"],
    featured: true, bestseller: true, isNew: true, stock: 12, collection: "speed"
  },
  {
    id: "nike-merc-superfly10",
    name: "Nike Mercurial Superfly 10 Elite",
    brand: "Nike",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG"], level: "ELITE", playerProfile: "Speed / Attack",
    material: "Flyknit высокая посадка", weight: "225 г", fit: "Фиксация с голеностопом",
    upper: "Vaporposite 3.0", soleplate: "Aerotrack", generation: "2026",
    description: "Флагманская версия Mercurial с высокой посадкой и тотальной фиксацией. Лёгкая конструкция и агрессивная геометрия для взрывных стартов.",
    images: ["assets/img/boots/superfly10-1.webp","assets/img/boots/superfly10-2.jpg","assets/img/boots/superfly10-3.jpg","assets/img/boots/superfly10-4.jpg","assets/img/boots/superfly10-5.webp","assets/img/boots/superfly10-6.webp","assets/img/boots/superfly10-7.png"],
    featured: true, isNew: true, stock: 9, collection: "speed"
  },
  {
    id: "adidas-f50-elite",
    name: "Adidas F50 Elite",
    brand: "adidas",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG"], level: "ELITE", playerProfile: "Speed / Acceleration",
    material: "Сетка с покрытием", weight: "205 г", fit: "Средняя",
    upper: "HybridTouch", soleplate: "SprintFrame 360", generation: "2026",
    description: "Скоростная серия с низкопрофильной подошвой для мгновенного ускорения. Лёгкий верх с точным контролем на высокой скорости.",
    images: ["assets/img/boots/f50elite-1.jpg","assets/img/boots/f50elite-2.jpg","assets/img/boots/f50elite-3.jpg","assets/img/boots/f50elite-4.jpg","assets/img/boots/f50elite-5.jpg","assets/img/boots/f50elite-6.jpg","assets/img/boots/f50elite-7.jpg","assets/img/boots/f50elite-8.jpg"],
    featured: true, bestseller: true, stock: 15, collection: "speed"
  },
  {
    id: "puma-ultra",
    name: "Puma Ultra 6 Ultimate",
    brand: "Puma",
    category: "boots", subcategory: "SPEED BOOTS", productType: "Speed boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG"], level: "ELITE", playerProfile: "Speed / Lightweight",
    material: "UTHC лёгкий верх", weight: "195 г", fit: "Тесная",
    upper: "ULTRAWEAVE", soleplate: "SpeedUnit", generation: "2026",
    description: "Одна из самых лёгких моделей на рынке. Ультралёгкая конструкция для постоянного давления на оборону и максимальной скорости.",
    images: ["assets/img/boots/ultra6.jpg"], isNew: true, stock: 10, collection: "speed"
  },
  {
    id: "nike-phantom-gx3",
    name: "Nike Phantom GX 3 Elite",
    brand: "Nike",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44","EU 45"],
    surface: ["FG"], level: "ELITE", playerProfile: "Control / Passing / Finishing",
    material: "GripknitPro", weight: "230 г", fit: "Комфортная",
    upper: "GripknitPro сухое сцепление", soleplate: "Nike GX 3", generation: "2026",
    description: "Новое поколение плеймейкерских бутс Phantom. Рискованные пасы и выверенный приём даже на мокром газоне — зона контакта выросла, сцепление стало ещё надёжнее.",
    images: ["assets/img/boots/phantomgx3-1.png","assets/img/boots/phantomgx3-2.webp","assets/img/boots/phantomgx3-3.webp"],
    featured: true, isNew: true, stock: 11, collection: "control"
  },
  {
    id: "adidas-predator",
    name: "Adidas Predator 26 Elite",
    brand: "adidas",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG"], level: "ELITE", playerProfile: "Ball control / Finishing",
    material: "Кожа HybridTouch", weight: "250 г", fit: "Комфортная",
    upper: "HybridTouch с рифлением", soleplate: "ControlFrame", generation: "2026",
    description: "Легендарная линия с усиленными зонами для удара и контроля. Демонический топспин и уверенный приём даже под давлением.",
    images: ["assets/img/boots/predator26.webp","assets/img/boots/predator26-b.jpg","assets/img/boots/predator26-c.jpg","assets/img/boots/predator26-d.jpg"],
    featured: true, bestseller: true, isNew: true, stock: 14, collection: "control"
  },
  {
    id: "puma-future8",
    name: "Puma Future 8 Ultimate",
    brand: "Puma",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control / Agility boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["FG"], level: "ELITE", playerProfile: "Dribbling / Agility",
    material: "Сетчатый верх", weight: "230 г", fit: "Адаптивная",
    upper: "FUZIONFIT адаптивная посадка", soleplate: "RUBCAGE + Dynamic Motion", generation: "2026",
    description: "Создана для дриблинга: эластичная зона на бинтах даёт свободу и контроль. Идеальна для техничных игроков, обыгрывающих один в один.",
    images: ["assets/img/boots/future8-1.webp","assets/img/boots/future8-2.avif","assets/img/boots/future8-3.avif","assets/img/boots/future8-4.jpg"],
    isNew: true, stock: 11, collection: "agility"
  },
  {
    id: "nike-tiempo-legend",
    name: "Nike Tiempo Legend 10 Elite",
    brand: "Nike",
    category: "boots", subcategory: "CONTROL BOOTS", productType: "Control boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 39","EU 40","EU 40.5","EU 41","EU 42","EU 42.5","EU 43","EU 44","EU 45"],
    surface: ["FG"], level: "ELITE", playerProfile: "Control / Passing",
    material: "Kangaroo FlyTouch", weight: "235 г", fit: "Комфортная",
    upper: "Кожа Kangaroo FlyTouch с эффектом перчатки", soleplate: "Hyperstability", generation: "2026",
    description: "Легендарная серия для премьер-классной техники: мягкий кожаный верх с эффектом перчатки даёт идеальный контроль мяча и точность передачи.",
    image: "🧤", isNew: true, bestseller: true, stock: 13, collection: "control"
  },

  /* ═══════════════════════ БУТСЫ · TF · TURF 2026 ═══════════════════════ */
  {
    id: "nike-merc-vapor16-tf",
    name: "Nike Mercurial Vapor 16 TF",
    brand: "Nike",
    category: "boots", subcategory: "TURF BOOTS", productType: "Turf boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 39","EU 40","EU 40.5","EU 41","EU 42","EU 42.5","EU 43","EU 44","EU 45"],
    surface: ["TF"], level: "ELITE", playerProfile: "Speed / Attack",
    material: "Flyknit", weight: "190 г", fit: "Тесная / гоночная",
    upper: "Vaporposite сетчатый верх", soleplate: "TF-многочисленные шипы", generation: "2026",
    description: "Turf-версия Mercurial Vapor 16 для искусственных покрытий. Мелкие шипы дают устойчивость и мгновенное ускорение на коротком ворсе.",
    images: ["assets/img/boots/tf/vapor16tf-1.jpg","assets/img/boots/tf/vapor16tf-2.jpg","assets/img/boots/tf/vapor16tf-3.jpg","assets/img/boots/tf/vapor16tf-4.jpg","assets/img/boots/tf/vapor16tf-5.webp","assets/img/boots/tf/vapor16tf-6.png"],
    isNew: true, stock: 14, collection: "speed"
  },
  {
    id: "nike-merc-superfly10-tf",
    name: "Nike Mercurial Superfly 10 TF",
    brand: "Nike",
    category: "boots", subcategory: "TURF BOOTS", productType: "Turf boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["TF"], level: "ELITE", playerProfile: "Speed / Attack",
    material: "Flyknit высокая посадка", weight: "228 г", fit: "Фиксация с голеностопом",
    upper: "Vaporposite 3.0", soleplate: "TF-многочисленные шипы", generation: "2026",
    description: "Turf-версия Superfly 10 с высокой посадкой для искусственных покрытий. Многочисленные шипы и фиксация голеностопа для максимальной скорости.",
    images: ["assets/img/boots/tf/superfly10tf-1.webp","assets/img/boots/tf/superfly10tf-2.jpg","assets/img/boots/tf/superfly10tf-3.jpg","assets/img/boots/tf/superfly10tf-4.webp","assets/img/boots/tf/superfly10tf-5.webp"],
    isNew: true, stock: 10, collection: "speed"
  },
  {
    id: "adidas-f50-tf",
    name: "Adidas F50 TF",
    brand: "adidas",
    category: "boots", subcategory: "TURF BOOTS", productType: "Turf boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["TF"], level: "ELITE", playerProfile: "Speed / Acceleration",
    material: "Сетка с покрытием", weight: "208 г", fit: "Средняя",
    upper: "HybridTouch", soleplate: "TF-многочисленные шипы", generation: "2026",
    description: "Turf-версия F50 для искусственных покрытий. Мелкие шипы и лёгкий верх дают ускорение и контроль на коротком ворсе.",
    images: ["assets/img/boots/tf/f50tf-1.jpg","assets/img/boots/tf/f50tf-2.webp","assets/img/boots/tf/f50tf-3.webp","assets/img/boots/tf/f50tf-4.jpg","assets/img/boots/tf/f50tf-5.webp"],
    stock: 17, collection: "speed"
  },
  {
    id: "nike-phantom-gx3-tf",
    name: "Nike Phantom GX 3 TF",
    brand: "Nike",
    category: "boots", subcategory: "TURF BOOTS", productType: "Turf boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 39","EU 40","EU 41","EU 42","EU 43","EU 44","EU 45"],
    surface: ["TF"], level: "ELITE", playerProfile: "Control / Passing / Finishing",
    material: "GripknitPro", weight: "233 г", fit: "Комфортная",
    upper: "GripknitPro сухое сцепление", soleplate: "TF-многочисленные шипы", generation: "2026",
    description: "Turf-версия Phantom GX 3 для искусственных покрытий. Контрольный верх и мелкие шипы для точного паса и удара на коротком ворсе.",
    images: ["assets/img/boots/tf/phantomgx3tf-1.jpg","assets/img/boots/tf/phantomgx3tf-2.jpg","assets/img/boots/tf/phantomgx3tf-3.jpg","assets/img/boots/tf/phantomgx3tf-4.jpg"],
    isNew: true, stock: 11, collection: "control"
  },
  {
    id: "adidas-predator25-tf",
    name: "Adidas Predator 25 TF",
    brand: "adidas",
    category: "boots", subcategory: "TURF BOOTS", productType: "Turf boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["TF"], level: "ELITE", playerProfile: "Ball control / Finishing",
    material: "Кожа HybridTouch", weight: "248 г", fit: "Комфортная",
    upper: "HybridTouch с рифлением", soleplate: "TF-многочисленные шипы", generation: "2026",
    description: "Turf-версия Predator 25 для искусственных покрытий. Усиленные зоны удара и мелкие шипы для уверенного контроля мяча.",
    images: ["assets/img/boots/tf/predator25tf-1.jpg","assets/img/boots/tf/predator25tf-2.jpg","assets/img/boots/tf/predator25tf-3.jpg","assets/img/boots/tf/predator25tf-4.jpeg"],
    isNew: true, stock: 16, collection: "control"
  },
  {
    id: "puma-future8-tf",
    name: "Puma Future 8 TF",
    brand: "Puma",
    category: "boots", subcategory: "TURF BOOTS", productType: "Turf / Agility boots",
    price: 20000, oldPrice: 25000, discount: 20, sizes: ["EU 40","EU 41","EU 42","EU 43","EU 44"],
    surface: ["TF"], level: "ELITE", playerProfile: "Dribbling / Agility",
    material: "Сетчатый верх", weight: "233 г", fit: "Адаптивная",
    upper: "FUZIONFIT адаптивная посадка", soleplate: "TF-многочисленные шипы", generation: "2026",
    description: "Turf-версия Future 8 для искусственных покрытий. Эластичная зона для дриблинга и мелкие шипы для манёвренности на коротком ворсе.",
    images: ["assets/img/boots/tf/future8tf-1.webp","assets/img/boots/tf/future8tf-2.webp","assets/img/boots/tf/future8tf-3.jpg","assets/img/boots/tf/future8tf-4.jpg"],
    stock: 13, collection: "agility"
  },

  /* ─────────────────────────── ФОРМЫ · ПРЕМЬЕР-ЛИГА (топ-10) ───────────── */
  {
    id: "jrs-manutd-home", name: "Форма Manchester United 2026/27", brand: "adidas",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Match kit", league: "premier-league", club: "Manchester United",
    season: "2026/27", price: 11900,
    sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell полиэстер", fit: "Атлетическая",
    description: "Полный игровой комплект формы Manchester United 2026/27: футболка и шорты. Легендарный красный цвет и белые акценты.",
    image: "🔴", featured: true, bestseller: true, isNew: true, stock: 40, collection: "matchday"
  },
  {
    id: "jrs-liv-home", name: "Форма Liverpool 2026/27", brand: "Nike",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Match kit", league: "premier-league", club: "Liverpool",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT полиэстер", fit: "Атлетическая",
    description: "Полный игровой комплект формы Liverpool 2026/27: футболка и шорты. Классический красный с деталями в стиле The Kop.",
    image: "❤", featured: true, bestseller: true, stock: 38, collection: "matchday"
  },
  {
    id: "jrs-mancity-home", name: "Форма Manchester City 2026/27", brand: "Puma",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Match kit", league: "premier-league", club: "Manchester City",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "dryCELL полиэстер", fit: "Атлетическая",
    description: "Полный игровой комплект формы Manchester City 2026/27: футболка и шорты. Голубой цвет небес и фирменные детали.",
    image: "🔵", featured: true, stock: 35, collection: "matchday"
  },
  {
    id: "jrs-arsenal-home", name: "Форма Arsenal 2026/27", brand: "adidas",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Match kit", league: "premier-league", club: "Arsenal",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell полиэстер", fit: "Атлетическая",
    description: "Полный игровой комплект формы Arsenal 2026/27: футболка и шорты. Красный фирменный цвет с белыми рукавами.",
    image: "🔺", bestseller: true, stock: 30, collection: "matchday"
  },
  {
    id: "jrs-chelsea-home", name: "Форма Chelsea 2026/27", brand: "Nike",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Match kit", league: "premier-league", club: "Chelsea",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Атлетическая",
    description: "Полный игровой комплект формы Chelsea 2026/27: футболка и шорты. Королевский синий с деталями Stamford Bridge.",
    image: "🔷", stock: 22, collection: "matchday"
  },
  {
    id: "jrs-spurs-home", name: "Форма Tottenham Hotspur 2026/27", brand: "Nike",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Match kit", league: "premier-league", club: "Tottenham Hotspur",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Атлетическая",
    description: "Полный игровой комплект формы Tottenham 2026/27: футболка и шорты. Классический белый с синими акцентами.",
    image: "⚪", stock: 18, collection: "matchday"
  },
  {
    id: "jrs-newcastle-home", name: "Форма Newcastle United 2026/27", brand: "adidas",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Match kit", league: "premier-league", club: "Newcastle United",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Атлетическая",
    description: "Полный игровой комплект формы Newcastle 2026/27: футболка и шорты. Чёрно-белые полосы St. James' Park.",
    image: "⚫", stock: 16, collection: "matchday"
  },
  {
    id: "jrs-astonvilla-home", name: "Форма Aston Villa 2026/27", brand: "adidas",
    category: "jersey", subcategory: "PREMIER LEAGUE", productType: "Match kit", league: "premier-league", club: "Aston Villa",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Атлетическая",
    description: "Полный игровой комплект формы Aston Villa 2026/27: футболка и шорты. Клaret-and-blue фирменная гамма.",
    image: "🔶", isNew: true, stock: 14, collection: "matchday"
  },

  /* ──────── ФОРМЫ · ЛА ЛИГА (топ-5) ──────── */
  {
    id: "jrs-realmadrid-home", name: "Форма Real Madrid 2026/27", brand: "adidas",
    category: "jersey", subcategory: "LA LIGA", productType: "Match kit", league: "la-liga", club: "Real Madrid",
    season: "2026/27", price: 11900,
    sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Атлетическая",
    description: "Полный игровой комплект формы Real Madrid 2026/27: футболка и шорты. Легендарный белый цвет Santiago Bernabéu.",
    image: "🤍", featured: true, bestseller: true, stock: 42, collection: "matchday"
  },
  {
    id: "jrs-barcelona-home", name: "Форма Barcelona 2026/27", brand: "Nike",
    category: "jersey", subcategory: "LA LIGA", productType: "Match kit", league: "la-liga", club: "Barcelona",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Атлетическая",
    description: "Полный игровой комплект формы Barcelona 2026/27: футболка и шорты. Блауграна Camp Nou.",
    image: "🔵", featured: true, bestseller: true, stock: 40, collection: "matchday"
  },
  {
    id: "jrs-atletico-home", name: "Форма Atlético Madrid 2026/27", brand: "Nike",
    category: "jersey", subcategory: "LA LIGA", productType: "Match kit", league: "la-liga", club: "Atlético Madrid",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Атлетическая",
    description: "Полный игровой комплект формы Atlético 2026/27: футболка и шорты. Красно-белые полосы.",
    image: "🔴", stock: 20, collection: "matchday"
  },
  {
    id: "jrs-athletic-home", name: "Форма Athletic Club 2026/27", brand: "Nike",
    category: "jersey", subcategory: "LA LIGA", productType: "Match kit", league: "la-liga", club: "Athletic Club",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Атлетическая",
    description: "Полный игровой комплект формы Athletic Club 2026/27: футболка и шорты. Красно-белые полосы San Mamés.",
    image: "🔴", stock: 17, collection: "matchday"
  },
  {
    id: "jrs-realsociedad-home", name: "Форма Real Sociedad 2026/27", brand: "Nike",
    category: "jersey", subcategory: "LA LIGA", productType: "Match kit", league: "la-liga", club: "Real Sociedad",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Атлетическая",
    description: "Полный игровой комплект формы Real Sociedad 2026/27: футболка и шорты. Сине-белая гамма Anoeta.",
    image: "🔵", stock: 15, collection: "matchday"
  },

  /* ──────── ФОРМЫ · СЕРИЯ А (топ-5) ──────── */
  {
    id: "jrs-inter-home", name: "Форма Inter 2026/27", brand: "Nike",
    category: "jersey", subcategory: "SERIE A", productType: "Match kit", league: "serie-a", club: "Inter",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Атлетическая",
    description: "Полный игровой комплект формы Inter 2026/27: футболка и шорты. Чёрно-синие полосы San Siro.",
    image: "🟦", stock: 24, collection: "matchday"
  },
  {
    id: "jrs-amilan-home", name: "Форма AC Milan 2026/27", brand: "Puma",
    category: "jersey", subcategory: "SERIE A", productType: "Match kit", league: "serie-a", club: "AC Milan",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "dryCELL", fit: "Атлетическая",
    description: "Полный игровой комплект формы AC Milan 2026/27: футболка и шорты. Красно-чёрные полосы San Siro.",
    image: "⚫", bestseller: true, stock: 28, collection: "matchday"
  },
  {
    id: "jrs-juventus-home", name: "Форма Juventus 2026/27", brand: "adidas",
    category: "jersey", subcategory: "SERIE A", productType: "Match kit", league: "serie-a", club: "Juventus",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Атлетическая",
    description: "Полный игровой комплект формы Juventus 2026/27: футболка и шорты. Чёрно-белые полосы Allianz Stadium.",
    image: "⬛", stock: 21, collection: "matchday"
  },
  {
    id: "jrs-napoli-home", name: "Форма Napoli 2026/27", brand: "EA7 / adidas",
    category: "jersey", subcategory: "SERIE A", productType: "Match kit", league: "serie-a", club: "Napoli",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Атлетическая",
    description: "Полный игровой комплект формы Napoli 2026/27: футболка и шорты. Небесно-голубой цвет Diego Armando Maradona.",
    image: "🔷", isNew: true, stock: 17, collection: "matchday"
  },
  {
    id: "jrs-roma-home", name: "Форма Roma 2026/27", brand: "adidas",
    category: "jersey", subcategory: "SERIE A", productType: "Match kit", league: "serie-a", club: "Roma",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Атлетическая",
    description: "Полный игровой комплект формы Roma 2026/27: футболка и шорты. Бордово-золотая гамма Olimpico.",
    image: "🟥", stock: 19, collection: "matchday"
  },

  /* ──────── ФОРМЫ · БУНДЕСЛИГА (топ-5) ──────── */
  {
    id: "jrs-bayern-home", name: "Форма Bayern Munich 2026/27", brand: "adidas",
    category: "jersey", subcategory: "BUNDESLIGA", productType: "Match kit", league: "bundesliga", club: "Bayern Munich",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Атлетическая",
    description: "Полный игровой комплект формы Bayern 2026/27: футболка и шорты. Белый с красными акцентами Allianz Arena.",
    image: "⚪", featured: true, stock: 26, collection: "matchday"
  },
  {
    id: "jrs-dortmund-home", name: "Форма Borussia Dortmund 2026/27", brand: "Puma",
    category: "jersey", subcategory: "BUNDESLIGA", productType: "Match kit", league: "bundesliga", club: "Borussia Dortmund",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "dryCELL", fit: "Атлетическая",
    description: "Полный игровой комплект формы Dortmund 2026/27: футболка и шорты. Жёлто-чёрная гамма Signal Iduna Park.",
    image: "🟨", stock: 19, collection: "matchday"
  },
  {
    id: "jrs-leverkusen-home", name: "Форма Bayer Leverkusen 2026/27", brand: "Puma",
    category: "jersey", subcategory: "BUNDESLIGA", productType: "Match kit", league: "bundesliga", club: "Bayer Leverkusen",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "dryCELL", fit: "Атлетическая",
    description: "Полный игровой комплект формы Leverkusen 2026/27: футболка и шорты. Чёрно-красная гамма BayArena.",
    image: "⚫", isNew: true, stock: 18, collection: "matchday"
  },
  {
    id: "jrs-rbleipzig-home", name: "Форма RB Leipzig 2026/27", brand: "Puma",
    category: "jersey", subcategory: "BUNDESLIGA", productType: "Match kit", league: "bundesliga", club: "RB Leipzig",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "dryCELL", fit: "Атлетическая",
    description: "Полный игровой комплект формы RB Leipzig 2026/27: футболка и шорты. Бело-красная гамма RB Arena.",
    image: "🔴", stock: 14, collection: "matchday"
  },
  {
    id: "jrs-frankfurt-home", name: "Форма Eintracht Frankfurt 2026/27", brand: "Nike",
    category: "jersey", subcategory: "BUNDESLIGA", productType: "Match kit", league: "bundesliga", club: "Eintracht Frankfurt",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Атлетическая",
    description: "Полный игровой комплект формы Frankfurt 2026/27: футболка и шорты. Чёрно-красная гамма Deutsche Bank Park.",
    image: "⚫", stock: 13, collection: "matchday"
  },

  /* ──────── ФОРМЫ · ЛИГА 1 (топ-5) ──────── */
  {
    id: "jrs-psg-home", name: "Форма PSG 2026/27", brand: "Nike",
    category: "jersey", subcategory: "LIGUE 1", productType: "Match kit", league: "ligue-1", club: "Paris Saint-Germain",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dri-FIT", fit: "Атлетическая",
    description: "Полный игровой комплект формы PSG 2026/27: футболка и шорты. Тёмно-синий с красным кантом Parc des Princes.",
    image: "🟦", featured: true, bestseller: true, stock: 33, collection: "matchday"
  },
  {
    id: "jrs-om-home", name: "Форма Marseille 2026/27", brand: "Puma",
    category: "jersey", subcategory: "LIGUE 1", productType: "Match kit", league: "ligue-1", club: "Marseille",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "dryCELL", fit: "Атлетическая",
    description: "Полный игровой комплект формы Marseille 2026/27: футболка и шорты. Бело-голубая гамма Vélodrome.",
    image: "🔵", stock: 15, collection: "matchday"
  },
  {
    id: "jrs-lyon-home", name: "Форма Lyon 2026/27", brand: "adidas",
    category: "jersey", subcategory: "LIGUE 1", productType: "Match kit", league: "ligue-1", club: "Lyon",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Dry-Cell", fit: "Атлетическая",
    description: "Полный игровой комплект формы Lyon 2026/27: футболка и шорты. Бело-сине-красная гамма Groupama Stadium.",
    image: "🔴", stock: 14, collection: "matchday"
  },
  {
    id: "jrs-monaco-home", name: "Форма Monaco 2026/27", brand: "Kappa",
    category: "jersey", subcategory: "LIGUE 1", productType: "Match kit", league: "ligue-1", club: "Monaco",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "Полиэстер", fit: "Атлетическая",
    description: "Полный игровой комплект формы Monaco 2026/27: футболка и шорты. Белый с красно-белой диагональю.",
    image: "⚪", stock: 12, collection: "matchday"
  },
  {
    id: "jrs-lille-home", name: "Форма Lille 2026/27", brand: "Puma",
    category: "jersey", subcategory: "LIGUE 1", productType: "Match kit", league: "ligue-1", club: "Lille",
    season: "2026/27", price: 11900, sizes: ["S","M","L","XL","XXL"], material: "dryCELL", fit: "Атлетическая",
    description: "Полный игровой комплект формы Lille 2026/27: футболка и шорты. Красный с синими акцентами Pierre-Mauroy.",
    image: "🔴", stock: 13, collection: "matchday"
  },

  /* ───────────── ТРЕНИРОВОЧНЫЕ КОМПЛЕКТЫ · ПРЕМЬЕР-ЛИГА (топ-10) ─────────── */
  {
    id: "tr-manutd-kit", name: "Тренировочный комплект Manchester United 2026/27", brand: "adidas",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "premier-league", club: "Manchester United",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dry-Cell полиэстер", fit: "Спортивная",
    description: "Полный тренировочный комплект Manchester United 2026/27: куртка и брюки. Фирменные детали клуба и дышащая ткань.",
    image: "👔", featured: true, bestseller: true, stock: 20, collection: "training"
  },
  {
    id: "tr-liv-kit", name: "Тренировочный комплект Liverpool 2026/27", brand: "Nike",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "premier-league", club: "Liverpool",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dri-FIT", fit: "Спортивная",
    description: "Полный тренировочный комплект Liverpool 2026/27: куртка и брюки. Фирменные детали клуба и дышащая ткань.",
    image: "👔", featured: true, stock: 19, collection: "training"
  },
  {
    id: "tr-mancity-kit", name: "Тренировочный комплект Manchester City 2026/27", brand: "Puma",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "premier-league", club: "Manchester City",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "dryCELL", fit: "Спортивная",
    description: "Полный тренировочный комплект Manchester City 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", stock: 18, collection: "training"
  },
  {
    id: "tr-arsenal-kit", name: "Тренировочный комплект Arsenal 2026/27", brand: "adidas",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "premier-league", club: "Arsenal",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dry-Cell", fit: "Спортивная",
    description: "Полный тренировочный комплект Arsenal 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", bestseller: true, stock: 17, collection: "training"
  },
  {
    id: "tr-chelsea-kit", name: "Тренировочный комплект Chelsea 2026/27", brand: "Nike",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "premier-league", club: "Chelsea",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dri-FIT", fit: "Спортивная",
    description: "Полный тренировочный комплект Chelsea 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", stock: 16, collection: "training"
  },
  {
    id: "tr-spurs-kit", name: "Тренировочный комплект Tottenham 2026/27", brand: "Nike",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "premier-league", club: "Tottenham Hotspur",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dri-FIT", fit: "Спортивная",
    description: "Полный тренировочный комплект Tottenham 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", stock: 15, collection: "training"
  },

  /* ───────────── ТРЕНИРОВОЧНЫЕ КОМПЛЕКТЫ · ЛА ЛИГА (топ-5) ─────────── */
  {
    id: "tr-realmadrid-kit", name: "Тренировочный комплект Real Madrid 2026/27", brand: "adidas",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "la-liga", club: "Real Madrid",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dry-Cell", fit: "Спортивная",
    description: "Полный тренировочный комплект Real Madrid 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", featured: true, stock: 21, collection: "training"
  },
  {
    id: "tr-barcelona-kit", name: "Тренировочный комплект Barcelona 2026/27", brand: "Nike",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "la-liga", club: "Barcelona",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dri-FIT", fit: "Спортивная",
    description: "Полный тренировочный комплект Barcelona 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", featured: true, stock: 20, collection: "training"
  },
  {
    id: "tr-atletico-kit", name: "Тренировочный комплект Atlético 2026/27", brand: "Nike",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "la-liga", club: "Atlético Madrid",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dri-FIT", fit: "Спортивная",
    description: "Полный тренировочный комплект Atlético 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", stock: 18, collection: "training"
  },

  /* ───────────── ТРЕНИРОВОЧНЫЕ КОМПЛЕКТЫ · СЕРИЯ А (топ-5) ─────────── */
  {
    id: "tr-inter-kit", name: "Тренировочный комплект Inter 2026/27", brand: "Nike",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "serie-a", club: "Inter",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dri-FIT", fit: "Спортивная",
    description: "Полный тренировочный комплект Inter 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", stock: 18, collection: "training"
  },
  {
    id: "tr-amilan-kit", name: "Тренировочный комплект AC Milan 2026/27", brand: "Puma",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "serie-a", club: "AC Milan",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "dryCELL", fit: "Спортивная",
    description: "Полный тренировочный комплект AC Milan 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", bestseller: true, stock: 17, collection: "training"
  },
  {
    id: "tr-juventus-kit", name: "Тренировочный комплект Juventus 2026/27", brand: "adidas",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "serie-a", club: "Juventus",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dry-Cell", fit: "Спортивная",
    description: "Полный тренировочный комплект Juventus 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", stock: 18, collection: "training"
  },
  {
    id: "tr-napoli-kit", name: "Тренировочный комплект Napoli 2026/27", brand: "EA7 / adidas",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "serie-a", club: "Napoli",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dry-Cell", fit: "Спортивная",
    description: "Полный тренировочный комплект Napoli 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", stock: 15, collection: "training"
  },

  /* ───────────── ТРЕНИРОВОЧНЫЕ КОМПЛЕКТЫ · БУНДЕСЛИГА (топ-5) ─────────── */
  {
    id: "tr-bayern-kit", name: "Тренировочный комплект Bayern 2026/27", brand: "adidas",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "bundesliga", club: "Bayern Munich",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dry-Cell", fit: "Спортивная",
    description: "Полный тренировочный комплект Bayern 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", featured: true, stock: 20, collection: "training"
  },
  {
    id: "tr-dortmund-kit", name: "Тренировочный комплект Dortmund 2026/27", brand: "Puma",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "bundesliga", club: "Borussia Dortmund",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "dryCELL", fit: "Спортивная",
    description: "Полный тренировочный комплект Dortmund 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", stock: 17, collection: "training"
  },

  /* ───────────── ТРЕНИРОВОЧНЫЕ КОМПЛЕКТЫ · ЛИГА 1 (топ-5) ─────────── */
  {
    id: "tr-psg-kit", name: "Тренировочный комплект PSG 2026/27", brand: "Nike",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "ligue-1", club: "Paris Saint-Germain",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "Dri-FIT", fit: "Спортивная",
    description: "Полный тренировочный комплект PSG 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", featured: true, stock: 22, collection: "training"
  },
  {
    id: "tr-om-kit", name: "Тренировочный комплект Marseille 2026/27", brand: "Puma",
    category: "training", subcategory: "Training kits", productType: "Training kit", league: "ligue-1", club: "Marseille",
    season: "2026/27", price: 17000, sizes: ["S","M","L","XL","XXL"],
    material: "dryCELL", fit: "Спортивная",
    description: "Полный тренировочный комплект Marseille 2026/27: куртка и брюки. Фирменные детали клуба.",
    image: "👔", stock: 14, collection: "training"
  },
  /* ─────────────────────────── МЯЧИ · ТОП-5 ЛИГ ─────────────────────── */
  {
    id: "ball-laliga", name: "Мяч LaLiga", brand: "Puma",
    category: "balls", subcategory: "МЯЧИ ТОП-5 ЛИГ", productType: "Match ball",
    price: 9000, sizes: ["5"], level: "PRO", surface: ["FIFA Quality Pro"], generation: "2024/25",
    material: "PU", weight: "410–450 г",
    description: "Официальный мяч испанской Ла Лиги сезона 24/25 от Puma. Классическая бело-чёрная геометрия и надёжный верх для высочайшего контроля и точного паса.",
    images: ["assets/img/balls/ball-laliga.jpg"], isNew: true, stock: 30
  },
  {
    id: "ball-epl", name: "Мяч EPL", brand: "Nike",
    category: "balls", subcategory: "МЯЧИ ТОП-5 ЛИГ", productType: "Match ball",
    price: 9000, sizes: ["5"], level: "PRO", surface: ["FIFA Quality Pro"], generation: "2024/25",
    material: "PU", weight: "410–450 г",
    description: "Официальный мяч английской Премьер-лиги 24/25. Фирменные звёзды и яркий дизайн — для точных передач и мощных ударов.",
    images: ["assets/img/balls/ball-epl.jpg"], isNew: true, stock: 30
  },
  {
    id: "ball-bundesliga", name: "Мяч Bundesliga", brand: "adidas",
    category: "balls", subcategory: "МЯЧИ ТОП-5 ЛИГ", productType: "Match ball",
    price: 9000, sizes: ["5"], level: "PRO", surface: ["FIFA Quality Pro"], generation: "2024/25",
    material: "PU", weight: "410–450 г",
    description: "Мяч немецкой Бундеслиги 24/25. Контрастное исполнение и отличный отскок на любом газоне.",
    images: ["assets/img/balls/ball-bundesliga.jpg"], isNew: true, stock: 30
  },
  {
    id: "ball-seria", name: "Мяч Serie A", brand: "Puma",
    category: "balls", subcategory: "МЯЧИ ТОП-5 ЛИГ", productType: "Match ball",
    price: 9000, sizes: ["5"], level: "PRO", surface: ["FIFA Quality Pro"], generation: "2024/25",
    material: "PU", weight: "410–450 г",
    description: "Мяч итальянской Серии А 24/25. Аккуратная раскраска и стабильный полёт — вместе с кальчо.",
    images: ["assets/img/balls/ball-seria.jpg"], isNew: true, stock: 30
  },
  /* ─────────────────────── МЯЧИ · ЛИГА ЧЕМПИОНОВ ────────────────────── */
  {
    id: "ball-champions", name: "Мяч Champions League", brand: "adidas",
    category: "balls", subcategory: "МЯЧИ ЛИГИ ЧЕМПИОНОВ", productType: "Match ball",
    price: 9000, sizes: ["5"], level: "PRO", surface: ["FIFA Quality Pro"], generation: "2024/25",
    material: "PU", weight: "410–450 г",
    description: "Официальный мяч Лиги чемпионов. Звёздная панель и фирменный дизайн европейской короны — как в финалах турнира.",
    images: ["assets/img/balls/chl-1.webp","assets/img/balls/chl-2.jpg","assets/img/balls/chl-3.jpg"], featured: true, isNew: true, stock: 25
  },
  /* ─────────────────────── МЯЧИ · ЧЕМПИОНАТ МИРА ─────────────────────── */
  {
    id: "ball-brazuca-2014", name: "Мяч Brazuca 2014", brand: "adidas",
    category: "balls", subcategory: "МЯЧИ ЧЕМПИОНАТА МИРА", productType: "Official match ball",
    price: 9000, sizes: ["5"], level: "PRO", surface: ["FIFA Quality Pro"], generation: "2014",
    material: "PU", weight: "410–450 г",
    description: "Легендарный Brazuca — официальный мяч ЧМ-2014 в Бразилии: шесть панелей и культовый узор.",
    images: ["assets/img/balls/ball-brazuca-2014.jpg"], isNew: true, stock: 25
  },
  {
    id: "ball-qatar-2022", name: "Мяч Qatar 2022", brand: "adidas",
    category: "balls", subcategory: "МЯЧИ ЧЕМПИОНАТА МИРА", productType: "Official match ball",
    price: 9000, sizes: ["5"], level: "PRO", surface: ["FIFA Quality Pro"], generation: "2022",
    material: "PU", weight: "410–450 г",
    description: "Al Rihla — официальный мяч ЧМ-2022 в Катаре. Быстрый полёт и увеличенные зоны для точного контроля.",
    images: ["assets/img/balls/ball-qatar-2022.jpg"], isNew: true, stock: 25
  },
  {
    id: "ball-telstar-2018", name: "Мяч Telstar 2018", brand: "adidas",
    category: "balls", subcategory: "МЯЧИ ЧЕМПИОНАТА МИРА", productType: "Official match ball",
    price: 9000, sizes: ["5"], level: "PRO", surface: ["FIFA Quality Pro"], generation: "2018",
    material: "PU", weight: "410–450 г",
    description: "Telstar — официальный мяч ЧМ-2018 в России. Легендарная чёрно-белая панельная схема в современном прочтении.",
    images: ["assets/img/balls/ball-telstar-2018.jpg"], isNew: true, stock: 25
  },
  {
    id: "ball-trionda-2026", name: "Мяч Trionda 2026", brand: "adidas",
    category: "balls", subcategory: "МЯЧИ ЧЕМПИОНАТА МИРА", productType: "Official match ball",
    price: 9000, sizes: ["5"], level: "PRO", surface: ["FIFA Quality Pro"], generation: "2026",
    material: "PU", weight: "410–450 г",
    description: "Trionda — официальный мяч ЧМ-2026. Футуристичный дизайн и новая панельная конструкция.",
    images: ["assets/img/balls/ball-trionda-2026.webp"], featured: true, isNew: true, stock: 25
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
  jersey: { ru: "Форма", code: "ФОРМА" },
  retro: { ru: "Ретро", code: "RETRO" },
  training: { ru: "Тренировочные комплекты", code: "ТРЕНИРОВОЧНЫЕ КОМПЛЕКТЫ" },
  shorts: { ru: "Шорты", code: "ФУТБОЛЬНЫЕ ШОРТЫ" },
  socks: { ru: "Гетры и носки", code: "ГЕТРЫ И НОСКИ" },
  accessories: { ru: "Аксессуары", code: "АКСЕССУАРЫ" },
  gk: { ru: "Вратарская экипировка", code: "ВРАТАРСКАЯ ЭКИПИРОВКА" },
  balls: { ru: "Мячи", code: "МЯЧИ" },
  street: { ru: "Street Football", code: "STREET FOOTBALL" }
};

const STORAGE_KEY = "phantom_catalog_overrides";
const RESET_FLAG = "phantom_catalog_reset_v1";

/* ============================================================================
   Хранилище: объединяет дефолтные данные с правками из localStorage (CMS)
   ============================================================================ */
const Catalog = {
  getAll() {
    if (!localStorage.getItem(RESET_FLAG)) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(RESET_FLAG, "1");
    }
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
