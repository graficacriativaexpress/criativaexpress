import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.auth.localLogin.useMutation({
    onSuccess: () => setLocation("/admin"),
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    login.mutate({ email, password });
  };

  return <main className="flex min-h-screen items-center justify-center bg-paper p-6"><section className="w-full max-w-md rounded-3xl border border-[#e5d8cb] bg-white p-8 text-center soft-shadow"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-wine/10 text-wine"><LockKeyhole className="h-6 w-6" /></div><p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-gold">Criativa Express</p><h1 className="mt-2 font-display text-3xl text-ink">Área da loja</h1><p className="mt-3 text-sm leading-relaxed text-ink/65">Acesso exclusivo para atualizar produtos, fotos, kits e preços.</p><form className="mt-7 space-y-4 text-left" onSubmit={submit}><div className="space-y-2"><Label htmlFor="admin-email">E-mail</Label><Input id="admin-email" required autoComplete="email" type="email" value={email} onChange={event => setEmail(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="admin-password">Senha</Label><Input id="admin-password" required autoComplete="current-password" type="password" value={password} onChange={event => setPassword(event.target.value)} /></div>{login.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800">E-mail ou senha incorretos.</p>}<Button type="submit" disabled={login.isPending} className="mt-2 w-full rounded-full bg-wine text-white hover:bg-[#522631]">{login.isPending ? "Entrando..." : "Entrar com segurança"}</Button></form><Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-wine"><ArrowLeft className="h-4 w-4" />Voltar ao catálogo</Link></section></main>;
}
