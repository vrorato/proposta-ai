import { getProfile } from './actions'
import { ProfileSettings } from '@/components/dashboard/ProfileSettings'

export const metadata = {
    title: 'Configurações - PropostaAI',
    description: 'Ajuste seus dados de empresa e identidade visual.',
}

export default async function SettingsPage() {
    const profile = await getProfile()

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="relative overflow-hidden rounded-3xl p-8 glass-effect border-brand-primary/10">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Configurações da <span className="text-brand-primary">Empresa</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl font-medium">
                        Gerencie seus dados, identidade visual e padrões para propostas personalizadas.
                    </p>
                </div>
                {/* Background organic shape */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/5 rounded-full blur-[100px]" />
            </div>

            <div className="pb-10">
                <ProfileSettings profile={profile} />
            </div>
        </div>
    )
}
