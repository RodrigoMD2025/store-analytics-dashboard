import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { BarChart3, Zap } from "lucide-react";

interface DashboardHeaderProps {
  totalClientes: number;
  ultimaAtualizacao?: string;
}

export function DashboardHeader({ totalClientes, ultimaAtualizacao }: DashboardHeaderProps) {
  return (
    <div className="border-b border-border bg-gradient-to-r from-background via-background to-background/80 sticky top-0 z-10 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl ring-1 ring-primary/10 shadow-glow animate-pulse-glow">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  Music Delivery Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sistema de monitoramento de lojas
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Total de clientes</p>
              <p className="text-lg font-semibold text-foreground">{totalClientes}</p>
            </div>

            <Badge className="flex items-center gap-1.5 bg-gradient-to-r from-green-500/15 to-green-500/5 text-green-700 dark:text-green-400 border-green-500/20 shadow-sm px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Online
            </Badge>
          </div>
        </div>

        {ultimaAtualizacao && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/60" />
              Última atualização: {ultimaAtualizacao}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}