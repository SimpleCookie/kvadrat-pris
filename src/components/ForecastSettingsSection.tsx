import { Tooltip } from './Tooltip'
import { type ForecastSettings } from '../hooks/useForecastSettings'
import { type T } from '../lib/i18n'

type Props = {
  settings: ForecastSettings
  onSettingChange: <K extends keyof ForecastSettings>(key: K, value: ForecastSettings[K]) => void
  t: T
}

export const ForecastSettingsSection = ({ settings, onSettingChange, t }: Props) => (
  <section className="fees-section">
    <fieldset className="fees-fieldset">
      <legend className="fees-legend">{t.settingsLegend}</legend>
      <div className="forecast-settings-grid">
        <div className="forecast-settings-field">
          <span className="forecast-settings-label">
            <label htmlFor="billable-hours">{t.billableHours}</label>
            <Tooltip content={t.billableHoursTooltip} ariaLabel={t.billableHoursAria} />
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
              aria-label={t.billableHoursAria}
            />
            <span className="fee-unit">h</span>
          </div>
          <p className="price-hint">{t.billableHoursHint}</p>
        </div>
        <div className="forecast-settings-field">
          <span className="forecast-settings-label">
            <label htmlFor="monthly-salary">{t.monthlySalary}</label>
            <Tooltip content={t.monthlySalaryTooltip} ariaLabel={t.monthlySalaryAria} />
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
              aria-label={t.monthlySalaryAria}
            />
            <span className="fee-unit">kr</span>
          </div>
        </div>
        <div className="forecast-settings-field">
          <span className="forecast-settings-label">
            <label htmlFor="pension">{t.pension}</label>
            <Tooltip content={t.pensionTooltip} ariaLabel={t.pensionAria} />
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
              aria-label={t.pensionAria}
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
            <label htmlFor="overhead">{t.overheadLabel}</label>
            <Tooltip content={t.overheadTooltip} ariaLabel={t.overheadAria} />
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
              aria-label={t.overheadAria}
            />
            <span className="fee-unit">kr</span>
          </div>
        </div>
        <div className="forecast-settings-field">
          <label htmlFor="kommunalskatt" className="forecast-settings-label">{t.municipalTax}</label>
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
              aria-label={t.municipalTaxAria}
            />
            <span className="fee-unit">%</span>
          </div>
        </div>
      </div>
    </fieldset>
  </section>
)
