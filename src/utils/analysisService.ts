
import { AnalysisResult, RiskProfile, Timeframe, Asset } from '@/pages/Index';

// Simulação de análise por IA - em produção seria conectado a um serviço real
export const analyzeChart = async (
  imageUrl: string, 
  riskProfile: RiskProfile, 
  timeframe: Timeframe,
  asset: Asset
): Promise<AnalysisResult> => {
  // Simula tempo de processamento da IA
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Dados simulados baseados no ativo, perfil de risco e timeframe
  const assetBasePrices = {
    crypto: 45000, // Bitcoin-like
    stocks: 25.50, // Brazilian stock-like
    forex: 1.0850, // EUR/USD-like
    indices: 115000, // Ibovespa-like
  };

  const basePrice = assetBasePrices[asset.category] || 100;
  
  // Ajusta volatilidade baseada no ativo e timeframe
  const assetVolatility = {
    crypto: 0.08,
    stocks: 0.04,
    forex: 0.02,
    indices: 0.03,
  };
  
  const timeframeMultiplier = timeframe.category === 'scalp' ? 1.5 : 0.8;
  const riskMultiplier = riskProfile.type === 'aggressive' ? 1.3 : riskProfile.type === 'moderate' ? 1.0 : 0.7;
  const volatility = assetVolatility[asset.category] * timeframeMultiplier * riskMultiplier;
  
  // Ajusta stop loss baseado no timeframe e tipo de ativo
  const stopLossMultiplier = timeframe.category === 'scalp' ? 0.5 : 1.2;
  const assetStopMultiplier = asset.category === 'forex' ? 0.3 : 1.0;
  
  // Gera análise simulada
  const scenarios = [
    {
      recommendation: 'buy' as const,
      confidence: Math.floor(Math.random() * 20) + 75,
      entryPrice: basePrice,
      stopLoss: basePrice * (1 - volatility * riskProfile.maxRisk / 100 * stopLossMultiplier * assetStopMultiplier),
      takeProfits: [
        basePrice * (1 + volatility * 1.5),
        basePrice * (1 + volatility * 2.5),
        basePrice * (1 + volatility * 4)
      ] as [number, number, number],
      reasoning: `Padrão de alta identificado para ${asset.symbol} no timeframe ${timeframe.label}. ${
        timeframe.category === 'scalp' 
          ? `Movimento rápido esperado para ${asset.category === 'crypto' ? 'criptomoeda' : asset.category === 'stocks' ? 'ação' : asset.category === 'forex' ? 'par de moedas' : 'índice'} com entrada e saída em minutos.`
          : `Tendência de alta sustentável identificada para ${asset.symbol}. Padrão confirma movimento de médio prazo.`
      } ${asset.category === 'crypto' ? 'Volume crescente confirma breakout na crypto.' : asset.category === 'forex' ? 'Momentum forte no par de moedas.' : 'RSI favorável e MACD cruzando para cima.'}`
    },
    {
      recommendation: 'sell' as const,
      confidence: Math.floor(Math.random() * 15) + 70,
      entryPrice: basePrice,
      stopLoss: basePrice * (1 + volatility * riskProfile.maxRisk / 100 * stopLossMultiplier * assetStopMultiplier),
      takeProfits: [
        basePrice * (1 - volatility * 1.5),
        basePrice * (1 - volatility * 2.5),
        basePrice * (1 - volatility * 4)
      ] as [number, number, number],
      reasoning: `Formação bearish identificada para ${asset.symbol} no timeframe ${timeframe.label}. ${
        timeframe.category === 'scalp'
          ? `Pressão vendedora intensa detectada em ${asset.symbol}. Movimento de queda rápido esperado.`
          : `Topo duplo confirmado com divergência bearish em ${asset.symbol}. Tendência de baixa de médio prazo.`
      } ${asset.category === 'crypto' ? 'Volume de venda aumentando na crypto.' : asset.category === 'forex' ? 'Momentum vendedor forte no par.' : 'Rompimento de suporte principal confirmado.'}`
    },
    {
      recommendation: 'hold' as const,
      confidence: Math.floor(Math.random() * 15) + 60,
      entryPrice: basePrice,
      stopLoss: basePrice * (1 - volatility * riskProfile.maxRisk / 100 * stopLossMultiplier * assetStopMultiplier),
      takeProfits: [
        basePrice * (1 + volatility * 0.8),
        basePrice * (1 + volatility * 1.2),
        basePrice * (1 + volatility * 2)
      ] as [number, number, number],
      reasoning: `Consolidação lateral detectada para ${asset.symbol} no timeframe ${timeframe.label}. ${
        timeframe.category === 'scalp'
          ? `Mercado de ${asset.symbol} em range. Aguardar breakout para definir direção de scalp.`
          : `Padrão de acumulação identificado em ${asset.symbol}. Aguardar rompimento da faixa para entrada de swing.`
      } ${asset.category === 'crypto' ? 'Indicadores neutros na crypto sugerem aguardar.' : asset.category === 'forex' ? 'Par lateral, aguardar confirmação.' : 'Indicadores neutros sugerem aguardar melhor setup.'}`
    }
  ];

  // Seleciona cenário aleatório
  const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  // Ajusta valores baseado no perfil de risco, timeframe e ativo
  const riskPositionMultiplier = riskProfile.positionSize;
  const timeframeRiskAdjustment = timeframe.category === 'scalp' ? 0.8 : 1.2;
  const assetRiskAdjustment = asset.category === 'forex' ? 0.5 : 1.0;
  
  return {
    ...selectedScenario,
    takeProfits: selectedScenario.takeProfits.map(tp => 
      selectedScenario.recommendation === 'buy' 
        ? tp * (1 + (riskPositionMultiplier - 1) * 0.1 * timeframeRiskAdjustment * assetRiskAdjustment)
        : tp * (1 - (riskPositionMultiplier - 1) * 0.1 * timeframeRiskAdjustment * assetRiskAdjustment)
    ) as [number, number, number]
  };
};
