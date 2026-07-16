# Boas Praticas de Git, Commits e PRs

## Branches

Crie branches com nomes curtos e relacionados a tarefa.

Exemplos:

```bash
feat/criar-endpoint-mentorias
fix/calendly-callback
docs/boas-praticas-git
```

## Commits

Cada commit deve representar uma alteracao de responsabilidade unica.

Bom exemplo:

```bash
git commit -m "fix: corrige validacao do callback do Calendly"
```

Evite commits que misturam muitas coisas:

```bash
git commit -m "feat: ajusta controller, prisma, emails e docs"
```

Se uma tarefa exige varias responsabilidades, separe em commits menores.

## Mensagens de commit

Use mensagens claras, curtas e no imperativo ou presente.

Prefixos recomendados:

- `feat:` para nova funcionalidade.
- `fix:` para correcao de bug.
- `docs:` para documentacao.
- `refactor:` para refatoracao sem mudanca de comportamento.
- `test:` para testes.
- `chore:` para tarefas de manutencao.

## Pull Requests

Um bom PR deve ser facil de revisar.

Antes de abrir:

- Revise os arquivos alterados.
- Remova logs, comentarios temporarios e codigo morto.
- Confirme que nao ha arquivos pessoais ou de agente.
- Rode os comandos de verificacao do projeto.
- Escreva uma descricao objetiva.

## Uso de agentes

O uso de agentes pode acelerar o trabalho, mas a responsabilidade pela entrega continua sendo de quem abre o PR.

Boas praticas:

- Adicione `AGENTS.md` e arquivos locais de agentes ao `.gitignore`.
- Nao versione configuracoes individuais de agente.
- Nao dependa totalmente de sugestoes automaticas.
- Leia e entenda cada alteracao antes de commitar.
- Estude as tecnologias usadas no projeto para conseguir revisar e orientar bem qualquer apoio automatizado.
- Rejeite qualquer sugestao que quebre arquitetura, padroes ou contratos existentes.

O codigo final precisa estar claro, revisado e coerente com o projeto.
