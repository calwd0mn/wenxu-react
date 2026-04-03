export function getFormattedDateTime(
  d: Date = new Date(),
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  const padZero = (num: number) => (num < 10 ? `0${num}` : num.toString())
  const date = new Date(d)

  const year = date.getFullYear()
  const month = padZero(date.getMonth() + 1)
  const day = padZero(date.getDate())
  const hours = padZero(date.getHours())
  const minutes = padZero(date.getMinutes())
  const seconds = padZero(date.getSeconds())

  return format
    .replace('YYYY', year.toString())
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}
