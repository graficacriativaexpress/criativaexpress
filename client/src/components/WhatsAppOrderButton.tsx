import { MessageCircle } from "lucide-react";
import { buildWhatsappOrderMessage, normalizeWhatsappNumber } from "@shared/catalog";
import { Button } from "@/components/ui/button";

type Props = {
  productName: string;
  price: string | number;
  isKit: boolean;
  companyName: string;
  whatsappNumber?: string | null;
  whatsappGreeting?: string | null;
  compact?: boolean;
};

export default function WhatsAppOrderButton({ compact, ...props }: Props) {
  const number = props.whatsappNumber ? normalizeWhatsappNumber(props.whatsappNumber) : "";
  const message = buildWhatsappOrderMessage(props);
  const href = number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : undefined;

  return (
    <Button
      asChild={Boolean(href)}
      disabled={!href}
      className={`bg-wine text-white hover:bg-[#522631] active:scale-[.97] ${compact ? "h-10 w-10 rounded-full p-0" : "h-12 rounded-full px-5"}`}
      title={href ? "Pedir pelo WhatsApp" : "Configure o WhatsApp no painel administrativo"}
    >
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" aria-label="Pedir pelo WhatsApp">
          <MessageCircle className="h-4 w-4" />
          {!compact && <span>Fazer pedido</span>}
        </a>
      ) : (
        <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4" />{!compact && "WhatsApp pendente"}</span>
      )}
    </Button>
  );
}
