import { useState } from 'react'
import {
  calculateBreakEvenRevenue,
  breakEvenPriceForHours,
  breakEvenHoursForPrice,
} from '../../lib/runway'
import { type T } from '../../lib/i18n'

const HOURS_MIN = 800
const HOURS_MAX = 2400
const HOURS_STEP = 1
const PRICE_STEP = 1

const clampHours = (v: number) =>
  Math.max(HOURS_MIN, Math.min(HOURS_MAX, Math.round(v / HOURS_STEP) * HOURS_STEP))

type Props = {
  monthlySalaryGross: number
  overheadPerYear: number
  pensionPerMonth: number
  initialHours: number
  initialPrice: number
  t: T
}

export const BreakEvenExplorer = ({
  monthlySalaryGross,
  overheadPerYear,
  pensionPerMonth,
  initialHours,
  initialPrice,
  t,
}: Props) => {
  const breakEvenRevenue = calculateBreakEvenRevenue(monthlySalaryGross, overheadPerYear, pensionPerMonth)

  // Hours is the single source of truth; price is always derived.
  // Moving the price slider translates back to hours via the inverse function.
  const [hours, setHours] = useState(() => clampHours(initialHours || HOURS_MIN))
  // Draft states: while the user is typing we hold the raw string and only
  // apply + invert on blur, so intermediate keystrokes don't jank the other field.
  const [hoursDraft, setHoursDraft] = useState<string | null>(null)
  const [priceDraft, setPriceDraft] = useState<string | null>(null)

  const truePriceForHours = breakEvenPriceForHours(breakEvenRevenue, hours)

  // Derive price slider range from the hours range so both sliders are always
  // fully traversable — no clamped/unreachable ends.
  const priceMax = Math.ceil(breakEvenPriceForHours(breakEvenRevenue, HOURS_MIN))
  const priceMin = Math.floor(breakEvenPriceForHours(breakEvenRevenue, HOURS_MAX))
  const priceSliderValue = Math.round(truePriceForHours)

  const handlePriceSliderChange = (draggedPrice: number) => {
    const derivedHours = breakEvenHoursForPrice(breakEvenRevenue, draggedPrice)
    setHours(clampHours(derivedHours))
  }

  const handleReset = () => setHours(clampHours(initialHours || HOURS_MIN))

  return (
    <div className="forecast-block">
      <h2 className="forecast-block-title">{t.breakEvenTitle}</h2>
      <p className="forecast-comparison-text">{t.breakEvenIntro}</p>

      {/* Reference line — current main-input values */}
      {initialPrice > 0 && (
        <p className="forecast-context">
          {t.breakEvenCurrent(
            initialHours.toLocaleString('sv-SE'),
            Math.round(initialPrice).toLocaleString('sv-SE'),
            Math.round(initialPrice * initialHours).toLocaleString('sv-SE'),
          )}
        </p>
      )}

      {/* ── Hours slider ── */}
      <div className="range-row">
        <div className="range-header">
          <span className="range-label">{t.breakEvenHoursLabel}</span>
          <input
            type="number"
            className="range-value-input"
            value={hoursDraft !== null ? hoursDraft : hours}
            min={HOURS_MIN}
            max={HOURS_MAX}
            onChange={e => setHoursDraft(e.target.value)}
            onBlur={e => {
              const parsed = parseInt(e.target.value)
              if (!isNaN(parsed)) setHours(clampHours(parsed))
              setHoursDraft(null)
            }}
            aria-label={t.breakEvenHoursLabel}
          />
        </div>
        <input
          type="range"
          className="styled-range"
          min={HOURS_MIN}
          max={HOURS_MAX}
          step={HOURS_STEP}
          value={hours}
          onChange={e => setHours(Number(e.target.value))}
          aria-label={t.breakEvenHoursLabel}
        />
      </div>

      {/* ── Price slider (derived, but interactive) ── */}
      <div className="range-row">
        <div className="range-header">
          <span className="range-label">{t.breakEvenPriceLabel}</span>
          <span className="range-value">
            <input
              type="number"
              className="range-value-input"
              value={priceDraft !== null ? priceDraft : Math.round(truePriceForHours)}
              min={priceMin}
              max={priceMax}
              onChange={e => setPriceDraft(e.target.value)}
              onBlur={e => {
                const parsed = parseFloat(e.target.value)
                if (!isNaN(parsed) && parsed > 0) {
                  const derivedHours = breakEvenHoursForPrice(breakEvenRevenue, parsed)
                  setHours(clampHours(derivedHours))
                }
                setPriceDraft(null)
              }}
              aria-label={t.breakEvenPriceLabel}
            />
            <span>kr/h</span>
          </span>
        </div>
        <input
          type="range"
          className="styled-range"
          min={priceMin}
          max={priceMax}
          step={PRICE_STEP}
          value={priceSliderValue}
          onChange={e => handlePriceSliderChange(Number(e.target.value))}
          aria-label={t.breakEvenPriceLabel}
        />
      </div>

      {/* ── Break-even revenue (constant) ── */}
      <div className="breakdown-rows" style={{ marginTop: '1rem' }}>
        <div className="breakdown-row forecast-retained">
          <span>{t.breakEvenRevenueLabel}</span>
          <span className="breakdown-value">
            {breakEvenRevenue.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>

      <button type="button" className="reset-btn" onClick={handleReset} style={{ marginTop: '0.75rem' }}>
        {t.breakEvenReset}
      </button>
    </div>
  )
}
