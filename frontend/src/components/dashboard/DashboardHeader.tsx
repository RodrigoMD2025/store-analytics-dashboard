import { Badge } from "@/components/ui/badge";
import { BarChart3, Zap } from "lucide-react";

interface DashboardHeaderProps {
  totalClientes: number;
  ultimaAtualizacao?: string;
}

export function DashboardHeader({ totalClientes, ultimaAtualizacao }: DashboardHeaderProps) {
  return (
    <div className="border-b border-border bg-gradient-to-r from-background to-background/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Music Delivery Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Sistema de monitoramento de lojas
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total de clientes</p>
              <p className="text-xl font-semibold text-foreground">{totalClientes}</p>
            </div>
            
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Online
            </Badge>
          </div>
        </div>
        
        {ultimaAtualizacao && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Última atualização: {ultimaAtualizacao}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}