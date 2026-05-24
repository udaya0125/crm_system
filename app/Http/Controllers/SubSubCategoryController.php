<?php

namespace App\Http\Controllers;

use App\Models\SubSubCategory;
use Illuminate\Http\Request;

class SubSubCategoryController extends Controller
{
    //
        /**
     * Display all child categories
     */
    public function index()
    {
        $childCategories = SubSubCategory::with('subCategory')->latest()->get();

        return response()->json([
            'status' => true,
            'data' => $childCategories,
        ]);
    }

    /**
     * Store new child category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sub_category_id' => 'required|exists:sub_categories,id',
        ]);

        $childCategory = SubSubCategory::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Child Category created successfully',
            'data' => $childCategory,
        ], 201);
    }

    /**
     * Update child category
     */
    public function update(Request $request, $id)
    {
        $childCategory = SubSubCategory::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sub_category_id' => 'required|exists:sub_categories,id',
        ]);

        $childCategory->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Child Category updated successfully',
            'data' => $childCategory,
        ]);
    }

    /**
     * Delete child category
     */
    public function destroy($id)
    {
        $childCategory = SubSubCategory::findOrFail($id);

        $childCategory->delete();

        return response()->json([
            'status' => true,
            'message' => 'Child Category deleted successfully',
        ]);
    }
}
