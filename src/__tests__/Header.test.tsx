import { render, screen } from '@testing-library/react'
import Header from '../components/Header'

describe('Header', () => {
  it('renders the portfolio title', () => {
    render(<Header />)
    const titleElement = screen.getByText(/Meu Portfólio/i)
    expect(titleElement).toBeInTheDocument()
  })
})