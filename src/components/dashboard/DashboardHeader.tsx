'use client'

import { logout } from '@/app/auth/actions'
import { LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardHeader() {
    return (
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 w-full mb-6 relative">
            <div>
                <h2 className="text-xl font-semibold text-[#0F1B2D]">
                    Bem-vindo de volta!
                </h2>
                <p className="text-sm text-gray-500">
                    Acompanhe e gerencie suas propostas
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Minha Conta</span>
                </div>
                <form action={logout}>
                    <Button variant="outline" size="icon" title="Sair do sistema">
                        <LogOut className="w-4 h-4 text-red-500" />
                    </Button>
                </form>
            </div>
        </header>
    )
}
