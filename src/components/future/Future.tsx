import { calculateForecast, type ForecastInputs } from '../../lib/forecast'
import { type T } from '../../lib/i18n'
import { RunwayCard } from './RunwayCard'
import { BreakEvenExplorer } from './BreakEvenExplorer'

type Props = ForecastInputs & { pensionPerMonth: number; t: T }

export const Future = (props: Props) => {
  const { pensionPerMonth, t, ...forecastInputs } = props
  const forecast = calculateForecast(forecastInputs)

  return (
    <section className="future-section">
      <RunwayCard
        monthlySalaryGross={forecastInputs.monthlySalaryGross}
        overheadPerYear={forecastInputs.overheadPerYear}
        pensionPerMonth={pensionPerMonth}
        retainedInCompany={forecast.retainedInCompany}
        t={t}
      />
      <BreakEvenExplorer
        monthlySalaryGross={forecastInputs.monthlySalaryGross}
        overheadPerYear={forecastInputs.overheadPerYear}
        pensionPerMonth={pensionPerMonth}
        initialHours={forecastInputs.billableHoursPerYear}
        initialPrice={forecastInputs.consultantRatePerHour}
        t={t}
      />
    </section>
  )
}
