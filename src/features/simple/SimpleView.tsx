import { useAppStore } from '../../store/useAppStore'
import { usePricingDerived } from '../../store/useDerived'
import { PricesSection } from '../../components/PricesSection'
import { FeesSection } from '../../components/FeesSection'
import { SimpleBreakdown } from './SimpleBreakdown'

export const SimpleView = () => {
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
      />
      <FeesSection
        kvadratFee={kvadratFee}
        middlemanFee={middlemanFee}
        onKvadratChange={setKvadratFee}
        onMiddlemanChange={setMiddlemanFee}
      />
      {derived.hasValue && (
        <SimpleBreakdown
          clientPrice={derived.clientPrice}
          consultantPrice={derived.consultantPrice}
          middlemanCut={derived.middlemanCut}
          kvadratCut={derived.kvadratCut}
          parsedMiddleman={derived.parsedMiddleman}
          parsedKvadrat={derived.parsedKvadrat}
        />
      )}
    </>
  )
}
