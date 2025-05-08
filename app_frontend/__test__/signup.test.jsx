import { render, screen } from '@testing-library/react'
import Signup from '../pages/signup'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { createMockRouter } from 'next-router-mock'

describe('Signup Page', () => {
  it('renders signup form', () => {
    render(
      <RouterContext.Provider value={createMockRouter({})}>
        <Signup />
      </RouterContext.Provider>
    )

    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })
})
