import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MonitorSmartphone,
  ShieldCheck,
  Store,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/useAuth";

const ERROR_MAP: Record<string, string> = {
  "auth/invalid-credential": "Credenciais inválidas. Verifique e-mail e senha.",
  "auth/invalid-email": "Endereço de e-mail inválido.",
  "auth/user-not-found": "Usuário não encontrado.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/user-disabled": "Usuário desativado. Contate o administrador.",
  "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos.",
  "auth/network-request-failed": "Falha de rede. Verifique sua conexão.",
};

const FEATURES = [
  {
    icon: Store,
    title: "Monitoramento de lojas",
    description: "Acompanhe sincronização, atrasos e taxa de sucesso em tempo real.",
  },
  {
    icon: MonitorSmartphone,
    title: "Players Music Delivery",
    description: "Status de sincronização e arquivos por player, pasta a pasta.",
  },
  {
    icon: TrendingUp,
    title: "Análises estatísticas",
    description: "Gráficos de atividade por hora e tendência de sincronização.",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(ERROR_MAP[signInError.code ?? ""] ?? signInError.message);
      setSubmitting(false);
      return;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* ============ PAINEL LATERAL INFORMATIVO (desktop) ============ */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-primary via-blue-800 to-indigo-900 p-12">
        {/* Círculos decorativos de fundo */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 -left-16 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex items-center space-x-3">
          <div className="p-2.5 bg-white/15 backdrop-blur rounded-xl">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Music Delivery Dashboard
            </h2>
            <p className="text-sm text-white/70">Sistema de monitoramento de lojas</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-3xl font-bold text-white leading-tight">
            Monitoramento e análise
            <br />
            de lojas Music Delivery
          </h1>

          <div className="space-y-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start space-x-3">
                <div className="mt-0.5 p-1.5 bg-white/15 backdrop-blur rounded-lg shrink-0">
                  <feature.icon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{feature.title}</p>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center space-x-2 text-white/60">
          <ShieldCheck className="h-4 w-4" />
          <p className="text-xs">Acesso restrito a usuários autorizados</p>
        </div>
      </div>

      {/* ============ COLUNA DO FORMULÁRIO ============ */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 xl:w-[45%] px-6 py-12 sm:px-12 relative">
        <div className="absolute top-5 right-5">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-sm space-y-6 animate-fade-in">
          {/* Logo visível apenas em mobile (painel lateral some) */}
          <div className="flex flex-col items-center space-y-3 text-center lg:hidden">
            <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl ring-1 ring-primary/10">
              <BarChart3 className="h-7 w-7 text-primary" />
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

          <div>
            <h3 className="text-lg font-semibold text-foreground tracking-tight">
              Entrar na sua conta
            </h3>
            <p className="text-sm text-muted-foreground">
              Acesso restrito a usuários autorizados
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm font-medium text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-muted-foreground lg:hidden">
            <Activity className="h-3.5 w-3.5" />
            <p className="text-xs">Sistema de uso interno · Music Delivery</p>
          </div>
        </div>
      </div>
    </div>
  );
}
