import { useState, useEffect } from "react"
import "./App.css"
import {
  calculateClientPrice,
  calculateConsultantPrice,
  clampFee,
  formatSEK,
} from "./lib/pricing"
import { AdvancedView } from "./components/AdvancedView"

const STORAGE_KEY = "kvadrat-pris-state"

interface SavedState {
  activeField: "consultant" | "client"
  activeValue: string
  kvadratFee: string
  middlemanFee: string
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

  const [view, setView] = useState<"simple" | "advanced">("simple")

  const [activeField, setActiveField] = useState<"consultant" | "client">(
    saved.activeField ?? "consultant"
  )
  const [activeValue, setActiveValue] = useState(saved.activeValue ?? "800")
  const [kvadratFee, setKvadratFee] = useState(saved.kvadratFee ?? "17")
  const [middlemanFee, setMiddlemanFee] = useState(saved.middlemanFee ?? "0")

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ activeField, activeValue, kvadratFee, middlemanFee })
    )
  }, [activeField, activeValue, kvadratFee, middlemanFee])

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

  return (
    <div className={`App${view === "advanced" ? " view-advanced" : ""}`}>
      <main className="main">
        <div className="card">
          <header className="card-header">
            <div className="card-header-content">
              <div>
                <h1 className="title">Kvadrat Priskalkylator</h1>
                <p className="subtitle">Beräkna konsult- och kundpris</p>
              </div>
              <button
                type="button"
                className="view-toggle"
                onClick={() => setView(v => v === "simple" ? "advanced" : "simple")}
              >
                {view === "simple" ? "Prognos →" : "← Enkel vy"}
              </button>
            </div>
          </header>

          <section className="prices-section">
            <div
              className={`price-field${activeField === "consultant" ? " active" : ""}`}
            >
              <label htmlFor="consultant-price" className="price-label">
                Konsultpris
              </label>
              <div className="price-input-wrap">
                <input
                  id="consultant-price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={50}
                  className="price-input"
                  value={
                    activeField === "consultant"
                      ? activeValue
                      : String(consultantPrice)
                  }
                  onChange={(e) => {
                    setActiveField("consultant")
                    setActiveValue(e.target.value)
                  }}
                  onFocus={() => setActiveField("consultant")}
                  aria-label="Konsultpris i kronor per timme"
                />
                <span className="price-unit">kr/h</span>
              </div>
              <p className="price-hint">Det du tar hem</p>
            </div>

            <div className="price-arrow" aria-hidden="true">⇄</div>

            <div
              className={`price-field${activeField === "client" ? " active" : ""}`}
            >
              <label htmlFor="client-price" className="price-label">
                Kundpris
              </label>
              <div className="price-input-wrap">
                <input
                  id="client-price"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={50}
                  className="price-input"
                  value={
                    activeField === "client" ? activeValue : String(clientPrice)
                  }
                  onChange={(e) => {
                    setActiveField("client")
                    setActiveValue(e.target.value)
                  }}
                  onFocus={() => setActiveField("client")}
                  aria-label="Kundpris i kronor per timme"
                />
                <span className="price-unit">kr/h</span>
              </div>
              <p className="price-hint">Vad kunden betalar</p>
            </div>
          </section>

          <section className="fees-section">
            <fieldset className="fees-fieldset">
              <legend className="fees-legend">Avgifter</legend>
              <div className="fee-row">
                <label htmlFor="kvadrat-fee" className="fee-label">
                  Kvadrats andel
                  <span
                    className="fee-tooltip"
                    data-tooltip="Den andel av kundpriset som Kvadrat behåller"
                    aria-label="Den andel av kundpriset som Kvadrat behåller"
                  >
                    ?
                  </span>
                </label>
                <div className="fee-input-wrap">
                  <input
                    id="kvadrat-fee"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={99}
                    step={1}
                    className="fee-input"
                    value={kvadratFee}
                    onChange={(e) => setKvadratFee(e.target.value)}
                    aria-label="Kvadrats andel i procent"
                  />
                  <span className="fee-unit">%</span>
                </div>
              </div>
              <div className="fee-row">
                <label htmlFor="middleman-fee" className="fee-label">
                  Mellanskär
                  <span
                    className="fee-tooltip"
                    data-tooltip="Avgift för eventuell förmedlare"
                    aria-label="Avgift för eventuell förmedlare"
                  >
                    ?
                  </span>
                </label>
                <div className="fee-input-wrap">
                  <input
                    id="middleman-fee"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={99}
                    step={1}
                    className="fee-input"
                    value={middlemanFee}
                    onChange={(e) => setMiddlemanFee(e.target.value)}
                    aria-label="Mellanskär i procent"
                  />
                  <span className="fee-unit">%</span>
                </div>
              </div>
            </fieldset>
          </section>

          {view === "simple" && hasValue && (
            <section className="breakdown-section">
              <h2 className="breakdown-title">Fördelning per timme</h2>
              <div className="breakdown-rows">
                <div className="breakdown-row">
                  <span>Kunden betalar</span>
                  <span className="breakdown-value">{formatSEK(clientPrice)}</span>
                </div>
                {parsedMiddleman > 0 && (
                  <div className="breakdown-row breakdown-deduction">
                    <span>Mellanskär ({parsedMiddleman}%)</span>
                    <span className="breakdown-value">
                      −{formatSEK(middlemanCut)}
                    </span>
                  </div>
                )}
                <div className="breakdown-row breakdown-deduction">
                  <span>Kvadrats andel ({parsedKvadrat}%)</span>
                  <span className="breakdown-value">
                    −{formatSEK(kvadratCut)}
                  </span>
                </div>
                <div className="breakdown-row breakdown-total">
                  <span>Konsulten får ut</span>
                  <span className="breakdown-value">
                    {formatSEK(consultantPrice)}
                  </span>
                </div>
              </div>
            </section>
          )}

          {view === "advanced" && (
            <AdvancedView consultantRatePerHour={consultantPrice} />
          )}

          <footer className="card-footer">
            <button type="button" className="reset-btn" onClick={handleReset}>
              Återställ
            </button>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
