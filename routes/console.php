<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Schedule expiration checks to run daily at 9:00 AM Nepal Time (Asia/Kathmandu)
Schedule::command('expirations:check')
    ->dailyAt('09:00')
    ->timezone('Asia/Kathmandu');