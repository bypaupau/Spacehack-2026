// Importamos tu imagen
import miLogo from '../../assets/logo.png';

interface LogoProps {
  size?: number;
}

export function Logo({ size = 36 }: LogoProps) {
  return (
      <div className="flex items-center gap-2.5 select-none">
        {/* Usamos la etiqueta img clásica de HTML */}
        <img
            src={miLogo}
            alt="Logo de mi proyecto"
            style={{ width: size, height: 'auto', borderRadius: '50%' }}
        />
      </div>
  );
}