import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import Landing from './pages/Landing'
import { SignUp, SignIn } from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import ToolsHub from './pages/ToolsHub'
import ToolPage from './pages/tools/ToolPage'
import CampaignBuilder from './pages/CampaignBuilder'
import ContentCalendar from './pages/ContentCalendar'
import BrandVoice from './pages/BrandVoice'
import CompetitorSpy from './pages/tools/CompetitorSpy'
import { ClientsList, ClientDetail } from './pages/clients/Clients'
import AnalyticsNarrator from './pages/tools/AnalyticsNarrator'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'
// Discover
import NewsHub from './pages/news/NewsHub'
import FreelancingHub from './pages/freelancing/FreelancingHub'
import JobsBoard from './pages/jobs/JobsBoard'
import LearningHub from './pages/learn/LearningHub'
import Community from './pages/community/Community'
import TemplatesLibrary from './pages/templates/TemplatesLibrary'
import Marketplace from './pages/marketplace/Marketplace'
import GamifiedChallenges from './pages/challenges/GamifiedChallenges'
// AI Features
import PersonalCMO from './pages/cmo/PersonalCMO'
import ROIPredictor from './pages/roi/ROIPredictor'
import ViralScore from './pages/viral/ViralScore'
import LiveMonitor from './pages/monitor/LiveMonitor'
import CulturalAdapter from './pages/cultural/CulturalAdapter'
import PsychologyAnalyzer from './pages/psychology/PsychologyAnalyzer'
import InfluencerMatchmaker from './pages/influencers/InfluencerMatchmaker'
import AdSpyLive from './pages/adspy/AdSpyLive'
import TrendForecaster from './pages/trends/TrendForecaster'
import BrandDNA from './pages/branddna/BrandDNA'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Protected app — AppLayout handles auth guard */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tools" element={<ToolsHub />} />
            <Route path="/tools/competitor-spy" element={<CompetitorSpy />} />
            <Route path="/tools/analytics-narrator" element={<AnalyticsNarrator />} />
            <Route path="/tools/:toolId" element={<ToolPage />} />
            <Route path="/campaigns/new" element={<CampaignBuilder />} />
            <Route path="/campaigns" element={<Navigate to="/dashboard" replace />} />
            <Route path="/calendar" element={<ContentCalendar />} />
            <Route path="/brand-voice" element={<BrandVoice />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/clients/:clientId" element={<ClientDetail />} />
            <Route path="/settings" element={<Settings />} />
            {/* Discover */}
            <Route path="/news" element={<NewsHub />} />
            <Route path="/freelancing" element={<FreelancingHub />} />
            <Route path="/jobs" element={<JobsBoard />} />
            <Route path="/learn" element={<LearningHub />} />
            <Route path="/community" element={<Community />} />
            <Route path="/templates" element={<TemplatesLibrary />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/challenges" element={<GamifiedChallenges />} />
            {/* AI Features */}
            <Route path="/cmo" element={<PersonalCMO />} />
            <Route path="/roi-predictor" element={<ROIPredictor />} />
            <Route path="/viral-score" element={<ViralScore />} />
            <Route path="/monitor" element={<LiveMonitor />} />
            <Route path="/cultural" element={<CulturalAdapter />} />
            <Route path="/psychology" element={<PsychologyAnalyzer />} />
            <Route path="/influencers" element={<InfluencerMatchmaker />} />
            <Route path="/ad-spy" element={<AdSpyLive />} />
            <Route path="/trends" element={<TrendForecaster />} />
            <Route path="/brand-dna" element={<BrandDNA />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
