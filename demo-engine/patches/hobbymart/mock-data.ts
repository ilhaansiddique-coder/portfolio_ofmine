// Seed data for the HobbyMart demo. The real app reads this from PostgreSQL;
// the demo has no database, so mock-prisma.ts serves these arrays instead.
// Products already carry their nested `categories` and `reviews` so Prisma-style
// `include` is satisfied by returning the row as-is.

// Real Prisma returns Date objects (components call .toLocaleDateString()), so
// the mock must too — not ISO strings.
const now = new Date("2026-01-01T00:00:00.000Z");

// The demo is mounted under a basePath. next/image with `unoptimized` passes the
// src through literally (no basePath prefix), so image URLs must carry it.
const BASE = process.env.NEXT_PUBLIC_DEMO_BASE ?? "";
const img = (p: string) => `${BASE}${p}`;

type Cat = { id: string; name: string; slug: string; description: string | null; image: string | null; parentId: string | null; createdAt: Date; updatedAt: Date; _count: { products: number } };

export const CATEGORIES: Cat[] = [
  { id: "c1", name: "Camera Drones", slug: "camera-drones", description: "Aerial photography & 4K video drones", image: null, parentId: null, createdAt: now, updatedAt: now, _count: { products: 4 } },
  { id: "c2", name: "FPV & Racing", slug: "fpv-racing", description: "First-person-view and racing quads", image: null, parentId: null, createdAt: now, updatedAt: now, _count: { products: 3 } },
  { id: "c3", name: "Mini & Beginner", slug: "mini-beginner", description: "Lightweight drones for new pilots", image: null, parentId: null, createdAt: now, updatedAt: now, _count: { products: 2 } },
  { id: "c4", name: "Batteries & Chargers", slug: "batteries-chargers", description: "LiPo packs, chargers and power", image: null, parentId: null, createdAt: now, updatedAt: now, _count: { products: 3 } },
  { id: "c5", name: "Parts & Accessories", slug: "parts-accessories", description: "Props, motors, controllers and spares", image: null, parentId: null, createdAt: now, updatedAt: now, _count: { products: 4 } },
];

// A ProductCategory join row, shaped for the storefront's `include`: it reads
// both `categoryId` (to find related products) and the nested `category`.
const cat = (id: string) => {
  const c = CATEGORIES.find((x) => x.id === id)!;
  return { categoryId: id, category: { name: c.name, slug: c.slug } };
};

const REVIEWERS = ["Arif R.", "Nadia K.", "Tanvir H.", "Sadia M.", "Rakib A."];

let pid = 0;
function product(o: {
  name: string; price: number; salePrice?: number | null; catIds: string[];
  featured?: boolean; stock?: number; ratings?: number[]; desc?: string; img: string;
}) {
  pid += 1;
  const slug = o.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const ratings = o.ratings ?? [5, 4, 5];
  return {
    id: `p${pid}`,
    name: o.name,
    slug,
    sku: `HM-${1000 + pid}`,
    description: o.desc ?? `The ${o.name} — a demo product in the HobbyMart storefront. Full specs, gallery and reviews render exactly as they do in the live app; only the data is mocked.`,
    price: o.price,
    salePrice: o.salePrice ?? null,
    stock: o.stock ?? 25,
    images: [img(o.img)],
    specs: { Flight_time: "34 min", Range: "10 km", Camera: "4K/60fps", Weight: "595 g" },
    featured: o.featured ?? false,
    published: true,
    metaTitle: o.name,
    metaDescription: null,
    createdAt: now,
    updatedAt: now,
    categories: o.catIds.map(cat),
    // Reviews carry a user, because the product detail page renders review.user.name.
    reviews: ratings.map((rating, i) => ({
      id: `rev-${pid}-${i}`,
      rating,
      comment: rating >= 5 ? "Excellent — exactly as described." : "Solid product, happy with it.",
      createdAt: now,
      user: { name: REVIEWERS[i % REVIEWERS.length], image: null },
    })),
  };
}

