import {
  calculateForecast,
  calculateEquivalentEmployeeGross,
  SCHABLONBELOPP,
  type ForecastInputs,
} from '../../lib/forecast'
import { formatSEK } from '../../lib/pricing'
import { useTranslations } from '../../store/useDerived'
import { Tooltip } from '../../components/Tooltip'

type Props = ForecastInputs & {
  kvadratCutPerHour?: number
  pensionPerMonth?: number
}

export const ForecastResults = (props: Props) => {
  const strings = useTranslations()
  const r = calculateForecast(props)
  const { consultantRatePerHour, billableHoursPerYear, monthlySalaryGross, kommunalskatt, kvadratCutPerHour, pensionPerMonth } = props

  const equivGrossYear = calculateEquivalentEmployeeGross(r.totalTakeHomeYear, kommunalskatt)
  const equivGrossMonth = Math.round(equivGrossYear / 12)
  const pensionYear = (pensionPerMonth ?? 0) * 12
  const pensionAdjustedRetained = Math.max(0, r.retainedInCompany - pensionYear)

  if (!consultantRatePerHour) {
    return (
      <div className="forecast-empty">
        {strings.enterPrice}
      </div>
    )
  }

  return (
    <section className="breakdown-section forecast-results">

      {/* Context line */}
      <p className="forecast-context">
        {billableHoursPerYear.toLocaleString('sv-SE')} h
        &nbsp;×&nbsp;{formatSEK(consultantRatePerHour)}
        &nbsp;=&nbsp;<strong>{formatSEK(r.grossRevenue)}{strings.perYearGross}</strong>
      </p>
      {kvadratCutPerHour != null && kvadratCutPerHour > 0 && (
        <p className="forecast-context forecast-kvadrat-cut">
          {strings.kvadratShareLabel}{' '}
          <strong>{formatSEK(kvadratCutPerHour * billableHoursPerYear)}{strings.perYear}</strong>
          {' '}({kvadratCutPerHour.toLocaleString('sv-SE')} kr/h)
        </p>
      )}

      {/* ── Bolaget ── */}
      <div className="forecast-block">
        <h2 className="forecast-block-title">{strings.companyBlock}</h2>
        <div className="breakdown-rows">
          <div className="breakdown-row">
            <span>{strings.grossRevenue}</span>
            <span className="breakdown-value">{formatSEK(r.grossRevenue)}</span>
          </div>
          <div className="breakdown-row breakdown-deduction">
            <span>{strings.overheadRow}</span>
            <span className="breakdown-value">−{formatSEK(r.overhead)}</span>
          </div>
          <div className="breakdown-row breakdown-deduction">
            <span>{strings.salaryGrossRow(monthlySalaryGross.toLocaleString('sv-SE'))}</span>
            <span className="breakdown-value">−{formatSEK(r.salaryGross)}</span>
          </div>
          <div className="breakdown-row breakdown-deduction">
            <span>{strings.socialFees}</span>
            <span className="breakdown-value">−{formatSEK(r.socialFees)}</span>
          </div>
          <div className={`breakdown-row breakdown-sub-total${r.preTaxProfit < 0 ? ' breakdown-deduction' : ''}`}>
            <span>{strings.preTaxProfit}</span>
            <span className="breakdown-value">
              {r.preTaxProfit < 0 ? '−' : ''}{formatSEK(Math.abs(r.preTaxProfit))}
            </span>
          </div>

          {r.preTaxProfit > 0 && (
            <>
              <div className="breakdown-row breakdown-deduction">
                <span>{strings.corporateTax}</span>
                <span className="breakdown-value">−{formatSEK(r.corporateTax)}</span>
              </div>
              <div className="breakdown-row breakdown-sub-total">
                <span>{strings.profitAfterTax}</span>
                <span className="breakdown-value">{formatSEK(r.profitAfterTax)}</span>
              </div>
              <div className="breakdown-row breakdown-deduction">
                <span>
                  {strings.dividend}
                  <Tooltip
                    content={strings.dividendTooltip(formatSEK(SCHABLONBELOPP))}
                    ariaLabel={strings.dividendTooltip(formatSEK(SCHABLONBELOPP))}
                  />
                </span>
                <span className="breakdown-value">−{formatSEK(r.dividendGross)}</span>
              </div>
              <div className="breakdown-row breakdown-deduction">
                <span>{strings.dividendTax}</span>
                <span className="breakdown-value">−{formatSEK(r.dividendTax)}</span>
              </div>
              {(pensionPerMonth ?? 0) > 0 && (
                <div className="breakdown-row breakdown-deduction">
                  <span>
                    {strings.pensionRow}
                    <Tooltip content={strings.pensionRowTooltip} ariaLabel={strings.pensionRowTooltip} />
                  </span>
                  <span className="breakdown-value">−{formatSEK(pensionYear)}</span>
                </div>
              )}
              {pensionAdjustedRetained > 0 && (
                <div className="breakdown-row forecast-retained">
                  <span>
                    {strings.retainedLabel}
                    <Tooltip content={strings.retainedTooltip} ariaLabel={strings.retainedAriaLabel} />
                    <span className="forecast-retained-note">{strings.retainedNote}</span>
                  </span>
                  <span className="breakdown-value">{formatSEK(pensionAdjustedRetained)}</span>
                </div>
              )}
              {(pensionPerMonth ?? 0) > 0 && (
                <div className="breakdown-row forecast-pension-pot">
                  <span>
                    {strings.pensionRow}
                    <Tooltip content={strings.pensionRowTooltip} ariaLabel={strings.pensionRowTooltip} />
                    <span className="forecast-retained-note">{strings.pensionSavingsNote}</span>
                  </span>
                  <span className="breakdown-value">{formatSEK(pensionYear)}</span>
                </div>
              )}
              {(pensionPerMonth ?? 0) > 0 && pensionYear > r.retainedInCompany && (
                <p className="forecast-pension-warning">{strings.pensionExceedsRetained}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Du ── */}
      <div className="forecast-block">
        <h2 className="forecast-block-title">{strings.youBlock}</h2>
        <div className="breakdown-rows">
          <div className="breakdown-row">
            <span>{strings.netSalaryYear}</span>
            <span className="breakdown-value">{formatSEK(r.salaryNet)}</span>
          </div>
          {r.dividendNet > 0 && (
            <div className="breakdown-row forecast-dividend">
              <span>{strings.netDividend}</span>
              <span className="breakdown-value">{formatSEK(r.dividendNet)}</span>
            </div>
          )}
          <div className="breakdown-row breakdown-total">
            <span>{strings.netPerYear}</span>
            <span className="breakdown-value">{formatSEK(r.totalTakeHomeYear)}</span>
          </div>
        </div>

        <div className="forecast-monthly-card">
          <span className="forecast-monthly-card-label">{strings.netPerMonth}</span>
          <span className="forecast-monthly-card-amount">{formatSEK(r.totalTakeHomeMonth)}</span>
        </div>
      </div>

      {/* ── Som anställd ── */}
      <div className="forecast-block forecast-block-comparison">
        <h2 className="forecast-block-title">
          {strings.employeeBlock}
          <Tooltip content={strings.employeeTooltip} ariaLabel={strings.employeeAriaLabel} />
        </h2>
        <p className="forecast-comparison-text">
          {pensionPerMonth && pensionPerMonth > 0
            ? strings.employeeComparisonTextWithPension(
              `${formatSEK(equivGrossMonth)}/m\u00e5n`,
              formatSEK(pensionPerMonth)
            )
            : strings.employeeComparisonText(`${formatSEK(equivGrossMonth)}/m\u00e5n`)}
        </p>
      </div>

      <p className="forecast-disclaimer">
        {strings.disclaimer(kommunalskatt)}
      </p>
    </section>
  )
}
