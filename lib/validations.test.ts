import { describe, it, expect } from 'vitest'
import { loginSchema, clientSchema, petSchema } from './validations'

describe('Zod Validations', () => {
    describe('loginSchema', () => {
        it('Deberia validar un email y contraseña correctos', () => {
            const result = loginSchema.safeParse({ email: 'admin@ruffo.com', password: 'password123' })
            expect(result.success).toBe(true)
        })

        it('Deberia fallar con un email invalido', () => {
            const result = loginSchema.safeParse({ email: 'admin.com', password: 'password123' })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Email inválido')
            }
        })

        it('Deberia fallar con una contraseña corta', () => {
            const result = loginSchema.safeParse({ email: 'admin@ruffo.com', password: 'pass' })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Mínimo 6 caracteres')
            }
        })
    })

    describe('clientSchema', () => {
        it('Deberia validar correctamente con todos los campos requeridos', () => {
            const result = clientSchema.safeParse({
                full_name: 'David',
                phone: '1234567890'
            })
            expect(result.success).toBe(true)
        })

        it('Deberia aceptar un string vacio como email', () => {
            const result = clientSchema.safeParse({
                full_name: 'David',
                phone: '1234567890',
                email: ''
            })
            expect(result.success).toBe(true)
        })

        it('Deberia fallar si el nombre esta vacio', () => {
            const result = clientSchema.safeParse({
                full_name: '',
                phone: '1234567890'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('El nombre es requerido')
            }
        })

        it('Deberia fallar si el telefono esta vacio', () => {
            const result = clientSchema.safeParse({
                full_name: 'David',
                phone: ''
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('El teléfono es requerido')
            }
        })
    })

    describe('petSchema', () => {
        it('Deberia validar correctamente con todos los campos requeridos', () => {
            const result = petSchema.safeParse({
                name: 'Firulais',
                species: 'canino'
            })
            expect(result.success).toBe(true)
        })

        it('Deberia fallar si la especie es invalida', () => {
            const result = petSchema.safeParse({
                name: 'Bugs',
                species: 'conejo'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Selecciona una especie válida')
            }
        })

        it('Deberia fallar si el nombre esta vacio', () => {
            const result = petSchema.safeParse({
                name: '',
                species: 'canino'
            })
            expect(result.success).toBe(false)
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('El nombre es requerido')
            }
        })
    })
})
