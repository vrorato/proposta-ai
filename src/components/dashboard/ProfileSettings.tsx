'use client'

import { useState, useTransition, useRef } from 'react'
import { Building2, Palette, FileText, Briefcase, Camera, Check, Loader2, UploadCloud } from 'lucide-react'
import { updateProfile } from '@/app/dashboard/configuracoes/actions'

type ProfileData = any // We'll type this broadly for now

export function ProfileSettings({ profile }: { profile: ProfileData }) {
    const [activeTab, setActiveTab] = useState('company')
    const [isPending, startTransition] = useTransition()
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const formRef = useRef<HTMLFormElement>(null)

    // Image previews
    const [logoPreview, setLogoPreview] = useState(profile?.company_logo_url || '')
    const [signaturePreview, setSignaturePreview] = useState(profile?.digital_signature_url || '')

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (val: string) => void) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreview(url)
        }
    }

    // Masks
    const maskCnpjCpf = (value: string) => {
        const nums = value.replace(/\D/g, '')
        if (nums.length <= 11) {
            return nums.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
        }
        return nums.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2')
    }

    const maskPhone = (value: string) => {
        const nums = value.replace(/\D/g, '')
        if (nums.length <= 10) {
            return nums.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
        }
        return nums.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
    }

    // Color picker state sync
    const [primaryColor, setPrimaryColor] = useState(profile?.brand_primary_color || '#0F1B2D')
    const [secondaryColor, setSecondaryColor] = useState(profile?.brand_secondary_color || '#C9A84C')

    const handleSubmit = async (formData: FormData) => {
        setSaveStatus('idle')
        startTransition(async () => {
            try {
                const result = await updateProfile(formData)
                if (result.success) {
                    setSaveStatus('success')
                    setTimeout(() => setSaveStatus('idle'), 3000)
                } else {
                    console.error('Erro:', result.error)
                    setErrorMessage(result.error || 'Erro desconhecido')
                    setSaveStatus('error')
                }
            } catch (error: any) {
                console.error(error)
                setErrorMessage(error.message || 'Erro inesperado')
                setSaveStatus('error')
            }
        })
    }

    const tabs = [
        { id: 'company', label: 'Dados da Empresa', icon: Building2 },
        { id: 'branding', label: 'Identidade Visual', icon: Palette },
        { id: 'defaults', label: 'Padrões das Propostas', icon: FileText },
        { id: 'professional', label: 'Info. Profissionais', icon: Briefcase },
    ]

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">
            {/* Header / Tabs */}
            <div className="flex overflow-x-auto border-b border-[#E2E8F0]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap
                            ${activeTab === tab.id
                                ? 'border-b-2 border-[#1A2E4A] text-[#1A2E4A]'
                                : 'text-[#8896A6] hover:text-[#1A2E4A] hover:bg-gray-50'}`}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <form ref={formRef} action={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto">

                        {/* TAB 1: EMPRESA */}
                        <div className={activeTab === 'company' ? 'block' : 'hidden'}>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-[#0F1B2D]">Dados Básicos</h3>
                                <p className="text-sm text-[#8896A6]">Informações que identificam sua empresa nas propostas.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Nome Fantasia / Seu Nome</label>
                                    <input name="full_name" autoComplete="organization" defaultValue={profile?.full_name} className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Razão Social / Nome de Registro</label>
                                    <input name="company_name" autoComplete="name" defaultValue={profile?.company_name} className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">CNPJ / CPF</label>
                                    <input name="company_document" autoComplete="off" defaultValue={profile?.company_document} placeholder="00.000.000/0001-00" maxLength={18} onChange={(e) => { e.target.value = maskCnpjCpf(e.target.value) }} className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Telefone Comercial</label>
                                    <input name="phone" autoComplete="tel" defaultValue={profile?.phone} placeholder="(00) 00000-0000" maxLength={15} onChange={(e) => { e.target.value = maskPhone(e.target.value) }} className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Endereço Completo</label>
                                    <input name="company_address" autoComplete="street-address" defaultValue={profile?.company_address} placeholder="Rua, Número, Bairro, Cidade - Estado" className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Website</label>
                                    <input name="website" autoComplete="url" defaultValue={profile?.website} placeholder="https://seusite.com.br" className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all" />
                                </div>
                            </div>
                        </div>

                        {/* TAB 2: IDENTIDADE VISUAL */}
                        <div className={activeTab === 'branding' ? 'block' : 'hidden'}>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-[#0F1B2D]">Identidade Visual</h3>
                                <p className="text-sm text-[#8896A6]">Personalize as cores e o logo para deixar as propostas com a sua cara.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Logotipo da Empresa</label>
                                    <div className="flex items-center gap-6">
                                        <div className="h-24 w-24 rounded-lg border-2 border-dashed border-[#E2E8F0] bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <Camera className="h-6 w-6 text-[#8896A6]" />
                                            )}
                                        </div>
                                        <div>
                                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#1A2E4A] hover:bg-gray-50 transition-colors">
                                                <UploadCloud className="h-4 w-4" />
                                                Selecionar arquivo
                                                <input type="file" name="company_logo" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setLogoPreview)} />
                                            </label>
                                            <p className="text-xs text-[#8896A6] mt-2">Recomendado: PNG fundo transparente, max 2MB.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#1A2E4A]">Cor Principal</label>
                                        <div className="flex gap-3">
                                            <input type="color" name="brand_primary_color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-12 w-12 rounded cursor-pointer border-0 p-0" />
                                            <input type="text" value={primaryColor} readOnly className="flex-1 p-3 rounded-lg border border-[#E2E8F0] uppercase font-mono text-sm" />
                                        </div>
                                        <p className="text-xs text-[#8896A6]">Usada em títulos e backgrounds.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-[#1A2E4A]">Cor Secundária (Destaque)</label>
                                        <div className="flex gap-3">
                                            <input type="color" name="brand_secondary_color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="h-12 w-12 rounded cursor-pointer border-0 p-0" />
                                            <input type="text" value={secondaryColor} readOnly className="flex-1 p-3 rounded-lg border border-[#E2E8F0] uppercase font-mono text-sm" />
                                        </div>
                                        <p className="text-xs text-[#8896A6]">Usada em links, botões e detalhes.</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Fonte Preferida</label>
                                    <select name="brand_font" defaultValue={profile?.brand_font || 'sans'} className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all">
                                        <option value="sans">Sem Serifa (Moderno - Inter/Roboto)</option>
                                        <option value="serif">Com Serifa (Clássico - Merriweather/Playfair)</option>
                                        <option value="mono">Monoespaçada (Tech - JetBrains/Fira)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* TAB 3: PADRÕES */}
                        <div className={activeTab === 'defaults' ? 'block' : 'hidden'}>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-[#0F1B2D]">Padrões das Propostas</h3>
                                <p className="text-sm text-[#8896A6]">Configurações que serão aplicadas automaticamente em novas propostas.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Tom de Voz Padrão</label>
                                    <select name="default_tone" defaultValue={profile?.default_tone || 'profissional'} className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all">
                                        <option value="profissional">Profissional & Direto</option>
                                        <option value="amigavel">Amigável & Empático</option>
                                        <option value="tecnico">Técnico & Analítico</option>
                                        <option value="criativo">Criativo & Descontraído</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Moeda Padrão</label>
                                    <select name="default_currency" defaultValue={profile?.default_currency || 'BRL'} className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all">
                                        <option value="BRL">BRL (R$) - Real Brasileiro</option>
                                        <option value="USD">USD ($) - Dólar Americano</option>
                                        <option value="EUR">EUR (€) - Euro</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Validade Base (Dias)</label>
                                    <input type="number" name="default_expiration_days" defaultValue={profile?.default_expiration_days || 15} placeholder="15" className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Condições de Pagamento Padrão</label>
                                    <input type="text" name="default_payment_terms" defaultValue={profile?.default_payment_terms} placeholder="Ex: 50% entrada, 50% entrega" className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Termos e Condições Padrão</label>
                                    <textarea name="default_terms_conditions" defaultValue={profile?.default_terms_conditions} rows={5} placeholder="Insira os termos legais, direitos autorais, multas por atraso que devem ir no final de todas as propostas..." className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all resize-y"></textarea>
                                </div>

                                <div className="space-y-3 md:col-span-2 mt-4 pt-6 border-t border-[#E2E8F0]">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Assinatura Digital</label>
                                    <div className="flex items-center gap-6">
                                        <div className="h-20 w-48 rounded-lg border-2 border-dashed border-[#E2E8F0] bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                            {signaturePreview ? (
                                                <img src={signaturePreview} alt="Assinatura" className="w-full h-full object-contain p-2" />
                                            ) : (
                                                <Camera className="h-6 w-6 text-[#8896A6]" />
                                            )}
                                        </div>
                                        <div>
                                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#1A2E4A] hover:bg-gray-50 transition-colors">
                                                <UploadCloud className="h-4 w-4" />
                                                Subir assinatura
                                                <input type="file" name="digital_signature" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setSignaturePreview)} />
                                            </label>
                                            <p className="text-xs text-[#8896A6] mt-2">Recomendado: PNG fundo transparente da sua rubrica.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TAB 4: PROFISSIONAL */}
                        <div className={activeTab === 'professional' ? 'block' : 'hidden'}>
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-[#0F1B2D]">Informações Profissionais</h3>
                                <p className="text-sm text-[#8896A6]">Estes textos alimentam nossa Inteligência Artificial para gerar "Sobre Nós" bem convincentes.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Apresentação da Empresa/Profissional</label>
                                    <textarea name="professional_description" defaultValue={profile?.professional_description} rows={4} placeholder="Conte um pouco sobre sua história, tempo de mercado, missão..." className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all resize-y"></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Principais Serviços</label>
                                    <textarea name="main_services" defaultValue={profile?.main_services} rows={3} placeholder="Liste o que você melhor faz (Ex: Desenvolvimento Web, Design de Interface, Consultoria de Vendas)" className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all resize-y"></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Diferenciais Competitivos</label>
                                    <textarea name="professional_differentials" defaultValue={profile?.professional_differentials} rows={3} placeholder="O que destaca você ou sua empresa da concorrência?" className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all resize-y"></textarea>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-[#1A2E4A]">Links de Portfólio / Casos de Sucesso</label>
                                    <textarea name="portfolio_links" defaultValue={profile?.portfolio_links} rows={3} placeholder="URLs de portfólio, Behance, GitHub, links de sites feitos, etc." className="w-full p-3 rounded-lg border border-[#E2E8F0] focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] outline-none transition-all resize-y"></textarea>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer fixed */}
                <div className="p-6 border-t border-[#E2E8F0] bg-gray-50 flex items-center justify-between">
                    <div className="text-sm">
                        {saveStatus === 'success' && (
                            <span className="flex items-center text-[#2ECC71] font-medium">
                                <Check className="h-4 w-4 mr-2" />
                                Configurações salvas com sucesso!
                            </span>
                        )}
                        {saveStatus === 'error' && (
                            <span className="text-[#E74C3C] font-medium text-xs">
                                Erro: {errorMessage}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="bg-gradient-to-r from-[#C9A84C] to-[#B3933E] hover:from-[#B3933E] hover:to-[#9E8033] text-white px-8 py-3 rounded-lg font-medium transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            'Salvar Configurações'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
