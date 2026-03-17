import { PreviewDashboard } from '@/components/dashboard/PreviewDashboard'

export default async function AIPreviewPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;

    // Pass the ID to the client component which will orchestrate loading and UI state
    return (
        <div className="py-6">
            <PreviewDashboard proposalId={params.id} />
        </div>
    )
}
