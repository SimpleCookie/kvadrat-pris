import { PricesSection } from '../../components/PricesSection'
import { FeesSection } from '../../components/FeesSection'
import { ForecastSettingsSection } from './ForecastSettingsSection'
import { ForecastResults } from './ForecastResults'
import { type UsePricingStateResult } from '../../hooks/usePricingState'
import { type UseForecastSettingsResult } from '../../hooks/useForecastSettings'
import { type T } from '../../lib/i18n'

type Props = {
  pricing: UsePricingStateResult
  forecast: UseForecastSettingsResult
  t: T
}

export const AdvancedView = ({ pricing, forecast, t }: Props) => {
  const { state, derived, dispatch } = pricing
  const { settings, updateSetting, pensionPerMonth } = forecast
  return (
    <div className="forecast-layout">
      <div className="forecast-layout-left">
        <PricesSection
          activeField={state.activeField}
          activeValue={state.activeValue}
          consultantPrice={derived.consultantPrice}
          clientPrice={derived.clientPrice}
          onPriceChange={(field, value) => dispatch({ type: 'SET_PRICE', field, value })}
          onFieldFocus={(field) => dispatch({ type: 'SET_ACTIVE_FIELD', field })}
          t={t}
        />
        <FeesSection
          kvadratFee={state.kvadratFee}
          middlemanFee={state.middlemanFee}
          onKvadratChange={(value) => dispatch({ type: 'SET_KVADRAT_FEE', value })}
          onMiddlemanChange={(value) => dispatch({ type: 'SET_MIDDLEMAN_FEE', value })}
          t={t}
        />
        <ForecastSettingsSection settings={settings} onSettingChange={updateSetting} t={t} />
      </div>
      <div className="forecast-layout-right">
        <ForecastResults
          consultantRatePerHour={derived.consultantPrice}
          billableHoursPerYear={parseInt(settings.billableHours) || 0}
          monthlySalaryGross={parseInt(settings.monthlySalary) || 0}
          overheadPerYear={parseInt(settings.overhead) || 0}
          kommunalskatt={parseFloat(settings.kommunalskatt) || 0}
          kvadratCutPerHour={derived.kvadratCut}
          pensionPerMonth={pensionPerMonth}
          t={t}
        />
      </div>
    </div>
  )
}
