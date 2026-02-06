-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Users Table (handled by Supabase Auth, but we can add profiles if needed)
-- For this app, we'll store user-related data directly linked to auth.users

-- 1. Create Quiz Results Table
create table public.quiz_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  subject text not null,
  score integer not null,
  total_questions integer not null,
  percentage numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Payments Table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  plan text not null,
  amount text not null,
  method text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Questions Table (for manual uploads)
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  subject text not null,
  text text not null,
  options jsonb not null, -- Store options as ["A", "B", "C", "D"]
  correct_answer integer not null, -- Index 0-3
  explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)

-- Quiz Results: Users can insert their own results and view their own results
alter table public.quiz_results enable row level security;

create policy "Users can insert their own quiz results"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own quiz results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

-- Payments: Users can view their own payments, only system can insert (simulated via client for now, but ideally server-side)
alter table public.payments enable row level security;

create policy "Users can insert their own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- Questions: Everyone can read questions, only admins can insert (we'll allow all authenticated for now for demo purposes or restrict)
alter table public.questions enable row level security;

create policy "Everyone can read questions"
  on public.questions for select
  using (true);

create policy "Authenticated users can insert questions"
  on public.questions for insert
  with check (auth.role() = 'authenticated');
