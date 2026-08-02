'use client';

interface BillingToggleProps {
  billingInterval: 'month' | 'year';
  onChange: (interval: 'month' | 'year') => void;
}

export function BillingToggle({ billingInterval, onChange }: BillingToggleProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-muted p-1">
      <button
        onClick={() => onChange('month')}
        className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
          billingInterval === 'month' 
            ? 'bg-background shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange('year')}
        className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
          billingInterval === 'year' 
            ? 'bg-background shadow-sm' 
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Yearly <span className="text-xs text-green-500">(Save 20%)</span>
      </button>
    </div>
  );
}