import { useCountUp } from '../hooks/useCountUp';

type Props = {
  value: string;
  className?: string;
};

/** Affiche "800+" en comptant de 0 → 800, puis ajoute le suffixe "+" */
export default function CountUp({ value, className = '' }: Props) {
  const match = value.match(/^(\d+)(.*)$/);
  const end = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : value;
  const { count, ref } = useCountUp({ end });

  return (
    <div ref={ref} className={className}>
      {count}
      {suffix}
    </div>
  );
}
