import { calculateForecast } from '../../lib/forecast'
import { type UsePricingStateResult } from '../../hooks/usePricingState'
import { type UseForecastSettingsResult } from '../../hooks/useForecastSettings'
import { type T } from '../../lib/i18n'
import { RunwayCard } from './RunwayCard'
import { BreakEvenExplorer } from './BreakEvenExplorer'

type Props = {
  pricing: UsePricingStateResult
  forecast: UseForecastSettingsResult
  t: T
}

export const FutureView = ({ pricing, forecast, t }: Props) => {
  const { settings, pensionPerMonth } = forecast
  const forecastInputs = {
    consultantRatePerHour: pricing.derived.consultantPrice,
    billableHoursPerYear: parseInt(settings.billableHours) || 0,
    monthlySalaryGross: parseInt(settings.monthlySalary) || 0,
    overheadPerYear: parseInt(settings.overhead) || 0,
    kommunalskatt: parseFloat(settings.kommunalskatt) || 0,
  }
  const forecastResult = calculateForecast(forecastInputs)

  return (
    <section className="future-section">
      <RunwayCard
        monthlySalaryGross={forecastInputs.monthlySalaryGross}
        overheadPerYear={forecastInputs.overheadPerYear}
        pensionPerMonth={pensionPerMonth}
        retainedInCompany={forecastResult.retainedInCompany}
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
