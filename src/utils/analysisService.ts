
import { AnalysisResult, RiskProfile, Timeframe } from '@/pages/Index';

const API_BASE_URL = 'http://127.0.0.1:5000'; // URL da sua API Flask

const fetchAnalysis = async (symbol: string, interval: string, limit: number, imageData?: string): Promise<AnalysisResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbol, interval, limit, image_data: imageData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao buscar análise da API');
    }

    const data = await response.json();

    // Mapear a resposta da API para o tipo AnalysisResult
    return {
      recommendation: data.recommendation,
      confidence: data.confidence,
      entryPrice: data.entryPrice,
      stopLoss: data.stopLoss,
      takeProfits: data.takeProfits,
      reasoning: data.reasoning,
      discrepancyWarning: data.discrepancy_warning || undefined,
      imageAnalysisDiscrepancy: data.image_analysis_discrepancy || undefined,
      imageAnalysis: data.image_analysis || undefined,
    };

  } catch (error) {
    console.error('Erro ao chamar a API de análise:', error);
    throw error;
  }
};

// A função analyzeChart agora pode chamar fetchAnalysis com os parâmetros corretos
export const analyzeChart = async (symbol: string, interval: string, limit: number, riskProfile: RiskProfile, timeframe: Timeframe, imageData?: string): Promise<AnalysisResult> => {
  const analysisResult = await fetchAnalysis(symbol, interval, limit, imageData);
  return analysisResult;
};
