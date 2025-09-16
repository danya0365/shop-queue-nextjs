# BUGS

- ต้องปิด RLS ของ supabase สำหรับ table queues ให้กับ user ที่ไม่ใช่ owner โดยให้ทำ API Function สำหรับดึงข้อมูล by costomer_id ที่เก็บไว้ใน local storage เท่านั้น
- ต้องทำ API Function สำหรับดึงข้อมูลของ queue ที่กำลังรออยู่ใน queue ของ shop ที่ user กำลังเข้าถึง
- ต้องสามารถ Reset queue number ได้ เช่น อาจจะ reset ทุกวัน หรือ ตามที่ shop owner กำหนด
- แก้ไขคิวในหน้า shop backend ไม่ได้
- ลบคิวในหน้า shop backend ไม่ได้
- สร้างคิวในหน้า shop backend ยังไม่ได้ส่ง param service price
- สร้างคิวในหน้า shop backend ยังไม่สามารถกดสร้าง customer ได้ (ห้ามกดสร้าง customer) แต่สามารถสร้างคิวได้ปกติ
