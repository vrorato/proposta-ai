'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Sparkles, Check, Banknote, Calendar, Layers, PenTool, Trash2, Plus, ArrowRight, Wand2, Calculator, Info, Zap } from 'lucide-react'
import { generateAiSuggestions, saveUserAdjustments } from '@/app/dashboard/proposta/[id]/preview/actions'

export function PreviewDashboard({ proposalId }: { proposalId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [data, setData] = useState<any>(null)
    const [adjustedValue, setAdjustedValue] = useState<number>(0)
    const [adjustedTone, setAdjustedTone] = useState<string>('')
    const [structure, setStructure] = useState<{ title: string, description: string }[]>([])

    const [isAddingSection, setIsAddingSection] = useState(false)
    const [newSectionTitle, setNewSectionTitle] = useState('')
    const [newSectionDesc, setNewSectionDesc] = useState('')

    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function load() {
            setLoading(true)
            const res = await generateAiSuggestions(proposalId)
            if (res.error) {
                setError(res.error)
            } else if (res.data) {
                setData(res.data)
                setAdjustedValue(res.data.suggested_value)
                setAdjustedTone(res.data.suggested_tone)
                setStructure(res.data.suggested_structure || [])
            }
            setLoading(false)
        }
        load()
    }, [proposalId])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-12 animate-in fade-in duration-1000">
                <div className="relative">
                    <div className="w-24 h-24 rounded-[32px] bg-brand-primary/10 flex items-center justify-center neon-glow animate-bounce">
                        <Wand2 className="w-10 h-10 text-brand-primary" />
                    </div>
                    {/* Floating particles (simulated with circles) */}
                    <div className="absolute -top-4 -left-4 w-3 h-3 bg-brand-primary rounded-full animate-ping opacity-75" />
                    <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-brand-primary rounded-full animate-ping opacity-50 delay-300" />
                </div>
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                        Consultando a <span className="text-brand-primary">Inteligência Estratégica</span>
                    </h2>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                        Estamos analisando seu escopo, mercado e concorrência para projetar o valor ideal e a estrutura mais persuasiva.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse delay-150" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-12 glass-effect border-red-500/10 text-center space-y-8 rounded-[40px] animate-in zoom-in-95">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <Info className="w-10 h-10 text-red-500" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Análise Interrompida</h3>
                    <p className="text-gray-500 mt-3 font-medium leading-relaxed">{error}</p>
                </div>
                <Button onClick={() => window.location.reload()} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-7 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95">
                    Reiniciar Processamento
                </Button>
            </div>
        )
    }

    if (!data) return null

    const handleFinish = async () => {
        setSaving(true)
        const res = await saveUserAdjustments(proposalId, adjustedValue, adjustedTone, structure)
        setSaving(false)

        if (res.error) {
            alert("Erro ao salvar ajustes: " + res.error)
            return
        }

        router.push(`/dashboard/proposta/${proposalId}/final`)
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em]">
                        <Zap className="w-3 h-3 fill-brand-primary" />
                        AI Strategic Review
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter leading-none">
                        Refine sua <span className="text-brand-primary font-outline text-transparent" style={{ WebkitTextStroke: '1px var(--color-brand-primary)' }}>Estratégia</span> v1.0
                    </h1>
                    <p className="text-gray-500 font-medium text-lg max-w-2xl leading-relaxed">
                        A IA projetou o valor e a estrutura baseada nos seus dados. 
                        Revise os pontos críticos antes de gerar o documento final.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <Button 
                        onClick={handleFinish} 
                        disabled={saving} 
                        className="bg-brand-primary hover:brightness-110 text-black px-12 py-8 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center gap-4 shadow-[0_0_50px_rgba(13,242,89,0.25)] group active:scale-95 transition-all disabled:opacity-50 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative z-10 flex items-center gap-4">
                            {saving ? (
                                <>
                                    <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                                    Finalizando...
                                </>
                            ) : (
                                <>
                                    Aprovar e Publicar
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column - Financial & Config */}
                <div className="lg:col-span-4 space-y-10">
                    {/* Valuation Card */}
                    <Card className="glass-effect border-brand-primary/20 neon-glow rounded-[40px] overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                        
                        <CardHeader className="pb-8 pt-10 px-10 border-b border-white/5">
                            <CardTitle className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                                <Calculator className="w-4 h-4 text-brand-primary" />
                                Projeção Financeira
                            </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="space-y-10 p-10">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5 group hover:bg-white/[0.05] transition-all">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-600 mb-2">Piso Sugerido</p>
                                    <p className="text-xl font-black text-white">R$ {data.suggested_value_min}</p>
                                </div>
                                <div className="bg-brand-primary/[0.03] p-6 rounded-3xl border border-brand-primary/10 group hover:bg-brand-primary/[0.05] transition-all">
                                    <p className="text-[9px] font-black uppercase tracking-widest text-brand-primary/60 mb-2">Teto Premium</p>
                                    <p className="text-xl font-black text-brand-primary">R$ {data.suggested_value_max}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Preço Final da Proposta</Label>
                                <div className="relative group/input">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-primary font-black text-2xl group-focus-within/input:scale-110 transition-transform">R$</div>
                                    <Input
                                        type="number"
                                        value={adjustedValue}
                                        onChange={e => setAdjustedValue(Number(e.target.value))}
                                        className="bg-white/[0.02] border-white/5 text-4xl font-black h-24 pl-16 rounded-[28px] focus:border-brand-primary/40 focus:bg-white/[0.05] transition-all text-white outline-none"
                                    />
                                </div>
                            </div>

                            <div className="bg-white/[0.03] p-6 rounded-[32px] border border-white/5 relative group">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-500 text-[9px] font-black uppercase tracking-widest mb-4 group-hover:bg-brand-primary/10 group-hover:text-brand-primary group-hover:border-brand-primary/20 transition-all">
                                    <Sparkles className="w-3 h-3" />
                                    Lógica de Precificação
                                </div>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed italic">
                                    "{data.reasoning}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Conditions Card */}
                    <Card className="glass-effect border-white/5 rounded-[40px]">
                        <CardHeader className="pb-8 pt-10 px-10 border-b border-white/5">
                            <CardTitle className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                                <PenTool className="w-4 h-4 text-gray-500" />
                                Tom & Entrega
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 p-10">
                            <div className="space-y-6">
                                <div className="group">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1 transition-colors group-hover:text-white">Validade da Proposta</Label>
                                    <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 text-white font-black text-sm uppercase tracking-widest flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        {data.suggested_expiration}
                                    </div>
                                </div>
                                <div className="group">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-3 block ml-1 transition-colors group-hover:text-white">Regras de Negócio</Label>
                                    <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 text-gray-400 text-xs font-medium leading-relaxed">
                                        {data.suggested_payment_terms}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Personalidade da Escrita</Label>
                                <Select value={adjustedTone} onValueChange={setAdjustedTone}>
                                    <SelectTrigger className="bg-white/[0.03] border-white/5 h-16 rounded-2xl text-white font-black uppercase tracking-widest text-[10px] focus:ring-0 focus:border-brand-primary/40 focus:bg-white/[0.05] transition-all px-6 outline-none hover:bg-white/[0.05]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#0f0f12] border-white/10 text-white rounded-[24px] overflow-hidden">
                                        <SelectItem value="formal" className="py-4 hover:bg-brand-primary/10 transition-colors">👔 Corporativo & Autoritário</SelectItem>
                                        <SelectItem value="friendly" className="py-4 hover:bg-brand-primary/10 transition-colors">🤝 Próximo & Empático</SelectItem>
                                        <SelectItem value="persuasive" className="py-4 hover:bg-brand-primary/10 transition-colors">🔥 Comercial & Persuasivo</SelectItem>
                                        <SelectItem value="technical" className="py-4 hover:bg-brand-primary/10 transition-colors">⚙️ Analítico & Robusto</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Structure & Sections */}
                <div className="lg:col-span-8">
                    <Card className="glass-effect border-white/5 rounded-[40px] h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-brand-primary/0 group-hover:bg-brand-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-all duration-1000" />
                        
                        <CardHeader className="pb-8 pt-10 px-10 border-b border-white/5 relative z-10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
                                    <Layers className="w-4 h-4 text-brand-primary" />
                                    Arquitetura de Conversão
                                </CardTitle>
                                <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-[9px] font-black text-brand-primary uppercase tracking-[0.2em] border border-brand-primary/20">
                                    {structure.length} Seções Ativas
                                </span>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="flex-1 p-10 relative z-10">
                            <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar">
                                {structure.map((item, idx) => (
                                    <div 
                                        key={idx} 
                                        className="group relative flex gap-8 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] items-start hover:border-brand-primary/30 hover:bg-brand-primary/[0.01] transition-all duration-500 animate-in slide-in-from-right-8"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[13px] font-black text-gray-500 border border-white/10 group-hover:bg-brand-primary group-hover:text-black group-hover:border-brand-primary transition-all duration-500 shadow-xl">
                                                {String(idx + 1).padStart(2, '0')}
                                            </div>
                                            <div className="w-[1px] h-full bg-gradient-to-b from-white/10 to-transparent flex-1" />
                                        </div>
                                        
                                        <div className="flex-1 space-y-3">
                                            <h4 className="font-black text-white text-xl tracking-tight leading-none group-hover:translate-x-1 transition-transform duration-500">
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-500 font-medium leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setStructure(structure.filter((_, i) => i !== idx))}
                                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-700 hover:bg-red-500/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                                            title="Remover Seção"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}

                                {isAddingSection ? (
                                    <div className="p-10 border-2 border-dashed border-brand-primary/20 rounded-[32px] bg-brand-primary/[0.02] space-y-8 animate-in zoom-in-95 duration-500">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary ml-1">Label da Seção</Label>
                                                <Input
                                                    value={newSectionTitle}
                                                    onChange={e => setNewSectionTitle(e.target.value)}
                                                    placeholder="Explore: Benefícios, Etapas..."
                                                    className="bg-black/40 border-white/5 h-16 rounded-2xl text-white font-bold px-6 focus:border-brand-primary transition-all"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary ml-1">Objetivo da Seção</Label>
                                                <Input
                                                    value={newSectionDesc}
                                                    onChange={e => setNewSectionDesc(e.target.value)}
                                                    placeholder="O que esta seção deve provar?"
                                                    className="bg-black/40 border-white/5 h-16 rounded-2xl text-white font-bold px-6 focus:border-brand-primary transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-4">
                                            <button 
                                                onClick={() => setIsAddingSection(false)} 
                                                className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <Button
                                                className="bg-brand-primary hover:brightness-110 text-black px-10 py-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-[0_0_30px_rgba(13,242,89,0.2)] disabled:opacity-50"
                                                disabled={!newSectionTitle.trim() || !newSectionDesc.trim()}
                                                onClick={() => {
                                                    setStructure([...structure, { title: newSectionTitle, description: newSectionDesc }]);
                                                    setNewSectionTitle('');
                                                    setNewSectionDesc('');
                                                    setIsAddingSection(false);
                                                }}
                                            >
                                                Confirmar Seção
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        className="w-full mt-6 group/add relative"
                                        onClick={() => setIsAddingSection(true)}
                                    >
                                        <div className="absolute inset-0 bg-brand-primary/5 rounded-[32px] scale-[0.98] group-hover/add:scale-100 transition-transform duration-500 blur-xl opacity-0 group-hover/add:opacity-100" />
                                        <div className="relative flex flex-col items-center justify-center p-16 bg-white/[0.01] border-2 border-dashed border-white/5 rounded-[32px] group-hover/add:border-brand-primary/30 group-hover/add:bg-brand-primary/[0.01] transition-all duration-500">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover/add:bg-brand-primary group-hover/add:text-black transition-all duration-500 group-hover/add:shadow-[0_0_30px_rgba(13,242,89,0.3)]">
                                                <Plus className="w-8 h-8 group-hover/add:rotate-90 transition-transform duration-500" />
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 group-hover/add:text-white transition-colors">
                                                Injetar Nova Seção Customizada
                                            </span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
