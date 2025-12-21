<?php

declare(strict_types=1);

namespace App\Http\Requests\Register;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'unique:users,email', 'max:50'],
            'phone_number' => ['required', 'string', 'regex:/^\+998[0-9]{9}$/', 'unique:users,phone_number'],
            'password' => ['required', 'string', 'min:8']
        ];
    }
}
