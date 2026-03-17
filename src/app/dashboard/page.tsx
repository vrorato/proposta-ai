import { FileText, Clock, CheckCircle, FilePlus, ExternalLink, History, ArrowRight, TrendingUp, Zap, Target } from 'lucide-react'
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
        draft: { label: 'Rascunho', color: 'text-amber-500', bg: 'bg-amber-500/10' },
        preview: { label: 'Em Revisão', color: 'text-blue-500', bg: 'bg-blue-500/10' },
        finalized: { label: 'Finalizada', color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
    }

    return (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 max-w-[1300px] mx-auto pb-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[48px] p-16 bg-white/[0.01] border border-white/[0.04] group hover:border-white/[0.08] transition-all duration-700 shadow-2xl">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-16">
                    <div className="max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-2xl">
                            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_10px_#0df259]" />
                            Command Center v2.0
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-4">
                            Sua <span className="text-brand-primary">Máquina de</span><br />Vendas Turbinada.
                        </h1>
                        <p className="text-gray-500 font-bold text-xl leading-relaxed max-w-lg">
                            Deixe que nossa inteligência neural cuide dos escopos enquanto você foca no fechamento estratégico.
                        </p>
                    </div>
                    
                    <div className="relative group/btn">
                        <div className="absolute inset-0 bg-brand-primary blur-2xl opacity-20 group-hover/btn:opacity-40 transition-opacity duration-700" />
                        <Link 
                            href="/dashboard/nova-proposta" 
                            className="relative bg-brand-primary text-black px-12 py-7 rounded-[32px] font-black flex items-center gap-4 hover:scale-[1.05] transition-all shadow-2xl group active:scale-95 uppercase text-[12px] tracking-[0.2em] overflow-hidden"
                        >
                            <Zap className="h-5 w-5 fill-current group-hover:rotate-12 transition-transform" />
                            Launch New Proposal
                        </Link>
                    </div>
                </div>
                
                {/* Background artistic layers */}
                <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[160px] group-hover:bg-brand-primary/10 transition-colors duration-1000" />
                <div className="absolute -bottom-[10%] -left-[5%] w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/max-[0.01] to-transparent pointer-events-none" />
            </div>

            {/* Stats row */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: 'Total Volume', val: totalProposals, icon: TrendingUp, desc: 'Historical Archive', color: 'text-white' },
                    { title: 'Neural Cycle', val: thisMonth, icon: Zap, desc: 'Current Month Pulse', color: 'text-brand-primary' },
                    { title: 'High-Value Deals', val: finalized, icon: Target, desc: 'Awaiting Signature', color: 'text-white' },
                    { title: 'Pending Logic', val: drafts, icon: Clock, desc: 'Draft Phase Control', color: 'text-white' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.015] p-10 rounded-[40px] border border-white/[0.04] hover:border-brand-primary/30 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:bg-brand-primary group-hover:text-black transition-all duration-700 shadow-xl">
                                    <stat.icon className="h-6 w-6 transition-transform group-hover:scale-110 group-hover:rotate-6 stroke-[1.5px]" />
                                </div>
                                <div className="text-4xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform">{stat.val}</div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] block">{stat.title}</span>
                                <p className="text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em]">
                                    {stat.desc}
                                </p>
                            </div>
                        </div>
                        {/* Glow indicator */}
                        <div className="absolute top-0 right-0 w-1 p-1 h-3 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-full m-8 shadow-[0_0_15px_#0df259]" />
                    </div>
                ))}
            </div>

            {/* Content Split */}
            <div className="grid lg:grid-cols-3 gap-12">
                {/* Recent Activity (Table style) */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="flex items-center justify-between px-4">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4">
                                <div className="w-2 h-10 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(13,242,89,0.3)]" />
                                Recent Activity
                            </h3>
                            <p className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em] ml-6">Real-time Proposal Streaming</p>
                        </div>
                        <Link href="/dashboard/historico" className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] hover:bg-white/[0.08] transition-all flex items-center gap-3 group">
                            Archival Access
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    
                    <div className="bg-white/[0.01] rounded-[48px] overflow-hidden border border-white/[0.04] shadow-2xl">
                        {recentProposals.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-28 text-center bg-black/20">
                                <div className="w-32 h-32 bg-brand-primary/5 border border-brand-primary/10 rounded-full flex items-center justify-center mb-10 shadow-2xl relative">
                                    <div className="absolute inset-0 bg-brand-primary/20 blur-3xl rounded-full" />
                                    <FileText className="h-12 w-12 text-brand-primary relative z-10" />
                                </div>
                                <h4 className="text-3xl font-black text-white mb-4 tracking-tighter leading-none">Vácuo de Projetos Detectado</h4>
                                <p className="text-gray-600 mb-12 max-w-sm leading-relaxed font-bold text-sm">
                                    O fluxo neural está inativo. Inicie uma nova sequência de propostas para popular este terminal.
                                </p>
                                <Link href="/dashboard/nova-proposta" className="bg-brand-primary text-black px-12 py-6 rounded-[24px] font-black hover:scale-110 transition-all shadow-[0_0_50px_rgba(13,242,89,0.3)] active:scale-95 uppercase text-[11px] tracking-[0.2em]">
                                    Initialize Generation
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                                            <th className="px-12 py-8 text-[11px] text-gray-700 uppercase tracking-[0.3em] font-black">Asset Identification</th>
                                            <th className="px-12 py-8 text-[11px] text-gray-700 uppercase tracking-[0.3em] font-black">Lifecycle Status</th>
                                            <th className="px-12 py-8 text-[11px] text-gray-700 uppercase tracking-[0.3em] font-black">Neural Stamp</th>
                                            <th className="px-12 py-8 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.03]">
                                        {recentProposals.map((p, idx) => {
                                            const client = Array.isArray(p.proposal_clients) ? p.proposal_clients[0] : p.proposal_clients
                                            const st = statusLabel[p.status] || statusLabel.draft
                                            const link = p.status === 'finalized'
                                                ? `/dashboard/proposta/${p.id}/final`
                                                : p.status === 'preview'
                                                    ? `/dashboard/proposta/${p.id}/final`
                                                    : `/dashboard/proposta/${p.id}/preview`
                                            
                                            const badgeStyles: Record<string, string> = {
                                                draft: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
                                                preview: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
                                                finalized: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20 shadow-[0_0_15px_rgba(13,242,89,0.15)]',
                                            }

                                            return (
                                                <tr key={p.id} className="hover:bg-white/[0.015] transition-all group cursor-pointer">
                                                    <td className="px-12 py-10">
                                                        <div className="flex flex-col gap-2">
                                                            <p className="font-black text-white group-hover:text-brand-primary transition-colors tracking-tighter text-xl leading-none">
                                                                {client?.client_company || client?.client_name || 'Projeto sem Nome'}
                                                            </p>
                                                            <span className="text-[10px] text-gray-700 font-black uppercase tracking-[0.2em] truncate max-w-[400px]">
                                                                {p.title || 'Genetic AI Generated Scope'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-12 py-10">
                                                        <span className={`inline-flex items-center px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${badgeStyles[p.status] || badgeStyles.draft}`}>
                                                            <div className={`w-2 h-2 rounded-full mr-3 ${p.status === 'finalized' ? 'bg-brand-primary shadow-[0_0_10px_#0df259]' : 'bg-current opacity-50'}`} />
                                                            {st.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-12 py-10">
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-white text-xs font-black tracking-widest">{new Date(p.updated_at || p.created_at).toLocaleDateString('pt-BR')}</span>
                                                            <span className="text-gray-700 text-[10px] font-black uppercase tracking-[0.2em]">
                                                                {new Date(p.updated_at || p.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-12 py-10 text-right">
                                                        <Link
                                                            href={link}
                                                            className="inline-flex items-center justify-center w-14 h-14 bg-white/[0.03] border border-white/[0.06] hover:bg-brand-primary text-white hover:text-black rounded-[20px] transition-all duration-500 group/btn shadow-xl active:scale-90"
                                                        >
                                                            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform stroke-[2.5px]" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

