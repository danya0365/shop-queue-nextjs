Clone Service and Use Case File

ช่วย clone /Users/marosdeeuma/shop-queue-nextjs/src/application/services/backend/BackendCategoriesService.ts และ clone ส่วนอื่นๆ ที่เรียกใน BackendCategoriesService ที่มีชื่อ path /backend/ ทั้งหมดให้ไปไว้ที่ /shop/backend/ แล้วแก้ชื่อ ที่เกี่ยวข้องทั้งหมด จาก BackendCategoriesService ให้เป็น ShopBackendCategoriesService

Clone Repo File

ช่วย clone /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/repositories/backend/supabase-backend-category-repository.ts

และ clone ส่วนอื่นๆ ที่เรียกใน supabase-backend-category-repository.ts ที่มีชื่อ path /backend/ ทั้งหมดให้ไปไว้ที่ /shop/backend/ แล้วแก้ชื่อ ที่เกี่ยวข้องทั้งหมด โดยค้นหาคำว่า BackendCategory ให้แทนที่ด้วย ShopBackendCategory เช่น SupabaseBackendCategoryRepository
ให้เป็น SupabaseShopBackendCategoryRepository

Clone Mapper File

clone /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/mappers/backend/supabase-backend-category.mapper.ts ไป /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/mappers/shop/backend/supabase-backend-category.mapper.ts

และ clone ส่วนอื่นๆ ที่เรียกใน /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/mappers/backend/supabase-backend-category.mapper.ts ที่มีชื่อ path /backend/ ทั้งหมดให้ไปไว้ที่ /shop/backend/แล้วแก้ชื่อ ที่เกี่ยวข้องทั้งหมด โดยค้นหาคำว่า BackendCategory ให้แทนที่ด้วย ShopBackendCategory เช่น SupabaseBackendCategoryMapper
ให้เป็น SupabaseShopBackendCategoryMapper

Clone Schema File

clone /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/schemas/backend/category.schema.ts ไป /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/schemas/shop/backend/category.schema.ts

และ clone ส่วนอื่นๆ ที่เรียกใน /Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/schemas/backend/category.schema.ts ที่มีชื่อ path /backend/ ทั้งหมดให้ไปไว้ที่ /shop/backend/แล้วแก้ชื่อ ที่เกี่ยวข้องทั้งหมด โดยค้นหาคำว่า BackendCategory ให้แทนที่ด้วย ShopBackendCategory

Clone Domain Repo File

clone /Users/marosdeeuma/shop-queue-nextjs/src/domain/repositories/backend/backend-category-repository.ts
ไป /Users/marosdeeuma/shop-queue-nextjs/src/domain/repositories/shop/backend/backend-category-repository.ts

และ clone ส่วนอื่นๆ ที่เรียกใน /Users/marosdeeuma/shop-queue-nextjs/src/domain/repositories/backend/backend-category-repository.ts ที่มีชื่อ path /backend/ ทั้งหมดให้ไปไว้ที่ /shop/backend/ แล้วแก้ชื่อ ที่เกี่ยวข้องทั้งหมด โดยค้นหาคำว่า BackendCategory ให้แทนที่ด้วย ShopBackendCategory เช่น BackendCategoryRepository
ให้เป็น ShopBackendCategoryRepository

Clone Domain Entity File

clone /Users/marosdeeuma/shop-queue-nextjs/src/domain/entities/backend/backend-category.entity.ts
ไป /Users/marosdeeuma/shop-queue-nextjs/src/domain/entities/shop/backend/backend-category.entity.ts

และ clone ส่วนอื่นๆ ที่เรียกใน /Users/marosdeeuma/shop-queue-nextjs/src/domain/entities/backend/backend-category.entity.ts ที่มีชื่อ path /backend/ ทั้งหมดให้ไปไว้ที่ /shop/backend/แล้วแก้ชื่อ ที่เกี่ยวข้องทั้งหมด โดยค้นหาคำว่า BackendCategory ให้แทนที่ด้วย ShopBackendCategory เช่น BackendCategoryEntity
ให้เป็น ShopBackendCategoryEntity

สุดท้าย ตรวจสอบไฟล์ที่ clone ทั้งหมด ให้ import ไฟล์ใหม่ที่ clone แล้ว ให้ถูกต้องด้วย
จากนั้น yarn build เพื่อตรวจสอบ error
