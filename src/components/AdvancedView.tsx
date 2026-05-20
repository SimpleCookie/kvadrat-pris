import {
  calculateForecast,
  calculateEquivalentEmployeeGross,
  SCHABLONBELOPP,
  SOCIAL_FEE_RATE,
  type ForecastInputs,
} from '../lib/forecast'
import { formatSEK } from '../lib/pricing'

type Props = ForecastInputs

export const AdvancedView = (props: Props) => {
  const r = calculateForecast(props)
  const { consultantRatePerHour, billableHoursPerYear, monthlySalaryGross, kommunalskatt } = props

  const equivGrossYear = calculateEquivalentEmployeeGross(r.totalTakeHomeYear, kommunalskatt)
  const equivGrossMonth = Math.round(equivGrossYear / 12)
  const equivEmployerCostYear = Math.round(equivGrossYear * (1 + SOCIAL_FEE_RATE))
  const equivEmployerCostMonth = Math.round(equivEmployerCostYear / 12)

  if (!consultantRatePerHour) {
    return (
      <div className="forecast-empty">
        Ange ett konsultpris i fältet till vänster.
      </div>
    )
  }

  return (
    <section className="breakdown-section forecast-results">

      {/* Context line */}
      <p className="forecast-context">
        {billableHoursPerYear.toLocaleString('sv-SE')} h
        &nbsp;×&nbsp;{formatSEK(consultantRatePerHour)}
        &nbsp;=&nbsp;<strong>{formatSEK(r.grossRevenue)}/år (brutto)</strong>
      </p>

      {/* ── Bolaget ── */}
      <div className="forecast-block">
        <h2 className="forecast-block-title">Bolaget</h2>
        <div className="breakdown-rows">
          <div className="breakdown-row">
            <span>Intäkter (brutto)</span>
            <span className="breakdown-value">{formatSEK(r.grossRevenue)}</span>
          </div>
          <div className="breakdown-row breakdown-deduction">
            <span>Overhead</span>
            <span className="breakdown-value">−{formatSEK(r.overhead)}</span>
          </div>
          <div className="breakdown-row breakdown-deduction">
            <span>Lön brutto ({monthlySalaryGross.toLocaleString('sv-SE')} kr/mån)</span>
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
                  <span>
                    Kvar i bolaget
                    <span
                      className="fee-tooltip"
                      data-tooltip="Dina pengar — kan tas ut som framtida lön eller utdelning när det passar."
                      aria-label="Dina pengar — kan tas ut som framtida lön eller utdelning"
                    >?</span>
                    <span className="forecast-retained-note">dina pengar</span>
                  </span>
                  <span className="breakdown-value">{formatSEK(r.retainedInCompany)}</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Du ── */}
      <div className="forecast-block">
        <h2 className="forecast-block-title">Du — netto</h2>
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
            <span>Netto per år</span>
            <span className="breakdown-value">{formatSEK(r.totalTakeHomeYear)}</span>
          </div>
        </div>

        <div className="forecast-monthly-card">
          <span className="forecast-monthly-card-label">Netto per månad</span>
          <span className="forecast-monthly-card-amount">{formatSEK(r.totalTakeHomeMonth)}</span>
        </div>
      </div>

      {/* ── Som anstÃ¤lld ── */}
      <div className="forecast-block forecast-block-comparison">
        <h2 className="forecast-block-title">
          Som anställd — jämförelse
          <span
            className="fee-tooltip"
            data-tooltip="Bruttolön som krävs för att en anställd ska nå samma nettoinkomst. Utan jobbskatteavdrag (reell lön är något lägre)."
            aria-label="Jämförelse med anställd"
          >?</span>
        </h2>
        <div className="breakdown-rows">
          <div className="breakdown-row">
            <span>Bruttolön / år</span>
            <span className="breakdown-value">{formatSEK(equivGrossYear)}</span>
          </div>
          <div className="breakdown-row breakdown-sub-total">
            <span>per månad</span>
            <span className="breakdown-value">{formatSEK(equivGrossMonth)}</span>
          </div>
          <div className="breakdown-row" style={{ marginTop: '0.75rem' }}>
            <span>
              Arbetsgivarkostnad / år
              <span
                className="fee-tooltip"
                data-tooltip="Bruttolön + arbetsgivaravgift (31,42%). Vad arbetsgivaren betalar totalt."
                aria-label="Arbetsgivarkostnad inklusive arbetsgivaravgift"
              >?</span>
            </span>
            <span className="breakdown-value">{formatSEK(equivEmployerCostYear)}</span>
          </div>
          <div className="breakdown-row breakdown-sub-total">
            <span>per månad</span>
            <span className="breakdown-value">{formatSEK(equivEmployerCostMonth)}</span>
          </div>
        </div>
      </div>

      <p className="forecast-disclaimer">
        * Netto = efter kommunalskatt ({kommunalskatt}%) och utdelningsskatt.
        Jobbskatteavdrag ej inräknat. Förenklingsregeln antagen för utdelning.
      </p>
    </section>
  )
}
