import { StarIcon } from "./Icons";

export default function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <StarIcon key={i} width={size} height={size} fill={Math.max(0, Math.min(1, rating - i))} />
      ))}
    </span>
  );
}
