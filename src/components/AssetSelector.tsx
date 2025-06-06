
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, DollarSign, Globe, BarChart } from 'lucide-react';
import { Asset } from '@/pages/Index';

interface AssetSelectorProps {
  selectedAsset: Asset | null;
  onAssetChange: (asset: Asset) => void;
}

const AssetSelector = ({ selectedAsset, onAssetChange }: AssetSelectorProps) => {
  const [customSymbol, setCustomSymbol] = useState('');

  const popularAssets = {
    crypto: [
      { symbol: 'BTCUSDT', name: 'Bitcoin', category: 'crypto' as const },
      { symbol: 'ETHUSDT', name: 'Ethereum', category: 'crypto' as const },
      { symbol: 'BNBUSDT', name: 'Binance Coin', category: 'crypto' as const },
      { symbol: 'ADAUSDT', name: 'Cardano', category: 'crypto' as const },
    ],
    stocks: [
      { symbol: 'PETR4', name: 'Petrobras', category: 'stocks' as const },
      { symbol: 'VALE3', name: 'Vale', category: 'stocks' as const },
      { symbol: 'ITUB4', name: 'Itaú', category: 'stocks' as const },
      { symbol: 'BBDC4', name: 'Bradesco', category: 'stocks' as const },
    ],
    forex: [
      { symbol: 'EURUSD', name: 'Euro/Dólar', category: 'forex' as const },
      { symbol: 'GBPUSD', name: 'Libra/Dólar', category: 'forex' as const },
      { symbol: 'USDJPY', name: 'Dólar/Iene', category: 'forex' as const },
      { symbol: 'AUDUSD', name: 'Dólar Australiano/Dólar', category: 'forex' as const },
    ],
    indices: [
      { symbol: 'IBOV', name: 'Ibovespa', category: 'indices' as const },
      { symbol: 'SPY', name: 'S&P 500', category: 'indices' as const },
      { symbol: 'QQQ', name: 'Nasdaq 100', category: 'indices' as const },
      { symbol: 'DXY', name: 'Índice do Dólar', category: 'indices' as const },
    ],
  };

  const categoryIcons = {
    crypto: TrendingUp,
    stocks: BarChart,
    forex: Globe,
    indices: DollarSign,
  };

  const categoryColors = {
    crypto: 'orange',
    stocks: 'blue',
    forex: 'green',
    indices: 'purple',
  };

  const categoryLabels = {
    crypto: 'Criptomoedas',
    stocks: 'Ações BR',
    forex: 'Forex',
    indices: 'Índices',
  };

  const handleCustomSymbolSubmit = () => {
    if (customSymbol.trim()) {
      const asset: Asset = {
        symbol: customSymbol.toUpperCase(),
        name: customSymbol.toUpperCase(),
        category: 'crypto', // Default category
      };
      onAssetChange(asset);
      setCustomSymbol('');
    }
  };

  const isSelected = (asset: Asset) => {
    return selectedAsset?.symbol === asset.symbol;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Selecione o Ativo</h3>
      
      {/* Custom Asset Input */}
      <Card className="bg-slate-700/30 border-slate-600 p-4">
        <div className="space-y-3">
          <Label htmlFor="asset-input" className="text-slate-300">
            Digite o símbolo do ativo
          </Label>
          <div className="flex gap-2">
            <Input
              id="asset-input"
              value={customSymbol}
              onChange={(e) => setCustomSymbol(e.target.value)}
              placeholder="Ex: BTCUSDT, PETR4, EURUSD..."
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400"
              onKeyPress={(e) => e.key === 'Enter' && handleCustomSymbolSubmit()}
            />
            <Button
              onClick={handleCustomSymbolSubmit}
              disabled={!customSymbol.trim()}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Adicionar
            </Button>
          </div>
        </div>
      </Card>

      {/* Popular Assets by Category */}
      {Object.entries(popularAssets).map(([category, assets]) => {
        const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
        const color = categoryColors[category as keyof typeof categoryColors];
        const label = categoryLabels[category as keyof typeof categoryLabels];
        
        return (
          <Card key={category} className="bg-slate-700/30 border-slate-600 p-4">
            <div className="flex items-center gap-2 mb-3">
              <IconComponent className={`h-5 w-5 text-${color}-400`} />
              <h4 className={`font-medium text-${color}-400`}>{label}</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {assets.map((asset) => (
                <Button
                  key={asset.symbol}
                  variant={isSelected(asset) ? "default" : "outline"}
                  size="sm"
                  onClick={() => onAssetChange(asset)}
                  className={`text-xs ${
                    isSelected(asset)
                      ? `bg-${color}-500 hover:bg-${color}-600 text-white`
                      : `border-slate-600 text-slate-300 hover:bg-${color}-500/10 hover:border-${color}-400`
                  }`}
                >
                  <div className="text-center">
                    <div className="font-semibold">{asset.symbol}</div>
                    <div className="text-xs opacity-80">{asset.name}</div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        );
      })}

      {selectedAsset && (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 rounded-lg p-3 border border-green-400/20">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>
            Ativo selecionado: <strong>{selectedAsset.symbol}</strong> 
            ({selectedAsset.name})
          </span>
        </div>
      )}
    </div>
  );
};

export default AssetSelector;
