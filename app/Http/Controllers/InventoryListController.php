<?php

namespace App\Http\Controllers;

use App\Models\InventoryList;
use App\Models\Country;
use App\Models\State;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryListController extends Controller
{
    /**
     * Display a listing of inventory lists.
     */
    public function index()
    {
        $inventoryLists = InventoryList::with(['country', 'state'])->latest()->paginate(15);

        return Inertia::render('Inventory/Index', [
            'inventoryLists' => $inventoryLists,
        ]);
    }

    /**
     * Show the form for creating a new inventory list.
     */
    public function create()
    {
        return Inertia::render('Inventory/Create', [
            'countries' => Country::orderBy('name')->get(),
            'states' => State::orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created inventory list in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'country_id' => 'nullable|integer',
            'state_id' => 'nullable|integer',
        ]);

        InventoryList::create($validated);

        return redirect()->route('inventory-lists.index')
            ->with('success', 'Inventory list item created successfully.');
    }

    /**
     * Show the form for editing the specified inventory list.
     */
    public function edit(InventoryList $inventoryList)
    {
        return Inertia::render('Inventory/Edit', [
            'inventoryList' => $inventoryList,
            'countries' => Country::orderBy('name')->get(),
            'states' => State::orderBy('name')->get(),
        ]);
    }

    /**
     * Update the specified inventory list in storage.
     */
    public function update(Request $request, InventoryList $inventoryList)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'country_id' => 'nullable|integer',
            'state_id' => 'nullable|integer',
        ]);

        $inventoryList->update($validated);

        return redirect()->route('inventory-lists.index')
            ->with('success', 'Inventory list item updated successfully.');
    }

    /**
     * Remove the specified inventory list from storage.
     */
    public function destroy(InventoryList $inventoryList)
    {
        $inventoryList->delete();

        return redirect()->route('inventory-lists.index')
            ->with('success', 'Inventory list item deleted successfully.');
    }
}
