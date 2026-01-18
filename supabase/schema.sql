create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  location text,
  phone text,
  role text default 'user',
  verification_status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  brand text,
  model text,
  year integer,
  fuel_type text,
  price_per_day numeric,
  location text,
  description text,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists cars_location_idx on public.cars(location);
create index if not exists cars_price_idx on public.cars(price_per_day);
create index if not exists cars_fuel_idx on public.cars(fuel_type);

create table if not exists public.car_images (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references public.cars(id) on delete cascade,
  image_url text not null,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  car_id uuid references public.cars(id) on delete cascade,
  renter_id uuid references public.profiles(id) on delete cascade,
  start_date date,
  end_date date,
  status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists bookings_renter_idx on public.bookings(renter_id);
create index if not exists bookings_car_idx on public.bookings(car_id);

create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  car_id uuid references public.cars(id) on delete set null,
  type text not null,
  document_url text not null,
  status text default 'pending',
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete cascade,
  reviewer_id uuid references public.profiles(id) on delete cascade,
  rating integer check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  if new.updated_at = old.updated_at then
    new.updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

create or replace trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace trigger cars_updated_at
before update on public.cars
for each row execute function public.set_updated_at();

create or replace trigger bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create or replace trigger verifications_updated_at
before update on public.verifications
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, location, phone, role, verification_status)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'phone',
    coalesce(new.raw_user_meta_data->>'role', 'user'),
    'pending'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.cars enable row level security;
alter table public.car_images enable row level security;
alter table public.bookings enable row level security;
alter table public.verifications enable row level security;
alter table public.reviews enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and exists (
      select 1 from public.profiles as p
      where p.id = auth.uid()
        and p.role = role
        and p.verification_status = verification_status
    )
  );

create policy "Admins can manage profiles"
  on public.profiles for all
  to authenticated
  using (exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "Cars are viewable by everyone"
  on public.cars for select
  using (true);

create policy "Users can insert cars"
  on public.cars for insert
  to authenticated
  with check (auth.uid() = owner_id);

create policy "Owners can update cars"
  on public.cars for update
  to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can delete cars"
  on public.cars for delete
  to authenticated
  using (auth.uid() = owner_id);

create policy "Admins can manage cars"
  on public.cars for all
  to authenticated
  using (exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  ))
  with check (exists (
    select 1 from public.profiles as p
    where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "Car images are viewable"
  on public.car_images for select
  using (true);

create policy "Owners can add car images"
  on public.car_images for insert
  to authenticated
  with check (
    exists (
      select 1 from public.cars
      where id = car_id and owner_id = auth.uid()
    )
  );

create policy "Owners can delete car images"
  on public.car_images for delete
  to authenticated
  using (
    exists (
      select 1 from public.cars
      where id = car_id and owner_id = auth.uid()
    )
  );

create policy "Bookings are visible to participants"
  on public.bookings for select
  to authenticated
  using (
    auth.uid() = renter_id
    or auth.uid() in (select owner_id from public.cars where id = car_id)
    or exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Verified users can request bookings"
  on public.bookings for insert
  to authenticated
  with check (
    auth.uid() = renter_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and verification_status = 'verified'
    )
  );

create policy "Participants can update booking status"
  on public.bookings for update
  to authenticated
  using (
    auth.uid() = renter_id
    or auth.uid() in (select owner_id from public.cars where id = car_id)
  )
  with check (
    auth.uid() = renter_id
    or auth.uid() in (select owner_id from public.cars where id = car_id)
  );

create policy "Users can insert verification documents"
  on public.verifications for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can view their verification documents"
  on public.verifications for select
  to authenticated
  using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Admins can update verifications"
  on public.verifications for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  )
  with check (
    exists (
      select 1 from public.profiles as p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Reviews are viewable"
  on public.reviews for select
  using (true);

create policy "Renters can add reviews"
  on public.reviews for insert
  to authenticated
  with check (
    auth.uid() = reviewer_id
    and exists (
      select 1 from public.bookings
      where id = booking_id and renter_id = auth.uid()
    )
  );
