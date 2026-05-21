import { calculateClientPrice, calculateConsultantPrice, clampFee } from '../lib/pricing'
import { calculatePensionPerMonth } from '../lib/forecast'
import { useAppStore } from './useAppStore'

export const usePricingDerived = () => {
  const activeField = useAppStore(s => s.activeField)
  const activeValue = useAppStore(s => s.activeValue)
  const kvadratFee = useAppStore(s => s.kvadratFee)
  const middlemanFee = useAppStore(s => s.middlemanFee)

  const parsedActive = parseFloat(activeValue) || 0
  const parsedKvadrat = clampFee(parseFloat(kvadratFee) || 0)
  const parsedMiddleman = clampFee(parseFloat(middlemanFee) || 0)

  const consultantPrice =
    activeField === 'consultant'
      ? parsedActive
      : calculateConsultantPrice(parsedActive, parsedKvadrat, parsedMiddleman)

  const clientPrice =
    activeField === 'client'
      ? parsedActive
      : calculateClientPrice(parsedActive, parsedKvadrat, parsedMiddleman)

  const middlemanCut = Math.round(clientPrice * (parsedMiddleman / 100))
  const afterMiddleman = clientPrice - middlemanCut
  const kvadratCut = afterMiddleman - consultantPrice

  return {
    consultantPrice,
    clientPrice,
    middlemanCut,
    kvadratCut,
    parsedKvadrat,
    parsedMiddleman,
    hasValue: parsedActive > 0,
  }
}

export const usePensionPerMonth = () => {
  const pensionMode = useAppStore(s => s.pensionMode)
  const pensionValue = useAppStore(s => s.pensionValue)
  const monthlySalary = useAppStore(s => s.monthlySalary)
  return calculatePensionPerMonth({
    mode: pensionMode,
    value: parseFloat(pensionValue) || 0,
    monthlySalaryGross: parseInt(monthlySalary) || 0,
  })
}
