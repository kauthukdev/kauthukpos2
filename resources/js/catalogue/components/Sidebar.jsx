export default function Sidebar({ categories, selectedCategory, setSelectedCategory }) {
    return (
        <aside className="catalogue-sidebar lg:block hidden">
            <div className="catalogue-sidebar-panel">
                <div className="catalogue-sidebar-title">Products</div>
                <ul className="catalogue-sidebar-list">
                    <li>
                        <button
                            type="button"
                            onClick={() => setSelectedCategory('ALL')}
                            className={`catalogue-sidebar-link ${
                                selectedCategory === 'ALL' ? 'catalogue-sidebar-link-active' : ''
                            }`}
                        >
                            All
                        </button>
                    </li>
                    {categories.map((category) => (
                        <li key={category.id}>
                            <button
                                type="button"
                                onClick={() => setSelectedCategory(category.name)}
                                className={`catalogue-sidebar-link ${
                                    selectedCategory === category.name ? 'catalogue-sidebar-link-active' : ''
                                }`}
                            >
                                {category.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
