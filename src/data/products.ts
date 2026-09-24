import { Product, VideoPost, UserUploadedVideo, UserProfile, Conversation } from '../types';

export const PAKISTANI_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Bahawalpur",
  "Sargodha",
  "Sukkur",
  "Abbottabad",
  "Mirpur (AJK)",
  "Mardan"
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: {
      en: "Ultra Max 2 Smartwatch with AMOLED Display & Bluetooth Calling",
      ru: "Ultra Max 2 Smartwatch AMOLED Display & Bluetooth Calling ke sath",
      ur: "الٹرا میکس 2 اسمارٹ واچ بمعہ ایمولیڈ ڈسپلے اور بلوٹوتھ کالنگ"
    },
    category: "tech",
    categoryLabel: {
      en: "Tech & Gadgets",
      ru: "Tech & Gadgets",
      ur: "ٹیکنالوجی اور گیجٹس"
    },
    pricePKR: 3499,
    originalPricePKR: 5999,
    discountPercent: 42,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 428,
    soldCount: "3.4k",
    badge: {
      en: "🔥 #1 Viral Gadget in PK",
      ru: "🔥 Pakistan Mein No. 1 Viral",
      ur: "🔥 پاکستان کا نمبر 1 وائرل گیجٹ"
    },
    description: {
      en: "The viral titanium-finish smartwatch with ultra-bright AMOLED curved glass, crystal clear Bluetooth calling, IP68 water resistance, and 7-day battery life.",
      ru: "Viral titanium smartwatch jis mein AMOLED screen, saaf Bluetooth calling, water resistance aur 7 din ki battery timing hai.",
      ur: "خوبصورت ٹائٹینیم ڈیزائن والی اسمارٹ واچ جس میں ایمولیڈ ڈسپلے، ایچ ڈی کالنگ، واٹر پروفنگ اور 7 دن کی لمبی بیٹری لائف ہے۔"
    },
    features: {
      en: [
        "Crisp 2.02 inch Always-on AMOLED Screen",
        "HD Dual-Mic Bluetooth Calling & Contacts Sync",
        "Heart Rate, SpO2, Sleep & 100+ Sports Trackers",
        "Comes with 2 Straps (Ocean Silicone + Alpine Loop)"
      ],
      ru: [
        "2.02 inch Always-on AMOLED Behtareen Screen",
        "HD Mic ke sath Phone Calls suniye aur kijiye",
        "Heart Rate, Blood Oxygen aur 100+ Sports Modes",
        "Box mein 2 straps muft shamil hain"
      ],
      ur: [
        "2.02 انچ روشن آل ویز آن ایمولیڈ اسکرین",
        "واضح آواز کے ساتھ ڈوئل مائیک بلوٹوتھ کالنگ",
        "دل کی دھڑکن اور 100 سے زائد اسپورٹس موڈز",
        "باکس میں 2 اسٹریپس بالکل مفت شامل ہیں"
      ]
    }
  },
  {
    id: "p2",
    title: {
      en: "Pro Wireless ANC Earbuds with Heavy Bass & Quad Mic ENC",
      ru: "Pro Wireless ANC Earbuds Heavy Bass & Quad Mic ENC ke sath",
      ur: "پرو وائرلیس اے این سی ایئربڈز بمعہ طاقتور باس اور 4 مائیک"
    },
    category: "tech",
    categoryLabel: {
      en: "Tech & Gadgets",
      ru: "Tech & Gadgets",
      ur: "ٹیکنالوجی اور گیجٹس"
    },
    pricePKR: 2199,
    originalPricePKR: 3999,
    discountPercent: 45,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 312,
    soldCount: "2.1k",
    badge: {
      en: "⚡ Flash Sale Deal",
      ru: "⚡ Flash Sale Offer",
      ur: "⚡ خصوصی فلیش سیل ڈیل"
    },
    description: {
      en: "Active Noise Cancellation (ANC) with deep cinematic sub-bass, 36 hours total battery, and fast USB-C instant pairing.",
      ru: "Active Noise Cancellation aur zabardast bass. 36 ghantay ki battery backup aur Type-C fast charging.",
      ur: "شور مٹانے والی ایکٹو نوائز کینسلیشن (ANC) ٹیکنالوجی، سنیماٹک باس اور 36 گھنٹے کا بیٹری بیک اپ۔"
    },
    features: {
      en: [
        "-30dB Active Noise Cancellation",
        "Gaming Mode with 45ms Ultra-low Latency",
        "Environmental Noise Canceling (ENC) for crystal calls",
        "IPX5 Sweat & Rain Resistance"
      ],
      ru: [
        "Shor khatam karne wala Active Noise Cancellation",
        "PUBG/Gaming ke liye bina delay low latency",
        "Calling ke liye 4 clear microphones",
        "Pasina aur barish se mehfooz (IPX5)"
      ],
      ur: [
        "باہر کا شور ختم کرنے والی جدید اے این سی ٹیکنالوجی",
        "گیمنگ اور پب جی کے لیے فوری رسپانس موڈ",
        "کالز کے دوران شور روکنے والے 4 حساس مائیکروفونز",
        "پسینے اور پانی کے چھینٹوں سے محفوظ"
      ]
    }
  },
  {
    id: "p3",
    title: {
      en: "Nordic Sunset Projection Lamp with 16 RGB Mood Colors & Remote",
      ru: "Sunset Projection Lamp 16 RGB Rang aur Remote ke sath",
      ur: "سن سیٹ پروجیکشن لیمپ بمعہ 16 خوبصورت رنگ اور ریموٹ کنٹرول"
    },
    category: "decor",
    categoryLabel: {
      en: "Home & Room Decor",
      ru: "Ghar & Room Decor",
      ur: "گھر اور کمرے کی سجاوٹ"
    },
    pricePKR: 1450,
    originalPricePKR: 2500,
    discountPercent: 42,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    reviewsCount: 189,
    soldCount: "1.8k",
    badge: {
      en: "✨ Room Aesthetic",
      ru: "✨ TikTok Aesthetic",
      ur: "✨ ٹک ٹاک روم لیمپ"
    },
    description: {
      en: "Transform any bedroom or studio into a golden hour paradise. 16 vibrant RGB hues with remote controller and 360-degree adjustable angle.",
      ru: "Apne kamray ko khoobsoorat sunset aesthetic dein. 16 mukhtalif rang remote control ke sath aasan istemal.",
      ur: "اپنے کمرے یا اسٹوڈیو کو سنہری دھوپ جیسا پرکشش بنائیں، 16 رنگوں کا خوبصورت امتزاج اور ریموٹ کنٹرول۔"
    },
    features: {
      en: [
        "16 Dynamic Colors + 4 Gradient Glow Modes",
        "Wireless Infrared Remote Control Included",
        "Thickened Crystal Optical Lens for HD Projection",
        "USB Powered (Works on Power Banks & Laptops)"
      ],
      ru: [
        "16 khoobsoorat rang aur multi-color glow",
        "Remote control shamil hai",
        "Crystal glass lens jo saaf roshni phenkta hai",
        "USB port se power bank ya charger par chalayein"
      ],
      ur: [
        "16 دلکش رنگ اور ملٹی کلر گریڈینٹ موڈز",
        "وائرلیس ریموٹ کنٹرول باکس میں موجود ہے",
        "کرسٹل ایچ ڈی آپٹیکل لینس",
        "یو ایس بی یا پاور بینک سے چلنے والا لیمپ"
      ]
    }
  },
  {
    id: "p4",
    title: {
      en: "Hydra-Glow Vitamin C & Niacinamide Radiance Face Serum (30ml)",
      ru: "Hydra-Glow Vitamin C aur Niacinamide Face Serum (30ml)",
      ur: "ہائیڈرا گلو وٹامن سی اور نیاسینامائڈ فیس سیرم (30 ملی لیٹر)"
    },
    category: "beauty",
    categoryLabel: {
      en: "Beauty & Skincare",
      ru: "Beauty & Skincare",
      ur: "خوبصورتی اور جِلد کی دیکھ بھال"
    },
    pricePKR: 1899,
    originalPricePKR: 2800,
    discountPercent: 32,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 520,
    soldCount: "4.7k",
    badge: {
      en: "🌟 100% Organic Formula",
      ru: "🌟 100% Khalis Formula",
      ur: "🌟 100% قدرتی و خالص فارمولا"
    },
    description: {
      en: "Clinically formulated brightening facial serum infused with 10% Pure Vitamin C, 5% Niacinamide, and Hyaluronic Acid to fade blemishes and boost natural Pakistani skin glow.",
      ru: "Chahray ki chhaiyan, daagh dhabay khatam kar ke qudrati chamak lanay wala serum. Pakistani skin ke mutabiq tayar shuda.",
      ur: "وٹامن سی اور نیاسینامائڈ سے بھرپور سیرم جو داغ دھبے دور کر کے چہرے کو قدرتی چمک اور شادابی بخشتا ہے۔"
    },
    features: {
      en: [
        "Fades Sunspots, Dark Circles & Acne Scars",
        "Deep Hyaluronic Hydration for Plump Skin",
        "Paraben-Free, Cruelty-Free & Dermatologist Tested",
        "Visible Results in Just 14 Days"
      ],
      ru: [
        "Dhoop aur acne ke daagh dhabay door kare",
        "Skin ko gehra namm aur taro taza rakhe",
        "Bina kisi muzir chemical ke khalisaat se bana",
        "Sirf 14 dino mein wazeh farq dekhein"
      ],
      ur: [
        "دھوپ اور کیل مہاسوں کے نشانات ختم کرے",
        "جلد کو گہری نمی اور تازگی بخشے",
        "بغیر کسی مضر کیمیکل کے ماہرین جِلد سے تصدیق شدہ",
        "صرف 14 دنوں میں واضح نتائج"
      ]
    }
  },
  {
    id: "p5",
    title: {
      en: "FreshJuice Portable Wireless USB Rechargeable Blender Bottle",
      ru: "FreshJuice Portable Wireless Rechargeable Blender Bottle",
      ur: "فریش جوس پورٹ ایبل وائرلیس ریچارج ایبل بلینڈر بوتل"
    },
    category: "kitchen",
    categoryLabel: {
      en: "Kitchen & Fitness",
      ru: "Kitchen & Fitness",
      ur: "کچن اور فٹنس"
    },
    pricePKR: 2750,
    originalPricePKR: 4500,
    discountPercent: 39,
    image: "https://images.unsplash.com/photo-1570831739427-4f24d8fa2a63?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 236,
    soldCount: "1.5k",
    badge: {
      en: "🥤 Viral Gym Must-Have",
      ru: "🥤 Gym & Travel Item",
      ur: "🥤 جم اور سفر کیلئے ضروری"
    },
    description: {
      en: "Powerful 4-blade stainless steel motor crushes fruits, ice, and protein shakes in 30 seconds. Wireless magnetic dock charging and leak-proof carry ring.",
      ru: "30 second mein fresh juice, shake aur smoothie banayein. Wireless magnetic charging aur travel bottle design.",
      ur: "طاقتور سٹین لیس اسٹیل بلیڈز کے ساتھ 30 سیکنڈ میں تازہ جوس، شیک اور اسموتھی تیار کریں۔ پورٹ ایبل ڈیزائن۔"
    },
    features: {
      en: [
        "350ml BPA-Free Food Grade Tritan Material",
        "1400mAh Battery makes 15+ Smoothies per Charge",
        "Waterproof Body (Rinse directly under tap)",
        "Safety Sensor: Won't start if lid is open"
      ],
      ru: [
        "350ml safe food grade material",
        "Ek baar charge karne par 15+ juices banaye",
        "Waterproof body, paani se aasan dhulai",
        "Bina dhakkan fit huay machine start nahi hogi"
      ],
      ur: [
        "350 ملی لیٹر محفوظ فوڈ گریڈ بوتل",
        "ایک چارج میں 15 سے زائد شیکس بنائیں",
        "واٹر پروف باڈی، پانی سے آسان صفائی",
        "حفاظتی سینسر: ڈھکن بند ہونے پر ہی چلے گا"
      ]
    }
  },
  {
    id: "p6",
    title: {
      en: "AirFlex Cloud Breathable Streetwear Sneakers (All Black Edition)",
      ru: "AirFlex Cloud Breathable Streetwear Sneakers (All Black)",
      ur: "ایئر فلیکس کلاؤڈ اسٹریٹ ویئر اسنیکرز (آل بلیک ایڈیشن)"
    },
    category: "fashion",
    categoryLabel: {
      en: "Fashion & Footwear",
      ru: "Fashion & Joote",
      ur: "فیشن اور جوتے"
    },
    pricePKR: 4200,
    originalPricePKR: 6500,
    discountPercent: 35,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 388,
    soldCount: "2.9k",
    badge: {
      en: "👟 Top Trending Streetwear",
      ru: "👟 Top Trending Style",
      ur: "👟 ٹاپ ٹرینڈنگ اسنیکرز"
    },
    description: {
      en: "Cloud-foam cushioned athletic sneakers built for maximum comfort, all-day walking, gym sessions, and streetwear aesthetic.",
      ru: "Naram sole aur hawa daar fabric ke sath banaye gaye stylish sneakers. Sara din chalne ke liye intehai aaram deh.",
      ur: "نرم کشن والے اسپورٹس جوتے جو سارا دن چلنے، جم اور فیشن کے لیے انتہائی آرام دہ ہیں۔"
    },
    features: {
      en: [
        "Shock-absorbing CloudFoam Memory Sole",
        "Breathable Flyknit Mesh keeps feet dry",
        "Anti-skid Rubber Outsole Grip",
        "True to Size (Sizes 40 to 45 Available)"
      ],
      ru: [
        "Jhatkon se mehfooz naram memory foam",
        "Paseena na aanay dene wala breathable mesh",
        "Mazboot grip jo phisalne na de",
        "Pakistani size 40 se 45 dastyab"
      ],
      ur: [
        "جھٹکوں سے محفوظ رکھنے والا نرم کلاؤڈ فوم سول",
        "ہوا دار فیبرک جو پاؤں کو ٹھنڈا اور خشک رکھے",
        "مضبوط ربڑ گرفت جو پھسلنے سے بچائے",
        "تمام پاکستانی سائز 40 تا 45 دستیاب"
      ]
    }
  },
  {
    id: "p7",
    title: {
      en: "Oversized Streetwear Fleece Hoodie (Karachi Drop)",
      ru: "Oversized Streetwear Fleece Hoodie (Karachi Edition)",
      ur: "اوور سائزڈ اسٹریٹ ویئر فلیس ہوڈی (کراچی ایڈیشن)"
    },
    category: "fashion",
    categoryLabel: {
      en: "Fashion & Apparel",
      ru: "Fashion & Kapray",
      ur: "فیشن اور ملبوسات"
    },
    pricePKR: 3200,
    originalPricePKR: 4999,
    discountPercent: 36,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    reviewsCount: 184,
    soldCount: "1.2k",
    badge: {
      en: "🔥 Viral Streetwear Drop",
      ru: "🔥 Trending Winter Drop",
      ur: "🔥 ٹرینڈنگ اسٹریٹ ویئر"
    },
    description: {
      en: "Heavyweight 380 GSM combed cotton fleece hoodie with premium kangaroo pocket, drop shoulder cut, and aesthetic minimalist finish.",
      ru: "Bhari 380 GSM fleece kapra, drop-shoulder aesthetic aur garm aaram deh style. Karachi aur Lahore ke sardi ke liye behtareen.",
      ur: "اعلیٰ معیار کا 380 جی ایس ایم فلیس فیبرک، آرام دہ ڈراپ شولڈر کٹنگ اور سردیوں کا شاندار اسٹائل۔"
    },
    features: {
      en: [
        "Heavyweight 380 GSM 100% Combed Cotton",
        "Anti-Pilling & Pre-shrunk Premium Fabric",
        "Relaxed Aesthetic Drop-Shoulder Fit",
        "Available in Charcoal, Pitch Black & Olive"
      ],
      ru: [
        "Bhari 380 GSM khalis cotton fleece",
        "Rang kharab nahi hoga aur roan nahi aayega",
        "Trendy oversized drop shoulder fitting",
        "Charcoal, Black aur Olive rangon mein dastyab"
      ],
      ur: [
        "اعلیٰ 380 جی ایس ایم گرم فلیس فیبرک",
        "رنگ خراب نہ ہونے والا پائیدار کپڑا",
        "ٹرینڈنگ اوور سائزڈ فٹنگ",
        "چارکول بلیک اور زیتونی رنگوں میں دستیاب"
      ]
    }
  },
  {
    id: "p8",
    title: {
      en: "Pro Glam 12-Piece Cruelty-Free Makeup Brush Set & Vanity Bag",
      ru: "Pro Glam 12-Piece Makeup Brush Set & Pouch",
      ur: "پرو گلیم 12 پیس میک اپ برش سیٹ بمعہ وینٹی پاؤچ"
    },
    category: "beauty",
    categoryLabel: {
      en: "Beauty & Cosmetics",
      ru: "Beauty & Cosmetics",
      ur: "خوبصورتی اور میک اپ"
    },
    pricePKR: 1950,
    originalPricePKR: 3500,
    discountPercent: 44,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    reviewsCount: 295,
    soldCount: "2.4k",
    badge: {
      en: "✨ Salon Quality at Home",
      ru: "✨ Salon Grade Brushes",
      ur: "✨ بیوٹی پارلر جیسی کوالٹی"
    },
    description: {
      en: "Ultra-soft vegan nanofiber bristles with electroplated rose gold ferrule and matte wooden handles. Flawless blending for foundation, blush, eyes, and contours.",
      ru: "Narm tareen vegan nanofiber bristles jo foundation aur blush ko makhan ki tarah blend karte hain. Box mein stylish travel bag shamil.",
      ur: "نہایت نرم ویگن نینو فائبر برسلز جو فاؤنڈیشن اور بلش کو بہترین طریقے سے بلینڈ کریں۔ ساتھ اسٹائلش پاؤچ شامل۔"
    },
    features: {
      en: [
        "12 Essential Professional Face & Eye Brushes",
        "Zero Shedding Ultra-Soft Synthetic Nanofibers",
        "Ergonomic Wooden Handles with Rose Gold Accent",
        "Free Waterproof Velvet Zipper Travel Pouch"
      ],
      ru: [
        "Face aur eyes ke liye mukammal 12 brushes",
        "Baal nahi jhartay aur skin par narm hain",
        "Khoobsurat Rose Gold aur lakri ka handle",
        "Travel pouch muft shamil hai"
      ],
      ur: [
        "چہرے اور آنکھوں کے لیے مکمل 12 برشز",
        "جھڑنے سے محفوظ الٹرا سافٹ فائبر",
        "خوبصورت روز گولڈ ڈیزائن",
        "مفت واٹر پروف ٹریول پاؤچ"
      ]
    }
  }
];

