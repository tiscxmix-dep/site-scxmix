-- =====================================================================
--  SCX Mix da Construção — banco de dados do site e do painel
--  Cole este arquivo inteiro no Supabase > SQL Editor > New query > Run.
--  Pode rodar de novo sem perder dados (o script é idempotente).
--  Desenvolvido por CRG - Soluções Tecnológicas
-- =====================================================================

-- ---------- Tabelas ----------
-- Usuários do painel. papel: 'admin' (acesso total) ou 'editor' (só produtos e preços)
create table if not exists public.admins (
  email      text primary key,
  papel      text not null default 'admin' check (papel in ('admin','editor')),
  criado_em  timestamptz not null default now()
);
alter table public.admins add column if not exists papel text not null default 'admin';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'admins_papel_check') then
    alter table public.admins add constraint admins_papel_check check (papel in ('admin','editor'));
  end if;
end $$;

create table if not exists public.config (
  chave         text primary key,
  valor         jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz not null default now()
);

create table if not exists public.categorias (
  id     text primary key check (id ~ '^[a-z0-9-]{2,40}$'),
  nome   text not null check (char_length(nome) between 2 and 60),
  icone  text not null default 'caixa',
  ordem  int  not null default 0,
  ativo  boolean not null default true
);

create table if not exists public.produtos (
  id         bigint generated always as identity primary key,
  nome       text not null check (char_length(nome) between 2 and 120),
  categoria  text references public.categorias(id) on update cascade on delete set null,
  unidade    text not null default 'unid.',
  preco      numeric(12,2) not null default 0 check (preco >= 0),
  preco_de   numeric(12,2) check (preco_de is null or preco_de >= 0),
  descricao  text,
  foto_url   text,
  destaque   boolean not null default false,
  ativo      boolean not null default true,
  ordem      int not null default 0,
  criado_em  timestamptz not null default now()
);

create table if not exists public.banners (
  id            bigint generated always as identity primary key,
  ordem         int not null default 0,
  ativo         boolean not null default true,
  etiqueta      text,
  titulo        text,
  destaque      text,
  subtitulo     text,
  preco_rotulo  text,
  preco         text,
  preco_sufixo  text,
  botao_texto   text,
  botao_acao    text,          -- 'cat:tintas' | 'prod:12' | 'url:https://...' | 'contato' | vazio
  imagem_url    text,          -- arte para computador (1600 x 500)
  imagem_mobile_url text,      -- arte para celular (1080 x 810), opcional
  estilo        text not null default 's1',
  criado_em     timestamptz not null default now()
);
alter table public.banners add column if not exists imagem_mobile_url text;

create table if not exists public.leads (
  id          bigint generated always as identity primary key,
  criado_em   timestamptz not null default now(),
  nome        text not null check (char_length(nome) between 2 and 80),
  telefone    text not null check (char_length(telefone) between 8 and 30),
  bairro      text check (bairro is null or char_length(bairro) <= 80),
  rua         text check (rua is null or char_length(rua) <= 120),
  numero      text check (numero is null or char_length(numero) <= 20),
  complemento text check (complemento is null or char_length(complemento) <= 120),
  mensagem    text check (mensagem is null or char_length(mensagem) <= 2000),
  origem      text not null default 'orcamento' check (origem in ('orcamento','contato','banner')),
  itens       jsonb check (itens is null or pg_column_size(itens) < 30000),
  total       numeric(12,2),
  status      text not null default 'novo' check (status in ('novo','atendimento','fechado','perdido')),
  observacao  text
);

-- endereço de entrega (para quem instalou antes desta versão)
alter table public.leads add column if not exists rua text check (rua is null or char_length(rua) <= 120);
alter table public.leads add column if not exists numero text check (numero is null or char_length(numero) <= 20);
alter table public.leads add column if not exists complemento text check (complemento is null or char_length(complemento) <= 120);

create table if not exists public.acessos (
  id          bigint generated always as identity primary key,
  criado_em   timestamptz not null default now(),
  pagina      text check (pagina is null or char_length(pagina) <= 200),
  referencia  text check (referencia is null or char_length(referencia) <= 300),
  dispositivo text check (dispositivo is null or dispositivo in ('celular','computador'))
);

create index if not exists leads_criado_idx   on public.leads (criado_em desc);
create index if not exists acessos_criado_idx on public.acessos (criado_em desc);
create index if not exists produtos_cat_idx   on public.produtos (categoria);

-- ---------- Quem é administrador ----------
create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and a.papel = 'admin'
  );
$$;

-- Administrador ou editor: pode mexer em produtos e nas fotos de produtos
create or replace function public.pode_editar_produtos()
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      and a.papel in ('admin','editor')
  );
$$;

-- Perfil de quem está logado ('admin', 'editor' ou null) — usado pelo painel
create or replace function public.meu_papel()
returns text
language sql stable security definer
set search_path = public
as $$
  select a.papel from public.admins a
  where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  limit 1;
$$;

-- Não deixa ficar sem nenhum administrador (nem apagando, nem rebaixando)
create or replace function public.protege_ultimo_admin()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.admins where papel = 'admin') = 0 then
    raise exception 'É preciso manter pelo menos um administrador.';
  end if;
  return null;
end $$;

drop trigger if exists trg_protege_ultimo_admin on public.admins;
create trigger trg_protege_ultimo_admin
  after delete or update on public.admins
  for each statement execute function public.protege_ultimo_admin();

