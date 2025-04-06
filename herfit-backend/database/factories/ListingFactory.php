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
            'listing_name' => ucwords(join(' ', fake()->words(2))),
            'category' => fake()->randomElement(['Membership', 'Lainnya']),
            'description' => fake()->paragraph(5),
            'max_person' => fake()->numberBetween(1, 10),
            'price' => fake()->numberBetween(1, 10)
        ];
    }
}
