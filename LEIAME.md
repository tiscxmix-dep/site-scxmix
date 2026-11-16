# SCX Mix da Construção: site e painel

Site da loja com painel administrativo para gerenciar tudo sem mexer em código.
Desenvolvido por CRG - Soluções Tecnológicas.

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `index.html` | O site que o cliente vê |
| `admin.html` | O painel (abra em `seusite/admin.html`) |
| `config.js` | Onde você cola o endereço e a chave do Supabase |
| `assets/` | Logo, ícone e o código compartilhado |
| `supabase/schema.sql` | Cria o banco de dados, as regras de segurança e o espaço das fotos |
| `CNAME` | Diz ao GitHub que o site usa www.scxmix.com.br |
| `robots.txt` / `sitemap.xml` | Ajudam o Google a achar o site (e esconder o painel) |

**No painel você consegue:**
- **Painel:** visitas, leads, conversão e valor em orçamentos, com gráficos por dia, últimos leads, produtos mais pedidos e de onde vêm as visitas.
- **Leads:** todo orçamento e todo contato enviado pelo site fica salvo, mesmo que o WhatsApp não abra. Você marca o status (Novo, Em atendimento, Venda fechada, Perdido), faz anotações internas, responde pelo WhatsApp com um clique e exporta para planilha.
- **Banners:** monte o banner pelos textos (o site aplica as cores da loja) ou envie uma arte pronta do Canva, com uma versão para computador e outra para celular. Também dá para mudar a ordem, tirar do ar e escolher o que acontece ao clicar.
- **Produtos e preços:** cadastre com foto, preço, preço "de" (com selo de desconto), oferta e descrição. O preço pode ser mudado direto na tabela.
- **Departamentos:** nome, ícone, ordem e mostrar ou esconder.
- **Textos e contato:** WhatsApp que recebe os pedidos, horário, endereço, Instagram, desconto no PIX, faixa de avisos, vantagens, anúncios, passos e rodapé.
- **Aparência:** logo, cores e quais seções aparecem no site.
- **Acesso e senha:** troque sua senha e dê acesso a outras pessoas.

As fotos enviadas pelo painel são reduzidas automaticamente antes de subir, para o site continuar rápido.

---

## Instalação (uma vez só, uns 20 minutos)

### 1. Criar o projeto no Supabase
1. Entre em **supabase.com** e crie uma conta (o plano gratuito atende bem).
2. Clique em **New project**. Nome: `scx-mix`. Crie uma senha forte para o banco e escolha a região **South America (São Paulo)**.
3. Espere uns 2 minutos até o projeto ficar pronto.

### 2. Criar o banco
1. No menu do Supabase, abra **SQL Editor → New query**.
2. Cole o conteúdo inteiro de `supabase/schema.sql` e clique em **Run**. Deve aparecer "Success".

### 3. Criar o seu login
1. Vá em **Authentication → Users → Add user → Create new user**.
2. Informe seu e-mail e uma senha, e marque **Auto Confirm User**.
3. Volte ao **SQL Editor** e rode esta linha, trocando pelo seu e-mail:
   ```sql
   insert into public.admins (email) values ('seu-email@exemplo.com');
   ```
4. Por segurança, desligue o cadastro aberto: **Authentication → Sign In / Providers → Email**, em "Allow new users to sign up", **desligue**. Os próximos acessos você libera pelo painel.

### 4. Ligar o site ao Supabase
1. Em **Project Settings → API Keys**, copie a **Project URL** e a chave **anon** (fica na aba "Legacy API Keys"). Se o seu projeto mostrar só a chave **publishable**, use ela.
2. Abra `config.js` e cole os dois valores entre as aspas:
   ```js
   window.SCX_CONFIG = {
     supabaseUrl: "https://xxxxxxxx.supabase.co",
     supabaseAnonKey: "eyJhbGciOi..."
   };
   ```
   Essa chave é pública e pode ficar no site. **Nunca** coloque a chave `service_role` / `secret`.

### 5. Publicar no GitHub (conta tiscxmix-dep)
1. Entre em **github.com/tiscxmix-dep** e clique em **New repository**. Nome: `site-scxmix`, **Public**, sem README. Clique em **Create repository**.
2. Na página do repositório vazio, clique em **uploading an existing file**. Arraste **todo o conteúdo** desta pasta (não a pasta em si): `index.html`, `admin.html`, `config.js`, `CNAME`, `robots.txt`, `sitemap.xml` e as pastas `assets` e `supabase`. Clique em **Commit changes**.
3. Vá em **Settings → Pages**. Em *Source* escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e salve.
4. Em **Custom domain**, confira se está `www.scxmix.com.br` (o arquivo `CNAME` já preenche) e clique em **Save**.

