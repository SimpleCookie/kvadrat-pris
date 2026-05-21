import { PricesSection } from '../../components/PricesSection'
import { FeesSection } from '../../components/FeesSection'
import { SimpleBreakdown } from './SimpleBreakdown'
import { type UsePricingStateResult } from '../../hooks/usePricingState'
import { type T } from '../../lib/i18n'

type Props = {
  pricing: UsePricingStateResult
  t: T
}

export const SimpleView = ({ pricing, t }: Props) => {
  const { state, derived, dispatch } = pricing
  return (
    <>
      <PricesSection
        activeField={state.activeField}
        activeValue={state.activeValue}
        consultantPrice={derived.consultantPrice}
        clientPrice={derived.clientPrice}
        onPriceChange={(field, value) => dispatch({ type: 'SET_PRICE', field, value })}
        onFieldFocus={(field) => dispatch({ type: 'SET_ACTIVE_FIELD', field })}
        t={t}
      />
      <FeesSection
        kvadratFee={state.kvadratFee}
        middlemanFee={state.middlemanFee}
        onKvadratChange={(value) => dispatch({ type: 'SET_KVADRAT_FEE', value })}
        onMiddlemanChange={(value) => dispatch({ type: 'SET_MIDDLEMAN_FEE', value })}
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
