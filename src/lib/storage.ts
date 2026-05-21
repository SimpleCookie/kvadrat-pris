import type { Lang } from './i18n'
import type { PensionMode } from './forecast'

const STORAGE_KEY = 'kvadrat-pris-state'

export interface PersistedState {
  activeField: 'consultant' | 'client'
  activeValue: string
  kvadratFee: string
  middlemanFee: string
  lang: Lang
  pensionMode: PensionMode
  pensionValue: string
}

export const loadState = (): Partial<PersistedState> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<PersistedState>) : {}
  } catch {
    return {}
  }
}

export const saveState = (state: PersistedState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch { /* storage unavailable */ }
}
