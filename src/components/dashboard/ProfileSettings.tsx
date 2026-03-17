'use client'

import { useState, useTransition, useRef } from 'react'
import { Building2, Palette, FileText, Briefcase, Camera, Check, Loader2, UploadCloud, ChevronRight, Sparkles } from 'lucide-react'
import { updateProfile } from '@/app/dashboard/configuracoes/actions'

type ProfileData = any 

export function ProfileSettings({ profile }: { profile: ProfileData }) {
    const [activeTab, setActiveTab] = useState('company')
    const [isPending, startTransition] = useTransition()
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState('')
    const formRef = useRef<HTMLFormElement>(null)

    const [logoPreview, setLogoPreview] = useState(profile?.company_logo_url || '')
    const [signaturePreview, setSignaturePreview] = useState(profile?.digital_signature_url || '')

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setPreview: (val: string) => void) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreview(url)
        }
    }

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
                    setErrorMessage(result.error || 'Erro desconhecido')
                    setSaveStatus('error')
                }
            } catch (error: any) {
                setErrorMessage(error.message || 'Erro inesperado')
                setSaveStatus('error')
            }
        })
    }

    const tabs = [
        { id: 'company', label: 'Empresa', icon: Building2 },
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'defaults', label: 'Padrões', icon: FileText },
        { id: 'professional', label: 'Bio IA', icon: Briefcase },
    ]

    return (
        <div className="flex flex-col h-full bg-white/[0.02] rounded-[40px] border border-white/[0.03] overflow-hidden relative group/outer duration-700">
            {/* Header / Tabs */}
            <div className="flex overflow-x-auto border-b border-white/[0.03] px-10 bg-black/20 backdrop-blur-md sticky top-0 z-20">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-4 px-8 py-8 text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap relative group
                            ${activeTab === tab.id
                                ? 'text-brand-primary'
                                : 'text-gray-600 hover:text-gray-400'}`}
                    >
                        <tab.icon className={`h-4 w-4 transition-all duration-500 ${activeTab === tab.id ? 'stroke-[2.5px] scale-110 drop-shadow-[0_0_8px_rgba(13,242,89,0.5)]' : 'stroke-[1.5px]'}`} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <>
                                <div className="absolute bottom-0 left-4 right-4 h-1 bg-brand-primary rounded-full shadow-[0_0_20px_rgba(13,242,89,0.8)]" />
                                <div className="absolute inset-0 bg-brand-primary/5 blur-xl pointer-events-none" />
                            </>
                        )}
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <form ref={formRef} action={handleSubmit} className="flex-1 flex flex-col min-h-[600px]">
                <div className="flex-1 p-12 lg:p-16">
                    <div className="max-w-4xl">

                        {/* TAB 1: EMPRESA */}
                        <div className={`${activeTab === 'company' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-700' : 'hidden'}`}>
                            <div className="mb-12">
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] block mb-2">Corporate Identity</span>
                                <h3 className="text-4xl font-black text-white tracking-tighter">Identidade Corporativa</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Nome de Exibição</label>
                                    <input name="full_name" defaultValue={profile?.full_name} className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white placeholder:text-gray-800 outline-none focus:border-brand-primary/30 focus:bg-white/[0.04] transition-all font-bold text-sm h-16" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Razão Social</label>
                                    <input name="company_name" defaultValue={profile?.company_name} className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white placeholder:text-gray-800 outline-none focus:border-brand-primary/30 focus:bg-white/[0.04] transition-all font-bold text-sm h-16" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Documento (CNPJ/CPF)</label>
                                    <input name="company_document" defaultValue={profile?.company_document} placeholder="00.000.000/0001-00" maxLength={18} onChange={(e) => { e.target.value = maskCnpjCpf(e.target.value) }} className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white placeholder:text-gray-800 outline-none focus:border-brand-primary/30 focus:bg-white/[0.04] transition-all font-bold text-sm h-16" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Contato Geral</label>
                                    <input name="phone" defaultValue={profile?.phone} placeholder="(00) 00000-0000" maxLength={15} onChange={(e) => { e.target.value = maskPhone(e.target.value) }} className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white placeholder:text-gray-800 outline-none focus:border-brand-primary/30 focus:bg-white/[0.04] transition-all font-bold text-sm h-16" />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Localização Principal</label>
                                    <input name="company_address" defaultValue={profile?.company_address} placeholder="Rua, Número, Bairro, Cidade - Estado" className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white placeholder:text-gray-800 outline-none focus:border-brand-primary/30 focus:bg-white/[0.04] transition-all font-bold text-sm h-16" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Domínio Digital</label>
                                    <input name="website" defaultValue={profile?.website} placeholder="https://seusite.com.br" className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white placeholder:text-gray-800 outline-none focus:border-brand-primary/30 focus:bg-white/[0.04] transition-all font-bold text-sm h-16" />
                                </div>
                            </div>
                        </div>

                        {/* TAB 2: BRANDING */}
                        <div className={`${activeTab === 'branding' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-700' : 'hidden'}`}>
                            <div className="mb-12">
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] block mb-2">Visual Atmosphere</span>
                                <h3 className="text-4xl font-black text-white tracking-tighter">Atmosfera Visual</h3>
                            </div>

                            <div className="space-y-16">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Logo Flagship</label>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 bg-white/[0.01] p-10 rounded-[32px] border border-white/[0.03]">
                                        <div className="h-40 w-40 rounded-3xl border border-white/[0.05] bg-black/40 flex items-center justify-center overflow-hidden relative group cursor-pointer shadow-2xl">
                                            {logoPreview ? (
                                                <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110" />
                                            ) : (
                                                <Camera className="h-8 w-8 text-gray-800" />
                                            )}
                                            <div className="absolute inset-0 bg-brand-primary/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <Sparkles className="w-6 h-6 text-brand-primary shadow-glow" />
                                            </div>
                                        </div>
                                        <div className="space-y-5 flex-1">
                                            <div className="space-y-1">
                                                <h4 className="text-white font-black uppercase text-xs tracking-widest">Main Emblem</h4>
                                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.15em]">Sugerido: SVG ou PNG (Max 5MB)</p>
                                            </div>
                                            <label className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-white/[0.03] border border-white/[0.05] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/[0.08] hover:border-brand-primary/20 transition-all active:scale-95 group">
                                                <UploadCloud className="h-4 w-4 text-brand-primary" />
                                                Replace Asset
                                                <input type="file" name="company_logo" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setLogoPreview)} />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Primary Signature (Hex)</label>
                                        <div className="flex gap-4">
                                            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl">
                                                <input type="color" name="brand_primary_color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="absolute inset-[-10px] w-20 h-20 cursor-pointer border-0 p-0" />
                                            </div>
                                            <input type="text" value={primaryColor} readOnly className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 text-white font-mono text-xs uppercase h-16 outline-none focus:border-brand-primary/30" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Secondary Accent (Hex)</label>
                                        <div className="flex gap-4">
                                            <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl">
                                                <input type="color" name="brand_secondary_color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="absolute inset-[-10px] w-20 h-20 cursor-pointer border-0 p-0" />
                                            </div>
                                            <input type="text" value={secondaryColor} readOnly className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 text-white font-mono text-xs uppercase h-16 outline-none focus:border-brand-primary/30" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Engine Typography</label>
                                    <div className="relative group">
                                        <select name="brand_font" defaultValue={profile?.brand_font || 'sans'} className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white focus:border-brand-primary/30 transition-all font-black text-[11px] uppercase tracking-widest h-16 outline-none appearance-none">
                                            <option value="sans" className="bg-[#0f0f12]">Sans-Serif: Modern & Aggressive</option>
                                            <option value="serif" className="bg-[#0f0f12]">Classic-Serif: Traditional & Authority</option>
                                            <option value="mono" className="bg-[#0f0f12]">Monospaced: technical & Minimalist</option>
                                        </select>
                                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 rotate-90 w-4 h-4 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TAB 3: DEFAULTS */}
                        <div className={`${activeTab === 'defaults' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-700' : 'hidden'}`}>
                            <div className="mb-12">
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] block mb-2">System Defaults</span>
                                <h3 className="text-4xl font-black text-white tracking-tighter">Protocolos Padrão</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">IA Tone Architecture</label>
                                    <select name="default_tone" defaultValue={profile?.default_tone || 'profissional'} className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white focus:border-brand-primary/30 transition-all font-bold text-sm h-16 outline-none appearance-none">
                                        <option value="profissional" className="bg-[#0f0f12]">High-Performance Professional</option>
                                        <option value="amigavel" className="bg-[#0f0f12]">Empathic & Advisory</option>
                                        <option value="tecnico" className="bg-[#0f0f12]">Analytical & Specialized</option>
                                        <option value="criativo" className="bg-[#0f0f12]">Revolutionary & Bold</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Global Currency</label>
                                    <select name="default_currency" defaultValue={profile?.default_currency || 'BRL'} className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white focus:border-brand-primary/30 h-16 outline-none appearance-none font-bold">
                                        <option value="BRL" className="bg-[#0f0f12]">BRL - Real Brasileiro</option>
                                        <option value="USD" className="bg-[#0f0f12]">USD - American Dollar</option>
                                        <option value="EUR" className="bg-[#0f0f12]">EUR - European Euro</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Validade Padrão (Dias)</label>
                                    <input type="number" name="default_expiration_days" defaultValue={profile?.default_expiration_days || 15} className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white focus:border-brand-primary/30 h-16 outline-none font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Condições de Checkout</label>
                                    <input type="text" name="default_payment_terms" defaultValue={profile?.default_payment_terms} placeholder="Ex: 50% entrada, 50% entrega" className="w-full bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl text-white focus:border-brand-primary/30 h-16 outline-none font-bold" />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Cláusulas Universais</label>
                                    <textarea name="default_terms_conditions" defaultValue={profile?.default_terms_conditions} rows={6} className="w-full bg-white/[0.02] border border-white/[0.05] p-6 rounded-[32px] text-white focus:border-brand-primary/30 outline-none resize-none font-medium leading-relaxed custom-scrollbar" placeholder="Insira os termos que devem aparecer no final de todas as propostas..."></textarea>
                                </div>

                                <div className="space-y-6 md:col-span-2 mt-6 pt-12 border-t border-white/[0.03]">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Active Signature (Rubrica)</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-10 bg-white/[0.01] p-10 rounded-[32px] border border-white/[0.03]">
                                        <div className="h-28 w-56 rounded-[24px] border border-white/[0.05] bg-black/40 flex items-center justify-center overflow-hidden relative group shadow-2xl">
                                            {signaturePreview ? (
                                                <img src={signaturePreview} alt="Assinatura" className="w-full h-full object-contain p-4 transition-all duration-700 grayscale hover:grayscale-0" />
                                            ) : (
                                                <Camera className="h-6 w-6 text-gray-800" />
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <label className="cursor-pointer inline-flex items-center gap-3 px-8 py-4 bg-white/[0.03] border border-white/[0.05] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/[0.08] hover:border-brand-primary/20 transition-all active:scale-95 group">
                                                <UploadCloud className="h-4 w-4 text-brand-primary" />
                                                Update Cipher
                                                <input type="file" name="digital_signature" accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, setSignaturePreview)} />
                                            </label>
                                            <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">Digital Auth / PNG Transparente</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TAB 4: BIO IA */}
                        <div className={`${activeTab === 'professional' ? 'block animate-in fade-in slide-in-from-bottom-4 duration-700' : 'hidden'}`}>
                            <div className="mb-12">
                                <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.3em] block mb-2">Neural Context</span>
                                <h3 className="text-4xl font-black text-white tracking-tighter">Bio & Contexto IA</h3>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">DNA da Empresa (Contexto Mestre)</label>
                                    <textarea name="professional_description" defaultValue={profile?.professional_description} rows={6} className="w-full bg-white/[0.02] border border-white/[0.05] p-6 rounded-[32px] text-white focus:border-brand-primary/30 outline-none resize-none font-medium leading-relaxed custom-scrollbar" placeholder="Conte sobre sua experiência, especialidades e conquistas..."></textarea>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Core Service Ecosystem</label>
                                    <textarea name="main_services" defaultValue={profile?.main_services} rows={3} className="w-full bg-white/[0.02] border border-white/[0.05] p-6 rounded-[32px] text-white focus:border-brand-primary/30 outline-none resize-none font-medium leading-relaxed" placeholder="Ex: Gestão de Tráfego, Branding, Design 3D..."></textarea>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-700 ml-1">Unique Value Propositions</label>
                                    <textarea name="professional_differentials" defaultValue={profile?.professional_differentials} rows={4} className="w-full bg-white/[0.02] border border-white/[0.05] p-6 rounded-[32px] text-white focus:border-brand-primary/30 outline-none resize-none font-medium leading-relaxed" placeholder="Pelo que você quer ser reconhecido? Qual seu maior trunfo?"></textarea>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer fixed */}
                <div className="p-12 border-t border-white/[0.03] bg-black/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-8 sticky bottom-0 z-20">
                    <div className="flex-1">
                        {saveStatus === 'success' && (
                            <div className="flex items-center py-3 px-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 text-brand-primary font-black uppercase tracking-[0.2em] text-[10px] animate-in slide-in-from-left-4 duration-500 w-fit">
                                <Check className="w-3.5 h-3.5 mr-3 shadow-glow" />
                                Neural profile synchronized successfully
                            </div>
                        )}
                        {saveStatus === 'error' && (
                            <div className="flex items-center py-3 px-6 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-500 font-black uppercase tracking-[0.2em] text-[10px] animate-in slide-in-from-left-4 duration-500 w-fit">
                                <div className="w-2 h-2 rounded-full bg-red-500 mr-3 animate-pulse" />
                                Error: {errorMessage}
                            </div>
                        )}
                        {saveStatus === 'idle' && !isPending && (
                            <div className="text-[10px] text-gray-700 font-black uppercase tracking-[0.3em] flex items-center gap-3">
                                <div className="w-1 h-1 rounded-full bg-gray-800" />
                                Ready for synchronization
                            </div>
                        )}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto bg-brand-primary hover:brightness-110 text-black px-16 py-6 rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_0_40px_rgba(13,242,89,0.25)] flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Synchronizing...
                            </>
                        ) : (
                            <>
                                Commit Changes
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
