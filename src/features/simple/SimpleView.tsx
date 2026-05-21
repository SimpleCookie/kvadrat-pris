import { useAppStore } from '../../store/useAppStore'
import { usePricingDerived } from '../../store/useDerived'
import { PricesSection } from '../../components/PricesSection'
import { FeesSection } from '../../components/FeesSection'
import { SimpleBreakdown } from './SimpleBreakdown'
import { type T } from '../../lib/i18n'

type Props = { t: T }

export const SimpleView = ({ t }: Props) => {
  const { activeField, activeValue, kvadratFee, middlemanFee, setPrice, setActiveField, setKvadratFee, setMiddlemanFee } = useAppStore()
  const derived = usePricingDerived()
  return (
    <>
      <PricesSection
        activeField={activeField}
        activeValue={activeValue}
        consultantPrice={derived.consultantPrice}
        clientPrice={derived.clientPrice}
        onPriceChange={setPrice}
        onFieldFocus={setActiveField}
        t={t}
      />
      <FeesSection
        kvadratFee={kvadratFee}
        middlemanFee={middlemanFee}
        onKvadratChange={setKvadratFee}
        onMiddlemanChange={setMiddlemanFee}
        t={t}
      />
      {derived.hasValue && (
        <SimpleBreakdown
          clientPrice={derived.clientPrice}
          consultantPrice={derived.consultantPrice}
          middlemanCut={derived.middlemanCut}
          kvadratCut={derived.kvadratCut}
          parsedMiddleman={derived.parsedMiddleman}
          parsedKvadrat={derived.parsedKvadrat}
          t={t}
        />
      )}
    </>
  )
}
