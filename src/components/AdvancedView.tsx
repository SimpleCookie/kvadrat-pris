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
      {/* ── Forecast settings ────────────────────────────────────────── */}
      <section className="fees-section">
        <fieldset className="fees-fieldset">
          <legend className="fees-legend">Prognos — inställningar</legend>

          <div className="fee-row">
            <label htmlFor="billable-hours" className="fee-label">
              Fakturerbara timmar/år
              <span
                className="fee-tooltip"
                data-tooltip="Räkna bort semester, helgdagar och intern tid. Standard: 40h × 40v = 1 600 h."
                aria-label="Räkna bort semester, helgdagar och intern tid. Standard: 40h × 40v = 1 600 h."
              >?</span>
            </label>
            <div className="fee-input-wrap">
              <input
                id="billable-hours"
                type="number"
                inputMode="numeric"
                min={0}
                max={3000}
                step={40}
                className="fee-input fee-input--wide"
                value={billableHours}
                onChange={(e) => setBillableHours(e.target.value)}
                aria-label="Fakturerbara timmar per år"
              />
              <span className="fee-unit">h</span>
            </div>
          </div>

          <div className="fee-row">
            <label htmlFor="monthly-salary" className="fee-label">
              Månadslön (brutto)
              <span
                className="fee-tooltip"
                data-tooltip="Statlig skattebrytpunkt 2026: ~643 100 kr/år ≈ 53 600 kr/mån. Lön över detta beskattas hårdare."
                aria-label="Statlig skattebrytpunkt 2026: ~643 100 kr/år ≈ 53 600 kr/mån. Lön över detta beskattas hårdare."
              >?</span>
            </label>
            <div className="fee-input-wrap">
              <input
                id="monthly-salary"
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                className="fee-input fee-input--wide"
                value={monthlySalary}
                onChange={(e) => setMonthlySalary(e.target.value)}
                aria-label="Månadslön i kronor brutto"
              />
              <span className="fee-unit">kr</span>
            </div>
          </div>

          <div className="fee-row">
            <label htmlFor="overhead" className="fee-label">
              Overhead/år
              <span
                className="fee-tooltip"
                data-tooltip="Bokföring, försäkring, utrustning, programvaror m.m."
                aria-label="Bokföring, försäkring, utrustning, programvaror m.m."
              >?</span>
            </label>
            <div className="fee-input-wrap">
              <input
                id="overhead"
                type="number"
                inputMode="numeric"
                min={0}
                step={1000}
                className="fee-input fee-input--wide"
                value={overhead}
                onChange={(e) => setOverhead(e.target.value)}
                aria-label="Overheadkostnader per år i kronor"
              />
              <span className="fee-unit">kr</span>
            </div>
          </div>

          <div className="fee-row">
            <label htmlFor="kommunalskatt" className="fee-label">
              Kommunalskatt
            </label>
            <div className="fee-input-wrap">
              <input
                id="kommunalskatt"
                type="number"
                inputMode="decimal"
                min={0}
                max={40}
                step={0.1}
                className="fee-input"
                value={kommunalskatt}
                onChange={(e) => setKommunalskatt(e.target.value)}
                aria-label="Kommunalskatt i procent"
              />
              <span className="fee-unit">%</span>
            </div>
          </div>
        </fieldset>
      </section>

      {/* ── Company breakdown ─────────────────────────────────────────── */}
      {hasRate && (
        <section className="breakdown-section">
          <h2 className="breakdown-title">Bolaget — per år</h2>
          <div className="breakdown-rows">
            <div className="breakdown-row">
              <span>Intäkter ({inputs.billableHoursPerYear.toLocaleString('sv-SE')} h × {formatSEK(consultantRatePerHour)})</span>
              <span className="breakdown-value">{formatSEK(r.grossRevenue)}</span>
            </div>
            <div className="breakdown-row breakdown-deduction">
              <span>Overhead</span>
              <span className="breakdown-value">−{formatSEK(r.overhead)}</span>
            </div>
            <div className="breakdown-row breakdown-deduction">
              <span>Lön brutto ({inputs.monthlySalaryGross.toLocaleString('sv-SE')} kr/mån)</span>
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
                      data-tooltip={`Förenklingsregeln: max ${formatSEK(SCHABLONBELOPP)}/år beskattas med 20% (3:12). Överskott stannar i bolaget.`}
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
        </section>
      )}

      {/* ── Personal breakdown ────────────────────────────────────────── */}
      {hasRate && (
        <section className="breakdown-section">
          <h2 className="breakdown-title">Du — per år</h2>
          <div className="breakdown-rows">
            <div className="breakdown-row">
              <span>Lön brutto</span>
              <span className="breakdown-value">{formatSEK(r.salaryGross)}</span>
            </div>
            <div className="breakdown-row breakdown-deduction">
              <span>Kommunalskatt ({kommunalskatt}%)</span>
              <span className="breakdown-value">−{formatSEK(r.incomeTaxOnSalary)}</span>
            </div>
            <div className="breakdown-row breakdown-sub-total">
              <span>Nettolön</span>
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
            <div className="forecast-monthly-highlight">
              <span className="forecast-monthly-label">Snitt per månad</span>
              <span className="forecast-monthly-value">{formatSEK(r.totalTakeHomeMonth)}</span>
            </div>
          </div>
          <p className="forecast-disclaimer">
            * Beräknat med kommunalskatt utan jobbskatteavdrag. Förenklingsregeln antagen för utdelning.
          </p>
        </section>
      )}
    </>
  )
}
