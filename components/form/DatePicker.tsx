import { addDays, addMonths, parse } from 'date-fns'
import { getDirection } from 'pages/_app'
import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { useIntl } from 'react-intl'
import OutsideClickHandler from 'react-outside-click-handler'

import ar from 'date-fns/locale/ar'
import de from 'date-fns/locale/de'
import en from 'date-fns/locale/en-US'
import es from 'date-fns/locale/es'
import fa from 'date-fns/locale/fa-IR'
import fr from 'date-fns/locale/fr'
import is from 'date-fns/locale/is'
import pt from 'date-fns/locale/pt'
import ru from 'date-fns/locale/ru'
import th from 'date-fns/locale/th'
import tr from 'date-fns/locale/tr'
import vi from 'date-fns/locale/vi'
import zh from 'date-fns/locale/zh-CN'
import zhHant from 'date-fns/locale/zh-HK'

const getDateFnsLocale = (locale: string) => {
  switch (locale) {
    case 'de':
      return de
    case 'es':
      return es
    case 'fa':
      return fa
    case 'ar':
      return ar
    case 'fr':
      return fr
    case 'is':
      return is
    case 'pt-BR':
      return pt
    case 'ru':
      return ru
    case 'tr':
      return tr
    case 'th':
      return th
    case 'vi':
      return vi
    case 'zh-CN':
      return zh
    case 'zh-Hant':
      return zhHant
    default:
      return en
  }
}

const ranges = ['OneWeek', 'OneMonth', 'SixMonths']

type DatePickerProps = {
  handleRangeSelect: (date: Date | undefined) => void
  initialDate: string
  close: () => void
}

const DatePicker = ({
  handleRangeSelect,
  initialDate,
  close,
  ...props
}: DatePickerProps) => {
  const intl = useIntl()
  const tomorrow = addDays(new Date(), 1)

  const selectRange = (range: (typeof ranges)[number]) => {
    switch (range) {
      case 'OneWeek':
        handleRangeSelect(addDays(new Date(), 7))
        break
      case 'OneMonth':
        handleRangeSelect(addMonths(new Date(), 1))
        break
      case 'SixMonths':
        handleRangeSelect(addMonths(new Date(), 6))
        break
    }
  }

  const rangesList = ranges.map((range) => (
    <button
      type="button"
      className="btn btn-dark-hollow btn-sm"
      key={range}
      onClick={(e: Event) => {
        e.preventDefault()
        selectRange(range)
      }}
    >
      {intl.formatMessage({ id: `DateRange.${range}` })}
    </button>
  ))

  const [date] = useState<Date | undefined>(
    initialDate ? parse(initialDate, 'yyyy-MM-dd', new Date()) : undefined,
  )

  return (
    <div className="relative">
      <div className="z-[6666] absolute max-w-[320px] bg-white border border-gray-200 rounded-md">
        <OutsideClickHandler onOutsideClick={() => close()}>
          <div className="flex gap-1 mt-2 mx-2 mb-0 flex-wrap">
            {rangesList}
          </div>
          <DayPicker
            {...props}
            dir={getDirection(intl.locale)}
            // locale={getDateFnsLocale(intl.locale)}
            startMonth={tomorrow}
            mode="single"
            disabled={{ before: tomorrow }}
            selected={date}
            onSelect={handleRangeSelect}
            className="mt-3 mx-2"
            classNames={{
              root: 'text-gray-800 px-1',
              weekday: 'w-10 h-10 font-semibold text-sm uppercase',
              caption_label: 'text-lg font-semibold px-2 mb-2',
              selected: 'rounded-full bg-blue-500 text-white',
              day_button: 'disabled:text-gray-300 rounded-full w-10 h-10',
              button_previous: 'disabled:opacity-30',
            }}
          />
        </OutsideClickHandler>
      </div>
    </div>
  )
}

export default DatePicker
