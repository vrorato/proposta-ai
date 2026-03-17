'use client'

import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'

export function SignupForm() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirm_password') as string

        if (password !== confirmPassword) {
            setError('As senhas não coincidem')
            setLoading(false)
            return
        }

        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-[#1A2E4A] border-gray-800 text-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Criar Conta</CardTitle>
                <CardDescription className="text-center text-gray-400">
                    Comece a criar propostas incríveis agora
                </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-gray-200">Nome completo</Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            type="text"
                            placeholder="João da Silva"
                            required
                            autoComplete="name"
                            className="bg-[#0F1B2D] border-gray-700 focus:border-[#C9A84C]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-200">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            required
                            autoComplete="email"
                            className="bg-[#0F1B2D] border-gray-700 focus:border-[#C9A84C]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-200">Senha</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            className="bg-[#0F1B2D] border-gray-700 focus:border-[#C9A84C]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm_password" className="text-gray-200">Confirmar Senha</Label>
                        <Input
                            id="confirm_password"
                            name="confirm_password"
                            type="password"
                            required
                            autoComplete="new-password"
                            className="bg-[#0F1B2D] border-gray-700 focus:border-[#C9A84C]"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        className="w-full bg-[#C9A84C] hover:bg-[#b09341] text-[#0F1B2D] font-semibold"
                        disabled={loading}
                    >
                        {loading ? 'Criando conta...' : 'Criar Minha Conta'}
                    </Button>
                    <p className="text-sm text-center text-gray-400">
                        Já tem conta?{' '}
                        <Link href="/login" className="text-[#C9A84C] hover:underline">
                            Faça login
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
