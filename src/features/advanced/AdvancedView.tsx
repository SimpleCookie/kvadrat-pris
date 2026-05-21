import { useAppStore } from '../../store/useAppStore'
import { usePricingDerived, usePensionPerMonth } from '../../store/useDerived'
import { PricesSection } from '../../components/PricesSection'
import { FeesSection } from '../../components/FeesSection'
import { ForecastSettingsSection } from './ForecastSettingsSection'
import { ForecastResults } from './ForecastResults'

export const AdvancedView = () => {
  const { activeField, activeValue, kvadratFee, middlemanFee, billableHours, monthlySalary, overhead, kommunalskatt, pensionMode, pensionValue, setPrice, setActiveField, setKvadratFee, setMiddlemanFee, updateSetting } = useAppStore()
  const derived = usePricingDerived()
  const pensionPerMonth = usePensionPerMonth()
  const settings = { billableHours, monthlySalary, overhead, kommunalskatt, pensionMode, pensionValue }
  return (
    <div className="forecast-layout">
      <div className="forecast-layout-left">
        <PricesSection
          activeField={activeField}
          activeValue={activeValue}
          consultantPrice={derived.consultantPrice}
          clientPrice={derived.clientPrice}
          onPriceChange={setPrice}
          onFieldFocus={setActiveField}
        />
        <FeesSection
          kvadratFee={kvadratFee}
          middlemanFee={middlemanFee}
          onKvadratChange={setKvadratFee}
          onMiddlemanChange={setMiddlemanFee}
        />
        <ForecastSettingsSection settings={settings} onSettingChange={updateSetting} />
      </div>
      <div className="forecast-layout-right">
        <ForecastResults
          consultantRatePerHour={derived.consultantPrice}
          billableHoursPerYear={parseInt(billableHours) || 0}
          monthlySalaryGross={parseInt(monthlySalary) || 0}
          overheadPerYear={parseInt(overhead) || 0}
          kommunalskatt={parseFloat(kommunalskatt) || 0}
          kvadratCutPerHour={derived.kvadratCut}
          pensionPerMonth={pensionPerMonth}
        />
      </div>
    </div>
  )
}
