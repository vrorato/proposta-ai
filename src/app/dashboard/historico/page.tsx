import { HistoryDashboard } from '@/components/dashboard/HistoryDashboard'
import { getProposals } from '@/app/dashboard/historico/actions'

export const metadata = {
    title: 'Histórico de Propostas - PropostaAI',
    description: 'Acompanhe todas as suas negociações em um só lugar.',
}

export default async function HistoryPage() {
    const { data, error } = await getProposals()

    // Pass data downward to client component so it can handle real-time states (search, duplication, deletion)
    return (
        <div className="py-6">
            <HistoryDashboard initialProposals={data || []} />
        </div>
    )
}
