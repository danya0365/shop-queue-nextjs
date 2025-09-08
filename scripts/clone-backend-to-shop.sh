#!/bin/bash

# Function to copy and update files
copy_and_update() {
    local src_dir="$1"
    local dest_dir="${src_dir//backend/shop\/backend}"
    
    echo "Processing: $src_dir -> $dest_dir"
    
    # Create destination directory if it doesn't exist
    mkdir -p "$dest_dir"
    
    # Copy files from source to destination, skipping existing files
    find "$src_dir" -type f | while read -r src_file; do
        # Get relative path
        rel_path="${src_file#$src_dir/}"
        dest_file="$dest_dir/$rel_path"
        
        # Skip if destination file exists
        if [ -f "$dest_file" ]; then
            echo "Skipping existing file: $dest_file"
            continue
        fi
        
        # Create parent directory if it doesn't exist
        mkdir -p "$(dirname "$dest_file")"
        
        # Copy file and replace content
        sed 's/Backend/ShopBackend/g' "$src_file" > "$dest_file"
        echo "Created: $dest_file"
    done
}

# List of directories to process
directories=(
    "/Users/marosdeeuma/shop-queue-nextjs/src/application/dtos/backend"
    "/Users/marosdeeuma/shop-queue-nextjs/src/application/mappers/backend"
    "/Users/marosdeeuma/shop-queue-nextjs/src/application/services/backend"
    "/Users/marosdeeuma/shop-queue-nextjs/src/application/usecases/backend"
    "/Users/marosdeeuma/shop-queue-nextjs/src/domain/entities/backend"
    "/Users/marosdeeuma/shop-queue-nextjs/src/domain/repositories/backend"
    "/Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/mappers/backend"
    "/Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/repositories/backend"
    "/Users/marosdeeuma/shop-queue-nextjs/src/infrastructure/schemas/backend"
)

# Process each directory
for dir in "${directories[@]}"; do
    if [ -d "$dir" ]; then
        copy_and_update "$dir"
    else
        echo "Warning: Directory not found - $dir"
    fi
done

echo "Cloning process completed."
