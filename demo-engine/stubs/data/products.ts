// Product type (mirrors the engine's @/data/products shape used by the theme)
// plus the mock catalogue / blog / policy data the preview renders.

export interface ProductVariant {
  id: number;
  label: string;
  price: number;
  original_price?: number | null;
  image?: string;
  stock: number;
  unlimited_stock: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug?: string;
  price: number;
  originalPrice?: number | null;
  image?: string;
  images?: string[] | string | null;
  category?: string;
  category_slug?: string;
  brand_slug?: string;
  description?: string;
  stock: number;
  unlimitedStock: boolean;
  hasVariations?: boolean;
  variants?: ProductVariant[];
  variationType?: string;
  sold?: number;
  video_url?: string;
  preorder?: boolean;
}

// The demo is mounted under a basePath (e.g. /portfolio_ofmine/demo/cd-ecom).
// Next only rewrites basePath for next/link and _next assets — a plain
// <img src="/foo.webp"> is left alone and would 404. Prefix them ourselves.
const BASE = process.env.NEXT_PUBLIC_DEMO_BASE || "";
const A = (p: string) => `${BASE}${p}`;

// Images are vendored into /public/mock so the demo is self-contained:
// no third-party image host, no per-visit randomness, works offline.
const img = (id: string) => A(`/mock/unsplash-${id}.webp`);
// Clean product-style ingredient photos (on white, no people), vendored locally.
const mealdb = (name: string) =>
  A(`/mock/mealdb-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.webp`);

