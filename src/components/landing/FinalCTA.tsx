import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
    return (
        <section className="py-24 bg-[#0F1B2D] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1A2E4A] via-[#0F1B2D] to-[#0F1B2D]"></div>

            <div className="container relative mx-auto px-6 text-center z-10">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Pronto para transformar suas propostas?
                </h2>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                    Junte-se a profissionais que já estão fechando mais negócios com propostas geradas por IA.
                </p>

                <div className="flex flex-col items-center">
                    <Button asChild size="lg" className="bg-[#C9A84C] hover:bg-[#b09341] text-[#0F1B2D] font-bold px-10 h-16 rounded-full text-lg shadow-[0_0_40px_rgba(201,168,76,0.3)] hover:shadow-[0_0_60px_rgba(201,168,76,0.4)] transition-all">
                        <Link href="/cadastro">Começar Agora — É Grátis</Link>
                    </Button>
                    <p className="mt-6 text-sm text-gray-500">
                        Sem cartão de crédito. Crie sua primeira proposta em minutos.
                    </p>
                </div>
            </div>
        </section>
    )
}
