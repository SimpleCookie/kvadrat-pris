import { Tooltip } from '../../components/Tooltip'
import { type ForecastSettings } from '../../store/useAppStore'
import { useTranslations } from '../../store/useDerived'

type Props = {
  settings: ForecastSettings
  onSettingChange: <K extends keyof ForecastSettings>(key: K, value: ForecastSettings[K]) => void
}

export const ForecastSettingsSection = ({ settings, onSettingChange }: Props) => {
  const strings = useTranslations()
  return (
  <section className="fees-section">
    <fieldset className="fees-fieldset">
      <legend className="fees-legend">{strings.settingsLegend}</legend>
      <div className="forecast-settings-grid">
        <div className="forecast-settings-field">
          <span className="forecast-settings-label">
            <label htmlFor="billable-hours">{strings.billableHours}</label>
            <Tooltip content={strings.billableHoursTooltip} ariaLabel={strings.billableHoursAria} />
          </span>
          <div className="forecast-settings-input-wrap">
            <input
              id="billable-hours"
              type="number"
              inputMode="numeric"
              min={0}
              max={3000}
              step={40}
              className="forecast-settings-input"
              value={settings.billableHours}
              onChange={(e) => onSettingChange('billableHours', e.target.value)}
              aria-label={strings.billableHoursAria}
            />
            <span className="fee-unit">h</span>
          </div>
          <p className="price-hint">{strings.billableHoursHint}</p>
        </div>
        <div className="forecast-settings-field">
          <span className="forecast-settings-label">
            <label htmlFor="monthly-salary">{strings.monthlySalary}</label>
            <Tooltip content={strings.monthlySalaryTooltip} ariaLabel={strings.monthlySalaryAria} />
          </span>
          <div className="forecast-settings-input-wrap">
            <input
              id="monthly-salary"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              className="forecast-settings-input"
              value={settings.monthlySalary}
              onChange={(e) => onSettingChange('monthlySalary', e.target.value)}
              aria-label={strings.monthlySalaryAria}
            />
            <span className="fee-unit">kr</span>
          </div>
        </div>
        <div className="forecast-settings-field">
          <span className="forecast-settings-label">
            <label htmlFor="pension">{strings.pension}</label>
            <Tooltip content={strings.pensionTooltip} ariaLabel={strings.pensionAria} />
          </span>
          <div className="forecast-settings-input-wrap">
            <input
              id="pension"
              type="number"
              inputMode="decimal"
              min={0}
              step={settings.pensionMode === 'percent' ? 0.5 : 500}
              max={settings.pensionMode === 'percent' ? 100 : 100000}
              className="forecast-settings-input"
              value={settings.pensionValue}
              onChange={(e) => onSettingChange('pensionValue', e.target.value)}
              aria-label={strings.pensionAria}
            />
            <div className="pension-mode-toggle" role="group" aria-label="Pension unit">
              <button
                type="button"
                className={`pension-mode-btn${settings.pensionMode === 'percent' ? ' pension-mode-btn-active' : ''}`}
                onClick={() => onSettingChange('pensionMode', 'percent')}
              >%</button>
              <button
                type="button"
                className={`pension-mode-btn${settings.pensionMode === 'fixed' ? ' pension-mode-btn-active' : ''}`}
                onClick={() => onSettingChange('pensionMode', 'fixed')}
              >kr</button>
            </div>
          </div>
        </div>
        <div className="forecast-settings-field">
          <span className="forecast-settings-label">
            <label htmlFor="overhead">{strings.overheadLabel}</label>
            <Tooltip content={strings.overheadTooltip} ariaLabel={strings.overheadAria} />
          </span>
          <div className="forecast-settings-input-wrap">
            <input
              id="overhead"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              className="forecast-settings-input"
              value={settings.overhead}
              onChange={(e) => onSettingChange('overhead', e.target.value)}
              aria-label={strings.overheadAria}
            />
            <span className="fee-unit">kr</span>
          </div>
        </div>
        <div className="forecast-settings-field">
          <label htmlFor="kommunalskatt" className="forecast-settings-label">{strings.municipalTax}</label>
          <div className="forecast-settings-input-wrap">
            <input
              id="kommunalskatt"
              type="number"
              inputMode="decimal"
              min={0}
              max={40}
              step={0.1}
              className="forecast-settings-input"
              value={settings.kommunalskatt}
              onChange={(e) => onSettingChange('kommunalskatt', e.target.value)}
              aria-label={strings.municipalTaxAria}
            />
            <span className="fee-unit">%</span>
          </div>
        </div>
      </div>
    </fieldset>
  </section>
  )
}
