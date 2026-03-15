<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
    
        // Register the CheckUserRole middleware with an alias
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckUserRole::class,
        ]);
    })
 /*    ->withMiddleware(function (Middleware $middleware){
        $middleware->web(append : [
            \App\Http\Middleware\CheckUserRole::class
        ])
    }) */
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function (Symfony\Component\HttpFoundation\Response $response) {
            if ($response->getStatusCode() === 419) {
                return back()->with([
                    'message' => 'The page expired, please try again.',
                ]);
            }
 
            return $response;
        });

        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            $statusCode = 500;

            if ($e instanceof \Symfony\Component\HttpKernel\Exception\HttpExceptionInterface) {
                $statusCode = $e->getStatusCode();
            } elseif ($e instanceof \Illuminate\Auth\Access\AuthorizationException) {
                $statusCode = 403;
            }

            if (in_array($statusCode, [500, 503, 404, 403])) {
                 return \Inertia\Inertia::render('Error', [
                     'status' => $statusCode,
                     'message' => $e->getMessage(),
                 ])
                    ->toResponse($request)
                    ->setStatusCode($statusCode);
            }
            
            return null;
        });
    })->create();