// Organic-grocery catalogue (Ghorer-Bazar-style). Preview-only mock data —
// the live engine supplies the tenant's real products. All copy is original.
export const PRODUCTS: Product[] = [
  { id: 1, name: "Pure Mustard Oil (ঘানি ভাঙা সরিষার তেল)", slug: "pure-mustard-oil", price: 380, originalPrice: 480, category: "Mustard Oil", category_slug: "mustard-oil", brand_slug: "pureleaf", stock: 120, unlimitedStock: false, description: `Discover the Pure Mustard Oil pressed from hand-picked mustard seeds in a traditional wooden ghani, crushed slowly without heat or chemicals so the seed keeps every drop of its character; this oil is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in omega-3 fatty acids, vitamin E, and natural antioxidants, Pure Mustard Oil is more than just an oil—it's a cornerstone of authentic Bengali cooking. Its pungent aroma and deep golden colour make it perfect for everyday use, whether tempering hot curries, mixing fiery bhorta, or sealing crunchy homemade pickles.

Pure Mustard Oil is certified to EU and USDA NOP organic standards.

Nutritional Benefits:
Heart-friendly fats – balanced omega-3 and omega-6 content supports healthy cholesterol and overall cardiovascular wellness.
Natural warmth – its pungency stimulates circulation and is traditionally used for soothing massage.
Antibacterial action – allyl isothiocyanate gives the oil natural antimicrobial properties for safer cooking and storage.
Vitamin E boost – nourishes skin and hair while protecting cells from everyday oxidative stress.
High smoke point – stays stable at frying heat, making it ideal for deep-frying and tempering without breaking down.`, image: mealdb("Olive Oil"), hasVariations: true, variationType: "Size", variants: [
    { id: 11, label: "500 ml", price: 380, original_price: 480, stock: 60, unlimited_stock: false },
    { id: 12, label: "1 litre", price: 720, original_price: 900, stock: 40, unlimited_stock: false },
    { id: 13, label: "2 litre", price: 1390, original_price: 1700, stock: 20, unlimited_stock: false },
  ] },
  { id: 2, name: "Pure Cow Ghee (খাঁটি গাওয়া ঘি)", slug: "pure-cow-ghee", price: 950, originalPrice: 1200, category: "Ghee", category_slug: "ghee", brand_slug: "pureleaf", stock: 80, unlimitedStock: false, description: `Discover the Pure Cow Ghee crafted from grass-fed cow's milk and churned into butter the traditional bilona way, then slow-simmered over a gentle flame until it turns golden and grainy; this ghee is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in healthy fats, fat-soluble vitamins, and butyric acid, Pure Cow Ghee is more than just a cooking fat—it's a time-honoured source of nourishment and flavour. Its nutty aroma and silky golden texture make it perfect for everyday use, whether spooning over steaming polao, finishing rich dals, or enriching festive sweets.

Pure Cow Ghee is certified to ISO 22000 and HACCP food-safety standards.

Nutritional Benefits:
Digestive support – butyric acid nourishes the gut lining and aids smooth, comfortable digestion every day.
Energy reserve – dense healthy fats provide steady, lasting fuel for active bodies and busy minds.
Vitamin-rich – naturally supplies vitamins A, D, E, and K for immunity, bones, and clear skin.
High smoke point – withstands high-heat cooking and frying without burning or releasing harmful compounds.
Lactose-light – the bilona process removes most milk solids, making it gentler for sensitive stomachs.`, image: mealdb("Ghee"), hasVariations: true, variationType: "Size", variants: [
    { id: 21, label: "250 g", price: 520, original_price: 650, stock: 40, unlimited_stock: false },
    { id: 22, label: "500 g", price: 950, original_price: 1200, stock: 30, unlimited_stock: false },
    { id: 23, label: "1 kg", price: 1850, original_price: 2300, stock: 10, unlimited_stock: false },
  ] },
  { id: 3, name: "Sundarban Natural Honey (সুন্দরবনের মধু)", slug: "sundarban-natural-honey", price: 750, originalPrice: 950, category: "Honey", category_slug: "honey", brand_slug: "goldenbee", stock: 90, unlimitedStock: false, description: `Discover the Sundarban Natural Honey gathered deep in the mangrove forests of the Sundarbans by skilled Mawalis who climb into the wild to harvest each comb by hand; left unheated and unfiltered, this honey is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in living enzymes, natural antioxidants, and trace minerals, Sundarban Natural Honey is more than just a sweetener—it's a daily spoonful of forest vitality. Its delicate floral taste and smooth, runny texture make it perfect for everyday use, whether stirred into warm water, drizzled over breakfast, or taken neat to soothe a tickly throat.

Sundarban Natural Honey is certified to ISO 22000 and HACCP food-safety standards.

Nutritional Benefits:
Boosts immunity – natural enzymes and antioxidants help strengthen the body's defences against everyday illness.
Soothes throats – its smooth coating calms irritation and eases dry, scratchy coughs gently.
Natural energy – easily absorbed natural sugars deliver a quick, clean lift without a heavy crash.
Aids digestion – prebiotic compounds support healthy gut bacteria and comfortable everyday digestion.
Wound-friendly – mild antibacterial properties have long made raw honey a traditional topical remedy.`, image: mealdb("Honey") },
  { id: 4, name: "Mustard Flower Honey (সরিষা ফুলের মধু)", slug: "mustard-flower-honey", price: 620, originalPrice: 800, category: "Honey", category_slug: "honey", brand_slug: "goldenbee", stock: 70, unlimitedStock: false, description: `Discover the Mustard Flower Honey gathered by beekeepers who place their hives amid blooming mustard fields, letting the bees forage the golden blossoms at the height of the flowering season; bottled raw and unheated, this honey is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in glucose energy, natural pollen, and gentle antioxidants, Mustard Flower Honey is more than just a sweetener—it's a wholesome pantry staple for the whole family. Its light, mild flavour and creamy set texture make it perfect for everyday use, whether spread on warm toast, whisked into salad dressings, or sweetening morning porridge.

Mustard Flower Honey is certified to BSTI food-safety standards.

Nutritional Benefits:
Quick energy – glucose-rich nectar gives an easy, fast-absorbing lift for active mornings and workouts.
Natural set – crystallises softly in cool weather, a trusted sign of genuine raw honey.
Gentle on kids – its mild, mellow sweetness makes it a family-friendly natural sugar alternative.
Mild antioxidants – plant compounds help the body resist everyday oxidative stress over time.
Spreadable texture – the creamy crystallised form spreads beautifully without dripping off bread.`, image: mealdb("Maple Syrup") },
  { id: 5, name: "Premium Ajwa Dates (আজওয়া খেজুর)", slug: "ajwa-dates", price: 1150, originalPrice: 1450, category: "Dates", category_slug: "dates", brand_slug: "orchard", stock: 50, unlimitedStock: false, preorder: true, description: `Discover the Premium Ajwa Dates hand-picked from the palm groves of Madinah and imported straight to your door, each fruit selected at peak softness and packed with care; this date is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in dietary fibre, potassium, and natural antioxidants, Ajwa Dates are more than just a snack—they're a deeply nourishing, spiritually treasured treat. Their soft, dark flesh and gentle sweetness make them perfect for everyday use, whether breaking your fast at iftar, blending into smoothies, or pairing with milk and nuts.

Premium Ajwa Dates are certified to ISO 22000 and HACCP food-safety standards.

Nutritional Benefits:
Fibre-rich – supports smooth digestion and helps you feel satisfied between meals naturally.
Heart wellness – generous potassium helps maintain healthy blood pressure and steady heart rhythm.
Antioxidant power – polyphenols help protect cells from everyday oxidative damage and ageing.
Natural sweetness – wholesome fruit sugars satisfy cravings without refined or added sugar.
Mineral boost – delivers magnesium, copper, and iron to support energy and strong bones.`, image: mealdb("Medjool Dates"), hasVariations: true, variationType: "Size", variants: [
    { id: 51, label: "500 g", price: 1150, original_price: 1450, stock: 30, unlimited_stock: false },
    { id: 52, label: "1 kg", price: 2200, original_price: 2700, stock: 20, unlimited_stock: false },
  ] },
  { id: 6, name: "Medjool Dates (মেডজুল খেজুর)", slug: "medjool-dates", price: 890, originalPrice: 1100, category: "Dates", category_slug: "dates", brand_slug: "orchard", stock: 60, unlimitedStock: false, description: `Discover the Medjool Dates hand-picked at peak ripeness from sun-drenched palm orchards and imported whole, each large fruit graded for size and softness before packing; this date is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in dietary fibre, natural sugars, and essential minerals, Medjool Dates are more than just a snack—they're nature's own caramel candy. Their plump, melt-in-the-mouth texture and deep toffee sweetness make them perfect for everyday use, whether stuffed with nut butter, chopped into baking, or enjoyed simply on their own.

Medjool Dates are certified to EU organic and HACCP standards.

Nutritional Benefits:
Energy-dense – natural fruit sugars provide a fast, wholesome fuel boost before workouts.
Digestive fibre – supports regularity and gut health with every soft, satisfying bite.
Mineral-rich – supplies potassium, magnesium, and copper for muscles, nerves, and bones.
Refined-sugar swap – an ideal natural sweetener for energy balls, smoothies, and desserts.
Antioxidant content – carotenoids and phenolics help defend cells against oxidative stress.`, image: mealdb("Medjool Dates") },
  { id: 7, name: "Premium Mixed Nuts (মিক্সড বাদাম)", slug: "premium-mixed-nuts", price: 680, originalPrice: 850, category: "Nuts & Seeds", category_slug: "nuts-seeds", brand_slug: "pureleaf", stock: 100, unlimitedStock: true, description: `Discover the Premium Mixed Nuts gently dry-roasted in small batches from carefully sourced almonds, cashews, walnuts, and pistachios, with no added salt or oil to mask their natural taste; this mix is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in plant protein, heart-healthy fats, and dietary fibre, Premium Mixed Nuts are more than just a snack—they're a satisfying, energising handful of goodness. Their deep roasted aroma and crunchy texture make them perfect for everyday use, whether topping morning yoghurt, packing into a lunchbox, or grabbing a guilt-free afternoon bite.

Premium Mixed Nuts are certified to ISO 22000 and HACCP food-safety standards.

Nutritional Benefits:
Protein power – a plant-based protein boost that supports muscle repair and lasting fullness.
Healthy fats – monounsaturated fats from almonds and cashews support heart and brain health.
Omega-3 source – walnuts add plant omega-3s for cognitive function and reduced inflammation.
Mineral mix – delivers magnesium, zinc, and selenium for immunity, energy, and skin health.
Steady energy – fibre and fat together keep blood sugar balanced and cravings at bay.`, image: mealdb("Cashew Nuts") },
  { id: 8, name: "Organic Chia Seeds (চিয়া সিড)", slug: "organic-chia-seeds", price: 340, originalPrice: 450, category: "Nuts & Seeds", category_slug: "nuts-seeds", brand_slug: "pureleaf", stock: 140, unlimitedStock: true, description: `Discover the Organic Chia Seeds harvested from sustainably grown chia plants and cleaned without heat or chemical treatment, leaving every tiny seed whole and full of life; this seed is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in plant-based omega-3, soluble fibre, and complete protein, Organic Chia Seeds are more than just a topping—they're a tiny powerhouse of everyday nutrition. Their mild, nutty taste and gel-forming texture make them perfect for everyday use, whether soaking into a creamy pudding, thickening smoothies, or sprinkling over salads and porridge.

Organic Chia Seeds are certified to EU and USDA NOP organic standards.

Nutritional Benefits:
Omega-3 rich – plant-based alpha-linolenic acid supports heart health and reduced inflammation naturally.
Fibre boost – soluble fibre forms a satisfying gel that aids digestion and lasting fullness.
Complete protein – supplies all essential amino acids for muscle repair and steady energy.
Hydration helper – seeds absorb many times their weight in liquid for prolonged hydration.
Bone support – calcium, magnesium, and phosphorus contribute to strong, healthy bones over time.`, image: mealdb("Sesame Seed") },
  { id: 9, name: "Turmeric Powder (খাঁটি হলুদ গুঁড়া)", slug: "turmeric-powder", price: 180, originalPrice: 240, category: "Spices", category_slug: "spices", brand_slug: "pureleaf", stock: 200, unlimitedStock: true, description: `Discover the Turmeric Powder stone-ground from sun-dried turmeric rhizomes grown on trusted family farms, milled slowly to lock in colour and aroma with no artificial dye or filler; this spice is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in curcumin, antioxidants, and anti-inflammatory compounds, Turmeric Powder is more than just a spice—it's a golden pillar of wellness and flavour. Its earthy aroma and vivid colour make it perfect for everyday use, whether building the base of a curry, stirring into warming golden milk, or seasoning roasted vegetables.

Turmeric Powder is certified to EU and USDA NOP organic standards.

Nutritional Benefits:
Anti-inflammatory – curcumin helps calm everyday inflammation and supports joint comfort and mobility.
Antioxidant shield – fights free radicals that contribute to cell ageing and oxidative stress.
Immune support – traditional compounds help the body stay resilient through changing seasons.
Digestive aid – stimulates bile flow to support smoother digestion of rich, oily meals.
Pure colour – its natural golden pigment brightens dishes without any synthetic food dye.`, image: A("/products/turmeric-powder.webp") },
  { id: 10, name: "Red Chilli Powder (লাল মরিচ গুঁড়া)", slug: "red-chilli-powder", price: 210, originalPrice: 270, category: "Spices", category_slug: "spices", brand_slug: "pureleaf", stock: 180, unlimitedStock: true, description: `Discover the Red Chilli Powder stone-ground from sun-dried red chillies in small batches, with nothing added—no brick dust, no colour, no adulteration—just the clean fire of the pepper itself; this spice is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in capsaicin, vitamin C, and natural carotenoids, Red Chilli Powder is more than just a spice—it's the soul of a bold, flavourful kitchen. Its fiery aroma and deep red colour make it perfect for everyday use, whether spicing up curries, rubbing onto grilled meats, or adding a kick to marinades and chutneys.

Red Chilli Powder is certified to BSTI food-safety standards.

Nutritional Benefits:
Metabolism lift – capsaicin gently boosts metabolism and may support healthy weight management.
Vitamin C – supports immunity and helps the body absorb iron from your meals.
Natural colour – its vivid red comes from carotenoids, not artificial dye or fillers.
Circulation aid – the warming heat traditionally encourages healthy blood flow and digestion.
Antioxidant rich – plant pigments help defend cells against everyday oxidative damage.`, image: mealdb("Chilli Powder") },
  { id: 11, name: "Organic Green Tea (অর্গানিক গ্রিন টি)", slug: "organic-green-tea", price: 320, originalPrice: 420, category: "Tea & Coffee", category_slug: "tea-coffee", brand_slug: "sunharvest", stock: 110, unlimitedStock: true, description: `Discover the Organic Green Tea hand-plucked from tender top leaves on high-grown gardens and gently pan-dried within hours of picking to lock in freshness; this blend is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in catechins, L-theanine, and natural antioxidants, Organic Green Tea is more than just a drink—it's a calm, restorative ritual in a cup. Its fresh, grassy aroma and clean, light flavour make it perfect for everyday use, whether starting a focused morning, replacing an afternoon coffee, or winding down before bed.

Organic Green Tea is certified to EU and USDA NOP organic standards.

Nutritional Benefits:
Antioxidant rich – catechins help neutralise free radicals and support long-term cellular health.
Calm focus – L-theanine promotes relaxed alertness without the jitters of strong coffee.
Metabolism support – natural compounds may gently support metabolism and healthy weight goals.
Heart wellness – regular drinking is associated with healthier cholesterol and circulation.
Low caffeine – a lighter lift than coffee for steady energy throughout your day.`, image: mealdb("Tea") },
  { id: 12, name: "Organic Foods Combo Box (অর্গানিক কম্বো)", slug: "organic-combo-box", price: 1490, originalPrice: 1900, category: "Organic", category_slug: "organic", brand_slug: "pureleaf", stock: 40, unlimitedStock: false, preorder: true, description: `Discover the Organic Foods Combo Box thoughtfully assembled from our best-selling staples—ghani-pressed mustard oil, bilona ghee, raw honey, and soft dates—each item sourced and packed with the same care we give every single product; this blend is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in healthy fats, natural enzymes, and wholesome nutrients, the Organic Combo Box is more than just a bundle—it's a complete head-start to a cleaner kitchen. Its variety and everyday usefulness make it perfect for everyday use, whether stocking a new pantry, gifting a health-conscious friend, or trying our range for the first time.

Organic Foods Combo Box is certified to EU and USDA NOP organic standards.

Nutritional Benefits:
Balanced variety – pairs cooking essentials with natural sweeteners for well-rounded daily nutrition.
Great value – bundled pricing makes switching to pure, organic staples easy and affordable.
Gift-ready – an elegant, wholesome present for housewarmings, festivals, and health-minded loved ones.
Kitchen upgrade – replaces refined, processed products with clean, certified-organic alternatives at once.
Trusted quality – every item meets the same strict sourcing and food-safety standards we promise.`, image: mealdb("Rice") },

  // ── Mango (seasonal pre-order) ──
  { id: 13, name: "Amrapali Mango 5 kg (আম্রপালি আম)", slug: "amrapali-mango-5kg", price: 950, originalPrice: 1100, category: "Mango", category_slug: "mango", brand_slug: "orchard", stock: 80, unlimitedStock: false, preorder: true, description: `Discover the Amrapali Mango 5 kg tree-ripened in sun-warmed orchards and picked only when naturally sweet, then packed straight from the branch with absolutely no carbide or chemical ripening; this fruit is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in vitamin A, vitamin C, and natural antioxidants, Amrapali Mango is more than just a fruit—it's the taste of summer in every bite. Its fragrant aroma and smooth, fibre-free flesh make it perfect for everyday use, whether eaten fresh and chilled, blended into thick lassi, or sliced over creamy desserts.

Amrapali Mango is certified to BSTI food-safety standards.

Why You'll Love It:
Tree-ripened sweetness – picked naturally ripe so every mango bursts with honeyed, sun-grown flavour.
Carbide-free promise – ripened only by nature, never with artificial chemicals or harmful agents.
Fibre-free flesh – smooth, buttery pulp that slices cleanly and eats without any stringiness.
Vitamin-packed – generous vitamin A and C support healthy eyes, skin, and immunity.
Perfect 5 kg pack – an ideal size for a small family to enjoy the whole season.`, image: mealdb("Mango") },
  { id: 14, name: "Amrapali Mango 10 kg (আম্রপালি আম)", slug: "amrapali-mango-10kg", price: 1750, originalPrice: 2000, category: "Mango", category_slug: "mango", brand_slug: "orchard", stock: 60, unlimitedStock: false, preorder: true, description: `Discover the Amrapali Mango 10 kg tree-ripened on the branch and harvested at the perfect moment of sweetness, then carefully boxed with no carbide, formalin, or artificial ripening of any kind; this fruit is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in vitamin A, vitamin C, and natural fibre, Amrapali Mango is more than just a fruit—it's a wholesome seasonal joy for the whole household. Its rich aroma and dense, fibre-free flesh make it perfect for everyday use, whether served fresh after dinner, churned into ice cream, or puréed for chutneys and shakes.

Amrapali Mango is certified to BSTI food-safety standards.

Why You'll Love It:
Generous family pack – ten kilos to share fresh mangoes across a busy household all season.
Naturally ripened – matured by sun and time, never rushed with chemical ripening agents.
Aromatic and sweet – an intense fragrance and deep honeyed taste in every juicy bite.
Skin and eyes – vitamin A and C nourish glowing skin and support healthy vision.
Versatile fruit – delicious eaten fresh or transformed into desserts, drinks, and chutneys.`, image: img("photo-1605027990121-cbae9e0642df") },
  { id: 15, name: "Amrapali Mango 20 kg (আম্রপালি আম)", slug: "amrapali-mango-20kg", price: 3300, originalPrice: 3800, category: "Mango", category_slug: "mango", brand_slug: "orchard", stock: 40, unlimitedStock: false, preorder: true, description: `Discover the Amrapali Mango 20 kg tree-ripened across sun-soaked orchards and hand-picked at peak ripeness, then packed in bulk straight from the grove with no carbide or chemical shortcuts; this fruit is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in vitamin A, vitamin C, and dietary fibre, Amrapali Mango is more than just a fruit—it's a season's worth of natural sweetness in one box. Its heady aroma and smooth, fibre-free pulp make it perfect for everyday use, whether feeding a large family, sharing with neighbours, or batch-making jams, pickles, and frozen pulp.

Amrapali Mango is certified to BSTI food-safety standards.

Why You'll Love It:
Bulk value pack – twenty generous kilos ideal for big families and seasonal gatherings.
Orchard-fresh – delivered close to harvest so the fruit arrives fragrant and naturally ripe.
Chemical-free ripening – matured purely by nature, never with carbide or artificial agents.
Nutrient density – packed with vitamins A and C plus fibre for everyday wellness.
Preserve-friendly – the perfect quantity for making mango jam, pulp, and pickles at home.`, image: img("photo-1591073113125-e46713c829ed") },
  { id: 16, name: "Amrapali Mango 25 kg (আম্রপালি আম)", slug: "amrapali-mango-25kg", price: 3750, originalPrice: 4000, category: "Mango", category_slug: "mango", brand_slug: "orchard", stock: 30, unlimitedStock: false, preorder: true, description: `Discover the Amrapali Mango 25 kg tree-ripened in our partner orchards and gathered only at full natural sweetness, then carefully packed in our largest pack with zero carbide or chemical ripening; this fruit is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in vitamin A, vitamin C, and natural antioxidants, Amrapali Mango is more than just a fruit—it's a celebration of the season in every box. Its intense aroma and silky, fibre-free flesh make it perfect for everyday use, whether catering a large event, sharing with extended family, or stocking up for weeks of fresh enjoyment.

Amrapali Mango is certified to BSTI food-safety standards.

Why You'll Love It:
Largest pack – twenty-five kilos for events, big families, and serious mango lovers alike.
Straight from orchard – minimal handling keeps each mango fresh, fragrant, and naturally ripe.
No carbide ever – ripened the honest way, by sunlight and patience, not chemicals.
Smooth fibre-free pulp – buttery flesh that slices and blends beautifully every single time.
Wholesome nutrition – loaded with vitamins and antioxidants for healthy skin and immunity.`, image: mealdb("Mango") },

  // ── More Honey ──
  { id: 17, name: "Black Seed Honey 1 kg (কালোজিরা মধু)", slug: "black-seed-honey", price: 1500, originalPrice: 1650, category: "Honey", category_slug: "honey", brand_slug: "goldenbee", stock: 55, unlimitedStock: false, description: `Discover the Black Seed Honey 1 kg gathered by beekeepers and gently combined with cold-pressed black seed (kalonji), uniting raw honey and the prized dark seed without any heat or processing; this honey is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in thymoquinone, natural enzymes, and antioxidants, Black Seed Honey is more than just a sweetener—it's a time-honoured tonic for daily vitality. Its earthy, warming flavour and smooth texture make it perfect for everyday use, whether taken by the spoonful each morning, stirred into warm water, or paired with lemon to soothe the throat.

Black Seed Honey is certified to ISO 22000 and HACCP food-safety standards.

Nutritional Benefits:
Immune support – thymoquinone from black seed traditionally helps strengthen the body's natural defences.
Respiratory comfort – warming properties soothe the throat and ease seasonal coughs and congestion.
Antioxidant duo – honey and kalonji combine to fight free radicals and oxidative stress.
Natural energy – easily absorbed sugars deliver a clean lift to start the day right.
Digestive ease – the blend traditionally supports comfortable digestion and a settled stomach.`, image: mealdb("Black Treacle") },
  { id: 18, name: "Lychee Flower Honey 500 g (লিচু ফুলের মধু)", slug: "lychee-flower-honey", price: 650, originalPrice: 800, category: "Honey", category_slug: "honey", brand_slug: "goldenbee", stock: 65, unlimitedStock: false, description: `Discover the Lychee Flower Honey 500 g gathered by beekeepers who station their hives among blossoming lychee orchards during the brief flowering window, then bottled raw and unheated; this honey is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in natural enzymes, gentle antioxidants, and floral aromatics, Lychee Flower Honey is more than just a sweetener—it's a delicate seasonal indulgence. Its fragrant aroma and smooth, light finish make it perfect for everyday use, whether sweetening tea, drizzling over pancakes, or glazing fresh fruit and yoghurt.

Lychee Flower Honey is certified to BSTI food-safety standards.

Nutritional Benefits:
Delicate flavour – a light, fruity floral sweetness that enhances drinks without overpowering them.
Natural enzymes – raw, unheated honey retains the living enzymes that pasteurised honey loses.
Gentle antioxidants – plant compounds help the body resist everyday oxidative stress over time.
Quick energy – natural fruit sugars provide an easy lift for mornings and afternoons.
Throat soothing – its smooth texture coats and calms a dry, irritated throat naturally.`, image: mealdb("Golden Syrup") },
  { id: 28, name: "Acacia Wildflower Honey 500 g (বুনো ফুলের মধু)", slug: "acacia-wildflower-honey", price: 720, originalPrice: 900, category: "Honey", category_slug: "honey", brand_slug: "goldenbee", stock: 60, unlimitedStock: false, description: `Discover the Acacia Wildflower Honey 500 g gathered by beekeepers from hives set among open acacia groves and meadow wildflowers, then bottled raw without heating or fine-filtering; this honey is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in fructose, natural enzymes, and trace minerals, Acacia Wildflower Honey is more than just a sweetener—it's a clean, versatile pantry favourite. Its pale colour and gently floral, mild flavour make it perfect for everyday use, whether sweetening coffee, baking delicate cakes, or pairing with soft cheeses and fruit.

Acacia Wildflower Honey is certified to EU organic and HACCP standards.

Nutritional Benefits:
Slow to crystallise – its high fructose content keeps it smooth and pourable for much longer.
Mild and clean – a subtle flavour that sweetens without masking the taste of delicate dishes.
Gentle glycaemic – fructose-rich honey raises blood sugar more slowly than many sweeteners.
Living enzymes – raw and unheated, it keeps the natural enzymes lost in processed honey.
Antioxidant content – wildflower nectar provides plant compounds that help defend against oxidative stress.`, image: mealdb("Treacle") },

  // ── More Dates ──
  { id: 19, name: "Egyptian Medjool Large 1 kg (মেডজুল খেজুর)", slug: "egyptian-medjool-large", price: 1180, originalPrice: 1400, category: "Dates", category_slug: "dates", brand_slug: "orchard", stock: 45, unlimitedStock: false, description: `Discover the Egyptian Medjool Large 1 kg hand-picked from sun-rich Egyptian palm groves and imported as whole jumbo fruit, each date graded for its impressive size and caramel softness; this date is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in dietary fibre, potassium, and natural energy, Egyptian Medjool Dates are more than just a snack—they're a luxurious everyday indulgence. Their plump, soft flesh and deep toffee sweetness make them perfect for everyday use, whether stuffed with nuts, blended into date paste, or savoured alongside afternoon coffee.

Egyptian Medjool Large is certified to EU organic and HACCP standards.

Nutritional Benefits:
Jumbo size – extra-large fruit means more soft, caramel-rich flesh in every single date.
Fibre-rich – supports healthy digestion and helps keep you comfortably full for longer.
Potassium boost – helps maintain healthy blood pressure and proper muscle and nerve function.
Natural energy – wholesome fruit sugars provide a quick lift before exercise or fasting.
Refined-sugar swap – ideal for naturally sweetening smoothies, baking, and energy bites.`, image: mealdb("Medjool Dates") },
  { id: 20, name: "Safawi Dates 1 kg (সাফাওয়ি খেজুর)", slug: "safawi-dates", price: 990, originalPrice: 1200, category: "Dates", category_slug: "dates", brand_slug: "orchard", stock: 50, unlimitedStock: false, description: `Discover the Safawi Dates 1 kg hand-picked from the palm gardens of Madinah and imported as semi-dry whole fruit, each date selected for its dark colour and firm, satisfying bite; this date is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in iron, dietary fibre, and natural antioxidants, Safawi Dates are more than just a snack—they're a nourishing, mildly sweet treat with deep heritage. Their soft yet firm flesh and rich, almost chocolatey flavour make them perfect for everyday use, whether enjoyed at iftar, chopped into oatmeal, or paired with strong black coffee.

Safawi Dates are certified to ISO 22000 and HACCP food-safety standards.

Nutritional Benefits:
Iron source – supports healthy red blood cell production and helps combat everyday fatigue.
Balanced sweetness – mildly sweet flavour satisfies cravings without feeling overly sugary.
Fibre-rich – semi-dry texture delivers fibre that supports steady, comfortable digestion.
Antioxidant content – natural polyphenols help protect cells from oxidative stress over time.
Satisfying bite – firmer flesh makes these dates ideal for stuffing, chopping, and snacking.`, image: mealdb("Medjool Dates") },
  { id: 29, name: "Tunisian Deglet Dates 1 kg (তিউনিসিয়ান খেজুর)", slug: "tunisian-deglet-dates", price: 760, originalPrice: 950, category: "Dates", category_slug: "dates", brand_slug: "orchard", stock: 70, unlimitedStock: false, description: `Discover the Tunisian Deglet Dates 1 kg hand-picked from sunlit Tunisian oases and imported as slender, translucent fruit, the celebrated Deglet Nour variety prized across the Mediterranean; this date is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in dietary fibre, natural sugars, and essential minerals, Tunisian Deglet Dates are more than just a snack—they're an elegant, lightly sweet everyday pleasure. Their semi-soft, honey-coloured flesh and delicate flavour make them perfect for everyday use, whether added to cheese boards, chopped into salads, or simmered into tagines and stews.

Tunisian Deglet Dates are certified to EU organic and HACCP standards.

Nutritional Benefits:
Light sweetness – a subtle, honeyed flavour that suits both sweet and savoury dishes.
Fibre support – semi-soft flesh provides gentle fibre for smooth, regular digestion.
Mineral-rich – supplies magnesium, potassium, and copper for energy, nerves, and bones.
Versatile texture – translucent flesh chops and slices cleanly for baking and cooking.
Natural energy – wholesome sugars offer a steady, clean lift through the day.`, image: mealdb("Medjool Dates") },

  // ── Cooking Essentials (spices/flour) ──
  { id: 21, name: "Rice Flour 2 kg (চালের গুঁড়া)", slug: "rice-flour", price: 220, originalPrice: 280, category: "Spices", category_slug: "spices", brand_slug: "pureleaf", stock: 120, unlimitedStock: true, description: `Discover the Rice Flour 2 kg stone-ground from carefully selected rice in small batches and sifted to a fine, silky texture, with no bleaching, additives, or anti-caking agents; this flour is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in complex carbohydrates, natural starch, and gentle nutrients, Rice Flour is more than just a baking staple—it's the heart of countless traditional treats. Its smooth texture and neutral taste make it perfect for everyday use, whether shaping soft pitha, thickening curries and gravies, or baking light, gluten-free breads and pancakes.

Rice Flour is certified to BSTI food-safety standards.

Nutritional Benefits:
Naturally gluten-free – a safe, versatile flour for those avoiding wheat and gluten.
Smooth thickener – fine grind dissolves easily to thicken sauces, soups, and batters cleanly.
Light texture – produces tender, delicate pitha, dumplings, and steamed cakes every time.
Energy source – complex carbohydrates provide steady fuel for active, busy daily routines.
Additive-free – stone-ground with nothing added, just pure, freshly milled rice flour.`, image: mealdb("Plain Flour") },
  { id: 22, name: "Premium Atta 2 kg (আটা)", slug: "premium-atta", price: 180, originalPrice: 230, category: "Spices", category_slug: "spices", brand_slug: "pureleaf", stock: 130, unlimitedStock: true, description: `Discover the Premium Atta 2 kg stone-ground from whole wheat grain selected for plumpness and freshness, milled with the bran and germ intact and never bleached or refined; this flour is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in dietary fibre, plant protein, and B vitamins, Premium Atta is more than just flour—it's the wholesome foundation of every home-cooked meal. Its soft, pliable dough and earthy flavour make it perfect for everyday use, whether rolling out fluffy rotis, layering flaky parathas, or baking rustic whole-wheat breads.

Premium Atta is certified to BSTI food-safety standards.

Nutritional Benefits:
Whole-grain fibre – bran and germ deliver fibre that supports digestion and lasting fullness.
Plant protein – contributes protein for muscle maintenance and balanced everyday nutrition.
B vitamins – whole wheat naturally supplies B vitamins for energy and a healthy metabolism.
Soft, pliable dough – fine milling produces tender rotis that stay soft for hours.
No refining – ground with everything the grain offers, nothing stripped away or bleached.`, image: A("/products/premium-atta.webp") },
  { id: 30, name: "Coriander Powder 200 g (ধনিয়া গুঁড়া)", slug: "coriander-powder", price: 150, originalPrice: 190, category: "Spices", category_slug: "spices", brand_slug: "pureleaf", stock: 160, unlimitedStock: true, description: `Discover the Coriander Powder 200 g stone-ground from sun-dried coriander seeds in small fresh batches, with nothing added—no fillers, no colour—just the clean, citrusy spice itself; this spice is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in dietary fibre, antioxidants, and essential oils, Coriander Powder is more than just a spice—it's the gentle backbone of balanced curry flavour. Its warm, citrusy aroma make it perfect for everyday use, whether building a masala base, seasoning lentils and vegetables, or blending into spice rubs and marinades.

Coriander Powder is certified to BSTI food-safety standards.

Nutritional Benefits:
Digestive aid – traditionally used to ease bloating and support comfortable, smooth digestion daily.
Antioxidant rich – natural plant compounds help defend cells against everyday oxidative stress.
Aromatic essential oils – freshly ground seeds release warm, citrusy oils for deeper flavour.
Blood sugar support – studies suggest coriander may help support healthy blood sugar balance.
Pure and unblended – ground from whole seeds only, with no fillers or artificial colour.`, image: A("/products/coriander-powder.webp") },

  // ── More Organic Certified ──
  { id: 23, name: "Organic Spirulina 250 g (স্পিরুলিনা)", slug: "organic-spirulina", price: 540, originalPrice: 700, category: "Organic", category_slug: "organic", brand_slug: "pureleaf", stock: 70, unlimitedStock: false, description: `Discover the Organic Spirulina 250 g cultivated in clean, controlled freshwater ponds and gently harvested, then carefully dried into a fine powder to lock in its deep green nutrition; this blend is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in complete plant protein, iron, and chlorophyll, Organic Spirulina is more than just a supplement—it's one of nature's most concentrated superfoods. Its earthy taste and fine texture make it perfect for everyday use, whether blended into green smoothies, stirred into juice, or mixed into energy balls and dips.

Organic Spirulina is certified to EU and USDA NOP organic standards.

Nutritional Benefits:
Complete protein – supplies all essential amino acids in a clean, plant-based form.
Iron-rich – plant iron supports healthy energy levels and combats everyday tiredness.
Antioxidant power – phycocyanin and chlorophyll help defend cells against oxidative stress.
Immune support – nutrient density helps the body stay resilient through daily demands.
Detox helper – chlorophyll traditionally supports the body's natural cleansing processes gently.`, image: A("/products/spirulina-powder.webp") },
  { id: 24, name: "Organic Virgin Coconut Oil 1 L (নারিকেল তেল)", slug: "organic-coconut-oil", price: 720, originalPrice: 900, category: "Organic", category_slug: "organic", brand_slug: "pureleaf", stock: 60, unlimitedStock: false, description: `Discover the Organic Virgin Coconut Oil 1 L cold-pressed from the fresh white meat of organically grown coconuts, extracted without heat, bleaching, or refining so its delicate aroma stays intact; this oil is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in medium-chain triglycerides, lauric acid, and natural antioxidants, Virgin Coconut Oil is more than just an oil—it's a versatile kitchen and beauty essential. Its fresh coconut aroma and silky texture make it perfect for everyday use, whether sautéing and baking, deep-conditioning hair, or moisturising dry skin.

Organic Virgin Coconut Oil is certified to EU and USDA NOP organic standards.

Nutritional Benefits:
MCT energy – medium-chain triglycerides convert quickly into clean, readily usable energy.
Lauric acid – offers natural antimicrobial properties that support immunity and gut health.
Skin nourishment – deeply hydrates and softens dry skin without clogging or greasiness.
Hair care – penetrates strands to reduce protein loss and add lasting shine.
Stable cooking – resists oxidation at heat, making it dependable for everyday frying.`, image: mealdb("Desiccated Coconut") },
  { id: 25, name: "Ashwagandha Powder 100 g (অশ্বগন্ধা)", slug: "ashwagandha-powder", price: 460, originalPrice: 600, category: "Organic", category_slug: "organic", brand_slug: "pureleaf", stock: 0, unlimitedStock: false, description: `Discover the Ashwagandha Powder 100 g stone-ground from organically grown ashwagandha roots, harvested and dried whole before milling so the adaptogenic root retains its full traditional potency; this blend is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in withanolides, iron, and adaptogenic compounds, Ashwagandha Powder is more than just a supplement—it's a centuries-old ally for resilience and calm. Its earthy aroma and fine texture make it perfect for everyday use, whether stirred into warm milk before bed, blended into smoothies, or mixed with honey as a daily tonic.

Ashwagandha Powder is certified to EU and USDA NOP organic standards.

Nutritional Benefits:
Stress support – adaptogenic withanolides help the body manage everyday stress and tension.
Restful sleep – traditionally taken at night to encourage calm, deeper, more restorative rest.
Energy and stamina – supports steady vitality and helps reduce feelings of daily fatigue.
Hormone balance – long used in Ayurveda to support healthy hormonal and thyroid function.
Focus and clarity – may help sharpen concentration and ease a busy, restless mind.`, image: A("/products/ashwagandha-powder.webp") },
  { id: 31, name: "Organic Moringa Powder 100 g (মরিঙ্গা)", slug: "organic-moringa-powder", price: 380, originalPrice: 480, category: "Organic", category_slug: "organic", brand_slug: "pureleaf", stock: 75, unlimitedStock: false, description: `Discover the Organic Moringa Powder 100 g made from shade-dried moringa leaves grown on organic farms and stone-ground at low temperatures to protect their vibrant colour and nutrients; this blend is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in vitamins A and C, calcium, and plant protein, Organic Moringa Powder is more than just a green supplement—it's one of the most nutrient-dense leaves on earth. Its fresh, grassy taste and fine texture make it perfect for everyday use, whether whisked into smoothies, stirred into soups, or sprinkled over salads and curries.

Organic Moringa Powder is certified to EU and USDA NOP organic standards.

Nutritional Benefits:
Vitamin-rich – packed with vitamins A and C for healthy vision, skin, and immunity.
Calcium boost – plant calcium supports strong bones and teeth without any dairy.
Iron source – contributes plant iron to help maintain energy and reduce tiredness.
Antioxidant load – abundant plant compounds help defend cells against oxidative stress.
Daily nourishment – a small green scoop adds broad-spectrum nutrition to any meal.`, image: A("/products/moringa-powder.webp") },
  { id: 26, name: "Amrapali Mango 12 kg (আম্রপালি আম)", slug: "amrapali-mango-12kg", price: 3000, originalPrice: 3600, category: "Mango", category_slug: "mango", brand_slug: "orchard", stock: 40, unlimitedStock: false, preorder: true, sold: 320, description: `Discover the Amrapali Mango 12 kg tree-ripened in the famed orchards of Rajshahi and harvested at full natural sweetness, then packed straight from the grove with absolutely no carbide or formalin; this fruit is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in vitamin A, vitamin C, and dietary fibre, Amrapali Mango is more than just a fruit—it's the celebrated taste of a Rajshahi summer. Its powerful aroma and smooth, fibreless flesh make it perfect for everyday use, whether eaten chilled and fresh, blended into shakes, or set into homemade kulfi and puddings.

Amrapali Mango is certified to BSTI food-safety standards.

Why You'll Love It:
Rajshahi origin – grown in the region most celebrated for sweet, aromatic Bengali mangoes.
No carbide or formalin – ripened only by nature, never with chemicals or preservatives.
Fibreless flesh – smooth, buttery pulp that slices and blends without any stringiness.
Twelve-kilo pack – a generous quantity to share fresh fruit through the season.
Vitamin-rich – loaded with vitamins A and C for healthy skin, eyes, and immunity.`, image: img("photo-1519096845289-95806ee03a1a") },
  { id: 27, name: "Himsagar Mango 5 kg (হিমসাগর আম)", slug: "himsagar-mango-5kg", price: 1400, originalPrice: 1700, category: "Mango", category_slug: "mango", brand_slug: "orchard", stock: 55, unlimitedStock: false, preorder: true, sold: 410, description: `Discover the Himsagar Mango 5 kg tree-ripened on the branch and hand-picked at its aromatic peak, the variety crowned the king of mangoes and matured entirely without chemicals or carbide; this fruit is 100% natural, unprocessed, and organic—preserving all of nature's goodness.

Rich in vitamin A, vitamin C, and natural antioxidants, Himsagar Mango is more than just a fruit—it's a prized seasonal delicacy treasured for generations. Its intense, heady aroma and buttery, fibreless flesh make it perfect for everyday use, whether eaten fresh and chilled, spooned over desserts, or blended into the silkiest lassi.

Himsagar Mango is certified to BSTI food-safety standards.

Why You'll Love It:
King of mangoes – Himsagar's legendary aroma and flavour set the benchmark for sweetness.
Buttery fibreless flesh – exceptionally smooth pulp that melts effortlessly in the mouth.
Tree-ripened – matured naturally on the branch for the deepest, most authentic flavour.
Chemical-free – never treated with carbide or artificial ripeners, just sun and time.
Five-kilo pack – the ideal size to savour this premium variety throughout its short season.`, image: img("photo-1546173159-315724a31696") },

  // ── Rice ──────────────────────────────────────────────────────────
  { id: 60, name: "Aromatic Kalijira Rice (চিনিগুঁড়া চাল)", slug: "kalijira-rice", price: 180, originalPrice: 220, category: "Rice", category_slug: "rice", brand_slug: "orchard", stock: 140, unlimitedStock: false, sold: 320, description: `Fragrant baby Kalijira rice, the prized aromatic grain of Bengal — tiny, tender kernels with a natural sweet aroma, perfect for polao, khichuri and milk-rice desserts.`, image: mealdb("Rice"), hasVariations: true, variationType: "Size", variants: [
    { id: 601, label: "1 kg", price: 180, original_price: 220, stock: 80, unlimited_stock: false },
    { id: 602, label: "5 kg", price: 850, original_price: 1050, stock: 40, unlimited_stock: false },
  ] },
  { id: 61, name: "Premium Basmati Rice (বাসমতি চাল)", slug: "premium-basmati-rice", price: 320, originalPrice: 400, category: "Rice", category_slug: "rice", brand_slug: "orchard", stock: 110, unlimitedStock: false, sold: 280, description: `Long-grain aged Basmati with an unmistakable nutty aroma and fluffy, non-sticky grains that elongate beautifully when cooked — ideal for biryani and fried rice.`, image: mealdb("Basmati Rice") },
  { id: 62, name: "Brown Rice (ব্রাউন রাইস)", slug: "brown-rice", price: 150, originalPrice: 190, category: "Rice", category_slug: "rice", brand_slug: "pureleaf", stock: 95, unlimitedStock: false, sold: 140, description: `Wholegrain brown rice with the bran intact — higher in fibre and minerals, with a pleasant chewy texture and earthy flavour for a wholesome everyday meal.`, image: mealdb("Rice") },

  // ── Flours & Lentils ──────────────────────────────────────────────
  { id: 63, name: "Red Lentils / Masoor Dal (মসুর ডাল)", slug: "masoor-dal", price: 140, originalPrice: 170, category: "Flours & Lentils", category_slug: "flours-lentils", brand_slug: "pureleaf", stock: 160, unlimitedStock: false, sold: 360, description: `Clean, sorted red lentils that cook down quickly into a smooth, comforting dal — a protein-rich daily staple for every Bengali kitchen.`, image: mealdb("Red Lentils") },
  { id: 64, name: "Whole Wheat Atta (আটা)", slug: "whole-wheat-atta", price: 75, originalPrice: 95, category: "Flours & Lentils", category_slug: "flours-lentils", brand_slug: "pureleaf", stock: 130, unlimitedStock: false, sold: 210, description: `Stone-ground whole wheat flour with all the bran retained — soft, pliable dough for everyday ruti, paratha and luchi.`, image: mealdb("Plain Flour"), hasVariations: true, variationType: "Size", variants: [
    { id: 641, label: "1 kg", price: 75, original_price: 95, stock: 80, unlimited_stock: false },
    { id: 642, label: "2 kg", price: 145, original_price: 185, stock: 50, unlimited_stock: false },
  ] },
  { id: 65, name: "Chickpea Flour / Besan (বেসন)", slug: "besan-chickpea-flour", price: 120, originalPrice: 150, category: "Flours & Lentils", category_slug: "flours-lentils", brand_slug: "pureleaf", stock: 90, unlimitedStock: false, sold: 175, description: `Finely milled chickpea flour for crisp pakora, beguni and savoury batters — naturally gluten-free and rich in plant protein.`, image: mealdb("Plain Flour") },

  // ── Pickle ────────────────────────────────────────────────────────
  { id: 66, name: "Mixed Vegetable Pickle (মিক্সড আচার)", slug: "mixed-vegetable-pickle", price: 220, originalPrice: 280, category: "Pickle", category_slug: "pickle", brand_slug: "pureleaf", stock: 85, unlimitedStock: false, sold: 240, description: `A tangy-spicy medley of seasonal vegetables sun-cured in mustard oil and traditional spices — the perfect zesty side for rice, khichuri and paratha.`, image: mealdb("Garlic") },
  { id: 67, name: "Mango Pickle (আমের আচার)", slug: "mango-pickle", price: 200, originalPrice: 260, category: "Pickle", category_slug: "pickle", brand_slug: "orchard", stock: 100, unlimitedStock: false, sold: 300, description: `Classic raw-mango pickle, sun-matured in mustard oil with panch phoron — bold, sour and fiery, just like home-made achaar.`, image: mealdb("Mango") },
  { id: 68, name: "Garlic Pickle (রসুনের আচার)", slug: "garlic-pickle", price: 240, originalPrice: 300, category: "Pickle", category_slug: "pickle", brand_slug: "pureleaf", stock: 70, unlimitedStock: false, sold: 130, description: `Whole garlic cloves slow-cured in spiced mustard oil — pungent, warming and intensely flavourful, a little goes a long way.`, image: mealdb("Garlic") },

  // ── Oil & Ghee (extra) ────────────────────────────────────────────
  { id: 69, name: "Premium Desi Ghee (প্রিমিয়াম দেশি ঘি)", slug: "premium-desi-ghee", price: 1050, originalPrice: 1300, category: "Oil & Ghee", category_slug: "mustard-oil", brand_slug: "pureleaf", stock: 60, unlimitedStock: false, sold: 260, description: `Slow-cooked desi ghee with a deep nutty aroma and grainy golden texture — perfect for polao, sweets and a wholesome finishing spoon over hot rice.`, image: mealdb("Ghee"), hasVariations: true, variationType: "Size", variants: [
    { id: 691, label: "500 g", price: 1050, original_price: 1300, stock: 35, unlimited_stock: false },
    { id: 692, label: "1 kg", price: 2000, original_price: 2500, stock: 25, unlimited_stock: false },
  ] },
  { id: 70, name: "Cold-Pressed Coconut Oil (নারকেল তেল)", slug: "cold-pressed-coconut-oil", price: 320, originalPrice: 410, category: "Oil & Ghee", category_slug: "mustard-oil", brand_slug: "pureleaf", stock: 90, unlimitedStock: false, sold: 190, description: `Pure cold-pressed coconut oil with a light, fresh aroma — equally at home in cooking, on skin, and in hair care.`, image: mealdb("Desiccated Coconut") },
  { id: 71, name: "Black Seed Oil / Kalonji (কালোজিরা তেল)", slug: "black-seed-oil", price: 450, originalPrice: 560, category: "Oil & Ghee", category_slug: "mustard-oil", brand_slug: "pureleaf", stock: 75, unlimitedStock: false, sold: 150, description: `Cold-pressed black seed (kalonji) oil, prized in traditional wellness for its warm, peppery punch — taken by the spoon or drizzled over food.`, image: mealdb("Olive Oil") },
];

