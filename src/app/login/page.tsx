import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0F1B2D]">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">PropostaAI</h1>
                <p className="text-gray-400">Entre para gerenciar suas propostas</p>
            </div>
            <LoginForm />
        </div>
    )
}
