import { HistoryDashboard } from '@/components/dashboard/HistoryDashboard'
import { getProposals } from '@/app/dashboard/historico/actions'

export const metadata = {
    title: 'Histórico de Propostas - PropostaAI',
    description: 'Acompanhe todas as suas negociações em um só lugar.',
}

export default async function HistoryPage() {
    const { data, error } = await getProposals()

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}


            <HistoryDashboard initialProposals={data || []} />
        </div>
    )
}
