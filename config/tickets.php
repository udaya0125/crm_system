<?php

return [

    'groups' => [
        'Digital Marketing' => [
            'email' => 'online@sait.com.np',
            'items' => [
                'Social Media Promotional Flyer',
                'Social Media Reel',
                'Boost',
                'Branding (Logo, Guideline)',
                'Content Making Shoot',
                'Print Designs',
                'Campaign Designs',
                'Digital Flyer',
                'Digital Issue / Support',
                'QR Making',
                'Social Media Setups',
            ],
        ],

        'Exely' => [
            'email' => 'exely@sait.com.np',
            'items' => [
                'Channel Manager',
                'Booking Engine',
                'New Integration Query',
                'New Integration Issue',
                'Existing Integration Issue',
            ],
        ],

        'Domain and Hosting' => [
            'email' => 'domain@sait.com.np,hosting@sait.com.np',
            'items' => [
                'Domain Registration',
                'Create Hosting',
                'Email Creation',
                'Email / Domain Issue / Support',
                'Renewal and Payment',
                'Outlook Setup',
                'Email Signature Creation / Setup',
            ],
        ],

        'OTA' => [
            'email' => 'ota@sait.com.np',
            'items' => [
                'OTA Access – Login, Account Setup',
                'Bookings – Reservations, Changes, Cancellations',
                'Rates & Inventory',
                'Payments & Billing',
                'Property Content',
                'Promotions & Visibility',
                'Integrations – Channel Manager',
                'Website Bookings',
                'Technical Support',
                'Disputes & Chargebacks',
                'Google Business Profile',
                'Tripadvisor',
                'OTA Training',
                'Other OTA Inquiries',
            ],
        ],

        'Sales and Marketing' => [
            'email' => 'sales@sait.com.np',
            'items' => [
                'Invoice',
                'Payment and Billing',
                'Proposal and Agreement',
                'Quotation',
            ],
        ],

        'Website Development' => [
            'email' => 'saitsolutionwebteam@gmail.com',
            'items' => [
                'Add New Feature',
                'Content Updates / Management',
                'Issue and Debugging',
                'Layout / Design',
                'System Training',
                'System Updates / Upgrades',
                'Technical Support',
            ],
        ],

        'Repair' => [
            'email' => 'adhikariudaya521@gmail.com',
            'items' => [
                'Printer Repair',
                'Printer Refill',
                'Wifi Problem',
                'Cctv Camera',
                'Computer / Laptop Repair',
                'Intercom',
                'Wire Less Camera Connection',
                'Data Recover',
            ],
        ],

        'Enquiry' => [
            'email' => 'info@sait.com.np',
            'items' => [
                'General Enquiry',
            ],
        ],
    ],

    'fallback_email' => env('ADMIN_EMAIL'),

];