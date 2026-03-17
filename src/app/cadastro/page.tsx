import { SignupForm } from '@/components/auth/SignupForm'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0F1B2D]">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">PropostaAI</h1>
                <p className="text-gray-400">Crie sua conta e comece agora</p>
            </div>
            <SignupForm />
        </div>
    )
}
