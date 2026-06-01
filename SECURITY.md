# 🔒 Política de Segurança

## Reportando vulnerabilidades

Se você encontrar uma vulnerabilidade de segurança no RotaVIX, **não abra uma issue pública**.

Envie um e-mail para a equipe do projeto com os detalhes da vulnerabilidade. Responderemos em até 48 horas.

## Versões suportadas

| Versão | Suporte |
|--------|---------|
| 1.x    | ✅ Ativo |

## Boas práticas

- **Nunca** commite secrets, tokens ou chaves de API no repositório
- Utilize variáveis de ambiente para configurações sensíveis
- Mantenha as dependências atualizadas (`npm audit`)
- Todas as contribuições passam por revisão de código antes do merge
- O CI/CD verifica o build e TypeScript antes de gerar imagens Docker
