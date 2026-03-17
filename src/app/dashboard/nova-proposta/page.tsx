import { ProposalWizard } from '@/components/dashboard/ProposalWizard'

export default function NovaPropostaPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="relative overflow-hidden rounded-3xl p-8 glass-effect border-brand-primary/10">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Nova <span className="text-brand-primary">Proposta</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Preencha os dados abaixo e deixe nossa IA estruturar a proposta comercial perfeita para você fechar negócio.
                    </p>
                </div>
                {/* Background organic shape */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px]" />
            </div>

            <ProposalWizard />
        </div>
    )
}
