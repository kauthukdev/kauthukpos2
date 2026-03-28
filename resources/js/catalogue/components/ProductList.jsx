import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

function buildParams(category, search, page) {
    const params = { page };

    if (category !== 'ALL') {
        params.category = category;
    }

    if (search.trim()) {
        params.search = search.trim();
    }

    return params;
}

export default function ProductList({ category, search }) {
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [pages, setPages] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadProducts(1, false);
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [category, debouncedSearch]);

    async function loadProducts(nextPage, append) {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
            setPages([]);
        }

        setError('');

        try {
            const response = await window.axios.get(window.catalogueConfig.endpoints.products, {
                params: buildParams(category, debouncedSearch, nextPage),
            });

            const payload = response.data;

            setPages((currentPages) => (append ? [...currentPages, payload] : [payload]));
            setPage(payload.current_page);
            setHasMore(payload.current_page < payload.last_page);
        } catch (requestError) {
            setError('Unable to load catalogue products right now.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    const products = pages.flatMap((group) => group.data ?? []);

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-brand-brown">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-serif italic text-lg">Loading Products...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <p className="text-center text-red-500 py-8">Error: {error}</p>;
    }

    if (products.length === 0) {
        return (
            <div className="w-full text-center py-16 text-brand-brown/70 italic font-serif">
                No products found matching your criteria.
            </div>
        );
    }

    return (
        <div className="w-full">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}

            <div className="py-8 flex justify-center text-brand-brown">
                {hasMore ? (
                    <button
                        type="button"
                        onClick={() => loadProducts(page + 1, true)}
                        disabled={loadingMore}
                        className="flex flex-col items-center hover:text-brand-red transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <span className="font-serif text-lg mb-1">{loadingMore ? 'Loading more...' : 'Load More'}</span>
                        <span className="text-xl leading-none">▾</span>
                    </button>
                ) : (
                    <span className="italic opacity-50"></span>
                )}
            </div>
        </div>
    );
}
