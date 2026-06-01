# 🤝 Guia de Contribuição

Obrigado pelo interesse em contribuir com o **RotaVIX**! 🚌

## Fluxo de contribuição

1. **Fork** o repositório
2. Crie uma **branch**: `git checkout -b feature/minha-feature`
3. Faça suas alterações
4. Rode os testes/verificações localmente
5. **Commit** com mensagens claras: `feat: adiciona filtro por preço`
6. **Push** para seu fork: `git push origin feature/minha-feature`
7. Abra um **Pull Request** para a branch `main`

## Padrão de commits

Seguimos o [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação, ponto-e-vírgula
refactor: refatoração de código
test: adição de testes
chore: tarefas de manutenção
ci: configuração de CI/CD
```

## Configurando o ambiente

```bash
# Clone o repositório
git clone https://github.com/Guztaver/RotaVIX.git
cd RotaVIX

# Backend
cd api/rotavix-api && npm install && npm run start:dev

# Frontend (outro terminal)
cd web/rotavix-web && npm install && npm start
```

## Verificações antes do PR

- ✅ O backend compila: `cd api/rotavix-api && npx nest build`
- ✅ O frontend compila: `cd web/rotavix-web && npx ng build`
- ✅ O Docker Compose sobe: `docker-compose up --build`

## Issues

- Use o template de **bug report** para problemas
- Use o template de **feature request** para sugestões
- Seja descritivo e inclua passos para reproduzir

---

Obrigado por contribuir! 💙
