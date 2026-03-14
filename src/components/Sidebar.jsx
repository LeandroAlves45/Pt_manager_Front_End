/**
 * Sidebar.jsx — navegação principal da aplicação.
 *
 * Responsivo:
 *   Desktop (lg+): sidebar fixa à esquerda com 256px de largura
 *   Mobile (<lg): escondida; acessível via botão hamburger (Sheet)
 *
 * White-label:
 *   O logo é carregado dinamicamente do AuthContext (trainerSettings.logo_url).
 *   Se não existir logo configurado, mostra o ícone + nome da app.
 *   A cor primária já foi injectada nas CSS variables no momento do login.
 *
 * Esta sidebar é usada apenas no TrainerLayout.
 * O AdminLayout e o ClientLayout têm as suas próprias sidebars (a construir).
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Package,
  Dumbbell,
  Menu,
  Activity,
  LogOut,
  UtensilsCrossed,
  ClipboardList,
  Pill,
  CreditCard,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';

/**
 *
 * Items de navegação do trainer
 * Cada item tem: label (texto visivel), href (rota), icon (componente do lucide-react)
 */

const navItems = [
  { label: 'Dashboard', href: '/trainer/dashboard', icon: LayoutDashboard },
  { label: 'Clientes', href: '/trainer/clientes', icon: Users },
  { label: 'Sessões', href: '/trainer/sessoes', icon: CalendarDays },
  { label: 'Packs', href: '/trainer/packs', icon: Package },
  { label: 'Exercícios', href: '/trainer/exercicios', icon: Activity },
  {
    label: 'Planos de treino',
    href: '/trainer/planos-de-treino',
    icon: Dumbbell,
  },
  { label: 'Nutrição', href: '/trainer/nutricao', icon: UtensilsCrossed },
  { label: 'Avaliações', href: '/trainer/avaliacoes', icon: ClipboardList },
  { label: 'Suplementos', href: '/trainer/suplementos', icon: Pill },
];

const bottomNavItems = [
  { label: 'Perfil', href: '/trainer/perfil', icon: User },
  { label: 'Pagamentos', href: '/trainer/billing', icon: CreditCard },
];

/**
 * Conteúdo partilhado entre a sidebar desktop e o Sheet mobile.
 * Recebe onNavigate para fechar o Sheet ao clicar num link (apenas mobile).
 */

function NavContent({ onNavigate }) {
  const location = useLocation();
  const { user, trainerSettings, logout } = useAuth();

  // Gera as iniciais do nome do trainer para o avatar fallback (ex: "João Silva" → "JS")
  function getInitials(name = '') {
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }

  // Nome da app: usa o nome personalizado do trainer se existir, senão um nome genérico "PT Manager"
  const appName = trainerSettings?.app_name ?? 'PT Manager';

  return (
    <div className="flex h-full flex-col">
      {/* Cabeçalho com o logo */}
      <div className="flex items-center justify-center px-4 py-6 border-b border-border">
        {trainerSettings?.logo_url ? (
          <img
            src={trainerSettings.logo_url}
            alt={appName}
            className="h-16 w-auto object-contain max-w-45"
          />
        ) : (
          // Fallback: ícone + nome da app
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-base text-foreground">
              {appName}
            </span>
          </div>
        )}
      </div>

      {/*Lista de links de navegação */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => {
            // isActive: destaca o item correspondente à rota actual
            const isActive = location.pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onNavigate}
                  className={cn(
                    //Classes base: layout do item, padding, bordas, arrednoamento, fonte
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    //Classes condicionais: ativo vs inativo
                    isActive
                      ? 'bg-primary/10 text-primary' // ativo: fundo azul subtil + texto azul
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground' //inativo: cinza, hover muda
                  )}
                >
                  {/* Ícone do item, shrink-0 impede que encolha */}
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Separador visual antes dos itens secundários */}
        <div className="my-3 border-t border-border" />

        <ul className="flex flex-col gap-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Rodapé: Avatar + nome + Logout */}
      <div className="border-t border-border px3 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {getInitials(user?.full_name)}
            </AvatarFallback>
          </Avatar>

          {/* Nome e email do trainer */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.full_name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>

          {/* Botão de Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="shrink-0 text-muted-foreground hover:text-destructive"
            title="Terminar sessão"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente principal exportado.
 * Renderiza a sidebar desktop e o header mobile com hamburger.
 */

export default function Sidebar() {
  //Estado para controlar se o menu mobile está aberto
  const [open, setOpen] = useState(false);
  const { trainerSettings } = useAuth();
  const appName = trainerSettings?.app_name ?? 'PT Manager';

  return (
    <>
      {/* ===== SIDEBAR DESKTOP ===== */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 border-r border-border bg-sidebar">
        <NavContent />
      </aside>

      {/* ===== HEADER MOBILE (com hamburger) ===== */}
      <header className="sticky top-0 z-40 flex items-center justify-between bg-background border-b border-border px-4 py-3 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          {/* Botão hamburger para abrir o menu */}
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>

          {/* Painel lateral que desliza da esquerda */}
          <SheetContent
            side="left"
            className="w-64 p-0 bg-sidebar border-border"
          >
            <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
            {/* Ao clicar num link, fecha o sheet */}
            <NavContent onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Logo no header mobile */}
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">{appName}</span>
        </div>

        {/* Espaço vazio para centrar o nome (equilibra o botão hamburger) */}
        <div className="w-9" />
      </header>
    </>
  );
}
