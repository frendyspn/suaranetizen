<?php

// Tambahkan di routes/web.php untuk debugging di shared hosting

Route::get('/debug-info', function () {
    return [
        'app_env' => config('app.env'),
        'app_debug' => config('app.debug'),
        'app_url' => config('app.url'),
        'routes_cached' => app()->routesAreCached(),
        'config_cached' => app()->configurationIsCached(),
        'php_version' => PHP_VERSION,
        'laravel_version' => app()->version(),
        'public_path' => public_path(),
        'base_path' => base_path(),
        'storage_path' => storage_path(),
        'current_url' => request()->url(),
        'server_name' => $_SERVER['SERVER_NAME'] ?? 'N/A',
        'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'N/A',
        'request_uri' => $_SERVER['REQUEST_URI'] ?? 'N/A',
    ];
});

Route::get('/test-sponsors', function () {
    try {
        // Test database connection
        $sponsors = \App\Models\Sponsor::all();
        return [
            'status' => 'success',
            'sponsors_count' => $sponsors->count(),
            'sponsors' => $sponsors,
            'db_connection' => 'OK'
        ];
    } catch (\Exception $e) {
        return [
            'status' => 'error',
            'message' => $e->getMessage(),
            'db_connection' => 'FAILED'
        ];
    }
});

Route::get('/test-api-routes', function () {
    $routes = [];
    foreach (Route::getRoutes() as $route) {
        if (str_contains($route->uri(), 'api/')) {
            $routes[] = [
                'method' => implode('|', $route->methods()),
                'uri' => $route->uri(),
                'name' => $route->getName(),
                'action' => $route->getActionName()
            ];
        }
    }
    return $routes;
});
