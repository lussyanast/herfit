<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'public-file/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'https://herfit.vercel.app',
        'https://herfit-ladiesgym.my.id',
    ],

    'exposed_headers' => ['Authorization'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'max_age' => 0,

    'supports_credentials' => true,

];