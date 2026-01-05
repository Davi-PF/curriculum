import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Skills from '../components/Skills/Skills'

describe('Skills', () => {
  it('renders the skills section', () => {
    render(<Skills />)
    const titleElement = screen.getByText(/Skills/i)
    expect(titleElement).toBeInTheDocument()
  })

  it('renders skill buttons', () => {
    render(<Skills />)
    const skillButtons = screen.getAllByRole('button')
    expect(skillButtons.length).toBeGreaterThan(0)
  })

  it('renders first skill button with correct text', () => {
    render(<Skills />)
    const firstButton = screen.getByText('Gestão de Pessoas')
    expect(firstButton).toBeInTheDocument()
  })
})