export const PRODUCTS = [
  product({ name: "SkyHawk Pro 4K", price: 899, salePrice: 749, catIds: ["c1"], featured: true, ratings: [5, 5, 4, 5], img: "/mock/drone-1.webp", desc: "Flagship camera drone with a 1-inch sensor, 34-minute flight time and 10 km transmission. Folds to fit a jacket pocket." }),
  product({ name: "AeroShot Mini 3", price: 459, catIds: ["c1", "c3"], featured: true, ratings: [5, 4], img: "/mock/drone-2.webp", desc: "Sub-250g camera drone — no registration needed. 4K HDR video and vertical shooting for social." }),
  product({ name: "Phantom Vision X", price: 1299, salePrice: null, catIds: ["c1"], featured: true, ratings: [5, 5, 5], img: "/mock/drone-3.webp" }),
  product({ name: "Horizon Cine 6K", price: 1799, catIds: ["c1"], ratings: [4, 5], img: "/mock/drone-4.webp" }),
  product({ name: "Velocity FPV Racer", price: 349, salePrice: 299, catIds: ["c2"], featured: true, ratings: [5, 4, 5], img: "/mock/drone-5.webp", desc: "5-inch freestyle/racing quad with digital HD FPV. Tuned for sub-3s 0-100 km/h." }),
  product({ name: "Nitro Sport FPV", price: 279, catIds: ["c2"], ratings: [4, 4], img: "/mock/drone-6.webp" }),
  product({ name: "Tiny Whoop Starter", price: 89, catIds: ["c2", "c3"], ratings: [5, 5], img: "/mock/drone-7.webp" }),
  product({ name: "LiPo 6S 1500mAh", price: 34, salePrice: 27, catIds: ["c4"], ratings: [5, 4, 4], img: "/mock/part-1.webp", desc: "High-discharge 6S racing pack. Sold as a demo accessory." }),
  product({ name: "Smart Charger Hub X4", price: 129, catIds: ["c4"], featured: true, ratings: [5, 5], img: "/mock/part-2.webp" }),
  product({ name: "Power Station 500Wh", price: 399, catIds: ["c4"], ratings: [4, 5], img: "/mock/part-3.webp" }),
  product({ name: "Carbon Prop Set (8)", price: 19, catIds: ["c5"], ratings: [5, 5, 4], img: "/mock/part-4.webp" }),
  product({ name: "Brushless Motor 2207", price: 24, salePrice: 19, catIds: ["c5"], ratings: [5, 4], img: "/mock/part-5.webp" }),
  product({ name: "Flight Controller F7", price: 69, catIds: ["c5"], ratings: [4, 5], img: "/mock/part-6.webp" }),
  product({ name: "Radio Transmitter Pro", price: 199, catIds: ["c5"], featured: true, ratings: [5, 5, 5], img: "/mock/part-7.webp" }),
];

export const REVIEWS = [
  { id: "r1", rating: 5, comment: "Incredible image quality straight out of the box.", createdAt: now, user: { name: "Arif R.", image: null } },
  { id: "r2", rating: 5, comment: "Fast shipping and the drone flies like a dream.", createdAt: now, user: { name: "Nadia K.", image: null } },
  { id: "r3", rating: 4, comment: "Great value for a first FPV build.", createdAt: now, user: { name: "Tanvir H.", image: null } },
  { id: "r4", rating: 5, comment: "Customer support helped me pick the right battery.", createdAt: now, user: { name: "Sadia M.", image: null } },
];

export const BLOG_POSTS = [
  { id: "b1", title: "Choosing Your First Camera Drone", slug: "first-camera-drone", excerpt: "Sensor size, flight time and rules — what actually matters for beginners.", content: "# Choosing Your First Camera Drone\n\nThis is demo content for the HobbyMart storefront preview.", image: img("/mock/drone-2.webp"), author: "HobbyMart Team", published: true, featured: true, createdAt: now, updatedAt: now },
  { id: "b2", title: "FPV Freestyle: A Starter Setup", slug: "fpv-starter-setup", excerpt: "The parts list and tuning tips to get airborne on a budget.", content: "# FPV Freestyle\n\nDemo content.", image: img("/mock/drone-5.webp"), author: "HobbyMart Team", published: true, featured: false, createdAt: now, updatedAt: now },
  { id: "b3", title: "LiPo Battery Care 101", slug: "lipo-care-101", excerpt: "Storage voltage, charging safety and getting the most cycles from your packs.", content: "# LiPo Battery Care\n\nDemo content.", image: img("/mock/part-1.webp"), author: "HobbyMart Team", published: true, featured: false, createdAt: now, updatedAt: now },
];

export const SITE_SETTINGS = {
  id: "singleton",
  companyName: "HobbyMart",
  // The repo ships public/logo.png; base-prefix it (header/footer use logoUrl).
  logoUrl: img("/logo.png"),
  email: "hello@demo.store",
  phone: "+880 1XXX-XXXXXX",
  address: "Dhaka, Bangladesh",
  whatsappNumber: "",
  whatsappText: "Hello! I have a question about your products.",
  primaryColor: "#2563eb",
  fontFamily: "sans",
  footerTagline: "Your premier drone & hobby shop — demo storefront.",
  facebookUrl: null,
  instagramUrl: null,
  youtubeUrl: null,
  topbarEnabled: true,
  topbarText: "Demo storefront — browse freely. Checkout & accounts are disabled in this preview.",
  topbarShowContact: true,
  topbarShowTrackOrder: false,
  navLinks: null,
  footerColumns: null,
  copyrightText: "© HobbyMart (demo)",
};
