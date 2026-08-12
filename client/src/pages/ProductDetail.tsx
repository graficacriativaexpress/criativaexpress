import { ArrowLeft, BadgePercent, ChevronLeft, ChevronRight, CreditCard, PackageCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { CatalogVisual } from "@/components/CatalogVisual";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { categoryLabel, formatCurrency } from "@shared/catalog";

export default function ProductDetail() {
  const [, params] = useRoute("/produto/:slug");
  const { data: settings } = trpc.catalog.settings.useQuery();
  const { data: product, isLoading, error } = trpc.catalog.bySlug.useQuery(
    { slug: params?.slug ?? "" },
    { enabled: Boolean(params?.slug) }
  );
  const { data: catalogProducts = [] } = trpc.catalog.list.useQuery();
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [params?.slug]);

  if (isLoading) {
    return <div className="min-h-screen bg-paper"><div className="container py-10"><div className="h-8 w-32 animate-pulse rounded bg-sand" /><div className="mt-10 grid gap-8 md:grid-cols-2"><div className="aspect-square animate-pulse rounded-3xl bg-sand" /><div className="h-96 animate-pulse rounded-3xl bg-sand" /></div></div></div>;
  }
  if (error) {
    return <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center"><h1 className="font-display text-4xl">Não foi possível abrir este produto</h1><p className="mt-3 max-w-md text-ink/65">Atualize a página ou volte ao catálogo para tentar novamente.</p><Link href="/" className="mt-7 rounded-full bg-wine px-5 py-3 text-sm font-bold text-white">Voltar ao catálogo</Link></div>;
  }
  if (!product) {
    return <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center"><h1 className="font-display text-4xl">Produto não encontrado</h1><p className="mt-3 text-ink/65">Ele pode ter sido removido ou não está disponível.</p><Link href="/" className="mt-7 rounded-full bg-wine px-5 py-3 text-sm font-bold text-white">Voltar ao catálogo</Link></div>;
  }

  const image = product.images[selected] ?? product.images[0];
  const isKit = product.type === "kit";
  const currentProductIndex = catalogProducts.findIndex(item => item.slug === product.slug);
  const previousProduct = currentProductIndex > 0 ? catalogProducts[currentProductIndex - 1] : undefined;
  const nextProduct = currentProductIndex >= 0 && currentProductIndex < catalogProducts.length - 1 ? catalogProducts[currentProductIndex + 1] : undefined;

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-[#eadfd2] bg-[#f8f4ee]/90 backdrop-blur">
        <div className="container flex h-[68px] items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-wine"><ArrowLeft className="h-4 w-4" />Catálogo</Link>
          <Link href="/" aria-label="Criativa Express — início"><img src="/manus-storage/logo-criativa-express-cropped_7b98716a.png" alt="Criativa Express" className="h-12 w-28 object-contain object-right" /></Link>
        </div>
      </header>
      <main className="container py-8 sm:py-12">
        <div className="grid gap-9 lg:grid-cols-[1.08fr_.92fr] lg:gap-14">
          <section>
            <div className="relative aspect-square overflow-hidden rounded-[1.6rem] border border-[#e6dacd] bg-white soft-shadow">
              <CatalogVisual imageUrl={image?.url} label={image?.altText || product.name} />
              {product.images.length > 1 && <><Button variant="secondary" size="icon" className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90" onClick={() => setSelected((selected - 1 + product.images.length) % product.images.length)} aria-label="Imagem anterior"><ChevronLeft /></Button><Button variant="secondary" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90" onClick={() => setSelected((selected + 1) % product.images.length)} aria-label="Próxima imagem"><ChevronRight /></Button></>}
            </div>
            {product.images.length > 1 && <div className="mt-3 flex gap-2 overflow-x-auto">{product.images.map((photo, index) => <button key={photo.id} onClick={() => setSelected(index)} className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 ${selected === index ? "border-wine" : "border-transparent"}`}><CatalogVisual imageUrl={photo.url} label={photo.altText || product.name} /></button>)}</div>}
          </section>
          <section className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-gold">{categoryLabel(product.category)}</p>
            <h1 className="mt-3 font-display text-4xl leading-[1.03] tracking-[-.035em] sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-xl font-bold text-wine">{formatCurrency(product.price)}</p>
            <div className="mt-5 flex flex-wrap gap-2"><span className="inline-flex items-center gap-1.5 rounded-full border border-sky/30 bg-sky/10 px-3 py-1.5 text-xs font-bold text-ink"><CreditCard className="h-3.5 w-3.5 text-sky" />Até 3x sem juros</span><span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-bold text-ink"><BadgePercent className="h-3.5 w-3.5 text-gold" />5% de desconto no PIX à vista</span></div>
            <div className="my-7 h-px bg-[#e2d5c6]" />
            <p className="whitespace-pre-wrap text-base leading-relaxed text-ink/72">{product.description}</p>
            {isKit && product.kitItems.length > 0 && <div className="mt-7 rounded-2xl border border-[#e7d9c9] bg-white/70 p-5"><div className="flex items-center gap-2 font-semibold"><PackageCheck className="h-5 w-5 text-wine" />Composição do kit</div><ul className="mt-4 space-y-3">{product.kitItems.map(item => { const componentTotal = Number(item.itemPrice) * item.quantity; return <li key={item.id} className="flex items-center justify-between gap-3 text-sm"><span className="text-ink/75">{item.quantity.toLocaleString("pt-BR")}× {item.itemName}</span><span className="font-semibold text-ink">{componentTotal > 0 ? formatCurrency(componentTotal) : "Incluso"}</span></li>; })}</ul></div>}
            <div className="mt-8"><WhatsAppOrderButton productName={product.name} price={product.price} isKit={isKit} companyName={settings?.companyName || "Criativa Express"} whatsappNumber={settings?.whatsappNumber} whatsappGreeting={settings?.whatsappGreeting} /></div>
            <p className="mt-3 text-xs leading-relaxed text-ink/50">Ao clicar, você será direcionado ao WhatsApp com uma mensagem de pedido pronta.</p>
          </section>
        </div>
        {(previousProduct || nextProduct) && <nav className="mt-10 grid gap-3 border-t border-wine/15 pt-7 sm:grid-cols-2" aria-label="Navegação entre produtos">{previousProduct ? <Link href={`/produto/${previousProduct.slug}`} className="group flex min-w-0 items-center gap-3 rounded-2xl border border-wine/20 bg-white/70 p-4 transition hover:border-sky/70 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"><ChevronLeft className="h-5 w-5 shrink-0 text-wine transition-transform group-hover:-translate-x-0.5" /><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[.14em] text-ink/50">Produto anterior</span><span className="mt-1 block truncate font-semibold text-ink">{previousProduct.name}</span></span></Link> : <div className="hidden sm:block" />}{nextProduct ? <Link href={`/produto/${nextProduct.slug}`} className="group flex min-w-0 items-center justify-end gap-3 rounded-2xl border border-wine/20 bg-white/70 p-4 text-right transition hover:border-sky/70 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"><span className="min-w-0"><span className="block text-[10px] font-bold uppercase tracking-[.14em] text-ink/50">Próximo produto</span><span className="mt-1 block truncate font-semibold text-ink">{nextProduct.name}</span></span><ChevronRight className="h-5 w-5 shrink-0 text-wine transition-transform group-hover:translate-x-0.5" /></Link> : <div className="hidden sm:block" />}</nav>}
      </main>
    </div>
  );
}
