import { forwardRef } from "react";
import { MapPin, Building2, Calendar, Users, DollarSign, Activity, AlertTriangle, CheckCircle, XCircle, Pill } from "lucide-react";
import logoArsPrimera from "@/assets/logo-ars-primera-report.png";

export interface NearbyCenter {
  nombre: string;
  lat: string;
  lng: string;
  tipo: string;
}

export interface ReportData {
  centerName: string;
  centerAlias: string;
  evaluationDate: string;
  complexityLevel: string;
  rnc: string;
  simonCode: string;
  managerName: string;
  score: number;
  status: "APROBADO" | "CONDICIONADO" | "DECLINADO";
  zone: string;
  radius: string;
  address: string;
  nearbyProviders: number;
  saturationLevel: string;
  analysisText: string;
  totalAffiliates: string;
  totalClaims: string;
  claimsType: string;
  totalPSS: string;
  specializedCenters: string;
  executiveSummary: string;
  recommendation: string;
  province: string | null;
  provinceName: string | null;
  centerLat: string;
  centerLng: string;
  nearbyCenters: NearbyCenter[];
  
  kpiPacientes: string;
  kpiCosto: string;
  kpiResolutividad: string;
  // Siniestralidad fields
  siniestralityTotal: string;
  costoCPE: string;
  desviacionFarmacia: string;
  especialidadComparada: string;
  desviacionEspecialidad: string;
}

interface Props {
  data: ReportData;
}

const statusConfig = {
  APROBADO: { color: "bg-secondary text-secondary-foreground", icon: CheckCircle, label: "Aprobado ✅", borderColor: "#2A9D8F" },
  CONDICIONADO: { color: "bg-amber-500 text-white", icon: AlertTriangle, label: "Condicionado 🟡", borderColor: "#FFB703" },
  DECLINADO: { color: "bg-destructive text-destructive-foreground", icon: XCircle, label: "Declinado 🔴", borderColor: "#D90429" },
};

function getScoreColor(score: number): string {
  if (score < 21) return "#D90429";
  if (score <= 25) return "#FFB703";
  return "#2A9D8F";
}

function buildStaticMapUrl(data: ReportData): string | null {
  if (!data.centerLat || !data.centerLng) return null;
  let url = `https://maps.googleapis.com/maps/api/staticmap?center=${data.centerLat},${data.centerLng}&zoom=14&size=680x280&maptype=roadmap&scale=2`;
  url += `&markers=color:red%7Clabel:P%7C${data.centerLat},${data.centerLng}`;
  data.nearbyCenters.forEach((c, i) => {
    if (c.lat && c.lng) {
      url += `&markers=color:blue%7Clabel:${i + 1}%7C${c.lat},${c.lng}`;
    }
  });
  return url;
}

