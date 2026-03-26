import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Stethoscope, Activity, Hospital } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DominicanRepublicMap from "@/components/DominicanRepublicMap";
import DoctorReportCard, { type DoctorReportData } from "@/components/DoctorReportCard";
import DoctorReportForm from "@/components/DoctorReportForm";
import ReportLookup from "@/components/ReportLookup";
import {
  getDoctorReports,
  saveDoctorReport,
  findDoctorByCode,
  deleteDoctorReport,
} from "@/lib/reportStorage";

const emptyReport: DoctorReportData = {
  doctorName: "",
  specialty: "",
  providerCode: "",
  simonCode: "",
  score: 0,
  status: "VIABLE",
  location: "",
  centerName: "",
  radius: "",
  nearbySpecialists: 0,
  zoneCostNote: "",
  totalAmount: "",
  specialtyDistribution: [],
  specialtyAmounts: [],
  provinceDistribution: [],
  affiliateDistribution: [],
  totalDoctors: "",
  totalInstitutional: "",
  totalProviders: "",
  dictamen: "",
  province: null,
  provinceName: null
};

const DoctorEvaluation = () => {
  const [report, setReport] = useState<DoctorReportData>(emptyReport);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof DoctorReportData, value: any) => {
    setReport((prev) => ({ ...prev, [field]: value }));
  };

  const handleProvinceSelect = (prov: {id: string;name: string;} | null) => {
    setReport((prev) => ({ ...prev, province: prov?.id ?? null, provinceName: prov?.name ?? null }));
  };

  const handleGenerate = () => {
    if (!report.doctorName.trim()) {
      toast.error("Por favor ingresa al menos el nombre del médico.");
      return;
    }
    setShowCard(true);
    toast.success("Reporte generado correctamente.");
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        skipFonts: true,
        imagePlaceholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPk3KFb2QAAAABJRU5ErkJggg==",
      });
      const link = document.createElement("a");
      link.download = `evaluacion-${report.doctorName.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Imagen descargada.");
    } catch {
      toast.error("Error al generar la imagen.");
    }
  };

  const handleClear = () => {
    setReport(emptyReport);
    setShowCard(false);
  };

  const savedItems = getDoctorReports().map((r) => ({
    id: r.id,
    label: r.doctorName || "Sin nombre",
    subLabel: r.providerCode ? `Cédula/Código: ${r.providerCode}` : "Sin código",
    savedAt: r.savedAt,
  }));

  const handleSave = () => {
    if (!report.doctorName.trim()) {
      toast.error("Ingresa al menos el nombre del médico para guardar.");
      return;
    }
    saveDoctorReport(report);
    toast.success("Reporte guardado correctamente.");
  };

  const handleSearchDoctor = (code: string): boolean => {
    const found = findDoctorByCode(code);
    if (found) {
      setReport(found.data);
      setShowCard(false);
      toast.success(`Registro cargado: ${found.doctorName}`);
      return true;
    }
    return false;
  };

  const handleLoadDoctor = (id: string) => {
    const all = getDoctorReports();
    const item = all.find((r) => r.id === id);
    if (item) {
      setReport(item.data);
      setShowCard(false);
      toast.success(`Registro cargado: ${item.doctorName}`);
    }
  };

  const handleDeleteDoctor = (id: string) => {
    deleteDoctorReport(id);
    toast.success("Registro eliminado.");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full bg-[#015993] shadow-md">
        <div className="w-full px-6 py-5 flex items-center justify-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Ars Primera — Evaluación Médica
            </h1>
            <p className="text-white/70 text-sm" style={{ fontFamily: "'Raleway', sans-serif" }}>Análisis Individual de Siniestralidad y Eficiencia</p>
          </div>
          <Link to="/" className="flex items-center gap-2 bg-white/15 hover:bg-white/25 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg ml-4" style={{ fontFamily: "'Raleway', sans-serif" }}>
            <Hospital className="w-4 h-4" /> Inicio
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6 animate-fade-in">
            <ReportLookup
              lookupLabel="Cédula/Código"
              lookupPlaceholder="Buscar por cédula o código..."
              onSearch={handleSearchDoctor}
              onSave={handleSave}
              savedItems={savedItems}
              onLoad={handleLoadDoctor}
              onDelete={handleDeleteDoctor}
            />
            <DoctorReportForm data={report} onChange={handleChange} onGenerate={handleGenerate} onClear={handleClear} />

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-lg font-bold text-card-foreground mb-3">Seleccionar Ubicación</h2>
              <p className="text-sm text-muted-foreground mb-4">Haz clic en una provincia del mapa para asociarla al reporte.</p>
              <DominicanRepublicMap onProvinceSelect={handleProvinceSelect} selectedProvince={report.province} />
              {report.provinceName &&
              <div className="mt-3 bg-accent/50 rounded-md px-4 py-2 text-sm text-accent-foreground font-medium">
                  ✓ Provincia seleccionada: {report.provinceName}
                </div>
              }
            </div>
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-card rounded-lg p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-card-foreground">Vista Previa del Reporte</h2>
                {showCard &&
                <Button onClick={handleDownload} size="sm" className="gap-2">
                    <Download className="w-4 h-4" /> Descargar PNG
                  </Button>
                }
              </div>
              {showCard ?
              <div className="flex justify-center overflow-x-auto">
                  <DoctorReportCard ref={cardRef} data={report} />
                </div> :

              <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">Completa los datos y haz clic en "Generar Reporte" para ver la vista previa.</p>
                </div>
              }
            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default DoctorEvaluation;