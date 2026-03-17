import { ClipboardEdit, Sparkles, FileText } from 'lucide-react'

export function HowItWorks() {
    const steps = [
        {
            number: '01',
            icon: ClipboardEdit,
            title: 'Preencha os Dados',
            description: 'Informe sobre seu cliente, o serviço oferecido e o escopo do projeto.',
        },
        {
            number: '02',
            icon: Sparkles,
            title: 'A IA Analisa e Sugere',
            description: 'Nossa IA avalia tudo e sugere valor, estrutura e tom ideais para a proposta.',
        },
        {
            number: '03',
            icon: FileText,
            title: 'Revise e Envie',
            description: 'Ajuste o que quiser, gere a proposta final em PDF e envie ao cliente.',
        },
    ]

    return (
        <section className="py-24 bg-[#F8F9FC]" id="como-funciona">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0F1B2D] mb-4">
                        3 passos para uma proposta perfeita
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        É tão simples que você vai se perguntar como conseguiu viver sem isso antes.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent z-0"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-white border-4 border-[#F8F9FC] shadow-sm flex items-center justify-center mb-8 relative">
                                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#1A2E4A] text-white text-sm font-bold flex items-center justify-center border-2 border-white">
                                    {step.number}
                                </span>
                                <step.icon className="w-10 h-10 text-[#C9A84C]" />
                            </div>
                            <h3 className="text-xl font-bold text-[#0F1B2D] mb-4">
                                {step.title}
                            </h3>
                            <p className="text-gray-600 max-w-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
