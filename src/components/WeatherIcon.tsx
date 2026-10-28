import React from 'react';
import { 
  Sun, 
  Moon, 
  CloudSun, 
  CloudMoon, 
  Cloud, 
  CloudFog, 
  CloudDrizzle, 
  CloudRain, 
  Snowflake, 
  CloudLightning 
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ name, className = 'w-6 h-6', size }) => {
  const props = { className, size };

  switch (name) {
    case 'Sun':
      return <Sun {...props} className={`text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] ${className}`} />;
    case 'Moon':
      return <Moon {...props} className={`text-indigo-200 drop-shadow-[0_0_8px_rgba(199,210,254,0.4)] ${className}`} />;
    case 'CloudSun':
      return <CloudSun {...props} className={`text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)] ${className}`} />;
    case 'CloudMoon':
      return <CloudMoon {...props} className={`text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.4)] ${className}`} />;
    case 'Cloud':
      return <Cloud {...props} className={`text-slate-300 drop-shadow-[0_0_6px_rgba(203,213,225,0.3)] ${className}`} />;
    case 'CloudFog':
      return <CloudFog {...props} className={`text-slate-400 ${className}`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...props} className={`text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)] ${className}`} />;
    case 'CloudRain':
      return <CloudRain {...props} className={`text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] ${className}`} />;
    case 'Snowflake':
      return <Snowflake {...props} className={`text-cyan-200 drop-shadow-[0_0_8px_rgba(165,243,252,0.5)] ${className}`} />;
    case 'CloudLightning':
      return <CloudLightning {...props} className={`text-purple-400 drop-shadow-[0_0_10px_rgba(192,132,252,0.6)] ${className}`} />;
    default:
      return <CloudSun {...props} className={`text-amber-300 ${className}`} />;
  }
};