// Sample "sold" figures so the deal cards show a sales count like a marketplace.
const SOLD = [82000, 64000, 51000, 23000, 18000, 21000, 96000, 47000, 130000, 88000, 36000, 12000];
PRODUCTS.forEach((p, i) => { p.sold = SOLD[i] ?? 1200; });

// PDP gallery — the main cutout first, then a few real photos of the SAME kind
// of product (different angles/uses) so the thumbnail rail shows variety.
const CATEGORY_ART: Record<string, string> = {
  "mustard-oil": "oilandghee",
  "ghee": "oilandghee",
  "honey": "honey",
  "dates": "dates",
  "nuts-seeds": "nutsandseeds",
  "spices": "spices",
  "tea-coffee": "beverage",
  "organic": "organic",
  "mango": "mango",
  "rice": "rice",
  "flours-lentils": "flowersandlentils",
  "pickle": "functionalfood",
};

// PDP gallery: the product cutout first, then on-topic category art. Previously
// this pulled three RANDOM photos per product from loremflickr, which is why a
// bottle of black seed oil could render as a photograph of a cat.
PRODUCTS.forEach((p) => {
  if (p.images) return;
  const art = CATEGORY_ART[p.category_slug || ""] || "organic";
  const main = p.image || A("/placeholder.svg");
  p.images = [main, A(`/categories/${art}.webp`), A("/hero-spices.webp")];
});

