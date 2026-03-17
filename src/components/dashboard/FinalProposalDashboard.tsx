'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { generateFinalContent, finalizeProposal, updateFinalContent } from '@/app/dashboard/proposta/[id]/final/actions'
import { Button } from '@/components/ui/button'
import { Sparkles, Download, Pencil, Eye, CheckCircle, ArrowLeft, Save, X, Wand2, ShieldCheck, Printer, FileText, Send } from 'lucide-react'

interface ProposalMeta {
    clientName: string
    company: string
    date: string
    title: string
    language?: string
}

const coverTranslations: Record<string, { preparedFor: string, issueDate: string }> = {
    'pt-BR': { preparedFor: 'Preparado especialmente para', issueDate: 'Data de emissão:' },
    'en': { preparedFor: 'Specially prepared for', issueDate: 'Issue date:' },
    'es': { preparedFor: 'Preparado especialmente para', issueDate: 'Fecha de emisión:' },
    'fr': { preparedFor: 'Préparé spécialement pour', issueDate: "Date d'émission :" },
    'de': { preparedFor: 'Speziell vorbereitet für', issueDate: 'Ausstellungsdatum:' },
    'it': { preparedFor: 'Preparato appositamente per', issueDate: 'Data di emissione:' },
}

export function FinalProposalDashboard({ proposalId }: { proposalId: string }) {
    const router = useRouter()
    const [content, setContent] = useState<string | null>(null)
    const [editContent, setEditContent] = useState<string>('')
    const [meta, setMeta] = useState<ProposalMeta | null>(null)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [saveEditStatus, setSaveEditStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    async function fetchDocs(forceRegenerate: boolean = false) {
        setLoading(true)
        const res = await generateFinalContent(proposalId, forceRegenerate)

        if (res.error) {
            setError(res.error)
        } else if (res.data) {
            setContent(res.data)
            setEditContent(res.data)
            setMeta(res.meta as ProposalMeta)
            setProfile(res.profile || null)
            setError(null)
        }

        setLoading(false)
    }

    useEffect(() => {
        fetchDocs()
    }, [proposalId])

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const ta = textareaRef.current
            ta.style.height = 'auto'
            ta.style.height = ta.scrollHeight + 'px'
        }
    }, [isEditing, editContent])

    const handleStartEdit = () => {
        setEditContent(content || '')
        setIsEditing(true)
        setSaveEditStatus('idle')
    }

    const handleCancelEdit = () => {
        setEditContent(content || '')
        setIsEditing(false)
        setSaveEditStatus('idle')
    }

    const handleSaveEdit = async () => {
        setSaveEditStatus('saving')
        const res = await updateFinalContent(proposalId, editContent)

        if (res.success) {
            setContent(editContent)
            setIsEditing(false)
            setSaveEditStatus('success')
            setTimeout(() => setSaveEditStatus('idle'), 3000)
        } else {
            setSaveEditStatus('error')
        }
    }

    const handleFinalize = async () => {
        setSaving(true)
        const res = await finalizeProposal(proposalId)
        setSaving(false)

        if (res.error) {
            alert('Erro ao finalizar: ' + res.error)
        } else {
            router.push('/dashboard/historico')
        }
    }

    const handleExportPDF = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 space-y-12 animate-in fade-in duration-1000">
                <div className="relative">
                    <div className="w-24 h-24 rounded-[32px] bg-brand-primary/10 flex items-center justify-center neon-glow animate-bounce">
                        <FileText className="w-10 h-10 text-brand-primary" />
                    </div>
                </div>
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-black text-white tracking-tighter">
                        Lapidando sua <span className="text-brand-primary">Proposta Final</span>
                    </h2>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                        Estamos gerando cada detalhe do contrato para garantir autoridade e clareza comercial.
                    </p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto p-12 glass-effect border-red-500/10 text-center space-y-8 rounded-[40px] animate-in zoom-in-95">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <X className="w-10 h-10 text-red-500" />
                </div>
                <div>
                    <h3 className="text-2xl font-black text-white tracking-tight">Falha na Redação</h3>
                    <p className="text-gray-500 mt-3 font-medium leading-relaxed">{error}</p>
                </div>
                <Button onClick={() => window.location.reload()} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-7 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95">
                    Tentar Novamente
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto pb-40 print:p-0 print:m-0 print:max-w-none animate-in fade-in duration-1000">
            {/* Header Actions */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 mb-16 print:hidden">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em]">
                        <ShieldCheck className="w-3 h-3 fill-brand-primary" />
                        Documento Finalizado
                    </div>
                    <div className="flex items-center gap-6">
                        <Button 
                            variant="ghost" 
                            onClick={() => router.push('/dashboard')} 
                            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white transition-all p-0 flex items-center justify-center"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-4xl font-black text-white tracking-tighter leading-none">
                            Revisão <span className="text-brand-primary font-outline text-transparent" style={{ WebkitTextStroke: '1px var(--color-brand-primary)' }}>Final</span>
                        </h1>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {isEditing ? (
                        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-[24px] border border-white/5">
                            <Button 
                                variant="ghost" 
                                onClick={handleCancelEdit} 
                                className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all rounded-[18px]"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Descartar
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                disabled={saveEditStatus === 'saving'}
                                className="bg-brand-primary hover:brightness-110 text-black px-10 py-6 rounded-[18px] font-black uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(13,242,89,0.15)] active:scale-95 transition-all"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saveEditStatus === 'saving' ? 'Sincronizando...' : 'Salvar Alterações'}
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => fetchDocs(true)} 
                                    className="h-12 w-12 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all p-0 flex items-center justify-center"
                                    title="Recriar com IA"
                                >
                                    <Wand2 className="w-4 h-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={handleStartEdit} 
                                    className="h-12 w-12 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all p-0 flex items-center justify-center"
                                    title="Editar Manualmente"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    onClick={handleExportPDF} 
                                    className="h-12 w-12 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all p-0 flex items-center justify-center"
                                    title="Imprimir / PDF"
                                >
                                    <Printer className="w-4 h-4" />
                                </Button>
                            </div>

                            <Button
                                onClick={handleFinalize}
                                disabled={saving}
                                className="bg-brand-primary hover:brightness-110 text-black px-12 py-8 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-[0_0_40px_rgba(13,242,89,0.2)] group active:scale-95 transition-all relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-4">
                                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    {saving ? 'Finalizando...' : 'Finalizar Proposta'}
                                </span>
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Editing Mode Banner */}
            {isEditing && (
                <div className="mb-12 p-6 rounded-[32px] bg-brand-primary/5 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] text-center print:hidden flex items-center justify-center gap-4 animate-in slide-in-from-top-4">
                    <Sparkles className="w-4 h-4 fill-brand-primary" />
                    Edição Ativa: Use sintaxe Markdown para ajustes finos de formatação.
                    <Sparkles className="w-4 h-4 fill-brand-primary" />
                </div>
            )}

            {/* A4 Paper Simulation */}
            <div className="relative group max-w-5xl mx-auto transition-transform duration-700">
                {/* Visual context for paper */}
                <div className="absolute inset-0 bg-white/5 rounded-[12px] -rotate-1 scale-[1.02] -z-20 border border-white/5 opacity-50 group-hover:rotate-0 transition-transform duration-700" />
                <div className="absolute inset-0 bg-white/5 rounded-[12px] rotate-1 scale-[1.01] -z-10 border border-white/5 opacity-30 group-hover:rotate-0 transition-transform duration-700" />

                <div
                    className="bg-white shadow-[0_40px_100px_rgba(0,0,0,0.6)] print:shadow-none rounded-[4px] print:border-none w-full min-h-[1056px] text-left mx-auto relative mb-8 print:mb-0 overflow-hidden"
                    style={{
                        fontFamily: profile?.brand_font === 'serif' ? 'ui-serif, Georgia' : profile?.brand_font === 'mono' ? 'ui-monospace, Consolas' : 'inherit'
                    }}
                >
                    {/* 1. Cover Page */}
                    <div className="h-[1056px] print:h-[100vh] flex flex-col justify-center items-start px-32 border-b border-gray-100 print:border-none bg-[#fafafa] print:bg-white pb-32 print:break-after-page relative overflow-hidden">
                        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gray-200/40 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-gray-200/30 rounded-full blur-[100px] pointer-events-none" />
                        
                        {profile?.company_logo_url ? (
                            <div className="mb-16 max-w-64 max-h-40 flex items-center justify-start relative z-10 transition-transform hover:scale-105 duration-500">
                                <img src={profile.company_logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                            </div>
                        ) : (
                            <div
                                className="w-24 h-24 rounded-3xl mb-16 flex items-center justify-center text-white relative z-10 shadow-2xl rotate-3"
                                style={{
                                    backgroundColor: profile?.brand_primary_color || '#000',
                                }}
                            >
                                <span className="font-black text-4xl">P</span>
                            </div>
                        )}
                        
                        <div className="space-y-12 relative z-10 w-full">
                            <div
                                className="w-24 h-2.5 rounded-full"
                                style={{ backgroundColor: profile?.brand_secondary_color || '#C9A84C' }}
                            ></div>
                            
                            <div>
                                <h1
                                    className="text-7xl font-black mb-6 leading-[1] tracking-tighter"
                                    style={{ color: profile?.brand_primary_color || '#111' }}
                                >
                                    {meta?.title || 'Proposta Comercial'}
                                </h1>
                                <p className="text-3xl text-gray-400 font-medium leading-relaxed max-w-2xl">
                                    {(coverTranslations[meta?.language || 'pt-BR'] || coverTranslations['pt-BR']).preparedFor}{' '}
                                    <span style={{ color: profile?.brand_primary_color || '#111' }} className="font-black underline decoration-gray-200 decoration-8 underline-offset-8">
                                        {meta?.clientName}
                                    </span>
                                </p>
                            </div>

                            <div className="pt-24">
                                <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-[10px] mb-4">{(coverTranslations[meta?.language || 'pt-BR'] || coverTranslations['pt-BR']).issueDate}</p>
                                <p className="font-black text-2xl tracking-tighter" style={{ color: profile?.brand_primary_color || '#111' }}>{meta?.date}</p>
                            </div>
                        </div>
                        
                        {/* Decorative footer bars */}
                        <div className="absolute bottom-12 left-32 right-32 flex gap-4 opacity-10">
                            <div className="h-1 flex-1 bg-gray-400 rounded-full" />
                            <div className="h-1 flex-1 bg-gray-400 rounded-full" />
                            <div className="h-1 flex-1 bg-gray-400 rounded-full" />
                        </div>
                    </div>

                    {/* 2. Main Content Page */}
                    <div className="p-24 sm:p-28 lg:p-32 overflow-hidden print:p-12 print:pt-20 bg-white"
                        style={{
                            '--tw-prose-headings': profile?.brand_primary_color || '#111',
                            '--tw-prose-links': profile?.brand_secondary_color || '#111',
                        } as any}
                    >
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .prose h1, .prose h2, .prose h3 { color: ${profile?.brand_primary_color || '#111'}; font-weight: 900; tracking: -0.04em; margin-top: 3em; margin-bottom: 1.2em; position: relative; }
                            .prose h1::after, .prose h2::after { content: ''; position: absolute; left: 0; bottom: -0.5em; width: 2em; h-1.5; background: ${profile?.brand_secondary_color || '#eee'}; border-radius: 99px; opacity: 0.5; }
                            .prose p { line-height: 1.9; margin-bottom: 1.8em; color: #374151; font-size: 1.05rem; }
                            .prose strong { color: #111; font-weight: 800; }
                            .prose a { color: ${profile?.brand_secondary_color || '#111'}; text-decoration: underline; font-weight: bold; }
                            .prose li { margin-bottom: 1em; color: #374151; }
                            .prose li::marker { color: ${profile?.brand_secondary_color || '#111'}; font-weight: 900; }
                            .prose blockquote { border-left-width: 8px; border-left-color: ${profile?.brand_secondary_color || '#eee'}; background: #fafafa; padding: 2.5em 3em; border-radius: 24px; font-style: italic; font-weight: 500; font-size: 1.2rem; color: #4B5563; }
                            .prose hr { border-color: #f1f1f1; margin: 5em 0; border-width: 2px; }
                        `}} />

                        {isEditing ? (
                            <div className="print:hidden">
                                <textarea
                                    ref={textareaRef}
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full min-h-[900px] p-0 border-0 outline-none resize-none bg-transparent text-lg font-medium leading-relaxed text-gray-800 placeholder:text-gray-300 custom-scrollbar"
                                    placeholder="Redija o conteúdo estratégico aqui..."
                                    spellCheck
                                />
                            </div>
                        ) : (
                            <div className="prose prose-slate max-w-none prose-lg animate-in fade-in duration-1000">
                                {content && (
                                    <ReactMarkdown>
                                        {content}
                                    </ReactMarkdown>
                                )}
                            </div>
                        )}

                        {/* Digital Signature */}
                        {!isEditing && profile?.digital_signature_url && (
                            <div className="mt-32 pt-20 border-t-2 border-gray-50 flex flex-col items-start translate-y-8 opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards delay-500">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-gray-100/50 blur-xl rounded-full scale-150" />
                                    <img src={profile.digital_signature_url} alt="Assinatura" className="max-h-36 relative z-10 grayscale-0 mix-blend-multiply transition-all" />
                                </div>
                                <div>
                                    <p className="font-black text-2xl tracking-tighter mb-2" style={{ color: profile?.brand_primary_color || '#111' }}>
                                        {profile?.full_name}
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: profile?.brand_secondary_color || '#eee' }} />
                                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">{profile?.company_name}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Print Help Container */}
            <div className="mt-20 flex flex-col items-center gap-12 print:hidden">
                <div className="px-8 py-5 glass-effect border-white/5 rounded-[32px] flex items-center gap-6 group hover:border-brand-primary/20 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary neon-glow">
                        <Printer className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] max-w-md leading-relaxed">
                        Ao exportar para PDF, verifique se a opção <span className="text-white">"Gráficos de Segundo Plano"</span> está ativada no Chrome.
                    </p>
                </div>
                
                <div className="flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
                    <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-brand-primary/50 to-transparent" />
                    <span className="text-white font-black text-[9px] uppercase tracking-[0.4em]">Propriedade intelectual da {profile?.company_name || 'Agência'}</span>
                </div>
            </div>
        </div>
    )
}
