import {
  calculateForecast,
  SCHABLONBELOPP,
  SOCIAL_FEE_RATE,
  CORPORATE_TAX_RATE,
  DIVIDEND_TAX_RATE,
} from './forecast'

const base = {
  consultantRatePerHour: 800,
  billableHoursPerYear: 1_600,
  monthlySalaryGross: 53_600,
  overheadPerYear: 25_000,
  kommunalskatt: 32,
}

describe('calculateForecast', () => {
  it('calculates gross revenue', () => {
    const r = calculateForecast(base)
    expect(r.grossRevenue).toBe(800 * 1_600) // 1_280_000
  })

  it('calculates annual salary and social fees', () => {
    const r = calculateForecast(base)
    expect(r.salaryGross).toBe(53_600 * 12)
    expect(r.socialFees).toBe(Math.round(r.salaryGross * SOCIAL_FEE_RATE))
  })

  it('pre-tax profit equals revenue minus all company costs', () => {
    const r = calculateForecast(base)
    expect(r.preTaxProfit).toBe(
      r.grossRevenue - r.overhead - r.salaryGross - r.socialFees
    )
  })

  it('calculates corporate tax when profit is positive', () => {
    const r = calculateForecast(base)
    expect(r.preTaxProfit).toBeGreaterThan(0)
    expect(r.corporateTax).toBe(Math.round(r.preTaxProfit * CORPORATE_TAX_RATE))
  })

  it('corporate tax and profit after tax are 0 when pre-tax profit is negative', () => {
    const r = calculateForecast({ ...base, consultantRatePerHour: 100 })
    expect(r.corporateTax).toBe(0)
    expect(r.profitAfterTax).toBe(0)
  })

  it('dividend is capped at schablonbelopp', () => {
    const r = calculateForecast(base)
    expect(r.dividendGross).toBeLessThanOrEqual(SCHABLONBELOPP)
    expect(r.dividendTax).toBe(Math.round(r.dividendGross * DIVIDEND_TAX_RATE))
    expect(r.dividendNet).toBe(r.dividendGross - r.dividendTax)
  })

  it('retained in company is non-negative', () => {
    const r = calculateForecast(base)
    expect(r.retainedInCompany).toBeGreaterThanOrEqual(0)
    expect(r.retainedInCompany).toBe(r.profitAfterTax - r.dividendGross)
  })

  it('personal take-home equals net salary plus net dividend', () => {
    const r = calculateForecast(base)
    expect(r.incomeTaxOnSalary).toBe(Math.round(r.salaryGross * (base.kommunalskatt / 100)))
    expect(r.salaryNet).toBe(r.salaryGross - r.incomeTaxOnSalary)
    expect(r.totalTakeHomeYear).toBe(r.salaryNet + r.dividendNet)
  })

  it('monthly take-home is rounded annual divided by 12', () => {
    const r = calculateForecast(base)
    expect(r.totalTakeHomeMonth).toBe(Math.round(r.totalTakeHomeYear / 12))
  })
})
