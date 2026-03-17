'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ProposalHistoryItem, deleteProposal, duplicateProposal } from '@/app/dashboard/historico/actions'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    Search,
    Plus,
    Trash2,
    Copy,
    Calendar,
    ArrowRight,
    Filter,
    ArrowUpDown,
    CheckCircle2,
    Clock,
    FileSearch,
    ChevronRight,
    Zap
} from 'lucide-react'

function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'draft' | 'preview' | 'finalized' }) {
    const variants = {
        default: 'bg-white/5 text-gray-500 border-white/5',
        draft: 'bg-amber-500/10 text-amber-500 border-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.05)]',
        preview: 'bg-blue-500/10 text-blue-500 border-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.05)]',
        finalized: 'bg-brand-primary/10 text-brand-primary border-brand-primary/10 shadow-[0_0_15px_rgba(13,242,89,0.05)]'
    }

    const icons = {
        draft: <Clock className="w-3 h-3" />,
        preview: <Zap className="w-3 h-3" />,
        finalized: <CheckCircle2 className="w-3 h-3" />
    }

    return (
        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-2 ${variants[variant]}`}>
            {variant !== 'default' && (icons as any)[variant]}
            {children}
        </span>
    )
}

export function HistoryDashboard({ initialProposals }: { initialProposals: ProposalHistoryItem[] }) {
    const router = useRouter()
    const [proposals, setProposals] = useState(initialProposals)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('date')
    const [isProcessing, setIsProcessing] = useState<string | null>(null)

    const filteredProposals = useMemo(() => {
        let result = proposals.filter(p => {
            const searchLower = search.toLowerCase()
            const matchName = p.client?.client_name?.toLowerCase().includes(searchLower)
            const matchCompany = p.client?.client_company?.toLowerCase().includes(searchLower)
            const matchService = p.service?.service_description?.toLowerCase().includes(searchLower)
            const matchesSearch = !search || matchName || matchCompany || matchService
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter
            return matchesSearch && matchesStatus
        })

        result.sort((a, b) => {
            if (sortBy === 'value') {
                const valA = a.ai_suggestion?.user_adjusted_value || 0
                const valB = b.ai_suggestion?.user_adjusted_value || 0
                return valB - valA
            } else {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            }
        })

        return result
    }, [proposals, search, statusFilter, sortBy])

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Esta ação removerá permanentemente todos os dados vinculados a esta proposta. Confirmar?')) return

        setIsProcessing(id)
        const res = await deleteProposal(id)
        setIsProcessing(null)

        if (!res.error) {
            setProposals(prev => prev.filter(p => p.id !== id))
        }
    }

    const handleDuplicate = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setIsProcessing(id)
        const res = await duplicateProposal(id)
        setIsProcessing(null)

        if (!res.error && res.newId) {
            router.push(`/dashboard/proposta/${res.newId}/preview`)
        }
    }

    const handleView = (id: string, status: string) => {
        if (status === 'finalized') {
            router.push(`/dashboard/proposta/${id}/final`)
        } else {
            router.push(`/dashboard/proposta/${id}/preview`)
        }
    }

    const formatCurrency = (val: number | null | undefined) => {
        if (!val) return 'TBP'
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    }

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(dateStr))
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'draft': return 'Draft'
            case 'preview': return 'Draft IA'
            case 'finalized': return 'Encerrada'
            default: return status
        }
    }

    if (proposals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-center animate-in fade-in duration-1000">
                <div className="relative mb-12">
                    <div className="w-24 h-24 bg-brand-primary/5 rounded-[40px] flex items-center justify-center neon-glow">
                        <FileSearch className="w-10 h-10 text-brand-primary/40" />
                    </div>
                </div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">O histórico está vazio</h2>
                <p className="text-gray-500 mb-12 max-w-sm leading-relaxed font-medium">
                    Comece a escalar seus resultados gerando propostas comerciais de alto impacto com nossa IA.
                </p>
                <Button
                    onClick={() => router.push('/dashboard/nova-proposta')}
                    className="bg-brand-primary hover:brightness-110 text-black font-black h-16 px-12 rounded-[24px] shadow-[0_0_40px_rgba(13,242,89,0.2)] transition-all active:scale-95 uppercase text-xs tracking-widest flex items-center gap-4"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    Nova Proposta
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-12 pb-40 animate-in fade-in duration-1000">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white tracking-tighter">Histórico de <span className="text-brand-primary font-outline text-transparent" style={{ WebkitTextStroke: '1px var(--color-brand-primary)' }}>Propostas</span></h1>
                    <p className="text-gray-500 font-medium">Acompanhe todos os seus contratos e propostas estratégicas.</p>
                </div>
            </div>

            {/* FILTERS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-2 bg-white/[0.02] rounded-[32px] border border-white/[0.03]">
                <div className="lg:col-span-6 relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-700 w-4 h-4" />
                    <Input
                        placeholder="Buscar por cliente, empresa ou serviço..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-14 h-16 bg-white/[0.02] border-transparent rounded-[24px] text-white placeholder:text-gray-700 focus:border-brand-primary/20 focus:bg-white/[0.04] transition-all font-bold text-xs uppercase tracking-widest"
                    />
                </div>

                <div className="lg:col-span-3">
                    <div className="relative group">
                        <Filter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-700 w-3.5 h-3.5 group-focus-within:text-brand-primary transition-colors" />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-16 pl-12 bg-white/[0.02] border-transparent rounded-[24px] text-white focus:ring-brand-primary/20 transition-all font-black text-[10px] uppercase tracking-[0.2em]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0f0f12] border-white/5 text-white rounded-2xl">
                                <SelectItem value="all">Filtro: Todos</SelectItem>
                                <SelectItem value="draft">Rascunhos</SelectItem>
                                <SelectItem value="preview">Draft IA</SelectItem>
                                <SelectItem value="finalized">Encerradas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="relative group">
                        <ArrowUpDown className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-700 w-3.5 h-3.5 group-focus-within:text-brand-primary transition-colors" />
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="h-16 pl-12 bg-white/[0.02] border-transparent rounded-[24px] text-white focus:ring-brand-primary/20 transition-all font-black text-[10px] uppercase tracking-[0.2em]">
                                <SelectValue placeholder="Ordenar" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0f0f12] border-white/5 text-white rounded-2xl">
                                <SelectItem value="date">Data: Recente</SelectItem>
                                <SelectItem value="value">Valor: Est.</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* DATA VIEW */}
            <div className="grid gap-6">
                {filteredProposals.length === 0 ? (
                    <div className="text-center py-24 text-gray-700 glass-effect rounded-[40px] border-dashed border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Nenhum registro para os filtros aplicados</span>
                    </div>
                ) : (
                    filteredProposals.map((proposal, idx) => {
                        const clientName = proposal.client?.client_company || proposal.client?.client_name || 'Prospect Anônimo'
                        const previewVal = proposal.ai_suggestion?.user_adjusted_value

                        return (
                            <Card
                                key={proposal.id}
                                className="group relative overflow-hidden bg-white/[0.02] border-white/[0.03] hover:border-brand-primary/20 hover:bg-white/[0.04] transition-all duration-500 cursor-pointer rounded-[32px] transform hover:-translate-y-1 active:scale-[0.99]"
                                style={{ animationDelay: `${idx * 50}ms` }}
                                onClick={() => handleView(proposal.id, proposal.status)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex flex-col lg:flex-row lg:items-center p-8 gap-8 relative z-10">
                                        {/* Status & Identity */}
                                        <div className="flex-1 min-w-0 space-y-4">
                                            <div className="flex items-center gap-4">
                                                <Badge variant={proposal.status as any}>{getStatusLabel(proposal.status)}</Badge>
                                                <div className="flex items-center gap-2 text-[9px] font-black text-gray-700 uppercase tracking-widest">
                                                    <Calendar className="w-3 h-3" /> {formatDate(proposal.created_at)}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-white group-hover:text-brand-primary transition-all tracking-tight truncate leading-tight">
                                                    {clientName}
                                                </h3>
                                                <p className="text-sm text-gray-500 truncate font-medium mt-1">
                                                    {proposal.title || proposal.service?.service_description}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Values & Metadata */}
                                        <div className="flex flex-wrap items-center gap-8 lg:gap-16">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-gray-700 font-black uppercase tracking-[0.2em] mb-2">Investment</span>
                                                <span className="text-xl font-black text-white group-hover:text-brand-primary transition-colors tracking-tighter">
                                                    {formatCurrency(previewVal)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-12 h-12 rounded-2xl bg-white/[0.02] text-gray-700 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                                                    onClick={(e) => handleDuplicate(proposal.id, e)}
                                                    disabled={isProcessing === proposal.id}
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-12 h-12 rounded-2xl bg-white/[0.02] text-gray-700 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
                                                    onClick={(e) => handleDelete(proposal.id, e)}
                                                    disabled={isProcessing === proposal.id}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-all ml-2 shadow-[0_0_20px_rgba(13,242,89,0)] group-hover:shadow-[0_0_20px_rgba(13,242,89,0.2)]">
                                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover visual accent */}
                                    <div className="absolute left-0 inset-y-0 w-1 bg-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="absolute right-0 top-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
