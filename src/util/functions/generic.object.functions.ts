/**
 * Remove propriedades com valores nulos ou indefinidos de um objeto.
 * @param dataObject - O objeto a ser limpo.
 * @returns Um novo objeto sem as propriedades nulas ou indefinidas.
 */
export function cleanDataObject<T extends Record<string, any>>(dataObject: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(dataObject).filter(([_, value]) => value !== null && value !== undefined)
    ) as Partial<T>;
}