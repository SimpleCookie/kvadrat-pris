import { formatSEK } from '../../lib/pricing'
import { useTranslations } from '../../store/useDerived'

type Props = {
  clientPrice: number
  consultantPrice: number
  middlemanCut: number
  kvadratCut: number
  parsedMiddleman: number
  parsedKvadrat: number
}

export const SimpleBreakdown = ({
  clientPrice,
  consultantPrice,
  middlemanCut,
  kvadratCut,
  parsedMiddleman,
  parsedKvadrat,
}: Props) => {
  const strings = useTranslations()
  return (
    <section className="breakdown-section">
      <h2 className="breakdown-title">{strings.breakdownTitle}</h2>
      <div className="breakdown-rows">
        <div className="breakdown-row">
          <span>{strings.clientPays}</span>
          <span className="breakdown-value">{formatSEK(clientPrice)}</span>
        </div>
        {parsedMiddleman > 0 && (
          <div className="breakdown-row breakdown-deduction">
            <span>{strings.middlemanCutRow(parsedMiddleman)}</span>
            <span className="breakdown-value">−{formatSEK(middlemanCut)}</span>
          </div>
        )}
        <div className="breakdown-row breakdown-deduction">
          <span>{strings.kvadratCutRow(parsedKvadrat)}</span>
          <span className="breakdown-value">−{formatSEK(kvadratCut)}</span>
        </div>
        <div className="breakdown-row breakdown-total">
          <span>{strings.consultantGets}</span>
          <span className="breakdown-value">{formatSEK(consultantPrice)}</span>
        </div>
      </div>
    </section>
  )
}
