import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type Lang } from '../lib/i18n'
import { type PensionMode } from '../lib/forecast'

const STORAGE_KEY = 'kvadrat-pris-state'

export interface ForecastSettings {
  billableHours: string
  monthlySalary: string
  overhead: string
  kommunalskatt: string
  pensionMode: PensionMode
  pensionValue: string
}

interface AppStore extends ForecastSettings {
  activeField: 'consultant' | 'client'
  activeValue: string
  kvadratFee: string
  middlemanFee: string
  lang: Lang
  setPrice: (field: 'consultant' | 'client', value: string) => void
  setActiveField: (field: 'consultant' | 'client') => void
  setKvadratFee: (value: string) => void
  setMiddlemanFee: (value: string) => void
  reset: () => void
  updateSetting: <K extends keyof ForecastSettings>(key: K, value: ForecastSettings[K]) => void
  setLang: (lang: Lang) => void
}

const PRICING_DEFAULTS = {
  activeField: 'consultant' as const,
  activeValue: '800',
  kvadratFee: '17',
  middlemanFee: '0',
}

const FORECAST_DEFAULTS: ForecastSettings = {
  billableHours: '1600',
  monthlySalary: '53600',
  overhead: '25000',
  kommunalskatt: '32',
  pensionMode: 'percent',
  pensionValue: '4.5',
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...PRICING_DEFAULTS,
      ...FORECAST_DEFAULTS,
      lang: 'sv',
      setPrice: (field, value) => set({ activeField: field, activeValue: value }),
      setActiveField: (field) => set({ activeField: field }),
      setKvadratFee: (value) => set({ kvadratFee: value }),
      setMiddlemanFee: (value) => set({ middlemanFee: value }),
      reset: () => set(PRICING_DEFAULTS),
      updateSetting: (key, value) => set({ [key]: value } as Partial<AppStore>),
      setLang: (lang) => set({ lang }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        activeField: state.activeField,
        activeValue: state.activeValue,
        kvadratFee: state.kvadratFee,
        middlemanFee: state.middlemanFee,
        lang: state.lang,
        pensionMode: state.pensionMode,
        pensionValue: state.pensionValue,
      }),
    }
  )
)
