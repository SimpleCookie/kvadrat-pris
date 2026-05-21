import { Tooltip } from './Tooltip'
import { type T } from '../lib/i18n'

type Props = {
  kvadratFee: string
  middlemanFee: string
  onKvadratChange: (value: string) => void
  onMiddlemanChange: (value: string) => void
  t: T
}

export const FeesSection = ({ kvadratFee, middlemanFee, onKvadratChange, onMiddlemanChange, t }: Props) => (
  <section className="fees-section">
    <fieldset className="fees-fieldset">
      <legend className="fees-legend">{t.feesLegend}</legend>
      <div className="fee-row">
        <span className="fee-label">
          <label htmlFor="kvadrat-fee">{t.kvadratShare}</label>
          <Tooltip content={t.kvadratShareTooltip} ariaLabel={t.kvadratShareTooltip} />
        </span>
        <div className="fee-input-wrap">
          <input
            id="kvadrat-fee"
            type="number"
            inputMode="decimal"
            min={0}
            max={99}
            step={1}
            className="fee-input"
            value={kvadratFee}
            onChange={(e) => onKvadratChange(e.target.value)}
            aria-label={t.kvadratShare}
          />
          <span className="fee-unit">%</span>
        </div>
      </div>
      <div className="fee-row">
        <span className="fee-label">
          <label htmlFor="middleman-fee">{t.middleman}</label>
          <Tooltip content={t.middlemanTooltip} ariaLabel={t.middlemanTooltip} />
        </span>
        <div className="fee-input-wrap">
          <input
            id="middleman-fee"
            type="number"
            inputMode="decimal"
            min={0}
            max={99}
            step={1}
            className="fee-input"
            value={middlemanFee}
            onChange={(e) => onMiddlemanChange(e.target.value)}
            aria-label={t.middleman}
          />
          <span className="fee-unit">%</span>
        </div>
      </div>
    </fieldset>
  </section>
)
