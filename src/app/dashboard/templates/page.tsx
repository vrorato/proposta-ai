import { Layout, Palette, Zap, Star, Shield, Search, ArrowUpRight } from 'lucide-react'

export default function TemplatesPage() {
    const categories = ['Todos', 'Vendas', 'Técnico', 'Criativo', 'Minimalista']
    
    const templates = [
        { title: 'Modern Venture', desc: 'Design minimalista focado em tech startups.', category: 'Minimalista', color: 'from-blue-500/20 to-cyan-500/20' },
        { title: 'Premium Agency', desc: 'Impacto visual máximo para agências criativas.', category: 'Criativo', color: 'from-purple-500/20 to-pink-500/20' },
        { title: 'Dark Executive', desc: 'Elegância e autoridade para grandes contratos.', category: 'Vendas', color: 'from-emerald-500/20 to-teal-500/20' },
        { title: 'Tech Hub', desc: 'Estrutura técnica detalhada para engenharia.', category: 'Técnico', color: 'from-orange-500/20 to-amber-500/20' },
        { title: 'Glass Morph', desc: 'Estética futurista com transparências.', category: 'Criativo', color: 'from-indigo-500/20 to-blue-500/20' },
        { title: 'Bold Impact', desc: 'Contraste alto para apresentações rápidas.', category: 'Vendas', color: 'from-red-500/20 to-orange-500/20' },
    ]

    return (
        <div className="space-y-12 animate-in fade-in duration-1000 max-w-[1200px] mx-auto pb-20">
            {/* Page Header */}
            <div className="relative overflow-hidden rounded-[40px] p-12 glass-effect border-white/5 group">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Star className="w-3 h-3 fill-brand-primary" />
                            Biblioteca Premium
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter leading-none">
                            Design de <span className="text-brand-primary">Elite</span> para suas Propostas
                        </h1>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed">
                            Nossa curadoria de templates é desenhada para converter leads em clientes. 
                            Estruturas validadas por especialistas em vendas.
                        </p>
                    </div>
                </div>
                {/* Background organic shape */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-primary/5 rounded-full blur-[120px]" />
            </div>

            {/* Filters Bar */}
            <div className="flex flex-wrap items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
                    {categories.map((cat, i) => (
                        <button 
                            key={cat} 
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                i === 0 ? 'bg-brand-primary text-black shadow-[0_0_20px_rgba(13,242,89,0.2)]' : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="w-4 h-4 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Buscar estilo..." 
                        className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white placeholder:text-gray-600 outline-none focus:border-brand-primary/50 focus:bg-white/[0.08] transition-all w-64"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {templates.map((t, i) => (
                    <div 
                        key={i} 
                        className="group relative bg-white/[0.02] border border-white/5 rounded-[32px] overflow-hidden hover:border-brand-primary/30 transition-all duration-500 hover:-translate-y-2"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        {/* Preview Area */}
                        <div className={`h-56 bg-gradient-to-br ${t.color} relative overflow-hidden flex items-center justify-center p-10`}>
                            {/* Decorative elements to look like a document */}
                            <div className="w-full h-full bg-black/40 rounded-t-xl border border-white/10 shadow-2xl transition-transform group-hover:scale-105 duration-700 relative overflow-hidden">
                                <div className="absolute top-4 left-4 w-12 h-2 bg-white/10 rounded-full" />
                                <div className="absolute top-8 left-4 w-24 h-4 bg-white/5 rounded-full" />
                                <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/5 rounded-lg rotate-12" />
                            </div>
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <div className="px-6 py-3 bg-brand-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    Em Breve <ArrowUpRight className="w-3.5 h-3.5" />
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-500 text-[9px] font-black uppercase tracking-widest border border-white/5">
                                    {t.category}
                                </span>
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-brand-primary/20 text-brand-primary/20" />)}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white mb-2 group-hover:text-brand-primary transition-colors">{t.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                                    {t.desc}
                                </p>
                            </div>
                        </div>

                        {/* Badge */}
                        <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white text-[9px] font-black uppercase tracking-widest">
                            Em breve
                        </div>
                    </div>
                ))}
            </div>

            {/* Final CTA in page */}
            <div className="mt-20 p-12 bg-white/[0.02] border border-white/5 rounded-[40px] text-center relative overflow-hidden">
                <div className="relative z-10 max-w-xl mx-auto space-y-6">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 neon-glow">
                        <Zap className="w-8 h-8 text-brand-primary fill-brand-primary" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Precisa de um Design Customizado?</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                        Nossa equipe pode criar um template exclusivo baseado na identidade visual da sua agência ou consultoria.
                    </p>
                    <button className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all active:scale-95">
                        Solicitar Design sob medida
                    </button>
                </div>
                {/* Background glow */}
                <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px]" />
                <div className="absolute -top-48 -right-48 w-96 h-96 bg-brand-primary/5 rounded-full blur-[100px]" />
            </div>
        </div>
    )
}
