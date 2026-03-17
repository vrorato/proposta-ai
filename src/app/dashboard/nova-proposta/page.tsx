import { ProposalWizard } from '@/components/dashboard/ProposalWizard'

export default function NovaPropostaPage() {
    return (
        <div className="py-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0F1B2D]">Nova Proposta</h1>
                <p className="text-gray-500 mt-2">
                    Preencha os dados abaixo e deixe nossa IA estruturar a proposta comercial perfeita para você fechar negócio.
                </p>
            </div>

            <ProposalWizard />
        </div>
    )
}
