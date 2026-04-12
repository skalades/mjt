<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('molds', function (Blueprint $table) {
            $table->id();
            $table->string('client_name')->nullable();
            $table->string('name')->index();
            $table->string('mold_code')->unique();
            $table->integer('total_shots')->default(0);
            $table->enum('status', ['ACTIVE', 'MAINTENANCE', 'RETIRED'])->default('ACTIVE');
            $table->string('location')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('molds');
    }
};