### 6. Apontar o domínio (Registro.br)
1. Entre em **registro.br → Domínios → scxmix.com.br → DNS → Configurar zona DNS** (modo avançado). Se o DNS estiver em outro lugar (Cloudflare, Hostinger), crie os mesmos registros lá.
2. Crie os registros:

   | Tipo | Nome | Valor |
   |---|---|---|
   | CNAME | www | `tiscxmix-dep.github.io` |
   | A | (vazio / @) | `185.199.108.153` |
   | A | (vazio / @) | `185.199.109.153` |
   | A | (vazio / @) | `185.199.110.153` |
   | A | (vazio / @) | `185.199.111.153` |

   Os registros **A** fazem `scxmix.com.br` (sem www) também abrir o site.
3. Espere a propagação (de minutos até algumas horas). Em **Settings → Pages** aparece "DNS check successful".
4. Quando liberar, marque **Enforce HTTPS**. O certificado pode levar até 1 hora para ficar pronto.
5. Proteção do domínio (recomendado): na conta tiscxmix-dep, em **Settings → Pages → Add a domain**, informe `scxmix.com.br`. O GitHub mostra um registro **TXT**: crie esse TXT no Registro.br e clique em **Verify**. Assim nenhuma outra conta do GitHub consegue usar o seu domínio.

### 6.1 Ajustar o Supabase para o domínio
Em **Authentication → URL Configuration**:
- **Site URL:** `https://www.scxmix.com.br/admin.html`
- **Redirect URLs:** `https://www.scxmix.com.br/admin.html` e `https://scxmix.com.br/admin.html`

Pronto: o site fica em **https://www.scxmix.com.br** e o painel em **https://www.scxmix.com.br/admin.html**.

### 7. Primeiro acesso
Abra o `admin.html`, entre com seu e-mail e senha e clique em **Carregar conteúdo de exemplo**. Os departamentos, produtos, banners e textos atuais vão para o banco, e a partir daí é só editar.

---

## Dúvidas comuns

**O site mostra os produtos de exemplo mesmo depois de configurar.**
Confira o `config.js`. Enquanto o banco estiver vazio, o site mostra o exemplo de propósito, para não ficar em branco. Faça o passo 7.

**Entrei e aparece "não está liberado como administrador".**
O e-mail do login não está na tabela `admins`. Refaça o passo 3, item 3, com o e-mail exatamente igual.

**Mudei algo no painel e o site não mudou.**
Atualize a página do site. O site guarda a última versão no navegador para abrir rápido e busca a nova em seguida.

**Como atualizo o site depois?**
Quase nada precisa: textos, preços, fotos e banners mudam pelo painel. Só se trocar algum arquivo, envie de novo pelo GitHub em **Add file → Upload files** (mesmo nome substitui).

**O endereço mostra erro 404 ou "site not found".**
Confira se o `CNAME` está no repositório e se o registro `www` aponta para `tiscxmix-dep.github.io` (sem `/site-scxmix`).

**O plano gratuito do Supabase tem limite?**
Ele atende com folga um site de loja (banco de 500 MB e 1 GB de fotos). Um projeto que passa 7 dias sem nenhum acesso é pausado. Com o site recebendo visitas isso não acontece, e se acontecer, é só reativar no painel do Supabase.

**Segurança**
- Visitantes só leem o conteúdo público e enviam leads. Não conseguem ver os leads de ninguém nem alterar nada.
- Só e-mails da tabela `admins` alteram conteúdo, veem leads e enviam fotos.
- Um mesmo telefone não consegue mandar mais de 3 leads em 10 minutos (freio contra spam).
- O painel não aparece no Google (`noindex`).

## Pensando na loja virtual
Os produtos já ficam num banco de verdade, com preço, foto, estoque visível (ativo/inativo) e departamento. O "Meu orçamento" funciona como um carrinho. Para virar loja: adicionar uma tabela `pedidos`, um checkout com pagamento (Mercado Pago ou Stripe, via Supabase Edge Function) e o controle de estoque. O site e o painel continuam os mesmos.
