'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { generateFinalContent, finalizeProposal, updateFinalContent } from '@/app/dashboard/proposta/[id]/final/actions'
import { Button } from '@/components/ui/button'
import { Sparkles, Download, Pencil, Eye, CheckCircle, ArrowLeft, Save, X } from 'lucide-react'

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

    // Auto-resize textarea when editing
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
            alert('Proposta marcada como Finalizada!')
            router.push('/dashboard/historico')
        }
    }

    const handleExportPDF = () => {
        window.print()
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Sparkles className="w-10 h-10 text-[#C9A84C] animate-pulse" />
                <h2 className="text-xl font-medium text-gray-700">A IA está redigindo sua proposta final...</h2>
                <p className="text-sm text-gray-500">Isso pode levar alguns segundos dependendo da complexidade.</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">
                <p>Erro: {error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">Tentar Novamente</Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto pb-12 print:p-0 print:m-0 print:max-w-none">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 print:hidden">
                <Button variant="ghost" onClick={() => router.push('/dashboard')} className="text-gray-500">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Dashboard
                </Button>

                <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={handleCancelEdit} className="text-gray-500">
                                <X className="w-4 h-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSaveEdit}
                                disabled={saveEditStatus === 'saving'}
                                className="bg-[#2ECC71] hover:bg-[#27ae60] text-white"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {saveEditStatus === 'saving' ? 'Salvando...' : 'Salvar Edição'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" onClick={() => fetchDocs(true)}>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Recriar Texto
                            </Button>
                            <Button variant="outline" onClick={handleStartEdit}>
                                <Pencil className="w-4 h-4 mr-2" />
                                Editar Proposta
                            </Button>
                            <Button variant="outline" onClick={handleExportPDF}>
                                <Download className="w-4 h-4 mr-2" />
                                Exportar PDF
                            </Button>
                            <Button
                                onClick={handleFinalize}
                                disabled={saving}
                                className="bg-[#2ECC71] hover:bg-[#27ae60] text-white"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {saving ? 'Salvando...' : 'Marcar como Finalizada'}
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Save Edit Feedback */}
            {saveEditStatus === 'success' && (
                <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm text-center print:hidden animate-in fade-in">
                    ✅ Edição salva com sucesso!
                </div>
            )}
            {saveEditStatus === 'error' && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center print:hidden">
                    ❌ Erro ao salvar a edição. Tente novamente.
                </div>
            )}

            {/* Editing Mode Banner */}
            {isEditing && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-sm text-center print:hidden flex items-center justify-center gap-2">
                    <Pencil className="w-4 h-4" />
                    <span><strong>Modo de Edição</strong> — Edite o conteúdo Markdown abaixo. Use <code className="bg-amber-100 px-1 rounded">## Título</code>, <code className="bg-amber-100 px-1 rounded">**negrito**</code>, <code className="bg-amber-100 px-1 rounded">- lista</code>.</span>
                </div>
            )}

            {/* A4 Paper Simulation Container */}
            <div
                className="bg-white shadow-xl print:shadow-none rounded-sm border border-gray-200 print:border-none w-full min-h-[1056px] text-left mx-auto relative mb-8 print:mb-0"
                style={{
                    fontFamily: profile?.brand_font === 'serif' ? 'ui-serif, Georgia' : profile?.brand_font === 'mono' ? 'ui-monospace, Consolas' : 'inherit'
                }}
            >
                {/* 1. Cover Page */}
                <div className="h-[1056px] print:h-[100vh] flex flex-col justify-center items-start px-20 border-b border-gray-100 print:border-none bg-[#fafafa] print:bg-white pb-20 print:break-after-page">
                    {profile?.company_logo_url ? (
                        <div className="mb-8 max-w-48 max-h-32 flex items-center justify-start">
                            <img src={profile.company_logo_url} alt="Logo" className="max-w-full max-h-full object-contain" />
                        </div>
                    ) : (
                        <div
                            className="w-16 h-16 rounded-lg mb-8 flex items-center justify-center text-white border"
                            style={{
                                backgroundColor: profile?.brand_primary_color || '#1A2E4A',
                                borderColor: profile?.brand_primary_color || '#1A2E4A'
                            }}
                        >
                            <span className="font-bold text-2xl">PRO</span>
                        </div>
                    )}
                    <div
                        className="w-16 h-2 mb-8"
                        style={{ backgroundColor: profile?.brand_secondary_color || '#C9A84C' }}
                    ></div>
                    <h1
                        className="text-5xl font-bold mb-4 leading-tight"
                        style={{ color: profile?.brand_primary_color || '#0F1B2D' }}
                    >
                        {meta?.title || 'Proposta Comercial'}
                    </h1>
                    <p className="text-2xl text-gray-500 mb-16">
                        {(coverTranslations[meta?.language || 'pt-BR'] || coverTranslations['pt-BR']).preparedFor}{' '}
                        <strong style={{ color: profile?.brand_primary_color || '#0F1B2D' }}>{meta?.clientName}</strong>
                    </p>

                    <div className="mt-auto">
                        <p className="text-gray-400 font-medium">{(coverTranslations[meta?.language || 'pt-BR'] || coverTranslations['pt-BR']).issueDate}</p>
                        <p className="font-bold text-lg" style={{ color: profile?.brand_primary_color || '#0F1B2D' }}>{meta?.date}</p>
                    </div>
                </div>

                {/* 2. Main Content Page */}
                <div className="p-8 sm:p-14 lg:p-20 overflow-hidden print:p-10 print:pt-16"
                    style={{
                        '--tw-prose-headings': profile?.brand_primary_color || '#0F1B2D',
                        '--tw-prose-links': profile?.brand_secondary_color || '#C9A84C',
                    } as any}
                >
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        .prose h1, .prose h2, .prose h3 { color: ${profile?.brand_primary_color || '#0F1B2D'}; }
                        .prose a { color: ${profile?.brand_secondary_color || '#C9A84C'}; }
                        .prose li::marker { color: ${profile?.brand_secondary_color || '#C9A84C'}; }
                    `}} />

                    {isEditing ? (
                        /* ===== EDIT MODE: Markdown textarea ===== */
                        <div className="print:hidden">
                            <textarea
                                ref={textareaRef}
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full min-h-[800px] p-0 border-0 outline-none resize-none bg-transparent text-sm font-mono leading-relaxed text-gray-800 placeholder:text-gray-400"
                                placeholder="Edite o conteúdo da proposta em Markdown..."
                                spellCheck
                            />
                        </div>
                    ) : (
                        /* ===== VIEW MODE: Rendered Markdown ===== */
                        <div className="prose prose-slate max-w-none">
                            {content && (
                                <ReactMarkdown>
                                    {content}
                                </ReactMarkdown>
                            )}
                        </div>
                    )}

                    {/* Digital Signature */}
                    {!isEditing && profile?.digital_signature_url && (
                        <div className="mt-16 pt-8 border-t border-gray-200">
                            <img src={profile.digital_signature_url} alt="Assinatura Digital" className="max-h-24 mb-4" />
                            <p className="font-bold" style={{ color: profile?.brand_primary_color || '#0F1B2D' }}>
                                {profile?.full_name}
                            </p>
                            <p className="text-gray-500 text-sm">{profile?.company_name}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Mode: Side-by-side Preview */}
            {isEditing && (
                <div className="print:hidden">
                    <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>Pré-visualização em tempo real:</span>
                    </div>
                    <div
                        className="bg-white shadow-lg rounded-sm border border-gray-200 p-8 sm:p-14 lg:p-20 prose prose-slate max-w-none mb-8"
                    >
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            .prose h1, .prose h2, .prose h3 { color: ${profile?.brand_primary_color || '#0F1B2D'}; }
                            .prose a { color: ${profile?.brand_secondary_color || '#C9A84C'}; }
                            .prose li::marker { color: ${profile?.brand_secondary_color || '#C9A84C'}; }
                        `}} />
                        <ReactMarkdown>
                            {editContent}
                        </ReactMarkdown>
                    </div>
                </div>
            )}

            <p className="text-center text-sm text-gray-400 print:hidden">
                Para um PDF perfeito, usamos a tecnologia nativa do navegador. Seu texto ficará selecionável, o arquivo mais leve e a formatação exata!
            </p>
        </div>
    )
}
