<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $users = User::with('roles')
            ->latest()
            ->paginate(10);

        return Inertia::render('Products/Category', [
            'users' => $users
        ]);
    }
} 