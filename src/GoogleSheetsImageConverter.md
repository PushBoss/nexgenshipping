# 📸 Google Sheets Image to URL Converter Script

This Google Apps Script automatically converts embedded images in your Google Sheet to URLs by uploading them to Google Drive and replacing them with `=IMAGE()` formulas.

---

## 🚀 Installation Instructions

### Step 1: Open Your Google Sheet
Open the Google Sheet where you have embedded product images.

### Step 2: Open Apps Script Editor
1. Click **Extensions** → **Apps Script** in the menu
2. This opens the Google Apps Script editor

### Step 3: Copy the Script
1. Delete any code in the editor
2. Copy and paste the complete script below:

```javascript
/**
 * NexGen Shipping - Image to URL Converter
 * Converts embedded images to Google Drive URLs for CSV export
 */

// Add custom menu when sheet opens
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🖼️ Image Tools')
    .addItem('📤 Convert Images to URLs', 'convertImagesToUrls')
    .addItem('ℹ️ Help', 'showHelp')
    .addToUi();
}

/**
 * Main function: Converts all embedded images to Google Drive URLs
 */
function convertImagesToUrls() {
  const ui = SpreadsheetApp.getUi();
  
  // Confirm with user
  const response = ui.alert(
    'Convert Images to URLs',
    'This will:\n\n' +
    '1. Find all embedded images in the active sheet\n' +
    '2. Upload them to Google Drive (in "NexGen Product Images" folder)\n' +
    '3. Replace images with =IMAGE(url) formulas\n\n' +
    'Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const images = sheet.getImages();
    
    if (images.length === 0) {
      ui.alert('No Images Found', 'No embedded images found in this sheet.', ui.ButtonSet.OK);
      return;
    }
    
    // Create or get the Drive folder
    const folder = getOrCreateFolder('NexGen Product Images');
    
    let convertedCount = 0;
    let errorCount = 0;
    const errors = [];
    
    // Process each image
    images.forEach((image, index) => {
      try {
        // Get image properties
        const blob = image.getAs('image/png');
        const anchorCell = image.getAnchorCell();
        const row = anchorCell.getRow();
        const col = anchorCell.getColumn();
        
        // Create filename
        const timestamp = new Date().getTime();
        const fileName = `product_image_r${row}_c${col}_${timestamp}.png`;
        
        // Upload to Google Drive
        const file = folder.createFile(blob.setName(fileName));
        
        // Make file publicly accessible
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        // Get the public URL
        const imageUrl = `https://drive.google.com/uc?export=view&id=${file.getId()}`;
        
        // Remove the image from the sheet
        image.remove();
        
        // Add IMAGE formula to the cell
        sheet.getRange(row, col).setFormula(`=IMAGE("${imageUrl}")`);
        
        convertedCount++;
        
      } catch (error) {
        errorCount++;
        errors.push(`Image ${index + 1}: ${error.toString()}`);
        Logger.log(`Error processing image: ${error}`);
      }
    });
    
    // Show results
    let message = `✅ Successfully converted ${convertedCount} image(s) to URLs!\n\n`;
    
    if (errorCount > 0) {
      message += `⚠️ ${errorCount} error(s) occurred:\n${errors.join('\n')}\n\n`;
    }
    
    message += `📁 Images saved to Google Drive folder: "NexGen Product Images"\n\n`;
    message += `💡 Tip: You can now export this sheet to CSV and the image URLs will be preserved!`;
    
    ui.alert('Conversion Complete', message, ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('Error', `An error occurred: ${error.toString()}`, ui.ButtonSet.OK);
    Logger.log(`Error in convertImagesToUrls: ${error}`);
  }
}

/**
 * Get or create a folder in Google Drive
 */
