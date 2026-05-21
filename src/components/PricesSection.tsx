import { type T } from '../lib/i18n'

type Props = {
  activeField: 'consultant' | 'client'
  activeValue: string
  consultantPrice: number
  clientPrice: number
  onPriceChange: (field: 'consultant' | 'client', value: string) => void
  onFieldFocus: (field: 'consultant' | 'client') => void
  t: T
}

export const PricesSection = ({
  activeField,
  activeValue,
  consultantPrice,
  clientPrice,
  onPriceChange,
  onFieldFocus,
  t,
}: Props) => (
  <section className="prices-section">
    <div className={`price-field${activeField === 'consultant' ? ' active' : ''}`}>
      <label htmlFor="consultant-price" className="price-label">{t.consultantPrice}</label>
      <div className="price-input-wrap">
        <input
          id="consultant-price"
          type="number"
          inputMode="decimal"
          min={0}
          step={50}
          className="price-input"
          value={activeField === 'consultant' ? activeValue : String(consultantPrice)}
          onChange={(e) => onPriceChange('consultant', e.target.value)}
          onFocus={() => onFieldFocus('consultant')}
          aria-label={t.consultantPriceAria}
        />
        <span className="price-unit">kr/h</span>
      </div>
      <p className="price-hint">{t.consultantPriceHint}</p>
    </div>
    <div className="price-arrow" aria-hidden="true">⇄</div>
    <div className={`price-field${activeField === 'client' ? ' active' : ''}`}>
      <label htmlFor="client-price" className="price-label">{t.clientPrice}</label>
      <div className="price-input-wrap">
        <input
          id="client-price"
          type="number"
          inputMode="decimal"
          min={0}
          step={50}
          className="price-input"
          value={activeField === 'client' ? activeValue : String(clientPrice)}
          onChange={(e) => onPriceChange('client', e.target.value)}
          onFocus={() => onFieldFocus('client')}
          aria-label={t.clientPriceAria}
        />
        <span className="price-unit">kr/h</span>
      </div>
      <p className="price-hint">{t.clientPriceHint}</p>
    </div>
  </section>
)