// One product carries a demo video so the floating player can be previewed.
const PRODUCT_VIDEOS: Record<string, string> = {
  "pure-mustard-oil": "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
};
PRODUCTS.forEach((p) => { const v = p.slug && PRODUCT_VIDEOS[p.slug]; if (v) p.video_url = v; });

export interface ApiCategory { id: number | string; slug?: string; name: string }

export const CATEGORIES: ApiCategory[] = [
  { id: 1, slug: "mustard-oil", name: "Mustard Oil" },
  { id: 2, slug: "ghee", name: "Ghee" },
  { id: 3, slug: "honey", name: "Honey" },
  { id: 4, slug: "dates", name: "Dates" },
  { id: 5, slug: "nuts-seeds", name: "Nuts & Seeds" },
  { id: 6, slug: "spices", name: "Spices" },
  { id: 7, slug: "tea-coffee", name: "Tea & Coffee" },
  { id: 8, slug: "organic", name: "Organic" },
  { id: 9, slug: "rice", name: "Rice" },
  { id: 10, slug: "flours-lentils", name: "Flours & Lentils" },
  { id: 11, slug: "pickle", name: "Pickle" },
  { id: 12, slug: "mango", name: "Mango" },
];

export interface BlogPost {
  id: number; slug: string; title: string; image?: string | null;
  excerpt?: string; created_at: string; author_name: string; content: string;
}

