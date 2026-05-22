import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  trend?: {
    value: number;
    label: string;
  };
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  variant = "default",
  trend 
}: MetricCardProps) {
  const variantStyles = {
    default: "border-border",
    success: "border-accent/20 bg-gradient-to-br from-accent/5 to-transparent",
    warning: "border-warning/20 bg-gradient-to-br from-warning/5 to-transparent", 
    danger: "border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent"
  };

  const iconStyles = {
    default: "text-primary",
    success: "text-accent",
    warning: "text-warning",
    danger: "text-destructive"
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 card-hover-effect",
      variantStyles[variant]
    )}>
      <div className={cn(
        "absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        variant === "success" && "bg-gradient-to-t from-accent/5 to-transparent",
        variant === "danger" && "bg-gradient-to-t from-destructive/5 to-transparent",
        variant === "warning" && "bg-gradient-to-t from-warning/5 to-transparent",
      )} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-4 w-4", iconStyles[variant])} />
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold text-foreground">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={cn(
              "text-xs font-medium",
              trend.value > 0 ? "text-accent" : trend.value < 0 ? "text-destructive" : "text-muted-foreground"
            )}>
              {trend.value > 0 ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}