import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import type { CatalogProduct } from "../../../server/db";
import { formatCurrency } from "@shared/catalog";
import { categoryLabel } from "@shared/catalog";
import { CatalogVisual } from "./CatalogVisual";

export default function ProductCard({ product }: { product: CatalogProduct }) {
  const cover = product.images[0]?.url;
  return (
    <article className="lift-on-hover group overflow-hidden rounded-[1.35rem] border border-wine/15 bg-[#fffdfa] soft-shadow">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-[4/4.35] overflow-hidden bg-sand">
          <CatalogVisual imageUrl={cover} label={product.name} className="transition-transform duration-300 group-hover:scale-[1.04]" />
          <span className="absolute left-3 top-3 rounded-full border border-wine/15 bg-[#fffdfa]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-wine backdrop-blur">
            {categoryLabel(product.category)}
          </span>
          {product.isFeatured && <span className="absolute right-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-ink">Destaque</span>}
        </div>
        <div className="p-4 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-xl leading-tight text-ink">{product.name}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/65">{product.description}</p>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-wine" />
          </div>
          <p className="mt-4 text-base font-bold tracking-tight text-wine">{formatCurrency(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
