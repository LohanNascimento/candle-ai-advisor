
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, Timer } from 'lucide-react';
import { Timeframe } from '@/pages/Index';

interface TimeframeSelectorProps {
  selectedTimeframe: Timeframe | null;
  onTimeframeChange: (timeframe: Timeframe) => void;
}

const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange }: TimeframeSelectorProps) => {
  const scalpTimeframes: Timeframe[] = [
    { category: 'scalp', value: '1m', label: '1 Minuto' },
    { category: 'scalp', value: '3m', label: '3 Minutos' },
    { category: 'scalp', value: '5m', label: '5 Minutos' },
    { category:'scalp', value: '15m', label: '15 Minutos' },
    { category:'scalp', value: '30m', label: '30 Minutos' },
  ];

  const swingTimeframes: Timeframe[] = [
    { category: 'swing', value: '1h', label: '1 Hora' },
    { category: 'swing', value: '4h', label: '4 Horas' },
    { category: 'swing', value: '1d', label: '1 Dia' },
    { category: 'swing', value: '1w', label: '1 Semana' },
  ];

  const isSelected = (timeframe: Timeframe) => {
    return selectedTimeframe?.value === timeframe.value;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Selecione o Timeframe</h3>
      
      {/* Scalp Trading */}
      <Card className="bg-slate-700/30 border-slate-600 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Timer className="h-5 w-5 text-red-400" />
          <h4 className="font-medium text-red-400">Scalp Trading</h4>
          <span className="text-sm text-slate-400">(1m - 30m)</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {scalpTimeframes.map((timeframe) => (
            <Button
              key={timeframe.value}
              variant={isSelected(timeframe) ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeframeChange(timeframe)}
              className={`text-xs ${
                isSelected(timeframe)
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'border-slate-600 text-slate-300 hover:bg-red-500/10 hover:border-red-400'
              }`}
            >
              {timeframe.label}
            </Button>
          ))}
        </div>
      </Card>

      {/* Swing Trading */}
      <Card className="bg-slate-700/30 border-slate-600 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-blue-400" />
          <h4 className="font-medium text-blue-400">Swing Trading</h4>
          <span className="text-sm text-slate-400">(1h - 1w)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {swingTimeframes.map((timeframe) => (
            <Button
              key={timeframe.value}
              variant={isSelected(timeframe) ? "default" : "outline"}
              size="sm"
              onClick={() => onTimeframeChange(timeframe)}
              className={`text-xs ${
                isSelected(timeframe)
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'border-slate-600 text-slate-300 hover:bg-blue-500/10 hover:border-blue-400'
              }`}
            >
              {timeframe.label}
            </Button>
          ))}
        </div>
      </Card>

      {selectedTimeframe && (
        <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 rounded-lg p-3 border border-green-400/20">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>
            Timeframe selecionado: <strong>{selectedTimeframe.label}</strong> 
            ({selectedTimeframe.category === 'scalp' ? 'Scalp Trading' : 'Swing Trading'})
          </span>
        </div>
      )}
    </div>
  );
};

export default TimeframeSelector;
