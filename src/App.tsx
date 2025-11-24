import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { GameTracker } from "./components/GameTracker";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import GameDemo from "./pages/GameDemo";
import CalculeazaGame from "./pages/CalculeazaGame";
import CalculeazaVizual from "./pages/CalculeazaVizual";
import BalantaMagica from "./pages/BalantaMagica";
import VeciniiNumerelor from "./pages/VeciniiNumerelor";
import MagiaInmultirii from "./pages/MagiaInmultirii";
import MasurareaTimpului from "./pages/MasurareaTimpului";
import MaJocCuFractii from "./pages/MaJocCuFractii";
import BazeleCalcululuiMatematic from "./pages/BazeleCalcululuiMatematic";
import Literatie from "./pages/Literatie";
import LiteraSilaba from "./pages/LiteraSilaba";
import UnitatiDeMasura from "./pages/UnitatiDeMasura";
import TariCapitale from "./pages/TariCapitale";
import ContinenteOceane from "./pages/ContinenteOceane";
import PuzzleHarta from "./pages/PuzzleHarta";
import JocSteaguri from "./pages/JocSteaguri";
import AventuraBusolei from "./pages/AventuraBusolei";
import OrientareNaturala from "./pages/OrientareNaturala";
import Culori from "./pages/Culori";
import CeFacAstazi from "./pages/CeFacAstazi";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-left" />
      <BrowserRouter>
        <AuthProvider>
          <GameTracker />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes - require authentication */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/demo" element={<ProtectedRoute><GameDemo /></ProtectedRoute>} />
            <Route path="/calculeaza" element={<ProtectedRoute><CalculeazaGame /></ProtectedRoute>} />
            <Route path="/calculeaza-vizual" element={<ProtectedRoute><CalculeazaVizual /></ProtectedRoute>} />
            <Route path="/bazele-calculului-matematic" element={<ProtectedRoute><BazeleCalcululuiMatematic /></ProtectedRoute>} />
            <Route path="/balanta-magica" element={<ProtectedRoute><BalantaMagica /></ProtectedRoute>} />
            <Route path="/vecinii-numerelor" element={<ProtectedRoute><VeciniiNumerelor /></ProtectedRoute>} />
            <Route path="/magia-inmultirii" element={<ProtectedRoute><MagiaInmultirii /></ProtectedRoute>} />
            <Route path="/majoc-cu-fractii" element={<ProtectedRoute><MaJocCuFractii /></ProtectedRoute>} />
            <Route path="/literatie" element={<ProtectedRoute><Literatie /></ProtectedRoute>} />
            <Route path="/litera-silaba" element={<ProtectedRoute><LiteraSilaba /></ProtectedRoute>} />
            <Route path="/masurarea-timpului" element={<ProtectedRoute><MasurareaTimpului /></ProtectedRoute>} />
            <Route path="/unitati-de-masura" element={<ProtectedRoute><UnitatiDeMasura /></ProtectedRoute>} />
            <Route path="/tari-capitale" element={<ProtectedRoute><TariCapitale /></ProtectedRoute>} />
            <Route path="/continente-oceane" element={<ProtectedRoute><ContinenteOceane /></ProtectedRoute>} />
            <Route path="/puzzle-harta" element={<ProtectedRoute><PuzzleHarta /></ProtectedRoute>} />
            <Route path="/joc-steaguri" element={<ProtectedRoute><JocSteaguri /></ProtectedRoute>} />
            <Route path="/aventura-busolei" element={<ProtectedRoute><AventuraBusolei /></ProtectedRoute>} />
            <Route path="/orientare-naturala" element={<ProtectedRoute><OrientareNaturala /></ProtectedRoute>} />
            <Route path="/culori" element={<ProtectedRoute><Culori /></ProtectedRoute>} />
            <Route path="/ce-fac-astazi" element={<ProtectedRoute><CeFacAstazi /></ProtectedRoute>} />
            
            {/* Admin-only route */}
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
