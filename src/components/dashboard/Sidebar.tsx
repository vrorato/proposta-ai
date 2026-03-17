import { LayoutDashboard, FilePlus, History, LayoutTemplate, Settings } from 'lucide-react'
import Link from 'next/link'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: FilePlus, label: 'Nova Proposta', href: '/dashboard/nova-proposta' },
    { icon: History, label: 'Histórico', href: '/dashboard/historico' },
    { icon: LayoutTemplate, label: 'Templates', href: '/dashboard/templates' },
    { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' },
]

export function Sidebar() {
    return (
        <aside className="w-64 bg-[#0F1B2D] text-white flex flex-col h-screen fixed top-0 left-0 border-r border-[#1A2E4A]">
            <div className="p-6 border-b border-[#1A2E4A]">
                <h1 className="text-2xl font-bold text-[#C9A84C]">PropostaAI</h1>
            </div>
            <div className="p-4">
                <Link
                    href="/dashboard/nova-proposta"
                    className="flex items-center gap-2 bg-[#C9A84C] text-[#0F1B2D] font-semibold p-3 rounded-lg hover:bg-[#b09341] transition-colors mb-6"
                >
                    <FilePlus className="w-5 h-5" />
                    <span>Criar Proposta</span>
                </Link>
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#1A2E4A] transition-colors"
                        >
                            <item.icon className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-200">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    )
}
