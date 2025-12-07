# Bulk Upload CSV Format Guide

## Overview

The bulk upload feature now supports **enhanced CSV parsing** that can handle:
- ✅ Images embedded directly in cells
- ✅ Quoted fields with commas
- ✅ Multi-line descriptions
- ✅ Complex URLs and special characters

## CSV Format

### Required Columns
- `name` - Product name
- `category` - Must be `baby` or `pharmaceutical`
- `categoryId` - Subcategory identifier
- `price` - Selling price (numeric)

### Optional Columns
- `description` - Product description (can include commas if quoted)
- `costPrice` - Your cost for the product (for profit tracking)
- `stockCount` - Current inventory count
- `soldCount` - Total units sold (for analytics)
- `rating` - Product rating (0-5)
- `reviewCount` - Number of reviews
- `image` - Image URL (Unsplash, figma:asset, or any valid URL)
- `inStock` - true/false (defaults to true)
- `badge` - `Best Seller`, `Top Rated`, or `New`

## Valid Category IDs

### For Baby Products (`category: baby`):
- `baby-clothing-accessories`
- `baby-feeding`
- `baby-toys-entertainment`

### For Pharmaceuticals (`category: pharmaceutical`):
- `cold-cough-allergy`
- `pain-relief`
- `vitamins-supplements`

## Example CSV Files

### Basic Format
```csv
name,category,categoryId,price
Baby Onesie,baby,baby-clothing-accessories,12.99
Pain Relief Tablets,pharmaceutical,pain-relief,8.99
```

### Full Format with Analytics
```csv
name,description,category,categoryId,price,costPrice,stockCount,soldCount,rating,reviewCount,image,inStock,badge
"Baby Onesie","Soft cotton onesie for newborns",baby,baby-clothing-accessories,12.99,6.50,150,87,4.5,150,https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4,true,Best Seller
"Infant Formula","Nutritious formula for babies 0-12 months",baby,baby-feeding,24.99,15.00,200,123,4.8,200,https://images.unsplash.com/photo-1587049332358-5f0d5d2d01e5,true,
"Pain Relief Tablets","Fast-acting pain relief for adults",pharmaceutical,pain-relief,8.99,4.25,300,456,4.6,180,https://images.unsplash.com/photo-1584308666744-24d5c474f2ae,true,Top Rated
```

### Format with Embedded Images (Your Use Case)

If you have images embedded in Excel/Google Sheets cells, the CSV parser now handles this:

```csv
name,description,category,categoryId,price,costPrice,stockCount,soldCount,rating,reviewCount,image,inStock,badge
"Baby Romper Set","Cute romper set, sizes 0-24 months",baby,baby-clothing-accessories,18.50,9.00,75,45,4.7,89,"https://images.unsplash.com/photo-1522771930-78848d9293e8?w=500",true,New
"DayQuil Cold & Flu","Multi-symptom relief, 24 capsules",pharmaceutical,cold-cough-allergy,15.99,8.50,200,389,4.8,1245,"https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=500",true,Best Seller
```

## Advanced CSV Features

### Handling Commas in Fields
Use quotes around any field that contains commas:

```csv
name,description,price
"Baby Gift Set","Includes blanket, mittens, and hat",34.99
```

### Handling Quotes in Fields
Use double quotes to escape quotes:

```csv
name,description,price
"Baby ""Love"" Onesie","Onesie with ""Love"" text",12.99
```

### Empty Optional Fields
Leave optional fields empty, but keep the commas:

```csv
name,description,category,categoryId,price,costPrice,stockCount
Baby Bib,,baby,baby-clothing-accessories,5.99,,
```

## Analytics Fields Explained

### Cost Price
- Your cost to acquire the product
- Used to calculate profit margin
- Formula: `Profit = Price - CostPrice`
- Margin %: `((Price - CostPrice) / CostPrice) * 100`

### Stock Count
- Current inventory quantity
- Helps track stock levels
- Can trigger low stock alerts

### Sold Count
- Total units sold lifetime
- Tracks product performance
- Helps identify best sellers

## Import Process

1. **Prepare CSV**:
   - Use Excel, Google Sheets, or text editor
   - Follow the format above
   - Save as `.csv` file

2. **Upload**:
   - Admin Dashboard → Bulk Upload tab
   - Click "Choose CSV File"
   - Select your prepared CSV

3. **Review Preview**:
   - Check parsed data in preview table
   - Verify product names, prices, categories
   - Review analytics calculations (profit/unit, margin %)
   - Check for any parsing errors

4. **Import**:
   - Click "Import X Product(s)"
   - Products are saved to database
   - Success message shows count

## Common Issues & Solutions

### Issue: "Missing required columns"
**Solution**: Ensure your CSV has at minimum: `name`, `category`, `categoryId`, `price`

### Issue: "Invalid category"
**Solution**: Category must be exactly `baby` or `pharmaceutical` (lowercase)

### Issue: "Invalid categoryId"
**Solution**: Use one of the valid category IDs listed above

### Issue: Images not displaying
**Solution**: 
- Use full URLs starting with `https://`
- Unsplash URLs work best
- Ensure URLs are accessible

### Issue: Commas breaking fields
**Solution**: Wrap the entire field in quotes: `"This is a field, with commas"`

### Issue: Special characters causing errors
**Solution**: Ensure file is saved as UTF-8 encoding

## Tips for Large Imports

1. **Test First**: Import 2-3 products first to verify format
2. **Batch Processing**: Import in batches of 50-100 products
3. **Backup**: Keep original CSV file as backup
4. **Validation**: Use preview to catch errors before importing
5. **Incremental**: Add products incrementally rather than all at once

## Example: Converting from Your Format

If you currently have a spreadsheet with embedded images:

### Before (in Excel/Sheets):
```
Column A: Product Name
Column B: [Embedded Image]
Column C: Price
Column D: Category
```

### After (CSV format):
```csv
name,image,price,category,categoryId
"Product Name","[paste image URL here]",12.99,baby,baby-clothing-accessories
```

**Note**: Excel/Sheets embedded images need to be exported as URLs first. Right-click image → Copy image address, or use a tool to extract image URLs.

## Template Download

Use the "Download CSV Template" button in the Admin Dashboard → Bulk Upload tab to get a pre-formatted template with example data.

## Quick Reference

| Field | Required | Type | Example |
|-------|----------|------|---------|
| name | ✅ Yes | Text | "Baby Onesie" |
| description | ❌ No | Text | "Soft cotton, size 0-6M" |
| category | ✅ Yes | baby\|pharmaceutical | baby |
| categoryId | ✅ Yes | Text | baby-clothing-accessories |
| price | ✅ Yes | Number | 12.99 |
| costPrice | ❌ No | Number | 6.50 |
| stockCount | ❌ No | Number | 150 |
| soldCount | ❌ No | Number | 87 |
| rating | ❌ No | Number (0-5) | 4.5 |
| reviewCount | ❌ No | Number | 150 |
| image | ❌ No | URL | https://... |
| inStock | ❌ No | true\|false | true |
| badge | ❌ No | Text | Best Seller |

---

**Updated**: Supports embedded images and complex CSV formats
**Parser**: Enhanced to handle quoted fields and special characters
**Validation**: Real-time error checking and preview
