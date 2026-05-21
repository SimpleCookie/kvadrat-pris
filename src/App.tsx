import { useState, useEffect } from "react"
import "./App.css"
import { AdvancedView } from "./components/AdvancedView"
import { Future } from "./components/future/Future"
import { CardHeader } from "./components/CardHeader"
import { PricesSection } from "./components/PricesSection"
import { FeesSection } from "./components/FeesSection"
import { ForecastSettingsSection } from "./components/ForecastSettingsSection"
import { SimpleBreakdown } from "./components/SimpleBreakdown"
import { usePricingState } from "./hooks/usePricingState"
import { useForecastSettings } from "./hooks/useForecastSettings"
import { loadState, saveState } from "./lib/storage"
import { translations, type Lang } from "./lib/i18n"

type View = "simple" | "advanced" | "future"

const App = () => {
  const saved = loadState()

  const [lang, setLang] = useState<Lang>(saved.lang ?? 'sv')
  const [view, setView] = useState<View>("simple")
  const t = translations[lang]

  const { state: pricing, derived, dispatch: pricingDispatch } = usePricingState(saved)
  const { settings, updateSetting, pensionPerMonth } = useForecastSettings(saved)

  useEffect(() => {
    saveState({
      activeField: pricing.activeField,
      activeValue: pricing.activeValue,
      kvadratFee: pricing.kvadratFee,
      middlemanFee: pricing.middlemanFee,
      lang,
      pensionMode: settings.pensionMode,
      pensionValue: settings.pensionValue,
    })
  }, [
    pricing.activeField, pricing.activeValue, pricing.kvadratFee, pricing.middlemanFee,
    settings.pensionMode, settings.pensionValue, lang,
  ])

  const pricesProps = {
    activeField: pricing.activeField,
    activeValue: pricing.activeValue,
    consultantPrice: derived.consultantPrice,
    clientPrice: derived.clientPrice,
    onPriceChange: (field: 'consultant' | 'client', value: string) =>
      pricingDispatch({ type: 'SET_PRICE', field, value }),
    onFieldFocus: (field: 'consultant' | 'client') =>
      pricingDispatch({ type: 'SET_ACTIVE_FIELD', field }),
    t,
  }

  const feesProps = {
    kvadratFee: pricing.kvadratFee,
    middlemanFee: pricing.middlemanFee,
    onKvadratChange: (value: string) => pricingDispatch({ type: 'SET_KVADRAT_FEE', value }),
    onMiddlemanChange: (value: string) => pricingDispatch({ type: 'SET_MIDDLEMAN_FEE', value }),
    t,
  }

  return (
    <div className={`App${view === 'advanced' ? ' view-advanced' : view === 'future' ? ' view-future' : ''}`}>
      <main className="main">
        <div className="card">
          <CardHeader lang={lang} view={view} t={t} onLangChange={setLang} onViewChange={setView} />

          {view === 'simple' && (
            <>
              <PricesSection {...pricesProps} />
              <FeesSection {...feesProps} />
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
          )}

          {view === 'advanced' && (
            <div className="forecast-layout">
              <div className="forecast-layout-left">
                <PricesSection {...pricesProps} />
                <FeesSection {...feesProps} />
                <ForecastSettingsSection settings={settings} onSettingChange={updateSetting} t={t} />
              </div>
              <div className="forecast-layout-right">
                <AdvancedView
                  consultantRatePerHour={derived.consultantPrice}
                  billableHoursPerYear={parseInt(settings.billableHours) || 0}
                  monthlySalaryGross={parseInt(settings.monthlySalary) || 0}
                  overheadPerYear={parseInt(settings.overhead) || 0}
                  kommunalskatt={parseFloat(settings.kommunalskatt) || 0}
                  kvadratCutPerHour={derived.kvadratCut}
                  pensionPerMonth={pensionPerMonth}
                  t={t}
                />
              </div>
            </div>
          )}

          {view === 'future' && (
            <Future
              consultantRatePerHour={derived.consultantPrice}
              billableHoursPerYear={parseInt(settings.billableHours) || 0}
              monthlySalaryGross={parseInt(settings.monthlySalary) || 0}
              overheadPerYear={parseInt(settings.overhead) || 0}
              pensionPerMonth={pensionPerMonth}
              kommunalskatt={parseFloat(settings.kommunalskatt) || 0}
              t={t}
            />
          )}

          <footer className="card-footer">
            <button type="button" className="reset-btn" onClick={() => pricingDispatch({ type: 'RESET' })}>
              {t.reset}
            </button>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
