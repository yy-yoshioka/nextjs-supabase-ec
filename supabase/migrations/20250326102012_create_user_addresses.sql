-- 配送先住所テーブルの作成
create table if not exists user_addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) on delete cascade,
  name text not null,
  recipient_name text not null,
  postal_code text,
  prefecture text,
  city text,
  street_address text not null,
  building text,
  phone_number text,
  is_default boolean default false,
  created_at timestamp default now()
);

-- インデックスの作成
create index if not exists user_addresses_user_id_idx on user_addresses(user_id);
create index if not exists user_addresses_is_default_idx on user_addresses(is_default);

-- トリガー関数の作成 (デフォルト住所の設定)
create or replace function set_default_address()
returns trigger as $$
begin
  -- 新しいアドレスがデフォルトとして設定される場合
  if new.is_default = true then
    -- 同じユーザーの他のアドレスのデフォルト設定を解除
    update user_addresses
    set is_default = false
    where user_id = new.user_id and id != new.id;
  end if;
  
  -- ユーザーの最初のアドレスの場合、自動的にデフォルトに設定
  if new.is_default = false and (select count(*) from user_addresses where user_id = new.user_id) = 0 then
    new.is_default = true;
  end if;
  
  return new;
end;
$$ language plpgsql;

-- トリガーの設定
drop trigger if exists set_default_address_trigger on user_addresses;
create trigger set_default_address_trigger
before insert or update on user_addresses
for each row
execute procedure set_default_address();

-- RLSを有効化
alter table user_addresses enable row level security;

-- 自分の住所だけを読み取り可能にする
create policy "Users can view their own addresses"
on user_addresses for select
using (auth.uid() = user_id);

-- 自分の住所だけを作成可能にする
create policy "Users can create their own addresses"
on user_addresses for insert
with check (auth.uid() = user_id);

-- 自分の住所だけを更新可能にする
create policy "Users can update their own addresses"
on user_addresses for update
using (auth.uid() = user_id);

-- 自分の住所だけを削除可能にする
create policy "Users can delete their own addresses"
on user_addresses for delete
using (auth.uid() = user_id);
