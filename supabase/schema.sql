-- ============================================================
-- COVENANT — GENESIS · esquema de base de datos (Supabase)
-- Pégalo en Supabase › SQL Editor y ejecútalo una vez.
-- ============================================================

create table if not exists lista_espera (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  drop        text not null default 'genesis',
  nombre      text not null,
  whatsapp    text not null,
  talla       text,
  unique (drop, whatsapp)
);

create table if not exists reservas (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  numero      int  not null check (numero between 1 and 50),
  nombre      text not null,
  whatsapp    text not null,
  talla       text not null,
  corte       text not null default 'tee',
  referencia  text not null,
  estado      text not null default 'pendiente' check (estado in ('pendiente', 'pagada', 'cancelada'))
);

-- Un número pagado pertenece a una sola persona.
create unique index if not exists reservas_numero_pagada on reservas (numero) where estado = 'pagada';

-- Las tablas solo se leen y escriben desde el servidor (rutas /api con la clave service_role).
alter table lista_espera enable row level security;
alter table reservas enable row level security;
