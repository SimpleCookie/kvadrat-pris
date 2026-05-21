import { useReducer } from 'react'
import { calculateClientPrice, calculateConsultantPrice, clampFee } from '../lib/pricing'

export interface PricingState {
  activeField: 'consultant' | 'client'
  activeValue: string
  kvadratFee: string
  middlemanFee: string
}

export interface PricingDerived {
  consultantPrice: number
  clientPrice: number
  middlemanCut: number
  kvadratCut: number
  parsedKvadrat: number
  parsedMiddleman: number
  hasValue: boolean
}

export type PricingAction =
  | { type: 'SET_PRICE'; field: 'consultant' | 'client'; value: string }
  | { type: 'SET_ACTIVE_FIELD'; field: 'consultant' | 'client' }
  | { type: 'SET_KVADRAT_FEE'; value: string }
  | { type: 'SET_MIDDLEMAN_FEE'; value: string }
  | { type: 'RESET' }

const DEFAULTS: PricingState = {
  activeField: 'consultant',
  activeValue: '800',
  kvadratFee: '17',
  middlemanFee: '0',
}

const reducer = (state: PricingState, action: PricingAction): PricingState => {
  switch (action.type) {
    case 'SET_PRICE':
      return { ...state, activeField: action.field, activeValue: action.value }
    case 'SET_ACTIVE_FIELD':
      return { ...state, activeField: action.field }
    case 'SET_KVADRAT_FEE':
      return { ...state, kvadratFee: action.value }
    case 'SET_MIDDLEMAN_FEE':
      return { ...state, middlemanFee: action.value }
    case 'RESET':
      return DEFAULTS
    default:
      return state
  }
}

const computeDerived = (state: PricingState): PricingDerived => {
  const parsedActive = parseFloat(state.activeValue) || 0
  const parsedKvadrat = clampFee(parseFloat(state.kvadratFee) || 0)
  const parsedMiddleman = clampFee(parseFloat(state.middlemanFee) || 0)

  const consultantPrice =
    state.activeField === 'consultant'
      ? parsedActive
      : calculateConsultantPrice(parsedActive, parsedKvadrat, parsedMiddleman)

  const clientPrice =
    state.activeField === 'client'
      ? parsedActive
      : calculateClientPrice(parsedActive, parsedKvadrat, parsedMiddleman)

  const middlemanCut = Math.round(clientPrice * (parsedMiddleman / 100))
  const afterMiddleman = clientPrice - middlemanCut
  const kvadratCut = afterMiddleman - consultantPrice

  return {
    consultantPrice,
    clientPrice,
    middlemanCut,
    kvadratCut,
    parsedKvadrat,
    parsedMiddleman,
    hasValue: parsedActive > 0,
  }
}

export const usePricingState = (initial: Partial<PricingState> = {}) => {
  const [state, dispatch] = useReducer(reducer, { ...DEFAULTS, ...initial })
  const derived = computeDerived(state)
  return { state, derived, dispatch }
}

export type UsePricingStateResult = ReturnType<typeof usePricingState>
