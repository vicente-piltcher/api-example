import bcrypt from 'bcrypt';

export async function genericHashPassword(password: string, hashSeed: number): Promise<string> {
    return await bcrypt.hash(password, hashSeed || 10);
}

export async function genericIsValidPassword(userPassword: string, informedPassword: string): Promise<boolean> {
    return await bcrypt.compare(userPassword, informedPassword);
}