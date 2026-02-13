import { forwardRef } from "react";
import { Activity, Calendar, Users, Building2, Stethoscope, MapPin } from "lucide-react";

export interface SpecialtyDistribution {
  nombre: string;
  cantidad: string;
}

export interface SpecialtyAmount {
  nombre: string;
  monto: string;
}

export interface ProvinceDistribution {
  nombre: string;
  porcentaje: string;
}

export interface AffiliateDistribution {
  nombre: string;
  cantidad: string;
}

export interface DoctorReportData {
  doctorName: string;
  specialty: string;
  providerCode: string;
  score: number;
  status: "VIABLE" | "CONDICIONADO" | "NO VIABLE";
  // Zone
  location: string;
  centerName: string;
  radius: string;
  nearbySpecialists: number;
  zoneCostNote: string;
  totalAmount: string;
  // Specialty distribution
  specialtyDistribution: SpecialtyDistribution[];
  // Specialty amounts
  specialtyAmounts: SpecialtyAmount[];
  // Province distribution (doctors)
  provinceDistribution: ProvinceDistribution[];
  // Affiliate distribution
  affiliateDistribution: AffiliateDistribution[];
  // KPIs
  totalDoctors: string;
  totalInstitutional: string;
  totalProviders: string;
  // Recommendation
  dictamen: string;
  // Province map
  province: string | null;
  provinceName: string | null;
}

interface Props {
  data: DoctorReportData;
}

function getScoreColor(score: number): string {
  if (score < 40) return "#D90429";
  if (score <= 55) return "#FFB703";
  return "#2A9D8F";
}

const statusConfig = {
  "VIABLE": { bg: "#2A9D8F", label: "VIABLE ✅", recBg: "#f0fdf4", recBorder: "#2A9D8F", recText: "#166534" },
  "CONDICIONADO": { bg: "#FFB703", label: "CONDICIONADO 🟡", recBg: "#fffbeb", recBorder: "#FFB703", recText: "#92400e" },
  "NO VIABLE": { bg: "#D90429", label: "NO VIABLE 🔴", recBg: "#fff0f0", recBorder: "#D90429", recText: "#991b1b" },
};

