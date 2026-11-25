# Decap CMS — configuração administrativa

O editor de documentação fica em `/cms/`. `/admin/` continua reservado ao painel Firebase do site; não use `/admin/` para o Decap.

## Produção: Netlify Identity + Git Gateway

`public/cms/config.yml` usa `backend.name: git-gateway`. O Git Gateway é oferecido pelo Netlify e exige Netlify Identity; uma GitHub OAuth App da organização autentica os editores.

1. Hospede o site no Netlify ou conecte o domínio existente a um site Netlify que sirva os arquivos estáticos.
2. Em **Site configuration → Identity**, habilite **Identity** e **Git Gateway**.
3. Em **Identity → Services → Git Gateway**, conecte o repositório `Piano-Louvor-JA/site`.
4. Em **GitHub → Organization Settings → Developer settings → OAuth Apps**, crie uma OAuth App para o editor.
5. Defina uma URL pública do site em **Homepage URL** e use `https://<base_url>/.netlify/identity/callback` em **Authorization callback URL**. Substitua `<base_url>` pela origem final, por exemplo `https://pianolouvorja.com.br`.
6. Copie o Client ID e Client Secret apenas para a configuração segura do provedor de Identity. Nunca coloque segredos em `public/cms/config.yml` ou no Git.
7. Convide os editores em **Identity**. Eles recebem e-mail para criar a conta e acessam `<base_url>/cms/`.

Se o domínio não for servido pelo Netlify, mantenha a origem do editor atrás de um proxy/hosting compatível com Netlify Identity ou escolha um backend Decap apropriado antes de liberar acesso. `git-gateway` não funciona sozinho em hospedagem estática.

## Teste local

Para testar sem Identity, inicie o backend local:

```bash
npx decap-server
```

Em uma cópia local de `public/cms/config.yml`, adicione temporariamente:

```yml
local_backend: true
```

Inicie o Nuxt e abra `http://localhost:3000/cms/`. Remova `local_backend: true` antes de publicar: ele é somente para desenvolvimento.

## Fluxo para editores

1. Acesse `/cms/` e entre com a conta convidada.
2. Crie ou edite uma página em **Documentação**.
3. Salve como rascunho para continuar depois.
4. Envie para revisão quando o texto estiver pronto.
5. Clique em publicar. Com `publish_mode: editorial_workflow`, o Decap cria uma pull request contra `staging`.
6. Um mantenedor revisa e faz o merge humano. O deploy publica a documentação após o pipeline normal.

Não há publicação direta em produção pelo editor.

## Adicionando blog no futuro

O modelo comentado `posts` fica em `public/cms/config.yml`. Descomente-o somente após criar `content/blog/pt-BR` e o consumo de blog no Nuxt. O schema previsto é `title`, `description`, `date`, `tags` e `body`; `nav_order` não se aplica.
