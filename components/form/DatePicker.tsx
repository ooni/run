import { addDays, addMonths, parse } from "date-fns"
import { Button } from "ooni-components"
import { getDirection } from "pages/_app"
import { useState } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"
import { useIntl } from "react-intl"
import OutsideClickHandler from "react-outside-click-handler"
import styled from "styled-components"

import ar from "date-fns/locale/ar"
import de from "date-fns/locale/de"
import en from "date-fns/locale/en-US"
import es from "date-fns/locale/es"
import fa from "date-fns/locale/fa-IR"
import fr from "date-fns/locale/fr"
import is from "date-fns/locale/is"
import pt from "date-fns/locale/pt"
import ru from "date-fns/locale/ru"
import th from "date-fns/locale/th"
import tr from "date-fns/locale/tr"
import vi from "date-fns/locale/vi"
import zh from "date-fns/locale/zh-CN"
import zhHant from "date-fns/locale/zh-HK"
import { Box } from "ooni-components"

const StyledDatetime = styled.div`
z-index: 99999;
position: absolute;
background-color: #ffffff;
border-radius: 8px;
border-width: 0px 1px 1px 1px;
border-style: solid;
border-color: ${(props) => props.theme.colors.gray2};

.rdp-cell {
  padding: 2px 0;
}

.rdp-day_selected:not([disabled]),
.rdp-day_selected:focus:not([disabled]),
.rdp-day_selected:active:not([disabled]),
.rdp-day_selected:hover:not([disabled]) {
  background-color: ${(props) => props.theme.colors.blue5};
}
`

const StyledRangeButtons = styled.div`
margin: 1em 1em 0;
display: flex;
gap: 6px;
flex-wrap: wrap;
`

const StyledFooter = styled(Box).attrs({ mb: 3, mx: 3 })`
display: flex;
justify-content: space-between;
`

const getDateFnsLocale = (locale: string) => {
  switch (locale) {
    case "de":
      return de
    case "es":
      return es
    case "fa":
      return fa
    case "ar":
      return ar
    case "fr":
      return fr
    case "is":
      return is
    case "pt-BR":
      return pt
    case "ru":
      return ru
    case "tr":
      return tr
    case "th":
      return th
    case "vi":
      return vi
    case "zh-CN":
      return zh
    case "zh-Hant":
      return zhHant
    default:
      return en
  }
}

const ranges = ["OneWeek", "OneMonth", "SixMonths"]

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
      case "OneWeek":
        handleRangeSelect(addDays(new Date(), 7))
        break
      case "OneMonth":
        handleRangeSelect(addMonths(new Date(), 1))
        break
      case "SixMonths":
        handleRangeSelect(addMonths(new Date(), 6))
        break
    }
  }

  const rangesList = ranges.map((range) => (
    <Button
      hollow
      size="small"
      key={range}
      px={2}
      onClick={(e: Event) => {
        e.preventDefault()
        selectRange(range)
      }}
      color="dark"
    >
      {intl.formatMessage({ id: `DateRange.${range}` })}
    </Button>
  ))

  const [range, setRange] = useState<Date | undefined>(
    initialDate ? parse(initialDate, "yyyy-MM-dd", new Date()) : undefined,
  )

  return (
    <Box sx={{ position: "relative" }}>
      <StyledDatetime>
        <OutsideClickHandler onOutsideClick={() => close()}>
          <StyledRangeButtons>{rangesList}</StyledRangeButtons>
          <DayPicker
            {...props}
            dir={getDirection(intl.locale)}
            // locale={getDateFnsLocale(intl.locale)}
            mode="single"
            fromDate={tomorrow}
            selected={range}
            onSelect={handleRangeSelect}
          />
        </OutsideClickHandler>
      </StyledDatetime>
    </Box>
  )
}

export default DatePicker
