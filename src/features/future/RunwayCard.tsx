import { useState } from 'react'
import { calculateRunway, type BurnScenario } from '../../lib/runway'
import { formatSEK } from '../../lib/pricing'
import { useTranslations } from '../../store/useDerived'
import { Tooltip } from '../../components/Tooltip'

type Props = {
  monthlySalaryGross: number
  overheadPerYear: number
  pensionPerMonth: number
  retainedInCompany: number
}

const DEFAULT_BUFFER_MONTHS = 3

export const RunwayCard = ({
  monthlySalaryGross,
  overheadPerYear,
  pensionPerMonth,
  retainedInCompany,
}: Props) => {
  const strings = useTranslations()
  const [bufferMonths, setBufferMonths] = useState(DEFAULT_BUFFER_MONTHS)
  const [scenario, setScenario] = useState<BurnScenario>('full')

  const result = calculateRunway({
    monthlySalaryGross,
    overheadPerYear,
    pensionPerMonth,
    annualRetainedInCompany: retainedInCompany,
    bufferMonths,
    scenario,
  })

  return (
    <div className="forecast-block">
      <h2 className="forecast-block-title">{strings.runwayTitle}</h2>
      <p className="forecast-comparison-text">{strings.runwayIntro}</p>

      {/* ── Inputs ── */}
      <div className="runway-inputs">
        <div className="runway-input-row">
          <span className="runway-input-label">
            {strings.bufferMonthsLabel}
            <Tooltip content={strings.bufferMonthsTooltip} ariaLabel={strings.bufferMonthsTooltip} />
          </span>
          <input
            type="number"
            min={1}
            max={24}
            step={1}
            value={bufferMonths}
            onChange={e => setBufferMonths(Math.max(1, Math.min(24, parseInt(e.target.value) || 1)))}
            className="runway-months-input"
            aria-label={strings.bufferMonthsLabel}
          />
        </div>
        <div className="runway-input-row">
          <span className="runway-input-label">
            {strings.scenarioLabel}
            <Tooltip content={strings.scenarioTooltip} ariaLabel={strings.scenarioTooltip} />
          </span>
          <div className="pension-mode-toggle" role="group" aria-label={strings.scenarioLabel}>
            <button
              type="button"
              className={`pension-mode-btn${scenario === 'full' ? ' pension-mode-btn-active' : ''}`}
              onClick={() => setScenario('full')}
            >
              {strings.scenarioFull}
            </button>
            <button
              type="button"
              className={`pension-mode-btn${scenario === 'fixed-only' ? ' pension-mode-btn-active' : ''}`}
              onClick={() => setScenario('fixed-only')}
            >
              {strings.scenarioFixedOnly}
            </button>
          </div>
        </div>
      </div>

      {/* ── Headline ── */}
      <div className="runway-headline-card">
        {result.status === 'unreachable' && (
          <p className="runway-headline-text runway-unreachable">{strings.runwayUnreachable}</p>
        )}
        {result.status === 'reached' && (
          <p className="runway-headline-text">{strings.runwayReached}</p>
        )}
        {result.status === 'reachable' && result.monthsToTarget !== null && (
          <p className="runway-headline-text">
            {strings.runwayHeadline(result.monthsToTarget, formatSEK(result.targetBuffer))}
          </p>
        )}
      </div>

      {/* ── Breakdown ── */}
      <div className="breakdown-rows">
        <div className="breakdown-row">
          <span>{strings.monthlyBurnLabel}</span>
          <span className="breakdown-value">{formatSEK(result.monthlyBurn)}</span>
        </div>
        <div className="breakdown-row">
          <span>{strings.targetBufferLabel}</span>
          <span className="breakdown-value">{formatSEK(result.targetBuffer)}</span>
        </div>
        <div className={`breakdown-row ${result.annualSavings > 0 ? 'forecast-retained' : 'breakdown-deduction'}`}>
          <span>{strings.annualSavingsLabel}</span>
          <span className="breakdown-value">
            {result.annualSavings < 0 ? '−' : ''}{formatSEK(Math.abs(result.annualSavings))}
          </span>
        </div>
      </div>

      {/* ── Disclaimers ── */}
      <p className="forecast-disclaimer">* {strings.runwayDisclaimerDividend}</p>
      <p className="forecast-disclaimer">* {strings.runwayDisclaimerPension}</p>
    </div>
  )
}
