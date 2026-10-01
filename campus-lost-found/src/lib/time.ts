export function relativeTime(dateStr: string): string {
  const now = Date.now()
  const t = new Date(dateStr).getTime()
  const diff = Math.floor((now - t) / 1000) // 秒

  if (diff < 60) return '刚刚'
  if (diff < 3600) return Math.floor(diff / 60) + ' 分钟前'
  if (diff < 86400) return Math.floor(diff / 3600) + ' 小时前'
  if (diff < 2592000) return Math.floor(diff / 86400) + ' 天前'
  return new Date(dateStr).toLocaleDateString()
}