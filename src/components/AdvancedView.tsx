import { useState } from 'react'
import {
  calculateForecast,
  DEFAULT_BILLABLE_HOURS,
  DEFAULT_MONTHLY_SALARY,
  DEFAULT_OVERHEAD,
  DEFAULT_KOMMUNALSKATT,
  SCHABLONBELOPP,
} from '../lib/forecast'
import { formatSEK } from '../lib/pricing'

interface Props {
  /** The consultant's hourly rate — what the AB receives from Kvadrat per hour */
  consultantRatePerHour: number
}

export const AdvancedView = ({ consultantRatePerHour }: Props) => {
  const [billableHours, setBillableHours] = useState(String(DEFAULT_BILLABLE_HOURS))
  const [monthlySalary, setMonthlySalary] = useState(String(DEFAULT_MONTHLY_SALARY))
  const [overhead, setOverhead] = useState(String(DEFAULT_OVERHEAD))
  const [kommunalskatt, setKommunalskatt] = useState(String(DEFAULT_KOMMUNALSKATT))

  const inputs = {
    consultantRatePerHour,
    billableHoursPerYear: parseInt(billableHours) || 0,
    monthlySalaryGross: parseInt(monthlySalary) || 0,
    overheadPerYear: parseInt(overhead) || 0,
    kommunalskatt: parseFloat(kommunalskatt) || 0,
  }

  const r = calculateForecast(inputs)
  const hasRate = consultantRatePerHour > 0

  return (
    <>
      {/* ── Settings — 2×2 grid ──────────────────────────────────────── */}
      <section className="fees-section">
        <fieldset className="fees-fieldset">
          <legend className="fees-legend">Inställningar</legend>
          <div className="forecast-settings-grid">

            <div className="forecast-settings-field">
              <label htmlFor="billable-hours" className="forecast-settings-label">
                Timmar/år
                <span
                  className="fee-tooltip"
                  data-tooltip="Räkna bort semester, helgdagar och intern tid. Standard: 40h × 40v = 1 600 h."
                  aria-label="Räkna bort semester, helgdagar och intern tid"
                >?</span>
              </label>
              <div className="forecast-settings-input-wrap">
                <input
                  id="billable-hours"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={3000}
                  step={40}
                  className="forecast-settings-input"
                  value={billableHours}
                  onChange={(e) => setBillableHours(e.target.value)}
                  aria-label="Fakturerbara timmar per år"
                />
                <span className="fee-unit">h</span>
              </div>
            </div>

            <div className="forecast-settings-field">
              <label htmlFor="monthly-salary" className="forecast-settings-label">
                Månadslön
                <span
                  className="fee-tooltip"
                  data-tooltip="Statlig skattebrytpunkt 2026: ~643 100 kr/år ≈ 53 600 kr/mån. Lön över detta beskattas hårdare."
                  aria-label="Statlig skattebrytpunkt 2026: ~643 100 kr/år ≈ 53 600 kr/mån"
                >?</span>
              </label>
              <div className="forecast-settings-input-wrap">
                <input
                  id="monthly-salary"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  className="forecast-settings-input"
                  value={monthlySalary}
                  onChange={(e) => setMonthlySalary(e.target.value)}
                  aria-label="Månadslön i kronor brutto"
                />
                <span className="fee-unit">kr</span>
              </div>
            </div>

            <div className="forecast-settings-field">
              <label htmlFor="overhead" className="forecast-settings-label">
                Overhead/år
                <span
                  className="fee-tooltip"
                  data-tooltip="Bokföring, försäkring, utrustning, programvaror m.m."
                  aria-label="Bokföring, försäkring, utrustning, programvaror m.m."
                >?</span>
              </label>
              <div className="forecast-settings-input-wrap">
                <input
                  id="overhead"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  className="forecast-settings-input"
                  value={overhead}
                  onChange={(e) => setOverhead(e.target.value)}
                  aria-label="Overheadkostnader per år i kronor"
                />
                <span className="fee-unit">kr</span>
              </div>
            </div>

            <div className="forecast-settings-field">
              <label htmlFor="kommunalskatt" className="forecast-settings-label">
                Kommunalskatt
              </label>
              <div className="forecast-settings-input-wrap">
                <input
                  id="kommunalskatt"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={40}
                  step={0.1}
                  className="forecast-settings-input"
                  value={kommunalskatt}
                  onChange={(e) => setKommunalskatt(e.target.value)}
                  aria-label="Kommunalskatt i procent"
                />
                <span className="fee-unit">%</span>
              </div>
            </div>

          </div>
        </fieldset>
      </section>

      {/* ── Results ──────────────────────────────────────────────────── */}
      {hasRate && (
        <section className="breakdown-section forecast-results">

          {/* Context line */}
          <p className="forecast-context">
            {inputs.billableHoursPerYear.toLocaleString('sv-SE')} h
            &nbsp;×&nbsp;{formatSEK(consultantRatePerHour)}
            &nbsp;=&nbsp;<strong>{formatSEK(r.grossRevenue)}/år</strong>
          </p>

          {/* ── Bolaget ── */}
          <div className="forecast-block">
            <h2 className="forecast-block-title">Bolaget</h2>
            <div className="breakdown-rows">
              <div className="breakdown-row">
                <span>Intäkter</span>
                <span className="breakdown-value">{formatSEK(r.grossRevenue)}</span>
              </div>
              <div className="breakdown-row breakdown-deduction">
                <span>Overhead</span>
                <span className="breakdown-value">−{formatSEK(r.overhead)}</span>
              </div>
              <div className="breakdown-row breakdown-deduction">
                <span>Lön brutto</span>
                <span className="breakdown-value">−{formatSEK(r.salaryGross)}</span>
              </div>
              <div className="breakdown-row breakdown-deduction">
                <span>Arbetsgivaravgift (31,42%)</span>
                <span className="breakdown-value">−{formatSEK(r.socialFees)}</span>
              </div>
              <div className={`breakdown-row breakdown-sub-total${r.preTaxProfit < 0 ? ' breakdown-deduction' : ''}`}>
                <span>Vinst före bolagsskatt</span>
                <span className="breakdown-value">
                  {r.preTaxProfit < 0 ? '−' : ''}{formatSEK(Math.abs(r.preTaxProfit))}
                </span>
              </div>

              {r.preTaxProfit > 0 && (
                <>
                  <div className="breakdown-row breakdown-deduction">
                    <span>Bolagsskatt (20,6%)</span>
                    <span className="breakdown-value">−{formatSEK(r.corporateTax)}</span>
                  </div>
                  <div className="breakdown-row breakdown-sub-total">
                    <span>Vinst efter skatt</span>
                    <span className="breakdown-value">{formatSEK(r.profitAfterTax)}</span>
                  </div>
                  <div className="breakdown-row breakdown-deduction">
                    <span>
                      Utdelning
                      <span
                        className="fee-tooltip"
                        data-tooltip={`Förenklingsregeln: max ${formatSEK(SCHABLONBELOPP)}/år beskattas med 20%.`}
                        aria-label="Förenklingsregeln: utdelning inom schablonbelopp beskattas med 20%"
                      >?</span>
                    </span>
                    <span className="breakdown-value">−{formatSEK(r.dividendGross)}</span>
                  </div>
                  <div className="breakdown-row breakdown-deduction">
                    <span>Utdelningsskatt (20%)</span>
                    <span className="breakdown-value">−{formatSEK(r.dividendTax)}</span>
                  </div>
                  {r.retainedInCompany > 0 && (
                    <div className="breakdown-row forecast-retained">
                      <span>Kvar i bolaget</span>
                      <span className="breakdown-value">{formatSEK(r.retainedInCompany)}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ── Du ── */}
          <div className="forecast-block">
            <h2 className="forecast-block-title">Du</h2>
            <div className="breakdown-rows">
              <div className="breakdown-row">
                <span>Nettolön/år</span>
                <span className="breakdown-value">{formatSEK(r.salaryNet)}</span>
              </div>
              {r.dividendNet > 0 && (
                <div className="breakdown-row forecast-dividend">
                  <span>+ Netto utdelning</span>
                  <span className="breakdown-value">{formatSEK(r.dividendNet)}</span>
                </div>
              )}
              <div className="breakdown-row breakdown-total">
                <span>Totalt per år</span>
                <span className="breakdown-value">{formatSEK(r.totalTakeHomeYear)}</span>
              </div>
            </div>

            <div className="forecast-monthly-card">
              <span className="forecast-monthly-card-label">Per månad (snitt)</span>
              <span className="forecast-monthly-card-amount">{formatSEK(r.totalTakeHomeMonth)}</span>
            </div>
          </div>

          <p className="forecast-disclaimer">
            * Kommunalskatt utan jobbskatteavdrag. Förenklingsregeln antagen för utdelning.
          </p>
        </section>
      )}
    </>
  )
}
