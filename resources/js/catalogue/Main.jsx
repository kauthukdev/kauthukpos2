import { useEffect, useState } from 'react';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Sidebar from './components/Sidebar';

export default function Main() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [search, setSearch] = useState('');

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

    return (
        <div className="min-h-screen bg-brand-bg text-brand-brown font-sans flex flex-col">
            <Header
               categories={categories}
               search={search}
               setSearch={setSearch}
               selectedCategory={selectedCategory}
               setSelectedCategory={setSelectedCategory}
            />

            <div className="max-w-7xl mx-auto px-8 w-full py-8 flex gap-16 flex-1">
                <Sidebar
                   categories={categories}
                   selectedCategory={selectedCategory}
                   setSelectedCategory={setSelectedCategory}
                />

                <main className="flex-1 w-full max-w-4xl pt-2">
                    <ProductList category={selectedCategory} search={search} />
                </main>
            </div>

            <footer className="bg-brand-brown text-white py-12 px-8 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 text-xs opacity-90">
                    <div className="flex-1">
                        <h4 className="font-sans text-sm mb-4 tracking-wider">Store:</h4>
                        <p className="font-bold text-base mb-2">Kauthuk</p>
                        <p className="leading-relaxed">16/362, 1st Floor, Nedumparambu Plaza,</p>
                        <p className="leading-relaxed">Kundanoor Junction, Maradu, Ernakulam,</p>
                        <p className="leading-relaxed">Kerala -682304 Ph: 91 8075727191,</p>
                        <p className="leading-relaxed">Email: info@kauthuk.com | www.kauthuk.com</p>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="text-center">
                            <h4 className="font-sans text-sm mb-4 tracking-wider">Find us on :</h4>
                            <div className="bg-white text-black px-6 py-1.5 inline-block font-bold rounded-sm text-xl tracking-tighter">
                                amazon
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center lg:justify-end">
                        <div className="flex flex-col items-center lg:items-center text-center">
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
            </footer>
        </div>
    );
}
