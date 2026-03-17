'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import { saveProposalDraft, ProposalWizardData } from '@/app/dashboard/nova-proposta/actions'

const STEPS = [
    { id: 'client', title: 'Dados do Cliente', fields: ['client_name', 'client_company', 'client_email', 'segment'] },
    { id: 'service', title: 'Sobre o Serviço', fields: ['service_description', 'estimated_hours', 'deadline', 'complexity'] },
    { id: 'extras', title: 'Detalhes Adicionais', fields: ['differentials', 'extra_info', 'tone'] },
]

export function ProposalWizard() {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<Partial<ProposalWizardData>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleNext = () => {
        // Very basic client validation (for demo purposes)
        if (currentStep === 0 && !formData.client_name) {
            setError('Nome do cliente é obrigatório.')
            return
        }
        if (currentStep === 1 && !formData.service_description) {
            setError('Descrição do serviço é obrigatória.')
            return
        }

        setError(null)
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(s => s + 1)
        }
    }

    const handlePrev = () => {
        setError(null)
        if (currentStep > 0) {
            setCurrentStep(s => s - 1)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        setError(null)

        const result = await saveProposalDraft({
            // Castings just for the safety of the current partial typing
            client_name: formData.client_name || '',
            client_company: formData.client_company,
            client_email: formData.client_email,
            segment: formData.segment,
            service_description: formData.service_description || '',
            estimated_hours: formData.estimated_hours ? Number(formData.estimated_hours) : undefined,
            deadline: formData.deadline,
            complexity: formData.complexity as any,
            differentials: formData.differentials,
            extra_info: formData.extra_info,
            tone: formData.tone as any,
            language: formData.language || 'pt-BR'
        })

        if (result?.error) {
            setError(result.error)
            setIsSubmitting(false)
        }
        // Sucesso será redirecionado
    }

    const fillTestData = () => {
        setFormData({
            client_name: 'João Silva',
            client_company: 'Suprema Tech',
            client_email: 'joao@teste.com',
            segment: 'Tecnologia da Informação',
            service_description: 'Desenvolvimento de um sistema de gestão ERP completo com módulos de faturamento, controle de estoque e relatórios financeiros automáticos.',
            estimated_hours: 120,
            deadline: '45 dias',
            complexity: 'high',
            differentials: 'Atendimento via WhatsApp 24/7, garantia de 1 ano contra bugs e servidor AWS configurado.',
            extra_info: 'O cliente é detalhista e prioriza a segurança. Mostrar valor a longo prazo.',
            tone: 'formal',
            language: 'pt-BR'
        })
    }

    const progressPercentage = ((currentStep + 1) / STEPS.length) * 100

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#0F1B2D] mb-2">{STEPS[currentStep].title}</h2>
                    <p className="text-gray-500 mb-4">Etapa {currentStep + 1} de {STEPS.length}</p>
                </div>
                <Button variant="outline" onClick={fillTestData} type="button" size="sm" className="text-xs">
                    Preencher Dados Teste
                </Button>
            </div>

            <Progress value={progressPercentage} className="h-2 bg-gray-200 mb-8" />

            <Card className="border-0 shadow-md">
                <CardContent className="pt-6">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}

                    {/* STEP 1: CLIENTE */}
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="client_name">Nome do Cliente *</Label>
                                <Input id="client_name" name="client_name" autoComplete="name" value={formData.client_name || ''} onChange={handleChange} placeholder="Ex: João Silva" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client_company">Empresa do Cliente</Label>
                                <Input id="client_company" name="client_company" autoComplete="organization" value={formData.client_company || ''} onChange={handleChange} placeholder="Ex: Tech Solutions Ltda" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client_email">Email do Cliente</Label>
                                <Input id="client_email" name="client_email" autoComplete="email" type="email" value={formData.client_email || ''} onChange={handleChange} placeholder="joao@empresa.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="segment">Segmento/Área de Atuação</Label>
                                <Input id="segment" name="segment" value={formData.segment || ''} onChange={handleChange} placeholder="Ex: Varejo, Tecnologia, Saúde..." />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: SERVIÇO */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="service_description">Descrição do que vai ser feito *</Label>
                                <Textarea id="service_description" name="service_description" value={formData.service_description || ''} onChange={handleChange} rows={4} placeholder="Ex: Desenvolvimento de um website institucional com 5 páginas..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="estimated_hours">Horas estimadas (Analytics interno)</Label>
                                    <Input id="estimated_hours" name="estimated_hours" type="number" value={formData.estimated_hours || ''} onChange={handleChange} placeholder="Ex: 40" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="deadline">Prazo de Entrega</Label>
                                    <Input id="deadline" name="deadline" value={formData.deadline || ''} onChange={handleChange} placeholder="Ex: 30 dias úteis" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Nível de Complexidade</Label>
                                <Select value={formData.complexity || ''} onValueChange={(val) => handleSelectChange('complexity', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a complexidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Simples</SelectItem>
                                        <SelectItem value="medium">Média</SelectItem>
                                        <SelectItem value="high">Complexa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: EXTRAS */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="differentials">Diferenciais do seu serviço</Label>
                                <Textarea id="differentials" name="differentials" value={formData.differentials || ''} onChange={handleChange} rows={3} placeholder="Ex: Suporte 24/7, design exclusivo..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="extra_info">Informações Extras (Para a IA)</Label>
                                <Textarea id="extra_info" name="extra_info" value={formData.extra_info || ''} onChange={handleChange} rows={2} placeholder="Ex: Focar em conversão e gatilhos mentais." />
                            </div>
                            <div className="space-y-2">
                                <Label>Tom Desejado da Proposta</Label>
                                <Select value={formData.tone || ''} onValueChange={(val) => handleSelectChange('tone', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tom de voz" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="formal">Formal & Corporativo</SelectItem>
                                        <SelectItem value="friendly">Amigável & Acessível</SelectItem>
                                        <SelectItem value="persuasive">Persuasivo & Comercial</SelectItem>
                                        <SelectItem value="technical">Técnico & Detalhado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Idioma da Proposta</Label>
                                <Select value={formData.language || 'pt-BR'} onValueChange={(val) => handleSelectChange('language', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o idioma" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pt-BR">🇧🇷 Português (Brasil)</SelectItem>
                                        <SelectItem value="en">🇺🇸 Inglês</SelectItem>
                                        <SelectItem value="es">🇪🇸 Espanhol</SelectItem>
                                        <SelectItem value="fr">🇫🇷 Francês</SelectItem>
                                        <SelectItem value="de">🇩🇪 Alemão</SelectItem>
                                        <SelectItem value="it">🇮🇹 Italiano</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-400">A IA irá gerar a proposta completa neste idioma.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-100 mt-4 pt-6 pb-6">
                    <Button
                        variant="outline"
                        onClick={handlePrev}
                        disabled={currentStep === 0 || isSubmitting}
                        className="flex items-center gap-2"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Voltar
                    </Button>

                    {currentStep < STEPS.length - 1 ? (
                        <Button
                            onClick={handleNext}
                            className="bg-[#1A2E4A] hover:bg-[#0F1B2D] text-white flex items-center gap-2"
                        >
                            Próximo
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-[#C9A84C] hover:bg-[#b09341] text-[#0F1B2D] font-bold flex items-center gap-2"
                        >
                            {isSubmitting ? 'Salvando...' : 'Gerar Sugestões da IA'}
                            {!isSubmitting && <Sparkles className="w-4 h-4" />}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