const AnalysisReportCard = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const today = new Date().toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sc = statusConfig[data.status];
  const mapUrl = buildStaticMapUrl(data);
  const scoreColor = getScoreColor(data.score);

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
            <img src={logoArsPrimera} alt="Ars Primera" className="h-10 object-contain" />
            <div>
              <h2
                className="text-base font-bold text-primary-foreground tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Resumen Ejecutivo de Siniestralidad
              </h2>
              <p className="text-primary-foreground/70 text-xs">
                Departamento de Gestión de Red y Contratación
              </p>
              <p className="text-primary-foreground/60 text-[10px]">
                Coordinación Relación PSS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Center Info + Score */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <Building2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Centro Clínico</p>
                <p className="font-bold text-sm">
                  🏥 [{data.centerName}]{" "}
                  <span className="text-muted-foreground font-normal">[{data.centerAlias}]</span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs">
              <InfoLine label="Periodo Evaluado" value={data.evaluationDate} />
              <InfoLine label="Nivel Complejidad" value={data.complexityLevel} />
              <InfoLine label="RNC" value={data.rnc} />
              <InfoLine label="Código Simon" value={data.simonCode} />
              <InfoLine label="Gerencia" value={data.managerName} />
            </div>
          </div>

          {/* Score Box - Semáforo style */}
          <div
            className="ml-4 rounded-lg px-4 py-3 text-center text-white min-w-[100px] shrink-0"
            style={{ backgroundColor: scoreColor }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block">Puntaje</span>
            <span
              className="text-3xl font-extrabold block leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {data.score}
            </span>
            <span className="text-[10px] block mt-0.5">{data.status}</span>
          </div>
        </div>
      </div>

      {/* Zone & Competition */}
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#023E8A", borderBottom: "2px solid #eee", paddingBottom: "5px" }}>
          🌍 Análisis de Zona y Competencia
        </h3>
        <div className="grid grid-cols-2 gap-0 rounded-md overflow-hidden" style={{ border: "1px solid hsl(var(--border))", backgroundColor: "hsl(210 40% 98%)" }}>
          <div className="p-3" style={{ borderRight: "1px solid hsl(var(--border))" }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Ubicación & Radio</p>
            <p className="text-xs font-medium">{data.zone}</p>
            <p className="text-xs text-muted-foreground mt-1">Radio de influencia: <strong>{data.radius}</strong></p>
            <p className="text-[10px] text-muted-foreground mt-1">{data.address}</p>
          </div>
          <div className="p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Prestadores Aledaños</p>
            <p className="text-sm font-medium">[{data.nearbyProviders}] Centros similares</p>
            {data.saturationLevel && (
              <p className="text-[10px] font-medium mt-1" style={{ color: "#D90429" }}>{data.saturationLevel}</p>
            )}
          </div>
          {/* Comparativo row */}
          {(data.analysisText || data.especialidadComparada) && (
            <div className="col-span-2 p-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Comparativo Especialidad (Peer Group)</p>
              {data.especialidadComparada && data.desviacionEspecialidad && (
                <p className="text-xs leading-relaxed">
                  El costo de <strong>[Especialidad: {data.especialidadComparada}]</strong> en este centro es un{" "}
                  <strong style={{ color: "#D90429" }}>{data.desviacionEspecialidad}</strong> que el promedio de los centros aledaños a menos de {data.radius}.
                </p>
              )}
              {data.analysisText && (
                <p className="text-xs leading-relaxed mt-1">{data.analysisText}</p>
              )}
            </div>
          )}
        </div>

        {/* Google Static Map */}
        {mapUrl && (
          <div className="mt-3 rounded-md overflow-hidden border border-border">
            <img
              src={mapUrl}
              alt="Mapa de ubicación del prestador y centros aledaños"
              className="w-full h-auto"
              crossOrigin="anonymous"
            />
            <div className="bg-muted/50 px-3 py-1.5 flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive inline-block" /> Prestador (P)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" /> Centros Aledaños
              </span>
              <span className="ml-auto">Radio: {data.radius}</span>
            </div>
          </div>
        )}

        {/* Nearby Centers Table */}
        {data.nearbyCenters.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] font-semibold text-muted-foreground mb-1.5">Centros de Cercanía Detectados</p>
            <div className="border border-border rounded-md overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground">#</th>
                    <th className="text-left px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground">Centro</th>
                    <th className="text-left px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground">Tipo</th>
                    <th className="text-left px-2.5 py-1.5 text-[10px] font-semibold text-muted-foreground">Coordenadas</th>
                  </tr>
                </thead>
                <tbody>
                  {data.nearbyCenters.map((c, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="px-2.5 py-1.5 font-bold text-primary">{i + 1}</td>
                      <td className="px-2.5 py-1.5">{c.nombre}</td>
                      <td className="px-2.5 py-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${c.tipo === "Competencia" ? "bg-destructive/10 text-destructive" : "bg-accent/50 text-accent-foreground"}`}>
                          {c.tipo}
                        </span>
                      </td>
                      <td className="px-2.5 py-1.5 text-muted-foreground text-[10px]">{c.lat}, {c.lng}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* KPIs - Siniestralidad style (3 columns) */}
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#023E8A", borderBottom: "2px solid #eee", paddingBottom: "5px" }}>
          📊 Resumen de Indicadores
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <KpiCard label="Siniestralidad Total" value={data.siniestralityTotal || data.totalClaims ? `$[${data.siniestralityTotal || data.totalClaims}]` : ""} variant="info" />
          <KpiCard label="Costo Promedio (CPE)" value={data.costoCPE ? `$[${data.costoCPE}]` : (data.kpiCosto ? `$${data.kpiCosto}` : "")} variant="info" />
          <KpiCard label="Desviación Farmacia" value={data.desviacionFarmacia || ""} variant="danger" />
        </div>
      </div>

      {/* Additional Indicators */}
      {(data.kpiPacientes || data.kpiResolutividad || data.totalAffiliates || data.totalPSS) && (
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-xs font-bold mb-3 flex items-center gap-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#023E8A" }}>
            📈 Indicadores Adicionales
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {data.totalAffiliates && <IndicatorBox icon={<Users className="w-3.5 h-3.5" />} label="Total afiliados por provincia" value={data.totalAffiliates} />}
            {data.totalPSS && <IndicatorBox icon={<Building2 className="w-3.5 h-3.5" />} label="Total de PSS (Institucionales)" value={`[${data.totalPSS}]`} />}
            {data.kpiPacientes && <IndicatorBox icon={<Users className="w-3.5 h-3.5" />} label="Pacientes Atendidos" value={data.kpiPacientes} />}
            {data.kpiResolutividad && <IndicatorBox icon={<Activity className="w-3.5 h-3.5" />} label="Resolutividad" value={`${data.kpiResolutividad}%`} />}
            {data.specializedCenters && <IndicatorBox icon={<Activity className="w-3.5 h-3.5" />} label="Centros especializados" value={`+${data.specializedCenters}`} />}
          </div>
        </div>
      )}

      {/* Recommendation - styled with left border like the HTML */}
      <div className="px-6 py-4 border-b border-border">
        <div
          className="rounded-md p-4"
          style={{
            backgroundColor: data.status === "CONDICIONADO" ? "#fffbeb" : data.status === "DECLINADO" ? "#fff0f0" : "#f0fdf4",
            borderLeft: `4px solid ${sc.borderColor}`,
          }}
        >
          <h4 className="text-sm font-bold mb-2" style={{ color: data.status === "CONDICIONADO" ? "#92400e" : data.status === "DECLINADO" ? "#991b1b" : "#166534" }}>
            Recomendación Técnica
          </h4>
          {data.executiveSummary && (
            <div className="mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">Resumen Ejecutivo:</p>
              <p className="text-xs leading-relaxed" style={{ color: "#555" }}>{data.executiveSummary}</p>
            </div>
          )}
          {data.recommendation && (
            <div className="mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">Recomendación:</p>
              <p className="text-xs leading-relaxed" style={{ color: "#555" }}>{data.recommendation}</p>
            </div>
          )}
          <div className="mt-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${sc.color}`}>
              {sc.label}
            </span>
          </div>
        </div>
      </div>

      {/* Province if selected */}
      {data.provinceName && (
        <div className="px-6 py-3 border-b border-border">
          <div className="bg-accent/50 rounded-md px-4 py-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent-foreground" />
            <span className="text-xs text-accent-foreground font-medium">
              Ubicación: {data.provinceName}, República Dominicana
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3" style={{ backgroundColor: "#eeeeee" }}>
        <p className="text-[10px] text-center mb-1" style={{ color: "#888" }}>
          Generado automáticamente por el Sistema de Gestión de Red.
        </p>
        <div className="flex items-center justify-between">
          <p className="text-[10px] italic" style={{ color: "#888" }}>Confidencial - Uso Interno Exclusivo</p>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: "#888" }}>
            <Calendar className="w-3 h-3" />
            <span>Fecha: {data.evaluationDate || today}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

AnalysisReportCard.displayName = "AnalysisReportCard";

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-semibold">[{value}]</span>
    </div>
  );
}

function KpiCard({ label, value, variant }: { label: string; value: string; variant: "info" | "danger" }) {
  if (!value) return null;
  return (
    <div
      className="rounded-md p-3 text-center"
      style={{ backgroundColor: variant === "info" ? "#f0f9ff" : "#fff0f0" }}
    >
      <span className="text-[10px] block" style={{ color: "#666" }}>{label}</span>
      <strong
        className="text-base block mt-0.5"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: variant === "info" ? "#0096C7" : "#D90429" }}
      >
        {value}
      </strong>
    </div>
  );
}

function IndicatorBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-accent/30 rounded-md p-2.5 flex items-center gap-2.5">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-sm font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</p>
      </div>
    </div>
  );
}

export default AnalysisReportCard;
