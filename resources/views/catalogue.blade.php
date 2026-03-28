<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Kauthuk Product Catalogue</title>
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=playfair-display:400,600,700|figtree:400,500,600,700&display=swap" rel="stylesheet" />
        @viteReactRefresh
        @vite('resources/js/catalogue/app.jsx')
    </head>
    <body class="antialiased">
        <script>
            const baseUrl = @json(request()->getBaseUrl());
            window.catalogueConfig = {
                baseUrl,
                endpoints: {
                    categories: @json(route('api.catalogue.categories')),
                    products: @json(route('api.catalogue.products')),
                },
                logoUrl: `${baseUrl}/kauthuk-logo.png`.replace('//kauthuk-logo.png', '/kauthuk-logo.png'),
            };
        </script>
        <div id="catalogue-app"></div>
    </body>
</html>
