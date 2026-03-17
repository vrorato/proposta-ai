'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || '',
    defaultHeaders: {
        'HTTP-Referer': 'https://propostaai.com', // Optional, for OpenRouter rankings
        'X-Title': 'PropostaAI', // Optional
    }
})

export async function generateAiSuggestions(proposalId: string) {
    const supabase = await createClient()

    // 1. Fetch proposal data
    const { data: proposal, error: proposalError } = await supabase
        .from('proposals')
        .select(`
            *,
            proposal_clients(*),
            proposal_services(*),
            profiles(*)
        `)
        .eq('id', proposalId)
        .single()

    if (proposalError || !proposal) {
        return { error: 'Proposta não encontrada: ' + proposalError?.message }
    }

    // In a 1-to-1 or 1-to-many depending on exactly how it was created, it might be an object or array.
    const client = Array.isArray(proposal.proposal_clients) ? proposal.proposal_clients[0] : proposal.proposal_clients
    const service = Array.isArray(proposal.proposal_services) ? proposal.proposal_services[0] : proposal.proposal_services
    const profile = Array.isArray(proposal.profiles) ? proposal.profiles[0] : proposal.profiles

    if (!client || !service) {
        return { error: `Dados incompletos da proposta (Clients: ${!!client}, Services: ${!!service})` }
    }

    const langMap: Record<string, string> = {
        'pt-BR': 'Português (Brasil)',
        'en': 'English',
        'es': 'Español',
        'fr': 'Français',
        'de': 'Deutsch',
        'it': 'Italiano',
    }
    const proposalLanguage = langMap[proposal.language || 'pt-BR'] || 'Português (Brasil)'

    // 2. Prepare prompt
    const systemPrompt = `Você é um especialista em vendas e precificação de serviços B2B/B2C.
Sua missão é analisar os dados de uma solicitação de serviço e recomendar uma estratégia de proposta comercial.

IDIOMA ALVO DA PROPOSTA: ${proposalLanguage}
- O campo "reasoning" DEVE ser escrito em ${proposalLanguage}.
- Os títulos em "suggested_structure" DEVEM ser escritos em ${proposalLanguage}.
- Os "suggested_payment_terms" e "suggested_expiration" DEVEM estar em ${proposalLanguage}.
- Use formatos de moeda e data culturalmente adequados para o idioma.

Sua saída deve ser ESTRITAMENTE um JSON válido, sem markdown envolta (sem \`\`\`json), contendo:
{
  "suggested_value_min": number (valor mínimo),
  "suggested_value_ideal": number (valor ideal recomendado para fechamento),
  "suggested_value_max": number (valor caso entregue numa vertente mais premium),
  "reasoning": string (uma breve justificativa do porquê cobrar esse valor, o que argumentar com o cliente),
  "suggested_tone": string (um entre: "formal", "friendly", "persuasive", "technical"),
  "suggested_structure": array de objetos {"title": string, "description": string} (uma sugestão de quais seções colocar na proposta. Ex: Escopo, Prazos, Valores, etc),
  "suggested_expiration": string (ex: "7 dias", "15 dias", usar padrão se aplicável),
  "suggested_payment_terms": string (ex: "50% entrada, 50% na entrega")
}`

    const userMessage = `
DADOS DA EMPRESA EMITENTE (Você representa esta empresa):
Nome da Empresa/Profissional: ${profile?.company_name || profile?.full_name || 'Profissional'}
Especialidades: ${profile?.main_services || 'Não informado'}
Diferenciais de Mercado: ${profile?.professional_differentials || 'Não informado'}
Padrão de Validade: ${profile?.default_expiration_days ? profile?.default_expiration_days + ' dias' : 'Recomendar o ideal'}
Padrão de Pagamento: ${profile?.default_payment_terms || 'Recomendar o ideal'}
Tom Desejado Padrão: ${profile?.default_tone || 'Profissional'}

DADOS DO CLIENTE:
Nome: ${client.client_name}
Empresa: ${client.client_company || 'Não informado'}
Segmento: ${client.segment || 'Não informado'}

DADOS DO SERVIÇO A PRESTAR:
Descrição: ${service.service_description}
Horas estimadas: ${service.estimated_hours || 'Não informado'}
Prazo esperado: ${service.deadline || 'Não informado'}
Complexidade definida pelo provedor: ${service.complexity || 'Não informado'}
Diferenciais Extras p/ a proposta: ${service.differentials || 'Nenhum adicional'}
Extra Info do provedor para você (IA): ${service.extra_info || 'Nenhuma'}
Tom Desejado para essa: ${service.tone || 'Usar padrão ou aberto a sugestões'}

Por favor, gere a recomendação no formato JSON cruzando o que a empresa faz com o que o cliente pediu.
`

    try {
        // 3. Call OpenRouter API via OpenAI SDK
        const response = await openai.chat.completions.create({
            model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 1500,
        })

        const responseText = response.choices[0]?.message?.content || ''

        // Attempt to parse JSON safely
        const jsonStr = responseText.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '')
        const aiData = JSON.parse(jsonStr)

        // 4. Save to database
        // Delete existing if any (or we could update, but upsert with ID is tricky if we don't have it)
        await supabase.from('proposal_ai_suggestions').delete().eq('proposal_id', proposalId)

        const { data: savedSuggestion, error: saveError } = await supabase
            .from('proposal_ai_suggestions')
            .insert({
                proposal_id: proposalId,
                suggested_value: aiData.suggested_value_ideal,
                suggested_value_min: aiData.suggested_value_min,
                suggested_value_max: aiData.suggested_value_max,
                suggested_structure: aiData.suggested_structure,
                suggested_tone: aiData.suggested_tone,
                reasoning: aiData.reasoning,
                suggested_expiration: aiData.suggested_expiration,
                suggested_payment_terms: aiData.suggested_payment_terms,
                user_adjusted_value: aiData.suggested_value_ideal, // Starts with identical ideal value
                user_adjusted_tone: aiData.suggested_tone,
            })
            .select()
            .single()

        if (saveError) {
            return { error: 'Erro ao salvar sugestões no banco: ' + saveError.message }
        }

        // Move proposal status to 'preview'
        await supabase.from('proposals').update({ status: 'preview' }).eq('id', proposalId)

        return { data: savedSuggestion }
    } catch (err: any) {
        return { error: 'Falha ao comunicar com IA ou parse: ' + String(err?.message || err) }
    }
}

export async function saveUserAdjustments(proposalId: string, value: number, tone: string, structure: any[]) {
    const supabase = await createClient()

    // Verify auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    const { error } = await supabase
        .from('proposal_ai_suggestions')
        .update({
            user_adjusted_value: value,
            user_adjusted_tone: tone,
            suggested_structure: structure, // overwriting original or user edited structure here
            user_approved: true
        })
        .eq('proposal_id', proposalId)

    if (error) {
        return { error: error.message }
    }

    return { success: true }
}
