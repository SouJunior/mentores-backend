export default interface IHashAdapter {
    compareHash(data: string, dataHashed: string): Promise<boolean>
    createHash(data: string, salts: number): Promise<string>
}