-- Freio contra envio repetido de leads (mesmo telefone, mais de 3 por 10 minutos)
create or replace function public.freio_leads()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.leads
      where telefone = new.telefone and criado_em > now() - interval '10 minutes') >= 3 then
    raise exception 'Muitos envios seguidos. Tente de novo em alguns minutos.';
  end if;
  return new;
end $$;

drop trigger if exists trg_freio_leads on public.leads;
create trigger trg_freio_leads
  before insert on public.leads
  for each row execute function public.freio_leads();

-- Estatísticas diárias para o painel (só administradores)
create or replace function public.estatisticas(dias int default 30)
returns table (dia date, total_acessos bigint, total_leads bigint)
language plpgsql stable security definer
set search_path = public
as $$
declare
  hoje date := (now() at time zone 'America/Campo_Grande')::date;
begin
  if not public.is_admin() then
    raise exception 'Sem permissão';
  end if;
  dias := least(greatest(coalesce(dias, 30), 1), 366);
  return query
    select g.d::date,
      (select count(*) from public.acessos a
         where (a.criado_em at time zone 'America/Campo_Grande')::date = g.d::date),
      (select count(*) from public.leads l
         where (l.criado_em at time zone 'America/Campo_Grande')::date = g.d::date)
    from generate_series(hoje - (dias - 1), hoje, interval '1 day') as g(d)
    order by 1;
end $$;

-- ---------- Permissões de acesso (RLS) ----------
alter table public.admins     enable row level security;
alter table public.config     enable row level security;
alter table public.categorias enable row level security;
alter table public.produtos   enable row level security;
alter table public.banners    enable row level security;
alter table public.leads      enable row level security;
alter table public.acessos    enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.config, public.categorias, public.produtos, public.banners to anon, authenticated;
grant insert on public.leads, public.acessos to anon, authenticated;
grant select, insert, update, delete on public.admins, public.config, public.categorias,
  public.produtos, public.banners, public.leads, public.acessos to authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.pode_editar_produtos() to anon, authenticated;
grant execute on function public.meu_papel() to authenticated;
grant execute on function public.estatisticas(int) to authenticated;

-- admins
drop policy if exists admins_ler    on public.admins;
drop policy if exists admins_gravar on public.admins;
create policy admins_ler    on public.admins for select to authenticated using (public.is_admin());
create policy admins_gravar on public.admins for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- conteúdo público: qualquer visitante lê; só administrador grava
drop policy if exists config_ler    on public.config;
drop policy if exists config_gravar on public.config;
create policy config_ler    on public.config for select to anon, authenticated using (true);
create policy config_gravar on public.config for all    to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists categorias_ler    on public.categorias;
drop policy if exists categorias_gravar on public.categorias;
create policy categorias_ler    on public.categorias for select to anon, authenticated using (ativo or public.pode_editar_produtos());
create policy categorias_gravar on public.categorias for all    to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists produtos_ler    on public.produtos;
drop policy if exists produtos_gravar on public.produtos;
create policy produtos_ler    on public.produtos for select to anon, authenticated using (ativo or public.pode_editar_produtos());
create policy produtos_gravar on public.produtos for all    to authenticated using (public.pode_editar_produtos()) with check (public.pode_editar_produtos());

drop policy if exists banners_ler    on public.banners;
drop policy if exists banners_gravar on public.banners;
create policy banners_ler    on public.banners for select to anon, authenticated using (ativo or public.is_admin());
create policy banners_gravar on public.banners for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- leads: visitante só envia (não lê nada); administrador vê e edita
drop policy if exists leads_enviar on public.leads;
drop policy if exists leads_admin  on public.leads;
create policy leads_enviar on public.leads for insert to anon, authenticated
  with check (status = 'novo' and observacao is null);
create policy leads_admin  on public.leads for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- acessos: visitante só registra; administrador vê
drop policy if exists acessos_registrar on public.acessos;
drop policy if exists acessos_admin     on public.acessos;
create policy acessos_registrar on public.acessos for insert to anon, authenticated with check (true);
create policy acessos_admin     on public.acessos for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Fotos e banners (Storage) ----------
insert into storage.buckets (id, name, public)
values ('midia', 'midia', true)
on conflict (id) do update set public = true;

drop policy if exists midia_admin_ler     on storage.objects;
drop policy if exists midia_admin_enviar  on storage.objects;
drop policy if exists midia_admin_alterar on storage.objects;
drop policy if exists midia_admin_apagar  on storage.objects;
-- administrador: qualquer pasta; editor: só a pasta produtos/
create or replace function public.pode_mexer_midia(caminho text)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_admin() or (public.pode_editar_produtos() and caminho like 'produtos/%');
$$;
grant execute on function public.pode_mexer_midia(text) to authenticated;

create policy midia_admin_ler     on storage.objects for select to authenticated using (bucket_id = 'midia' and public.pode_mexer_midia(name));
create policy midia_admin_enviar  on storage.objects for insert to authenticated with check (bucket_id = 'midia' and public.pode_mexer_midia(name));
create policy midia_admin_alterar on storage.objects for update to authenticated using (bucket_id = 'midia' and public.pode_mexer_midia(name));
create policy midia_admin_apagar  on storage.objects for delete to authenticated using (bucket_id = 'midia' and public.pode_mexer_midia(name));

-- =====================================================================
--  ÚLTIMO PASSO: troque o e-mail abaixo pelo seu (o mesmo que você
--  cadastrou em Authentication > Users) e rode só esta linha.
-- =====================================================================
-- (tire os dois tracinhos do começo da linha antes de rodar)
-- insert into public.admins (email, papel) values ('seu-email@exemplo.com', 'admin') on conflict do nothing;
