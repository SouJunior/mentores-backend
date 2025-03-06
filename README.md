# mentores-backend

Projeto Opensource que visa melhorar o match entre Mentores e Juniors.

## Observação:

>Antes de iniciar a instalação, lembre-se de fazer um fork do repositório oficial e realizar as alterações no repositório "forkado" enviando modificações através de Pull Requests. Nunca modifique diretamente o repositório oficial.


Clone o projeto:

```bash
  git clone https://github.com/{SEU USUARIO}/mentores-backend.git
```

Entre no diretório do projeto:

```bash
  cd mentores-backend/
```

Instale as dependências:

```bash
  npm install
```

## Rodando localmente

- Verifique se esta com o docker instalado e aberto

Dentro da pasta mentores-backend, rode o seguinte comando:

```bash
docker-compose up -d
```

com o banco de dados rodando localmente, só precisa pegar as variaveis .env com alguem do projeto.

## Como utilizar o mailtrap.

Entre no [Mailtrap](https://mailtrap.io) e crie uma conta, com a conta criada vá em email Testing e clique em my inbox:

![image](https://github.com/wendesongomes/mentores-backend/assets/82889172/f966d27c-6a13-4a7a-90c9-3b3a37500ae8)

Veja a parte de Integration e clique em Show Credentials, vai precisar do Host, Port, Username e Password.

![image](https://github.com/wendesongomes/mentores-backend/assets/82889172/efcbb466-69d9-4264-8553-4b73bfa13eb4)
![image](https://github.com/wendesongomes/mentores-backend/assets/82889172/c6b59518-f9a7-40d7-817e-d3c429e12fbe)

Agora só utilizar o:

```bash
npm run dev
```

### Mailtrap não capturou o email

Caso você tenha feito isso tudo e não recebeu o email no mailtrap faça o seguinte, Na pasta do mentores-backend vá em:

src/modules/mails/mail.module.ts

dentro dela tem um: 

```bash
secure: true,
```

![image](https://github.com/wendesongomes/mentores-backend/assets/82889172/0386598d-5053-4189-9e9b-e7d1a4ef1655)


troque para false, com isso o mailtrap vai capturar seus emails normalmente.

## DevOps

> [!WARNING]
> GitHub workflow de CI sendo executado ao fazer push para main, duplicando validação que foi feita na PR antes do merge

> [!TIP]
> Atualizar "Docker Image CI" workflow, removendo "on: push: branches: [main]"

```mermaid
sequenceDiagram
    actor Dev as Desenvolvedores
    participant Git as GitHub
    participant Actions as GitHub Actions
    participant ECR as AWS ECR

    Dev->>Git: Abre Pull Request (PR) para main
    Git->>Actions: Novo Evento: PR criada
    Actions-->>Git: Cria imagem Docker
    
    Note over Dev,ECR: Loop de desenvolvimento
    
    Dev->>Git: Aprova e mergeia PR para main
    Git->>Actions: Novo Evento: Branch main atualizada
    activate Actions
    par "Docker Image CI" workflow
        Actions-->>Git: Cria imagem Docker
    and "Docker Image CI for AWS" workflow
        Actions->>Actions: Cria imagem Docker
        Actions->>ECR: Atualiza imagem Docker em AWS ECR
        ECR-->>Actions: Imagem Docker atualizada em AWS ECR
        Actions-->>Git: Deploy de Produção atualizado
    end
    deactivate Actions
```
