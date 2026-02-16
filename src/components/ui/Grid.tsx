// src/components/ui/Grid.tsx
import { ReactNode } from 'react';

interface ColProps {
  children: ReactNode;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  className?: string;
}

export const Col: React.FC<ColProps> = ({
  children,
  xs = 24,
  sm,
  md,
  lg,
  xl,
  className = "",
}) => {
  const getColClasses = () => {
    const classes = [];
    
    // xs (mobile) - default
    classes.push(`col-span-${xs}`);
    
    // sm (tablet)
    if (sm) classes.push(`sm:col-span-${sm}`);
    
    // md (small laptop)
    if (md) classes.push(`md:col-span-${md}`);
    
    // lg (desktop)
    if (lg) classes.push(`lg:col-span-${lg}`);
    
    // xl (large desktop)
    if (xl) classes.push(`xl:col-span-${xl}`);
    
    return classes.join(' ');
  };

  return (
    <div className={`${getColClasses()} ${className}`}>
      {children}
    </div>
  );
};

interface RowProps {
  children: ReactNode;
  gutter?: [number, number]; // [horizontal, vertical]
  className?: string;
}

export const Row: React.FC<RowProps> = ({
  children,
  gutter = [0, 0],
  className = "",
}) => {
  const [horizontal, vertical] = gutter;
  
  const gutterClasses = {
    16: 'gap-4',
    24: 'gap-6',
    32: 'gap-8',
  };

  const gutterClass = gutterClasses[horizontal as keyof typeof gutterClasses] || 'gap-6';

  return (
    <div className={`grid grid-cols-24 ${gutterClass} ${className}`}>
      {children}
    </div>
  );
};