export const INITIAL_VIDEOS: VideoPost[] = [
  {
    id: "v1",
    videoUrl: "https://assets.mixkit.co/videos/41485/41485-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    creator: {
      name: "TechBeast Pakistan",
      handle: "@techbeast.pk",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    description: {
      en: "Unboxing the viral Ultra Max 2 Smartwatch in Pakistan! Calling is super clear and AMOLED display is insane 🔥 Cash on delivery available!",
      ru: "Ultra Max 2 Smartwatch ka unboxing! Calls bilkul saaf hain aur AMOLED screen zabardast hai 🔥 Pure Pakistan mein Cash on Delivery dastyab hai!",
      ur: "پاکستان کی وائرل الٹرا میکس 2 اسمارٹ واچ کی ان باکسنگ! کالز صاف اور ایمولیڈ اسکرین لاجواب ہے 🔥 پورے پاکستان میں کیش آن ڈیلیوری دستیاب ہے!"
    },
    tags: ["#PikPokDeals", "#SmartwatchPK", "#TechGadgets", "#CashOnDelivery", "#DarazFinds"],
    soundTitle: "Trending Beats • Coke Studio Sound Pack",
    likesCount: 24800,
    commentsCount: 342,
    sharesCount: 1840,
    isLiked: false,
    isFollowed: true,
    isFriend: false,
    feedCategory: ['foryou', 'following'],
    product: INITIAL_PRODUCTS[0],
    commentsList: [
      {
        id: "c1",
        user: "Babar Azam Fan",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
        city: "Lahore",
        text: "Maine order ki thi, 2 din mein Lahore agayi. Calling quality sach mein top notch hai!",
        likes: 89,
        timeAgo: "2h ago",
        verifiedBuyer: true
      },
      {
        id: "c2",
        user: "Zeeshan Tech",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
        city: "Karachi",
        text: "Bhai kya rider ke samnay parcel khol kar check kar sakte hain?",
        likes: 34,
        timeAgo: "4h ago",
        verifiedBuyer: false
      }
    ]
  },
  {
    id: "v2",
    videoUrl: "https://assets.mixkit.co/videos/40994/40994-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    creator: {
      name: "Zainab Audio Lab",
      handle: "@zainab.audio",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    description: {
      en: "ANC Wireless Earbuds sound test! Deep punchy bass and no background noise at all 🎧 Only Rs. 2,199 today on PikPok!",
      ru: "ANC Earbuds ka live sound test! Behtareen heavy bass aur background shor bilkul band 🎧 Aaj PikPok par sirf Rs. 2,199 mein!",
      ur: "اے این سی وائرلیس ایئربڈز کا ساؤنڈ ٹیسٹ! طاقتور باس اور باہر کا شور بالکل بند 🎧 پک پوک پر آج صرف 2,199 روپے میں!"
    },
    tags: ["#WirelessEarbuds", "#ANC", "#BassHeadsPK", "#ViralGadget", "#PikPokShop"],
    soundTitle: "Audio Test • Bass Boosted Stereo 8D",
    likesCount: 19300,
    commentsCount: 215,
    sharesCount: 940,
    isLiked: false,
    isFollowed: true,
    isFriend: true,
    feedCategory: ['foryou', 'following', 'friends'],
    product: INITIAL_PRODUCTS[1],
    commentsList: [
      {
        id: "c4",
        user: "Sana Tariq",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        city: "Rawalpindi",
        text: "Voice calls par mic kaisa hai? Heavy bass hai?",
        likes: 14,
        timeAgo: "5h ago",
        verifiedBuyer: false
      }
    ]
  },
  {
    id: "v3",
    videoUrl: "https://assets.mixkit.co/videos/42510/42510-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    creator: {
      name: "Lahore Room Aesthetics",
      handle: "@room_aesthetics_lhr",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=150&q=80",
      verified: false
    },
    description: {
      en: "This Rs. 1,450 sunset projection lamp made my room look like a Pinterest board 🌅 16 colors with wireless remote! Swipe to buy!",
      ru: "Sirf Rs. 1,450 ka Sunset Lamp jis ne poora kamra Pinterest jaisa aesthetic bana diya 🌅 16 colors remote ke sath! Foran order karein!",
      ur: "صرف 1,450 روپے کا سن سیٹ لیمپ جس نے کمرے کو پن ٹریسٹ جیسا دلفریب بنا دیا 🌅 16 دلکش رنگ ریموٹ کے ساتھ!"
    },
    tags: ["#SunsetLamp", "#RoomDecorPK", "#AestheticVibes", "#HomeMakeover", "#PikPokFinds"],
    soundTitle: "Chill Lofi Beats • Sunset In Karachi",
    likesCount: 31200,
    commentsCount: 489,
    sharesCount: 3410,
    isLiked: false,
    isFollowed: false,
    isFriend: true,
    feedCategory: ['foryou', 'friends'],
    product: INITIAL_PRODUCTS[2],
    commentsList: [
      {
        id: "c6",
        user: "Maryam Sheikh",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
        city: "Faisalabad",
        text: "Photoshoot ke liye perfect lighting hai!",
        likes: 67,
        timeAgo: "1d ago",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "v4",
    videoUrl: "https://assets.mixkit.co/videos/41315/41315-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    creator: {
      name: "Glam With Ayesha",
      handle: "@glam_ayesha",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    description: {
      en: "My holy grail Pakistani skincare serum! Vitamin C + Niacinamide worked wonders on my sun tan and acne marks in 2 weeks ✨",
      ru: "Mera pasandeeda skincare serum! Vitamin C aur Niacinamide ne dhoop ka asar aur daagh 2 hafton mein saaf kar diye ✨",
      ur: "پاکستانی موسم کے مطابق بہترین اسکن کیئر سیرم! وٹامن سی اور نیاسینامائڈ نے 2 ہفتوں میں چہرے کے داغ صاف کر دیے ✨"
    },
    tags: ["#SkincarePakistan", "#GlassSkin", "#VitaminCSerum", "#HalalBeauty", "#PikPokShop"],
    soundTitle: "Glow Routine • Soft Ambient Chill",
    likesCount: 15400,
    commentsCount: 198,
    sharesCount: 1210,
    isLiked: false,
    isFollowed: true,
    isFriend: false,
    feedCategory: ['foryou', 'following'],
    product: INITIAL_PRODUCTS[3],
    commentsList: [
      {
        id: "c7",
        user: "Alishba Khan",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
        city: "Islamabad",
        text: "Sensitive skin ke liye theek hai na? Koi reaction tou nahi hota?",
        likes: 28,
        timeAgo: "3h ago",
        verifiedBuyer: true
      }
    ]
  },
  {
    id: "v5",
    videoUrl: "https://assets.mixkit.co/videos/43360/43360-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1570831739427-4f24d8fa2a63?auto=format&fit=crop&w=800&q=80",
    creator: {
      name: "Karachi Fitness Club",
      handle: "@khi_fitness",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    description: {
      en: "Making protein shake in my car with this portable blender bottle! 30 seconds and boom 🍌 Pure ice crusher! Cash on delivery available!",
      ru: "Gaari mein chalte phirtay protein shake aur fresh juice banayein! Sirf 30 seconds mein barf crush kar deta hai 🍌 Cash on delivery dastyab!",
      ur: "چلتے پھرتے تازہ جوس اور پروٹین شیک بنائیں! صرف 30 سیکنڈز میں برف بھی کچل دیتا ہے 🍌 کیش آن ڈیلیوری دستیاب!"
    },
    tags: ["#FreshJuice", "#FitnessPakistan", "#GymLife", "#KitchenGadgets", "#PikPokViral"],
    soundTitle: "Workout Motivation • High Energy Beat",
    likesCount: 22100,
    commentsCount: 270,
    sharesCount: 1620,
    isLiked: false,
    isFollowed: false,
    isFriend: true,
    feedCategory: ['foryou', 'friends'],
    product: INITIAL_PRODUCTS[4],
    commentsList: []
  },
  {
    id: "v6",
    videoUrl: "https://assets.mixkit.co/videos/43301/43301-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    creator: {
      name: "Dapper Islamabad",
      handle: "@dapper.isb",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    description: {
      en: "AirFlex All-Black Cloud Sneakers on feet review! Super lightweight, looks high-end luxury streetwear, but only Rs. 4,200 on PikPok!",
      ru: "AirFlex All-Black Cloud Sneakers ka on-feet review! Intehai halka aur aaram deh, high-end luxury look sirf Rs. 4,200 mein!",
      ur: "ایئرفلیکس اسنیکرز کا لائیو ریویو! بے حد آرام دہ اور دلکش اسٹریٹ ویئر اسٹائل صرف 4,200 روپے میں!"
    },
    tags: ["#StreetwearPakistan", "#SneakerheadPK", "#OOTD", "#MensFashion", "#PikPokShop"],
    soundTitle: "Drill Pakistan • Streetwear Heatwave",
    likesCount: 28400,
    commentsCount: 390,
    sharesCount: 2150,
    isLiked: false,
    isFollowed: true,
    isFriend: false,
    feedCategory: ['foryou', 'following'],
    product: INITIAL_PRODUCTS[5],
    commentsList: []
  },
  {
    id: "v7",
    videoUrl: "https://assets.mixkit.co/videos/48358/48358-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    creator: {
      name: "Karachi Streetwear",
      handle: "@karachi_streetwear",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    description: {
      en: "Heavyweight 380 GSM fleece hoodie review! The drop shoulder fit is insane. 100% thick winter cotton with premium ribbed cuffs 🔥",
      ru: "380 GSM fleece hoodie ka review! Zabardast drop shoulder fitting aur pure garm cotton. Cash on Delivery par dastyab!",
      ur: "اعلیٰ 380 جی ایس ایم فلیس ہوڈی کا ریویو! شاندار ڈراپ شولڈر کٹنگ اور خالص گرم فیبرک 🔥 کیش آن ڈیلیوری پر دستیاب!"
    },
    tags: ["#KarachiStreetwear", "#HoodieSeason", "#WinterVibesPK", "#PakistaniFashion", "#PikPokShop"],
    soundTitle: "Karachi Drill • Winter Heat",
    likesCount: 18900,
    commentsCount: 240,
    sharesCount: 1420,
    isLiked: false,
    isFollowed: true,
    isFriend: true,
    feedCategory: ['foryou', 'following', 'friends'],
    product: INITIAL_PRODUCTS[6],
    commentsList: []
  },
  {
    id: "v8",
    videoUrl: "https://assets.mixkit.co/videos/31377/31377-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    creator: {
      name: "Lahore Glam Studio",
      handle: "@lahore_glam_studio",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
      verified: true
    },
    description: {
      en: "Complete 12-piece professional makeup brush test! Ultra soft vegan bristles that don't shed. Blends foundation like butter ✨ Only Rs. 1,950!",
      ru: "12-piece makeup brush set ka live test! Intehai narm bristles jo girte nahi hain aur makeup ko makhan ki tarah blend karte hain ✨",
      ur: "مکمل 12 پیس پروفیشنل میک اپ برش سیٹ کا ٹیسٹ! نہایت نرم برسلز جو میک اپ کو مکھن کی طرح بلینڈ کریں ✨ صرف 1,950 روپے میں!"
    },
    tags: ["#MakeupHacksPK", "#BridalGlow", "#DesiGlam", "#PikPokBeauty", "#ViralFinds"],
    soundTitle: "Desi Chic • Soft Lo-Fi Acoustic",
    likesCount: 21300,
    commentsCount: 310,
    sharesCount: 1780,
    isLiked: false,
    isFollowed: false,
    isFriend: true,
    feedCategory: ['foryou', 'friends'],
    product: INITIAL_PRODUCTS[7],
    commentsList: []
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Hamza Ali Khan",
  handle: "@hamza_deals_pk",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80",
  bio: {
    en: "Lahore based tech enthusiast & viral deal hunter 🇵🇰 | Reviewing honest TikTok finds | 100% Cash on Delivery shopper 🔥",
    ru: "Lahore ka tech reviewer aur deal hunter 🇵🇰 | Sachi reviews aur viral cheezein | Cash on Delivery shopping!",
    ur: "لاہور سے ٹیکنالوجی اور شاپنگ کا دلدادہ 🇵🇰 | وائرل مصنوعات کے سچے جائزے | کیش آن ڈیلیوری خریدار 🔥"
  },
  followersCount: "14.8k",
  followingCount: 184,
  totalLikesCount: "92.4k",
  streakScore: 7, // 7 days initial active streak!
  lastActiveTimestamp: Date.now() - (5 * 60 * 60 * 1000) // 5 hours ago (19 hours remaining)
};

export const INITIAL_USER_VIDEOS: UserUploadedVideo[] = [
  {
    id: "uv1",
    title: "Ultra Max 2 Calling Test on Lahore Ring Road!",
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/41485/41485-720.mp4",
    views: "18.4k",
    likes: 2150,
    date: "Yesterday",
    linkedProductName: "Ultra Max 2 Smartwatch"
  },
  {
    id: "uv2",
    title: "RGB Sunset Lamp room aesthetic transformation 🌅",
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/42510/42510-720.mp4",
    views: "34.1k",
    likes: 4200,
    date: "3 days ago",
    linkedProductName: "Nordic Sunset Lamp"
  },
  {
    id: "uv3",
    title: "FreshJuice Blender crushing frozen mangoes in 20s 🥭",
    thumbnail: "https://images.unsplash.com/photo-1570831739427-4f24d8fa2a63?auto=format&fit=crop&w=400&q=80",
    videoUrl: "https://assets.mixkit.co/videos/43360/43360-720.mp4",
    views: "12.8k",
    likes: 1890,
    date: "5 days ago",
    linkedProductName: "FreshJuice Blender"
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    sellerId: "seller_1",
    sellerName: "Zubair Gadgets PK",
    sellerShopName: "TechZone Lahore",
    sellerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    sellerVerified: true,
    product: {
      id: "p1",
      title: "Ultra Max 2 Smartwatch with AMOLED Display",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
      pricePKR: 3499
    },
    lastMessage: "Ji bilkul! COD nationwide dastyab hai. 2 din mein TCS se parcel mil jayega.",
    lastMessageTime: "10:45 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m1",
        sender: "buyer",
        text: "Assalam o Alaikum! Kya Ultra Max 2 smartwatch ka black color stock mein available hai?",
        timestamp: "10:30 AM",
        productId: "p1"
      },
      {
        id: "m2",
        sender: "seller",
        text: "Walaikum Assalam! Ji bhai jan, Black aur Orange dono silicone + ocean loop straps ke sath 100% genuine stock mein hain.",
        timestamp: "10:35 AM"
      },
      {
        id: "m3",
        sender: "buyer",
        text: "Is this price final? Or any discount for 2 pieces?",
        timestamp: "10:40 AM"
      },
      {
        id: "m4",
        sender: "seller",
        text: "Ji bilkul! COD nationwide dastyab hai. 2 din mein TCS se parcel mil jayega.",
        timestamp: "10:45 AM"
      }
    ]
  },
  {
    id: "conv-2",
    sellerId: "seller_2",
    sellerName: "Shahzad Audio World",
    sellerShopName: "Karachi Sound & Gadgets",
    sellerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    sellerVerified: true,
    product: {
      id: "p3",
      title: "ANC Transparent Wireless Earbuds (Air3 Pro)",
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
      pricePKR: 2899
    },
    lastMessage: "Order #PK-98421 dispatched via Leopards Courier. Tracking ID: LPC-994821",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m2-1",
        sender: "buyer",
        text: "Hello, battery timing kitni hours hai is earbuds ki?",
        timestamp: "Yesterday, 3:15 PM"
      },
      {
        id: "m2-2",
        sender: "seller",
        text: "Single charge par 6 hours continuous playback aur charging case ke sath total 28 hours chalta hai!",
        timestamp: "Yesterday, 3:20 PM"
      },
      {
        id: "m2-3",
        sender: "system",
        text: "Order #PK-98421 dispatched via Leopards Courier. Tracking ID: LPC-994821",
        timestamp: "Yesterday, 5:40 PM",
        isOrderUpdate: true
      }
    ]
  },
  {
    id: "conv-3",
    sellerId: "seller_3",
    sellerName: "Ayesha Aesthetics",
    sellerShopName: "Glow & Glam Rawalpindi",
    sellerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    sellerVerified: false,
    product: {
      id: "p2",
      title: "Nordic Sunset Projection Lamp (16 Colors Remote)",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
      pricePKR: 1850
    },
    lastMessage: "USB cable and wireless remote dono box mein shamil hain.",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    messages: [
      {
        id: "m3-1",
        sender: "buyer",
        text: "Remote control included hai?",
        timestamp: "2 days ago"
      },
      {
        id: "m3-2",
        sender: "seller",
        text: "USB cable and wireless remote dono box mein shamil hain.",
        timestamp: "2 days ago"
      }
    ]
  }
];

