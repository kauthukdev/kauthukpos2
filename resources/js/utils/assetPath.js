export function toPublicPath(path) {
    if (!path) {
        return null;
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const baseUrl = window.appConfig?.baseUrl ?? window.catalogueConfig?.baseUrl ?? '';

    return `${baseUrl}${normalizedPath}`;
}
