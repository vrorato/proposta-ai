import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
    return (
        <section className="relative px-6 pt-32 pb-40 md:pt-48 md:pb-56 lg:pt-56 lg:pb-64 bg-[#0a0a0c] overflow-hidden">
            {/* Massive Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-brand-primary/5 rounded-full blur-[100px]" />
            
            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50 contrast-150 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>

            <div className="container relative mx-auto text-center z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-bounce">
                    🚀 Inteligência Artificial de Elite
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 max-w-5xl tracking-tighter leading-[0.95] md:leading-[0.9]">
                    PROPOSTAS QUE <span className="text-brand-primary neon-glow-text">FECHAM NEGÓCIOS</span> EM MINUTOS
                </h1>

                <p className="text-xl md:text-2xl text-gray-400 mb-14 max-w-3xl leading-relaxed font-medium">
                    Pare de perder tempo com formatações complexas. Nossa IA analisa seu serviço, define o ticket ideal e gera documentos <span className="text-white font-bold">irresistíveis</span> para transformar prospects em clientes fiéis.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-lg">
                    <Button asChild size="lg" className="w-full sm:w-auto bg-brand-primary hover:brightness-110 text-black font-black px-12 h-20 rounded-2xl text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(13,242,89,0.3)] hover:scale-105 transition-all active:scale-95">
                        <Link href="/cadastro">Começar Agora — É Grátis</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-white/5 border-white/10 text-white hover:bg-white/10 font-black px-12 h-20 rounded-2xl text-sm uppercase tracking-widest backdrop-blur-xl transition-all">
                        <Link href="#como-funciona">Ver Demonstração</Link>
                    </Button>
                </div>

                {/* Social Proof / Stats */}
                <div className="mt-24 pt-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
                    {[
                        { label: 'Propostas Geradas', val: '50k+' },
                        { label: 'Conversão Média', val: '64%' },
                        { label: 'Tempo Economizado', val: '85%' },
                        { label: 'Usuários Ativos', val: '12k+' },
                    ].map((stat, i) => (
                        <div key={i} className="text-center group">
                            <div className="text-2xl md:text-3xl font-black text-white group-hover:text-brand-primary transition-colors">{stat.val}</div>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
