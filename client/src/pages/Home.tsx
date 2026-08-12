import { BadgePercent, CreditCard, Menu, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { catalogCategories } from "@shared/catalog";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>("todos");
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: settings } = trpc.catalog.settings.useQuery();
  const { data: products = [], isLoading, error } = trpc.catalog.list.useQuery({
    category: activeCategory === "todos" ? undefined : activeCategory as "tags" | "dtf" | "cartao_visita" | "kits",
  });
  const featured = useMemo(() => products.filter(product => product.isFeatured).slice(0, 3), [products]);
  const companyName = settings?.companyName || "Criativa Express";

  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-wine/15 bg-paper/92 backdrop-blur-xl">
        <div className="container flex h-[68px] items-center justify-between">
          <a href="/" className="group flex items-center" aria-label="Criativa Express — início">
            <img src="/manus-storage/logo-criativa-express-cropped_7b98716a.png" alt="Criativa Express" className="h-12 w-32 object-contain object-center" />
          </a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-ink/70 md:flex">
            <a href="#catalogo" className="hover:text-wine">Catálogo</a>
            <a href="#como-pedir" className="hover:text-wine">Como pedir</a>
          </nav>
          <Button variant="ghost" size="icon" className="rounded-full md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>
        {menuOpen && <nav className="container flex flex-col gap-4 border-t border-wine/15 py-5 text-sm font-semibold md:hidden"><a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo</a><a href="#como-pedir" onClick={() => setMenuOpen(false)}>Como pedir</a></nav>}
      </header>

      <main>
        <section className="hero-glow paper-grain border-b border-wine/15">
          <div className="container grid min-h-[560px] items-center gap-10 py-16 md:grid-cols-[1.12fr_.88fr] md:py-20">
            <div className="relative z-10 max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-wine/15 bg-white/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-wine"><Sparkles className="h-3.5 w-3.5" />Detalhes que encantam</div>
              <h1 className="font-display text-[2.9rem] leading-[.98] tracking-[-.045em] text-ink sm:text-6xl">Peças especiais para <em className="font-normal text-wine">marcas inesquecíveis.</em></h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/68 sm:text-lg">Tags, DTF, cartões de visita e kits feitos para transformar cada entrega em uma experiência de marca.</p>
              <div className="mt-8 flex flex-wrap gap-3"><a href="#catalogo" className="rounded-full bg-wine px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-wine/20 transition active:scale-[.97] hover:bg-rose focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky">Explorar catálogo</a></div>
              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-ink/72"><span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-sky" />Até 3x sem juros</span><span className="inline-flex items-center gap-1.5"><BadgePercent className="h-3.5 w-3.5 text-gold" />5% de desconto no PIX à vista</span></div>
            </div>
            <div className="relative mx-auto h-[330px] w-full max-w-sm sm:h-[380px]">
              <div className="absolute inset-x-8 top-5 h-[260px] rotate-[-6deg] rounded-[2rem] border border-white/70 bg-rose shadow-2xl shadow-wine/20" />
              <div className="absolute inset-x-4 bottom-2 h-[280px] rotate-[5deg] rounded-[2rem] border border-white/70 bg-gold shadow-xl" />
              <div className="absolute inset-x-0 bottom-7 flex h-[295px] flex-col justify-between rounded-[2rem] border-t-4 border-sky bg-[#fffdfa] p-7 soft-shadow"><img src="/manus-storage/logo-criativa-express-cropped_7b98716a.png" alt="Criativa Express" className="h-16 w-40 object-contain object-left" /><div><span className="block text-[10px] font-bold uppercase tracking-[.2em] text-gold">feito para sua marca</span><div className="mt-3 h-px w-full bg-wine/15" /><span className="mt-3 block font-display text-2xl text-ink">Sua identidade<br />em cada detalhe.</span></div></div>
            </div>
          </div>
        </section>

        <section id="catalogo" className="container scroll-mt-24 py-14 sm:py-20">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"><button onClick={() => setActiveCategory("todos")} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky ${activeCategory === "todos" ? "bg-wine text-white shadow-sm shadow-wine/25" : "border border-wine/20 bg-white text-ink/65 hover:border-sky/70 hover:text-wine"}`}>Todos</button>{catalogCategories.map(category => <button key={category.value} onClick={() => setActiveCategory(category.value)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky ${activeCategory === category.value ? "bg-wine text-white shadow-sm shadow-wine/25" : "border border-wine/20 bg-white text-ink/65 hover:border-sky/70 hover:text-wine"}`}>{category.label}</button>)}</div>
          {featured.length > 0 && activeCategory === "todos" && <div className="mt-10"><div className="mb-4 flex items-center justify-between"><h3 className="font-display text-2xl">Em destaque</h3><span className="text-xs font-bold uppercase tracking-[.15em] text-wine">Escolhas especiais</span></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featured.map(product => <ProductCard key={product.id} product={product} />)}</div></div>}
          <div className="mt-12"><h3 className="font-display text-2xl">{activeCategory === "todos" ? "Catálogo completo" : catalogCategories.find(item => item.value === activeCategory)?.label}</h3>{isLoading ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div className="h-80 animate-pulse rounded-2xl bg-sand" /><div className="h-80 animate-pulse rounded-2xl bg-sand" /><div className="h-80 animate-pulse rounded-2xl bg-sand" /></div> : error ? <div className="mt-5 rounded-[1.4rem] border border-[#e6c5c5] bg-[#fff8f7] p-9 text-center"><p className="font-display text-2xl">Não foi possível carregar o catálogo.</p><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/65">Atualize a página e tente novamente. Se o problema continuar, entre em contato pelo WhatsApp.</p></div> : products.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{products.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="mt-5 rounded-[1.4rem] border border-dashed border-[#d9c8b6] bg-white/60 p-9 text-center"><p className="font-display text-2xl">Nenhum produto encontrado.</p><p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/65">Aguarde novas opções ou entre em contato pelo WhatsApp.</p></div>}</div>
        </section>

        <section id="como-pedir" className="border-y border-wine/15 bg-sand"><div className="container grid gap-7 py-14 sm:py-18 md:grid-cols-3"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-gold">Atendimento simples</p><h2 className="mt-2 font-display text-4xl leading-none">Escolha. <em className="font-normal text-wine">Peça.</em> Encante.</h2></div><div className="rounded-2xl border-t-4 border-sky bg-white/75 p-5"><span className="font-display text-3xl text-wine">01</span><p className="mt-5 font-semibold">Navegue pelo catálogo</p><p className="mt-1 text-sm leading-relaxed text-ink/65">Veja detalhes, materiais e valores de cada peça.</p></div><div className="rounded-2xl border-t-4 border-gold bg-white/75 p-5"><span className="font-display text-3xl text-wine">02</span><p className="mt-5 font-semibold">Envie pelo WhatsApp</p><p className="mt-1 text-sm leading-relaxed text-ink/65">O pedido já sai organizado com o produto e o valor escolhidos.</p></div></div></section>
      </main>
      <footer className="bg-ink text-[#f8f4ee]"><div className="container flex flex-col gap-5 py-9 sm:flex-row sm:items-end sm:justify-between"><div><img src="/manus-storage/logo-criativa-express-cropped_7b98716a.png" alt="Criativa Express" className="h-14 w-36 object-contain object-left brightness-0 invert" /><p className="mt-1 text-xs tracking-wide text-white/55">Produtos que deixam marcas.</p></div><div className="flex items-center gap-3"><span className="text-xs text-white/55">Precisa de algo personalizado?</span><WhatsAppOrderButton compact productName="Atendimento personalizado" price="0" isKit={false} companyName={companyName} whatsappNumber={settings?.whatsappNumber} whatsappGreeting="Olá! Quero conversar sobre um projeto personalizado." /></div></div></footer>
    </div>
  );
}
