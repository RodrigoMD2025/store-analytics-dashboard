import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";

interface Cliente {
  id: string;
  nome: string;
  email: string;
}

interface ClienteSelectProps {
  clientes: Cliente[];
  selectedCliente: string | null;
  onClienteChange: (clienteId: string | null) => void;
}

export function ClienteSelect({ 
  clientes, 
  selectedCliente, 
  onClienteChange 
}: ClienteSelectProps) {
  return (
    <div className="flex items-center space-x-2">
      <Users className="h-4 w-4 text-muted-foreground" />
      <Select
        value={selectedCliente || "todos"}
        onValueChange={(value) => onClienteChange(value === "todos" ? null : value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Selecionar cliente" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os clientes</SelectItem>
          {clientes.map((cliente) => (
            <SelectItem key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}