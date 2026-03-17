'use client'

import { LayoutDashboard, FilePlus, History, LayoutTemplate, Settings, Zap, Crown, LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/auth/actions'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FilePlus, label: 'Nova Proposta', href: '/dashboard/nova-proposta' },
    { icon: History, label: 'Histórico', href: '/dashboard/historico' },
    { icon: LayoutTemplate, label: 'Templates', href: '/dashboard/templates' },
    { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-72 bg-[#050505] text-white flex flex-col h-screen fixed top-0 left-0 border-r border-white/[0.03] z-50">
            {/* Logo Area */}
            <div className="p-10">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-brand-primary rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(13,242,89,0.3)] group-hover:rotate-6 group-hover:scale-110 transition-all duration-500">
                        <span className="font-black text-2xl tracking-tighter">P</span>
                    </div>
                    <div>
                        <span className="text-xl font-black tracking-tighter block leading-none">Proposta<span className="text-brand-primary">AI</span></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 block mt-1">Intelligence</span>
                    </div>
                </Link>
            </div>
            
            <div className="flex-1 px-6 space-y-10 overflow-y-auto custom-scrollbar">
                <div>
                    <Link
                        href="/dashboard/nova-proposta"
                        className="flex items-center justify-between gap-2 bg-brand-primary text-black font-black p-5 rounded-2xl hover:brightness-110 transition-all shadow-[0_0_30px_rgba(13,242,89,0.15)] mb-10 active:scale-95 group relative overflow-hidden"
                    >
                        <div className="relative z-10 flex items-center gap-3 uppercase text-[10px] tracking-widest">
                            <FilePlus className="w-4 h-4" />
                            <span>Nova Proposta</span>
                        </div>
                        <Zap className="w-4 h-4 fill-black/20 text-black/20 group-hover:scale-150 transition-transform duration-700 relative z-10" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>

                    <nav className="space-y-2">
                        <div className="px-4 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">Menu</span>
                        </div>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden
                                        ${isActive 
                                            ? 'bg-brand-primary/10 text-brand-primary' 
                                            : 'text-gray-500 hover:text-white hover:bg-white/[0.03]'
                                        }
                                    `}
                                >
                                    <item.icon className={`w-5 h-5 transition-all duration-500 ${isActive ? 'text-brand-primary' : 'group-hover:text-brand-primary group-hover:scale-110'}`} />
                                    <span className={`text-xs uppercase tracking-widest font-black transition-all ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                                        {item.label}
                                    </span>
                                    
                                    {isActive && (
                                        <>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-primary rounded-full shadow-[0_0_15px_rgba(13,242,89,0.8)]" />
                                            <div className="absolute left-0 inset-y-0 w-1 bg-brand-primary opacity-20 blur-sm" />
                                        </>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Plan Status Card */}
                <div className="pt-4">
                    <div className="bg-[#0a0a0c] border border-white/5 p-6 rounded-[28px] relative overflow-hidden group hover:border-brand-primary/20 transition-all duration-500">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                                <Crown className="w-3.5 h-3.5 text-brand-primary fill-brand-primary/20" />
                            </div>
                            <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.25em]">Membro Elite</span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-bold mb-4">
                            Sua engine está rodando com <span className="text-white">Turbo GPT-4o</span>.
                        </p>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="w-[85%] h-full bg-brand-primary shadow-[0_0_10px_rgba(13,242,89,0.5)]" />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[9px] font-black uppercase text-gray-700">Quota Mensal</span>
                            <span className="text-[9px] font-black text-brand-primary">85%</span>
                        </div>
                        
                        <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-brand-primary/5 rounded-full blur-2xl group-hover:bg-brand-primary/10 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Profile Section */}
            <div className="p-8 border-t border-white/[0.03]">
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4 cursor-pointer">
                        <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-primary via-[#0bd14e] to-[#07993a] flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(13,242,89,0.1)] group-hover:shadow-[0_0_25px_rgba(13,242,89,0.2)] transition-all">
                                VC
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#050505] rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-brand-primary shadow-[0_0_5px_rgba(13,242,89,0.5)]" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black truncate text-white uppercase tracking-wider group-hover:text-brand-primary transition-colors">Vinícius Cruz</span>
                            <span className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">Administrador</span>
                        </div>
                    </div>
                    
                    <form action={logout}>
                        <button type="submit" className="p-2 text-gray-700 hover:text-red-500 transition-colors">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            </div>
        </aside>
    )
}
