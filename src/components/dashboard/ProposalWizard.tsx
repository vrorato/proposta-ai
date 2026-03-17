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
import { ChevronRight, ChevronLeft, Sparkles, User, Briefcase, FileText, PlusCircle, Wand2, Zap, Target, MessageSquare } from 'lucide-react'
import { saveProposalDraft, ProposalWizardData } from '@/app/dashboard/nova-proposta/actions'

const STEPS = [
    { id: 'client', title: 'Target Identification', subtitle: 'Quem é o cliente estratégico?', icon: Target, fields: ['client_name', 'client_company', 'client_email', 'segment'] },
    { id: 'service', title: 'Solution Architecture', subtitle: 'Qual valor estamos entregando?', icon: Zap, fields: ['service_description', 'estimated_hours', 'deadline', 'complexity'] },
    { id: 'extras', title: 'Neural Context', subtitle: 'Nuances e tom de voz', icon: MessageSquare, fields: ['differentials', 'extra_info', 'tone'] },
]

export function ProposalWizard() {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState<Partial<ProposalWizardData>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleNext = () => {
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
        <div className="max-w-5xl mx-auto space-y-12 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Custom Step Indicator */}
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/[0.05] -translate-y-1/2" />
                <div className="relative flex justify-between items-center px-4">
                    {STEPS.map((step, idx) => (
                        <div key={step.id} className="flex flex-col items-center gap-4 group/step">
                            <div 
                                onClick={() => currentStep > idx && setCurrentStep(idx)}
                                className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-700 border z-10 cursor-pointer
                                ${currentStep === idx 
                                    ? 'bg-brand-primary border-brand-primary text-black shadow-[0_0_40px_rgba(13,242,89,0.3)] scale-110' 
                                    : currentStep > idx 
                                        ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
                                        : 'bg-[#0a0a0c] border-white/10 text-gray-700 hover:border-white/20'
                                }`}
                            >
                                <step.icon className={`w-6 h-6 ${currentStep === idx ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                            </div>
                            <div className="absolute -bottom-10 flex flex-col items-center whitespace-nowrap">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${currentStep === idx ? 'text-brand-primary' : 'text-gray-600'}`}>
                                    {step.title}
                                </span>
                            </div>
                        </div>
                    ))}
                    {/* Progress Bar Active */}
                    <div 
                        className="absolute top-1/2 left-0 h-[2px] bg-brand-primary transition-all duration-1000 shadow-[0_0_15px_#0df259]" 
                        style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%`, transform: 'translateY(-50%)' }} 
                    />
                </div>
            </div>

            <div className="pt-16">
                <Card className="bg-white/[0.015] border-white/[0.05] overflow-hidden rounded-[48px] shadow-2xl relative">
                    {/* Interior Glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none" />

                    <CardHeader className="pt-16 px-16 pb-0 space-y-4">
                        <div className="space-y-2">
                            <p className="text-[11px] font-black text-brand-primary uppercase tracking-[0.3em]">Phase {currentStep + 1} of {STEPS.length}</p>
                            <h2 className="text-4xl font-black text-white tracking-tighter leading-tight">
                                {STEPS[currentStep].title}
                            </h2>
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                                {STEPS[currentStep].subtitle}
                            </p>
                        </div>
                    </CardHeader>
                    
                    <CardContent className="pt-16 px-16 pb-12">
                        {error && (
                            <div className="mb-12 p-6 rounded-[24px] bg-red-500/[0.03] border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 animate-in slide-in-from-top-4">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
                                Input Error: {error}
                            </div>
                        )}

                        {/* STEP 1: CLIENTE */}
                        {currentStep === 0 && (
                            <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <Label htmlFor="client_name" className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Client Identification *</Label>
                                        <Input id="client_name" name="client_name" className="bg-white/[0.02] border-white/[0.05] rounded-2xl h-16 text-white placeholder:text-gray-800 focus:border-brand-primary/40 focus:bg-white/[0.04] transition-all px-8 font-bold text-sm outline-none" value={formData.client_name || ''} onChange={handleChange} placeholder="Nome do Decisor" />
                                    </div>
                                    <div className="space-y-4">
                                        <Label htmlFor="client_company" className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Entity / Organization</Label>
                                        <Input id="client_company" name="client_company" className="bg-white/[0.02] border-white/[0.05] rounded-2xl h-16 text-white placeholder:text-gray-800 focus:border-brand-primary/40 focus:bg-white/[0.04] transition-all px-8 font-bold text-sm outline-none" value={formData.client_company || ''} onChange={handleChange} placeholder="Razão Social ou Nome Fantasia" />
                                    </div>
                                </div>
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <Label htmlFor="client_email" className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Neural Address (Email)</Label>
                                        <Input id="client_email" name="client_email" type="email" className="bg-white/[0.02] border-white/[0.05] rounded-2xl h-16 text-white placeholder:text-gray-800 focus:border-brand-primary/40 focus:bg-white/[0.04] transition-all px-8 font-bold text-sm outline-none" value={formData.client_email || ''} onChange={handleChange} placeholder="digital-auth@domain.com" />
                                    </div>
                                    <div className="space-y-4">
                                        <Label htmlFor="segment" className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Market Ecosystem</Label>
                                        <Input id="segment" name="segment" className="bg-white/[0.02] border-white/[0.05] rounded-2xl h-16 text-white placeholder:text-gray-800 focus:border-brand-primary/40 focus:bg-white/[0.04] transition-all px-8 font-bold text-sm outline-none" value={formData.segment || ''} onChange={handleChange} placeholder="E-commerce, SaaS, Real Estate..." />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: SERVIÇO */}
                        {currentStep === 1 && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <div className="space-y-4">
                                    <Label htmlFor="service_description" className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Core Scope Blueprint *</Label>
                                    <Textarea id="service_description" name="service_description" className="bg-white/[0.02] border-white/[0.05] rounded-[32px] min-h-[200px] text-white placeholder:text-gray-800 focus:border-brand-primary/40 focus:bg-white/[0.04] transition-all px-8 py-8 font-medium leading-relaxed resize-none text-base custom-scrollbar outline-none" value={formData.service_description || ''} onChange={handleChange} placeholder="Descreva os entregáveis e objetivos. A IA expandirá para um formato comercial de alto impacto..." />
                                </div>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <Label htmlFor="estimated_hours" className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Operational Effort (Hours)</Label>
                                        <Input id="estimated_hours" name="estimated_hours" type="number" className="bg-white/[0.02] border-white/[0.05] rounded-2xl h-16 text-white placeholder:text-gray-800 focus:border-brand-primary/40 focus:bg-white/[0.04] transition-all px-8 font-bold text-sm outline-none" value={formData.estimated_hours || ''} onChange={handleChange} placeholder="Ex: 80" />
                                    </div>
                                    <div className="space-y-4">
                                        <Label htmlFor="deadline" className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Time to Delivery</Label>
                                        <Input id="deadline" name="deadline" className="bg-white/[0.02] border-white/[0.05] rounded-2xl h-16 text-white placeholder:text-gray-800 focus:border-brand-primary/40 focus:bg-white/[0.04] transition-all px-8 font-bold text-sm outline-none" value={formData.deadline || ''} onChange={handleChange} placeholder="Ex: 15 dias" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">System Complexity Matrix</Label>
                                    <Select value={formData.complexity || ''} onValueChange={(val) => handleSelectChange('complexity', val)}>
                                        <SelectTrigger className="bg-white/[0.02] border-white/[0.05] rounded-2xl h-16 text-white focus:ring-0 focus:border-brand-primary/40 transition-all px-8 font-bold uppercase tracking-widest text-[10px] outline-none border-none">
                                            <SelectValue placeholder="Analyze Difficulty" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0f0f12] border-white/10 text-white rounded-[24px] overflow-hidden p-2">
                                            <SelectItem value="low" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">🟢 Low Complexity / Fast Track</SelectItem>
                                            <SelectItem value="medium" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">🟡 Mid Complexity / Strategic Planning</SelectItem>
                                            <SelectItem value="high" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">🔴 High Complexity / Neural Integration</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: EXTRAS */}
                        {currentStep === 2 && (
                            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <Label htmlFor="differentials" className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Unfair Advantages (Diferenciais)</Label>
                                        <Textarea id="differentials" name="differentials" className="bg-white/[0.02] border-white/[0.05] rounded-[32px] min-h-[180px] text-white placeholder:text-gray-800 focus:border-brand-primary/40 focus:bg-white/[0.04] transition-all px-8 py-8 font-medium leading-relaxed resize-none text-sm outline-none" value={formData.differentials || ''} onChange={handleChange} placeholder="Qual o seu 'special sauce' para este cliente?" />
                                    </div>
                                    <div className="space-y-4">
                                        <Label htmlFor="extra_info" className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Strategic Intelligence Notes</Label>
                                        <Textarea id="extra_info" name="extra_info" className="bg-white/[0.02] border-white/[0.05] rounded-[32px] min-h-[180px] text-white placeholder:text-gray-800 focus:border-brand-primary/40 focus:bg-white/[0.04] transition-all px-8 py-8 font-medium leading-relaxed resize-none text-sm outline-none" value={formData.extra_info || ''} onChange={handleChange} placeholder="Alguma particularidade oculta ou detalhe crítico?" />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <Label className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Output Personality (Tone)</Label>
                                        <Select value={formData.tone || ''} onValueChange={(val) => handleSelectChange('tone', val)}>
                                            <SelectTrigger className="bg-white/[0.02] border-white/[0.05] rounded-2xl h-16 text-white focus:ring-0 focus:border-brand-primary/40 transition-all px-8 font-bold uppercase tracking-widest text-[10px] outline-none border-none">
                                                <SelectValue placeholder="Set Vibe" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0f0f12] border-white/10 text-white rounded-[24px] p-2">
                                                <SelectItem value="formal" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">👔 High-End Corporate</SelectItem>
                                                <SelectItem value="friendly" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">🤝 advisory & Close</SelectItem>
                                                <SelectItem value="persuasive" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">🔥 Hunter / Aggressive</SelectItem>
                                                <SelectItem value="technical" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">⚙️ scientific / Detail-Heavy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em] ml-1">Global Language Matrix</Label>
                                        <Select value={formData.language || 'pt-BR'} onValueChange={(val) => handleSelectChange('language', val)}>
                                            <SelectTrigger className="bg-white/[0.02] border-white/[0.05] rounded-2xl h-16 text-white focus:ring-0 focus:border-brand-primary/40 transition-all px-8 font-bold uppercase tracking-widest text-[10px] outline-none border-none">
                                                <SelectValue placeholder="Set Language" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#0f0f12] border-white/10 text-white rounded-[24px] p-2">
                                                <SelectItem value="pt-BR" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">🇧🇷 Portuguese (Neural Style)</SelectItem>
                                                <SelectItem value="en" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">🇺🇸 Global English</SelectItem>
                                                <SelectItem value="es" className="py-4 hover:bg-brand-primary/10 transition-colors uppercase tracking-widest text-[9px] font-black rounded-xl">🇪🇸 Modern Spanish</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    
                    <CardFooter className="flex flex-col md:flex-row justify-between border-t border-white/[0.03] p-16 bg-black/40 backdrop-blur-xl gap-8">
                        <div className="flex items-center gap-10">
                            <button
                                onClick={handlePrev}
                                disabled={currentStep === 0 || isSubmitting}
                                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-700 hover:text-white transition-all disabled:opacity-20 disabled:pointer-events-none group"
                            >
                                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                Roll Back
                            </button>
                            
                            <div className="h-8 w-[1px] bg-white/[0.05] hidden md:block" />

                            <button 
                                onClick={fillTestData} 
                                type="button" 
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-800 hover:text-brand-primary transition-all flex items-center gap-3 active:scale-95"
                            >
                                <PlusCircle className="w-4 h-4" />
                                Neural Simulation (Test Data)
                            </button>
                        </div>

                        <div className="flex items-center gap-6">
                            {currentStep < STEPS.length - 1 ? (
                                <Button
                                    onClick={handleNext}
                                    className="bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] text-white px-12 py-8 rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center gap-4 transition-all active:scale-95 shadow-2xl"
                                >
                                    Proceed to Next Phase
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="bg-brand-primary hover:scale-[1.05] text-black px-16 py-8 rounded-[24px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center gap-4 transition-all shadow-[0_0_60px_rgba(13,242,89,0.3)] active:scale-95 group relative overflow-hidden disabled:opacity-50"
                                >
                                    <span className="relative z-10 flex items-center gap-4">
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                                                Synthesizing Logic...
                                            </>
                                        ) : (
                                            <>
                                                Deploy AI Generation
                                                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </Button>
                            )}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