const DoctorReportCard = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const today = new Date().toLocaleDateString("es-DO", { year: "numeric", month: "long", day: "numeric" });
  const scoreColor = getScoreColor(data.score);
  const sc = statusConfig[data.status];

  return (
    <div
      ref={ref}
      className="w-[720px] bg-card rounded-lg overflow-hidden shadow-card text-card-foreground"
      style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px" }}
    >
      {/* Header */}
      <div className="gradient-primary px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-base font-bold text-primary-foreground tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Evaluación Médico
              </h2>
              <p className="text-primary-foreground/70 text-xs">Análisis Individual de Siniestralidad y Eficiencia</p>
            </div>
          </div>
          <span className="text-primary-foreground/60 text-[10px] font-medium">MedRD</span>
        </div>
      </div>

      {/* Doctor Info + Score */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Médico</p>
                <p className="font-bold text-sm">👨‍⚕️ [{data.doctorName}]</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs">
              <InfoLine label="Especialidad" value={data.specialty} />
              <InfoLine label="Código Prestador" value={data.providerCode} />
            </div>
          </div>
          <div className="ml-4 rounded-lg px-4 py-3 text-center text-white min-w-[100px] shrink-0" style={{ backgroundColor: scoreColor }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block">Puntaje</span>
            <span className="text-3xl font-extrabold block leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{data.score}</span>
            <span className="text-[10px] block mt-0.5">{data.status}</span>
          </div>
        </div>
      </div>

      {/* Zone & Competition */}
      <div className="px-6 py-4 border-b border-border">
        <SectionHeader emoji="📍" title="Análisis de Zona y Competencia Directa" />
        <div className="grid grid-cols-2 gap-0 rounded-md overflow-hidden" style={{ border: "1px solid hsl(var(--border))", backgroundColor: "hsl(210 40% 98%)" }}>
          <div className="p-3" style={{ borderRight: "1px solid hsl(var(--border))" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Ubicación Consultorio</p>
            <p className="text-xs font-medium">{data.location}</p>
            {data.centerName && <p className="text-xs text-muted-foreground mt-1">[{data.centerName}]</p>}
            <p className="text-xs text-muted-foreground mt-1">Radio: <strong>{data.radius}</strong></p>
          </div>
          <div className="p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Colegas en la Zona</p>
            <p className="text-sm font-medium">[{data.nearbySpecialists}] Especialistas similares</p>
            {data.zoneCostNote && <p className="text-[10px] font-medium mt-1" style={{ color: "#2A9D8F" }}>{data.zoneCostNote}</p>}
          </div>
          {data.totalAmount && (
            <div className="col-span-2 p-3 text-center" style={{ borderTop: "1px solid hsl(var(--border))" }}>
              <p className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#0096C7" }}>
                $ [{data.totalAmount}]
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Network Analysis */}
      <div className="px-6 py-4 border-b border-border">
        <SectionHeader emoji="👥" title="Análisis de Red y Distribución" />
        <div className="grid grid-cols-2 gap-3">
          {/* Specialty Distribution */}
          {data.specialtyDistribution.length > 0 && (
            <div className="rounded-md p-3" style={{ backgroundColor: "hsl(210 40% 98%)", border: "1px solid hsl(var(--border))" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Médicos por Especialidad</p>
              {data.specialtyDistribution.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-xs flex items-center gap-1.5">
                    <Stethoscope className="w-3 h-3 text-primary" /> {s.nombre}
                  </span>
                  <span className="text-xs font-bold">[{s.cantidad}]</span>
                </div>
              ))}
            </div>
          )}

          {/* Specialty Amounts */}
          {data.specialtyAmounts.length > 0 && (
            <div className="rounded-md p-3" style={{ backgroundColor: "hsl(210 40% 98%)", border: "1px solid hsl(var(--border))" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Monto Total por Especialidad</p>
              {data.specialtyAmounts.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-xs flex items-center gap-1.5">
                    <Stethoscope className="w-3 h-3 text-primary" /> {s.nombre}
                  </span>
                  <span className="text-xs font-bold" style={{ color: "#0096C7" }}>$ [{s.monto}]</span>
                </div>
              ))}
            </div>
          )}

          {/* Province Distribution */}
          {data.provinceDistribution.length > 0 && (
            <div className="rounded-md p-3" style={{ backgroundColor: "hsl(210 40% 98%)", border: "1px solid hsl(var(--border))" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Distribución Médicos por Provincia</p>
              {data.provinceDistribution.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-xs flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-primary" /> [{p.nombre}]
                  </span>
                  <span className="text-xs font-bold">[{p.porcentaje}]% Especialistas</span>
                </div>
              ))}
            </div>
          )}

          {/* Affiliate Distribution */}
          {data.affiliateDistribution.length > 0 && (
            <div className="rounded-md p-3" style={{ backgroundColor: "hsl(210 40% 98%)", border: "1px solid hsl(var(--border))" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Distribución de Afiliados por Provincia</p>
              {data.affiliateDistribution.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-xs flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-primary" /> [{a.nombre}]
                  </span>
                  <span className="text-xs font-bold">[{a.cantidad}] Afiliados</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* KPIs */}
      <div className="px-6 py-4 border-b border-border">
        <SectionHeader emoji="📊" title="KPIs de Gestión Clínica" />
        <div className="grid grid-cols-3 gap-2">
          <KpiBox label="Total Médicos" value={data.totalDoctors} />
          <KpiBox label="Total Institucionales" value={data.totalInstitutional} />
          <KpiBox label="Total Prestadores" value={data.totalProviders} />
        </div>
      </div>

      {/* Dictamen */}
      <div className="px-6 py-4 border-b border-border">
        <div className="rounded-md p-4" style={{ backgroundColor: sc.recBg, borderLeft: `4px solid ${sc.recBorder}` }}>
          <h4 className="text-sm font-bold mb-2" style={{ color: sc.recText }}>Dictamen Técnico</h4>
          <p className="text-xs leading-relaxed" style={{ color: "#555" }}>{data.dictamen}</p>
          <div className="mt-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: sc.bg }}>
              {sc.label}
            </span>
          </div>
        </div>
      </div>

      {/* Province */}
      {data.provinceName && (
        <div className="px-6 py-3 border-b border-border">
          <div className="bg-accent/50 rounded-md px-4 py-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent-foreground" />
            <span className="text-xs text-accent-foreground font-medium">Ubicación: {data.provinceName}, República Dominicana</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3" style={{ backgroundColor: "#eeeeee" }}>
        <p className="text-[10px] text-center mb-1" style={{ color: "#888" }}>Generado por el departamento Gestión de Red.</p>
        <div className="flex items-center justify-between">
          <p className="text-[10px] italic" style={{ color: "#888" }}>Confidencial - Uso Interno Exclusivo</p>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: "#888" }}>
            <Calendar className="w-3 h-3" />
            <span>Fecha: {today}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

DoctorReportCard.displayName = "DoctorReportCard";

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-semibold">[{value}]</span>
    </div>
  );
}

function SectionHeader({ emoji, title }: { emoji: string; title: string }) {
  return (
    <h3 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#023E8A", borderBottom: "2px solid #eee", paddingBottom: "5px" }}>
      {emoji} {title}
    </h3>
  );
}

function KpiBox({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="rounded-md p-3 text-center" style={{ backgroundColor: "#f0f9ff" }}>
      <span className="text-[10px] block" style={{ color: "#666" }}>{label}</span>
      <strong className="text-base block mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#0096C7" }}>{value}</strong>
    </div>
  );
}

export default DoctorReportCard;