export const POSTS: BlogPost[] = [
  { id: 1, slug: "how-to-spot-pure-mustard-oil", title: "How to spot pure mustard oil", image: img("photo-1474979266404-7eaacbcd87c5"), excerpt: "Pungent aroma, deep colour, and a tingle in the nose — the simple tests for the real thing.", created_at: "2026-05-02", author_name: "ShopKart", content: "<p>Genuine ghani-pressed mustard oil has a sharp aroma and a clear golden colour. If it smells flat or looks pale, it is likely blended.</p><p>Keep it in a cool, dark place and it will stay fresh for months — no preservatives needed.</p>" },
  { id: 2, slug: "why-raw-honey-crystallises", title: "Why raw honey crystallises (and that's good)", image: img("photo-1587049352846-4a222e784d38"), excerpt: "Natural crystallisation is a sign of purity, not spoilage. Here's the science in plain words.", created_at: "2026-04-18", author_name: "ShopKart", content: "<p>Raw, unprocessed honey naturally turns grainy in cooler weather because of its glucose content. Warm the jar gently and it flows again.</p>" },
  { id: 3, slug: "everyday-uses-of-pure-ghee", title: "5 everyday uses of pure ghee", image: img("photo-1589985270826-4b7bb135bc9d"), excerpt: "From polao to a spoon in warm milk — small ways to bring pure ghee into your kitchen.", created_at: "2026-03-30", author_name: "ShopKart", content: "<p>Pure cow ghee has a high smoke point and a rich aroma that lifts rice, curries, sweets and even morning toast.</p>" },
];

