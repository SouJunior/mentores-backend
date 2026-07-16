
# ✨ Criando uma Nova Funcionalidade

Este guia descreve o passo a passo para adicionar uma nova funcionalidade no back-end do **Portal de Mentorias** usando **NestJS + Prisma**.

---

## 🔖 1. Planejamento

- Leia a issue relacionada com atenção.
- Identifique as entidades envolvidas.
- Planeje os endpoints, parâmetros e retornos esperados.
- Se necessário, escreva um esquema de resposta para Swagger e testes.

---

## 🧱 2. Estrutura de Código

### 1. **Crie ou atualize o módulo adequado:**

```bash
nest g module mentorship
nest g service mentorship
nest g controller mentorship
```

Você pode também criar tudo manualmente se preferir e se quiser fixar o passo a passo da criação de um módulo.

### 🧾 3. Crie os DTOs para validação

Crie os DTOs dentro da pasta `dto/` do módulo correspondente:

```ts
// src/mentorship/dto/create-mentorship.dto.ts
import { IsString, IsDateString } from 'class-validator';

export class CreateMentorshipDto {
  @IsString()
  title: string;

  @IsDateString()
  date: string;
}
```

Utilize validações do `class-validator` e transforme com `class-transformer` se necessário.

---

### ⚙️ 4. Implemente a lógica no Service

Aplique as regras de negócio e persistência no Service. Exemplo básico:

```ts
// src/mentorship/mentorship.service.ts
@Injectable()
export class MentorshipService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMentorshipDto) {
    return this.prisma.mentorship.create({ data });
  }
}
```

Lide com erros de forma clara e consistente (ex: `NotFoundException`, `BadRequestException`, etc).

---

### 🌐 5. Implemente os endpoints no Controller

Crie os endpoints RESTful no controller com os decorators do Nest:

```ts
// src/mentorship/mentorship.controller.ts
@ApiTags('Mentorship')
@Controller('mentorship')
export class MentorshipController {
  constructor(private readonly service: MentorshipService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova mentoria' })
  @ApiResponse({ status: 201, description: 'Mentoria criada com sucesso' })
  create(@Body() dto: CreateMentorshipDto) {
    return this.service.create(dto);
  }
}
```

---

### 🧪 6. Testes

Crie testes unitários com Jest para o service e o controller.  
Use mocks para o Prisma Client.  
Teste casos de sucesso e erro.

```ts
// mentorship.service.spec.ts
describe('MentorshipService', () => {
  let service: MentorshipService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = new PrismaService();
    service = new MentorshipService(prisma);
  });

  it('deve criar uma nova mentoria', async () => {
    const dto = { title: 'Mentoria de Teste', date: '2025-04-01T12:00:00Z' };
    const expected = { id: 1, ...dto };

    prisma.mentorship.create = jest.fn().mockResolvedValue(expected);

    const result = await service.create(dto);
    expect(result).toEqual(expected);
  });
});
```

---

### 🧰 7. Atualização do Banco de Dados (se necessário)

Atualize o arquivo `prisma/schema.prisma` com os novos modelos ou campos.

Gere e aplique a migração:

```bash
npx prisma migrate dev --name nova-funcionalidade
```

Verifique se o banco foi alterado corretamente:

```bash
npx prisma studio
```

---

### 📚 8. Atualização da Documentação (Swagger)

Certifique-se de que todos os endpoints estejam decorados com:

```ts
@ApiOperation()
@ApiResponse()
@ApiTags()
```

Acesse `/api` no navegador para validar visualmente a documentação gerada.

---

### ✅ 9. Checklist antes de criar o PR

- [ ] Código limpo, modular e documentado.
- [ ] DTOs com validações completas.
- [ ] Service com regras claras e reutilizáveis.
- [ ] Controller com Swagger configurado.
- [ ] Testes escritos e passando.
- [ ] Migrations aplicadas e commitadas.
- [ ] Teste manual realizado via Swagger/Postman.
- [ ] PR vinculado a uma issue.

---

### 🧠 10. Dicas extras

- Evite lógica de negócio no controller.
- Reaproveite serviços e utilitários quando possível.
- Prefira clareza a complexidade desnecessária.
- Revise seus commits antes de abrir o PR.
- Leia os comentários da PR anterior e evolua com base neles.
- Faça PRs de escopos bem definidos, ou seja, PRs com o mínimo possível de alterações, de preferência com apenas uma única funcionalidade nova, ou uma única correção ou melhoria.

---

### 11. Boas praticas de commits, PRs e agentes

- Faca commits pequenos e com responsabilidade unica.
- Evite misturar feature, refatoracao, documentacao e ajustes sem relacao no mesmo commit.
- Antes de abrir PR, revise os arquivos alterados e remova logs, codigo morto e comentarios temporarios.
- Caso use agentes como apoio, mantenha `AGENTS.md` e arquivos locais de agentes no `.gitignore`.
- Nao versione prompts, logs, configuracoes pessoais ou arquivos especificos de agentes.
- Use agentes como apoio, sem depender totalmente deles.
- Estude continuamente as linguagens, frameworks e bibliotecas usadas no projeto.
- Entenda, revise e valide cada alteracao antes de commitar.
- Rejeite qualquer sugestao que quebre arquitetura, contratos, seguranca ou padroes existentes.

Leia tambem `docs/BOAS_PRATICAS_GIT.md`.

---
