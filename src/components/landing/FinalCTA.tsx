import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function FinalCTA() {
    return (
        <section className="py-32 bg-[#0a0a0c] relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-primary/10 rounded-full blur-[120px]"></div>

            <div className="container relative mx-auto px-6 text-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 tracking-tighter leading-tight">
                    DOMINE O MERCADO COM <br />
                    <span className="text-brand-primary">PROPOSTAS IRRESISTÍVEIS</span>
                </h2>
                <p className="text-xl md:text-2xl text-gray-500 mb-14 max-w-3xl mx-auto font-medium">
                    Junte-se aos consultores e agências de elite que já estão escalando suas vendas com a precisão da inteligência artificial.
                </p>

                <div className="flex flex-col items-center">
                    <Button asChild size="lg" className="bg-brand-primary hover:brightness-110 text-black font-black px-16 h-20 rounded-2xl text-base uppercase tracking-widest shadow-[0_0_50px_rgba(13,242,89,0.3)] hover:scale-105 transition-all active:scale-95">
                        <Link href="/cadastro">Garantir Meu Acesso Gratuito</Link>
                    </Button>
                    <div className="mt-8 flex items-center gap-6 text-sm font-bold text-gray-600 uppercase tracking-widest">
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                            Sem Cartão de Crédito
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                            Setup em 2 Minutos
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
