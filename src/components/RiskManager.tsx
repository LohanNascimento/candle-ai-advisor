
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Shield, TrendingUp, Zap } from 'lucide-react';
import { RiskProfile } from '@/pages/Index';

interface RiskManagerProps {
  profile: RiskProfile;
  onChange: (profile: RiskProfile) => void;
}

const RiskManager = ({ profile, onChange }: RiskManagerProps) => {
  const riskProfiles = [
    {
      type: 'conservative' as const,
      label: 'Conservador',
      icon: Shield,
      color: 'bg-blue-500',
      description: 'Baixo risco, retornos estáveis',
      maxRisk: 1,
      defaultPosition: 0.5
    },
    {
      type: 'moderate' as const,
      label: 'Moderado',
      icon: TrendingUp,
      color: 'bg-amber-500',
      description: 'Risco equilibrado',
      maxRisk: 2,
      defaultPosition: 1
    },
    {
      type: 'aggressive' as const,
      label: 'Agressivo',
      icon: Zap,
      color: 'bg-red-500',
      description: 'Alto risco, alto retorno',
      maxRisk: 5,
      defaultPosition: 2
    }
  ];

  const handleProfileChange = (type: 'conservative' | 'moderate' | 'aggressive') => {
    const selectedProfile = riskProfiles.find(p => p.type === type);
    if (selectedProfile) {
      onChange({
        type,
        maxRisk: selectedProfile.maxRisk,
        positionSize: selectedProfile.defaultPosition
      });
    }
  };

  const handleMaxRiskChange = (value: number[]) => {
    onChange({
      ...profile,
      maxRisk: value[0]
    });
  };

  const handlePositionSizeChange = (value: number[]) => {
    onChange({
      ...profile,
      positionSize: value[0]
    });
  };

  return (
    <div className="space-y-6">
      {/* Risk Profile Selection */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Perfil de Risco</h3>
        <div className="space-y-3">
          {riskProfiles.map((riskProfile) => {
            const Icon = riskProfile.icon;
            const isSelected = profile.type === riskProfile.type;
            
            return (
              <Button
                key={riskProfile.type}
                variant={isSelected ? "default" : "outline"}
                className={`w-full justify-start p-4 h-auto ${
                  isSelected 
                    ? `${riskProfile.color} hover:${riskProfile.color}/90 text-white` 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => handleProfileChange(riskProfile.type)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5" />
                  <div className="text-left flex-1">
                    <div className="font-medium">{riskProfile.label}</div>
                    <div className="text-sm opacity-80">{riskProfile.description}</div>
                  </div>
                  {isSelected && (
                    <Badge variant="secondary" className="ml-auto">
                      Ativo
                    </Badge>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Risk Settings */}
      <Card className="bg-slate-700/30 border-slate-600">
        <div className="p-4 space-y-6">
          <h4 className="font-semibold text-white">Configurações de Risco</h4>
          
          {/* Max Risk Percentage */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-slate-300">
                Risco Máximo por Trade
              </label>
              <span className="text-sm font-medium text-white">
                {profile.maxRisk}%
              </span>
            </div>
            <Slider
              value={[profile.maxRisk]}
              onValueChange={handleMaxRiskChange}
              max={10}
              min={0.5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0.5%</span>
              <span>10%</span>
            </div>
          </div>

          {/* Position Size */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-slate-300">
                Tamanho da Posição
              </label>
              <span className="text-sm font-medium text-white">
                {profile.positionSize}x
              </span>
            </div>
            <Slider
              value={[profile.positionSize]}
              onValueChange={handlePositionSizeChange}
              max={5}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0.1x</span>
              <span>5x</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Summary */}
      <Card className="bg-slate-700/30 border-slate-600">
        <div className="p-4">
          <h4 className="font-semibold text-white mb-3">Resumo de Risco</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Perfil:</span>
              <span className="text-white capitalize">{profile.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Risco por trade:</span>
              <span className="text-white">{profile.maxRisk}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Multiplicador:</span>
              <span className="text-white">{profile.positionSize}x</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RiskManager;
