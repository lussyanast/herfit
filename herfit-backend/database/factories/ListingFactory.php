<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Listing>
 */
class ListingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'items_name' => ucwords(join(' ', fake()->words(2))),
            'description' => fake()->paragraph(5),
            'price' => fake()->numberBetween(1, 10)
        ];
    }
}
