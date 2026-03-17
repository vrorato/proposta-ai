import { FileText, Clock, CheckCircle, FilePlus, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardHome() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let totalProposals = 0
    let thisMonth = 0
    let finalized = 0
    let drafts = 0
    let recentProposals: any[] = []

    if (user) {
        // Total
        const { count: totalCount } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
        totalProposals = totalCount || 0

        // This month
        const startOfMonth = new Date()
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)
        const { count: monthCount } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', startOfMonth.toISOString())
        thisMonth = monthCount || 0

        // Finalized
        const { count: finalizedCount } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'finalized')
        finalized = finalizedCount || 0

        // Drafts
        const { count: draftCount } = await supabase
            .from('proposals')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .in('status', ['draft', 'preview'])
        drafts = draftCount || 0

        // Recent proposals (last 5)
        const { data: recent } = await supabase
            .from('proposals')
            .select(`
                id,
                title,
                status,
                created_at,
                updated_at,
                proposal_clients(client_name, client_company)
            `)
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(5)
        recentProposals = recent || []
    }

    const statusLabel: Record<string, { label: string; color: string; bg: string }> = {
        draft: { label: 'Rascunho', color: 'text-amber-700', bg: 'bg-amber-50' },
        preview: { label: 'Em Revisão', color: 'text-blue-700', bg: 'bg-blue-50' },
        finalized: { label: 'Finalizada', color: 'text-green-700', bg: 'bg-green-50' },
    }

    return (
        <div className="space-y-8">
            {/* Stats row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white shadow-sm border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#F8F9FC]/50">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Total de Propostas
                        </CardTitle>
                        <FileText className="h-4 w-4 text-[#8896A6]" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-[#0F1B2D]">{totalProposals}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            Todas criadas
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#F8F9FC]/50">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Este Mês
                        </CardTitle>
                        <Clock className="h-4 w-4 text-[#8896A6]" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-[#0F1B2D]">{thisMonth}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            Nos últimos 30 dias
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-0 rounded-2xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#F8F9FC]/50">
                        <CardTitle className="text-sm font-medium text-gray-500">
                            Finalizadas
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-[#2ECC71]" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-2xl font-bold text-[#0F1B2D]">{finalized}</div>
                        <p className="text-xs text-gray-400 mt-1">
                            Prontas para envio
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-white shadow-sm border-0 rounded-2xl overflow-hidden relative group">
                    <Link href="/dashboard/nova-proposta" className="absolute inset-0 z-10 flex items-center justify-center bg-transparent group-hover:bg-[#C9A84C]/5 transition-colors">
                        <div className="flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[#C9A84C]">
                            <FilePlus className="h-8 w-8 mb-2" />
                            <span className="font-semibold">Nova Proposta</span>
                        </div>
                    </Link>
                    <div className="group-hover:opacity-10 transition-opacity">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-[#F8F9FC]/50">
                            <CardTitle className="text-sm font-medium text-gray-500">
                                Rascunhos
                            </CardTitle>
                            <FilePlus className="h-4 w-4 text-[#8896A6]" />
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-[#0F1B2D]">{drafts}</div>
                            <p className="text-xs text-gray-400 mt-1">
                                Em andamento
                            </p>
                        </CardContent>
                    </div>
                </Card>
            </div>

            {/* Recents table */}
            <div>
                <h3 className="text-lg font-medium mb-4 text-[#0F1B2D]">Últimas Propostas</h3>
                <Card className="bg-white border-0 shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        {recentProposals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 text-center">
                                <div className="bg-[#F8F9FC] p-4 rounded-full mb-4">
                                    <FileText className="h-12 w-12 text-gray-300" />
                                </div>
                                <h4 className="text-xl font-medium text-[#0F1B2D] mb-2">Nenhuma proposta ainda</h4>
                                <p className="text-gray-500 mb-6 max-w-sm">
                                    Suas últimas propostas criadas vão aparecer aqui. Que tal criar sua primeira proposta profissional agora?
                                </p>
                                <Link href="/dashboard/nova-proposta" className="bg-[#C9A84C] text-[#0F1B2D] px-6 py-2 rounded-lg font-medium hover:bg-[#b09341] transition-colors">
                                    Criar Minha Primeira Proposta
                                </Link>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-[#F8F9FC]/70 text-left text-xs text-gray-500 uppercase tracking-wider">
                                        <th className="px-6 py-3 font-medium">Proposta</th>
                                        <th className="px-6 py-3 font-medium">Cliente</th>
                                        <th className="px-6 py-3 font-medium">Status</th>
                                        <th className="px-6 py-3 font-medium">Data</th>
                                        <th className="px-6 py-3 font-medium text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentProposals.map((p) => {
                                        const client = Array.isArray(p.proposal_clients) ? p.proposal_clients[0] : p.proposal_clients
                                        const st = statusLabel[p.status] || statusLabel.draft
                                        const link = p.status === 'finalized'
                                            ? `/dashboard/proposta/${p.id}/final`
                                            : p.status === 'preview'
                                                ? `/dashboard/proposta/${p.id}/final`
                                                : `/dashboard/proposta/${p.id}/preview`
                                        return (
                                            <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-[#0F1B2D] truncate max-w-[200px]">
                                                        {p.title || 'Sem título'}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    {client?.client_name || '—'}
                                                    {client?.client_company && (
                                                        <span className="text-gray-400 text-xs block">{client.client_company}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${st.color} ${st.bg}`}>
                                                        {st.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-xs">
                                                    {new Date(p.updated_at || p.created_at).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link
                                                        href={link}
                                                        className="inline-flex items-center gap-1 text-[#C9A84C] hover:text-[#b09341] font-medium text-xs transition-colors"
                                                    >
                                                        Abrir
                                                        <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
