import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DominicanRepublicMap from "@/components/DominicanRepublicMap";
import AnalysisReportCard, { type ReportData, type NearbyCenter } from "@/components/AnalysisReportCard";
import ReportForm from "@/components/ReportForm";

const emptyReport: ReportData = {
  centerName: "",
  centerAlias: "",
  evaluationDate: "",
  complexityLevel: "",
  rnc: "",
  managerName: "",
  score: 0,
  status: "CONDICIONADO",
  zone: "",
  radius: "",
  address: "",
  nearbyProviders: 0,
  saturationLevel: "",
  analysisText: "",
  totalAffiliates: "",
  totalClaims: "",
  claimsType: "",
  totalPSS: "",
  specializedCenters: "",
  executiveSummary: "",
  recommendation: "",
  province: null,
  provinceName: null,
  centerLat: "",
  centerLng: "",
  nearbyCenters: [],
  googleApiKey: "",
  kpiPacientes: "",
  kpiCosto: "",
  kpiResolutividad: "",
};

const Index = () => {
  const [report, setReport] = useState<ReportData>(emptyReport);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof ReportData, value: string | number) => {
    setReport((prev) => ({ ...prev, [field]: value }));
  };

  const handleProvinceSelect = (prov: { id: string; name: string } | null) => {
    setReport((prev) => ({
      ...prev,
      province: prov?.id ?? null,
      provinceName: prov?.name ?? null,
    }));
  };

  const handleAddCenter = () => {
    setReport((prev) => ({
      ...prev,
      nearbyCenters: [...prev.nearbyCenters, { nombre: "", lat: "", lng: "", tipo: "Competencia" }],
    }));
  };

  const handleRemoveCenter = (index: number) => {
    setReport((prev) => ({
      ...prev,
      nearbyCenters: prev.nearbyCenters.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateCenter = (index: number, field: keyof NearbyCenter, value: string) => {
    setReport((prev) => ({
      ...prev,
      nearbyCenters: prev.nearbyCenters.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    }));
  };

  const handleGenerate = () => {
    if (!report.centerName.trim()) {
      toast.error("Por favor ingresa al menos el nombre del centro clínico.");
      return;
    }
    setShowCard(true);
    toast.success("Reporte generado correctamente.");
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `analisis-${report.centerAlias || report.centerName}.png`;
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

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-primary">
        <div className="container mx-auto px-4 py-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
              MedRD — Gestión de Red
            </h1>
            <p className="text-primary-foreground/70 text-sm">
              Análisis Comparativo de Prestadores
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6 animate-fade-in">
            <ReportForm
              data={report}
              onChange={handleChange}
              onGenerate={handleGenerate}
              onClear={handleClear}
              onAddCenter={handleAddCenter}
              onRemoveCenter={handleRemoveCenter}
              onUpdateCenter={handleUpdateCenter}
            />

            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-lg font-bold text-card-foreground mb-3">
                Seleccionar Ubicación
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Haz clic en una provincia del mapa para asociarla al reporte.
              </p>
              <DominicanRepublicMap
                onProvinceSelect={handleProvinceSelect}
                selectedProvince={report.province}
              />
              {report.provinceName && (
                <div className="mt-3 bg-accent/50 rounded-md px-4 py-2 text-sm text-accent-foreground font-medium">
                  ✓ Provincia seleccionada: {report.provinceName}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-card rounded-lg p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-card-foreground">
                  Vista Previa del Reporte
                </h2>
                {showCard && (
                  <Button onClick={handleDownload} size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Descargar PNG
                  </Button>
                )}
              </div>

              {showCard ? (
                <div className="flex justify-center overflow-x-auto">
                  <AnalysisReportCard ref={cardRef} data={report} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Activity className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Completa los datos y haz clic en "Generar Reporte" para ver la vista previa.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
