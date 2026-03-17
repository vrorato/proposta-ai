import { Clock, TrendingUp, ShieldCheck, LayoutTemplate } from 'lucide-react'

export function Benefits() {
    const benefits = [
        {
            icon: Clock,
            title: 'Execução Ultra-Rápida',
            description: 'Gere propostas de alta conversão em menos de 5 minutos, eliminando horas de trabalho manual.',
        },
        {
            icon: TrendingUp,
            title: 'Precificação Inteligente',
            description: 'Algoritmos de IA que sugerem o ticket ideal baseado em escopo, mercado e complexidade.',
        },
        {
            icon: ShieldCheck,
            title: 'Autoridade Instantânea',
            description: 'Design premium e redação persuasiva que posicionam você como a escolha óbvia no mercado.',
        },
        {
            icon: LayoutTemplate,
            title: 'Templates por Nicho',
            description: 'Modelos validados para agências, freelancers e empresas de tecnologia e consultoria.',
        },
    ]

    return (
        <section className="py-32 bg-[#0a0a0c] relative overflow-hidden" id="beneficios">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        Por que nos escolher
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                        INFRAESTRUTURA DE <span className="text-brand-primary">ALTO IMPACTO</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Tudo que você precisa para automatizar sua esteira de propostas e focar no que realmente importa: fechar contratos lucrativos.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="glass-effect rounded-[32px] p-10 hover:border-brand-primary/40 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:bg-brand-primary/20 group-hover:border-brand-primary/30 transition-all duration-500">
                                <benefit.icon className="w-8 h-8 text-brand-primary stroke-[2.5px]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-500 leading-relaxed font-medium group-hover:text-gray-400 transition-colors">
                                {benefit.description}
                            </p>
                            
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 blur-3xl rounded-full translate-x-16 -translate-y-16 group-hover:bg-brand-primary/10 transition-colors duration-500" />
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[150px] -translate-y-1/2 -translate-x-1/2" />
        </section>
    )
}
