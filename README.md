# Overclock MRP System

<p align="center">
  <img src="https://raw.githubusercontent.com/username/overclock-mrp/main/public/logo.svg" alt="Overclock MRP Logo" width="200" height="200">
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version 1.0.0"></a>
  <a href="#"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT"></a>
  <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome"></a>
</p>

## 🧠 Visão Geral

O **Overclock MRP** é um sistema moderno de Planejamento de Recursos de Materiais (MRP) voltado para empresas que buscam gerenciar com eficiência peças, fornecedores, compras e pedidos. Ele combina uma interface amigável com uma estrutura robusta, oferecendo controle total sobre os recursos e operações de estoque.

---

## 🚀 Tecnologias Utilizadas

### Frontend
- React
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Java com Spring Boot
- PostgreSQL

### Ferramentas e DevOps
- Git & GitHub
- GitHub Actions (CI/CD)
- Docker

---

## ✨ Funcionalidades

- **Dashboard** com estatísticas em tempo real
- CRUD de Peças, Fornecedores, Compras e Pedidos
- Associação entre Peças e Fornecedores
- Registro e histórico completo de compras e pedidos
- Autenticação de usuários e níveis de acesso
- Tema claro e escuro com preferência salva por usuário

---

## 🛠️ Instalação

### Pré-requisitos
- Node.js v16+
- npm ou yarn
- Git
- Backend em execução (Spring Boot)

### Passos

```bash
# Clone o repositório
git clone https://github.com/username/overclock-mrp.git
cd overclock-mrp

# Instale as dependências
npm install
# ou
yarn install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite o arquivo .env.local com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
````

Acesse o sistema em [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuração

No arquivo `.env.local`, adicione:

```env
API_URL=https://backend-projeto-integrador.onrender.com
AUTH_SECRET=seu_segredo_aqui
```

---

## 💻 Uso

### Autenticação

* Acesse `/login` ou crie uma conta em `/register`.

### Gerenciamentos

* `/dashboard/pecas`: visualizar, buscar e detalhar peças.
* `/dashboard/fornecedores`: visualizar, buscar e detalhar fornecedores.
* `/dashboard/compras`: registrar e consultar compras.
* `/dashboard/pedidos`: criar e acompanhar pedidos.

---

## 📁 Estrutura do Projeto

```
overclock-mrp/
├── app/                    # Rotas e páginas da aplicação
│   ├── dashboard/          # Telas principais
│   ├── login/              # Login
│   └── register/           # Registro
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # UI base
│   ├── sidebar.tsx         # Navegação lateral
│   └── header.tsx          # Cabeçalho
├── lib/                    # Serviços e utilidades
│   ├── api-service.ts
│   ├── auth-service.ts
│   └── constants.ts
├── hooks/                  # Hooks customizados
├── public/                 # Imagens e assets
└── README.md               # Este documento
```

---

## 🔌 API

A comunicação é feita com uma API RESTful em Spring Boot:

### Autenticação

* `POST /auth/login` — Login
* `POST /auth/register` — Registro

### Peças

* `GET /api/pecas`
* `GET /api/pecas/{id}`
* `DELETE /api/pecas/{id}`

### Fornecedores

* `GET /api/fornecedores`
* `GET /api/fornecedores/{id}`
* `DELETE /api/fornecedores/{id}`

### Compras

* `GET /api/compras`
* `POST /api/compras`
* `PATCH /api/compras/{id}`
* `DELETE /api/compras/{id}`

### Pedidos

* `GET /api/pedidos`
* `POST /api/pedidos`
* `PATCH /api/pedidos/{id}`
* `DELETE /api/pedidos/{id}`

---

## 🤝 Contribuição

Contribuições são bem-vindas!

```bash
# Fork e clone o repositório
git checkout -b feature/nova-funcionalidade

# Após implementar
git commit -m 'feat: nova funcionalidade'
git push origin feature/nova-funcionalidade

# Abra um Pull Request
```

Use o padrão de [Conventional Commits](https://www.conventionalcommits.org/).

---

## 📌 Versionamento

Utilizamos [SemVer](https://semver.org/) para controle de versões.

Tipos de commit:

* `feat:` nova funcionalidade
* `fix:` correção
* `docs:` documentação
* `style:` formatação
* `refactor:` refatoração
* `test:` testes
* `chore:` tarefas auxiliares

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais informações.

---

## 📞 Contato

Entre em contato com a equipe Overclock:

* **Email**: [contato@overclockmrtp.com](mailto:contato@overclockmrtp.com)
* **Website**: [www.overclockmrtp.com](https://www.overclockmrtp.com)
* **GitHub**: [github.com/username/overclock-mrp](https://github.com/username/overclock-mrp)

---

Desenvolvido com ❤️ pela Equipe Overclock
