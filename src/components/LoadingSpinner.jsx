export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-dark-950">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 dark:border-dark-700 rounded-full animate-spin border-t-primary-500 dark:border-t-primary-400" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-spin border-b-accent-500" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <p className="mt-6 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
        Loading EduFlow...
      </p>
    </div>
  );
}