function getOrCreateFolder(folderName) {
  const folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

/**
 * Show help dialog
 */
function showHelp() {
  const ui = SpreadsheetApp.getUi();
  
  const helpText = 
    '📸 Image to URL Converter - Help\n\n' +
    'HOW TO USE:\n' +
    '1. Insert images directly into your sheet cells\n' +
    '2. Click "Image Tools" → "Convert Images to URLs"\n' +
    '3. Images will be uploaded to Google Drive\n' +
    '4. Cells will show =IMAGE(url) formulas\n' +
    '5. Export to CSV - URLs will be included!\n\n' +
    'TIPS:\n' +
    '• Images are saved to "NexGen Product Images" folder in your Drive\n' +
    '• Original images are removed from the sheet\n' +
    '• URLs are publicly accessible (view-only)\n' +
    '• You can run this multiple times safely\n\n' +
    'REQUIREMENTS:\n' +
    '• Images must be embedded in cells (not floating)\n' +
    '• You need Google Drive storage space\n\n' +
    'For bulk uploads, make sure your "image" column\n' +
    'contains these converted URLs!';
  
  ui.alert('Help', helpText, ui.ButtonSet.OK);
}

/**
 * Alternative: Convert specific column of images
 * Usage: convertColumnImages(9) - converts column 9 (I)
 */
function convertColumnImages(columnNumber) {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSheet();
  const images = sheet.getImages();
  const folder = getOrCreateFolder('NexGen Product Images');
  
  let convertedCount = 0;
  
  images.forEach((image, index) => {
    const anchorCell = image.getAnchorCell();
    const col = anchorCell.getColumn();
    
    // Only process images in the specified column
    if (col === columnNumber) {
      try {
        const blob = image.getAs('image/png');
        const row = anchorCell.getRow();
        const timestamp = new Date().getTime();
        const fileName = `product_image_r${row}_${timestamp}.png`;
        
        const file = folder.createFile(blob.setName(fileName));
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        const imageUrl = `https://drive.google.com/uc?export=view&id=${file.getId()}`;
        
        image.remove();
        sheet.getRange(row, col).setFormula(`=IMAGE("${imageUrl}")`);
        
        convertedCount++;
      } catch (error) {
        Logger.log(`Error processing image in row ${anchorCell.getRow()}: ${error}`);
      }
    }
  });
  
  ui.alert(`Converted ${convertedCount} images in column ${columnNumber}`);
}
```

### Step 4: Save the Script
1. Click the **disk icon** or press `Ctrl+S` (Windows) or `Cmd+S` (Mac)
2. Name the project: **"Image to URL Converter"**
3. Click **Save**

### Step 5: Authorize the Script
1. Close the Apps Script editor
2. **Reload your Google Sheet** (refresh the page)
3. You should see a new menu: **"🖼️ Image Tools"**
4. Click **Image Tools** → **Convert Images to URLs**
5. Google will ask for permissions - click **Continue** → **Allow**

---

## 📖 How to Use

### Method 1: Automatic Conversion (Recommended)

1. **Insert images** into your Google Sheet:
   - Right-click a cell → **Insert** → **Image** → **Image in cell**
   - Or drag and drop images directly into cells

2. **Run the converter**:
   - Click **Image Tools** → **Convert Images to URLs**
   - Click **YES** to confirm

3. **Wait for completion**:
   - The script will upload all images to Google Drive
   - Images will be replaced with `=IMAGE(url)` formulas
   - You'll see a success message

4. **Export to CSV**:
   - Click **File** → **Download** → **Comma Separated Values (.csv)**
   - The image URLs will be included in the CSV!

### Method 2: Convert Specific Column Only

If you only want to convert images in a specific column (e.g., column K which is the 11th column):

1. Open Apps Script editor (**Extensions** → **Apps Script**)
2. In the top dropdown that says "Select function", choose **convertColumnImages**
3. Edit the function call to specify your column number
4. Click **Run**

---

## 🎯 Example Workflow

### Before Conversion:
```
| Name          | Price  | Image        |
|---------------|--------|--------------|
| Baby Onesie   | $12.99 | [📷 embedded]|
| Infant Formula| $24.99 | [📷 embedded]|
```

### After Conversion:
```
| Name          | Price  | Image                                    |
|---------------|--------|------------------------------------------|
| Baby Onesie   | $12.99 | =IMAGE("https://drive.google.com/...")   |
| Infant Formula| $24.99 | =IMAGE("https://drive.google.com/...")   |
```

### In CSV Export:
```csv
Name,Price,Image
Baby Onesie,$12.99,https://drive.google.com/uc?export=view&id=abc123...
Infant Formula,$24.99,https://drive.google.com/uc?export=view&id=def456...
```

---

## 🔧 Features

### ✅ What It Does:
- 🔍 Automatically finds all embedded images in your sheet
- 📤 Uploads images to Google Drive (organized in "NexGen Product Images" folder)
- 🔗 Generates public, shareable URLs
- 🔄 Replaces images with `=IMAGE(url)` formulas
- 📊 Shows progress and results
- ✨ Preserves image URLs when exporting to CSV

### 🛡️ Safety Features:
- ✅ Asks for confirmation before processing
- ✅ Shows detailed results (success count, errors)
- ✅ Keeps original images in Google Drive as backup
- ✅ Non-destructive (can be run multiple times)
- ✅ Handles errors gracefully

---

## 💡 Pro Tips

### Tip 1: Organize Your Sheet First
Make sure your "image" column is properly set up before inserting images:
```
| name | description | category | ... | image | badge |
```

### Tip 2: Batch Insert Images
You can insert multiple images at once:
1. Select multiple cells in your image column
2. Insert images one by one
3. Run the converter once when done

### Tip 3: Check Google Drive Storage
Each image takes up space in your Google Drive. Make sure you have enough storage available.

### Tip 4: Verify URLs Before CSV Export
After conversion, the cells will show the images via `=IMAGE()` formulas. Verify they look correct before exporting to CSV.

### Tip 5: Use Consistent Image Sizes
For best results in your e-commerce site, use images with similar dimensions (e.g., 400x400px or 800x800px).

---

## 🐛 Troubleshooting

### Problem: "No Images Found" message
**Solution:** Make sure images are embedded **in cells**, not floating on top of the sheet.
- ✅ Right: Insert → Image → **Image in cell**
- ❌ Wrong: Insert → Image → Image over cells

### Problem: Permission errors
**Solution:** Re-authorize the script:
1. Open Apps Script editor
2. Click **Run** → **convertImagesToUrls**
3. Grant permissions again

### Problem: Images not showing after conversion
**Solution:** Check your Google Drive sharing settings:
1. Open the "NexGen Product Images" folder in Drive
2. Verify files are set to "Anyone with the link can view"

### Problem: CSV export shows formulas instead of URLs
**Solution:** In Google Sheets:
1. Select the image column
2. Copy the cells
3. Right-click → **Paste special** → **Paste values only**
4. Now export to CSV

---

## 📋 Column Names for CSV

Make sure your Google Sheet header matches the expected CSV format:

```
name,description,category,categoryId,price,costPrice,stockCount,soldCount,rating,reviewCount,image,inStock,badge
```

The **image** column (column 11) should contain the converted URLs after running the script.

---

## 🎓 Advanced Usage

### Custom Folder Location
Edit line 67 in the script to change the folder name:
```javascript
const folder = getOrCreateFolder('My Custom Folder Name');
```

### Different Image Format
Edit line 51 to change the output format:
```javascript
const blob = image.getAs('image/jpeg'); // or 'image/png', 'image/gif'
```

### Add Image Optimization
You can add image compression by integrating with Google's Image API (requires additional setup).

---

## ✨ What's Next?

After converting your images:

1. ✅ **Review** - Check that all images converted successfully
2. ✅ **Export** - Download as CSV (File → Download → CSV)
3. ✅ **Upload** - Use the CSV bulk upload in NexGen Shipping admin panel
4. ✅ **Preview** - You'll see image thumbnails in the upload preview!

---

## 📞 Support

If you encounter issues:
1. Check the **Apps Script Logs**: In the script editor, click **View** → **Logs**
2. Verify Google Drive permissions
3. Ensure images are properly embedded in cells
4. Make sure you have sufficient Google Drive storage

---

## 📄 License

This script is provided as-is for NexGen Shipping product management.
Feel free to modify and customize for your needs!

---

**Happy Converting! 🚀**

Now you can seamlessly work with images in Google Sheets and bulk upload them to your NexGen Shipping catalog!
