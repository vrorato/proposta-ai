import { Clock, TrendingUp, ShieldCheck, LayoutTemplate } from 'lucide-react'

export function Benefits() {
    const benefits = [
        {
            icon: Clock,
            title: 'Economia de Tempo',
            description: 'Crie propostas completas em 5 minutos, não 5 horas.',
        },
        {
            icon: TrendingUp,
            title: 'IA que Sugere Valores',
            description: 'Precificação inteligente baseada no escopo, mercado e complexidade do serviço.',
        },
        {
            icon: ShieldCheck,
            title: 'Propostas Profissionais',
            description: 'Documentos com visual impecável que transmitem credibilidade e autoridade.',
        },
        {
            icon: LayoutTemplate,
            title: 'Templates por Nicho',
            description: 'Modelos prontos para desenvolvimento, design, marketing, consultoria e mais.',
        },
    ]

    return (
        <section className="py-24 bg-white" id="beneficios">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0F1B2D] mb-4">
                        Por que o PropostaAI?
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Tudo que você precisa para automatizar sua esteira de propostas e focar no que realmente importa: vender.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="bg-[#F8F9FC] rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="bg-[#1A2E4A] w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                                <benefit.icon className="w-7 h-7 text-[#C9A84C]" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#0F1B2D] mb-3">
                                {benefit.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
