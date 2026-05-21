import { useState } from "react"
import "./App.css"
import { CardHeader } from "./components/CardHeader"
import { SimpleView } from "./features/simple/SimpleView"
import { AdvancedView } from "./features/advanced/AdvancedView"
import { FutureView } from "./features/future/FutureView"
import { useAppStore } from "./store/useAppStore"
import { translations } from "./lib/i18n"

type View = "simple" | "advanced" | "future"

const App = () => {
  const lang = useAppStore(s => s.lang)
  const setLang = useAppStore(s => s.setLang)
  const reset = useAppStore(s => s.reset)
  const [view, setView] = useState<View>("simple")
  const t = translations[lang]

  return (
    <div className={`App${view === 'advanced' ? ' view-advanced' : view === 'future' ? ' view-future' : ''}`}>
      <main className="main">
        <div className="card">
          <CardHeader lang={lang} view={view} t={t} onLangChange={setLang} onViewChange={setView} />
          {view === 'simple' && <SimpleView t={t} />}
          {view === 'advanced' && <AdvancedView t={t} />}
          {view === 'future' && <FutureView t={t} />}
          <footer className="card-footer">
            <button type="button" className="reset-btn" onClick={reset}>
              {t.reset}
            </button>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
