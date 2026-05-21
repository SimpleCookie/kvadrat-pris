import { useAppStore } from '../../store/useAppStore'
import { usePricingDerived, usePensionPerMonth } from '../../store/useDerived'
import { calculateForecast } from '../../lib/forecast'
import { type T } from '../../lib/i18n'
import { RunwayCard } from './RunwayCard'
import { BreakEvenExplorer } from './BreakEvenExplorer'

type Props = { t: T }

export const FutureView = ({ t }: Props) => {
  const { billableHours, monthlySalary, overhead, kommunalskatt } = useAppStore()
  const derived = usePricingDerived()
  const pensionPerMonth = usePensionPerMonth()
  const forecastInputs = {
    consultantRatePerHour: derived.consultantPrice,
    billableHoursPerYear: parseInt(billableHours) || 0,
    monthlySalaryGross: parseInt(monthlySalary) || 0,
    overheadPerYear: parseInt(overhead) || 0,
    kommunalskatt: parseFloat(kommunalskatt) || 0,
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
