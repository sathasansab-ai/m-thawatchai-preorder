-- ========================================================
-- ฐานข้อมูลระบบ PRE-ORDER เสื้อสตรีท "เอ็ม ธวัชชัย" (SUPABASE SQL)
-- นำชุดคำสั่งนี้ไปรันใน Supabase -> SQL Editor ได้ทันที
-- ========================================================

-- 1. สร้างตารางคำสั่งซื้อ (orders)
create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    order_number varchar(30) unique not null,          -- เช่น MTC-2026-0001
    customer_name varchar(255) not null,              -- ชื่อ-นามสกุลผู้สั่ง
    customer_phone varchar(20) not null,              -- เบอร์โทรศัพท์ (ใช้ค้นหาสถานะ)
    customer_contact varchar(255),                    -- ช่องทางติดต่อสำรอง (Line / IG)
    
    -- ข้อมูลที่อยู่จัดส่ง
    address_detail text not null,                     -- บ้านเลขที่ ซอย ถนน อาคาร
    subdistrict varchar(100) not null,                -- ตำบล / แขวง
    district varchar(100) not null,                   -- อำเภอ / เขต
    province varchar(100) not null,                   -- จังหวัด
    postal_code varchar(10) not null,                 -- รหัสไปรษณีย์ 5 หลัก
    
    -- ข้อมูลการเงินและสลิป
    total_amount decimal(10, 2) not null,             -- ยอดเงินรวม (บาท)
    shipping_fee decimal(10, 2) default 0.00,         -- ค่าส่ง (บาท)
    slip_url text,                                    -- ลิงก์รูปสลิปโอนเงินใน Supabase Storage
    
    -- สถานะคำสั่งซื้อ
    status varchar(50) default 'pending_slip' check (status in ('pending_slip', 'verified', 'in_production', 'shipped', 'cancelled')),
    tracking_number varchar(100),                     -- เลขพัสดุสำหรับติดตาม
    courier_name varchar(100) default 'Flash Express',-- บริษัทขนส่ง
    
    admin_notes text,                                 -- บันทึกภายในของทีมงาน
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. สร้างตารางรายการสินค้าที่สั่ง (order_items)
create table if not exists public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_name varchar(255) default 'M Thawatchai Signature T-Shirt',
    color varchar(50) not null,                       -- 'Black' หรือ 'White'
    size varchar(20) not null,                        -- 'S', 'M', 'L', 'XL', '2XL', '3XL'
    quantity integer default 1 check (quantity > 0),  -- จำนวนตัว
    price_per_unit decimal(10, 2) not null            -- ราคาต่อตัว
);

-- 3. สร้าง Storage Bucket สำหรับเก็บรูปสลิปโอนเงิน
insert into storage.buckets (id, name, public) 
values ('payment_slips', 'payment_slips', true)
on conflict (id) do nothing;

-- 4. ตั้งค่าดัชนี (Indexes) เพื่อค้นหาได้เร็วเสี้ยววินาที
create index if not exists idx_orders_phone on public.orders (customer_phone);
create index if not exists idx_orders_order_number on public.orders (order_number);
create index if not exists idx_orders_status on public.orders (status);

-- 5. กำหนด Row Level Security (RLS)
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Drop existing policies if any to avoid errors on rerun
drop policy if exists "Allow public insert to orders" on public.orders;
drop policy if exists "Allow public select orders" on public.orders;
drop policy if exists "Allow public update orders" on public.orders;
drop policy if exists "Allow public delete orders" on public.orders;

drop policy if exists "Allow public insert to order_items" on public.order_items;
drop policy if exists "Allow public select order_items" on public.order_items;
drop policy if exists "Allow public update order_items" on public.order_items;
drop policy if exists "Allow public delete order_items" on public.order_items;

-- นโยบาย Orders (CRUD)
create policy "Allow public insert to orders" on public.orders for insert with check (true);
create policy "Allow public select orders" on public.orders for select using (true);
create policy "Allow public update orders" on public.orders for update using (true) with check (true);
create policy "Allow public delete orders" on public.orders for delete using (true);

-- นโยบาย Order Items (CRUD)
create policy "Allow public insert to order_items" on public.order_items for insert with check (true);
create policy "Allow public select order_items" on public.order_items for select using (true);
create policy "Allow public update order_items" on public.order_items for update using (true) with check (true);
create policy "Allow public delete order_items" on public.order_items for delete using (true);

-- นโยบาย Storage สำหรับรูปสลิป payment_slips
drop policy if exists "Allow public upload payment_slips" on storage.objects;
drop policy if exists "Allow public read payment_slips" on storage.objects;
drop policy if exists "Allow public delete payment_slips" on storage.objects;

create policy "Allow public upload payment_slips" on storage.objects for insert with check (bucket_id = 'payment_slips');
create policy "Allow public read payment_slips" on storage.objects for select using (bucket_id = 'payment_slips');
create policy "Allow public delete payment_slips" on storage.objects for delete using (bucket_id = 'payment_slips');

-- 6. ตัวอย่างข้อมูลทดสอบ (Sample Mock Data)
insert into public.orders (
    order_number, customer_name, customer_phone, customer_contact,
    address_detail, subdistrict, district, province, postal_code,
    total_amount, shipping_fee, status, tracking_number, courier_name
) values (
    'MTC-2026-0001', 'สมชาย ใจสู้', '0891234567', 'somchai_line',
    '88/12 หมู่ 4 ซอยอารีย์', 'พญาไท', 'พญาไท', 'กรุงเทพมหานคร', '10400',
    1180.00, 0.00, 'verified', null, 'Flash Express'
) on conflict do nothing;

insert into public.order_items (order_id, color, size, quantity, price_per_unit)
select id, 'Black', 'L', 1, 590.00 from public.orders where order_number = 'MTC-2026-0001' limit 1;

insert into public.order_items (order_id, color, size, quantity, price_per_unit)
select id, 'White', 'XL', 1, 590.00 from public.orders where order_number = 'MTC-2026-0001' limit 1;
