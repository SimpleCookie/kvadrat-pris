export const clampFee = (fee: number): number =>
  Math.max(0, Math.min(99.99, fee))

/**
 * Given what the consultant wants to take home, compute what the client pays.
 * Chain: client → middleman cut → Kvadrat cut → consultant
 */
export const calculateClientPrice = (
  consultantPrice: number,
  kvadratFee: number,
  middlemanFee: number
): number => {
  const kq = clampFee(kvadratFee) / 100
  const mm = clampFee(middlemanFee) / 100
  if (1 - kq <= 0 || 1 - mm <= 0) return 0
  return Math.ceil(consultantPrice / (1 - kq) / (1 - mm))
}

/**
 * Given what the client pays, compute what the consultant takes home.
 */
export const calculateConsultantPrice = (
  clientPrice: number,
  kvadratFee: number,
  middlemanFee: number
): number => {
  const kq = clampFee(kvadratFee) / 100
  const mm = clampFee(middlemanFee) / 100
  return Math.floor(clientPrice * (1 - mm) * (1 - kq))
}

export const formatSEK = (amount: number): string =>
  new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount)
