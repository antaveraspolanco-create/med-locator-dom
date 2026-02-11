import { useState } from "react";

interface Province {
  id: string;
  name: string;
  path: string;
  labelX: number;
  labelY: number;
}

const provinces: Province[] = [
  { id: "dn", name: "Distrito Nacional", path: "M 320 280 L 335 270 L 345 278 L 340 290 L 325 292 Z", labelX: 332, labelY: 282 },
  { id: "sd", name: "Santo Domingo", path: "M 300 265 L 320 255 L 350 265 L 355 285 L 345 300 L 315 305 L 295 290 Z", labelX: 325, labelY: 280 },
  { id: "spm", name: "San Pedro de Macorís", path: "M 355 270 L 385 260 L 400 275 L 390 295 L 360 300 L 350 285 Z", labelX: 375, labelY: 280 },
  { id: "lr", name: "La Romana", path: "M 400 260 L 430 250 L 445 265 L 440 285 L 410 290 L 395 280 Z", labelX: 420, labelY: 270 },
  { id: "ha", name: "La Altagracia", path: "M 440 240 L 480 220 L 510 235 L 500 270 L 470 285 L 445 275 Z", labelX: 475, labelY: 255 },
  { id: "es", name: "El Seibo", path: "M 410 240 L 440 225 L 460 230 L 445 260 L 420 255 L 405 250 Z", labelX: 432, labelY: 242 },
  { id: "ht", name: "Hato Mayor", path: "M 370 240 L 400 225 L 420 235 L 410 255 L 390 260 L 365 255 Z", labelX: 392, labelY: 245 },
  { id: "mc", name: "Monte Cristi", path: "M 60 170 L 100 155 L 130 165 L 125 190 L 95 200 L 60 195 Z", labelX: 95, labelY: 178 },
  { id: "da", name: "Dajabón", path: "M 95 195 L 125 185 L 140 200 L 135 220 L 110 225 L 95 215 Z", labelX: 117, labelY: 208 },
  { id: "sr", name: "Santiago Rodríguez", path: "M 120 185 L 150 175 L 170 190 L 160 210 L 140 215 L 125 200 Z", labelX: 145, labelY: 198 },
  { id: "vl", name: "Valverde", path: "M 130 165 L 165 155 L 180 170 L 175 190 L 155 195 L 135 185 Z", labelX: 155, labelY: 175 },
  { id: "pp", name: "Puerto Plata", path: "M 160 145 L 210 135 L 240 150 L 235 170 L 200 180 L 170 170 Z", labelX: 200, labelY: 158 },
  { id: "ep", name: "Espaillat", path: "M 235 160 L 265 150 L 280 165 L 270 185 L 245 185 L 235 175 Z", labelX: 258, labelY: 170 },
  { id: "st", name: "Santiago", path: "M 170 170 L 210 160 L 240 170 L 245 195 L 220 210 L 190 205 L 175 190 Z", labelX: 210, labelY: 188 },
  { id: "lv", name: "La Vega", path: "M 240 180 L 275 170 L 295 185 L 290 210 L 265 220 L 245 210 L 240 195 Z", labelX: 268, labelY: 198 },
  { id: "sm", name: "Salcedo (Hermanas Mirabal)", path: "M 275 160 L 300 152 L 315 165 L 305 180 L 285 180 L 275 172 Z", labelX: 295, labelY: 168 },
  { id: "du", name: "Duarte", path: "M 300 165 L 340 155 L 360 172 L 350 200 L 320 210 L 300 195 Z", labelX: 330, labelY: 182 },
  { id: "ss", name: "Samaná", path: "M 360 160 L 410 148 L 440 158 L 430 180 L 390 188 L 360 178 Z", labelX: 400, labelY: 168 },
  { id: "mn", name: "María Trinidad Sánchez", path: "M 330 148 L 370 140 L 395 150 L 385 170 L 355 175 L 335 165 Z", labelX: 362, labelY: 158 },
  { id: "sj", name: "San José de Ocoa", path: "M 245 260 L 270 250 L 285 260 L 280 280 L 260 285 L 245 275 Z", labelX: 265, labelY: 268 },
  { id: "pc", name: "Peravia", path: "M 260 280 L 290 270 L 305 285 L 295 305 L 270 310 L 255 295 Z", labelX: 280, labelY: 290 },
  { id: "az", name: "Azua", path: "M 195 260 L 230 248 L 255 260 L 250 285 L 225 295 L 200 285 Z", labelX: 228, labelY: 272 },
  { id: "sc", name: "San Cristóbal", path: "M 270 255 L 305 245 L 325 260 L 315 285 L 290 290 L 275 278 Z", labelX: 298, labelY: 268 },
  { id: "mp", name: "Monseñor Nouel", path: "M 250 225 L 280 215 L 300 228 L 290 248 L 265 252 L 250 240 Z", labelX: 275, labelY: 235 },
  { id: "sra", name: "Sánchez Ramírez", path: "M 295 210 L 325 200 L 345 215 L 335 238 L 310 242 L 295 230 Z", labelX: 320, labelY: 222 },
  { id: "mts", name: "Monte Plata", path: "M 330 225 L 370 215 L 395 232 L 380 258 L 350 262 L 330 248 Z", labelX: 360, labelY: 240 },
  { id: "lp", name: "San Juan", path: "M 130 230 L 175 218 L 200 235 L 200 265 L 170 280 L 135 270 L 125 250 Z", labelX: 165, labelY: 250 },
  { id: "el", name: "Elías Piña", path: "M 100 225 L 135 218 L 145 240 L 135 265 L 110 268 L 95 250 Z", labelX: 120, labelY: 245 },
  { id: "ba", name: "Baoruco", path: "M 120 270 L 150 262 L 165 280 L 158 305 L 135 312 L 118 295 Z", labelX: 140, labelY: 288 },
  { id: "in", name: "Independencia", path: "M 80 260 L 115 252 L 125 275 L 120 300 L 95 308 L 75 290 Z", labelX: 100, labelY: 280 },
  { id: "bs", name: "Barahona", path: "M 140 300 L 170 288 L 190 305 L 185 340 L 160 355 L 138 335 Z", labelX: 163, labelY: 322 },
  { id: "pd", name: "Pedernales", path: "M 75 300 L 110 295 L 125 315 L 115 345 L 90 355 L 70 330 Z", labelX: 98, labelY: 325 },
];

