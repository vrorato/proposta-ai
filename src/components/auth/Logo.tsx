import { Sparkles } from 'lucide-react'

export function Logo({ className = "", horizontal = false }: { className?: string; horizontal?: boolean }) {
    if (horizontal) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="w-8 h-8 rounded-full bg-[#0df259]/20 flex items-center justify-center border border-[#0df259]/30">
                    <Sparkles className="w-4 h-4 text-[#0df259]" />
                </div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                    Proposta<span className="text-[#0df259]">AI</span>
                </h1>
            </div>
        )
    }

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <div className="w-14 h-14 bg-[#0df259]/10 rounded-full flex items-center justify-center border border-[#0df259]/20 shadow-[0_0_20px_rgba(13,242,89,0.1)]">
                <div className="w-10 h-10 bg-[#0df259]/10 rounded-full flex items-center justify-center border border-[#0df259]/20">
                    <Sparkles className="w-5 h-5 text-[#0df259] fill-[#0df259]/20" />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
                Proposta<span className="text-[#0df259]">AI</span>
            </h1>
        </div>
    )
}


