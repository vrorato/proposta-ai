import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
    return (
        <section className="relative px-6 pt-24 pb-32 md:pt-32 md:pb-40 lg:pt-40 lg:pb-48 bg-[#0F1B2D] overflow-hidden">
            {/* Background gradients/patterns */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(26,46,74,0.5)_100%)]"></div>

            <div className="container relative mx-auto text-center z-10 flex flex-col items-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-6 max-w-4xl tracking-tight">
                    Propostas comerciais que vendem — criadas por IA em minutos
                </h1>

                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
                    Pare de perder horas montando propostas. O PropostaAI analisa seu serviço, sugere o valor ideal e gera documentos profissionais que impressionam seus clientes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Button asChild size="lg" className="bg-[#C9A84C] hover:bg-[#b09341] text-[#0F1B2D] font-bold px-8 h-14 rounded-full text-base">
                        <Link href="/cadastro">Criar Minha Primeira Proposta Grátis</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="bg-transparent border-gray-600 text-white hover:text-[#C9A84C] hover:bg-gray-800/50 hover:border-gray-500 font-semibold px-8 h-14 rounded-full text-base">
                        <Link href="#como-funciona">Ver Como Funciona</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
