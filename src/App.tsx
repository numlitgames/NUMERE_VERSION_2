import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
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
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/demo" element={<GameDemo />} />
          <Route path="/calculeaza" element={<CalculeazaGame />} />
          <Route path="/calculeaza-vizual" element={<CalculeazaVizual />} />
          <Route path="/bazele-calculului-matematic" element={<BazeleCalcululuiMatematic />} />
          <Route path="/balanta-magica" element={<BalantaMagica />} />
          <Route path="/vecinii-numerelor" element={<VeciniiNumerelor />} />
          <Route path="/magia-inmultirii" element={<MagiaInmultirii />} />
          <Route path="/majoc-cu-fractii" element={<MaJocCuFractii />} />
          <Route path="/literatie" element={<Literatie />} />
          <Route path="/litera-silaba" element={<LiteraSilaba />} />
          <Route path="/masurarea-timpului" element={<MasurareaTimpului />} />
          <Route path="/unitati-de-masura" element={<UnitatiDeMasura />} />
          <Route path="/tari-capitale" element={<TariCapitale />} />
          <Route path="/continente-oceane" element={<ContinenteOceane />} />
          <Route path="/puzzle-harta" element={<PuzzleHarta />} />
          <Route path="/joc-steaguri" element={<JocSteaguri />} />
          <Route path="/aventura-busolei" element={<AventuraBusolei />} />
          <Route path="/orientare-naturala" element={<OrientareNaturala />} />
          <Route path="/culori" element={<Culori />} />
          <Route path="/ce-fac-astazi" element={<CeFacAstazi />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
