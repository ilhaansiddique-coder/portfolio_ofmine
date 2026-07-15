import type { Product, ApiCategory, BlogPost } from "../../data/products";

export type { Product };

type Bilingual = { en: string; bn: string };

export interface HomePageProps { products: Product[] }
export interface ShopPageProps { initialProducts: Product[]; apiCategories: ApiCategory[] }
export interface ProductPageProps { product: Product }
export interface CartPageProps { }
export interface CheckoutPageProps { }
export interface AboutPageProps { }
export interface ContactPageProps { }

export interface PolicyContent {
  title: Bilingual;
  intro: Bilingual;
  lastUpdated: Bilingual;
  sections: { title: Bilingual; content: Bilingual }[];
}
export interface PrivacyPageProps { content: PolicyContent; lang: "en" | "bn" }
export interface TermsPageProps { content: PolicyContent; lang: "en" | "bn" }
export interface RefundPageProps { content: PolicyContent; lang: "en" | "bn" }

export interface BlogListingPageProps { posts: BlogPost[] }
export interface BlogPostPageProps { post: BlogPost; related: BlogPost[] }

export interface NavbarProps { onSearchOpen: () => void; onCartOpen: () => void; onAuthOpen: () => void }
export interface FooterProps { }
export interface CartDrawerProps { open: boolean; onClose: () => void }
