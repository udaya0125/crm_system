<?php

namespace App\Http\Controllers;

use App\Models\SubCategory;
use Illuminate\Http\Request;

class SubCategoryController extends Controller
{
    //
        /**
     * Display all sub categories
     */
    public function index()
    {
        $subCategories = SubCategory::with('category')->latest()->get();

        return response()->json([
            'status' => true,
            'data' => $subCategories,
        ]);
    }

    /**
     * Store new sub category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $subCategory = SubCategory::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Sub Category created successfully',
            'data' => $subCategory,
        ], 201);
    }

    /**
     * Update sub category
     */
    public function update(Request $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
        ]);

        $subCategory->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Sub Category updated successfully',
            'data' => $subCategory,
        ]);
    }

    /**
     * Delete sub category
     */
    public function destroy($id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $subCategory->delete();

        return response()->json([
            'status' => true,
            'message' => 'Sub Category deleted successfully',
        ]);
    }
}
