
import { AnalysisResult, RiskProfile } from '@/pages/Index';

// Simulação de análise por IA - em produção seria conectado a um serviço real
export const analyzeChart = async (imageUrl: string, riskProfile: RiskProfile): Promise<AnalysisResult> => {
  // Simula tempo de processamento da IA
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Dados simulados baseados no perfil de risco
  const basePrice = 45.67;
  const volatility = riskProfile.type === 'aggressive' ? 0.08 : riskProfile.type === 'moderate' ? 0.05 : 0.03;
  
  // Gera análise simulada
  const scenarios = [
    {
      recommendation: 'buy' as const,
      confidence: Math.floor(Math.random() * 20) + 75,
      entryPrice: basePrice,
      stopLoss: basePrice * (1 - volatility * riskProfile.maxRisk / 100),
      takeProfits: [
        basePrice * (1 + volatility * 1.5),
        basePrice * (1 + volatility * 2.5),
        basePrice * (1 + volatility * 4)
      ] as [number, number, number],
      reasoning: "Padrão de alta identificado com rompimento de resistência. Volume crescente confirma movimento. Indicadores técnicos mostram momentum positivo com RSI em 65 e MACD cruzando para cima."
    },
    {
      recommendation: 'sell' as const,
      confidence: Math.floor(Math.random() * 15) + 70,
      entryPrice: basePrice,
      stopLoss: basePrice * (1 + volatility * riskProfile.maxRisk / 100),
      takeProfits: [
        basePrice * (1 - volatility * 1.5),
        basePrice * (1 - volatility * 2.5),
        basePrice * (1 - volatility * 4)
      ] as [number, number, number],
      reasoning: "Formação de topo duplo identificada com divergência bearish no RSI. Volume de venda aumentando. Rompimento da linha de suporte principal indica continuação da tendência de baixa."
    },
    {
      recommendation: 'hold' as const,
      confidence: Math.floor(Math.random() * 15) + 60,
      entryPrice: basePrice,
      stopLoss: basePrice * (1 - volatility * riskProfile.maxRisk / 100),
      takeProfits: [
        basePrice * (1 + volatility * 0.8),
        basePrice * (1 + volatility * 1.2),
        basePrice * (1 + volatility * 2)
      ] as [number, number, number],
      reasoning: "Mercado em consolidação lateral. Padrões conflitantes identificados. Aguardar rompimento claro da faixa de trading atual entre suporte e resistência para definir direção."
    }
  ];

  // Seleciona cenário aleatório
  const selectedScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  
  // Ajusta valores baseado no perfil de risco
  const riskMultiplier = riskProfile.positionSize;
  
  return {
    ...selectedScenario,
    takeProfits: selectedScenario.takeProfits.map(tp => 
      selectedScenario.recommendation === 'buy' 
        ? tp * (1 + (riskMultiplier - 1) * 0.1)
        : tp * (1 - (riskMultiplier - 1) * 0.1)
    ) as [number, number, number]
  };
};
