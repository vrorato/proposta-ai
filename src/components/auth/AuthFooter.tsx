export function AuthFooter() {
    return (
        <div className="flex items-center gap-6 mt-12 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0df259]" />
                <span className="text-gray-500">Systems Operational</span>
            </div>
            <div className="w-px h-3 bg-white/5" />
            <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
        </div>
    )
}
