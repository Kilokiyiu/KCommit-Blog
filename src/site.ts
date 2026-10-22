export const site = {
  name: 'Your Name',
  githubUser: 'your-github',
  email: 'you@example.com',
  tagline: 'commit 日记',
  /** 首页个人卡片：名字旁的小字 */
  profileBio: '用 Markdown 记踩坑与复盘。Fork 后改这里的文案即可。',
  /** 首页个人卡片：头像名字下方的大字标题 */
  profileHeadline: '先跑通，再打磨。',
  description:
    '基于 Astro 的个人博客主题模板。文章、项目、友链、说说都用本地 Markdown 维护。',
  avatar: '/img/avatar.png',
  /** 浏览器标签页图标；建议小图，别直接用大头像 */
  favicon: '/favicon.png',
  /** 全站背景图；换图只需改这里 */
  backgroundImage: '/img/wallpaper/static/img_1.png',
  backgroundImageMobile: '/img/wallpaper/static-mobile/0001/modile.png',
  /**
   * 图片命名：kebab-case；目录=类别；内容图文件名=对应 slug；统一 .png。
   * - /img/covers/{slug|default}.png
   * - /img/projects/{slug}.png
   * - /img/bento/featured.png | wall-{n}.png（轮播照片墙）
   * - /img/shares/{slug}.png
   */
  /** 文章/文档没写 cover 时的默认图 */
  covers: {
    fallback: ['/img/covers/default.png'],
  },
  /** 首页精选区；只用 bento 目录里的图 */
  bento: {
    featured: '/img/bento/featured.png',
    /**
     * 左侧轮播：祝福卡 + 四季墙。
     * 四季图：public/img/bento/wall-{spring|summer|autumn|winter}.jpg，想换直接覆盖。
     * 照片墙只配 image + caption，不要链去别处。
     */
    carousel: [
      {
        type: 'blessing' as const,
        href: '/notes/',
        kicker: '欢迎',
        /** 编辑器里的注释祝福 */
        text: '预祝：代码跑通无 BUG !!',
        /** 下面文字区的说明 */
        caption: 'Fork 后从这里开始改。',
      },
      {
        type: 'image' as const,
        image: '/img/bento/wall-spring.jpg',
        caption: '春 · 樱花小路',
      },
      {
        type: 'image' as const,
        image: '/img/bento/wall-summer.jpg',
        caption: '夏 · 海风与阳光',
      },
      {
        type: 'image' as const,
        image: '/img/bento/wall-autumn.jpg',
        caption: '秋 · 红叶漫路',
      },
      {
        type: 'image' as const,
        image: '/img/bento/wall-winter.jpg',
        caption: '冬 · 雪夜暖窗',
      },
    ],
  },
  about: {
    headline: '关于',
    paragraphs: [
      '这是 KCommit-Blog 的示例「关于」页。把这段话换成你自己的介绍即可。',
      '本模板用 Astro 静态输出，内容放在 src/content，站点文案集中在 src/site.ts。',
      '部署可走 Cloudflare Pages：构建命令 npm run build，输出目录 dist。',
      '有问题可以改联系页里的邮箱和 GitHub，或在 Issues 里提问。',
    ],
  },
  contact: {
    intro: '邮件最慢，但一定能收到。也可以从 GitHub 找到我。',
    /** 可选：公开 QQ；不需要就留空字符串或删掉该字段 */
    qq: '',
    wechatNote: '公开联系以邮件和 GitHub 为准。',
  },
  /**
   * 友链星图：/friends/
   * - zodiac: aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces
   * - 头像可选：public/img/friends/{id}.png
   */
  friends: {
    intro: '十二张星座图，每次随机一张；亮星是友链。',
    applyNote: '按模板填好站点名、链接和介绍，发送邮件就行。',
    /** 本站信息，方便对方加链接 */
    self: {
      name: 'Your Name · commit 日记',
      url: 'https://example.com/',
      description: '基于 Astro 的个人博客主题。',
      avatar: '/img/avatar.png',
    },
    items: [
      {
        id: 'astro',
        name: 'Astro',
        url: 'https://astro.build',
        description: '本站用的框架。文档写得很清楚。',
        zodiac: 'leo',
      },
      {
        id: 'cloudflare',
        name: 'Cloudflare',
        url: 'https://www.cloudflare.com',
        description: 'Pages 托管方。部署省心。',
        zodiac: 'aquarius',
      },
      {
        id: 'github',
        name: 'GitHub',
        url: 'https://github.com',
        description: '代码都住这儿。',
        zodiac: 'gemini',
      },
      {
        id: 'mdn',
        name: 'MDN Web Docs',
        url: 'https://developer.mozilla.org',
        description: '前端卡住时最先翻的地方。',
        zodiac: 'virgo',
      },
      {
        id: 'giscus',
        name: 'Giscus',
        url: 'https://giscus.app',
        description: '用 Discussions 做评论。',
        zodiac: 'pisces',
      },
    ],
  },
  /** 首页右侧播放器；换歌改这里，文件放 public/music/ */
  playlist: [
    {
      title: 'LOVE PARADISE',
      artist: '陈慧琳',
      src: '/music/陈慧琳 - LOVE PARADISE.mp3',
    },
    {
      title: '生来倔强',
      artist: '南征北战NZBZ',
      src: '/music/南征北战NZBZ - 生来倔强.mp3',
    },
    {
      title: 'Beauty and the Beast',
      artist: 'Céline Dion / Peabo Bryson',
      src: '/music/Beauty and the Beast.mp3',
    },
  ],
  /**
   * Giscus 评论（GitHub Discussions）。
   * 新仓库建好后去 https://giscus.app 生成配置，填齐并把 enabled 设为 true。
   */
  giscus: {
    enabled: false,
    repo: '',
    repoId: '',
    category: '',
    categoryId: '',
    mapping: 'pathname',
    strict: '0',
    reactionsEnabled: '1',
    emitMetadata: '0',
    inputPosition: 'bottom',
    theme: 'noborder_light',
    lang: 'zh-CN',
    loading: 'lazy',
  },
};

export const nav = [
  { href: '/', label: '首页', icon: 'home', match: (path: string) => path === '/' },
  { href: '/posts/', label: '文章', icon: 'posts', match: (path: string) => path.startsWith('/posts') },
  { href: '/docs/', label: '文档', icon: 'docs', match: (path: string) => path.startsWith('/docs') },
  { href: '/shares/', label: '分享', icon: 'shares', match: (path: string) => path.startsWith('/shares') },
  { href: '/notes/', label: '说说', icon: 'notes', match: (path: string) => path.startsWith('/notes') },
  { href: '/projects/', label: '项目', icon: 'projects', match: (path: string) => path.startsWith('/projects') },
  { href: '/friends/', label: '友链', icon: 'friends', match: (path: string) => path.startsWith('/friends') },
  { href: '/about/', label: '关于我', icon: 'about', match: (path: string) => path.startsWith('/about') },
  { href: '/contact/', label: '联系', icon: 'contact', match: (path: string) => path.startsWith('/contact') },
] as const;
