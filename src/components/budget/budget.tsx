import { useState } from "react"
import { BasicNumberInput } from "../BasicInput"

interface Props {
  price: number
}

const hoursInMonth = 160
const monthlyIncome = (price: number) => hoursInMonth * price

export const Budget = ({ price }: Props) => {
  const [expenses, setExpenses] = useState(0)
  const income = monthlyIncome(price)
  return (
    <div>
      <BasicNumberInput label="Samlade utgifter" onChange={setExpenses} />
      <div>{income} kr i månadsinkomst</div>
      <div>{income - expenses} kr kvar efter utgifter</div>
    </div>
  )
}