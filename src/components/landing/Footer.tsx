import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-[#0F1B2D] text-gray-400 py-12 border-t border-[#1A2E4A]">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-6 md:mb-0">
                        <Link href="/" className="text-2xl font-bold text-[#C9A84C]">
                            PropostaAI
                        </Link>
                        <p className="mt-2 text-sm text-gray-500">
                            Propostas comerciais que vendem.
                        </p>
                    </div>

                    <div className="flex gap-6 text-sm">
                        <Link href="#" className="hover:text-white transition-colors">Sobre</Link>
                        <Link href="#" className="hover:text-white transition-colors">Preços</Link>
                        <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#1A2E4A] flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} PropostaAI. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
