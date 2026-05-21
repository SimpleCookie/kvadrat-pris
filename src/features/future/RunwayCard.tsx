import { useState } from 'react'
import { calculateRunway, type BurnScenario } from '../../lib/runway'
import { formatSEK } from '../../lib/pricing'
import { type T } from '../../lib/i18n'
import { Tooltip } from '../../components/Tooltip'

type Props = {
  monthlySalaryGross: number
  overheadPerYear: number
  pensionPerMonth: number
  retainedInCompany: number
  t: T
}

const DEFAULT_BUFFER_MONTHS = 3

export const RunwayCard = ({
  monthlySalaryGross,
  overheadPerYear,
  pensionPerMonth,
  retainedInCompany,
  t,
}: Props) => {
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
      <h2 className="forecast-block-title">{t.runwayTitle}</h2>
      <p className="forecast-comparison-text">{t.runwayIntro}</p>

      {/* ── Inputs ── */}
      <div className="runway-inputs">
        <div className="runway-input-row">
          <span className="runway-input-label">
            {t.bufferMonthsLabel}
            <Tooltip content={t.bufferMonthsTooltip} ariaLabel={t.bufferMonthsTooltip} />
          </span>
          <input
            type="number"
            min={1}
            max={24}
            step={1}
            value={bufferMonths}
            onChange={e => setBufferMonths(Math.max(1, Math.min(24, parseInt(e.target.value) || 1)))}
            className="runway-months-input"
            aria-label={t.bufferMonthsLabel}
          />
        </div>
        <div className="runway-input-row">
          <span className="runway-input-label">
            {t.scenarioLabel}
            <Tooltip content={t.scenarioTooltip} ariaLabel={t.scenarioTooltip} />
          </span>
          <div className="pension-mode-toggle" role="group" aria-label={t.scenarioLabel}>
            <button
              type="button"
              className={`pension-mode-btn${scenario === 'full' ? ' pension-mode-btn-active' : ''}`}
              onClick={() => setScenario('full')}
            >
              {t.scenarioFull}
            </button>
            <button
              type="button"
              className={`pension-mode-btn${scenario === 'fixed-only' ? ' pension-mode-btn-active' : ''}`}
              onClick={() => setScenario('fixed-only')}
            >
              {t.scenarioFixedOnly}
            </button>
          </div>
        </div>
      </div>

      {/* ── Headline ── */}
      <div className="runway-headline-card">
        {result.status === 'unreachable' && (
          <p className="runway-headline-text runway-unreachable">{t.runwayUnreachable}</p>
        )}
        {result.status === 'reached' && (
          <p className="runway-headline-text">{t.runwayReached}</p>
        )}
        {result.status === 'reachable' && result.monthsToTarget !== null && (
          <p className="runway-headline-text">
            {t.runwayHeadline(result.monthsToTarget, formatSEK(result.targetBuffer))}
          </p>
        )}
      </div>

      {/* ── Breakdown ── */}
      <div className="breakdown-rows">
        <div className="breakdown-row">
          <span>{t.monthlyBurnLabel}</span>
          <span className="breakdown-value">{formatSEK(result.monthlyBurn)}</span>
        </div>
        <div className="breakdown-row">
          <span>{t.targetBufferLabel}</span>
          <span className="breakdown-value">{formatSEK(result.targetBuffer)}</span>
        </div>
        <div className={`breakdown-row ${result.annualSavings > 0 ? 'forecast-retained' : 'breakdown-deduction'}`}>
          <span>{t.annualSavingsLabel}</span>
          <span className="breakdown-value">
            {result.annualSavings < 0 ? '−' : ''}{formatSEK(Math.abs(result.annualSavings))}
          </span>
        </div>
      </div>

      {/* ── Disclaimers ── */}
      <p className="forecast-disclaimer">* {t.runwayDisclaimerDividend}</p>
      <p className="forecast-disclaimer">* {t.runwayDisclaimerPension}</p>
    </div>
  )
}
