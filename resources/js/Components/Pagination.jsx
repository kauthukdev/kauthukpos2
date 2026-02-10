import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    // Don't render pagination if there's only 1 page
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="flex flex-wrap justify-center mt-6">
            <div className="flex items-center">
                {links.map((link, key) => {
                    // Skip the "Next" and "Previous" links if they are disabled
                    if ((link.label === '&laquo; Previous' || link.label === 'Next &raquo;') && link.url === null) {
                        return null;
                    }

                    // Determine the appropriate styling based on whether the link is active or not
                    const className = link.active
                        ? 'mr-1 mb-1 px-4 py-2 text-sm leading-4 border rounded bg-blue-600 text-white focus:border-primary focus:text-primary'
                        : 'mr-1 mb-1 px-4 py-2 text-sm leading-4 border rounded hover:bg-gray-100 focus:border-primary focus:text-primary';

                    // For "Next" and "Previous" links, use the raw label
                    const label = link.label.includes('Previous')
                        ? '«'
                        : link.label.includes('Next')
                        ? '»'
                        : link.label;

                    return link.url === null ? (
                        <span
                            key={key}
                            className="mr-1 mb-1 px-4 py-2 text-sm leading-4 text-gray-400 border rounded"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    ) : (
                        <Link
                            key={key}
                            className={className}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                })}
            </div>
        </div>
    );
} 