import { forwardRef } from "react";
import { MapPin, Building2, Calendar, Users, DollarSign, Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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
}

interface Props {
  data: ReportData;
}

const statusConfig = {
  APROBADO: { color: "bg-secondary text-secondary-foreground", icon: CheckCircle, label: "Aprobado ✅" },
  CONDICIONADO: { color: "bg-amber-500 text-white", icon: AlertTriangle, label: "Condicionado 🟡" },
  DECLINADO: { color: "bg-destructive text-destructive-foreground", icon: XCircle, label: "Declinado 🔴" },
};

const AnalysisReportCard = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const today = new Date().toLocaleDateString("es-DO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

        {data.analysisText && (
          <div className="mt-3 bg-muted/50 rounded-md p-3">
            <p className="text-[10px] font-semibold text-muted-foreground mb-1">Comparativo Especialidad (PSS Institucionales)</p>
            <p className="text-xs leading-relaxed">{data.analysisText}</p>
          </div>
        )}
      </div>

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
