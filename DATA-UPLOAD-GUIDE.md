# Data Upload Guide

## 📊 Overview

The Data Sources panel allows you to upload CSV files or connect to APIs to power your dashboard widgets with real data.

## 🎯 Features Added

### 1. **Example CSV Templates** ✨

Click the "Examples" dropdown to download pre-formatted CSV templates:

- **All Templates** - Comprehensive file with all formats
- **Time Series** - For Line/Bar charts (date-based data)
- **Categories** - For Pie charts (category breakdowns)
- **KPI Metrics** - For KPI cards (metrics with targets)

### 2. **Format Guide**

Expandable panel showing:

- Required CSV format
- Column naming conventions
- Example data structures

### 3. **Multiple Upload Methods**

- **CSV Upload** - Drag & drop or browse files
- **API Connection** - Enter endpoint URL and fetch

## 📁 CSV Format Requirements

### Time Series Data (Line/Bar Charts)

```csv
date,revenue,expenses,profit
2024-01,45000,32000,13000
2024-02,52000,35000,17000
2024-03,48000,33000,15000
```

**Columns:**

- `date` - Time period (YYYY-MM, YYYY-MM-DD, etc.)
- Numeric columns for values
- Multiple value columns supported

### Category Data (Pie Charts)

```csv
category,value,percentage
Product Sales,45000,35
Services,32000,25
Subscriptions,28000,22
```

**Columns:**

- `category` - Category name
- `value` - Numeric value
- `percentage` - Optional percentage

### KPI Metrics

```csv
metric,value,target,trend,format
Revenue,125000,150000,8.5,currency
Users,5420,6000,12.3,number
Conversion,3.2,4.0,-2.1,percent
```

**Columns:**

- `metric` - Metric name
- `value` - Current value
- `target` - Target value (optional)
- `trend` - Percentage change (optional)
- `format` - Display format: `currency`, `number`, `percent`

## 🚀 How to Use

### Step 1: Download Example

1. Click **"Examples"** dropdown in Data Sources panel
2. Select the template for your widget type
3. File downloads automatically

### Step 2: Edit the CSV

1. Open in Excel, Google Sheets, or text editor
2. Replace example data with your data
3. Keep the same column structure
4. Save as CSV

### Step 3: Upload

1. Click **"Choose File"** in Data Sources panel
2. Select your CSV file
3. File is parsed and stored
4. See confirmation with row count

### Step 4: Connect to Widget

(Future feature - currently shows demo data)

1. Select a widget
2. Choose data source in Property Editor
3. Map columns to widget fields
4. Widget updates with your data

## 🔌 API Connection

### How to Connect

1. Enter API endpoint URL
2. Click **"Fetch Data"**
3. Data is fetched and stored
4. See confirmation with row count

### API Requirements

- Must return JSON
- Should be an array of objects
- Each object represents one data row
- CORS must be enabled

### Example API Response

```json
[
  {
    "date": "2024-01",
    "revenue": 45000,
    "expenses": 32000
  },
  {
    "date": "2024-02",
    "revenue": 52000,
    "expenses": 35000
  }
]
```

## 📋 Data Source Management

### View Sources

All uploaded/connected data sources appear in the list showing:

- Source name
- Number of rows
- Number of columns
- Source type (CSV or API)

### Delete Sources

Click the trash icon next to any source to remove it.

### Storage

Data sources are stored in browser localStorage and persist across sessions.

## 💡 Tips

### CSV Best Practices

1. **First row = headers** - Always include column names
2. **Consistent format** - Use same date format throughout
3. **No empty rows** - Remove blank rows
4. **Clean data** - Remove special characters
5. **UTF-8 encoding** - Save with UTF-8 encoding

### Common Issues

**Upload fails?**

- Check CSV has headers in first row
- Ensure no special characters in column names
- Verify file is actually CSV (not Excel)

**Data looks wrong?**

- Check delimiter is comma (,)
- Verify no commas in data values
- Use quotes for text with commas

**API fails?**

- Check URL is correct
- Verify CORS is enabled
- Ensure API returns JSON array
- Check browser console for errors

## 🎨 Widget Data Mapping (Coming Soon)

Future feature will allow:

- Select data source per widget
- Map CSV columns to widget fields
- Preview data in widget
- Refresh data from API
- Filter and transform data

## 📊 Example Use Cases

### Sales Dashboard

1. Download "Time Series" template
2. Add your monthly sales data
3. Upload CSV
4. Create Line Chart widget
5. Map to your data

### Product Analytics

1. Download "Categories" template
2. Add your product categories and sales
3. Upload CSV
4. Create Pie Chart widget
5. See distribution

### KPI Dashboard

1. Download "KPI" template
2. Add your key metrics
3. Upload CSV
4. Create KPI Card widgets
5. Track performance

## 🔒 Privacy & Security

- **Local Storage** - All data stored in your browser
- **No Server** - Data never sent to external servers
- **Your Control** - Delete anytime
- **Private** - Only you can see your data

## 🆘 Need Help?

1. Click the **"Format Guide"** in the upload panel
2. Download **"All Templates"** to see all formats
3. Check this guide for detailed instructions
4. Verify your CSV matches the example format

---

**Status**: ✅ Fully implemented and ready to use!
