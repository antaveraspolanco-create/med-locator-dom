import { forwardRef } from "react";
import { MapPin, User, Hash, Building2, Calendar } from "lucide-react";

interface ProviderData {
  code: string;
  name: string;
  province: string | null;
  provinceName: string | null;
  specialty?: string;
  phone?: string;
  address?: string;
}

interface Props {
  data: ProviderData;
}

const ProviderCard = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const today = new Date().toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      ref={ref}
      className="w-[600px] bg-card rounded-lg overflow-hidden shadow-card"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="gradient-primary px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-foreground tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Ficha de Prestador Médico
            </h2>
            <p className="text-primary-foreground/70 text-xs">
              Sistema de Registro Nacional
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <DetailRow icon={<Hash className="w-4 h-4" />} label="Código" value={data.code} />
          <DetailRow icon={<User className="w-4 h-4" />} label="Nombre" value={data.name} />
          {data.provinceName && (
            <DetailRow icon={<MapPin className="w-4 h-4" />} label="Provincia" value={data.provinceName} />
          )}
          {data.specialty && (
            <DetailRow icon={<Building2 className="w-4 h-4" />} label="Especialidad" value={data.specialty} />
          )}
          {data.phone && (
            <DetailRow icon={<User className="w-4 h-4" />} label="Teléfono" value={data.phone} />
          )}
          {data.address && (
            <DetailRow icon={<MapPin className="w-4 h-4" />} label="Dirección" value={data.address} />
          )}
        </div>

        {/* Map indicator */}
        {data.provinceName && (
          <div className="bg-accent/50 rounded-md px-4 py-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm text-accent-foreground font-medium">
              Ubicación: {data.provinceName}, República Dominicana
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          <span>Generado: {today}</span>
        </div>
        <span className="text-xs font-semibold text-primary">Ars Primera — Gestión de Red</span>
      </div>
    </div>
  );
});

ProviderCard.displayName = "ProviderCard";

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 text-primary">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-card-foreground">{value}</p>
      </div>
    </div>
  );
}

export default ProviderCard;
