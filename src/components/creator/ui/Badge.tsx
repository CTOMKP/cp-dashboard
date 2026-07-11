interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "grey" | "blue" | "purple" | "yellow" | "red" | "teal" | "orange";
  className?: string;
}

const variants = {
  green: "bg-[var(--color-creator-success)]/15 text-[var(--color-creator-success)]",
  grey: "bg-creator-text-secondary/15 text-creator-text-secondary",
  blue: "bg-[var(--color-creator-info)]/15 text-[var(--color-creator-info)]",
  purple: "bg-[var(--color-creator-purple)]/15 text-[var(--color-creator-purple)]",
  yellow: "bg-[var(--color-creator-warning)]/15 text-[var(--color-creator-warning)]",
  red: "bg-[var(--color-creator-danger)]/15 text-[var(--color-creator-danger)]",
  teal: "bg-[var(--color-creator-teal)]/15 text-[var(--color-creator-teal)]",
  orange: "bg-[var(--color-creator-accent)]/15 text-[var(--color-creator-accent)]",
};

export default function Badge({
  children,
  variant = "grey",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
