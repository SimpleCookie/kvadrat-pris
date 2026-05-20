import { useState, useEffect } from "react"
import "./App.css"
import {
  calculateClientPrice,
  calculateConsultantPrice,
  clampFee,
  formatSEK,
} from "./lib/pricing"
import { AdvancedView } from "./components/AdvancedView"
import { translations, type Lang } from "./lib/i18n"

const STORAGE_KEY = "kvadrat-pris-state"

interface SavedState {
  activeField: "consultant" | "client"
  activeValue: string
  kvadratFee: string
  middlemanFee: string
  lang?: Lang
}

const loadState = (): Partial<SavedState> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const App = () => {
  const saved = loadState()

  const [lang, setLang] = useState<Lang>(saved.lang ?? 'sv')
  const t = translations[lang]

  const [view, setView] = useState<"simple" | "advanced">("simple")

  const [activeField, setActiveField] = useState<"consultant" | "client">(
    saved.activeField ?? "consultant"
  )
  const [activeValue, setActiveValue] = useState(saved.activeValue ?? "800")
  const [kvadratFee, setKvadratFee] = useState(saved.kvadratFee ?? "17")
  const [middlemanFee, setMiddlemanFee] = useState(saved.middlemanFee ?? "0")

  // Forecast settings state (persisted only for the session)
  const [billableHours, setBillableHours] = useState("1600")
  const [monthlySalary, setMonthlySalary] = useState("53600")
  const [overhead, setOverhead] = useState("25000")
  const [kommunalskatt, setKommunalskatt] = useState("32")

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ activeField, activeValue, kvadratFee, middlemanFee, lang })
    )
  }, [activeField, activeValue, kvadratFee, middlemanFee, lang])

  const parsedActive = parseFloat(activeValue) || 0
  const parsedKvadrat = clampFee(parseFloat(kvadratFee) || 0)
  const parsedMiddleman = clampFee(parseFloat(middlemanFee) || 0)

  const consultantPrice =
    activeField === "consultant"
      ? parsedActive
      : calculateConsultantPrice(parsedActive, parsedKvadrat, parsedMiddleman)

  const clientPrice =
    activeField === "client"
      ? parsedActive
      : calculateClientPrice(parsedActive, parsedKvadrat, parsedMiddleman)

  // Breakdown — middleman cut first, then Kvadrat cut, remainder = consultant
  const middlemanCut = Math.round(clientPrice * (parsedMiddleman / 100))
  const afterMiddleman = clientPrice - middlemanCut
  const kvadratCut = afterMiddleman - consultantPrice

  const hasValue = parsedActive > 0

  const handleReset = () => {
    setActiveField("consultant")
    setActiveValue("800")
    setKvadratFee("17")
    setMiddlemanFee("0")
  }

  // Reusable JSX for sections shared between simple and advanced left column
  const pricesSection = (
    <section className="prices-section">
      <div className={`price-field${activeField === "consultant" ? " active" : ""}`}>
        <label htmlFor="consultant-price" className="price-label">{t.consultantPrice}</label>
        <div className="price-input-wrap">
          <input
            id="consultant-price"
            type="number"
            inputMode="decimal"
            min={0}
            step={50}
            className="price-input"
            value={activeField === "consultant" ? activeValue : String(consultantPrice)}
            onChange={(e) => { setActiveField("consultant"); setActiveValue(e.target.value) }}
            onFocus={() => setActiveField("consultant")}
            aria-label={t.consultantPriceAria}
          />
          <span className="price-unit">kr/h</span>
        </div>
        <p className="price-hint">{t.consultantPriceHint}</p>
      </div>
      <div className="price-arrow" aria-hidden="true">⇄</div>
      <div className={`price-field${activeField === "client" ? " active" : ""}`}>
        <label htmlFor="client-price" className="price-label">{t.clientPrice}</label>
        <div className="price-input-wrap">
          <input
            id="client-price"
            type="number"
            inputMode="decimal"
            min={0}
            step={50}
            className="price-input"
            value={activeField === "client" ? activeValue : String(clientPrice)}
            onChange={(e) => { setActiveField("client"); setActiveValue(e.target.value) }}
            onFocus={() => setActiveField("client")}
            aria-label={t.clientPriceAria}
          />
          <span className="price-unit">kr/h</span>
        </div>
        <p className="price-hint">{t.clientPriceHint}</p>
      </div>
    </section>
  )

  const feesSection = (
    <section className="fees-section">
      <fieldset className="fees-fieldset">
        <legend className="fees-legend">{t.feesLegend}</legend>
        <div className="fee-row">
          <label htmlFor="kvadrat-fee" className="fee-label">
            {t.kvadratShare}
            <span className="fee-tooltip" data-tooltip={t.kvadratShareTooltip} aria-label={t.kvadratShareTooltip}>?</span>
          </label>
          <div className="fee-input-wrap">
            <input id="kvadrat-fee" type="number" inputMode="decimal" min={0} max={99} step={1} className="fee-input" value={kvadratFee} onChange={(e) => setKvadratFee(e.target.value)} aria-label={t.kvadratShare} />
            <span className="fee-unit">%</span>
          </div>
        </div>
        <div className="fee-row">
          <label htmlFor="middleman-fee" className="fee-label">
            {t.middleman}
            <span className="fee-tooltip" data-tooltip={t.middlemanTooltip} aria-label={t.middlemanTooltip}>?</span>
          </label>
          <div className="fee-input-wrap">
            <input id="middleman-fee" type="number" inputMode="decimal" min={0} max={99} step={1} className="fee-input" value={middlemanFee} onChange={(e) => setMiddlemanFee(e.target.value)} aria-label={t.middleman} />
            <span className="fee-unit">%</span>
          </div>
        </div>
      </fieldset>
    </section>
  )

  const forecastSettingsSection = (
    <section className="fees-section">
      <fieldset className="fees-fieldset">
        <legend className="fees-legend">{t.settingsLegend}</legend>
        <div className="forecast-settings-grid">
          <div className="forecast-settings-field">
            <label htmlFor="billable-hours" className="forecast-settings-label">
              {t.billableHours}
              <span className="fee-tooltip" data-tooltip={t.billableHoursTooltip} aria-label={t.billableHoursAria}>?</span>
            </label>
            <div className="forecast-settings-input-wrap">
              <input id="billable-hours" type="number" inputMode="numeric" min={0} max={3000} step={40} className="forecast-settings-input" value={billableHours} onChange={(e) => setBillableHours(e.target.value)} aria-label={t.billableHoursAria} />
              <span className="fee-unit">h</span>
            </div>
          </div>
          <div className="forecast-settings-field">
            <label htmlFor="monthly-salary" className="forecast-settings-label">
              {t.monthlySalary}
              <span className="fee-tooltip" data-tooltip={t.monthlySalaryTooltip} aria-label={t.monthlySalaryAria}>?</span>
            </label>
            <div className="forecast-settings-input-wrap">
              <input id="monthly-salary" type="number" inputMode="numeric" min={0} step={1000} className="forecast-settings-input" value={monthlySalary} onChange={(e) => setMonthlySalary(e.target.value)} aria-label={t.monthlySalaryAria} />
              <span className="fee-unit">kr</span>
            </div>
          </div>
          <div className="forecast-settings-field">
            <label htmlFor="overhead" className="forecast-settings-label">
              {t.overheadLabel}
              <span className="fee-tooltip" data-tooltip={t.overheadTooltip} aria-label={t.overheadAria}>?</span>
            </label>
            <div className="forecast-settings-input-wrap">
              <input id="overhead" type="number" inputMode="numeric" min={0} step={1000} className="forecast-settings-input" value={overhead} onChange={(e) => setOverhead(e.target.value)} aria-label={t.overheadAria} />
              <span className="fee-unit">kr</span>
            </div>
          </div>
          <div className="forecast-settings-field">
            <label htmlFor="kommunalskatt" className="forecast-settings-label">{t.municipalTax}</label>
            <div className="forecast-settings-input-wrap">
              <input id="kommunalskatt" type="number" inputMode="decimal" min={0} max={40} step={0.1} className="forecast-settings-input" value={kommunalskatt} onChange={(e) => setKommunalskatt(e.target.value)} aria-label={t.municipalTaxAria} />
              <span className="fee-unit">%</span>
            </div>
          </div>
        </div>
      </fieldset>
    </section>
  )

  return (
    <div className={`App${view === "advanced" ? " view-advanced" : ""}`}>
      <main className="main">
        <div className="card">
          <header className="card-header">
            <div className="card-header-content">
              <div>
                <h1 className="title">{t.title}</h1>
                <p className="subtitle">{t.subtitle}</p>
              </div>
              <div className="header-controls">
                <div className="lang-toggle" role="group" aria-label="Language">
                  <button type="button" className={`lang-btn${lang === 'sv' ? ' lang-btn-active' : ''}`} onClick={() => setLang('sv')}>SV</button>
                  <button type="button" className={`lang-btn${lang === 'en' ? ' lang-btn-active' : ''}`} onClick={() => setLang('en')}>EN</button>
                </div>
                <button
                  type="button"
                  className="view-toggle"
                  onClick={() => setView(v => v === "simple" ? "advanced" : "simple")}
                >
                  {view === "simple" ? t.viewForecast : t.viewSimple}
                </button>
              </div>
            </div>
          </header>

          {view === "simple" ? (
            <>
              {pricesSection}
              {feesSection}
              {hasValue && (
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
              )}
            </>
          ) : (
            <div className="forecast-layout">
              <div className="forecast-layout-left">
                {pricesSection}
                {feesSection}
                {forecastSettingsSection}
              </div>
              <div className="forecast-layout-right">
                <AdvancedView
                  consultantRatePerHour={consultantPrice}
                  billableHoursPerYear={parseInt(billableHours) || 0}
                  monthlySalaryGross={parseInt(monthlySalary) || 0}
                  overheadPerYear={parseInt(overhead) || 0}
                  kommunalskatt={parseFloat(kommunalskatt) || 0}
                  kvadratCutPerHour={kvadratCut}
                  t={t}
                />
              </div>
            </div>
          )}

          <footer className="card-footer">
            <button type="button" className="reset-btn" onClick={handleReset}>
              {t.reset}
            </button>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
