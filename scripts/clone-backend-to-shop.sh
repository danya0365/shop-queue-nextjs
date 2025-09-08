#!/bin/bash

# Source and target base directories
SRC_BASE="/Users/marosdeeuma/shop-queue-nextjs/src"
TARGET_BASE="$SRC_BASE/shop/backend"

# Create target directories if they don't exist
mkdir -p "$TARGET_BASE/application/dtos"
mkdir -p "$TARGET_BASE/application/mappers"
mkdir -p "$TARGET_BASE/application/services"
mkdir -p "$TARGET_BASE/application/usecases"
mkdir -p "$TARGET_BASE/domain/entities"
mkdir -p "$TARGET_BASE/domain/repositories"
mkdir -p "$TARGET_BASE/infrastructure/mappers"
mkdir -p "$TARGET_BASE/infrastructure/repositories"
mkdir -p "$TARGET_BASE/infrastructure/schemas"

# Function to copy and update files
copy_and_update() {
    local src_dir="$1"
    local target_dir="$2"
    
    # Create target directory if it doesn't exist
    mkdir -p "$target_dir"
    
    # Copy files from source to target
    if [ -d "$src_dir" ]; then
        find "$src_dir" -type f -name "*.ts" | while read -r file; do
            # Get relative path
            rel_path="${file#$src_dir/}"
            target_file="$target_dir/$rel_path"
            
            # Create target directory if it doesn't exist
            mkdir -p "$(dirname "$target_file")"
            
            # Only copy if target file doesn't exist
            if [ ! -f "$target_file" ]; then
                echo "Copying $file to $target_file"
                # Replace 'Backend' with 'ShopBackend' during copy
                sed 's/\bBackend\b/ShopBackend/g' "$file" > "$target_file"
            else
                echo "Skipping existing file: $target_file"
            fi
        done
    fi
}

# Copy and update files from each source directory
copy_and_update "$SRC_BASE/application/dtos/backend" "$TARGET_BASE/application/dtos"
copy_and_update "$SRC_BASE/application/mappers/backend" "$TARGET_BASE/application/mappers"
copy_and_update "$SRC_BASE/application/services/backend" "$TARGET_BASE/application/services"
copy_and_update "$SRC_BASE/application/usecases/backend" "$TARGET_BASE/application/usecases"
copy_and_update "$SRC_BASE/domain/entities/backend" "$TARGET_BASE/domain/entities"
copy_and_update "$SRC_BASE/domain/repositories/backend" "$TARGET_BASE/domain/repositories"
copy_and_update "$SRC_BASE/infrastructure/mappers/backend" "$TARGET_BASE/infrastructure/mappers"
copy_and_update "$SRC_BASE/infrastructure/repositories/backend" "$TARGET_BASE/infrastructure/repositories"
copy_and_update "$SRC_BASE/infrastructure/schemas/backend" "$TARGET_BASE/infrastructure/schemas"

echo "Cloning and updating complete!"
