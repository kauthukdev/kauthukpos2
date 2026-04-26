import { useEffect, useRef } from 'react';

function SearchIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </svg>
    );
}

export default function Header({ search, setSearch, clearSearch }) {
    const searchContainerRef = useRef(null);
    const announcementMessages = [
        'Welcome to Kauthuk - The complete store for Decor, Gifts & Souvenirs',
        'Wide variety of designs and collections across India',
        'World wide shipping',
        'Customised solutions for Home & Work Space',
        'Eco-Friendly & Sustainable Products',
    ];
    const headerCategories = [
        { name: 'Decor', iconUrl: '/images/menu-icon/decor.png' },
        { name: 'Gifts', iconUrl: '/images/menu-icon/gifts.png' },
        { name: 'Souvenirs', iconUrl: '/images/menu-icon/souvenier.png' },
        { name: 'Paintings', iconUrl: '/images/menu-icon/painting.png' },
    ];

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!searchContainerRef.current?.contains(event.target)) {
                clearSearch();
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, [clearSearch]);

    return (
        <header className="catalogue-header sticky top-0 z-50 shadow-lg">
            {announcementMessages.length > 0 ? (
                <div className="catalogue-announcement-bar">
                    <div className="catalogue-announcement-shell">
                        <div className="catalogue-announcement-marquee">
                            <div className="catalogue-announcement-content">
                                {announcementMessages.map((message, index) => (
                                    <span key={`announcement-${index}`}>{message}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="catalogue-header-main">
                <div className="catalogue-header-container">
                    <div className="catalogue-header-branding">
                        <h1 className="catalogue-header-logo">
                            <img
                                src={window.catalogueConfig.logoUrl}
                                alt="Kauthuk Logo"
                                className="catalogue-header-logo-image"
                            />
                        </h1>
                    </div>

                    <nav className="catalogue-header-navigation">
                        <ul className="catalogue-header-nav-list">
                            {headerCategories.map((category) => (
                                <li key={category.name} className="catalogue-header-nav-item">
                                    <span className="catalogue-header-nav-link catalogue-header-nav-link-static category-style">
                                        {category.iconUrl ? (
                                            <span className="catalogue-header-nav-icon">
                                                <img
                                                    src={category.iconUrl}
                                                    alt={`${category.name} icon`}
                                                    className="catalogue-header-nav-icon-image"
                                                />
                                            </span>
                                        ) : null}
                                        <span>{category.name}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="catalogue-header-search-section">
                        <div ref={searchContainerRef} className="catalogue-header-search-container">
                            <p className="catalogue-header-contact">
                                <span className="catalogue-header-contact-label">Call at :</span>{' '}
                                <span className="catalogue-header-contact-number">+ 91 8075727191</span>
                            </p>
                            <div className="catalogue-header-search">
                                <SearchIcon className="catalogue-header-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search for handicrafts, decor items..."
                                    className="catalogue-header-search-input"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
