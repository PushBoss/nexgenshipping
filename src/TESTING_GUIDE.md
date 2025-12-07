# Testing Guide - Nex-Gen Shipping

## 🧪 Complete Testing Checklist

This guide will walk you through testing all three new features to ensure everything works correctly.

---

## Prerequisites

✅ **Admin Access**
- Username: `admin@nexgenshipping.net`
- Password: `admin123`

✅ **Browser Console Open**
- Press `F12` to open developer tools
- Switch to Console tab to see logs

---

## Test 1: Enhanced CSV Bulk Upload

### 1.1 Download Template
**Steps:**
1. Login as admin
2. Navigate to Admin Dashboard → Bulk Upload tab
3. Click "Download CSV Template"

**Expected Result:**
- ✅ CSV file downloads successfully
- ✅ File named `product-import-template.csv`
- ✅ Contains 3 example rows with all fields

**Status:** [ ]

---

### 1.2 Test Basic CSV Upload
**Steps:**
1. Create a simple CSV file:
```csv
name,category,categoryId,price
Test Product 1,baby,baby-clothing-accessories,9.99
Test Product 2,pharmaceutical,pain-relief,12.50
```

2. Upload the file in Bulk Upload tab
3. Check preview

**Expected Result:**
- ✅ File uploads without errors
- ✅ Preview shows 2 products
- ✅ All fields parsed correctly
- ✅ Analytics columns show defaults

**Status:** [ ]

---

### 1.3 Test CSV with Quoted Fields (Enhanced Feature)
**Steps:**
1. Create CSV with commas in fields:
```csv
name,description,category,categoryId,price
"Baby Gift Set","Includes blanket, mittens, and hat",baby,baby-clothing-accessories,34.99
"Pain Relief, Extra Strength","Fast-acting, long-lasting relief",pharmaceutical,pain-relief,15.99
```

2. Upload and check preview

**Expected Result:**
- ✅ Commas inside quoted fields handled correctly
- ✅ Descriptions preserved with commas
- ✅ No parsing errors
- ✅ All 2 products in preview

**Status:** [ ]

---

### 1.4 Test CSV with Analytics Fields
**Steps:**
1. Use template file or create:
```csv
name,category,categoryId,price,costPrice,stockCount,soldCount
Analytics Test,baby,baby-feeding,19.99,10.00,200,55
```

2. Upload and check preview table

**Expected Result:**
- ✅ Cost Price shows: $10.00
- ✅ Stock Qty shows: 200 units
- ✅ Sold shows: 55 sold
- ✅ Profit/Unit shows: $9.99 (100%)
- ✅ Calculations are correct

**Status:** [ ]

---

### 1.5 Test Error Validation
**Steps:**
1. Create invalid CSV:
```csv
name,category,categoryId,price
Missing Category,,baby-clothing-accessories,9.99
Invalid Category,invalid,baby-clothing-accessories,9.99
Missing Price,baby,baby-clothing-accessories,
```

2. Upload file

**Expected Result:**
- ✅ Error messages displayed in red box
- ✅ Specific row numbers shown (Row 2, Row 3, Row 4)
- ✅ Describes each error clearly
- ✅ Import button disabled

**Status:** [ ]

---

### 1.6 Test Bulk Import
**Steps:**
1. Upload valid CSV with 5+ products
2. Review preview
3. Click "Import X Products"
4. Check Products tab

**Expected Result:**
- ✅ Success toast shows "Successfully imported X products"
- ✅ Products appear in Products tab
- ✅ All data preserved correctly
- ✅ Preview clears after import

**Status:** [ ]

---

## Test 2: Bulk Delete System

### 2.1 Access Bulk Delete Tab
**Steps:**
1. Admin Dashboard → Bulk Delete tab

**Expected Result:**
- ✅ Tab loads without errors
- ✅ Three product count cards visible
- ✅ Shows correct counts for Baby, Pharma, Total
- ✅ Three delete action cards visible

**Status:** [ ]

---

### 2.2 Test Delete Baby Products
**Steps:**
1. Note current baby product count
2. Click "Delete Baby" button
3. Review confirmation dialog
4. Click "Yes, Delete X"
5. Check Products tab

**Expected Result:**
- ✅ Confirmation shows correct count
- ✅ Lists baby products to be deleted
- ✅ Warning message visible
- ✅ After confirm, baby products removed
- ✅ Pharmaceutical products untouched
- ✅ Success toast appears

