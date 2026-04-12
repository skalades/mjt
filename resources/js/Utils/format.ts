/**
 * Format number to Indonesian Rupiah (standard appearance)
 * Result: Rp 1.250.000
 */
export const toIDR = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount).replace(/\s/g, ' ');
};

/**
 * Alternative standard format (without decimals)
 * Result: Rp 1.250.000
 */
export const formatIDR = (amount: number): string => {
    return toIDR(amount);
};
/**
 * Format string/date to Indonesian standard
 * Result: 6 April 2026
 */
export const formatDate = (dateString: string | Date | null): string => {
    if (!dateString) return 'N/A';
    
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
};
