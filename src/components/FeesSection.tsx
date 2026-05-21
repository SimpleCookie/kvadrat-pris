import { Tooltip } from './Tooltip'
import { useTranslations } from '../store/useDerived'

type Props = {
  kvadratFee: string
  middlemanFee: string
  onKvadratChange: (value: string) => void
  onMiddlemanChange: (value: string) => void
}

export const FeesSection = ({ kvadratFee, middlemanFee, onKvadratChange, onMiddlemanChange }: Props) => {
  const strings = useTranslations()
  return (
  <section className="fees-section">
    <fieldset className="fees-fieldset">
      <legend className="fees-legend">{strings.feesLegend}</legend>
      <div className="fee-row">
        <span className="fee-label">
          <label htmlFor="kvadrat-fee">{strings.kvadratShare}</label>
          <Tooltip content={strings.kvadratShareTooltip} ariaLabel={strings.kvadratShareTooltip} />
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
            aria-label={strings.kvadratShare}
          />
          <span className="fee-unit">%</span>
        </div>
      </div>
      <div className="fee-row">
        <span className="fee-label">
          <label htmlFor="middleman-fee">{strings.middleman}</label>
          <Tooltip content={strings.middlemanTooltip} ariaLabel={strings.middlemanTooltip} />
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
            aria-label={strings.middleman}
          />
          <span className="fee-unit">%</span>
        </div>
      </div>
    </fieldset>
  </section>
  )
}
