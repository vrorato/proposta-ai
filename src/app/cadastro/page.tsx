import { SignupForm } from '@/components/auth/SignupForm'
import { Logo } from '@/components/auth/Logo'
import { AuthFooter } from '@/components/auth/AuthFooter'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#050505] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0df259]/[0.02] rounded-full blur-[120px]"></div>
            
            <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <Logo className="mb-10" />
                <SignupForm />
                <AuthFooter />
            </div>
        </div>
    )
}


