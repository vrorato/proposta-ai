import { ClipboardEdit, Sparkles, FileText } from 'lucide-react'

export function HowItWorks() {
    const steps = [
        {
            number: '01',
            icon: ClipboardEdit,
            title: 'Diagnostique o Escopo',
            description: 'Compartilhe os detalhes vitais do seu cliente, o serviço e as necessidades do projeto.',
        },
        {
            number: '02',
            icon: Sparkles,
            title: 'Inteligência em Ação',
            description: 'Nossa IA processa cada variável para sugerir o preço, a narrativa e a estrutura perfeita.',
        },
        {
            number: '03',
            icon: FileText,
            title: 'Impacto Imediato',
            description: 'Refine os detalhes, gere o documento de alta fidelidade e conquiste a aprovação.',
        },
    ]

    return (
        <section className="py-32 bg-[#0a0a0c] relative overflow-hidden" id="como-funciona">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4">
                        Fluxo de Trabalho
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
                        3 PASSOS PARA O <span className="text-brand-primary">SÍMBOLO DE SUCESSO</span>
                    </h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Simplicidade radical unida à inteligência artificial de última geração.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-16 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent z-0"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-32 h-32 rounded-[40px] bg-white/5 border border-white/10 flex items-center justify-center mb-10 relative group-hover:border-brand-primary/50 transition-all duration-500 rotate-3 group-hover:rotate-0">
                                <span className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-brand-primary text-black text-lg font-black flex items-center justify-center shadow-[0_0_20px_rgba(13,242,89,0.4)]">
                                    {step.number}
                                </span>
                                <step.icon className="w-12 h-12 text-brand-primary stroke-[2.5px]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 max-w-xs font-medium group-hover:text-gray-400 transition-colors">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Background element */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[200px] translate-x-1/3 translate-y-1/3" />
        </section>
    )
}
