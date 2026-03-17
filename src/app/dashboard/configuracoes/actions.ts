'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Erro ao buscar perfil:', error)
        throw new Error('Falha ao buscar dados do perfil')
    }

    return data
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Usuário não autenticado')
    }

    // Extract basic fields
    const updates = {
        full_name: formData.get('full_name') as string,
        company_name: formData.get('company_name') as string,
        company_document: formData.get('company_document') as string,
        company_address: formData.get('company_address') as string,
        phone: formData.get('phone') as string,
        website: formData.get('website') as string,

        brand_primary_color: formData.get('brand_primary_color') as string,
        brand_secondary_color: formData.get('brand_secondary_color') as string,
        brand_font: formData.get('brand_font') as string,

        default_tone: formData.get('default_tone') as string,
        default_currency: formData.get('default_currency') as string,
        default_expiration_days: parseInt(formData.get('default_expiration_days') as string) || null,
        default_payment_terms: formData.get('default_payment_terms') as string,
        default_terms_conditions: formData.get('default_terms_conditions') as string,

        professional_description: formData.get('professional_description') as string,
        main_services: formData.get('main_services') as string,
        professional_differentials: formData.get('professional_differentials') as string,
        portfolio_links: formData.get('portfolio_links') as string,

        updated_at: new Date().toISOString(),
    }

    // Handle File Uploads (Logo & Signature)
    const logoFile = formData.get('company_logo') as File | null
    if (logoFile && logoFile.size > 0) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `${user.id}/logo-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('brands')
            .upload(fileName, logoFile, { upsert: true })

        if (uploadError) {
            console.error('Erro no upload da logo:', uploadError)
        } else {
            const { data } = supabase.storage.from('brands').getPublicUrl(fileName)
            // @ts-ignore
            updates.company_logo_url = data.publicUrl
        }
    }

    const signatureFile = formData.get('digital_signature') as File | null
    if (signatureFile && signatureFile.size > 0) {
        const fileExt = signatureFile.name.split('.').pop()
        const fileName = `${user.id}/signature-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('brands')
            .upload(fileName, signatureFile, { upsert: true })

        if (uploadError) {
            console.error('Erro no upload da assinatura:', uploadError)
        } else {
            const { data } = supabase.storage.from('brands').getPublicUrl(fileName)
            // @ts-ignore
            updates.digital_signature_url = data.publicUrl
        }
    }

    console.log('Attempting to update profile for user:', user.id)
    console.log('Updates:', updates)

    const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

    if (error) {
        console.error('SERVER ERROR - updateProfile:', error.message, error.details, error.hint)
        return { success: false, error: error.message || 'Falha ao salvar as configurações' }
    }

    console.log('Update successful for user:', user.id)

    revalidatePath('/dashboard/configuracoes')
    revalidatePath('/dashboard/nova-proposta')
    revalidatePath('/dashboard')
    return { success: true }
}
