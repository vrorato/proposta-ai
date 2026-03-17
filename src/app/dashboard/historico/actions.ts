'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ProposalHistoryItem = {
    id: string
    title: string
    status: string
    created_at: string
    client: { client_name: string; client_company: string | null } | null
    service: { service_description: string; estimated_hours: number | null } | null
    ai_suggestion: { user_adjusted_value: number | null } | null
}

export async function getProposals() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
        .from('proposals')
        .select(`
            id,
            title,
            status,
            created_at,
            client:proposal_clients(client_name, client_company),
            service:proposal_services(service_description, estimated_hours),
            ai_suggestion:proposal_ai_suggestions(user_adjusted_value)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return { error: error.message }
    }

    // Normalize potential array returns from relationships
    const normalizedData = (data || []).map(item => ({
        ...item,
        client: Array.isArray(item.client) ? item.client[0] : item.client,
        service: Array.isArray(item.service) ? item.service[0] : item.service,
        ai_suggestion: Array.isArray(item.ai_suggestion) ? item.ai_suggestion[0] : item.ai_suggestion,
    }))

    return { data: normalizedData as ProposalHistoryItem[] }
}

export async function deleteProposal(proposalId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // RLS ensures they can only delete their own. 
    // ON DELETE CASCADE on DB setup handles related rows.
    const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', proposalId)
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/historico')
    return { success: true }
}

export async function duplicateProposal(proposalId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // 1. Fetch original
    const { data: original, error: fetchErr } = await supabase
        .from('proposals')
        .select(`
            *,
            proposal_clients(*),
            proposal_services(*)
        `)
        .eq('id', proposalId)
        .single()

    if (fetchErr || !original) return { error: 'Proposta original não encontrada' }

    const client = Array.isArray(original.proposal_clients) ? original.proposal_clients[0] : original.proposal_clients
    const service = Array.isArray(original.proposal_services) ? original.proposal_services[0] : original.proposal_services

    // 2. Clone Proposal Record
    const { data: newProposal, error: insertErr } = await supabase
        .from('proposals')
        .insert({
            user_id: user.id,
            status: 'draft',
            title: `${original.title} (Cópia)`
        })
        .select()
        .single()

    if (insertErr || !newProposal) return { error: 'Erro ao criar cópia: ' + insertErr?.message }

    // 3. Clone Client
    if (client) {
        const { id, proposal_id, created_at, updated_at, ...clientData } = client
        await supabase.from('proposal_clients').insert({
            ...clientData,
            proposal_id: newProposal.id
        })
    }

    // 4. Clone Service
    if (service) {
        const { id, proposal_id, created_at, updated_at, ...serviceData } = service
        await supabase.from('proposal_services').insert({
            ...serviceData,
            proposal_id: newProposal.id
        })
    }

    revalidatePath('/dashboard/historico')
    return { success: true, newId: newProposal.id }
}
