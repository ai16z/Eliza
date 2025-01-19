#!/bin/bash

# Exit on any error
set -e

# Check if packages directory exists
if [ ! -d "packages" ]; then
    echo "Error: packages directory not found"
    exit 1
fi

# Initialize error flag
has_error=0

# Check each directory in packages/
for package_dir in packages/*/; do
    if [ -d "$package_dir" ]; then
        package_name=$(basename "$package_dir")
        
        # Check for __tests__ directory
        if [ ! -d "${package_dir}__tests__" ]; then
            echo "Error: ${package_name} is missing __tests__ directory"
            has_error=1
        fi
        
        # Check for README.md file
        if [ ! -f "${package_dir}README.md" ]; then
            echo "Error: ${package_name} is missing README.md file"
            has_error=1
        fi
    fi
done

# Exit with error if any checks failed
if [ $has_error -eq 1 ]; then
    exit 1
fi

echo "✅ All packages have required __tests__ directories and README.md files"
exit 0