**Status:** [ ]

---

### 2.3 Test Delete Pharmaceutical Products
**Steps:**
1. Note current pharma count
2. Click "Delete Pharma" button
3. Review confirmation
4. Confirm deletion
5. Verify in Products tab

**Expected Result:**
- ✅ Only pharma products deleted
- ✅ Baby products remain
- ✅ Count updates correctly
- ✅ UI refreshes properly

**Status:** [ ]

---

### 2.4 Test Purge All (Complete Delete)
**Steps:**
1. Ensure you have products in both categories
2. Note total product count
3. Click "Purge All" (red danger button)
4. Review warning dialog carefully
5. Confirm purge
6. Check Products tab

**Expected Result:**
- ✅ Extra warning in confirmation dialog
- ✅ Shows breakdown of products to delete
- ✅ Red "danger" styling visible
- ✅ After confirm, ALL products removed
- ✅ Product count shows 0
- ✅ Empty state message in Products tab

**Status:** [ ]

---

### 2.5 Test Safety Features
**Steps:**
1. After purging, try to delete again
2. Check button states

**Expected Result:**
- ✅ All delete buttons are disabled
- ✅ Shows "0 products" in cards
- ✅ Cannot accidentally delete from empty state

**Status:** [ ]

---

### 2.6 Test Cancel Operations
**Steps:**
1. Add some products back
2. Click "Delete Baby"
3. Click "Cancel" in dialog
4. Check products remain

**Expected Result:**
- ✅ Dialog closes without deleting
- ✅ Products still present
- ✅ No errors in console

**Status:** [ ]

---

## Test 3: Supabase Backend Integration

### 3.1 Check Supabase Status
**Steps:**
1. Open Admin Dashboard
2. Look at top-right corner for status badge

**Expected Result:**
- ✅ Badge shows "Supabase Active" (green) OR
- ✅ Badge shows "Backend Offline" (red) OR
- ✅ Badge shows "Local Mode" (gray) if disabled

**Status:** [ ]

---

### 3.2 Test Data Management Panel
**Steps:**
1. Scroll to "Data Management" panel (top of admin page)
2. Review current configuration

**Expected Result:**
- ✅ Panel shows Supabase Mode or Local Mode
- ✅ Shows local product count
- ✅ Shows current data source
- ✅ Action buttons visible

**Status:** [ ]

---

### 3.3 Test Connection Check
**Steps:**
1. In Data Management panel
2. Click "Check Connection" button
3. Wait for response

**Expected Result:**
- ✅ Button shows "Checking..." while processing
- ✅ Green alert appears if connected
- ✅ Shows product count in database
- ✅ Toast notification confirms status

**Status:** [ ]

---

### 3.4 Test Export to CSV
**Steps:**
1. Ensure you have products in database
2. Click "Export CSV" button
3. Check downloads folder

**Expected Result:**
- ✅ CSV file downloads
- ✅ Filename includes date (e.g., `products-export-2025-12-01.csv`)
- ✅ Contains all products
- ✅ All fields preserved
- ✅ Success toast appears

**Status:** [ ]

---

### 3.5 Test Migration to Supabase
**Steps:**
1. Set `useSupabase: false` in `/utils/config.ts`
2. Refresh page
3. Add 3-5 products manually
4. Set `useSupabase: true` 
5. Refresh page
6. Click "Migrate X Products to Supabase"
7. Confirm migration

**Expected Result:**
- ✅ Confirmation dialog appears
- ✅ Shows correct product count
- ✅ Migration completes successfully
- ✅ Products now in Supabase
- ✅ Subsequent refreshes preserve data

**Status:** [ ]

---

### 3.6 Test Data Persistence
**Steps:**
1. With Supabase enabled, add a product
2. Note product name/details
3. Refresh browser (F5)
4. Check if product still exists

**Expected Result:**
- ✅ Product persists after refresh
- ✅ All details preserved
- ✅ No data loss

**Status:** [ ]

---

### 3.7 Test Local Mode Fallback
**Steps:**
1. Set `useSupabase: false`
2. Refresh page
3. Check Data Management panel

**Expected Result:**
- ✅ Status badge shows "Local Mode"
- ✅ Panel shows info about local storage
- ✅ No migration button shown
- ✅ Products stored in browser only

