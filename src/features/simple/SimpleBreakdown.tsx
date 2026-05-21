import { formatSEK } from '../../lib/pricing'
import { type T } from '../../lib/i18n'

type Props = {
  clientPrice: number
  consultantPrice: number
  middlemanCut: number
  kvadratCut: number
  parsedMiddleman: number
  parsedKvadrat: number
  t: T
}

export const SimpleBreakdown = ({
  clientPrice,
  consultantPrice,
  middlemanCut,
  kvadratCut,
  parsedMiddleman,
  parsedKvadrat,
  t,
}: Props) => (
  <section className="breakdown-section">
    <h2 className="breakdown-title">{t.breakdownTitle}</h2>
    <div className="breakdown-rows">
      <div className="breakdown-row">
        <span>{t.clientPays}</span>
        <span className="breakdown-value">{formatSEK(clientPrice)}</span>
      </div>
      {parsedMiddleman > 0 && (
        <div className="breakdown-row breakdown-deduction">
          <span>{t.middlemanCutRow(parsedMiddleman)}</span>
          <span className="breakdown-value">−{formatSEK(middlemanCut)}</span>
        </div>
      )}
      <div className="breakdown-row breakdown-deduction">
        <span>{t.kvadratCutRow(parsedKvadrat)}</span>
        <span className="breakdown-value">−{formatSEK(kvadratCut)}</span>
      </div>
      <div className="breakdown-row breakdown-total">
        <span>{t.consultantGets}</span>
        <span className="breakdown-value">{formatSEK(consultantPrice)}</span>
      </div>
    </div>
  </section>
)
