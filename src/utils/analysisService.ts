
import { AnalysisResult, RiskProfile, Timeframe, Asset } from '@/pages/Index';

// Simulação de análise por IA - em produção seria conectado a um serviço real
export const analyzeChart = async (
  imageUrl: string, 
  riskProfile: RiskProfile, 
  timeframe: Timeframe,
  asset: Asset // Adicionar asset
): Promise<AnalysisResult> => {
  // Simula tempo de processamento da IA
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Dados simulados baseados no perfil de risco e timeframe
  const basePrice = 45.67;
  
  // Ajusta volatilidade baseada no timeframe
  const timeframeMultiplier = timeframe.category === 'scalp' ? 1.5 : 0.8;
  const baseVolatility = riskProfile.type === 'aggressive' ? 0.08 : riskProfile.type === 'moderate' ? 0.05 : 0.03;
  const volatility = baseVolatility * timeframeMultiplier;
  
  // Ajusta stop loss baseado no timeframe
  const stopLossMultiplier = timeframe.category === 'scalp' ? 0.5 : 1.2;
  
  // Gera análise simulada
  const scenarios = [
    {
      recommendation: 'buy' as const,
      confidence: Math.floor(Math.random() * 20) + 75,
      entryPrice: basePrice,
      stopLoss: basePrice * (1 - volatility * riskProfile.maxRisk / 100 * stopLossMultiplier),
      takeProfits: [
        basePrice * (1 + volatility * 1.5),
        basePrice * (1 + volatility * 2.5),
        basePrice * (1 + volatility * 4)
      ] as [number, number, number],
      reasoning: `Padrão de alta identificado para ${asset.name} no timeframe ${timeframe.label}. ${
        timeframe.category === 'scalp' 
          ? 'Movimento rápido esperado com entrada e saída em minutos. Volume crescente confirma breakout.'
          : 'Tendência de alta sustentável identificada. Padrão confirma movimento de médio prazo.'
      } RSI em ${Math.floor(Math.random() * 20) + 60} e MACD cruzando para cima.`
    },
    {
      recommendation: 'sell' as const,
      confidence: Math.floor(Math.random() * 15) + 70,
      entryPrice: basePrice,
      stopLoss: basePrice * (1 + volatility * riskProfile.maxRisk / 100 * stopLossMultiplier),
      takeProfits: [
        basePrice * (1 - volatility * 1.5),
        basePrice * (1 - volatility * 2.5),
        basePrice * (1 - volatility * 4)
      ] as [number, number, number],
      reasoning: `Formação bearish identificada para ${asset.name} no timeframe ${timeframe.label}. ${
        timeframe.category === 'scalp'
          ? 'Pressão vendedora intensa detectada. Movimento de queda rápido esperado.'
          : 'Topo duplo confirmado com divergência bearish. Tendência de baixa de médio prazo.'
      } Volume de venda aumentando e rompimento de suporte principal.`
    },
    {
      recommendation: 'hold' as const,
      confidence: Math.floor(Math.random() * 15) + 60,
      entryPrice: basePrice,
      stopLoss: basePrice * (1 - volatility * riskProfile.maxRisk / 100 * stopLossMultiplier),
      takeProfits: [
        basePrice * (1 + volatility * 0.8),
        basePrice * (1 + volatility * 1.2),
        basePrice * (1 + volatility * 2)
      ] as [number, number, number],
      reasoning: `Consolidação lateral detectada para ${asset.name} no timeframe ${timeframe.label}. ${
        timeframe.category === 'scalp'
          ? 'Mercado em range. Aguardar breakout para definir direção de scalp.'
          : 'Padrão de acumulação identificado. Aguardar rompimento da faixa para entrada de swing.'
      } Indicadores neutros sugerem aguardar melhor setup.`
    }
  ];

  // Seleciona cenário aleatório
  const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  // Ajusta valores baseado no perfil de risco e timeframe
  const riskMultiplier = riskProfile.positionSize;
  const timeframeRiskAdjustment = timeframe.category === 'scalp' ? 0.8 : 1.2;
  
  return {
    ...selectedScenario,
    takeProfits: selectedScenario.takeProfits.map(tp => 
      selectedScenario.recommendation === 'buy' 
        ? tp * (1 + (riskMultiplier - 1) * 0.1 * timeframeRiskAdjustment)
        : tp * (1 - (riskMultiplier - 1) * 0.1 * timeframeRiskAdjustment)
    ) as [number, number, number]
  };
};
