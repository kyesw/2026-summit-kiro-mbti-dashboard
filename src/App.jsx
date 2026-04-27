import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HeroView from './pages/HeroView';
import MBTIBattleView from './pages/MBTIBattleView';
import SurveyView1 from './pages/SurveyView1';
import SurveyView2 from './pages/SurveyView2';
import KiroFeatureView from './pages/KiroFeatureView';
import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/1" replace />} />
        <Route path="/1" element={<HeroView />} />
        <Route path="/2" element={<MBTIBattleView />} />
        <Route path="/3" element={<SurveyView1 />} />
        <Route path="/4" element={<SurveyView2 />} />
        <Route path="/5" element={<KiroFeatureView />} />
      </Routes>
    </BrowserRouter>
  );
}
