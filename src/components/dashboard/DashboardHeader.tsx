'use client'

import { logout } from '@/app/auth/actions'
import { LogOut, User, Bell, Search, Globe, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
    return (
        <header className="flex items-center justify-between px-10 py-6 sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050505]/60 border-b border-white/[0.03]">
            <div className="flex items-center gap-8">
                {/* Status Indicator */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 group cursor-default">
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-brand-primary blur-[4px] animate-ping" />
                    </div>
                    <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-500">
                        System <span className="text-white/40">Secure</span>
                    </span>
                </div>

                <div className="h-6 w-px bg-white/[0.05]" />

                {/* Quick Search Mock */}
                <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/[0.03] rounded-2xl group focus-within:border-brand-primary/30 transition-all w-64 cursor-text">
                    <Search className="w-3.5 h-3.5 text-gray-700 group-focus-within:text-brand-primary transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 group-focus-within:text-gray-400">Search Engine...</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Secondary Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-gray-600 hover:text-white hover:bg-white/5 transition-all">
                        <Bell className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl text-gray-600 hover:text-white hover:bg-white/5 transition-all">
                        <Globe className="w-4 h-4" />
                    </Button>
                </div>

                <div className="h-6 w-px bg-white/[0.05]" />

                {/* Main Account Action */}
                <div className="flex items-center gap-3 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl px-5 py-2.5 hover:bg-brand-primary/10 transition-all cursor-pointer group active:scale-95">
                    <div className="w-6 h-6 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                    </div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Manage Identity</span>
                </div>
                
                {/* Logout Action */}
                <form action={logout}>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Encerrar Sessão"
                        className="w-11 h-11 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all text-gray-600 group"
                    >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    </Button>
                </form>
            </div>
        </header>
    )
}
