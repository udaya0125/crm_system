<?php

namespace App\Http\Controllers;

use App\Http\Requests\Category\StoreSubCategoryRequest;
use App\Http\Requests\Category\UpdateSubCategoryRequest;
use App\Models\SubCategory;

class SubCategoryController extends Controller
{
    public function index()
    {
        $subCategories = SubCategory::with('category')->latest()->get();

        return response()->json([
            'status' => true,
            'data' => $subCategories,
        ]);
    }

    public function store(StoreSubCategoryRequest $request)
    {
        $subCategory = SubCategory::create($request->validated());

        return response()->json([
            'status' => true,
            'message' => 'Sub Category created successfully',
            'data' => $subCategory,
        ], 201);
    }

    public function update(UpdateSubCategoryRequest $request, $id)
    {
        $subCategory = SubCategory::findOrFail($id);

        $subCategory->update($request->validated());

        return response()->json([
            'status' => true,
            'message' => 'Sub Category updated successfully',
            'data' => $subCategory,
        ]);
    }

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