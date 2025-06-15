/**
 * Converte uma string de data no formato DD/MM/YYYY para um objeto Date.
 * @param dateString - A string de data no formato DD/MM/YYYY.
 * @returns Um objeto Date correspondente à string de data.
 */
export function convertStringToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}

/**
 * Testa se uma string representando uma data está no formato esperado
 * @param dateString 
 * @param format 
 * @returns 
 */
export function isValidDateFormat(dateString: string, format: string): boolean {
    const formatParts = format.split(/[^A-Za-z]/);
    const dateParts = dateString.split(/[^0-9]/);

    if (formatParts.length !== dateParts.length) {
        return false;
    }

    const formatRegexMap: { [key: string]: string } = {
        'DD': '\\d{2}',
        'MM': '\\d{2}',
        'YYYY': '\\d{4}',
        'YY': '\\d{2}',
        'D': '\\d{1,2}',
        'M': '\\d{1,2}',
        'Y': '\\d{1,4}'
    };

    const regexParts = formatParts.map(part => formatRegexMap[part] || part);
    const regex = new RegExp(`^${regexParts.join('[^0-9]')}$`);

    return regex.test(dateString);
}