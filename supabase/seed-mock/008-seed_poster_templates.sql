-- Poster Templates Seed Data
-- Created: 2025-01-06
-- Author: Marosdee Uma
-- Description: Sample poster template data for Shop Queue application

INSERT INTO public.poster_templates (
    id,
    name,
    description,
    category,
    is_premium,
    preview_image,
    background_color,
    text_color,
    accent_color,
    layout,
    features,
    price,
    created_at,
    updated_at
) VALUES 
-- Modern Templates
(
    '80000000-0000-0000-0000-000000000001',
    'Modern Gradient',
    'เทมเพลตโมเดิร์นด้วยไล่สีสวยงาม',
    'modern',
    false,
    '/templates/modern-gradient-preview.jpg',
    '#667eea',
    '#ffffff',
    '#764ba2',
    'portrait',
    ARRAY['gradient_background', 'modern_typography', 'responsive_design'],
    0.00,
    NOW() - INTERVAL '30 days',
    NOW() - INTERVAL '30 days'
),
(
    '80000000-0000-0000-0000-000000000002',
    'Modern Minimal',
    'เทมเพลตโมเดิร์นแบบมินิมอล',
    'modern',
    false,
    '/templates/modern-minimal-preview.jpg',
    '#f8fafc',
    '#1e293b',
    '#3b82f6',
    'landscape',
    ARRAY['clean_design', 'minimal_layout', 'modern_fonts'],
    0.00,
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '25 days'
),
(
    '80000000-0000-0000-0000-000000000003',
    'Modern Dark',
    'เทมเพลตโมเดิร์นโทนสีเข้ม',
    'modern',
    true,
    '/templates/modern-dark-preview.jpg',
    '#0f172a',
    '#f1f5f9',
    '#06b6d4',
    'portrait',
    ARRAY['dark_theme', 'premium_fonts', 'advanced_animations'],
    99.00,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '20 days'
),

-- Classic Templates
(
    '80000000-0000-0000-0000-000000000004',
    'Classic Elegant',
    'เทมเพลตคลาสสิกสไตล์หรูหรา',
    'classic',
    false,
    '/templates/classic-elegant-preview.jpg',
    '#fef7cd',
    '#92400e',
    '#d97706',
    'portrait',
    ARRAY['elegant_borders', 'classic_typography', 'ornamental_design'],
    0.00,
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '28 days'
),
(
    '80000000-0000-0000-0000-000000000005',
    'Classic Royal',
    'เทมเพลตคลาสสิกสไตล์ราชวงศ์',
    'classic',
    true,
    '/templates/classic-royal-preview.jpg',
    '#7c2d12',
    '#fef3c7',
    '#f59e0b',
    'landscape',
    ARRAY['royal_design', 'gold_accents', 'premium_ornaments'],
    149.00,
    NOW() - INTERVAL '22 days',
    NOW() - INTERVAL '22 days'
),

-- Minimal Templates
(
    '80000000-0000-0000-0000-000000000006',
    'Pure White',
    'เทมเพลตมินิมอลสีขาวล้วน',
    'minimal',
    false,
    '/templates/pure-white-preview.jpg',
    '#ffffff',
    '#374151',
    '#6b7280',
    'square',
    ARRAY['ultra_minimal', 'clean_typography', 'whitespace_design'],
    0.00,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '15 days'
),
(
    '80000000-0000-0000-0000-000000000007',
    'Minimal Color',
    'เทมเพลตมินิมอลสีสันนุ่มนวล',
    'minimal',
    false,
    '/templates/minimal-color-preview.jpg',
    '#f0f9ff',
    '#0c4a6e',
    '#0ea5e9',
    'portrait',
    ARRAY['soft_colors', 'minimal_layout', 'modern_spacing'],
    0.00,
    NOW() - INTERVAL '18 days',
    NOW() - INTERVAL '18 days'
),

-- Professional Templates
(
    '80000000-0000-0000-0000-000000000008',
    'Corporate Blue',
    'เทมเพลตโปรเฟสชันนัลสีน้ำเงิน',
    'professional',
    false,
    '/templates/corporate-blue-preview.jpg',
    '#1e40af',
    '#ffffff',
    '#3b82f6',
    'landscape',
    ARRAY['corporate_design', 'professional_layout', 'business_fonts'],
    0.00,
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '12 days'
),
(
    '80000000-0000-0000-0000-000000000009',
    'Executive Suite',
    'เทมเพลตโปรเฟสชันนัลระดับผู้บริหาร',
    'professional',
    true,
    '/templates/executive-suite-preview.jpg',
    '#111827',
    '#f9fafb',
    '#10b981',
    'portrait',
    ARRAY['executive_design', 'premium_layout', 'luxury_fonts', 'advanced_features'],
    199.00,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
),
(
    '80000000-0000-0000-0000-000000000010',
    'Business Formal',
    'เทมเพลตธุรกิจแบบฟอร์มอล',
    'professional',
    false,
    '/templates/business-formal-preview.jpg',
    '#f8fafc',
    '#1f2937',
    '#059669',
    'square',
    ARRAY['formal_design', 'business_colors', 'structured_layout'],
    0.00,
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '8 days'
)
ON CONFLICT (id) DO NOTHING;
