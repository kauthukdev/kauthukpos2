function SearchIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </svg>
    );
}

function HomeIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V21h14V9.5" />
            <path d="M9 21v-6h6v6" />
        </svg>
    );
}

function GiftIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="M20 12v10H4V12" />
            <path d="M2 7h20v5H2z" />
            <path d="M12 22V7" />
            <path d="M12 7h5a2.5 2.5 0 1 0 0-5c-3 0-5 5-5 5Z" />
            <path d="M12 7H7a2.5 2.5 0 1 1 0-5c3 0 5 5 5 5Z" />
        </svg>
    );
}

function ImageIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
        </svg>
    );
}

function BriefcaseIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <path d="M3 12h18" />
        </svg>
    );
}

export default function Header({ categories, search, setSearch, selectedCategory, setSelectedCategory }) {
    const announcementMessages = [
        'Welcome to Kauthuk - The complete store for Decor, Gifts & Souvenirs',
        'Wide variety of designs and collections across India',
        'World wide shipping',
        'Customised solutions for Home & Work Space',
        'Eco-Friendly & Sustainable Products',
    ];

    const getIcon = (name) => {
        switch (name.toUpperCase()) {
            case 'DECOR':
                return <HomeIcon className="w-5 h-5" />;
            case 'SOUVENIRS':
                return <BriefcaseIcon className="w-5 h-5" />;
            case 'PAINTINGS':
                return <ImageIcon className="w-5 h-5" />;
            case 'GIFTS':
                return <GiftIcon className="w-5 h-5" />;
            default:
                return null;
        }
    };

    return (
        <header className="sticky top-0 z-50 shadow-lg">
            {announcementMessages.length > 0 ? (
                <div className="catalogue-announcement-bar">
                    <div className="catalogue-announcement-marquee">
                        <div className="catalogue-announcement-content">
                            {announcementMessages.map((message, index) => (
                                <span key={`announcement-${index}`}>{message}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="bg-brand-red text-white py-3 px-8 flex items-center justify-between">
                <div className="flex items-center space-x-12">
                    <h1 className="flex items-center">
                        <img
                            src={window.catalogueConfig.logoUrl}
                            alt="kauthuk logo"
                            className="h-10 mb-3 w-auto object-contain filter invert sepia saturate-0 hue-rotate-180 brightness-200 contrast-100"
                        />
                    </h1>
                    <nav className="hidden md:flex items-center space-x-8">
                        {categories
                            .filter((category) =>
                                ['DECOR', 'SOUVENIRS', 'PAINTINGS', 'GIFTS'].includes(category.name.toUpperCase()),
                            )
                            .map((category) => (
                                <button
                                    key={category.id}
                                    className={`flex items-center space-x-2 uppercase tracking-wider category-style transition-opacity duration-200 ${
                                        selectedCategory === category.name ? 'text-brand-gold' : 'hover:opacity-80'
                                    }`}
                                    onClick={() => setSelectedCategory(category.name)}
                                >
                                    {getIcon(category.name)}
                                    <span>{category.name}</span>
                                </button>
                            ))}
                    </nav>
                </div>
                <div>
                    <div className="relative">
                        <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-brown/50" />
                        <input
                            type="text"
                            placeholder="Search for Products"
                            className="pl-8 pr-4 py-1.5 rounded border border-brand-brown/30 bg-[#4e110d] text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-brand-gold w-64 text-sm"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
