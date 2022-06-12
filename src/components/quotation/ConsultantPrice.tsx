import { Quota } from "./Quotation"


export const clientToConsultantPrice = (price: number, fee: number): Quota => {
  if (fee === 0) {
    return {
      formula: `${price} * 0.83`,
      price: Math.round(price * 0.83)
    }
  }
  return {
    formula: `${price} * (1 - ${fee}/100) * 0.83`, 
    price: Math.round(price * (1 - fee / 100) * 0.83)
  }
}

interface Props {
  price: number
  fee: number
}

export const ConsultantPrice = ({ price, fee }: Props) => {
  const quota = clientToConsultantPrice(price, fee)
  return (
    <>
      <div>
        Konsulten får ut: {quota.price} kr
                </div>
      <div>Kunden betalar: {price} kr</div>
      <div>Formel: {quota.formula}</div>
    </>
  )
}