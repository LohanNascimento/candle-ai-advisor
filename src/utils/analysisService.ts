
import { AnalysisResult, RiskProfile, Timeframe, Asset } from '@/pages/Index';

const API_BASE_URL = 'http://127.0.0.1:5000'; // Ou a URL do seu backend

export const fetchAnalysis = async (data: {
  imageUrl: string;
  riskProfile: RiskProfile;
  timeframe: Timeframe;
  asset: Asset;
}): Promise<AnalysisResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro na análise da IA');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar análise:', error);
    throw error;
  }
};

export const analyzeChart = async (
  imageUrl: string, 
  riskProfile: RiskProfile, 
  timeframe: Timeframe,
  asset: Asset
): Promise<AnalysisResult> => {
  return fetchAnalysis({ imageUrl, riskProfile, timeframe, asset });
};

