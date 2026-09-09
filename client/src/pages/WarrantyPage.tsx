import {
  ArrowLeft,
  CheckCircle2,
  Droplets,
  Layers3,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Thermometer,
} from "lucide-react";

const logoUrl =
  import.meta.env.VITE_AUTH_MODE === "local"
    ? "/uploads/seed/logo-logo-criativa-express-cropped_7b98716a.png"
    : "/manus-storage/logo-criativa-express-cropped_7b98716a.png";

const technicalFactors = [
  {
    icon: Thermometer,
    title: "Aquecimento",
    text: "A temperatura interna da máquina muda do início ao fim da impressão.",
  },
  {
    icon: Droplets,
    title: "Instabilidade da tinta",
    text: "O fluxo e a viscosidade da tinta sofrem leves alterações ao longo da tiragem.",
  },
  {
    icon: Layers3,
    title: "Variação do papel",
    text: "O papel absorve a umidade do ar e possui microvariações em sua superfície.",
  },
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-paper text-ink">
      <header className="sticky top-0 z-40 border-b border-wine/15 bg-paper/92 backdrop-blur-xl">
        <div className="container flex h-[68px] items-center justify-between">
          <a href="/" className="group flex items-center" aria-label="Criativa Express — início">
            <img src={logoUrl} alt="Criativa Express" className="h-12 w-32 object-contain object-center" />
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-wine/20 bg-white/70 px-4 py-2 text-sm font-bold text-wine transition hover:border-sky/60 hover:text-rose focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao catálogo
          </a>
        </div>
      </header>

      <main>
        <section className="hero-glow paper-grain border-b border-wine/15">
          <div className="container py-16 sm:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-wine/15 bg-white/60 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-wine">
                <Sparkles className="h-3.5 w-3.5" />
                Transparência na produção
              </div>
              <h1 className="mt-6 max-w-3xl font-display text-[2.8rem] leading-[.98] tracking-[-.045em] text-ink sm:text-6xl">
                Garantia e impressão das suas <em className="font-normal text-wine">tags.</em>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/68 sm:text-lg">
                Queremos que suas tags fiquem perfeitas. Para garantir total transparência em nosso processo de produção, compartilhamos abaixo alguns detalhes técnicos importantes sobre a fidelidade de cores na impressão gráfica.
              </p>
            </div>
          </div>
        </section>

        <section className="container max-w-4xl py-14 sm:py-20">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <aside className="rounded-[1.6rem] border-t-4 border-sky bg-white/80 p-6 soft-shadow sm:p-8">
              <ShieldCheck className="h-10 w-10 text-wine" />
              <h2 className="mt-5 font-display text-3xl leading-tight">Cores na tela e na impressão</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/68">
                Telas de celulares e computadores trabalham com luz; a impressão gráfica trabalha com tinta. Essa diferença é natural e pode gerar pequenas variações de tonalidade.
              </p>
              <div className="mt-6 h-px bg-wine/15" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-gold">Nosso compromisso</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-ink/75">
                Fazer todos os ajustes necessários para que o resultado final fique o mais próximo possível da sua ideia inicial.
              </p>
            </aside>

            <div className="contents">
              <article className="rounded-[1.6rem] border border-wine/15 bg-white/75 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky/15 text-sky">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl leading-tight">Telas vs. Papel</h2>
                    <p className="mt-4 text-base leading-relaxed text-ink/72">
                      As cores que vemos nas telas de celulares e computadores são geradas por luz (padrão RGB), enquanto a impressão física utiliza tinta (padrão CMYK). Por isso, sempre ocorrem pequenas variações de tom quando a arte sai da tela e vai para o papel.
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[1.6rem] border border-wine/15 bg-white/75 p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/20 text-wine">
                    <Layers3 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-3xl leading-tight">Variação de Lote</h2>
                    <p className="mt-4 text-base leading-relaxed text-ink/72">
                      O processo gráfico envolve fatores físicos como aquecimento das máquinas e absorção do papel. Sendo assim, pode ocorrer uma variação de tonalidade de até 10% nas cores das tags. Essa oscilação é considerada normal pelo padrão internacional de impressão e pode acontecer inclusive dentro de um mesmo lote (algumas tags podem ficar ligeiramente mais claras ou escuras que as outras).
                    </p>
                    <p className="mt-6 text-sm font-bold uppercase tracking-[.14em] text-wine">Pequenas oscilações automáticas</p>
                    <div className="mt-4 space-y-3">
                      {technicalFactors.map(({ icon: Icon, title, text }) => (
                        <div key={title} className="flex gap-3 rounded-xl bg-paper/80 p-4">
                          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-sky" />
                          <p className="text-sm leading-relaxed text-ink/72">
                            <strong className="text-ink">{title}:</strong> {text}
                          </p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-6 rounded-xl border border-wine/10 bg-white/55 p-4 text-sm leading-relaxed text-ink/72">
                      Por ser uma limitação técnica universal de qualquer gráfica, essa variação sutil não é considerada defeito e não está coberta pela garantia de reimpressão. Fique tranquilo(a), pois cuidamos de cada detalhe do arquivo para que suas tags fiquem lindas e o mais próximas possível do esperado!
                    </p>
                  </div>
                </div>
              </article>

              <article className="rounded-[1.6rem] border-2 border-wine/20 bg-wine p-6 text-white shadow-xl shadow-wine/15 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-3xl leading-tight">Nossa garantia</h2>
                    <p className="mt-4 text-base leading-relaxed text-white/82">
                      Nossa garantia cobre defeitos graves de impressão, manchas acentuadas ou erros de corte. No entanto, por limitações técnicas universais de qualquer gráfica, a variação de até 10% nas tonalidades não é considerada defeito e não dá direito à reimpressão.
                    </p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="border-y border-wine/15 bg-sand">
          <div className="container py-14 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <MessageCircle className="mx-auto h-9 w-9 text-wine" />
              <p className="mt-5 font-display text-3xl leading-tight sm:text-4xl">
                Seu produto merece brilhar ainda mais.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ink/68">
                Fazemos todos os ajustes necessários em nossos arquivos para que o resultado final fique o mais próximo possível da sua ideia inicial e o seu produto brilhe ainda mais!
              </p>
              <p className="mt-5 text-sm font-semibold leading-relaxed text-ink/72">
                Se tiver qualquer dúvida antes de iniciarmos a produção, estamos inteiramente à disposição para ajudar.
              </p>
              <a
                href="/"
                className="mt-7 inline-flex items-center justify-center rounded-full bg-wine px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-wine/20 transition active:scale-[.97] hover:bg-rose focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky"
              >
                Voltar ao catálogo
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink text-[#f8f4ee]">
        <div className="container flex flex-col gap-5 py-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <img src={logoUrl} alt="Criativa Express" className="h-14 w-36 object-contain object-left brightness-0 invert" />
            <p className="mt-1 text-xs tracking-wide text-white/55">Produtos que deixam marcas.</p>
          </div>
          <a href="/" className="text-sm font-semibold text-white/75 transition hover:text-white">
            Voltar para a loja
          </a>
        </div>
      </footer>
    </div>
  );
}
