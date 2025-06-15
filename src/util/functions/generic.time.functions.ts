export function convertExpiresInToMilliseconds(expiresIn: string): number {
    const timeValue = parseInt(expiresIn.slice(0, -1), 10);
    const timeUnit = expiresIn.slice(-1);

    switch (timeUnit) {
        case 's':
            return timeValue * 1000; // segundos para milissegundos
        case 'm':
            return timeValue * 60 * 1000; // minutos para milissegundos
        case 'h':
            return timeValue * 60 * 60 * 1000; // horas para milissegundos
        case 'd':
            return timeValue * 24 * 60 * 60 * 1000; // dias para milissegundos
        default:
            throw new Error(`Invalid time unit: ${timeUnit}`);
    }
}