export const generateRandomString = () =>
  Math.random().toString(20).substring(2, 18)

export const formatMediumDateTime = (date: string, locale: string) => (
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date))
)
