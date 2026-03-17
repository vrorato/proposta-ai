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
    MoreHorizontal,
    Trash2,
    Copy,
    Eye,
    FileText,
    Calendar,
    ArrowRight
} from 'lucide-react'

// Simple Badge component
function Badge({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'draft' | 'preview' | 'finalized' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-800',
        draft: 'bg-gray-100 text-gray-600 border border-gray-200',
        preview: 'bg-amber-100 text-amber-800 border border-amber-200',
        finalized: 'bg-emerald-100 text-emerald-800 border border-emerald-200'
    }
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
            {children}
        </span>
    )
}

export function HistoryDashboard({ initialProposals }: { initialProposals: ProposalHistoryItem[] }) {
    const router = useRouter()
    const [proposals, setProposals] = useState(initialProposals)
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortBy, setSortBy] = useState('date') // 'date' or 'value'
    const [isProcessing, setIsProcessing] = useState<string | null>(null)

    // Derived state for filtering and sorting
    const filteredProposals = useMemo(() => {
        let result = proposals.filter(p => {
            // Text Search
            const searchLower = search.toLowerCase()
            const matchName = p.client?.client_name?.toLowerCase().includes(searchLower)
            const matchCompany = p.client?.client_company?.toLowerCase().includes(searchLower)
            const matchService = p.service?.service_description?.toLowerCase().includes(searchLower)
            const matchesSearch = !search || matchName || matchCompany || matchService

            // Status filter
            const matchesStatus = statusFilter === 'all' || p.status === statusFilter

            return matchesSearch && matchesStatus
        })

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'value') {
                const valA = a.ai_suggestion?.user_adjusted_value || 0
                const valB = b.ai_suggestion?.user_adjusted_value || 0
                return valB - valA // Highest value first
            } else {
                // date fallback (newest first)
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            }
        })

        return result
    }, [proposals, search, statusFilter, sortBy])

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm('Tem certeza que deseja excluir esta proposta? Isso não tem volta.')) return

        setIsProcessing(id)
        const res = await deleteProposal(id)
        setIsProcessing(null)

        if (res.error) {
            alert(res.error)
        } else {
            setProposals(prev => prev.filter(p => p.id !== id))
        }
    }

    const handleDuplicate = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setIsProcessing(id)
        const res = await duplicateProposal(id)
        setIsProcessing(null)

        if (res.error) {
            alert(res.error)
        } else {
            router.refresh() // Will trigger a server fetch to update the layout
            // Let's also navigate to the new copy
            if (res.newId) router.push(`/dashboard/proposta/${res.newId}/preview`)
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
        if (!val) return 'Não definido'
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
    }

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateStr))
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'draft': return 'Rascunho'
            case 'preview': return 'Sugestão IA'
            case 'finalized': return 'Finalizada'
            default: return status
        }
    }

    // EMPTY STATE
    if (proposals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-[#0F1B2D] mb-2">Nenhuma proposta encontrada</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    Você ainda não gerou nenhuma proposta comercial.
                    Que tal começar agora e surpreender seu cliente?
                </p>
                <Button
                    onClick={() => router.push('/dashboard/nova-proposta')}
                    className="bg-[#C9A84C] hover:bg-[#b09341] text-[#0F1B2D] font-bold h-12 px-6"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Criar a primeira proposta
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F1B2D]">Histórico de Propostas</h1>
                    <p className="text-gray-500">Gerencie todas as suas negociações em andamento</p>
                </div>
                <Button
                    onClick={() => router.push('/dashboard/nova-proposta')}
                    className="bg-[#1A2E4A] hover:bg-[#0F1B2D] text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Proposta
                </Button>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Buscar por cliente, empresa ou serviço..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 h-10"
                    />
                </div>
                <div className="w-full md:w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os Status</SelectItem>
                            <SelectItem value="draft">Rascunhos</SelectItem>
                            <SelectItem value="preview">Em aprovação (IA)</SelectItem>
                            <SelectItem value="finalized">Finalizadas</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full md:w-48">
                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-10">
                            <SelectValue placeholder="Ordenar por" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="date">Mais Recentes</SelectItem>
                            <SelectItem value="value">Maior Valor</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* DATA VIEW */}
            <div className="grid gap-4">
                {filteredProposals.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Nenhuma proposta atende aos seus filtros.
                    </div>
                ) : (
                    filteredProposals.map(proposal => {
                        const clientName = proposal.client?.client_company || proposal.client?.client_name || 'Cliente sem nome'
                        const previewVal = proposal.ai_suggestion?.user_adjusted_value

                        return (
                            <Card
                                key={proposal.id}
                                className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border-gray-200"
                                onClick={() => handleView(proposal.id, proposal.status)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row items-center p-4 gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-semibold text-gray-900 truncate">
                                                    Proposta para {clientName}
                                                </h3>
                                                <Badge variant={proposal.status as any}>{getStatusLabel(proposal.status)}</Badge>
                                            </div>
                                            <p className="text-sm text-gray-500 truncate mt-1">
                                                {proposal.title}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-6 text-sm text-gray-600">
                                            <div className="hidden sm:flex flex-col items-end">
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Data
                                                </span>
                                                <span className="font-medium text-gray-900">{formatDate(proposal.created_at)}</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs text-gray-400">Valor</span>
                                                <span className="font-semibold text-[#C9A84C] whitespace-nowrap">
                                                    {formatCurrency(previewVal)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="hidden md:block w-px h-10 bg-gray-100 mx-2"></div>

                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-500 hover:text-[#1A2E4A]"
                                                title="Duplicar"
                                                onClick={(e) => handleDuplicate(proposal.id, e)}
                                                disabled={isProcessing === proposal.id}
                                            >
                                                <Copy className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-500 hover:text-red-600"
                                                title="Excluir"
                                                onClick={(e) => handleDelete(proposal.id, e)}
                                                disabled={isProcessing === proposal.id}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleView(proposal.id, proposal.status)
                                                }}
                                            >
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                )}
            </div>
        </div>
    )
}
