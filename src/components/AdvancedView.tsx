import {
  calculateForecast,
  calculateEquivalentEmployeeGross,
  SCHABLONBELOPP,
  type ForecastInputs,
} from '../lib/forecast'
import { formatSEK } from '../lib/pricing'
import { type T } from '../lib/i18n'
import { Tooltip } from './Tooltip'

type Props = ForecastInputs & {
  kvadratCutPerHour?: number
  pensionPerMonth?: number
  t: T
}

export const AdvancedView = (props: Props) => {
  const r = calculateForecast(props)
  const { consultantRatePerHour, billableHoursPerYear, monthlySalaryGross, kommunalskatt, kvadratCutPerHour, pensionPerMonth, t } = props

  const equivGrossYear = calculateEquivalentEmployeeGross(r.totalTakeHomeYear, kommunalskatt)
  const equivGrossMonth = Math.round(equivGrossYear / 12)
  const pensionYear = (pensionPerMonth ?? 0) * 12
  const pensionAdjustedRetained = Math.max(0, r.retainedInCompany - pensionYear)

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
                  <Tooltip
                    content={t.dividendTooltip(formatSEK(SCHABLONBELOPP))}
                    ariaLabel={t.dividendTooltip(formatSEK(SCHABLONBELOPP))}
                  />
                </span>
                <span className="breakdown-value">−{formatSEK(r.dividendGross)}</span>
              </div>
              <div className="breakdown-row breakdown-deduction">
                <span>{t.dividendTax}</span>
                <span className="breakdown-value">−{formatSEK(r.dividendTax)}</span>
              </div>
              {(pensionPerMonth ?? 0) > 0 && (
                <div className="breakdown-row breakdown-deduction">
                  <span>
                    {t.pensionRow}
                    <Tooltip content={t.pensionRowTooltip} ariaLabel={t.pensionRowTooltip} />
                  </span>
                  <span className="breakdown-value">−{formatSEK(pensionYear)}</span>
                </div>
              )}
              {pensionAdjustedRetained > 0 && (
                <div className="breakdown-row forecast-retained">
                  <span>
                    {t.retainedLabel}
                    <Tooltip content={t.retainedTooltip} ariaLabel={t.retainedAriaLabel} />
                    <span className="forecast-retained-note">{t.retainedNote}</span>
                  </span>
                  <span className="breakdown-value">{formatSEK(pensionAdjustedRetained)}</span>
                </div>
              )}
              {(pensionPerMonth ?? 0) > 0 && (
                <div className="breakdown-row forecast-pension-pot">
                  <span>
                    {t.pensionRow}
                    <Tooltip content={t.pensionRowTooltip} ariaLabel={t.pensionRowTooltip} />
                    <span className="forecast-retained-note">{t.pensionSavingsNote}</span>
                  </span>
                  <span className="breakdown-value">{formatSEK(pensionYear)}</span>
                </div>
              )}
              {(pensionPerMonth ?? 0) > 0 && pensionYear > r.retainedInCompany && (
                <p className="forecast-pension-warning">{t.pensionExceedsRetained}</p>
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
          <Tooltip content={t.employeeTooltip} ariaLabel={t.employeeAriaLabel} />
        </h2>
        <p className="forecast-comparison-text">
          {pensionPerMonth && pensionPerMonth > 0
            ? t.employeeComparisonTextWithPension(
              `${formatSEK(equivGrossMonth)}/m\u00e5n`,
              formatSEK(pensionPerMonth)
            )
            : t.employeeComparisonText(`${formatSEK(equivGrossMonth)}/m\u00e5n`)}
        </p>
      </div>

      <p className="forecast-disclaimer">
        {t.disclaimer(kommunalskatt)}
      </p>
    </section>
  )
}
