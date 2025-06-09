
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, RotateCcw, BarChart3 } from 'lucide-react';
import AnalysisResults from '@/components/AnalysisResults';
import { AnalysisResult, Asset } from '@/pages/Index';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewAnalysis: () => void;
  result: AnalysisResult | null;
  isLoading: boolean;
  selectedAsset: Asset | null;
}

const AnalysisModal = ({ 
  isOpen, 
  onClose, 
  onNewAnalysis, 
  result, 
  isLoading, 
  selectedAsset 
}: AnalysisModalProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'crypto':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'stocks':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'forex':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'indices':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'crypto':
        return 'Criptomoedas';
      case 'stocks':
        return 'Ações';
      case 'forex':
        return 'Forex';
      case 'indices':
        return 'Índices';
      default:
        return 'Outros';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-900 border-slate-700 text-white overflow-hidden">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                  Resultado da Análise
                  {selectedAsset && (
                    <Badge variant="outline" className="bg-slate-800 border-slate-600 text-white">
                      {selectedAsset.symbol}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  {selectedAsset && (
                    <span className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getCategoryColor(selectedAsset.category)}>
                        {getCategoryLabel(selectedAsset.category)}
                      </Badge>
                      {selectedAsset.name}
                    </span>
                  )}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onNewAnalysis}
                className="bg-slate-800 border-slate-600 hover:bg-slate-700 text-white"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Nova Análise
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2 scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 hover:scrollbar-thumb-slate-500">
          <div className="py-4">
            <AnalysisResults 
              result={result}
              isLoading={isLoading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisModal;
