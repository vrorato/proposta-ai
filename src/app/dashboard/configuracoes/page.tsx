import { getProfile } from './actions'
import { ProfileSettings } from '@/components/dashboard/ProfileSettings'

export const metadata = {
    title: 'Configurações - PropostaAI',
    description: 'Ajuste seus dados de empresa e identidade visual.',
}

export default async function SettingsPage() {
    const profile = await getProfile()

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#0F1B2D]">Configurações da Empresa</h1>
                <p className="text-[#8896A6]">Gerencie seus dados, identidade visual e padrões para propostas.</p>
            </div>

            <div className="flex-1 overflow-hidden">
                <ProfileSettings profile={profile} />
            </div>
        </div>
    )
}
