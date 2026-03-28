export default function Sidebar({ categories, selectedCategory, setSelectedCategory }) {
    return (
        <aside className="w-48 flex-shrink-0 pt-2 lg:block hidden">
            <h2 className="font-serif mb-4 pb-2 text-lg text-[#c59353] border-b border-brand-brown/20">
                Product Catalogue
            </h2>
            <ul className="space-y-1 tracking-wider uppercase category-style">
                <li>
                    <button
                        type="button"
                        onClick={() => setSelectedCategory('ALL')}
                        className={`text-left w-full hover:bg-brand-brown/10 px-3 py-2 transition-colors ${
                            selectedCategory === 'ALL' ? 'bg-[#6b2f1a] text-[#C59353]' : 'text-[#6b2f1a]'
                        }`}
                    >
                        ALL
                    </button>
                </li>
                {categories.map((category) => (
                    <li key={category.id}>
                        <button
                            type="button"
                            onClick={() => setSelectedCategory(category.name)}
                            className={`text-left w-full hover:bg-brand-brown/10 px-3 py-2 transition-colors ${
                                selectedCategory === category.name ? 'bg-[#6b2f1a] text-[#C59353]' : 'text-[#6b2f1a]'
                            }`}
                        >
                            {category.name}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
