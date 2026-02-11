import { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { Download, Plus, Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import DominicanRepublicMap from "@/components/DominicanRepublicMap";
import ProviderCard from "@/components/ProviderCard";

interface ProviderData {
  code: string;
  name: string;
  specialty: string;
  phone: string;
  address: string;
  province: string | null;
  provinceName: string | null;
}

const emptyProvider: ProviderData = {
  code: "",
  name: "",
  specialty: "",
  phone: "",
  address: "",
  province: null,
  provinceName: null,
};

const Index = () => {
  const [provider, setProvider] = useState<ProviderData>(emptyProvider);
  const [showCard, setShowCard] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleChange = (field: keyof ProviderData, value: string) => {
    setProvider((prev) => ({ ...prev, [field]: value }));
  };

  const handleProvinceSelect = (prov: { id: string; name: string } | null) => {
    setProvider((prev) => ({
      ...prev,
      province: prov?.id ?? null,
      provinceName: prov?.name ?? null,
    }));
  };

  const handleGenerate = () => {
    if (!provider.code.trim() || !provider.name.trim()) {
      toast.error("Por favor ingresa al menos el código y nombre del prestador.");
      return;
    }
    setShowCard(true);
    toast.success("Ficha generada correctamente.");
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `prestador-${provider.code}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Imagen descargada.");
    } catch {
      toast.error("Error al generar la imagen.");
    }
  };

  const handleClear = () => {
    setProvider(emptyProvider);
    setShowCard(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-primary">
        <div className="container mx-auto px-4 py-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground tracking-tight">
              MedRD — Registro de Prestadores
            </h1>
            <p className="text-primary-foreground/70 text-sm">
              República Dominicana
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Form + Map */}
          <div className="space-y-6 animate-fade-in">
            {/* Form */}
            <div className="bg-card rounded-lg p-6 shadow-card space-y-4">
              <h2 className="text-lg font-bold text-card-foreground">
                Datos del Prestador
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    placeholder="Ej: PSS-001"
                    value={provider.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    placeholder="Nombre del prestador"
                    value={provider.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Input
                    id="specialty"
                    placeholder="Ej: Cardiología"
                    value={provider.specialty}
                    onChange={(e) => handleChange("specialty", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="809-000-0000"
                    value={provider.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    placeholder="Dirección del consultorio"
                    value={provider.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleGenerate} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Generar Ficha
                </Button>
                <Button variant="outline" onClick={handleClear} className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Limpiar
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="bg-card rounded-lg p-6 shadow-card">
              <h2 className="text-lg font-bold text-card-foreground mb-3">
                Seleccionar Ubicación
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Haz clic en una provincia del mapa para asociarla al prestador.
              </p>
              <DominicanRepublicMap
                onProvinceSelect={handleProvinceSelect}
                selectedProvince={provider.province}
              />
              {provider.provinceName && (
                <div className="mt-3 bg-accent/50 rounded-md px-4 py-2 text-sm text-accent-foreground font-medium">
                  ✓ Provincia seleccionada: {provider.provinceName}
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview */}
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="bg-card rounded-lg p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-card-foreground">
                  Vista Previa
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
                  <ProviderCard ref={cardRef} data={provider} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Completa los datos y haz clic en "Generar Ficha" para ver la vista previa.
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
