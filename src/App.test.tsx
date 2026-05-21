import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('renders both price fields', () => {
  render(<App />)
  expect(screen.getByLabelText(/konsultpris/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/^kundpris/i)).toBeInTheDocument()
})

test('renders fee inputs with defaults', () => {
  render(<App />)
  const kvadratInput = screen.getByLabelText(/kvadrats andel/i) as HTMLInputElement
  const mellanskärInput = screen.getByLabelText(/mellanskär/i) as HTMLInputElement
  expect(kvadratInput.value).toBe('17')
  expect(mellanskärInput.value).toBe('0')
})

test('renders reset button', () => {
  render(<App />)
  expect(screen.getByRole('button', { name: /återställ/i })).toBeInTheDocument()
})

test('renders future tab and shows runway card', () => {
  render(<App />)
  const futureBtn = screen.getByRole('button', { name: /framtid/i })
  fireEvent.click(futureBtn)
  expect(screen.getByText(/kassaflödesbuffert/i)).toBeInTheDocument()
})