export interface LiveStream { id: number; title: string; views: number; cover?: string; productSlug?: string }

export const LIVE_STREAMS: LiveStream[] = [
  { id: 1, title: "Mustard Oil Live", views: 142000, cover: img("photo-1474979266404-7eaacbcd87c5"), productSlug: "pure-mustard-oil" },
  { id: 2, title: "Pure Ghee Live", views: 98000, cover: img("photo-1589985270826-4b7bb135bc9d"), productSlug: "pure-cow-ghee" },
  { id: 3, title: "Sundarban Honey Live", views: 76000, cover: img("photo-1587049352846-4a222e784d38"), productSlug: "sundarban-natural-honey" },
  { id: 4, title: "Premium Dates Live", views: 64000, cover: img("photo-1609501676725-7186f017a4b7"), productSlug: "ajwa-dates" },
  { id: 5, title: "Healthy Nuts Live", views: 51000, cover: img("photo-1508061253366-f7da158b6d46"), productSlug: "premium-mixed-nuts" },
  { id: 6, title: "Organic Combo Live", views: 33000, cover: img("photo-1601493700631-2b16ec4b4716"), productSlug: "organic-combo-box" },
];

const bi = (en: string) => ({ en, bn: en });

export const POLICY = {
  title: bi("Terms & Policies"),
  intro: bi("This is sample policy copy shown in the preview. In the live storefront each tenant edits this in place."),
  lastUpdated: bi("June 2026"),
  sections: [
    { title: bi("1. Orders"), content: bi("Orders are confirmed once payment or cash-on-delivery is selected. You'll receive a confirmation with your order number.") },
    { title: bi("2. Shipping"), content: bi("We deliver nationwide. Delivery times vary by location, typically 2–5 business days.") },
    { title: bi("3. Returns"), content: bi("Unused items in original packaging can be returned within 7 days for a full refund.") },
    { title: bi("4. Privacy"), content: bi("We only use your details to process and deliver your order. We never sell your data.") },
  ],
};

