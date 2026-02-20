
export function Card({ children, className }: any) {
  return <div className={`rounded-md shadow p-4 ${className}`}>{children}</div>;
}

export function CardHeader({ children, className }: any) {
  return <div className={`font-bold text-lg mb-2 ${className}`}>{children}</div>;
}

export function CardContent({ children, className }: any) {
  return <div className={`${className}`}>{children}</div>;
}