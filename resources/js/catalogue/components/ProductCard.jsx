import { useMemo, useState } from 'react';

function ChevronLeftIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}

function ShoppingCartIcon({ className = '' }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
            <circle cx="9" cy="20" r="1" />
            <circle cx="20" cy="20" r="1" />
            <path d="M1 1h4l2.68 11.39a2 2 0 0 0 2 1.61h7.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
    );
}

function PlaceholderImage({ title }) {
    return (
        <div className="catalogue-image-frame catalogue-image-surface">
            <div className="flex h-full w-full items-center justify-center text-center text-sm text-brand-brown/60">
                <div>
                    <p className="mb-2 font-semibold uppercase tracking-[0.2em]">No Image</p>
                    <p>{title}</p>
                </div>
            </div>
        </div>
    );
}

export default function ProductCard({ product }) {
    const images = useMemo(() => {
        if (Array.isArray(product.images) && product.images.length > 0) {
            return product.images.map((image) => image.url).filter(Boolean);
        }

        if (product.image_url) {
            return [product.image_url];
        }

        return ['https://via.placeholder.com/600x400?text=Product+Image'];
    }, [product.image_url, product.images]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imageSrc = images[currentImageIndex] || images[0];
    const enquiryMessage = product.product_code
        ? `Hi, I want to enquire about ${product.title} (${product.product_code}).`
        : `Hi, I want to enquire about ${product.title}.`;
    const whatsappLink = `https://wa.me/919497363831?text=${encodeURIComponent(enquiryMessage)}`;

    const showPreviousImage = () => {
        setCurrentImageIndex((currentIndex) => (currentIndex === 0 ? images.length - 1 : currentIndex - 1));
    };

    const showNextImage = () => {
        setCurrentImageIndex((currentIndex) => (currentIndex === images.length - 1 ? 0 : currentIndex + 1));
    };

    return (
        <div className="flex flex-col mb-16 border-b border-brand-brown/10 pb-12 w-full">
            <h3 className="font-serif text-3xl text-brand-brown mb-6 pr-4 leading-tight">{product.title}</h3>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                <div className="lg:w-1/2 relative flex items-center justify-center p-4">
                    <button
                        type="button"
                        onClick={showPreviousImage}
                        className="absolute left-0 p-2 text-brand-brown hover:text-brand-red font-bold transition-colors"
                    >
                        <ChevronLeftIcon className="w-8 h-8" />
                    </button>
                    {imageSrc.includes('via.placeholder.com') ? (
                        <PlaceholderImage title={product.title} />
                    ) : (
                        <div className="catalogue-image-frame catalogue-image-surface">
                            <img
                                src={imageSrc}
                                alt={product.title}
                                className="catalogue-image-element"
                            />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={showNextImage}
                        className="absolute right-0 p-2 text-brand-brown hover:text-brand-red font-bold transition-colors"
                    >
                        <ChevronRightIcon className="w-8 h-8" />
                    </button>

                    <div className="absolute -bottom-6 flex space-x-2">
                        {images.map((_, index) => (
                            <span
                                key={`${product.id}-dot-${index}`}
                                className={`w-2.5 h-2.5 rounded-full ${
                                    index === currentImageIndex ? 'bg-brand-gold' : 'bg-brand-brown/30'
                                }`}
                            ></span>
                        ))}
                    </div>
                </div>

                <div className="lg:w-1/2 flex flex-col justify-center font-sans">
                    <div className="py-1">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-[2.5rem] tracking-tight text-brand-brown">
                                ₹{Math.round(product.selling_price || product.price || 0)}
                            </span>
                        </div>
                        <p className="text-brand-brown/80 opacity-80">(inclusive of taxes)</p>
                    </div>

                    <div>
                        <span className={product.stock_count > 0 ? 'text-green-700' : 'text-red-700 font-bold'}>
                            {product.stock_count > 0 ? (
                                <span>
                                    In Stock: <span className="text-black">{product.stock_count} pcs.</span>
                                </span>
                            ) : (
                                'Sold Out'
                            )}
                        </span>
                    </div>

                    <div className="space-y-4 pt-2">
                        <button className="bg-brand-red hover:bg-[#852a23] text-white px-8 py-3 flex items-center w-max font-bold tracking-wide transition-colors shadow-sm rounded-sm">
                            <ShoppingCartIcon className="w-5 h-5 mr-3" /> Shop Online
                        </button>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-gold hover:text-yellow-700 font-bold uppercase tracking-widest text-xs flex items-center pt-2 transition-colors"
                        >
                            SEND ENQUIRY <ChevronRightIcon className="w-3 h-3 ml-1" />
                            <svg className="w-4 h-4 text-green-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.488-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
