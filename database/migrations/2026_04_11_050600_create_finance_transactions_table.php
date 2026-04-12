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
        Schema::create('finance_transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['IN', 'OUT'])->index();
            $table->enum('category', ['CAPITAL', 'ORDER_PAYMENT', 'MATERIAL_PURCHASE', 'OPERATIONAL', 'SALARY', 'OTHER'])->index();
            $table->enum('payment_method', ['CASH', 'TRANSFER_MANDIRI', 'TRANSFER_BCA', 'CHEQUE', 'GIRO'])->index();
            $table->enum('status', ['SUCCESS', 'PENDING', 'REJECTED'])->default('SUCCESS')->index();
            $table->bigInteger('amount');
            $table->date('transaction_date')->useCurrent();
            $table->date('maturity_date')->nullable();
            $table->string('reference_number')->nullable()->index();
            $table->string('source')->nullable(); // For Capital source or client bank info
            $table->text('notes')->nullable();
            $table->string('referenceable_type')->nullable();
            $table->unsignedBigInteger('referenceable_id')->nullable();
            $table->index(['referenceable_type', 'referenceable_id']);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finance_transactions');
    }
};
