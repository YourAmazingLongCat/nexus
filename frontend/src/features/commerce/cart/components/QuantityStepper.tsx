interface QuantityStepperProps {
  value: number;
  min?: number;
  max: number;
  label: string;
  onChange: (next: number) => void;
}

export default function QuantityStepper({
  value,
  min = 1,
  max,
  label,
  onChange,
}: QuantityStepperProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className="nx-cart-qty" role="group" aria-label={label}>
      <button
        type="button"
        className="nx-cart-qty-btn"
        onClick={decrease}
        disabled={value <= min}
        aria-label={`Giảm số lượng ${label}`}
      >
        <i className="bi bi-dash" aria-hidden="true"></i>
      </button>
      <span className="nx-cart-qty-val" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="nx-cart-qty-btn"
        onClick={increase}
        disabled={value >= max}
        aria-label={`Tăng số lượng ${label}`}
      >
        <i className="bi bi-plus" aria-hidden="true"></i>
      </button>
    </div>
  );
}
