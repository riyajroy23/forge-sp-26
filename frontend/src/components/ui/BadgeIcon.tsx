import alumniSvg from './badge-alumni.svg';
import studentSvg from './badge-student.svg';

interface BadgeIconProps {
  role: string | null | undefined;
  className?: string;
  height?: number;
}

const BadgeIcon = ({ role, className = '', height = 24 }: BadgeIconProps) => {
  // default to STUDENT if no role set
  const resolvedRole = role?.toUpperCase() || 'STUDENT';
  const isAlumni = resolvedRole === 'EMPLOYEE';
  const src = isAlumni ? alumniSvg : studentSvg;
  const label = isAlumni ? 'Alumni' : 'Student';

  return (
    <img
      src={src}
      alt={label}
      title={label}
      style={{ height: `${height}px`, width: 'auto' }}
      className={className}
    />
  );
};

export default BadgeIcon;
