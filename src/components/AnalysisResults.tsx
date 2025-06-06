
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Target, Shield, DollarSign, Loader2 } from 'lucide-react';
import { AnalysisResult } from '@/pages/Index';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
}

const AnalysisResults = ({ result, isLoading }: AnalysisResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-12 w-12 text-blue-400 animate-spin" />
        <div className="text-center">
          <h3 className="text-lg font-medium text-white mb-2">Analisando gráfico...</h3>
          <p className="text-slate-400">A IA está processando os padrões de candlestick</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const getRecommendationDetails = (recommendation: string) => {
    switch (recommendation) {
      case 'buy':
        return {
          label: 'COMPRAR',
          color: 'bg-green-500',
          icon: TrendingUp,
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500'
        };
      case 'sell':
        return {
          label: 'VENDER',
          color: 'bg-red-500',
          icon: TrendingDown,
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500'
        };
      default:
        return {
          label: 'ESPERAR',
          color: 'bg-amber-500',
          icon: Minus,
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500'
        };
    }
  };

  const details = getRecommendationDetails(result.recommendation);
  const Icon = details.icon;

  return (
    <div className="space-y-6">
      {/* Main Recommendation */}
      <Card className={`${details.bgColor} ${details.borderColor} border-2`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 ${details.color} rounded-full`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{details.label}</h3>
                <p className="text-slate-400">Recomendação da IA</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{result.confidence}%</div>
              <p className="text-sm text-slate-400">Confiança</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Nível de Confiança</span>
              <span>{result.confidence}%</span>
            </div>
            <Progress value={result.confidence} className="h-2" />
          </div>

          <p className="text-slate-300 leading-relaxed">{result.reasoning}</p>
        </div>
      </Card>

      {/* Price Levels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Entry Price */}
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-white">Preço de Entrada</h4>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              ${result.entryPrice.toFixed(2)}
            </div>
          </div>
        </Card>

        {/* Stop Loss */}
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-red-400" />
              <h4 className="font-semibold text-white">Stop Loss</h4>
            </div>
            <div className="text-2xl font-bold text-red-400">
              ${result.stopLoss.toFixed(2)}
            </div>
          </div>
        </Card>
      </div>

      {/* Take Profits */}
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-green-400" />
            <h4 className="font-semibold text-white">Níveis de Take Profit</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.takeProfits.map((tp, index) => (
              <div key={index} className="text-center">
                <Badge variant="secondary" className="mb-2">
                  TP {index + 1}
                </Badge>
                <div className="text-xl font-bold text-green-400">
                  ${tp.toFixed(2)}
                </div>
                <div className="text-sm text-slate-400">
                  {((tp - result.entryPrice) / result.entryPrice * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Risk/Reward Analysis */}
      <Card className="bg-slate-800/50 border-slate-700">
        <div className="p-4">
          <h4 className="font-semibold text-white mb-3">Análise de Risco/Retorno</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Risco:</span>
              <span className="ml-2 text-red-400 font-medium">
                {(Math.abs(result.entryPrice - result.stopLoss) / result.entryPrice * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-slate-400">Retorno Potencial:</span>
              <span className="ml-2 text-green-400 font-medium">
                {((result.takeProfits[0] - result.entryPrice) / result.entryPrice * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Discrepancy Warning */}
      {result.discrepancyWarning && (
        <Card className="bg-yellow-500/10 border-yellow-500 border-2">
          <div className="p-4">
            <h4 className="font-semibold text-yellow-400 mb-2">Aviso de Discrepância</h4>
            <p className="text-yellow-300 text-sm">{result.discrepancyWarning}</p>
            {result.imageAnalysisDiscrepancy && (
              <div className="mt-3 text-xs text-yellow-300">
                <p><strong>Análise da Imagem (Divergente):</strong></p>
                <p>Ação: {(result.imageAnalysisDiscrepancy as { action: string }).action}</p>
                <p>Confiança: {(result.imageAnalysisDiscrepancy as { confidence: number }).confidence.toFixed(2)}%</p>
                <p>Razão: {(result.imageAnalysisDiscrepancy as { reasoning: string }).reasoning}</p>
                {(result.imageAnalysisDiscrepancy as { visual_patterns?: string[] }).visual_patterns && (
                  <p>Padrões Visuais: {((result.imageAnalysisDiscrepancy as { visual_patterns?: string[] }).visual_patterns || []).join(', ')}</p>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Image Analysis (if available and not discrepant) */}
      {result.imageAnalysis && !result.discrepancyWarning && (
        <Card className="bg-blue-500/10 border-blue-500 border-2">
          <div className="p-4">
            <h4 className="font-semibold text-blue-400 mb-2">Análise de Imagem Complementar</h4>
            <p className="text-blue-300 text-sm">Esta análise visual complementa a análise de dados históricos.</p>
            <div className="mt-3 text-xs text-blue-300">
              <p><strong>Análise da Imagem:</strong></p>
              <p>Ação: {(result.imageAnalysis as { action: string }).action}</p>
              <p>Confiança: {(result.imageAnalysis as { confidence: number }).confidence.toFixed(2)}%</p>
              <p>Razão: {(result.imageAnalysis as { reasoning: string }).reasoning}</p>
              {(result.imageAnalysis as { visual_patterns?: string[] }).visual_patterns && (
                <p>Padrões Visuais: {((result.imageAnalysis as { visual_patterns?: string[] }).visual_patterns || []).join(', ')}</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResults;
