import { render, screen } from '@testing-library/react'
import Home from '../pages/home'

describe('Home Page', () => {
  it('renders homepage content', () => {
    render(<Home />)
    expect(screen.getByText(/welcome/i)).toBeInTheDocument()
  })
})
