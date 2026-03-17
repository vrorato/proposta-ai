import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-[#0a0a0c] text-gray-500 py-20 border-t border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="max-w-xs">
                        <Link href="/" className="text-3xl font-black text-white tracking-tighter">
                            Proposta<span className="text-brand-primary">AI</span>
                        </Link>
                        <p className="mt-6 text-sm leading-relaxed font-medium">
                            A plataforma definitiva para profissionais que buscam excelência e velocidade no fechamento de novos negócios.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-black text-white uppercase tracking-widest mb-2">Produto</span>
                            <Link href="#" className="text-sm hover:text-brand-primary transition-colors font-medium">Benefícios</Link>
                            <Link href="#" className="text-sm hover:text-brand-primary transition-colors font-medium">Como Funciona</Link>
                            <Link href="#" className="text-sm hover:text-brand-primary transition-colors font-medium">Templates</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-black text-white uppercase tracking-widest mb-2">Empresa</span>
                            <Link href="#" className="text-sm hover:text-brand-primary transition-colors font-medium">Sobre Nós</Link>
                            <Link href="#" className="text-sm hover:text-brand-primary transition-colors font-medium">Privacidade</Link>
                            <Link href="#" className="text-sm hover:text-brand-primary transition-colors font-medium">Termos</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-black text-white uppercase tracking-widest mb-2">Suporte</span>
                            <Link href="#" className="text-sm hover:text-brand-primary transition-colors font-medium">Ajuda</Link>
                            <Link href="#" className="text-sm hover:text-brand-primary transition-colors font-medium">Contato</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase tracking-[0.2em] text-gray-700">
                    <p>&copy; {new Date().getFullYear()} PropostaAI. Desenvolvido para o futuro do trabalho.</p>
                    <div className="flex gap-8 mt-6 md:mt-0">
                        <span className="hover:text-brand-primary cursor-pointer transition-colors">LinkedIn</span>
                        <span className="hover:text-brand-primary cursor-pointer transition-colors">Twitter</span>
                        <span className="hover:text-brand-primary cursor-pointer transition-colors">Instagram</span>
                    </div>
                </div>
            </div>
            
            {/* Subtle glow */}
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px]" />
        </footer>
    )
}
