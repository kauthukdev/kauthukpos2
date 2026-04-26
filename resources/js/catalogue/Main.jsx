import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Sidebar from './components/Sidebar';

export default function Main() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [search, setSearch] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const skipNextSearchSyncRef = useRef(false);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSearch('');
        setAppliedSearch('');
    };

    const handleSearchDismiss = () => {
        if (!search) {
            return;
        }

        skipNextSearchSyncRef.current = true;
        setSearch('');
    };

    useEffect(() => {
        let cancelled = false;

        async function loadCategories() {
            try {
                const response = await window.axios.get(window.catalogueConfig.endpoints.categories);

                if (!cancelled) {
                    setCategories(response.data);
                }
            } catch (error) {}
        }

        loadCategories();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            if (skipNextSearchSyncRef.current) {
                skipNextSearchSyncRef.current = false;
                return;
            }

            setAppliedSearch(search);
        }, 500);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    return (
        <div className="min-h-screen bg-brand-bg text-brand-brown font-sans flex flex-col">
            <Header
               search={search}
               setSearch={setSearch}
               clearSearch={handleSearchDismiss}
            />

            <div className="catalogue-page-shell">
                <h1 className="catalogue-page-title">Product Catalogue</h1>
            </div>

            <div className="w-full max-w-7xl mx-auto px-4 pb-8 flex flex-1 gap-10 md:px-6 lg:pr-8 lg:pl-0 lg:gap-16">
                <Sidebar
                   categories={categories}
                   selectedCategory={selectedCategory}
                   setSelectedCategory={handleCategorySelect}
                />

                <main className="flex-1 w-full max-w-4xl pt-2 lg:ml-20">
                    <ProductList category={selectedCategory} search={appliedSearch} />
                </main>
            </div>

            <footer className="bg-brand-brown text-white py-12 px-8 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col gap-10 text-xs opacity-90 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
                    <div className="w-full max-w-md text-left lg:flex-[0_1_36%]">
                        <img
                            src={window.catalogueConfig.logoUrl}
                            alt="Kauthuk Logo"
                            className="h-16 w-auto max-w-[220px] object-contain mb-5"
                        />
                        <p className="text-base leading-relaxed text-white/95">
                            Kauthuk is a venture connecting Art, Artisan, and Technology, celebrating the beauty of
                            handmade living. Through thoughtful design and innovation, we craft and curate unique
                            Artifacts, Handicrafts, Furniture, Paintings, and Decor. From wood and brass to stone and
                            fabric, every piece reflects India&apos;s creative spirit. Our mission is to share these
                            sustainable treasures with the world and bring timeless artistry into modern homes.
                        </p>
                    </div>

                    <div className="w-full lg:w-auto lg:flex-[0_1_58%]">
                        <div className="flex flex-col gap-10 text-left md:flex-row md:flex-wrap md:justify-between md:gap-8 lg:flex-nowrap lg:justify-end">
                            <div className="min-w-[220px]">
                                <h4 className="font-sans text-sm mb-4 tracking-wider">Store:</h4>
                                <p className="font-bold text-base mb-2">Kauthuk</p>
                                <p className="leading-relaxed">16/362, 1st Floor, Nedumparambu Plaza,</p>
                                <p className="leading-relaxed">Kundanoor Junction, Maradu, Ernakulam,</p>
                                <p className="leading-relaxed">Kerala -682304 Ph: 91 8075727191,</p>
                                <p className="leading-relaxed">Email: info@kauthuk.com | www.kauthuk.com</p>
                            </div>

                            <div className="min-w-[150px]">
                                <h4 className="font-sans text-sm mb-4 tracking-wider">Find us on :</h4>
                                <a
                                    href="https://www.amazon.in/l/27943762031?me=A1VHBUG3SKU8C4&tag=ShopReferral_03484250-56c3-4012-a63c-e1f285c41ced&ref=sf_seller_app_share_new_ls_srb"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-white text-black px-6 py-1.5 inline-block font-bold rounded-sm text-xl tracking-tighter"
                                >
                                    amazon
                                </a>
                            </div>

                            <div className="min-w-[150px]">
                                <h4 className="font-sans text-sm mb-4 tracking-wider">Connect with us:</h4>
                                <a
                                    href="https://www.instagram.com/kauthuk/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-700 shadow-md"
                                >
                                    <div className="w-full h-full border-2 border-transparent text-white flex items-center justify-center rounded-xl p-1 relative">
                                        <div className="w-full h-full border-[2.5px] border-white rounded-lg flex items-center justify-center">
                                            <div className="w-4 h-4 border-[2.5px] border-white rounded-full"></div>
                                            <div className="w-1 h-1 bg-white rounded-full absolute top-2.5 right-2.5"></div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
