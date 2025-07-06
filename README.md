# AppMenu Backend

## Sobre

Este é o backend da aplicação AppMenu, responsável por gerenciar pedidos,
integrar com o banco MongoDB e servir a API para o frontend.

## Links Importantes

- Repositório GitHub: https://github.com/julianofsz/appmenu-backend
- Imagem Docker Hub: https://hub.docker.com/r/julianofsz/appmenu-backend

## Como rodar localmente

### Pré-requisitos

- Node.js (versão 18+)
- MongoDB (rodando localmente ou via Docker)
- Docker (opcional)

### Rodando com Docker

```bash
docker pull seu-usuario/appmenu-backend:latest
docker run -p 5000:5000 seu-usuario/appmenu-backend:latest
```

### Rodando localmente (sem Docker)

```bash
npm install
npm run start
```

## Variáveis de ambiente

- `MONGO_URI`: string de conexão com MongoDB
- `PORT`: porta que o backend irá rodar (padrão: 5000)

## GitHub Actions

Este repositório possui um workflow configurado para:

- Buildar a imagem Docker a cada push na branch `main`
- Enviar a imagem para o Docker Hub automaticamente

## Observações

- Certifique-se de que o MongoDB esteja acessível via `MONGO_URI` configurada.