export const PRIVACY = {
  title: bi("Privacy Policy"),
  intro: bi("We take your privacy very seriously. This policy describes how we collect, use and protect your information when you use our website."),
  lastUpdated: bi("January 1, 2026"),
  sections: [
    { title: bi("Information We Collect"), content: bi("We collect the information you provide when you place an order or contact us — such as your name, email, phone number and delivery address.") },
    { title: bi("How We Use Your Information"), content: bi("Your information is used to process orders, deliver products, provide support and, with your consent, send you offers and updates.") },
    { title: bi("Data Protection"), content: bi("We apply industry-standard safeguards to protect your data. We never sell your personal information to third parties.") },
    { title: bi("Cookies"), content: bi("We use cookies to keep you signed in, remember your cart and understand how the site is used. You can disable cookies in your browser.") },
    { title: bi("Your Rights"), content: bi("You may request access to, correction of, or deletion of your personal data at any time by contacting our support team.") },
  ],
};

export const TERMS = {
  title: bi("Terms & Conditions"),
  intro: bi("Please read these terms and conditions carefully before using our website and services."),
  lastUpdated: bi("January 1, 2026"),
  sections: [
    { title: bi("Use of Our Service"), content: bi("By accessing this site you agree to use it lawfully and not to misuse, disrupt or attempt to gain unauthorised access to any part of the service.") },
    { title: bi("Orders & Payment"), content: bi("All orders are subject to availability and confirmation. Prices are shown at checkout and payment is collected via the methods offered.") },
    { title: bi("Pricing"), content: bi("We make every effort to keep prices accurate. If a pricing error occurs, we will contact you before processing the order.") },
    { title: bi("Intellectual Property"), content: bi("All content on this site — logos, text, images and design — is our property and may not be reused without written permission.") },
    { title: bi("Limitation of Liability"), content: bi("We are not liable for indirect or incidental damages arising from the use of our website or products, to the extent permitted by law.") },
  ],
};

export const REFUND = {
  title: bi("Refund Policy"),
  intro: bi("Your satisfaction is our top priority. If you are not satisfied with your order, our refund process is simple and transparent."),
  lastUpdated: bi("January 1, 2026"),
  sections: [
    { title: bi("Refund Eligibility"), content: bi("You are eligible for a refund if the product is wrong or defective, damaged in transit, or significantly different from its description.") },
    { title: bi("Refund Process"), content: bi("Contact our support team to start a refund. Share your order number and a short description of the issue, with photos if applicable.") },
    { title: bi("Refund Timeline"), content: bi("Once approved, refunds are issued to your original payment method, typically within 5–7 business days.") },
    { title: bi("Exchange Policy"), content: bi("Prefer an exchange? We will replace the item with the same product, subject to availability, at no extra cost.") },
    { title: bi("Contact"), content: bi("For any questions about refunds or exchanges, visit our contact page — we are always happy to help.") },
  ],
};
