export class GenerateCodeUtil {
  create(): string {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = '';

    codigo = Array.from(
      { length: 6 },
      () => caracteres[Math.floor(Math.random() * caracteres.length)],
    ).join('');

    return codigo;
  }

  async validateTokenTimeIsValid(tokenCode: string, token_created_at: Date) {
    if (tokenCode && token_created_at instanceof Date) {
      const diff = new Date().getTime() - token_created_at.getTime();

      const differenceInMinutes = Math.round(diff / 60000);

      if (differenceInMinutes < 30) {
        // reenviar email

        return {
          message: 'Email reenviado com sucesso',
        };
      }
    }
  }
}
