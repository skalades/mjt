<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Mold;
use Inertia\Inertia;
use Inertia\Response;

class MoldController extends Controller
{
    public function index(): Response
    {
        $molds = Mold::latest()->paginate(10);

        return Inertia::render('Molds/Index', [
            'molds' => $molds,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'mold_code' => 'required|string|unique:molds',
            'client_name' => 'nullable|string',
            'location' => 'nullable|string',
            'status' => 'required|in:ACTIVE,MAINTENANCE,RETIRED',
        ]);

        Mold::create($validated);

        return redirect()->route('molds.index')->with('success', 'Cetakan berhasil ditambahkan.');
    }

    public function update(Request $request, Mold $mold)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'mold_code' => "required|string|unique:molds,mold_code,{$mold->id}",
            'client_name' => 'nullable|string',
            'location' => 'nullable|string',
            'status' => 'required|in:ACTIVE,MAINTENANCE,RETIRED',
        ]);

        $mold->update($validated);

        return redirect()->route('molds.index')->with('success', 'Cetakan berhasil diperbarui.');
    }

    public function destroy(Mold $mold)
    {
        $mold->delete();

        return redirect()->route('molds.index')->with('success', 'Cetakan berhasil dihapus.');
    }
}
