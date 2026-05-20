import {
  clampFee,
  calculateClientPrice,
  calculateConsultantPrice,
} from "./pricing"

describe("clampFee", () => {
  it("clamps negative values to 0", () => {
    expect(clampFee(-5)).toBe(0)
  })
  it("clamps values above 99.99 to 99.99", () => {
    expect(clampFee(100)).toBe(99.99)
  })
  it("passes through values in range", () => {
    expect(clampFee(17)).toBe(17)
    expect(clampFee(0)).toBe(0)
  })
})

describe("calculateClientPrice", () => {
  it("correctly computes client price with 17% Kvadrat, no middleman", () => {
    // consultant wants 800 kr → client pays ceil(800 / 0.83) = 965
    expect(calculateClientPrice(800, 17, 0)).toBe(
      Math.ceil(800 / 0.83)
    )
  })

  it("correctly computes client price with Kvadrat + middleman", () => {
    // consultant 800, kvadrat 17%, middleman 5%
    expect(calculateClientPrice(800, 17, 5)).toBe(
      Math.ceil(800 / 0.83 / 0.95)
    )
  })

  it("returns 0 when fee would be 100%", () => {
    // clampFee prevents reaching 100% so result is not exactly 0;
    // but with 0% Kvadrat fee the formula simplifies to ceil(price / 1)
    expect(calculateClientPrice(500, 0, 0)).toBe(500)
  })

  it("rounds up (ceiling)", () => {
    // Any fractional result should be rounded up
    const result = calculateClientPrice(1000, 17, 0)
    expect(result).toBe(Math.ceil(1000 / 0.83))
  })
})

describe("calculateConsultantPrice", () => {
  it("correctly computes consultant price with 17% Kvadrat, no middleman", () => {
    expect(calculateConsultantPrice(965, 17, 0)).toBe(
      Math.floor(965 * 0.83)
    )
  })

  it("correctly computes consultant price with middleman", () => {
    expect(calculateConsultantPrice(1015, 17, 5)).toBe(
      Math.floor(1015 * 0.95 * 0.83)
    )
  })

  it("rounds down (floor)", () => {
    const result = calculateConsultantPrice(1000, 17, 0)
    expect(result).toBe(Math.floor(1000 * 0.83))
  })

  it("is roughly the inverse of calculateClientPrice", () => {
    const consultant = 800
    const clientPrice = calculateClientPrice(consultant, 17, 0)
    const backToConsultant = calculateConsultantPrice(clientPrice, 17, 0)
    // Due to ceil/floor rounding the result may be off by at most 1 kr
    expect(backToConsultant).toBeGreaterThanOrEqual(consultant - 1)
    expect(backToConsultant).toBeLessThanOrEqual(consultant)
  })
})
