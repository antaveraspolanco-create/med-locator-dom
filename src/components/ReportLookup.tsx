import { useState } from "react";
import { Search, Save, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  lookupLabel: string;
  lookupPlaceholder: string;
  onSearch: (query: string) => boolean;
  onSave: () => void;
  savedItems: { id: string; label: string; subLabel: string; savedAt: string }[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const ReportLookup = ({ lookupLabel, lookupPlaceholder, onSearch, onSave, savedItems, onLoad, onDelete }: Props) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) {
      toast.error("Ingresa un valor para buscar.");
      return;
    }
    const found = onSearch(query.trim());
    if (!found) {
      toast.info("No se encontró ningún registro con ese identificador.");
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card space-y-4">
      <h2 className="text-lg font-bold text-card-foreground flex items-center gap-2">
        <FileText className="w-5 h-5 text-primary" />
        Repositorio de Reportes
      </h2>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder={lookupPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} size="sm" variant="outline" className="gap-1">
          <Search className="w-4 h-4" /> Buscar
        </Button>
        <Button onClick={onSave} size="sm" className="gap-1">
          <Save className="w-4 h-4" /> Guardar
        </Button>
      </div>

      {savedItems.length > 0 && (
        <div className="max-h-48 overflow-y-auto space-y-1 border rounded-md p-2">
          <p className="text-xs text-muted-foreground font-medium mb-1">
            {savedItems.length} registro(s) guardado(s)
          </p>
          {savedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-accent/50 cursor-pointer group text-sm"
            >
              <div className="flex-1 min-w-0" onClick={() => onLoad(item.id)}>
                <span className="font-medium text-card-foreground truncate block">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.subLabel} · {new Date(item.savedAt).toLocaleDateString()}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportLookup;
