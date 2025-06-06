
import { useState } from 'react';
import AnalysisInput from '@/components/AnalysisInput';
import AnalysisResults from '@/components/AnalysisResults';
import RiskManager from '@/components/RiskManager';
import { Card } from '@/components/ui/card';
import { TrendingUp, BarChart3, Shield } from 'lucide-react';

export interface Asset {
  symbol: string;
  name: string;
  category: 'crypto' | 'stocks' | 'forex' | 'indices';
}

export interface Timeframe {
  category: 'scalp' | 'swing';
  value: '1m' | '3m' | '5m' | '1h' | '4h' | '1d' | '1w';
  label: string;
}

export interface AnalysisResult {
  recommendation: 'buy' | 'sell' | 'hold';
  confidence: number;
  entryPrice: number;
  stopLoss: number;
  takeProfits: [number, number, number];
  reasoning: string;
  discrepancyWarning?: string;
  imageAnalysisDiscrepancy?: any; // Pode ser um objeto com os detalhes da análise da imagem divergente
  imageAnalysis?: any; // Pode ser um objeto com os detalhes da análise da imagem
}

export interface RiskProfile {
  type: 'conservative' | 'moderate' | 'aggressive';
  maxRisk: number;
  positionSize: number;
}

const Index = () => {

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [riskProfile, setRiskProfile] = useState<RiskProfile>({
    type: 'moderate',
    maxRisk: 2,
    positionSize: 1
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setAnalysisResult(null);
    setSelectedTimeframe(null); // Reset timeframe when new image is uploaded
  };

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleRiskProfileChange = (profile: RiskProfile) => {
    setRiskProfile(profile);
  };

  const handleTimeframeChange = (timeframe: Timeframe) => {
    setSelectedTimeframe(timeframe);
  };

  const handleAssetChange = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              CandleStick AI
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Análise inteligente de gráficos de candlestick com IA avançada para decisões de trading precisas
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-semibold text-white">Upload do Gráfico</h2>
                </div>
                <AnalysisInput 
                  onAnalysisStart={() => setIsAnalyzing(true)}
                  onAnalysisComplete={handleAnalysisComplete}
                  riskProfile={riskProfile}
                  selectedTimeframe={selectedTimeframe}
                  selectedAsset={selectedAsset}
                  onTimeframeChange={handleTimeframeChange}
                  onAssetChange={handleAssetChange}
                />
              </div>
            </Card>

            {/* Analysis Results */}
            {(analysisResult || isAnalyzing) && (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mt-8">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Resultado da Análise</h2>
                  <AnalysisResults 
                    result={analysisResult}
                    isLoading={isAnalyzing}
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Risk Manager Sidebar */}
          <div>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm sticky top-8">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="h-6 w-6 text-amber-400" />
                  <h2 className="text-xl font-semibold text-white">Gerenciador de Risco</h2>
                </div>
                <RiskManager 
                  profile={riskProfile}
                  onChange={handleRiskProfileChange}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
