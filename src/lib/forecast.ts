// ─── 2026 Swedish AB Tax Constants ────────────────────────────────────────

/** Arbetsgivaravgift (employer social contribution) */
export const SOCIAL_FEE_RATE = 0.3142

/** Bolagsskatt (corporate income tax) */
export const CORPORATE_TAX_RATE = 0.206

/**
 * Förenklingsregeln grundbelopp 2026: 4 × IBB (80 600 kr) = 322 400 kr.
 * Nya 3:12-reglerna (gäller från 2026). Max lågbeskattad utdelning per år från ett AB.
 */
export const SCHABLONBELOPP = 322_400

/** Tax rate on dividends within gränsbeloppet (3:12-reglerna, förenklingsregeln) */
export const DIVIDEND_TAX_RATE = 0.2

/** Monthly gross salary target just below statlig skattebrytpunkt (~643 100 kr/år 2026) */
export const DEFAULT_MONTHLY_SALARY = 53_600

/** Default annual fixed overhead: accounting, insurance, equipment etc. */
export const DEFAULT_OVERHEAD = 25_000

/** Default billable hours per year: 40 h/week × 40 working weeks */
export const DEFAULT_BILLABLE_HOURS = 1_600

/** Default kommunalskatt (%) */
export const DEFAULT_KOMMUNALSKATT = 32

// ─── Types ────────────────────────────────────────────────────────────────

export interface ForecastInputs {
  /** Consultant's hourly rate (what the AB receives from Kvadrat per hour) */
  consultantRatePerHour: number
  billableHoursPerYear: number
  /** Monthly gross salary paid by the AB to the owner-employee */
  monthlySalaryGross: number
  /** Fixed annual company costs (accounting, insurance, etc.) */
  overheadPerYear: number
  /** Municipal income tax rate in % (e.g. 32) */
  kommunalskatt: number
}

export interface ForecastResult {
  grossRevenue: number
  overhead: number
  salaryGross: number
  socialFees: number
  preTaxProfit: number
  corporateTax: number
  profitAfterTax: number
  dividendGross: number
  dividendTax: number
  dividendNet: number
  retainedInCompany: number
  incomeTaxOnSalary: number
  salaryNet: number
  totalTakeHomeYear: number
  totalTakeHomeMonth: number
}

/** Statlig skattebrytpunkt 2026 (above this, +20 % statlig skatt applies) */
export const STATLIG_SKATTEBRYTPUNKT = 643_100

/**
 * Calculates the gross salary a regular employee would need to earn to achieve
 * the same net income as the consultant. Uses simplified kommunalskatt only
 * (no jobbskatteavdrag), consistent with the rest of the app.
 */
export const calculateEquivalentEmployeeGross = (
  netIncome: number,
  kommunalskatt: number,
): number => {
  const rate = kommunalskatt / 100

  // First try: no statlig skatt
  const grossSimple = netIncome / (1 - rate)
  if (grossSimple <= STATLIG_SKATTEBRYTPUNKT) {
    return Math.round(grossSimple)
  }

  // Progressive: Net = Gross × (0.80 − rate) + STATLIG_SKATTEBRYTPUNKT × 0.20
  // → Gross = (Net − STATLIG_SKATTEBRYTPUNKT × 0.20) / (0.80 − rate)
  const gross = (netIncome - STATLIG_SKATTEBRYTPUNKT * 0.2) / (0.8 - rate)
  return Math.round(gross)
}

// ─── Calculation ──────────────────────────────────────────────────────────

export const calculateForecast = (inputs: ForecastInputs): ForecastResult => {
  const {
    consultantRatePerHour,
    billableHoursPerYear,
    monthlySalaryGross,
    overheadPerYear,
    kommunalskatt,
  } = inputs

  // Company side
  const grossRevenue = consultantRatePerHour * billableHoursPerYear
  const salaryGross = monthlySalaryGross * 12
  const socialFees = Math.round(salaryGross * SOCIAL_FEE_RATE)
  const preTaxProfit = grossRevenue - overheadPerYear - salaryGross - socialFees
  const corporateTax = preTaxProfit > 0 ? Math.round(preTaxProfit * CORPORATE_TAX_RATE) : 0
  const profitAfterTax = Math.max(0, preTaxProfit - corporateTax)

  // Dividend — capped at förenklingsregelns schablonbelopp for the low 20% rate
  const dividendGross = Math.min(profitAfterTax, SCHABLONBELOPP)
  const dividendTax = Math.round(dividendGross * DIVIDEND_TAX_RATE)
  const dividendNet = dividendGross - dividendTax
  const retainedInCompany = profitAfterTax - dividendGross

  // Personal side
  const incomeTaxOnSalary = Math.round(salaryGross * (kommunalskatt / 100))
  const salaryNet = salaryGross - incomeTaxOnSalary

  const totalTakeHomeYear = salaryNet + dividendNet
  const totalTakeHomeMonth = Math.round(totalTakeHomeYear / 12)

  return {
    grossRevenue,
    overhead: overheadPerYear,
    salaryGross,
    socialFees,
    preTaxProfit,
    corporateTax,
    profitAfterTax,
    dividendGross,
    dividendTax,
    dividendNet,
    retainedInCompany,
    incomeTaxOnSalary,
    salaryNet,
    totalTakeHomeYear,
    totalTakeHomeMonth,
  }
}
