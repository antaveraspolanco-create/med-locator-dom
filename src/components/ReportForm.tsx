import { Building2, Plus, Trash2, MapPinPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ReportData, NearbyCenter } from "./AnalysisReportCard";

interface Props {
  data: ReportData;
  onChange: (field: keyof ReportData, value: string | number) => void;
  onGenerate: () => void;
  onClear: () => void;
  onAddCenter: () => void;
  onRemoveCenter: (index: number) => void;
  onUpdateCenter: (index: number, field: keyof NearbyCenter, value: string) => void;
}

const ReportForm = ({ data, onChange, onGenerate, onClear, onAddCenter, onRemoveCenter, onUpdateCenter }: Props) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-card space-y-5">
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
        <Building2 className="w-5 h-5 text-primary" />
        Datos del Análisis
      </h2>

      {/* Section: Center */}
      <SectionLabel text="Centro Clínico" />
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Nombre del Centro *" id="centerName" value={data.centerName} onChange={(v) => onChange("centerName", v)} placeholder="Ej: ESCUDEA CENTRO DE VACUNACION..." />
        <Field label="Alias / Siglas" id="centerAlias" value={data.centerAlias} onChange={(v) => onChange("centerAlias", v)} placeholder="Ej: ESCUDEA" />
        <Field label="Fecha de Evaluación" id="evaluationDate" value={data.evaluationDate} onChange={(v) => onChange("evaluationDate", v)} placeholder="Ej: Febr. 05/02/2026" />
        <div className="space-y-1.5">
          <Label htmlFor="complexityLevel">Nivel de Complejidad</Label>
          <Select value={data.complexityLevel} onValueChange={(v) => onChange("complexityLevel", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar nivel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nivel 1">Nivel 1</SelectItem>
              <SelectItem value="Nivel 2">Nivel 2</SelectItem>
              <SelectItem value="Nivel 3">Nivel 3</SelectItem>
              <SelectItem value="Nivel 4">Nivel 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Field label="RNC" id="rnc" value={data.rnc} onChange={(v) => onChange("rnc", v)} placeholder="Ej: 131919766" />
        <Field label="Código Simon" id="simonCode" value={data.simonCode} onChange={(v) => onChange("simonCode", v)} placeholder="Ej: CÓDIGO-20048" />
        <Field label="Gerencia" id="managerName" value={data.managerName} onChange={(v) => onChange("managerName", v)} placeholder="Ej: KARINA QUEZADA" />
      </div>

      {/* Section: Score */}
      <SectionLabel text="Evaluación" />
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="score">Puntaje</Label>
          <Input id="score" type="number" value={data.score} onChange={(e) => onChange("score", Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="status">Estado</Label>
          <Select value={data.status} onValueChange={(v) => onChange("status", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="APROBADO">Aprobado</SelectItem>
              <SelectItem value="CONDICIONADO">Condicionado</SelectItem>
              <SelectItem value="DECLINADO">Declinado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section: Zone */}
      <SectionLabel text="Zona y Competencia" />
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Zona" id="zone" value={data.zone} onChange={(v) => onChange("zone", v)} placeholder="Ej: Prolongación 27 de febrero [SD - Oeste]" />
        <Field label="Radio de Influencia" id="radius" value={data.radius} onChange={(v) => onChange("radius", v)} placeholder="Ej: < 2.88 km" />
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="address">Dirección</Label>
          <Input id="address" value={data.address} onChange={(e) => onChange("address", e.target.value)} placeholder="Ej: Local L3, Prol. Av. 27 de Febrero..." />
        </div>
        <Field label="Prestadores Aledaños" id="nearbyProviders" value={String(data.nearbyProviders)} onChange={(v) => onChange("nearbyProviders", Number(v))} type="number" placeholder="5" />
        <Field label="Nivel de Saturación" id="saturationLevel" value={data.saturationLevel} onChange={(v) => onChange("saturationLevel", v)} placeholder="Ej: Alta saturación de oferta" />
      </div>

      {/* Section: Coordinates & Map */}
      <SectionLabel text="Mapa y Coordenadas" />
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Latitud del Centro" id="centerLat" value={data.centerLat} onChange={(v) => onChange("centerLat", v)} placeholder="Ej: 18.4861" />
        <Field label="Longitud del Centro" id="centerLng" value={data.centerLng} onChange={(v) => onChange("centerLng", v)} placeholder="Ej: -69.9312" />


      </div>

      {/* Section: Nearby Centers */}
      <SectionLabel text="Centros de Cercanía" />
      <div className="space-y-3">
        {data.nearbyCenters.map((center, idx) => (
          <div key={idx} className="bg-muted/30 rounded-md p-3 relative">
            <button
              type="button"
              onClick={() => onRemoveCenter(idx)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-[10px] font-bold text-muted-foreground mb-2">Centro #{idx + 1}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-[11px]">Nombre</Label>
                <Input className="h-8 text-xs" value={center.nombre} onChange={(e) => onUpdateCenter(idx, "nombre", e.target.value)} placeholder="Clínica Central" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Tipo</Label>
                <Input className="h-8 text-xs" value={center.tipo} onChange={(e) => onUpdateCenter(idx, "tipo", e.target.value)} placeholder="Competencia / Similitud" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Latitud</Label>
                <Input className="h-8 text-xs" value={center.lat} onChange={(e) => onUpdateCenter(idx, "lat", e.target.value)} placeholder="18.4890" />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Longitud</Label>
                <Input className="h-8 text-xs" value={center.lng} onChange={(e) => onUpdateCenter(idx, "lng", e.target.value)} placeholder="-69.9350" />
              </div>
            </div>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={onAddCenter} className="gap-2">
          <MapPinPlus className="w-4 h-4" />
          Agregar Centro Cercano
        </Button>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="analysisText">Texto Comparativo</Label>
        <Textarea id="analysisText" value={data.analysisText} onChange={(e) => onChange("analysisText", e.target.value)} placeholder="En seguimiento al proceso de evaluación..." rows={3} />
      </div>

      {/* Section: KPIs */}
      <SectionLabel text="KPIs de Desempeño" />
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Total de Afiliados" id="kpiPacientes" value={data.kpiPacientes} onChange={(v) => onChange("kpiPacientes", v)} placeholder="145" />
        <Field label="Monto Total Distribuido" id="kpiCosto" value={data.kpiCosto} onChange={(v) => onChange("kpiCosto", v)} placeholder="2,500.00" />
        <Field label="Siniestralidad (%)" id="kpiResolutividad" value={data.kpiResolutividad} onChange={(v) => onChange("kpiResolutividad", v)} placeholder="94" />
      </div>

      {/* Section: Siniestralidad */}
      <SectionLabel text="Siniestralidad" />
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Siniestralidad Total" id="siniestralityTotal" value={data.siniestralityTotal} onChange={(v) => onChange("siniestralityTotal", v)} placeholder="Ej: 737.25M" />
        <Field label="Costo Promedio (CPE)" id="costoCPE" value={data.costoCPE} onChange={(v) => onChange("costoCPE", v)} placeholder="Ej: 2,500.00" />
        <Field label="Desviación Farmacia" id="desviacionFarmacia" value={data.desviacionFarmacia} onChange={(v) => onChange("desviacionFarmacia", v)} placeholder="Ej: +22%" />
        <Field label="Especialidad Comparada" id="especialidadComparada" value={data.especialidadComparada} onChange={(v) => onChange("especialidadComparada", v)} placeholder="Ej: Cardiología" />
        <Field label="Desviación Especialidad" id="desviacionEspecialidad" value={data.desviacionEspecialidad} onChange={(v) => onChange("desviacionEspecialidad", v)} placeholder="Ej: +15% más alto" />
        <Field label="Tipo Siniestralidad" id="claimsType" value={data.claimsType} onChange={(v) => onChange("claimsType", v)} placeholder="MIPAS" />
      </div>

      {/* Section: Indicators */}
      <SectionLabel text="Indicadores Adicionales" />
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Total Afiliados Provincia" id="totalAffiliates" value={data.totalAffiliates} onChange={(v) => onChange("totalAffiliates", v)} placeholder="529,930" />
        <Field label="Total Siniestralidad (legacy)" id="totalClaims" value={data.totalClaims} onChange={(v) => onChange("totalClaims", v)} placeholder="737.25M" />
        <Field label="Total PSS Institucionales" id="totalPSS" value={data.totalPSS} onChange={(v) => onChange("totalPSS", v)} placeholder="2232" />
        <Field label="Centros Especializados" id="specializedCenters" value={data.specializedCenters} onChange={(v) => onChange("specializedCenters", v)} placeholder="5" />
      </div>

      {/* Section: Recommendation */}
      <SectionLabel text="Recomendación Técnica" />
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="executiveSummary">Resumen Ejecutivo</Label>
          <Textarea id="executiveSummary" value={data.executiveSummary} onChange={(e) => onChange("executiveSummary", e.target.value)} placeholder="El prestador evaluado obtuvo un puntaje total de..." rows={3} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="recommendation">Recomendación</Label>
          <Textarea id="recommendation" value={data.recommendation} onChange={(e) => onChange("recommendation", e.target.value)} placeholder="Se sugiere la declinación de..." rows={3} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={onGenerate} className="gap-2">
          <Plus className="w-4 h-4" />
          Generar Reporte
        </Button>
        <Button variant="outline" onClick={onClear} className="gap-2">
          <Trash2 className="w-4 h-4" />
          Limpiar
        </Button>
      </div>
    </div>
  );
};

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border pb-1">
      {text}
    </p>
  );
}

function Field({
  label, id, value, onChange, placeholder, type = "text",
}: {
  label: string; id: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export default ReportForm;
