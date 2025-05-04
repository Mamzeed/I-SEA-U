import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Login from '../pages/login/index'

describe('Login', () => {
    it('renders username and password inputs', () => {
        render(<Login />)
        
        const username = screen.getByRole('textbox', { name: /username/i }) // หรือใช้ getByLabelText ก็ได้
        const password = screen.getByLabelText(/password/i) // ต้องมี label ที่เชื่อมโยงกับ input

        expect(username).toBeInTheDocument()
        expect(password).toBeInTheDocument()
    })
})
