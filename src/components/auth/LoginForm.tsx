'use client'

import { login } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'

export function LoginForm() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-[#1A2E4A] border-gray-800 text-white">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
                <CardDescription className="text-center text-gray-400">
                    Acesse sua conta para continuar
                </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="space-y-4">
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
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-gray-200">Senha</Label>
                            <Link href="#" className="text-sm text-[#C9A84C] hover:underline">
                                Esqueci minha senha
                            </Link>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
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
                        {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                    <p className="text-sm text-center text-gray-400">
                        Não tem conta?{' '}
                        <Link href="/cadastro" className="text-[#C9A84C] hover:underline">
                            Cadastre-se
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
