
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Loader2, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { analyzeChart } from '@/utils/analysisService';
import { AnalysisResult, RiskProfile, Timeframe, Asset } from '@/pages/Index';
import TimeframeSelector from './TimeframeSelector';
import AssetSelector from './AssetSelector';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  onAnalysisStart: () => void;
  onAnalysisComplete: (result: AnalysisResult) => void;
  riskProfile: RiskProfile;
  selectedTimeframe: Timeframe | null;
  selectedAsset: Asset | null;
  onTimeframeChange: (timeframe: Timeframe) => void;
  onAssetChange: (asset: Asset) => void;
}

const ImageUpload = ({ 
  onImageUpload, 
  onAnalysisStart, 
  onAnalysisComplete, 
  riskProfile,
  selectedTimeframe,
  selectedAsset,
  onTimeframeChange,
  onAssetChange
}: ImageUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      onImageUpload(imageUrl);
      toast({
        title: "Sucesso",
        description: "Imagem carregada com sucesso!",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage || !selectedTimeframe || !selectedAsset) return;
    
    setIsAnalyzing(true);
    onAnalysisStart();
    
    try {
      const result = await analyzeChart(uploadedImage, riskProfile, selectedTimeframe, selectedAsset);
      onAnalysisComplete(result);
      toast({
        title: "Análise Concluída",
        description: `A IA analisou o gráfico de ${selectedAsset.symbol} com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro na Análise",
        description: "Ocorreu um erro durante a análise. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const canAnalyze = uploadedImage && selectedTimeframe && selectedAsset && !isAnalyzing;

  const getButtonText = () => {
    if (isAnalyzing) return 'Analisando...';
    if (!selectedAsset) return 'Selecione o Ativo';
    if (!selectedTimeframe) return 'Selecione o Timeframe';
    return `Analisar ${selectedAsset.symbol}`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-all duration-300 ${
          isDragging 
            ? 'border-blue-400 bg-blue-400/10' 
            : uploadedImage 
              ? 'border-green-400 bg-green-400/5'
              : 'border-slate-600 bg-slate-800/30'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <div className="p-8">
          {uploadedImage ? (
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-slate-900">
                <img 
                  src={uploadedImage} 
                  alt="Gráfico carregado"
                  className="w-full h-64 object-contain"
                />
              </div>
              <div className="flex items-center justify-center gap-2 text-green-400">
                <ImageIcon className="h-5 w-5" />
                <span className="font-medium">Imagem carregada com sucesso</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Faça upload do seu gráfico
                </h3>
                <p className="text-slate-400 mb-4">
                  Arraste e solte ou clique para selecionar uma imagem de gráfico de candlestick
                </p>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Asset Selection */}
      {uploadedImage && (
        <Card className="bg-slate-800/30 border-slate-700 p-6">
          <AssetSelector 
            selectedAsset={selectedAsset}
            onAssetChange={onAssetChange}
          />
        </Card>
      )}

      {/* Timeframe Selection */}
      {uploadedImage && selectedAsset && (
        <Card className="bg-slate-800/30 border-slate-700 p-6">
          <TimeframeSelector 
            selectedTimeframe={selectedTimeframe}
            onTimeframeChange={onTimeframeChange}
          />
        </Card>
      )}

      {/* Analyze Button */}
      {uploadedImage && (
        <div className="flex gap-4">
          <Button
            onClick={handleAnalyze}
            disabled={!canAnalyze}
            className={`flex-1 font-semibold py-3 ${
              canAnalyze 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-5 w-5" />
                {getButtonText()}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              setUploadedImage(null);
              onImageUpload('');
            }}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Remover
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
