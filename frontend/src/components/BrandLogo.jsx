import { cn } from '../lib/utils';

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
  xl: 'h-28 w-28'
};

export const BrandLogo = ({
  className,
  logoClassName,
  showText = true,
  inverted = false,
  size = 'md',
  title = 'Catholic Professionals Society',
  subtitle = 'Papua New Guinea'
}) => {
  const titleClasses = inverted ? 'text-[#F8F5F0]' : 'text-[#1C2522]';
  const subtitleClasses = inverted ? 'text-[#C29B57]' : 'text-[#C29B57]';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <img
        src="/images/cps/cps-logo.png"
        alt="Catholic Professionals Society logo"
        className={cn('shrink-0 object-contain', sizeClasses[size], logoClassName)}
      />
      {showText && (
        <div>
          <span className={cn('block font-[\'Cormorant_Garamond\'] text-xl font-semibold leading-none tracking-tight', titleClasses)}>
            {title}
          </span>
          <span className={cn('mt-1 block text-xs font-bold uppercase tracking-[0.22em]', subtitleClasses)}>
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
