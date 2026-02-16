import { Stethoscope, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type {
  DoctorReportData, SpecialtyDistribution, SpecialtyAmount, ProvinceDistribution, AffiliateDistribution,
} from "./DoctorReportCard";

interface Props {
  data: DoctorReportData;
  onChange: (field: keyof DoctorReportData, value: any) => void;
  onGenerate: () => void;
  onClear: () => void;
}

const DoctorReportForm = ({ data, onChange, onGenerate, onClear }: Props) => {
  const addItem = <T,>(field: keyof DoctorReportData, template: T) => {
    onChange(field, [...(data[field] as T[]), template]);
  };
  const removeItem = (field: keyof DoctorReportData, index: number) => {
    onChange(field, (data[field] as any[]).filter((_: any, i: number) => i !== index));
  };
  const updateItem = (field: keyof DoctorReportData, index: number, key: string, value: string) => {
    onChange(field, (data[field] as any[]).map((item: any, i: number) => i === index ? { ...item, [key]: value } : item));
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card space-y-5">
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-primary" />
        Datos del Médico
      </h2>

      <SectionLabel text="Información del Médico" />
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Nombre del Médico *" value={data.doctorName} onChange={(v) => onChange("doctorName", v)} placeholder="Ej: DARIANA ELIZABETH ROSARIO MEJIA" />
        <Field label="Especialidad" value={data.specialty} onChange={(v) => onChange("specialty", v)} placeholder="Ej: Endocrinología" />
        <Field label="Cedula" value={data.providerCode} onChange={(v) => onChange("providerCode", v)} placeholder="Ej: 001-0000000-0" />
        <Field label="Código Simon" value={data.simonCode} onChange={(v) => onChange("simonCode", v)} placeholder="Ej: CÓDIGO-20048" />
      </div>

      <SectionLabel text="Evaluación" />
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Puntaje</Label>
          <Input type="number" value={data.score} onChange={(e) => onChange("score", Number(e.target.value))} />
        </div>
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select value={data.status} onValueChange={(v) => onChange("status", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="VIABLE">Viable</SelectItem>
              <SelectItem value="CONDICIONADO">Condicionado</SelectItem>
              <SelectItem value="NO VIABLE">No Viable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <SectionLabel text="Zona y Competencia" />
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Ubicación" value={data.location} onChange={(v) => onChange("location", v)} placeholder="SANTO DOMINGO ESTE" />
        <Field label="Centro Asociado" value={data.centerName} onChange={(v) => onChange("centerName", v)} placeholder="CENTRO ORIENTAL DE GINECOBSTETRICIA" />
        <Field label="Radio" value={data.radius} onChange={(v) => onChange("radius", v)} placeholder="<2 km" />
        <Field label="Especialistas Cercanos" value={String(data.nearbySpecialists)} onChange={(v) => onChange("nearbySpecialists", Number(v))} type="number" placeholder="1" />
        <Field label="Nota Costo Zona" value={data.zoneCostNote} onChange={(v) => onChange("zoneCostNote", v)} placeholder="Costo competitivo en la zona" />
        <Field label="Monto Total" value={data.totalAmount} onChange={(v) => onChange("totalAmount", v)} placeholder="96,465,338.98" />
      </div>

      {/* Dynamic Lists */}
      <SectionLabel text="Médicos por Especialidad" />
      <DynamicList
        items={data.specialtyDistribution}
        fields={[{ key: "nombre", label: "Especialidad", placeholder: "Endocrinología" }, { key: "cantidad", label: "Cantidad", placeholder: "1" }]}
        onAdd={() => addItem("specialtyDistribution", { nombre: "", cantidad: "" })}
        onRemove={(i) => removeItem("specialtyDistribution", i)}
        onUpdate={(i, k, v) => updateItem("specialtyDistribution", i, k, v)}
      />

      <SectionLabel text="Monto por Especialidad" />
      <DynamicList
        items={data.specialtyAmounts}
        fields={[{ key: "nombre", label: "Especialidad", placeholder: "Endocrinología" }, { key: "monto", label: "Monto", placeholder: "96,465,338.98" }]}
        onAdd={() => addItem("specialtyAmounts", { nombre: "", monto: "" })}
        onRemove={(i) => removeItem("specialtyAmounts", i)}
        onUpdate={(i, k, v) => updateItem("specialtyAmounts", i, k, v)}
      />

      <SectionLabel text="Distribución Médicos por Provincia" />
      <DynamicList
        items={data.provinceDistribution}
        fields={[{ key: "nombre", label: "Provincia", placeholder: "Distrito Nacional" }, { key: "porcentaje", label: "% Especialistas", placeholder: "31" }]}
        onAdd={() => addItem("provinceDistribution", { nombre: "", porcentaje: "" })}
        onRemove={(i) => removeItem("provinceDistribution", i)}
        onUpdate={(i, k, v) => updateItem("provinceDistribution", i, k, v)}
      />

      <SectionLabel text="Distribución de Afiliados" />
      <DynamicList
        items={data.affiliateDistribution}
        fields={[{ key: "nombre", label: "Provincia", placeholder: "Santo Domingo" }, { key: "cantidad", label: "Afiliados", placeholder: "529,930" }]}
        onAdd={() => addItem("affiliateDistribution", { nombre: "", cantidad: "" })}
        onRemove={(i) => removeItem("affiliateDistribution", i)}
        onUpdate={(i, k, v) => updateItem("affiliateDistribution", i, k, v)}
      />

      <SectionLabel text="KPIs de Gestión" />
      <div className="grid sm:grid-cols-3 gap-3">
        <Field label="Total Médicos" value={data.totalDoctors} onChange={(v) => onChange("totalDoctors", v)} placeholder="6,748" />
        <Field label="Total Institucionales" value={data.totalInstitutional} onChange={(v) => onChange("totalInstitutional", v)} placeholder="2,232" />
        <Field label="Total Prestadores" value={data.totalProviders} onChange={(v) => onChange("totalProviders", v)} placeholder="8,980" />
      </div>

      <SectionLabel text="Dictamen Técnico" />
      <div className="space-y-1.5">
        <Label>Dictamen</Label>
        <Textarea value={data.dictamen} onChange={(e) => onChange("dictamen", e.target.value)} placeholder="El prestador mantiene un puntaje de..." rows={3} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={onGenerate} className="gap-2"><Plus className="w-4 h-4" /> Generar Reporte</Button>
        <Button variant="outline" onClick={onClear} className="gap-2"><Trash2 className="w-4 h-4" /> Limpiar</Button>
      </div>
    </div>
  );
};

function SectionLabel({ text }: { text: string }) {
  return <p className="text-xs font-bold text-primary uppercase tracking-wider border-b border-border pb-1">{text}</p>;
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function DynamicList({ items, fields, onAdd, onRemove, onUpdate }: {
  items: any[];
  fields: { key: string; label: string; placeholder: string }[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  onUpdate: (i: number, key: string, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="bg-muted/30 rounded-md p-3 relative">
          <button type="button" onClick={() => onRemove(idx)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="grid sm:grid-cols-2 gap-2">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1">
                <Label className="text-[11px]">{f.label}</Label>
                <Input className="h-8 text-xs" value={item[f.key]} onChange={(e) => onUpdate(idx, f.key, e.target.value)} placeholder={f.placeholder} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={onAdd} className="gap-2">
        <Plus className="w-4 h-4" /> Agregar
      </Button>
    </div>
  );
}

export default DoctorReportForm;
