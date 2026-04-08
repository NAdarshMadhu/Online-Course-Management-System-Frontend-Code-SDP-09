export default function ProgressBar({ value = 0, size = 'md', showLabel = true, color = 'primary' }) {
  const sizeMap = { sm: 'h-2', md: 'h-3', lg: 'h-4' };
  const colorMap = {
    primary: 'from-primary-500 to-accent-500',
    green: 'from-emerald-400 to-emerald-600',
    blue: 'from-blue-400 to-blue-600',
    orange: 'from-orange-400 to-orange-600',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
          <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{Math.round(value)}%</span>
        </div>
      )}
      <div className={`w-full ${sizeMap[size]} bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden`}>
        <div
          className={`${sizeMap[size]} bg-gradient-to-r ${colorMap[color]} rounded-full transition-all duration-700 ease-out relative`}
          style={{ width: `${Math.min(value, 100)}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse-slow rounded-full" />
        </div>
      </div>
    </div>
  );
}
