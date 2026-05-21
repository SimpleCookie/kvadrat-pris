export type Lang = 'sv' | 'en'

export type T = {
  // Header
  title: string
  subtitle: string
  viewForecast: string
  viewSimple: string
  // Price fields
  consultantPrice: string
  consultantPriceHint: string
  consultantPriceAria: string
  clientPrice: string
  clientPriceHint: string
  clientPriceAria: string
  // Fees
  feesLegend: string
  kvadratShare: string
  kvadratShareTooltip: string
  middleman: string
  middlemanTooltip: string
  // Settings
  settingsLegend: string
  billableHours: string
  billableHoursTooltip: string
  billableHoursAria: string
  billableHoursHint: string
  monthlySalary: string
  monthlySalaryTooltip: string
  monthlySalaryAria: string
  overheadLabel: string
  overheadTooltip: string
  overheadAria: string
  municipalTax: string
  municipalTaxAria: string
  pension: string
  pensionTooltip: string
  pensionAria: string
  pensionUnitPercent: string
  pensionUnitFixed: string
  pensionRow: string
  pensionRowTooltip: string
  pensionSavingsNote: string
  pensionExceedsRetained: string
  // Simple view breakdown
  breakdownTitle: string
  clientPays: string
  middlemanCutRow: (pct: number) => string
  kvadratCutRow: (pct: number) => string
  consultantGets: string
  reset: string
  // Advanced view
  enterPrice: string
  perYearGross: string
  kvadratShareLabel: string
  perYear: string
  companyBlock: string
  grossRevenue: string
  overheadRow: string
  salaryGrossRow: (monthly: string) => string
  socialFees: string
  preTaxProfit: string
  corporateTax: string
  profitAfterTax: string
  dividend: string
  dividendTooltip: (amount: string) => string
  dividendTax: string
  retainedLabel: string
  retainedTooltip: string
  retainedAriaLabel: string
  retainedNote: string
  youBlock: string
  netSalaryYear: string
  netDividend: string
  netPerYear: string
  netPerMonth: string
  employeeBlock: string
  employeeTooltip: string
  employeeAriaLabel: string
  employeeComparisonText: (amount: string) => string
  employeeComparisonTextWithPension: (salary: string, pension: string) => string
  disclaimer: (rate: number) => string
}

