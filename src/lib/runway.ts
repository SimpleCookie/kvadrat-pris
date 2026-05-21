import { SOCIAL_FEE_RATE } from './forecast'

export type BurnScenario = 'full' | 'fixed-only'

export interface RunwayInputs {
  monthlySalaryGross: number
  overheadPerYear: number
  pensionPerMonth: number
  annualRetainedInCompany: number
  bufferMonths: number
  scenario: BurnScenario
}

export interface RunwayResult {
  monthlyBurn: number
  targetBuffer: number
  annualSavings: number
  monthsToTarget: number | null
  status: 'reached' | 'reachable' | 'unreachable'
}

export const calculateMonthlyBurn = (
  monthlySalaryGross: number,
  overheadPerYear: number,
  pensionPerMonth: number,
  scenario: BurnScenario,
): number => {
  if (scenario === 'fixed-only') return Math.round(overheadPerYear / 12)
  const socialFeesMonthly = monthlySalaryGross * SOCIAL_FEE_RATE
  return Math.round(monthlySalaryGross + socialFeesMonthly + overheadPerYear / 12 + pensionPerMonth)
}

export const calculateRunway = (inputs: RunwayInputs): RunwayResult => {
  const {
    monthlySalaryGross,
    overheadPerYear,
    pensionPerMonth,
    annualRetainedInCompany,
    bufferMonths,
    scenario,
  } = inputs

  const monthlyBurn = calculateMonthlyBurn(monthlySalaryGross, overheadPerYear, pensionPerMonth, scenario)
  const targetBuffer = monthlyBurn * bufferMonths
  const annualSavings = annualRetainedInCompany

  let status: RunwayResult['status']
  let monthsToTarget: number | null

  if (targetBuffer === 0) {
    status = 'reached'
    monthsToTarget = 0
  } else if (annualSavings <= 0) {
    status = 'unreachable'
    monthsToTarget = null
  } else {
    status = 'reachable'
    monthsToTarget = Math.ceil((targetBuffer / annualSavings) * 12)
  }

  return { monthlyBurn, targetBuffer, annualSavings, monthsToTarget, status }
}

export const calculateBreakEvenRevenue = (
  monthlySalaryGross: number,
  overheadPerYear: number,
  pensionPerMonth: number,
): number =>
  Math.round(monthlySalaryGross * 12 * (1 + SOCIAL_FEE_RATE) + overheadPerYear + pensionPerMonth * 12)

export const breakEvenPriceForHours = (revenue: number, hours: number): number =>
  hours > 0 ? revenue / hours : 0

export const breakEvenHoursForPrice = (revenue: number, price: number): number =>
  price > 0 ? revenue / price : 0
