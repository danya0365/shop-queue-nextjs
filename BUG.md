# BUGS

- ต้องปิด RLS ของ supabase สำหรับ table queues ให้กับ user ที่ไม่ใช่ owner โดยให้ทำ API Function สำหรับดึงข้อมูล by costomer_id ที่เก็บไว้ใน local storage เท่านั้น
- ต้องทำ API Function สำหรับดึงข้อมูลของ queue ที่กำลังรออยู่ใน queue ของ shop ที่ user กำลังเข้าถึง
