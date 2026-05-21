import { describe, it, expect } from 'vitest'
import {
  calculateMonthlyBurn,
  calculateRunway,
  calculateBreakEvenRevenue,
  breakEvenPriceForHours,
  breakEvenHoursForPrice,
} from './runway'
import { SOCIAL_FEE_RATE } from './forecast'

describe('calculateMonthlyBurn', () => {
  it('full scenario includes salary, social fees, overhead and pension', () => {
    const salary = 53_600
    const overhead = 25_000
    const pension = 2_412
    const result = calculateMonthlyBurn(salary, overhead, pension, 'full')
    const expected = Math.round(salary + salary * SOCIAL_FEE_RATE + overhead / 12 + pension)
    expect(result).toBe(expected)
  })

  it('fixed-only scenario includes only overhead / 12', () => {
    const result = calculateMonthlyBurn(53_600, 25_000, 2_412, 'fixed-only')
    expect(result).toBe(Math.round(25_000 / 12))
  })

  it('fixed-only excludes pension', () => {
    const withPension = calculateMonthlyBurn(53_600, 25_000, 5_000, 'fixed-only')
    const withoutPension = calculateMonthlyBurn(53_600, 25_000, 0, 'fixed-only')
    expect(withPension).toBe(withoutPension)
  })

  it('full scenario includes pension', () => {
    const without = calculateMonthlyBurn(53_600, 25_000, 0, 'full')
    const withPension = calculateMonthlyBurn(53_600, 25_000, 2_000, 'full')
    expect(withPension).toBe(without + 2_000)
  })
})

describe('calculateRunway', () => {
  const base = {
    monthlySalaryGross: 53_600,
    overheadPerYear: 25_000,
    pensionPerMonth: 2_412,
    bufferMonths: 3,
    scenario: 'full' as const,
  }

  it('returns reachable status when savings > 0', () => {
    const result = calculateRunway({ ...base, annualRetainedInCompany: 100_000 })
    expect(result.status).toBe('reachable')
    expect(result.monthsToTarget).not.toBeNull()
  })

  it('returns unreachable when annualRetainedInCompany is 0', () => {
    const result = calculateRunway({ ...base, annualRetainedInCompany: 0 })
    expect(result.status).toBe('unreachable')
    expect(result.monthsToTarget).toBeNull()
  })

  it('returns unreachable when annualRetainedInCompany is negative', () => {
    const result = calculateRunway({ ...base, annualRetainedInCompany: -50_000 })
    expect(result.status).toBe('unreachable')
  })

  it('monthsToTarget calculation is correct', () => {
    const monthlyBurn = calculateMonthlyBurn(base.monthlySalaryGross, base.overheadPerYear, base.pensionPerMonth, 'full')
    const targetBuffer = monthlyBurn * 3
    const annual = 200_000
    const expected = Math.ceil((targetBuffer / annual) * 12)
    const result = calculateRunway({ ...base, annualRetainedInCompany: annual })
    expect(result.monthsToTarget).toBe(expected)
  })

  it('fixed-only scenario has lower monthly burn than full', () => {
    const full = calculateRunway({ ...base, annualRetainedInCompany: 100_000, scenario: 'full' })
    const fixed = calculateRunway({ ...base, annualRetainedInCompany: 100_000, scenario: 'fixed-only' })
    expect(fixed.monthlyBurn).toBeLessThan(full.monthlyBurn)
  })

  it('longer buffer means more months to target', () => {
    const r3 = calculateRunway({ ...base, annualRetainedInCompany: 100_000, bufferMonths: 3 })
    const r6 = calculateRunway({ ...base, annualRetainedInCompany: 100_000, bufferMonths: 6 })
    expect(r6.monthsToTarget!).toBeGreaterThan(r3.monthsToTarget!)
  })

  it('annualSavings reflects annualRetainedInCompany', () => {
    const result = calculateRunway({ ...base, annualRetainedInCompany: 150_000 })
    expect(result.annualSavings).toBe(150_000)
  })
})

describe('calculateBreakEvenRevenue', () => {
  it('matches hand calculation', () => {
    const salary = 53_600
    const overhead = 25_000
    const pension = 2_412
    const expected = Math.round(salary * 12 * (1 + SOCIAL_FEE_RATE) + overhead + pension * 12)
    expect(calculateBreakEvenRevenue(salary, overhead, pension)).toBe(expected)
  })

  it('increases with higher salary', () => {
    const low = calculateBreakEvenRevenue(30_000, 25_000, 0)
    const high = calculateBreakEvenRevenue(60_000, 25_000, 0)
    expect(high).toBeGreaterThan(low)
  })

  it('increases with higher pension', () => {
    const low = calculateBreakEvenRevenue(53_600, 25_000, 0)
    const high = calculateBreakEvenRevenue(53_600, 25_000, 2_000)
    expect(high).toBeGreaterThan(low)
  })
})

describe('breakEvenPriceForHours / breakEvenHoursForPrice', () => {
  it('are inverses of each other', () => {
    const revenue = 900_000
    const hours = 1_600
    const price = breakEvenPriceForHours(revenue, hours)
    const backToHours = breakEvenHoursForPrice(revenue, price)
    expect(Math.round(backToHours)).toBe(hours)
  })

  it('returns 0 for zero hours', () => {
    expect(breakEvenPriceForHours(900_000, 0)).toBe(0)
  })

  it('returns 0 for zero price', () => {
    expect(breakEvenHoursForPrice(900_000, 0)).toBe(0)
  })
})
