import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-[#F8F9FC] print:bg-white">
            <div className="print:hidden">
                <Sidebar />
            </div>
            <div className="flex-1 ml-64 print:ml-0">
                <div className="print:hidden">
                    <DashboardHeader />
                </div>
                <main className="p-8 print:p-0 print:m-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
