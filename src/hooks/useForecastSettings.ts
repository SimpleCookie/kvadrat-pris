import { useState } from 'react'
import { calculatePensionPerMonth, type PensionMode } from '../lib/forecast'

export interface ForecastSettings {
  billableHours: string
  monthlySalary: string
  overhead: string
  kommunalskatt: string
  pensionMode: PensionMode
  pensionValue: string
}

const DEFAULTS: ForecastSettings = {
  billableHours: '1600',
  monthlySalary: '53600',
  overhead: '25000',
  kommunalskatt: '32',
  pensionMode: 'percent',
  pensionValue: '4.5',
}

export const useForecastSettings = (
  initial: { pensionMode?: PensionMode; pensionValue?: string } = {}
) => {
  const [settings, setSettings] = useState<ForecastSettings>({
    ...DEFAULTS,
    pensionMode: initial.pensionMode ?? DEFAULTS.pensionMode,
    pensionValue: initial.pensionValue ?? DEFAULTS.pensionValue,
  })

  const updateSetting = <K extends keyof ForecastSettings>(key: K, value: ForecastSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const pensionPerMonth = calculatePensionPerMonth({
    mode: settings.pensionMode,
    value: parseFloat(settings.pensionValue) || 0,
    monthlySalaryGross: parseInt(settings.monthlySalary) || 0,
  })

  return { settings, updateSetting, pensionPerMonth }
}

export type UseForecastSettingsResult = ReturnType<typeof useForecastSettings>
