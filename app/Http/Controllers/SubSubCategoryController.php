<?php

namespace App\Http\Controllers;

use App\Models\SubSubCategory;
use App\Http\Requests\Category\StoreSubSubCategoryRequest;
use App\Http\Requests\Category\UpdateSubSubCategoryRequest;

class SubSubCategoryController extends Controller
{
    public function index()
    {
        $childCategories = SubSubCategory::with('subCategory')
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'data' => $childCategories,
        ]);
    }

    public function store(StoreSubSubCategoryRequest $request)
    {
        $childCategory = SubSubCategory::create(
            $request->validated()
        );

        return response()->json([
            'status' => true,
            'message' => 'Child Category created successfully',
            'data' => $childCategory,
        ], 201);
    }

    public function update(UpdateSubSubCategoryRequest $request, $id)
    {
        $childCategory = SubSubCategory::findOrFail($id);

        $childCategory->update(
            $request->validated()
        );

        return response()->json([
            'status' => true,
            'message' => 'Child Category updated successfully',
            'data' => $childCategory,
        ]);
    }

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