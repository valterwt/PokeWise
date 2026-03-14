interface GradeBadgeProps {
  grade: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

function getGradeColor(grade: number) {
  if (grade >= 9) return { bg: 'bg-yellow-400', text: 'text-black', glow: 'grade-glow-gold' }
  if (grade >= 7) return { bg: 'bg-green-500', text: 'text-white', glow: 'grade-glow-green' }
  if (grade >= 5) return { bg: 'bg-yellow-500', text: 'text-black', glow: 'grade-glow-yellow' }
  return { bg: 'bg-red-600', text: 'text-white', glow: 'grade-glow-red' }
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs font-bold',
  md: 'w-10 h-10 text-sm font-bold',
  lg: 'w-14 h-14 text-lg font-black',
  xl: 'w-20 h-20 text-2xl font-black',
}

export default function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  const { bg, text, glow } = getGradeColor(grade)
  return (
    <div
      className={`${sizeClasses[size]} ${bg} ${text} ${glow} rounded-full flex items-center justify-center border-2 border-white/20`}
    >
      {grade % 1 === 0 ? grade : grade.toFixed(1)}
    </div>
  )
}

export { getGradeColor }
