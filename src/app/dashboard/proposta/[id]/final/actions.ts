'use server'

import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY || '',
    defaultHeaders: {
        'HTTP-Referer': 'https://propostaai.com',
        'X-Title': 'PropostaAI',
    }
})

export async function generateFinalContent(proposalId: string, forceRegenerate: boolean = false) {
    const supabase = await createClient()

    // 1. Fetch all data related to the proposal
    const { data: proposal, error: fetchErr } = await supabase
        .from('proposals')
        .select(`
            *,
            proposal_clients(*),
            proposal_services(*),
            proposal_ai_suggestions(*),
            proposal_finals(*),
            profiles(*)
        `)
        .eq('id', proposalId)
        .single()

    if (fetchErr || !proposal) {
        return { error: 'Proposta não encontrada' }
    }

    const client = Array.isArray(proposal.proposal_clients) ? proposal.proposal_clients[0] : proposal.proposal_clients
    const service = Array.isArray(proposal.proposal_services) ? proposal.proposal_services[0] : proposal.proposal_services
    const suggestion = Array.isArray(proposal.proposal_ai_suggestions) ? proposal.proposal_ai_suggestions[0] : proposal.proposal_ai_suggestions
    let finalDoc = Array.isArray(proposal.proposal_finals) ? proposal.proposal_finals[0] : proposal.proposal_finals
    const profile = Array.isArray(proposal.profiles) ? proposal.profiles[0] : proposal.profiles

    const coverLangMap: Record<string, { proposalFor: string, locale: string }> = {
        'pt-BR': { proposalFor: 'Proposta para', locale: 'pt-BR' },
        'en': { proposalFor: 'Proposal for', locale: 'en-US' },
        'es': { proposalFor: 'Propuesta para', locale: 'es-ES' },
        'fr': { proposalFor: 'Proposition pour', locale: 'fr-FR' },
        'de': { proposalFor: 'Angebot für', locale: 'de-DE' },
        'it': { proposalFor: 'Proposta per', locale: 'it-IT' },
    }
    const coverLang = coverLangMap[proposal.language || 'pt-BR'] || coverLangMap['pt-BR']
    const metaLocale = coverLang.locale

    const meta = {
        clientName: client?.client_name || '',
        company: client?.client_company || '',
        date: finalDoc?.created_at ? new Date(finalDoc.created_at).toLocaleDateString(metaLocale, { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString(metaLocale, { year: 'numeric', month: 'long', day: 'numeric' }),
        title: `${coverLang.proposalFor} ${client?.client_company || client?.client_name || ''}`.trim() || proposal.title || 'Proposta Comercial',
        language: proposal.language || 'pt-BR',
    }

    // If final document already exists and not forcing regeneration, return it
    if (!forceRegenerate && finalDoc && finalDoc.final_content) {
        return {
            data: finalDoc.final_content,
            meta,
            profile,
        }
    }

    if (!suggestion) {
        return { error: 'Sugestões da IA não foram geradas ou encontradas.' }
    }

    // 2. Prepare the prompt
    const finalValue = suggestion.user_adjusted_value || suggestion.suggested_value
    const finalTone = suggestion.user_adjusted_tone || suggestion.suggested_tone || 'formal'
    const structure = suggestion.suggested_structure || []

    const langMap: Record<string, { name: string, locale: string }> = {
        'pt-BR': { name: 'Português (Brasil)', locale: 'pt-BR' },
        'en': { name: 'English', locale: 'en-US' },
        'es': { name: 'Español', locale: 'es-ES' },
        'fr': { name: 'Français', locale: 'fr-FR' },
        'de': { name: 'Deutsch', locale: 'de-DE' },
        'it': { name: 'Italiano', locale: 'it-IT' },
    }
    const lang = langMap[proposal.language || 'pt-BR'] || langMap['pt-BR']
    const currentDate = new Date().toLocaleDateString(lang.locale, { year: 'numeric', month: 'long', day: 'numeric' })

    const prompt = `Você é um redator especialista em propostas comerciais de alto nível. Seu objetivo é redigir uma proposta final em formato Markdown que seja absurdamente persuasiva, profissional e perfeitamente formatada. 

IDIOMA OBRIGATÓRIO DA PROPOSTA: ${lang.name}
- TODO o texto da proposta DEVE ser escrito em ${lang.name}.
- Adapte termos técnicos, formatos de moeda e data para o idioma/região.
- O tom e formalidade devem ser culturalmente apropriados para ${lang.name}.
- NÃO escreva em português se o idioma selecionado for outro. Apenas use os dados fornecidos (que estão em português) como base, mas TRADUZA e ADAPTE tudo para ${lang.name}.

Data Atual / Data de Emissão: ${currentDate}

DADOS DA EMPRESA EMITENTE (Quem está propondo):
- Nome da Empresa/Profissional: ${profile?.company_name || profile?.full_name || 'Profissional'}
- Documento: ${profile?.company_document || 'Não informado'}
- Descrição da Empresa: ${profile?.professional_description || 'Não informado'}
- Especialidades: ${profile?.main_services || 'Não informado'}
- Diferenciais de Mercado: ${profile?.professional_differentials || 'Não informado'}
- Casos de Sucesso: ${profile?.portfolio_links || 'Não informado'}
- Termos e Condições Padrão da Empresa:
${profile?.default_terms_conditions || 'Siga o padrão básico de direitos autorais e atrasos ou adicione se a estrutura pedir.'}

Contexto do Cliente:
- Nome/Contato: ${client?.client_name || 'Não informado'}
- Empresa: ${client?.client_company || 'Não informado'}
- Notas: ${client?.client_notes || 'Nenhuma'}

Contexto do Serviço:
- Descrição: ${service?.service_description || 'Não informado'}
- Escopo Mensurável/Entregáveis: ${service?.scope || ''} / ${service?.deliverables || ''}
- Prazo Estimado de Entrega (do cliente): ${service?.deadline || 'Não informado'}
- Horas Estimadas: ${service?.estimated_hours || 'Não informado'}
- Diferenciais extras para esta proposta: ${service?.differentials || 'Não informado'}

Condições Comerciais Acordadas / Sugeridas:
- Valor Final a ser cobrado: ${profile?.default_currency || 'R$'} ${finalValue}
- Validade da Proposta: ${suggestion.suggested_expiration || '15 dias'}
- Condições de Pagamento: ${suggestion.suggested_payment_terms || 'Não informado'}
- Estrutura Solicitada de Seções: ${JSON.stringify(structure)}

INSTRUÇÕES DE PREENCHIMENTO:
1. Siga EXATAMENTE a Estrutura Solicitada de Seções, usando cabeçalhos markdown (## ou ###).
2. Escreva o conteúdo das seções de forma rica e detalhada, preenchendo as lacunas e conectando as informações do serviço e os diferenciais da CONTRATADA.
3. Não use placeholders como [Nome do Cliente], preencha com os dados fornecidos. 
4. O tom do texto deve ser: ${finalTone}.
5. Formate valores numéricos corretamente para a moeda informada.
6. Faça uso de listas em markdown para os entregáveis e escopo para facilitar a leitura.
7. Se houver uma seção estrutural de "Termos e Condições" ou "Informações Legais", certifique-se de basear no campo "Termos e Condições Padrão da Empresa" fornecido acima, adaptando se necessário.
8. Retorne APENAS o texto Markdown bruto da proposta, sem introduções suas ou formatações json em volta.
9. ATENÇÃO: Seja objetivo e direto ao ponto. Condense as informações para não ultrapassar 4000 palavras.`

    try {
        const response = await openai.chat.completions.create({
            model: process.env.NEXT_PUBLIC_OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
            messages: [
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 8192,
        })

        let generatedMarkdown = response.choices[0]?.message?.content || ''
        if (!generatedMarkdown) {
            return { error: 'Formato de resposta inesperado da IA.' }
        }

        // 3. Save to database
        const { data: newFinal, error: insertErr } = await supabase
            .from('proposal_finals')
            .upsert({
                proposal_id: proposalId,
                final_content: generatedMarkdown,
                final_value: finalValue
            }, { onConflict: 'proposal_id' })
            .select()
            .single()

        if (insertErr) {
            console.error('Insert error proposal_finals', insertErr)
            // Even if it fails to save temporarily, return content so user isn't fully blocked
            return { data: generatedMarkdown, meta, warning: 'Falha ao salvar no banco, mas o texto foi gerado.' }
        }

        return { data: generatedMarkdown, meta }
    } catch (e: any) {
        console.error('Claude API Error', e)
        return { error: 'Falha ao se comunicar com a IA: ' + e.message }
    }
}

export async function finalizeProposal(proposalId: string) {
    const supabase = await createClient()
    const { error } = await supabase
        .from('proposals')
        .update({ status: 'finalized', finalized_at: new Date().toISOString() })
        .eq('id', proposalId)

    if (error) return { error: error.message }
    return { success: true }
}

export async function updateFinalContent(proposalId: string, newContent: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('proposal_finals')
        .update({ final_content: newContent })
        .eq('proposal_id', proposalId)

    if (error) {
        console.error('Erro ao salvar edição:', error)
        return { error: error.message }
    }

    return { success: true }
}
