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
import { Sparkles, Check, Banknote, Calendar, Layers, PenTool, Trash2, Plus } from 'lucide-react'
import { generateAiSuggestions, saveUserAdjustments } from '@/app/dashboard/proposta/[id]/preview/actions'

export function PreviewDashboard({ proposalId }: { proposalId: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [data, setData] = useState<any>(null)
    const [adjustedValue, setAdjustedValue] = useState<number>(0)
    const [adjustedTone, setAdjustedTone] = useState<string>('')
    // Add state for struct since user can add/remove
    const [structure, setStructure] = useState<{ title: string, description: string }[]>([])

    // State for modal/inline form to add a section
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
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Sparkles className="w-10 h-10 text-[#C9A84C] animate-pulse" />
                <h2 className="text-xl font-medium text-gray-700">A IA está analisando seu projeto...</h2>
                <p className="text-sm text-gray-500">Calculando valores e estruturando a proposta ideal.</p>
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

    if (!data) return null

    const handleFinish = async () => {
        setSaving(true)
        const res = await saveUserAdjustments(proposalId, adjustedValue, adjustedTone, structure)
        setSaving(false)

        if (res.error) {
            alert("Erro ao salvar ajustes: " + res.error)
            return
        }

        // Go to next step -> final generation
        router.push(`/dashboard/proposta/${proposalId}/final`)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F1B2D]">Preview Inteligente</h1>
                    <p className="text-gray-500">Ajuste e revise as recomendações da IA antes de gerar a proposta final.</p>
                </div>
                <Button onClick={handleFinish} disabled={saving} className="bg-[#C9A84C] hover:bg-[#b09341] text-[#0F1B2D] font-bold">
                    {saving ? 'Salvando...' : 'Aprovar e Avançar'}
                    {!saving && <Check className="ml-2 w-4 h-4" />}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Col - Values & Basic conditions */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="border-0 shadow-sm border-t-4 border-t-[#C9A84C]">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Banknote className="w-5 h-5 text-[#C9A84C]" />
                                Precificação (R$)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-md border border-gray-100">
                                <p className="text-sm font-semibold text-gray-500">Mínimo vs Premium</p>
                                <div className="flex justify-between mt-1">
                                    <span className="text-sm text-gray-600">R$ {data.suggested_value_min}</span>
                                    <span className="text-sm text-gray-600">R$ {data.suggested_value_max}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Valor Recomendado (Sugerido: R$ {data.suggested_value})</Label>
                                <Input
                                    type="number"
                                    value={adjustedValue}
                                    onChange={e => setAdjustedValue(Number(e.target.value))}
                                    className="text-lg font-bold h-12"
                                />
                            </div>

                            <div className="pt-2">
                                <Label className="text-xs text-gray-500">Justificativa da IA</Label>
                                <p className="text-sm mt-1 text-gray-700 italic border-l-2 border-gray-300 pl-2">"{data.reasoning}"</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                Condições
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-xs text-gray-500">Validade da Proposta</Label>
                                <p className="m-0 font-medium">{data.suggested_expiration}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500">Condições de Pagamento</Label>
                                <p className="m-0 font-medium">{data.suggested_payment_terms}</p>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Label className="flex items-center gap-2">
                                    <PenTool className="w-4 h-4 text-gray-400" />
                                    Tom de Voz
                                </Label>
                                <Select value={adjustedTone} onValueChange={setAdjustedTone}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="formal">Formal & Corporativo</SelectItem>
                                        <SelectItem value="friendly">Amigável & Acessível</SelectItem>
                                        <SelectItem value="persuasive">Persuasivo & Comercial</SelectItem>
                                        <SelectItem value="technical">Técnico & Detalhado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Col - Structure */}
                <div className="md:col-span-2">
                    <Card className="border-0 shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Layers className="w-5 h-5 text-[#1A2E4A]" />
                                Estrutura Sugerida
                            </CardTitle>
                            <CardDescription>
                                Ordene ou remova as seções que vão compor a sua proposta final.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {structure.map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50 items-start group">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-[#0F1B2D]">{item.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600"
                                        onClick={() => setStructure(structure.filter((_, i) => i !== idx))}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {isAddingSection ? (
                                <div className="p-4 border border-gray-200 rounded-lg bg-white space-y-3 mt-4">
                                    <div>
                                        <Label className="text-xs">Título da Seção</Label>
                                        <Input
                                            value={newSectionTitle}
                                            onChange={e => setNewSectionTitle(e.target.value)}
                                            placeholder="Ex: Cronograma"
                                            className="mt-1 h-9"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Descrição</Label>
                                        <Input
                                            value={newSectionDesc}
                                            onChange={e => setNewSectionDesc(e.target.value)}
                                            placeholder="O que será abordado nesta seção..."
                                            className="mt-1 h-9"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="ghost" size="sm" onClick={() => setIsAddingSection(false)}>
                                            Cancelar
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-[#1A2E4A]"
                                            disabled={!newSectionTitle.trim() || !newSectionDesc.trim()}
                                            onClick={() => {
                                                setStructure([...structure, { title: newSectionTitle, description: newSectionDesc }]);
                                                setNewSectionTitle('');
                                                setNewSectionDesc('');
                                                setIsAddingSection(false);
                                            }}
                                        >
                                            Adicionar
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full mt-4 border-dashed border-2 py-6 text-gray-500"
                                    onClick={() => setIsAddingSection(true)}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Adicionar Nova Seção
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