interface Props {
  onProvinceSelect: (province: { id: string; name: string } | null) => void;
  selectedProvince: string | null;
}

const DominicanRepublicMap = ({ onProvinceSelect, selectedProvince }: Props) => {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  return (
    <div className="w-full">
      <svg
        viewBox="40 120 500 260"
        className="w-full h-auto"
        style={{ maxHeight: "400px" }}
      >
        {/* Water background */}
        <rect x="40" y="120" width="500" height="260" rx="12" className="fill-accent/30" />
        
        {provinces.map((province) => {
          const isSelected = selectedProvince === province.id;
          const isHovered = hoveredProvince === province.id;

          return (
            <g key={province.id}>
              <path
                d={province.path}
                className={`
                  cursor-pointer transition-all duration-200 stroke-map-stroke
                  ${isSelected ? "fill-map-selected stroke-2" : isHovered ? "fill-map-hover" : "fill-map"}
                `}
                strokeWidth={isSelected ? 2 : 1}
                onClick={() => {
                  if (isSelected) {
                    onProvinceSelect(null);
                  } else {
                    onProvinceSelect({ id: province.id, name: province.name });
                  }
                }}
                onMouseEnter={() => setHoveredProvince(province.id)}
                onMouseLeave={() => setHoveredProvince(null)}
              />
              {(isSelected || isHovered) && (
                <circle
                  cx={province.labelX}
                  cy={province.labelY}
                  r="4"
                  className={`fill-primary-foreground stroke-primary stroke-2 animate-pulse-soft pointer-events-none`}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredProvince && (
        <div className="text-center mt-2">
          <span className="text-sm font-medium text-muted-foreground">
            {provinces.find((p) => p.id === hoveredProvince)?.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default DominicanRepublicMap;
