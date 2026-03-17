'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type ProposalWizardData = {
    client_name: string
    client_company?: string
    client_email?: string
    segment?: string

    service_description: string
    estimated_hours?: number
    deadline?: string
    complexity?: 'low' | 'medium' | 'high'

    differentials?: string
    extra_info?: string
    tone?: 'formal' | 'friendly' | 'persuasive' | 'technical'
    language?: string
}

export async function saveProposalDraft(data: ProposalWizardData) {
    const supabase = await createClient()

    // 1. Check User
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { error: 'Usuário não autenticado' }
    }

    // 2. Create the proposal record
    const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .insert({
            user_id: user.id,
            status: 'draft',
            title: `Proposta para ${data.client_company || data.client_name}`,
            language: data.language || 'pt-BR',
        })
        .select()
        .single()

    if (proposalError || !proposal) {
        return { error: 'Erro ao criar proposta: ' + proposalError?.message }
    }

    // 3. Create the proposal_clients record
    const { error: clientError } = await supabase
        .from('proposal_clients')
        .insert({
            proposal_id: proposal.id,
            client_name: data.client_name,
            client_company: data.client_company || null,
            client_email: data.client_email || null,
            segment: data.segment || null,
        })

    if (clientError) {
        // Rollback just in case for a clean state
        await supabase.from('proposals').delete().eq('id', proposal.id)
        return { error: 'Erro ao salvar cliente: ' + clientError.message }
    }

    // 4. Create the proposal_services record
    const { error: serviceError } = await supabase
        .from('proposal_services')
        .insert({
            proposal_id: proposal.id,
            service_description: data.service_description,
            estimated_hours: data.estimated_hours || null,
            deadline: data.deadline || null,
            complexity: data.complexity || null,
            differentials: data.differentials || null,
            extra_info: data.extra_info || null,
            tone: data.tone || null,
        })

    if (serviceError) {
        await supabase.from('proposals').delete().eq('id', proposal.id)
        return { error: 'Erro ao salvar serviço: ' + serviceError.message }
    }

    // O processo termina com a proposta salva no status de rascunho
    // Num futuro imediato, aqui invocaremos a IA.
    redirect(`/dashboard/proposta/${proposal.id}/preview`)
}
