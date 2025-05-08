import { render, screen } from '@testing-library/react'
import News from '../pages/news'

describe('News Page', () => {
  it('renders news list', () => {
    render(<News />)
    expect(screen.getByText(/ข่าว/i)).toBeInTheDocument()
  })
})
