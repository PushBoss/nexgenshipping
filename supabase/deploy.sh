#!/bin/bash

# NEX-GEN Shipping Database Deployment Script
# This script helps deploy the database schema to Supabase

set -e

echo "🚢 NEX-GEN Shipping Database Deployment"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Error: Supabase CLI is not installed${NC}"
    echo "Install it with: npm install -g supabase"
    echo "Or visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo -e "${GREEN}✓ Supabase CLI found${NC}"
echo ""

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}You need to login to Supabase first${NC}"
    echo "Running: supabase login"
    supabase login
fi

echo -e "${GREEN}✓ Authenticated with Supabase${NC}"
echo ""

# List available projects
echo "Available Supabase projects:"
supabase projects list

echo ""
echo -e "${YELLOW}Choose deployment method:${NC}"
echo "1) Deploy to linked project (recommended for production)"
echo "2) Deploy to local development instance"
echo "3) Generate SQL only (manual deployment)"
echo "4) Exit"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo -e "${YELLOW}Deploying to linked project...${NC}"
        
        # Check if project is linked
        if [ ! -f ".supabase/config.toml" ]; then
            echo -e "${YELLOW}No project linked. Let's link one now.${NC}"
            read -p "Enter your project reference ID: " project_ref
            supabase link --project-ref "$project_ref"
        fi
        
        echo ""
        echo -e "${YELLOW}Pushing database migrations...${NC}"
        supabase db push
        
        echo ""
        echo -e "${GREEN}✓ Database schema deployed successfully!${NC}"
        echo ""
        echo "Next steps:"
        echo "1. Go to your Supabase dashboard"
        echo "2. Navigate to Authentication > Users to create your first user"
        echo "3. Run this SQL to make a user an admin:"
        echo "   UPDATE public.user_profiles SET is_admin = true WHERE id = 'user-uuid';"
        echo "4. Set up Storage bucket for product images (name: product-images)"
        ;;
        
    2)
        echo ""
        echo -e "${YELLOW}Starting local Supabase instance...${NC}"
        
        # Check if already running
        if supabase status &> /dev/null; then
            echo -e "${YELLOW}Local instance is already running${NC}"
            read -p "Reset database? (y/n): " reset
            if [ "$reset" = "y" ]; then
                supabase db reset
                echo -e "${GREEN}✓ Database reset complete${NC}"
            fi
        else
            supabase start
            echo -e "${GREEN}✓ Local Supabase started${NC}"
        fi
        
        echo ""
        echo "Local development URLs:"
        supabase status
        
        echo ""
        echo -e "${GREEN}✓ Local database ready!${NC}"
        echo ""
        echo "Test credentials:"
        echo "Email: admin@example.com"
        echo "Password: password123"
        ;;
        
    3)
        echo ""
        echo -e "${YELLOW}Generating SQL file...${NC}"
        
        output_file="nexgen-schema-$(date +%Y%m%d-%H%M%S).sql"
        cp supabase/migrations/001_initial_schema.sql "$output_file"
        
        echo -e "${GREEN}✓ SQL file generated: $output_file${NC}"
        echo ""
        echo "Manual deployment steps:"
        echo "1. Go to your Supabase dashboard"
        echo "2. Navigate to SQL Editor"
        echo "3. Open the file: $output_file"
        echo "4. Copy and paste the contents"
        echo "5. Click 'Run' to execute"
        ;;
        
    4)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Deployment complete!${NC}"
echo ""
echo "📚 Documentation:"
echo "   - Schema README: supabase/SCHEMA_README.md"
echo "   - TypeScript types: src/types/database.types.ts"
echo ""
echo "🔗 Useful links:"
echo "   - Supabase Dashboard: https://app.supabase.com"
echo "   - Documentation: https://supabase.com/docs"
