import { FinalProposalDashboard } from '@/components/dashboard/FinalProposalDashboard'

export const metadata = {
    title: 'Proposta Final - PropostaAI',
    description: 'Sua proposta comercial gerada por inteligência artificial.',
}

export default async function FinalProposalPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return (
        <div className="py-6">
            <FinalProposalDashboard proposalId={id} />
        </div>
    )
}
