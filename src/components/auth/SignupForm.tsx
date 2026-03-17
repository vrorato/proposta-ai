'use client'

import { signup } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export function SignupForm() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-[440px] mx-auto bg-[#0a0a0c] border-white/[0.05] text-white overflow-hidden rounded-[32px] p-2 neon-glow relative">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 rounded-[32px] border border-[#0df259]/10 pointer-events-none"></div>



            <CardHeader className="pt-12 pb-8 px-10">
                <CardTitle className="text-4xl font-bold tracking-tight mb-4">Create Account</CardTitle>
                <CardDescription className="text-gray-400 text-[15px] font-medium leading-relaxed">
                    Join the future of automated business proposals.
                </CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="space-y-6 px-10">
                    <div className="space-y-3">
                        <Label htmlFor="full_name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Full Name</Label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                            <Input
                                id="full_name"
                                name="full_name"
                                type="text"
                                placeholder="John Doe"
                                required
                                autoComplete="name"
                                className="bg-[#111114] border-white/[0.05] rounded-2xl h-14 pl-12 text-white placeholder:text-gray-600 focus:border-brand-primary/30 focus:ring-1 focus:ring-brand-primary/20 transition-all text-base"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Email Address</Label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                autoComplete="email"
                                className="bg-[#111114] border-white/[0.05] rounded-2xl h-14 pl-12 text-white placeholder:text-gray-600 focus:border-brand-primary/30 focus:ring-1 focus:ring-brand-primary/20 transition-all text-base"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 ml-1">Password</Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                className="bg-[#111114] border-white/[0.05] rounded-2xl h-14 pl-12 pr-12 text-white placeholder:text-gray-600 focus:border-brand-primary/30 focus:ring-1 focus:ring-brand-primary/20 transition-all text-base"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 font-medium">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-[#0df259] hover:bg-[#0df259]/90 text-black font-bold h-14 rounded-2xl shadow-[0_0_20px_rgba(13,242,89,0.2)] transition-all active:scale-[0.98] text-[15px] mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Account'}
                    </Button>
                </CardContent>

                <div className="px-10 pb-10 mt-6 space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/[0.05]" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                            <span className="bg-[#0a0a0c] px-4 text-gray-600">or sign up with</span>
                        </div>
                    </div>


                    <Button
                        type="button"
                        className="w-full h-14 rounded-2xl border-[3px] border-white/30 bg-[#111114] text-white hover:bg-white/[0.05] hover:border-white/50 transition-all text-base font-semibold shadow-lg"
                    >
                        <GoogleIcon />
                        Sign up with Google
                    </Button>
                    <p className="text-[10px] text-center text-gray-600 leading-loose uppercase tracking-[0.15em] px-4">
                        By clicking "Create Account", you agree to our <Link href="#" className="text-gray-400 underline decoration-gray-700 underline-offset-4 hover:text-white transition-colors">Terms of Service</Link> and <Link href="#" className="text-gray-400 underline decoration-gray-700 underline-offset-4 hover:text-white transition-colors">Privacy Policy</Link>.
                    </p>

                    <p className="text-sm text-center text-gray-400 mt-2">
                        Already have an account?{' '}
                        <Link href="/login" className="text-brand-primary font-bold hover:underline transition-all">
                            Login
                        </Link>
                    </p>

                </div>
            </form>
        </Card>
    )
}

function GoogleIcon() {
    return (
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">

            <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
                fill="#FBBC05"
                d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
        </svg>
    )
}
