# Properties Module - Quick Start Guide

## Overview
The enhanced Properties module provides powerful search/filter capabilities and full property editing functionality.

## Quick Links
- **List Page**: `/{entity}/properties`
- **Detail Page**: `/{entity}/properties/{id}`
- **Full Docs**: `docs/PROPERTIES_FEATURES.md`
- **Summary**: `../PROPERTIES_ENHANCEMENT_SUMMARY.md`

## Properties List Page

### Finding Properties

1. **Search by Address/City/State/ZIP**
   ```
   Type in search box → Results filter in real-time
   ```

2. **Quick Sort**
   ```
   Use "Sort By" dropdown:
   - Newest First (default)
   - Oldest First
   - Address A-Z or Z-A
   - Price High-to-Low or Low-to-High
   ```

3. **Quick Filters**
   ```
   Occupancy:
   - All / Occupied / Vacant
   ```

4. **Advanced Filters** (Click "More Filters")
   ```
   - Property Type (9 types)
   - Price Range (5 brackets)
   - Listing Status (Listed/Not Listed)
   ```

### Filter Management

**Active Filters Display:**
```
Shows badges for each active filter
Click X on badge to remove individual filter
Click "Clear All Filters" to reset everything
```

**Results Count:**
```
Shows: "X of Y properties"
Updates as filters change
```

## Properties Detail Page

### Viewing Property Information

**Main Tabs:**
1. **Overview** - Basic property details
2. **Mortgage** - Loan information
3. **Insurance** - Insurance policies
4. **Utilities** - Utility accounts
5. **Tenant** - Tenant information
6. **Documents** - Uploaded documents

**Key Stats Displayed:**
- Current estimated value
- Purchase price
- Occupancy status
- For sale status
- Bed/bath/square footage

### Editing a Property

#### Starting Edit Mode
```
1. Click "Edit" button in header
2. Form fields become editable
3. Save/Cancel buttons appear
```

#### What Can Be Edited
```
Header Section:
- Address
- City, State, ZIP

Key Stats:
- Current Estimated Value
- Occupancy (checkbox)
- Listed for Sale (checkbox)
- Bedrooms, Bathrooms, Square Footage

Overview Tab:
- Property Type (dropdown)
- Purchase Date (date picker)
- Purchase Price
- Notes (textarea)
```

#### Saving Changes
```
1. Make edits to desired fields
2. Click "Save Changes" button
3. Wait for "Saving..." state
4. Success message appears (auto-dismisses in 3 seconds)
5. Edit mode closes automatically
```

#### Cancelling Changes
```
1. Click "Cancel" button
2. All edits are reverted
3. Edit mode closes
```

#### Error Handling
```
- Address is required field
- Error message displays if save fails
- Clear message explains what went wrong
- Error clears when you start editing again
```

## API Usage

### Get All Properties
```bash
curl "https://yoursite/api/properties?entity_id=doma_capital"
```

### Get Single Property
```bash
curl "https://yoursite/api/properties/property-id-123"
```

### Create Property
```bash
curl -X POST "https://yoursite/api/properties" \
  -H "Content-Type: application/json" \
  -d '{
    "entity_id": "doma_capital",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001"
  }'
```

### Update Property (Individual API)
```bash
curl -X PATCH "https://yoursite/api/properties/property-id-123" \
  -H "Content-Type: application/json" \
  -d '{
    "current_estimated_value": 600000,
    "is_occupied": true
  }'
```

### Update Property (Bulk API)
```bash
curl -X PATCH "https://yoursite/api/properties" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "property-id-123",
    "current_estimated_value": 600000
  }'
```

### Delete Property
```bash
curl -X DELETE "https://yoursite/api/properties/property-id-123"
```

## Common Tasks

### Filter to Show Only Vacant Properties
```
1. Click "More Filters"
2. Set Occupancy to "Vacant"
3. See only vacant properties
```

### Find Properties Over $1M
```
1. Click "More Filters"
2. Set Price Range to "$1M - $2M" or "Over $2M"
3. Results update immediately
```

### Update a Property's Value
```
1. Click on property in list
2. Click "Edit" button
3. Update "Current Value" in Key Stats
4. Click "Save Changes"
```

### Bulk Edit Multiple Properties
```
Use API endpoint:
PATCH /api/properties
Send multiple update operations

Note: UI doesn't support bulk edit
Must use API for batch operations
```

### Search for a Specific Address
```
1. Type address in search box
2. Results filter in real-time
3. Click property to view details
```

### Sort Properties by Address
```
1. Click "Sort By" dropdown
2. Select "Address (A-Z)" or "Address (Z-A)"
3. List reorders immediately
```

## Component Structure

```
Properties List (/properties)
├── Search Input
├── Sort Dropdown
├── Filters Toggle
├── Advanced Filters (collapsible)
│   ├── Occupancy Filter
│   ├── Property Type Filter
│   ├── Price Range Filter
│   └── Listing Status Filter
├── Active Filters Display
└── Property Cards Grid
    └── Individual Property Card
        ├── Address
        ├── Location
        ├── Badges (Occupied, For Sale)
        ├── Details (Bed/Bath/SF)
        └── Value

Properties Detail (/properties/[id])
├── Header
│   ├── Back Button
│   ├── Address (editable)
│   ├── Location (editable)
│   └── Edit Button
├── Key Stats (editable)
│   ├── Current Value
│   ├── Status
│   └── Details
├── Tab Navigation
│   ├── Overview
│   ├── Mortgage
│   ├── Insurance
│   ├── Utilities
│   ├── Tenant
│   └── Documents
└── Tab Content
    └── Dynamic based on active tab
```

## Keyboard Shortcuts (Future Enhancement)
```
(Not yet implemented)
- Cmd/Ctrl+E: Enter edit mode
- Esc: Cancel editing / Close modal
- Cmd/Ctrl+S: Save changes
- Cmd/Ctrl+F: Focus search
```

## Troubleshooting

### Search not finding property
- Check spelling of search term
- Try searching by different field (city vs. address)
- Clear filters that might be hiding results

### Can't save property
- Ensure Address field is filled
- Check browser console for errors
- Verify internet connection
- Try refreshing page and editing again

### Filters not working
- Clear all filters and reapply
- Refresh page
- Check that field data exists on properties
- Try different filter combination

### Edit button not appearing
- Ensure you're viewing full property detail page
- Refresh page
- Try different property

## Performance Tips

- Search across 1000s of properties is fast (client-side)
- Filters update instantly
- Edit operations are immediate (after save)
- Use sorting to organize large lists

## Browser Support

- ✓ Chrome 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Edge 90+
- ✓ Mobile browsers

## Data Types

### Required Fields
- `address` (string)
- `entity_id` (string)

### Optional Fields
- `city`, `state`, `zip_code` (string)
- `property_type` (string)
- `bedrooms`, `bathrooms` (number)
- `square_footage` (number)
- `purchase_price`, `current_estimated_value` (number)
- `purchase_date` (ISO date string)
- `is_occupied`, `is_listed` (boolean)
- `notes` (string)

## Support & Documentation

- Full documentation: `docs/PROPERTIES_FEATURES.md`
- Summary of changes: `PROPERTIES_ENHANCEMENT_SUMMARY.md`
- TypeScript types: `src/types/index.ts`
- API implementation: `src/app/api/properties/`

## Next Steps

1. Test the list page filters and sorting
2. Navigate to a property and try the edit feature
3. Experiment with the API endpoints
4. Read full documentation for advanced features
5. Review type definitions for integration

---
Last Updated: 2024
Status: Production Ready ✓
