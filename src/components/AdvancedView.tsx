import {
  calculateForecast,
  calculateEquivalentEmployeeGross,
  SCHABLONBELOPP,
  type ForecastInputs,
} from '../lib/forecast'
import { formatSEK } from '../lib/pricing'
import { type T } from '../lib/i18n'

type Props = ForecastInputs & {
  kvadratCutPerHour?: number
  t: T
}

export const AdvancedView = (props: Props) => {
  const r = calculateForecast(props)
  const { consultantRatePerHour, billableHoursPerYear, monthlySalaryGross, kommunalskatt, kvadratCutPerHour, t } = props

  const equivGrossYear = calculateEquivalentEmployeeGross(r.totalTakeHomeYear, kommunalskatt)
  const equivGrossMonth = Math.round(equivGrossYear / 12)

  if (!consultantRatePerHour) {
    return (
      <div className="forecast-empty">
        {t.enterPrice}
      </div>
    )
  }

  return (
    <section className="breakdown-section forecast-results">

      {/* Context line */}
      <p className="forecast-context">
        {billableHoursPerYear.toLocaleString('sv-SE')} h
        &nbsp;×&nbsp;{formatSEK(consultantRatePerHour)}
        &nbsp;=&nbsp;<strong>{formatSEK(r.grossRevenue)}{t.perYearGross}</strong>
      </p>
      {kvadratCutPerHour != null && kvadratCutPerHour > 0 && (
        <p className="forecast-context forecast-kvadrat-cut">
          {t.kvadratShareLabel}{' '}
          <strong>{formatSEK(kvadratCutPerHour * billableHoursPerYear)}{t.perYear}</strong>
          {' '}({kvadratCutPerHour.toLocaleString('sv-SE')} kr/h)
        </p>
      )}

      {/* ── Bolaget ── */}
      <div className="forecast-block">
        <h2 className="forecast-block-title">{t.companyBlock}</h2>
        <div className="breakdown-rows">
          <div className="breakdown-row">
            <span>{t.grossRevenue}</span>
            <span className="breakdown-value">{formatSEK(r.grossRevenue)}</span>
          </div>
          <div className="breakdown-row breakdown-deduction">
            <span>{t.overheadRow}</span>
            <span className="breakdown-value">−{formatSEK(r.overhead)}</span>
          </div>
          <div className="breakdown-row breakdown-deduction">
            <span>{t.salaryGrossRow(monthlySalaryGross.toLocaleString('sv-SE'))}</span>
            <span className="breakdown-value">−{formatSEK(r.salaryGross)}</span>
          </div>
          <div className="breakdown-row breakdown-deduction">
            <span>{t.socialFees}</span>
            <span className="breakdown-value">−{formatSEK(r.socialFees)}</span>
          </div>
          <div className={`breakdown-row breakdown-sub-total${r.preTaxProfit < 0 ? ' breakdown-deduction' : ''}`}>
            <span>{t.preTaxProfit}</span>
            <span className="breakdown-value">
              {r.preTaxProfit < 0 ? '−' : ''}{formatSEK(Math.abs(r.preTaxProfit))}
            </span>
          </div>

          {r.preTaxProfit > 0 && (
            <>
              <div className="breakdown-row breakdown-deduction">
                <span>{t.corporateTax}</span>
                <span className="breakdown-value">−{formatSEK(r.corporateTax)}</span>
              </div>
              <div className="breakdown-row breakdown-sub-total">
                <span>{t.profitAfterTax}</span>
                <span className="breakdown-value">{formatSEK(r.profitAfterTax)}</span>
              </div>
              <div className="breakdown-row breakdown-deduction">
                <span>
                  {t.dividend}
                  <span
                    className="fee-tooltip"
                    data-tooltip={t.dividendTooltip(formatSEK(SCHABLONBELOPP))}
                    aria-label={t.dividendTooltip(formatSEK(SCHABLONBELOPP))}
                  >?</span>
                </span>
                <span className="breakdown-value">−{formatSEK(r.dividendGross)}</span>
              </div>
              <div className="breakdown-row breakdown-deduction">
                <span>{t.dividendTax}</span>
                <span className="breakdown-value">−{formatSEK(r.dividendTax)}</span>
              </div>
              {r.retainedInCompany > 0 && (
                <div className="breakdown-row forecast-retained">
                  <span>
                    {t.retainedLabel}
                    <span
                      className="fee-tooltip"
                      data-tooltip={t.retainedTooltip}
                      aria-label={t.retainedAriaLabel}
                    >?</span>
                    <span className="forecast-retained-note">{t.retainedNote}</span>
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
        <h2 className="forecast-block-title">{t.youBlock}</h2>
        <div className="breakdown-rows">
          <div className="breakdown-row">
            <span>{t.netSalaryYear}</span>
            <span className="breakdown-value">{formatSEK(r.salaryNet)}</span>
          </div>
          {r.dividendNet > 0 && (
            <div className="breakdown-row forecast-dividend">
              <span>{t.netDividend}</span>
              <span className="breakdown-value">{formatSEK(r.dividendNet)}</span>
            </div>
          )}
          <div className="breakdown-row breakdown-total">
            <span>{t.netPerYear}</span>
            <span className="breakdown-value">{formatSEK(r.totalTakeHomeYear)}</span>
          </div>
        </div>

        <div className="forecast-monthly-card">
          <span className="forecast-monthly-card-label">{t.netPerMonth}</span>
          <span className="forecast-monthly-card-amount">{formatSEK(r.totalTakeHomeMonth)}</span>
        </div>
      </div>

      {/* ── Som anställd ── */}
      <div className="forecast-block forecast-block-comparison">
        <h2 className="forecast-block-title">
          {t.employeeBlock}
          <span
            className="fee-tooltip"
            data-tooltip={t.employeeTooltip}
            aria-label={t.employeeAriaLabel}
          >?</span>
        </h2>
        <p className="forecast-comparison-text">
          {t.employeeComparisonText(`${formatSEK(equivGrossMonth)}/mån`)}
        </p>
      </div>

      <p className="forecast-disclaimer">
        {t.disclaimer(kommunalskatt)}
      </p>
    </section>
  )
}
