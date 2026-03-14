/**
 * App.jsx — componente raiz e definição de todas as rotas.
 *
 * Arquitectura de 3 dashboards:
 *   /login              → LoginPage (pública)
 *   /admin/*            → Layout de superuser (a construir na Fase 2)
 *   /trainer/*          → Layout de trainer (actual conteúdo da app)
 *   /cliente/*          → Portal do cliente (a construir na Fase 3)
 *
 * Cada namespace de rotas tem o seu próprio ProtectedRoute com o role exigido.
 * O conteúdo de cada dashboard tem o seu próprio layout (sidebar, navegação).
 *
 * Rotas sem autenticação:
 *   /login              → página de login
 *   /                   → redireciona para /login (nunca deve ficar em /)
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

// ---------------------------------------------------------------
// Páginas do Trainer — já construídas (mantidas, apenas reencaminhadas)
// ---------------------------------------------------------------
import TrainerLayout from '@/layouts/TrainerLayout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import Sessions from './pages/Sessions';
import Packs from './pages/Packs';
import Exercises from './pages/Exercises';
import TrainingPlans from './pages/TrainingPlans';

// ---------------------------------------------------------------
// Páginas de Admin e Cliente — placeholders até à Fase 2/3
// ---------------------------------------------------------------

function AdminLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Admin Dashboard (em construção)</p>
    </div>
  );
}

function ClientPlaceholder() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Client Dashboard (em construção)</p>
    </div>
  );
}

// Componente raiz da aplicação.

export default function App() {
  return (
    <Routes>
      {/* ============================================================
                ROTAS PÚBLICAS — não requerem autenticação
            ============================================================ */}

      {/* Página de login — acessível a todos */}
      <Route path="/login" element={<LoginPage />} />

      {/* Raiz redireciona para login — nunca deve ficar em / */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* ============================================================
                ROTAS DO TRAINER — requerem role="trainer"
                O ProtectedRoute verifica autenticação e role antes de
                renderizar o TrainerLayout.
            ============================================================ */}

      <Route
        path="/trainer/*"
        element={
          <ProtectedRoute requiredRole="trainer">
            <TrainerLayout />
          </ProtectedRoute>
        }
      >
        {/* Redireciona /trainer para /trainer/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Dashboard principal */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Gestão de clientes */}
        <Route path="clientes" element={<Clients />} />
        <Route path="clientes/:id" element={<ClientDetails />} />

        {/* Gestão de sessões */}
        <Route path="sessoes" element={<Sessions />} />

        {/* Gestão de packs */}
        <Route path="packs" element={<Packs />} />

        {/* Gestão de exercícios */}
        <Route path="exercicios" element={<Exercises />} />

        {/* Gestão de planos de treino */}
        <Route path="planos-de-treino" element={<TrainingPlans />} />

        {/* Página de nutrição */}
        <Route
          path="nutricao"
          element={
            <div className="p-6 text-muted-foreground">
              Nutrição — em construção
            </div>
          }
        />

        {/* Página de avaliação */}
        <Route
          path="avaliacoes"
          element={
            <div className="p-6 text-muted-foreground">
              Avaliações — em construção
            </div>
          }
        />

        <Route
          path="suplementos"
          element={
            <div className="p-6 text-muted-foreground">
              Suplementos — em construção
            </div>
          }
        />

        <Route
          path="billing"
          element={
            <div className="p-6 text-muted-foreground">
              Billing — em construção
            </div>
          }
        />

        <Route
          path="perfil"
          element={
            <div className="p-6 text-muted-foreground">
              Perfil — em construção
            </div>
          }
        />
      </Route>

      {/* ============================================================
                ROTAS DO SUPERUSER — requerem role="superuser"
                Fase 2 — layouts e páginas de admin a construir
            ============================================================ */}

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="superuser">
            <AdminLayout />
          </ProtectedRoute>
        }
      />

      {/* ============================================================
                ROTAS DO CLIENTE — requerem role="client"
                Fase 3 — portal do cliente a construir
            ============================================================ */}

      <Route
        path="/client/*"
        element={
          <ProtectedRoute requiredRole="client">
            <ClientPlaceholder />
          </ProtectedRoute>
        }
      />

      {/* Fallback para rotas desconhecidas — redireciona para login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
