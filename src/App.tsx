import { useState, useEffect } from "react"
import "./App.css"
import { CardHeader } from "./components/CardHeader"
import { SimpleView } from "./features/simple/SimpleView"
import { AdvancedView } from "./features/advanced/AdvancedView"
import { FutureView } from "./features/future/FutureView"
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
  const pricing = usePricingState(saved)
  const forecast = useForecastSettings(saved)

  useEffect(() => {
    saveState({
      activeField: pricing.state.activeField,
      activeValue: pricing.state.activeValue,
      kvadratFee: pricing.state.kvadratFee,
      middlemanFee: pricing.state.middlemanFee,
      lang,
      pensionMode: forecast.settings.pensionMode,
      pensionValue: forecast.settings.pensionValue,
    })
  }, [
    pricing.state.activeField, pricing.state.activeValue,
    pricing.state.kvadratFee, pricing.state.middlemanFee,
    forecast.settings.pensionMode, forecast.settings.pensionValue, lang,
  ])

  return (
    <div className={`App${view === 'advanced' ? ' view-advanced' : view === 'future' ? ' view-future' : ''}`}>
      <main className="main">
        <div className="card">
          <CardHeader lang={lang} view={view} t={t} onLangChange={setLang} onViewChange={setView} />
          {view === 'simple' && <SimpleView pricing={pricing} t={t} />}
          {view === 'advanced' && <AdvancedView pricing={pricing} forecast={forecast} t={t} />}
          {view === 'future' && <FutureView pricing={pricing} forecast={forecast} t={t} />}
          <footer className="card-footer">
            <button type="button" className="reset-btn" onClick={() => pricing.dispatch({ type: 'RESET' })}>
              {t.reset}
            </button>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
