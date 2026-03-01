# Ruffo App - Gestión de Clientes y Mascotas

### Mini proyecto para gestionar clientes y mascotas con Next.js 16.1.6, React 19, Tailwind CSS, shadcn/ui y Supabase.


**URL de Deploy:** [https://ruffo-app-eta.vercel.app/](https://ruffo-app-eta.vercel.app/)

Para pruebas usar este usuario ya creado:
- **Email:** `admin@ruffo.com`
- **Contraseña:** `123456`




## Instrucciones para correr el proyecto localmente

### 1. Clonar e Instalar dependencias

```bash
git clone <url_del_repo>
cd ruffo-app
pnpm install
```

### 2. Configurar Variables de Entorno

Renombra el archivo `.env.example` a `.env.local` en la raíz del proyecto y agregar las credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_apublishable_supabase_aqui
```

### 3. Ejecutar el Servidor de Desarrollo

```bash
pnpm dev
```

Abrir la URL [http://localhost:3000](http://localhost:3000) en el navegador

---

## Base de Datos en Supabase

1. Primeramente crear un proyecto en Supabase. <br>
1.2. Obtener las credenciales de Supabase. <br>
2. Crear un bucket en Storage para guardar las imágenes  con el nombre de **pets**.<br>
3. Copiar y pegar el siguiente código en el SQL Editor de Supabase.

```sql
create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  notes text,
  created_at timestamp with time zone default now()
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  species text not null check (species in ('canino', 'felino', 'otro')),
  breed text,
  behavior_notes text,
  image_url text,
  created_at timestamp with time zone default now()
);

alter table public.clients enable row level security;
alter table public.pets enable row level security;

create policy "Autenticado acceso completo clientes"
  on public.clients for all
  to authenticated
  using (true) with check (true);

create policy "Autenticado acceso completo mascotas"
  on public.pets for all
  to authenticated
  using (true) with check (true);


create policy "Autenticado puede ver imagenes de mascotas"
  on storage.objects for select
  using ( bucket_id = 'pets' );

create policy "Autenticado puede subir imagenes de mascotas"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'pets' );
```

---

## Credenciales del Usuario de Prueba

Para crear un usuario ir al proyecto de supabase ir a: <br> (*Supabase > Authentication > Users > Add User > Create a new User*). <br>

---

## Decisiones Técnicas Tomadas

Algunas decisiones técnicas específicas que se tomaron para la arquitectura de Ruffo App:


1. **Supabase con SSR (@supabase/ssr):** 
   En lugar de un backend tradicional, se usó el cliente SSR de Supabase (`createClient()`) para consultas de base de datos seguras directamente desde los Server Components (`lib/services/clients.ts`). Esto incluye el filtro ILIKE y el conteo relacional de mascotas en una sola consulta.

2. **Arquitectura de UI con shadcn/ui y Tailwind:** 
   Se implementó un diseño limpio y accesible copiando los componentes base de `shadcn/ui` (`Card`, `Input`, `Label`, `Button`, `TextArea`) hacia `components/ui/`, permitiendo total control del estilo  y adicional a eso se usó `lucide-react` para los iconos.

3. **Validación robusta (React Hook Form + Zod):** 
  Definí esquemas Zod en lib/validations.ts para validar campos obligatorios, formatos y reglas, conectándolos en tiempo real a los inputs con zodResolver de React Hook Form, garantizando seguridad y buena UX.

4. **Manejo de busqueda con USE DEBOUNCE:** 
  Agregué `use-debounce` con `pnpm add use-debounce` para optimizar la búsqueda, aplicando un retraso en la entrada del usuario (200ms) y reduciendo llamadas innecesarias, mejorando rendimiento y experiencia de usuario.

---

## Qué haría diferente o mejoraría con más tiempo

Con más tiempo, implementaría las siguientes mejoras para enriquecer el funcionamiento del sistema:

1. **Sistema de Registro y Vinculación para Clientes:**
   Actualmente el manejo de datos es netamente administrativo. Implementaría un flujo de registro profundo que permita a los clientes crear sus perfiles personales y autogestionar el apartado de información o historial de sus respectivas mascotas de forma segura.

2. **Identificadores Legibles (Slugs):**
   La navegación actual identifica a los usuarios mediante `id` en la ruta (`/clientes/[id]`). Para hacer las URLs más amigables agregaría un campo extra de `slug` único, resultando en rutas limpias como `/clientes/david`.

3. **Paginación para las listas:**
   Actualmente al abrir la lista de clientes se cargan todos de un solo golpe. Con más tiempo, agregaría botones de "Siguiente" y "Anterior" para mostrar los datos por páginas y evitar que la app se ponga lenta cuando crezca la base de datos.

4. **Edición de clientes y mascotas:**
   Me faltó agregar la opción de editar la información de los clientes y mascotas que se puede realizar reutilizando los mismos formularios.

5. **Dashboard de inicio:**
   Crearía una pantalla principal al iniciar sesión que muestre un resumen o estadísticas rápidas del negocio como cuántos clientes, mascotas como información general.

