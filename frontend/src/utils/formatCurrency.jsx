function formatCurrency(value) {
    if (!value || isNaN(value)) {
        return "0"; // jika bukan angka, kembalikan 0
    }
    const cleaned = String(value).replace(/\./g, ""); // buang semua titik lama

    const numericValue = parseInt(cleaned, 10); // ubah ke angka
    return String(numericValue).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatCurrencyPrefix(value) {
    if (!value || isNaN(value)) {
        return "0";
    }

    // Bersihkan titik atau string lainnya
    const cleaned = String(value).replace(/\./g, "").replace(/[^0-9]/g, "");
    const numericValue = parseInt(cleaned, 10);

    // Jika jutaan
    if (numericValue >= 1_000_000) {
        return (numericValue / 1_000_000).toFixed(1).replace(".0", "") + "jt";
    }

    // Jika ribuan
    if (numericValue >= 1_000) {
        return (numericValue / 1_000).toFixed(0) + "rb";
    }

    // Jika di bawah 1rb, tampilkan angka asli
    return String(numericValue).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}



export { formatCurrency, formatCurrencyPrefix };

export default formatCurrency;