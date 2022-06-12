import { useState } from "react"
import "./App.css"
import { Quotation } from "./components/quotation/Quotation"


const App = () => {
  const [useClientPrice, setUseClientPrice] = useState(false)
  const [price, setPrice] = useState(800)
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
              defaultValue={price}
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
          <Quotation useClientPrice={useClientPrice} price={price} fee={fee} />
        </div>
      </main>
    </div>
  )
}

export default App