**Status:** [ ]

---

## Integration Tests

### INT-1: Upload then Delete
**Steps:**
1. Bulk upload 10 baby products
2. Bulk upload 10 pharma products
3. Delete all baby products
4. Verify pharma products remain

**Expected Result:**
- ✅ All operations complete successfully
- ✅ Correct products deleted
- ✅ Count accurate throughout

**Status:** [ ]

---

### INT-2: Export, Purge, Re-import
**Steps:**
1. Have 20+ products
2. Export to CSV
3. Purge all products
4. Import from exported CSV
5. Compare counts

**Expected Result:**
- ✅ Export captures all products
- ✅ Purge removes everything
- ✅ Import restores all products
- ✅ Data matches original

**Status:** [ ]

---

### INT-3: Supabase Round-Trip
**Steps:**
1. Add product via admin form
2. Check it saves to Supabase
3. Export CSV
4. Verify product in export
5. Delete product
6. Re-import from CSV
7. Check product restored

**Expected Result:**
- ✅ Product survives full cycle
- ✅ All data preserved
- ✅ No errors at any step

**Status:** [ ]

---

## Browser Compatibility Tests

### Test on Chrome
**Status:** [ ]

### Test on Firefox
**Status:** [ ]

### Test on Safari
**Status:** [ ]

### Test on Edge
**Status:** [ ]

### Test on Mobile Chrome
**Status:** [ ]

### Test on Mobile Safari
**Status:** [ ]

---

## Performance Tests

### PERF-1: Large CSV Upload
**Steps:**
1. Create CSV with 100 products
2. Upload and import
3. Measure time to complete

**Expected Result:**
- ✅ Completes in < 30 seconds
- ✅ No browser hang
- ✅ All products imported

**Time Taken:** _______

**Status:** [ ]

---

### PERF-2: Bulk Delete Performance
**Steps:**
1. Have 100+ products
2. Delete all via purge
3. Measure time

**Expected Result:**
- ✅ Completes in < 10 seconds
- ✅ UI responsive throughout

**Time Taken:** _______

**Status:** [ ]

---

## Error Handling Tests

### ERR-1: Offline Mode
**Steps:**
1. Disconnect internet
2. Try to add product
3. Check error handling

**Expected Result:**
- ✅ Graceful error message
- ✅ Fallback to local storage
- ✅ Product still saved locally
- ✅ Syncs when online again

**Status:** [ ]

---

### ERR-2: Invalid CSV
**Steps:**
1. Upload corrupted CSV file
2. Upload CSV with wrong encoding
3. Upload non-CSV file

**Expected Result:**
- ✅ Clear error messages
- ✅ No app crash
- ✅ Suggestions for fixing

**Status:** [ ]

---

## Security Tests

### SEC-1: Admin Access
**Steps:**
1. Try accessing admin without login
2. Verify protection

**Expected Result:**
- ✅ Redirects to login
- ✅ Shows "Access Denied"
- ✅ Admin features hidden

**Status:** [ ]

---

## Regression Tests

### REG-1: Existing Features Still Work
**Steps:**
1. Add product manually (old way)
2. Edit product
3. Create sale
4. Assign badge
5. Delete single product

**Expected Result:**
- ✅ All existing features work
- ✅ No breaking changes
- ✅ UI unchanged for old features

**Status:** [ ]

---

## Final Checklist

Before marking complete, verify:

- [ ] All Test 1 items (CSV Upload) passing
- [ ] All Test 2 items (Bulk Delete) passing
- [ ] All Test 3 items (Supabase) passing
- [ ] Integration tests passing
- [ ] At least 2 browsers tested
- [ ] Performance acceptable
- [ ] Error handling works
- [ ] No regressions found
- [ ] Documentation matches behavior
- [ ] Console has no critical errors

---

## Test Results Summary

**Date Tested:** __________

**Tested By:** __________

**Total Tests:** 40+

**Passed:** ___ / ___

**Failed:** ___ / ___

**Blocked:** ___ / ___

**Overall Status:** ⬜ PASS  ⬜ FAIL  ⬜ PARTIAL

---

## Known Issues

List any bugs or issues found during testing:

1. 
2. 
3. 

---

## Notes

Additional observations or comments:


---

**Testing Complete!** 🎉

If all tests pass, your Nex-Gen Shipping admin system is production-ready!
