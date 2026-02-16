import { Hospital, Stethoscope, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full bg-[#015993] shadow-md">
        <div className="w-full px-6 py-6 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center">
            <Hospital className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Ars Primera — Gestión de Red
            </h1>
            <p className="text-white/70 text-sm" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Sistema de Análisis Comparativo y Siniestralidad
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl w-full">
          <Link
            to="/institucionales"
            className="group bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all border border-border hover:border-primary/30 flex flex-col items-center text-center gap-4">

            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Hospital className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-card-foreground mb-1">PSS Institucionales</h2>
              <p className="text-sm text-muted-foreground">
                Análisis comparativo de prestadores, zona, competencia y siniestralidad.
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Ingresar <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            to="/medicos"
            className="group bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all border border-border hover:border-primary/30 flex flex-col items-center text-center gap-4">

            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Stethoscope className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-card-foreground mb-1">Médicos</h2>
              <p className="text-sm text-muted-foreground">
                Evaluación individual de siniestralidad y eficiencia médica.
              </p>
            </div>
            <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Ingresar <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </main>
    </div>);

};

export default Home;