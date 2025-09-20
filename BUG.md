# BUGS

- ต้องปิด RLS ของ supabase สำหรับ table queues ให้กับ user ที่ไม่ใช่ owner โดยให้ทำ API Function สำหรับดึงข้อมูล by costomer_id ที่เก็บไว้ใน local storage เท่านั้น
- ต้องทำ API Function สำหรับดึงข้อมูลของ queue ที่กำลังรออยู่ใน queue ของ shop ที่ user กำลังเข้าถึง
- ต้องสามารถ Reset queue number ได้ เช่น อาจจะ reset ทุกวัน หรือ ตามที่ shop owner กำหนด
- สร้างคิวในหน้า shop backend ยังไม่ได้ส่ง param service price
- หน้า จัดการลูกค้า ไม่สามารถ filter ตาม member tier ได้
- หน้า จัดการลูกค้า แสดงจำนวนคิว ของแต่ลูกค้า ไม่ถูกต้อง
