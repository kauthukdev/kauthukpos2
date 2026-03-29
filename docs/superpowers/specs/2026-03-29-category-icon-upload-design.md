# Category Icon Upload Design

## Goal

Allow admins to upload a small icon image for each product category from the existing category management screens.

## Scope

This change covers only the admin category CRUD flow.

Included:
- Add an optional uploaded icon to categories
- Show the current icon in the admin category list
- Show icon preview on add and edit screens
- Replace old icon files when a new icon is uploaded
- Remove the stored icon file when a category is deleted

Excluded:
- Showing category icons in the public catalogue or customer-facing POS flows
- Icon libraries, emoji selection, or generated icons
- Multiple icons per category

## Current State

Categories currently store basic metadata such as name, slug, active flag, and deleted_by. The add/edit forms only handle the category name, and the admin category list only shows the category name and actions.

## Recommended Approach

Store uploaded icon files in Laravel's public storage and save the relative storage path in a new nullable `icon` column on the `categories` table.

This fits the current Laravel/Inertia architecture with minimal disruption:
- Storage is managed through Laravel's filesystem rather than ad hoc public file writes
- The database stores only a lightweight path reference
- Replacing and deleting files remains straightforward

## Data Model

Add a nullable string column:
- `categories.icon`

Model updates:
- Add `icon` to `App\Models\Category::$fillable`

Serialized category payloads returned to Inertia should include:
- `icon`
- `icon_url` derived from the stored path when present

`icon_url` should resolve through Laravel's public storage URL so the frontend can display a thumbnail without reconstructing paths manually.

## Backend Flow

### Validation

On create and update:
- `name`: existing validation rules remain
- `icon`: optional image upload, restricted to common image formats and a reasonable file size limit

Recommended validation:
- `nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048`

### Create

If an icon file is uploaded:
- Store it under a dedicated folder such as `category-icons`
- Save the returned relative path in `categories.icon`

If no icon is uploaded:
- Store `null`

### Update

If a new icon file is uploaded:
- Store the new file
- Delete the previous file if one exists
- Update `categories.icon` with the new path

If no new file is uploaded:
- Keep the existing icon path unchanged

### Delete

On category deletion:
- Delete the stored icon file if one exists
- Continue the current soft-delete behavior

## Frontend Flow

### Add Category Screen

Extend the existing add category form to support multipart submission with:
- Existing category name field
- Optional icon file input
- Small local preview of the selected file before submit

### Edit Category Screen

Extend the existing edit form with:
- Existing category name field
- Optional icon replacement input
- Display of the current icon thumbnail when one exists
- Local preview for a newly selected replacement file

### Category List Screen

Add a small icon column to the admin category table:
- Show a compact thumbnail when an icon exists
- Show a simple placeholder such as `No icon` when absent

This gives admins quick confirmation that the icon is attached without expanding the scope into customer-facing UI.

## Error Handling

If validation fails:
- Reuse the existing Inertia form error flow

If file storage fails unexpectedly:
- Surface the failure through the existing redirect/error mechanism used by the controller

If deleting an old icon file fails:
- The request should not leave the category in a partially updated database state due to application logic ordering
- File deletion should happen only after the new file path is available

## Testing

Add a feature test that covers:
- Creating a category with an uploaded icon
- Updating a category with a replacement icon
- Verifying the icon path is persisted
- Verifying old files are removed when replaced

Use Laravel's storage fake for filesystem assertions.

## Implementation Notes

- Use Laravel storage APIs consistently instead of direct filesystem calls
- Prefer deriving `icon_url` server-side so React components stay simple
- Keep the icon optional so existing categories remain valid without backfill
