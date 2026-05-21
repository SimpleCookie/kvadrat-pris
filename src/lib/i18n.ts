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
  // Future tab
  futureTab: string
  futureTabAria: string
  // Runway
  runwayTitle: string
  runwayIntro: string
  bufferMonthsLabel: string
  bufferMonthsTooltip: string
  scenarioLabel: string
  scenarioFull: string
  scenarioFixedOnly: string
  scenarioTooltip: string
  monthlyBurnLabel: string
  targetBufferLabel: string
  annualSavingsLabel: string
  runwayHeadline: (months: number, amount: string) => string
  runwayUnreachable: string
  runwayReached: string
  runwayDisclaimerDividend: string
  runwayDisclaimerPension: string
  // Break-even
  breakEvenTitle: string
  breakEvenIntro: string
  breakEvenCurrent: (hours: string, price: string, revenue: string) => string
  breakEvenHoursLabel: string
  breakEvenPriceLabel: string
  breakEvenRevenueLabel: string
  breakEvenOutOfRange: string
  breakEvenReset: string
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
    viewForecast: 'Avancerad',
    viewSimple: 'Enkel',

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
    pensionRowTooltip: 'Budgetpost per år. Minskar \"kvar i bolaget\"\u202f—\u202fingår inte i skatteberäkningen.', pensionSavingsNote: 'ditt sparande', pensionExceedsRetained: '* Avsättningen är större än kvar i bolaget\u202f—\u202ftäcks delvis av lön eller utdelning.',

    futureTab: 'Framtid',
    futureTabAria: 'Framtidsvy',
    runwayTitle: 'Kassaflödesbuffert',
    runwayIntro: 'Hur lång tid tar det att spara ihop en kassabuffert för en period utan intäkter?',
    bufferMonthsLabel: 'Buffert (månader)',
    bufferMonthsTooltip: 'Hur många månaders drift du vill klara utan inkomst.',
    scenarioLabel: 'Burn-scenario',
    scenarioFull: 'Full drift',
    scenarioFixedOnly: 'Bara fasta kostnader',
    scenarioTooltip: 'Full drift: lön + sociala avgifter + overhead + pension fortsätter. Bara fasta kostnader: enbart overhead\u202f—\u202flönen pausad.',
    monthlyBurnLabel: 'Månadlig burn',
    targetBufferLabel: 'Målbuffert',
    annualSavingsLabel: 'Sparas per år (kvar i bolaget)',
    runwayHeadline: (months, amount) => `Det tar ca ${months}\u00a0månader att spara ihop ${amount}.`,
    runwayUnreachable: 'Med nuvarande nivå går det inte att bygga buffert\u202f—\u202fvinsten kvar i bolaget är 0 eller negativ.',
    runwayReached: 'Buffertmålet är redan uppnått med nuvarande inställningar.',
    runwayDisclaimerDividend: 'Utdelningen räknas inte som buffert i bolaget\u202f—\u202fden tas ut till dig privat.',
    runwayDisclaimerPension: 'Pensionsavsättning räknas som öronmärkt och ingår inte i buffertmålet.',
    breakEvenTitle: 'Brytpunkt\u202f— timmar och pris',
    breakEvenIntro: 'Vid den här kombinationen täcker intäkterna exakt lön, sociala avgifter, overhead och pension.',
    breakEvenCurrent: (hours, price, revenue) => `Nu: ${hours}\u00a0h \u00d7 ${price}\u00a0kr/h\u202f=\u202f${revenue}/år`,
    breakEvenHoursLabel: 'Timmar/år',
    breakEvenPriceLabel: 'Pris kr/h',
    breakEvenRevenueLabel: 'Brytpunktsintäkt',
    breakEvenOutOfRange: 'Utanför intervallet',
    breakEvenReset: 'Återställ',

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
    viewForecast: 'Advanced',
    viewSimple: 'Simple',

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
    pensionRowTooltip: 'Annual budget earmark. Reduces \"retained in company\"\u202f—\u202fnot included in tax calculations.', pensionSavingsNote: 'your savings', pensionExceedsRetained: '* Earmark exceeds retained amount\u202f—\u202fpartly covered by salary or dividend.',

    futureTab: 'Future',
    futureTabAria: 'Future view',
    runwayTitle: 'Cash flow buffer',
    runwayIntro: 'How long does it take to save a buffer to sustain operations during a period without income?',
    bufferMonthsLabel: 'Buffer (months)',
    bufferMonthsTooltip: 'How many months of operations you want to sustain without income.',
    scenarioLabel: 'Burn scenario',
    scenarioFull: 'Full operations',
    scenarioFixedOnly: 'Fixed costs only',
    scenarioTooltip: 'Full operations: salary + payroll tax + overhead + pension continue. Fixed costs only: overhead only\u202f—\u202fsalary paused.',
    monthlyBurnLabel: 'Monthly burn',
    targetBufferLabel: 'Target buffer',
    annualSavingsLabel: 'Saved per year (retained in company)',
    runwayHeadline: (months, amount) => `It takes approximately ${months}\u00a0months to save ${amount}.`,
    runwayUnreachable: 'At the current level it is not possible to build a buffer\u202f—\u202fprofit retained in company is 0 or negative.',
    runwayReached: 'The buffer target is already met with current settings.',
    runwayDisclaimerDividend: 'Dividend is not counted as company buffer\u202f—\u202fit is withdrawn to your personal finances.',
    runwayDisclaimerPension: 'Pension earmark is not included in the buffer target.',
    breakEvenTitle: 'Break-even\u202f— hours and rate',
    breakEvenIntro: 'At this combination, revenue exactly covers salary, payroll tax, overhead and pension.',
    breakEvenCurrent: (hours, price, revenue) => `Now: ${hours}\u00a0h \u00d7 ${price}\u00a0kr/h\u202f=\u202f${revenue}/year`,
    breakEvenHoursLabel: 'Hours/year',
    breakEvenPriceLabel: 'Rate kr/h',
    breakEvenRevenueLabel: 'Break-even revenue',
    breakEvenOutOfRange: 'Out of range',
    breakEvenReset: 'Reset',

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
