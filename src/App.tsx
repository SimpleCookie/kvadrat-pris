import { useState } from "react"
import "./App.css"
import { CardHeader } from "./components/CardHeader"
import { SimpleView } from "./features/simple/SimpleView"
import { AdvancedView } from "./features/advanced/AdvancedView"
import { FutureView } from "./features/future/FutureView"
import { useAppStore } from "./store/useAppStore"
import { useTranslations } from "./store/useDerived"

type View = "simple" | "advanced" | "future"

const App = () => {
  const reset = useAppStore(s => s.reset)
  const [view, setView] = useState<View>("simple")
  const strings = useTranslations()

  return (
    <div className={`App${view === 'advanced' ? ' view-advanced' : view === 'future' ? ' view-future' : ''}`}>
      <a href="https://devgroup.se/" className="back-link">
        <span className="back-link-arrow">←</span>
        DevGroup.se
      </a>
      <main className="main">
        <div className="card">
          <CardHeader view={view} onViewChange={setView} />
          {view === 'simple' && <SimpleView />}
          {view === 'advanced' && <AdvancedView />}
          {view === 'future' && <FutureView />}
          <footer className="card-footer">
            <button type="button" className="reset-btn" onClick={reset}>
              {strings.reset}
            </button>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