export const translations: Record<Lang, T> = {
  sv: {
    title: 'Kvadrat Priskalkylator',
    subtitle: 'Beräkna konsult- och kundpris',
    viewForecast: 'Prognos →',
    viewSimple: '← Enkel vy',

    consultantPrice: 'Konsultpris',
    consultantPriceHint: 'Det du tar hem',
    consultantPriceAria: 'Konsultpris i kronor per timme',
    clientPrice: 'Kundpris',
    clientPriceHint: 'Vad kunden betalar',
    clientPriceAria: 'Kundpris i kronor per timme',

    feesLegend: 'Avgifter',
    kvadratShare: 'Kvadrats andel',
    kvadratShareTooltip: 'Den andel av kundpriset som Kvadrat behåller',
    middleman: 'Mellanskär',
    middlemanTooltip: 'Avgift för eventuell förmedlare',

    settingsLegend: 'Inställningar',
    billableHours: 'Timmar/år',
    billableHoursTooltip: 'Antal fakturerbara timmar per år.',
    billableHoursAria: 'Fakturerbara timmar per år',
    billableHoursHint: 'Heltid är ca 2\u202f080\u00a0h/år. Räkna bort semester, röda dagar och intern tid\u202f—\u202f1\u202f600\u00a0h är en vanlig utgångspunkt.',
    monthlySalary: 'Månadslön',
    monthlySalaryTooltip: 'Statlig skattebrytpunkt 2026: ~643\u202f100\u00a0kr/år ≈ 53\u202f600\u00a0kr/mån. Lön över detta beskattas hårdare.',
    monthlySalaryAria: 'Månadslön i kronor brutto',
    overheadLabel: 'Overhead/år',
    overheadTooltip: 'Bokföring, försäkring, utrustning, programvaror m.m.',
    overheadAria: 'Overheadkostnader per år i kronor',
    municipalTax: 'Kommunalskatt',
    municipalTaxAria: 'Kommunalskatt i procent',
    pension: 'Pension / sparande',
    pensionTooltip: 'Tjänstepension (ITP1: 4,5\u202f% under 7,5\u202fIBB, 30\u202f% över) eller kapitalförsäkring/ISK. Ange vad du vill jämföra med.',
    pensionAria: 'Pension eller sparande per månad',
    pensionUnitPercent: '% av lön',
    pensionUnitFixed: 'kr/mån',
    pensionRow: 'Pension / sparande',
    pensionRowTooltip: 'Budgetpost per år. Minskar \"kvar i bolaget\"\u202f—\u202fingår inte i skatteberäkningen.',    pensionSavingsNote: 'ditt sparande',    pensionExceedsRetained: '* Avsättningen är större än kvar i bolaget\u202f—\u202ftäcks delvis av lön eller utdelning.',

    breakdownTitle: 'Fördelning per timme',
    clientPays: 'Kunden betalar',
    middlemanCutRow: (pct) => `Mellanskär (${pct}%)`,
    kvadratCutRow: (pct) => `Kvadrats andel (${pct}%)`,
    consultantGets: 'Konsulten får ut',
    reset: 'Återställ',

    enterPrice: 'Ange ett konsultpris i fältet till vänster.',
    perYearGross: '/år (brutto)',
    kvadratShareLabel: 'Kvadrats andel:',
    perYear: '/år',
    companyBlock: 'Bolaget',
    grossRevenue: 'Intäkter (brutto)',
    overheadRow: 'Overhead',
    salaryGrossRow: (monthly) => `Lön brutto (${monthly}\u00a0kr/mån)`,
    socialFees: 'Arbetsgivaravgift (31,42%)',
    preTaxProfit: 'Vinst före bolagsskatt',
    corporateTax: 'Bolagsskatt (20,6%)',
    profitAfterTax: 'Vinst efter skatt',
    dividend: 'Utdelning',
    dividendTooltip: (amount) => `Förenklingsregeln: max ${amount}/år beskattas med 20%.`,
    dividendTax: 'Utdelningsskatt (20%)',
    retainedLabel: 'Kvar i bolaget',
    retainedTooltip: 'Dina pengar — kan tas ut som framtida lön eller utdelning när det passar.',
    retainedAriaLabel: 'Dina pengar — kan tas ut som framtida lön eller utdelning',
    retainedNote: 'dina pengar',
    youBlock: 'Du — netto',
    netSalaryYear: 'Nettolön/år',
    netDividend: '+ Netto utdelning',
    netPerYear: 'Netto per år',
    netPerMonth: 'Netto per månad',
    employeeBlock: 'Som anställd — jämförelse',
    employeeTooltip: 'Bruttolön som krävs för att en anställd ska nå samma nettoinkomst. Utan jobbskatteavdrag (reell lön är något lägre).',
    employeeAriaLabel: 'Jämförelse med anställd',
    employeeComparisonText: (amount) => `För motsvarande nettolön som anställd krävs ${amount}/mån i bruttolön.`,
    employeeComparisonTextWithPension: (salary, pension) => `För motsvarande nettolön som anställd krävs ${salary} i bruttolön, plus ${pension}/mån i pension/sparande.`,
    disclaimer: (rate) => `* Netto = efter kommunalskatt (${rate}%) och utdelningsskatt. Jobbskatteavdrag ej inräknat. Förenklingsregeln antagen för utdelning.`,
  },

  en: {
    title: 'Kvadrat Price Calculator',
    subtitle: 'Calculate consultant and client rate',
    viewForecast: 'Forecast →',
    viewSimple: '← Simple view',

    consultantPrice: 'Consultant rate',
    consultantPriceHint: 'What you keep',
    consultantPriceAria: 'Consultant rate in SEK per hour',
    clientPrice: 'Client rate',
    clientPriceHint: 'What the client pays',
    clientPriceAria: 'Client rate in SEK per hour',

    feesLegend: 'Fees',
    kvadratShare: "Kvadrat's share",
    kvadratShareTooltip: "The share of the client rate that Kvadrat keeps",
    middleman: 'Middleman fee',
    middlemanTooltip: 'Fee for any intermediary',

    settingsLegend: 'Settings',
    billableHours: 'Hours/year',
    billableHoursTooltip: 'Number of billable hours per year.',
    billableHoursAria: 'Billable hours per year',
    billableHoursHint: 'Full-time is ~2,080\u00a0h/year. Deduct holiday, public holidays and internal time\u202f—\u202f1,600\u00a0h is a common starting point.',
    monthlySalary: 'Monthly salary',
    monthlySalaryTooltip: 'State income tax threshold 2026: ~643,100\u00a0kr/year ≈ 53,600\u00a0kr/month. Salary above this is taxed at a higher rate.',
    monthlySalaryAria: 'Monthly gross salary in SEK',
    overheadLabel: 'Overhead/year',
    overheadTooltip: 'Accounting, insurance, equipment, software, etc.',
    overheadAria: 'Annual overhead costs in SEK',
    municipalTax: 'Municipal tax',
    municipalTaxAria: 'Municipal tax rate in percent',
    pension: 'Pension / savings',
    pensionTooltip: 'Occupational pension (ITP1: 4.5\u202f% below 7.5\u202fIBB, 30\u202f% above) or kapitalförsäkring/ISK. Enter what you want to compare against.',
    pensionAria: 'Pension or savings per month',
    pensionUnitPercent: '% of salary',
    pensionUnitFixed: 'kr/month',
    pensionRow: 'Pension / savings',
    pensionRowTooltip: 'Annual budget earmark. Reduces \"retained in company\"\u202f—\u202fnot included in tax calculations.',    pensionSavingsNote: 'your savings',    pensionExceedsRetained: '* Earmark exceeds retained amount\u202f—\u202fpartly covered by salary or dividend.',

    breakdownTitle: 'Per-hour breakdown',
    clientPays: 'Client pays',
    middlemanCutRow: (pct) => `Middleman fee (${pct}%)`,
    kvadratCutRow: (pct) => `Kvadrat's share (${pct}%)`,
    consultantGets: 'Consultant keeps',
    reset: 'Reset',

    enterPrice: 'Enter a consultant rate in the field on the left.',
    perYearGross: '/year (gross)',
    kvadratShareLabel: "Kvadrat's share:",
    perYear: '/year',
    companyBlock: 'The company',
    grossRevenue: 'Gross revenue',
    overheadRow: 'Overhead',
    salaryGrossRow: (monthly) => `Gross salary (${monthly}\u00a0kr/month)`,
    socialFees: 'Payroll tax (31.42%)',
    preTaxProfit: 'Pre-tax profit',
    corporateTax: 'Corporate tax (20.6%)',
    profitAfterTax: 'Post-tax profit',
    dividend: 'Dividend',
    dividendTooltip: (amount) => `Simplified rule: up to ${amount}/year is taxed at 20%.`,
    dividendTax: 'Dividend tax (20%)',
    retainedLabel: 'Retained in company',
    retainedTooltip: 'Your money — can be withdrawn as future salary or dividend when it suits.',
    retainedAriaLabel: 'Your money — can be withdrawn as future salary or dividend',
    retainedNote: 'your money',
    youBlock: 'You — net',
    netSalaryYear: 'Net salary/year',
    netDividend: '+ Net dividend',
    netPerYear: 'Net per year',
    netPerMonth: 'Net per month',
    employeeBlock: 'As an employee — comparison',
    employeeTooltip: 'Gross salary required for an employee to reach the same net income. Excluding job tax credit (actual salary is slightly lower).',
    employeeAriaLabel: 'Comparison with employee',
    employeeComparisonText: (amount) => `The equivalent net income as an employee requires ${amount}/month gross salary.`,
    employeeComparisonTextWithPension: (salary, pension) => `The equivalent net income as an employee requires ${salary} gross salary, plus ${pension}/month in pension/savings.`,
    disclaimer: (rate) => `* Net = after municipal tax (${rate}%) and dividend tax. Job tax credit not included. Simplified dividend rule assumed.`,
  },
}
