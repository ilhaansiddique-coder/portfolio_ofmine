// DEMO MOCK — replaces the real PostgreSQL-backed Prisma client.
// The HobbyMart demo is a static export with no database, so this serves the
// seeded arrays from mock-db.ts through a tiny Prisma-compatible query engine.
// It implements only what the storefront uses (findMany / findUnique / findFirst
// / count with where / orderBy / take / skip); writes are no-ops, and models the
// storefront never reads (orders, users, wishlist) return empty results so
// account/checkout pages render a logged-out "demo mode" state instead of crashing.

import { CATEGORIES, PRODUCTS, REVIEWS, BLOG_POSTS, SITE_SETTINGS } from "./mock-data";

type Row = Record<string, any>;
type Args = {
  where?: Row;
  orderBy?: Row | Row[];
  take?: number;
  skip?: number;
  select?: Row;
  include?: Row;
  distinct?: string | string[];
};

// Match a row against a Prisma-style where. Supports equality, { equals },
// { in }, { not }, { contains }, and nested AND/OR — enough for the storefront.
function match(row: Row, where?: Row): boolean {
  if (!where) return true;
  return Object.entries(where).every(([key, cond]) => {
    if (key === "AND") return (cond as Row[]).every((c) => match(row, c));
    if (key === "OR") return (cond as Row[]).some((c) => match(row, c));
    if (key === "NOT") return !match(row, cond as Row);
    const val = row[key];
    if (cond && typeof cond === "object" && !Array.isArray(cond)) {
      if ("equals" in cond) return val === cond.equals;
      if ("in" in cond) return (cond.in as any[]).includes(val);
      if ("not" in cond) return val !== cond.not;
      if ("contains" in cond)
        return String(val ?? "").toLowerCase().includes(String(cond.contains).toLowerCase());
      // Relation filter (e.g. categories: { some: {...} }) — pass-through for demo.
      return true;
    }
    return val === cond;
  });
}

function order(rows: Row[], orderBy?: Row | Row[]): Row[] {
  const specs = orderBy ? (Array.isArray(orderBy) ? orderBy : [orderBy]) : [];
  if (!specs.length) return rows;
  return [...rows].sort((a, b) => {
    for (const spec of specs) {
      const [field, dir] = Object.entries(spec)[0] as [string, "asc" | "desc"];
      if (typeof dir !== "string") continue; // skip relation ordering
      const av = a[field], bv = b[field];
      if (av === bv) continue;
      const cmp = av > bv ? 1 : -1;
      return dir === "desc" ? -cmp : cmp;
    }
    return 0;
  });
}

// `select` narrows fields; `include` is already satisfied because seed rows carry
// their nested relations, so we return the row untouched when include is present.
function project(row: Row, args: Args): Row {
  if (args.select) {
    const out: Row = {};
    for (const [k, v] of Object.entries(args.select)) if (v) out[k] = row[k];
    return out;
  }
  return row;
}

function collection(rows: Row[]) {
  return {
    async findMany(args: Args = {}) {
      let r = rows.filter((x) => match(x, args.where));
      r = order(r, args.orderBy);
      if (args.skip) r = r.slice(args.skip);
      if (typeof args.take === "number") r = r.slice(0, args.take);
      return r.map((x) => project(x, args));
    },
    async findUnique(args: Args = {}) {
      const r = rows.find((x) => match(x, args.where));
      return r ? project(r, args) : null;
    },
    async findFirst(args: Args = {}) {
      const r = order(rows.filter((x) => match(x, args.where)), args.orderBy)[0];
      return r ? project(r, args) : null;
    },
    async count(args: Args = {}) {
      return rows.filter((x) => match(x, args.where)).length;
    },
    async aggregate() {
      return { _count: rows.length, _avg: {}, _sum: {}, _min: {}, _max: {} };
    },
    async groupBy() {
      return [];
    },
    // Writes are inert in the demo — return a plausible shape so callers don't throw.
    async create(args: { data?: Row } = {}) {
      return { id: `demo-${Math.round(rows.length + 1)}`, ...(args.data ?? {}) };
    },
    async update(args: { data?: Row } = {}) {
      return { ...(args.data ?? {}) };
    },
    async upsert(args: { create?: Row; update?: Row } = {}) {
      return { ...(args.create ?? args.update ?? {}) };
    },
    async delete() {
      return {};
    },
    async createMany() {
      return { count: 0 };
    },
    async deleteMany() {
      return { count: 0 };
    },
    async updateMany() {
      return { count: 0 };
    },
  };
}

// Storefront-read models are backed by seed data; the rest are empty (demo mode).
export const prisma: any = {
  category: collection(CATEGORIES),
  product: collection(PRODUCTS),
  review: collection(REVIEWS),
  blogPost: collection(BLOG_POSTS),
  siteSettings: collection([SITE_SETTINGS]),
  productCategory: collection([]),
  user: collection([]),
  account: collection([]),
  session: collection([]),
  order: collection([]),
  orderItem: collection([]),
  wishlistItem: collection([]),
  verificationToken: collection([]),
  $connect: async () => {},
  $disconnect: async () => {},
  $transaction: async (ops: any) =>
    Array.isArray(ops) ? Promise.all(ops) : ops(prisma),
};
