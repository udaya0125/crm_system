<?php

namespace App\Services;

use App\Models\Password;
use Illuminate\Support\Facades\Storage;

class PasswordService
{
    public function getAll()
    {
        $passwords = Password::with([
            'organization',
            'category',
            'sub_category',
            'sub_sub_category',
        ])->latest()->get();

        $passwords->transform(function ($item) {
            try {
                $item->password = $item->password
                    ? decrypt($item->password)
                    : null;
            } catch (\Exception $e) {
                $item->password = null;
            }

            return $item;
        });

        return $passwords;
    }

    public function create(array $data): Password
    {
        $imagePath = null;

        if (isset($data['image'])) {
            $imagePath = $data['image']->store('passwords', 'public');
        }

        return Password::create([
            'organization_id'     => $data['organization_id'],
            'category_id'         => $data['category_id'],
            'sub_category_id'     => $data['sub_category_id'] ?? null,
            'sub_sub_category_id' => $data['sub_sub_category_id'] ?? null,
            'username'            => $data['username'],
            'password'            => encrypt($data['password']),
            'expirydate'          => $data['expirydate'] ?? null,
            'note'                => $data['note'] ?? null,
            'image'               => $imagePath,
        ]);
    }

    public function update(Password $password, array $data): Password
    {
        $imagePath = $password->image;

        if (isset($data['image'])) {

            if (
                $password->image &&
                Storage::disk('public')->exists($password->image)
            ) {
                Storage::disk('public')->delete($password->image);
            }

            $imagePath = $data['image']->store('passwords', 'public');
        }

        $password->update([
            'organization_id'     => $data['organization_id'],
            'category_id'         => $data['category_id'],
            'sub_category_id'     => $data['sub_category_id'] ?? null,
            'sub_sub_category_id' => $data['sub_sub_category_id'] ?? null,
            'username'            => $data['username'],
            'password'            => encrypt($data['password']),
            'expirydate'          => $data['expirydate'] ?? null,
            'note'                => $data['note'] ?? null,
            'image'               => $imagePath,
        ]);

        return $password->fresh([
            'organization',
            'category',
            'sub_category',
            'sub_sub_category',
        ]);
    }

    public function delete(Password $password): bool
    {
        if (
            $password->image &&
            Storage::disk('public')->exists($password->image)
        ) {
            Storage::disk('public')->delete($password->image);
        }

        return $password->delete();
    }
}