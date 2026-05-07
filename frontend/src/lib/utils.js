/**
 * Utility function to merge class names conditionally
 * Used for combining Tailwind CSS classes
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}
