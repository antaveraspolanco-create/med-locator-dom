import { forwardRef } from "react";
import { MapPin, Building2, Calendar, Users, DollarSign, Activity, AlertTriangle, CheckCircle, XCircle, Navigation } from "lucide-react";

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
  // New fields
  centerLat: string;
  centerLng: string;
  nearbyCenters: NearbyCenter[];
  googleApiKey: string;
  kpiPacientes: string;
  kpiCosto: string;
  kpiResolutividad: string;
}

interface Props {
  data: ReportData;
}

const statusConfig = {
  APROBADO: { color: "bg-secondary text-secondary-foreground", icon: CheckCircle, label: "Aprobado ✅" },
  CONDICIONADO: { color: "bg-amber-500 text-white", icon: AlertTriangle, label: "Condicionado 🟡" },
  DECLINADO: { color: "bg-destructive text-destructive-foreground", icon: XCircle, label: "Declinado 🔴" },
};

function buildStaticMapUrl(data: ReportData): string | null {
  if (!data.centerLat || !data.centerLng) return null;
  let url = `https://maps.googleapis.com/maps/api/staticmap?center=${data.centerLat},${data.centerLng}&zoom=14&size=680x280&maptype=roadmap&scale=2`;
  // Main marker (red)
  url += `&markers=color:red%7Clabel:P%7C${data.centerLat},${data.centerLng}`;
  // Nearby centers (blue)
  data.nearbyCenters.forEach((c, i) => {
    if (c.lat && c.lng) {
      url += `&markers=color:blue%7Clabel:${i + 1}%7C${c.lat},${c.lng}`;
    }
  });
  if (data.googleApiKey) url += `&key=${data.googleApiKey}`;
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
              <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2
                className="text-base font-bold text-primary-foreground tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Resumen Análisis Comparativo
              </h2>
              <p className="text-primary-foreground/70 text-xs">
                Departamento de Gestión de Red y Contratación
              </p>
            </div>
          </div>
          <span className="text-primary-foreground/60 text-[10px] font-medium">MedRD</span>
        </div>
      </div>

      {/* Center Info */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-start gap-2 mb-2">
          <Building2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground">Centro Clínico</p>
            <p className="font-bold text-sm">[{data.centerName}] <span className="text-muted-foreground font-normal">[{data.centerAlias}]</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs">
          <InfoLine label="Periodo Evaluado" value={data.evaluationDate} />
          <InfoLine label="Nivel Complejidad" value={data.complexityLevel} />
          <InfoLine label="RNC" value={data.rnc} />
          <InfoLine label="Gerencia" value={data.managerName} />
        </div>

        {/* Score badge */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Puntaje</span>
            <span className="text-2xl font-extrabold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {data.score}
            </span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${sc.color}`}>
            {sc.label}
          </span>
        </div>
      </div>

      {/* Zone & Competition */}
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-xs font-bold text-primary mb-3 flex items-center gap-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          🌍 Análisis de Zona y Competencia
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-accent/40 rounded-md p-3">
            <p className="text-[10px] font-semibold text-accent-foreground mb-1.5">Ubicación & Radio</p>
            <p className="text-xs">{data.zone}</p>
            <p className="text-xs text-muted-foreground mt-1">Radio de influencia: {data.radius} 📍🗺</p>
            <p className="text-[10px] text-muted-foreground mt-1">{data.address}</p>
          </div>
          <div className="bg-accent/40 rounded-md p-3">
            <p className="text-[10px] font-semibold text-accent-foreground mb-1.5">Prestadores Aledaños</p>
            <p className="text-xl font-bold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              [{data.nearbyProviders}]
            </p>
            <p className="text-xs text-muted-foreground">Centros similares</p>
            <p className="text-[10px] font-medium text-destructive mt-1">{data.saturationLevel}</p>
          </div>
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

        {data.analysisText && (
          <div className="mt-3 bg-muted/50 rounded-md p-3">
            <p className="text-[10px] font-semibold text-muted-foreground mb-1">Comparativo Especialidad (PSS Institucionales)</p>
            <p className="text-xs leading-relaxed">{data.analysisText}</p>
          </div>
        )}
      </div>

      {/* KPIs */}
      {(data.kpiPacientes || data.kpiCosto || data.kpiResolutividad) && (
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-xs font-bold text-primary mb-3 flex items-center gap-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            📈 KPIs de Desempeño
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {data.kpiPacientes && (
              <div className="bg-accent/30 rounded-md p-3 text-center">
                <Users className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{data.kpiPacientes}</p>
                <p className="text-[10px] text-muted-foreground">Pacientes</p>
              </div>
            )}
            {data.kpiCosto && (
              <div className="bg-accent/30 rounded-md p-3 text-center">
                <DollarSign className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{data.kpiCosto}</p>
                <p className="text-[10px] text-muted-foreground">Costo Promedio</p>
              </div>
            )}
            {data.kpiResolutividad && (
              <div className="bg-accent/30 rounded-md p-3 text-center">
                <Activity className="w-4 h-4 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{data.kpiResolutividad}%</p>
                <p className="text-[10px] text-muted-foreground">Resolutividad</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Indicators */}
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-xs font-bold text-primary mb-3 flex items-center gap-1.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          📊 Resumen de Indicadores
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <IndicatorBox icon={<Users className="w-3.5 h-3.5" />} label="Total afiliados por provincia" value={data.totalAffiliates} />
          <IndicatorBox icon={<DollarSign className="w-3.5 h-3.5" />} label={`Siniestralidad Total - Tipo ${data.claimsType}`} value={`$[${data.totalClaims}]`} />
          <IndicatorBox icon={<Building2 className="w-3.5 h-3.5" />} label="Total de PSS (Institucionales)" value={`[${data.totalPSS}]`} />
          <IndicatorBox icon={<Activity className="w-3.5 h-3.5" />} label="Centros de estudios especializados" value={`+${data.specializedCenters}`} />
        </div>
      </div>

      {/* Recommendation */}
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-xs font-bold text-primary mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Recomendación Técnica
        </h3>
        {data.executiveSummary && (
          <div className="mb-2">
            <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">Resumen Ejecutivo:</p>
            <p className="text-xs leading-relaxed">{data.executiveSummary}</p>
          </div>
        )}
        {data.recommendation && (
          <div className="mb-2">
            <p className="text-[10px] font-semibold text-muted-foreground mb-0.5">Recomendación:</p>
            <p className="text-xs leading-relaxed">{data.recommendation}</p>
          </div>
        )}
        <div className="mt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${sc.color}`}>
            {sc.label}
          </span>
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
      <div className="px-6 py-3 bg-muted/30">
        <p className="text-[10px] text-muted-foreground text-center mb-1">
          Generado automáticamente por el Sistema de Gestión de Red.
        </p>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground italic">Confidencial - Uso Interno Exclusivo</p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
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
