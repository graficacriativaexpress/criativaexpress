import { Image as ImageIcon, PackageOpen } from "lucide-react";

export function CatalogVisual({ imageUrl, label, className = "" }: { imageUrl?: string | null; label: string; className?: string }) {
  if (imageUrl) {
    return <img src={imageUrl} alt={label} className={`h-full w-full object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center bg-[linear-gradient(135deg,#ede4d8,#f9f4ed)] text-wine/60 ${className}`}>
      <PackageOpen className="mb-2 h-8 w-8" strokeWidth={1.4} />
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">Imagem em breve</span>
    </div>
  );
}

export function GalleryEmpty() {
  return <ImageIcon className="h-8 w-8 text-wine/45" strokeWidth={1.4} />;
}
