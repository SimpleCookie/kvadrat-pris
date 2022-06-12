import { ClientPrice } from "./ClientPrice"
import { ConsultantPrice } from "./ConsultantPrice"

export interface Quota {
  formula: string
  price: number
}

interface Props {
  useClientPrice: boolean
  price: number
  fee: number
}

export const Quotation = ({ useClientPrice, price, fee }: Props) => {

  const PriceRender = () => useClientPrice ? (<ConsultantPrice price={price} fee={fee} />) : <ClientPrice price={price} fee={fee} />

  return (
    <div style={{ display: "flex", alignItems: "space-between" }}>
      <p style={{ paddingRight: "1em" }}>
        <div>17 % går till Kvadrat</div>
        <div>{fee} % går till mellanhänder</div>
      </p>
      <p>
        <PriceRender />
      </p>
    </div>
  )
}