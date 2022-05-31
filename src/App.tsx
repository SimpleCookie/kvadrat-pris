import React, { useState } from "react"
import "./App.css"

const consultantToClientPrice = (price: number, fee: number) => {
  if (fee === 0) return price / 0.83
  return Math.ceil(price / 0.83 / (1 - fee / 100))
}

const clientToConsultantPrice = (price: number, fee: number) => {
  return Math.floor(price * (1 - fee / 100) * 0.83)
}

const App = () => {
  const [useClientPrice, setUseClientPrice] = useState(false)
  const [price, setPrice] = useState(0)
  const [fee, setFee] = useState(0)

  return (
    <div className="App">
      <main className="main">
        <form className="form">
          <div className="price-type">
            <label htmlFor="konsultpris">
              Konsultpris
              <input
                type="radio"
                id="konsultpris"
                value="consultant"
                name="konsultpris"
                checked={!useClientPrice}
                onChange={(e) => {
                  setUseClientPrice(false)
                }}
              />
            </label>
            <label htmlFor="kundpris">
              Kundpris
              <input
                type="radio"
                id="kundpris"
                value="client"
                checked={useClientPrice}
                name="kundpris"
                onChange={(e) => {
                  setUseClientPrice(true)
                }}
              />
            </label>
          </div>

          <label className="label">
            <span className="label-text">
              {useClientPrice ? "Kundpris" : "Konsultpris"}:
            </span>
            <input
              type="number"
              name="price"
              defaultValue={800}
              onChange={(e) => setPrice(+e.target.value)}
            />
          </label>
          <label className="label">
            <span className="label-text">Mellanskär, heltal i %:</span>
            <input
              type="number"
              name="price"
              defaultValue={0}
              onChange={(e) => setFee(+e.target.value)}
            />
          </label>
        </form>
        <div className="result">
          <p>
            {useClientPrice ? (
              <>
                <div>
                  Konsulten får ut: {clientToConsultantPrice(price, fee)} kr
                </div>
                <div>Kunden betalar: {price} kr</div>
              </>
            ) : (
              <>
                <div>Konsulten får ut: {price} kr</div>
                <div>
                  Kunden betalar: {consultantToClientPrice(price, fee)} kr
                </div>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  )
}

export default App
