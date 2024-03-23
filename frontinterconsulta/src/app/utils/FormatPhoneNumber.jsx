export const FormatPhoneNumber = (input) => {
    // Remove todos os caracteres não numéricos
    let cleaned = input.replace(/\D/g, '');

    // Formata o número
    let formatted = '';

    if (cleaned.length > 2) {
        formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(2)}`;
    } else {
        formatted = cleaned;
    }

    return formatted;
}
