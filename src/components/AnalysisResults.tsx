
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Shield, 
  DollarSign, 
  Loader2, 
  BarChart4,
  ArrowUpRight,
  ArrowDownRight,
  MoveHorizontal,
  Eye
} from 'lucide-react';
import { AnalysisResult } from '@/pages/Index';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  className?: string;
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

  // Função auxiliar para verificar se um valor é um array de números
  const isNumberArray = (value: any): value is number[] => {
    return Array.isArray(value) && value.every(item => typeof item === 'number');
  };

  // Função auxiliar para verificar se um valor é um array de strings
  const isStringArray = (value: any): value is string[] => {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
  };

  // Função para normalizar os dados de análise visual
  const normalizeImageAnalysis = (analysis: any) => {
    if (!analysis) return null;
    
    // Garantir que os valores numéricos sejam números
    const supportLevels = (analysis.support_levels || analysis.supportLevels || []).map(Number).filter(n => !isNaN(n));
    const resistanceLevels = (analysis.resistance_levels || analysis.resistanceLevels || []).map(Number).filter(n => !isNaN(n));
    
    return {
      action: (analysis.action || analysis.Action || 'HOLD').toUpperCase(),
      confidence: Number(analysis.confidence || analysis.Confidence || 0),
      reasoning: analysis.reasoning || analysis.Reasoning || '',
      support_levels: supportLevels,
      resistance_levels: resistanceLevels,
      trend_direction: (analysis.trend_direction || analysis.trendDirection || '').toUpperCase(),
      visual_patterns: analysis.visual_patterns || analysis.visualPatterns || []
    };
  };
  
  // Normalizar os dados de análise visual
  const normalizedImageAnalysis = result.imageAnalysis ? normalizeImageAnalysis(result.imageAnalysis) : null;
  const normalizedDiscrepancy = result.imageAnalysisDiscrepancy ? normalizeImageAnalysis(result.imageAnalysisDiscrepancy) : null;

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
              <div className="text-2xl font-bold text-white">
                {result.confidence ? result.confidence.toFixed(2) : 'N/A'}%
              </div>
              <p className="text-sm text-slate-400">Confiança</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Nível de Confiança</span>
              <span>{result.confidence ? result.confidence.toFixed(2) : 'N/A'}%</span>
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
              ${result.entryPrice ? result.entryPrice.toFixed(2) : 'N/A'}
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
              ${result.stopLoss ? result.stopLoss.toFixed(2) : 'N/A'}
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
                  {typeof tp === 'number' ? tp.toFixed(2) : 'N/A'}
                </div>
                <div className="text-sm text-slate-400">
                  {((tp - result.entryPrice) / result.entryPrice * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Análise Visual Detalhada */}
      {normalizedImageAnalysis && (
        <Card className="bg-slate-800/50 border-slate-700">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-purple-400" />
              <h4 className="text-lg font-semibold text-white">Análise Visual Detalhada</h4>
              {normalizedImageAnalysis.confidence > 0 && (
                <Badge className="ml-auto bg-purple-500/20 text-purple-300 border-purple-500/30">
                  Confiança: {normalizedImageAnalysis.confidence.toFixed(1)}%
                </Badge>
              )}
            </div>
            
            {/* Ação Recomendada */}
            <div className="mb-6 p-3 rounded-md bg-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-300">Ação Recomendada:</span>
                <Badge 
                  variant="outline" 
                  className={
                    normalizedImageAnalysis.action === 'BUY' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                    normalizedImageAnalysis.action === 'SELL' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }
                >
                  {normalizedImageAnalysis.action === 'BUY' ? 'COMPRAR' : 
                   normalizedImageAnalysis.action === 'SELL' ? 'VENDER' : 'AGUARDAR'}
                </Badge>
              </div>
              {normalizedImageAnalysis.reasoning && (
                <p className="mt-2 text-sm text-slate-400">{normalizedImageAnalysis.reasoning}</p>
              )}
            </div>
            
            {/* Suportes e Resistências */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Suportes */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-slate-400 flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-400" />
                  Suportes Próximos
                </h5>
                <div className="space-y-1">
                  {normalizedImageAnalysis.support_levels && normalizedImageAnalysis.support_levels.length > 0 ? (
                    normalizedImageAnalysis.support_levels.slice(0, 3).map((level, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                        <span className="text-white">Nível {idx + 1}</span>
                        <span className="text-green-400 font-mono">${level.toFixed(5)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">Nenhum suporte identificado</p>
                  )}
                </div>
              </div>
              
              {/* Resistências */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-slate-400 flex items-center gap-1">
                  <Shield className="h-4 w-4 text-red-400" />
                  Resistências Próximas
                </h5>
                <div className="space-y-1">
                  {normalizedImageAnalysis.resistance_levels && normalizedImageAnalysis.resistance_levels.length > 0 ? (
                    normalizedImageAnalysis.resistance_levels.slice(0, 3).map((level, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                        <span className="text-white">Nível {idx + 1}</span>
                        <span className="text-red-400 font-mono">${level.toFixed(5)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm">Nenhuma resistência identificada</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Direção da Tendência */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-slate-400">Tendência Atual</h5>
              {normalizedImageAnalysis.trend_direction && 
               ['UP', 'DOWN', 'SIDEWAYS'].includes(normalizedImageAnalysis.trend_direction) ? (
                <div className="flex items-center gap-2">
                  {normalizedImageAnalysis.trend_direction === 'UP' && (
                    <>
                      <ArrowUpRight className="h-5 w-5 text-green-400" />
                      <span className="text-green-400">Tendência de Alta</span>
                    </>
                  )}
                  {normalizedImageAnalysis.trend_direction === 'DOWN' && (
                    <>
                      <ArrowDownRight className="h-5 w-5 text-red-400" />
                      <span className="text-red-400">Tendência de Baixa</span>
                    </>
                  )}
                  {normalizedImageAnalysis.trend_direction === 'SIDEWAYS' && (
                    <>
                      <MoveHorizontal className="h-5 w-5 text-amber-400" />
                      <span className="text-amber-400">Mercado Lateral</span>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Tendência não identificada</p>
              )}
            </div>
            
            {/* Padrões Visuais */}
            {normalizedImageAnalysis.visual_patterns && normalizedImageAnalysis.visual_patterns.length > 0 && (
              <div className="mt-4 space-y-2">
                <h5 className="text-sm font-medium text-slate-400">Padrões Visuais Detectados</h5>
                <div className="flex flex-wrap gap-2">
                  {normalizedImageAnalysis.visual_patterns.map((pattern, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20"
                    >
                      {pattern || 'Padrão não identificado'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

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
              <div className="mt-3 space-y-2 text-sm text-yellow-300">
                <p><strong>Análise da Imagem (Divergente):</strong></p>
                <p>Ação: {result.imageAnalysisDiscrepancy.action || 'N/A'}</p>
                <p>Confiança: {result.imageAnalysisDiscrepancy.confidence ? result.imageAnalysisDiscrepancy.confidence.toFixed(2) + '%' : 'N/A'}</p>
                <p>Razão: {result.imageAnalysisDiscrepancy.reasoning || 'N/A'}</p>
                
                {/* Suportes */}
                {result.imageAnalysisDiscrepancy.support_levels?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Níveis de Suporte:</p>
                    <div className="grid grid-cols-2 gap-1">
                      {result.imageAnalysisDiscrepancy.support_levels.map((level, idx) => (
                        <div key={`disc-support-${idx}`} className="flex justify-between">
                          <span>Suporte {idx + 1}:</span>
                          <span className="font-mono">${level.toFixed(5)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Resistências */}
                {result.imageAnalysisDiscrepancy.resistance_levels?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Níveis de Resistência:</p>
                    <div className="grid grid-cols-2 gap-1">
                      {result.imageAnalysisDiscrepancy.resistance_levels.map((level, idx) => (
                        <div key={`disc-resistance-${idx}`} className="flex justify-between">
                          <span>Resistência {idx + 1}:</span>
                          <span className="font-mono">${level.toFixed(5)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Tendência */}
                {result.imageAnalysisDiscrepancy.trend_direction && (
                  <div className="mt-2">
                    <p className="font-medium">Tendência:</p>
                    <div className="flex items-center gap-1">
                      {result.imageAnalysisDiscrepancy.trend_direction === 'UP' && (
                        <>
                          <ArrowUpRight className="h-4 w-4 text-green-400" />
                          <span>Tendência de Alta</span>
                        </>
                      )}
                      {result.imageAnalysisDiscrepancy.trend_direction === 'DOWN' && (
                        <>
                          <ArrowDownRight className="h-4 w-4 text-red-400" />
                          <span>Tendência de Baixa</span>
                        </>
                      )}
                      {result.imageAnalysisDiscrepancy.trend_direction === 'SIDEWAYS' && (
                        <>
                          <MoveHorizontal className="h-4 w-4 text-amber-400" />
                          <span>Mercado Lateral</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Padrões Visuais */}
                {result.imageAnalysisDiscrepancy.visual_patterns?.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Padrões Visuais Detectados:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.imageAnalysisDiscrepancy.visual_patterns.map((pattern, idx) => (
                        <span key={`disc-pattern-${idx}`} className="px-2 py-0.5 bg-yellow-500/20 text-yellow-200 text-xs rounded">
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Análise de Imagem Complementar */}
      {result.imageAnalysis && !result.discrepancyWarning && normalizedImageAnalysis && (
        <Card className="bg-blue-500/10 border-blue-500 border-2">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart4 className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-blue-400">Análise de Imagem Complementar</h4>
              {normalizedImageAnalysis.confidence > 0 && (
                <Badge className="ml-auto bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Confiança: {normalizedImageAnalysis.confidence.toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-blue-300 text-sm mb-4">Esta análise visual complementa a análise de dados históricos.</p>
            
            {/* Ação Recomendada */}
            <div className="mb-4 p-3 rounded-md bg-slate-700/50">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-300">Ação Recomendada:</span>
                <Badge 
                  variant="outline" 
                  className={
                    normalizedImageAnalysis.action === 'BUY' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                    normalizedImageAnalysis.action === 'SELL' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }
                >
                  {normalizedImageAnalysis.action === 'BUY' ? 'COMPRAR' : 
                   normalizedImageAnalysis.action === 'SELL' ? 'VENDER' : 'AGUARDAR'}
                </Badge>
              </div>
              {normalizedImageAnalysis.reasoning && (
                <p className="mt-2 text-sm text-slate-400">{normalizedImageAnalysis.reasoning}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Suportes */}
              {normalizedImageAnalysis.support_levels && normalizedImageAnalysis.support_levels.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-blue-300 flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-400" />
                    Níveis de Suporte
                  </h5>
                  <div className="space-y-1">
                    {normalizedImageAnalysis.support_levels.slice(0, 3).map((level, idx) => (
                      <div key={`support-${idx}`} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                        <span className="text-white">Nível {idx + 1}</span>
                        <span className="text-green-400 font-mono">${level.toFixed(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Resistências */}
              {normalizedImageAnalysis.resistance_levels && normalizedImageAnalysis.resistance_levels.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-blue-300 flex items-center gap-1">
                    <Shield className="h-4 w-4 text-red-400" />
                    Níveis de Resistência
                  </h5>
                  <div className="space-y-1">
                    {normalizedImageAnalysis.resistance_levels.slice(0, 3).map((level, idx) => (
                      <div key={`resistance-${idx}`} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                        <span className="text-white">Nível {idx + 1}</span>
                        <span className="text-red-400 font-mono">${level.toFixed(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Tendência */}
            {normalizedImageAnalysis.trend_direction && (
              <div className="mt-4 space-y-2">
                <h5 className="text-sm font-medium text-blue-300">Tendência Identificada</h5>
                <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded">
                  {normalizedImageAnalysis.trend_direction === 'UP' && (
                    <>
                      <ArrowUpRight className="h-5 w-5 text-green-400" />
                      <span className="text-green-400">Tendência de Alta</span>
                    </>
                  )}
                  {normalizedImageAnalysis.trend_direction === 'DOWN' && (
                    <>
                      <ArrowDownRight className="h-5 w-5 text-red-400" />
                      <span className="text-red-400">Tendência de Baixa</span>
                    </>
                  )}
                  {normalizedImageAnalysis.trend_direction === 'SIDEWAYS' && (
                    <>
                      <MoveHorizontal className="h-5 w-5 text-amber-400" />
                      <span className="text-amber-400">Mercado Lateral</span>
                    </>
                  )}
                </div>
              </div>
            )}
            
            {/* Padrões Visuais */}
            {normalizedImageAnalysis.visual_patterns && normalizedImageAnalysis.visual_patterns.length > 0 && (
              <div className="mt-4 space-y-2">
                <h5 className="text-sm font-medium text-blue-300">Padrões Visuais Detectados</h5>
                <div className="flex flex-wrap gap-2">
                  {normalizedImageAnalysis.visual_patterns.map((pattern, idx) => (
                    <Badge 
                      key={`pattern-${idx}`}
                      variant="outline"
                      className="bg-blue-500/10 text-blue-300 border-blue-500/30 hover:bg-blue-500/20"
                    >
                      {pattern || 'Padrão não identificado'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalysisResults;
