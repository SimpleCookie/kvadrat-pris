import { Quota } from "./Quotation"

const consultantToClientPrice = (price: number, fee: number): Quota => {
  if (fee === 0) {
    return {
      formula: `${price}/0.83`,
      price: Math.round(price / 0.83)
    }
  }
  return {
    formula: `${price}/0.83/(1-${fee}/100)`,
    price: Math.round(price / 0.83 / (1 - fee / 100))
  }
}

interface Props {
  price: number
  fee: number
}

export const ClientPrice = ({ price, fee }: Props) => {
  const quota = consultantToClientPrice(price, fee)
  return (
    <>
      <div>Konsulten får ut: {price} kr</div>
      <div>Kunden betalar: {quota.price} kr</div>
      <div>Formel: {quota.formula }</div>
    </>
  )
}