<?php

declare(strict_types=1);

namespace App\Http\Requests\Image;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

final class StoreImageRequest extends FormRequest
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
            'file' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'], // 5MB max
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'file.required' => 'An image file is required.',
            'file.image' => 'The file must be an image.',
            'file.mimes' => 'The image must be a JPEG, PNG, JPG, GIF, or WebP file.',
            'file.max' => 'The image must not exceed 5MB.',
        ];
    }
}
