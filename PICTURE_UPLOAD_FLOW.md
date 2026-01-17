# Picture Upload Flow Documentation

This document provides a comprehensive overview of the profile picture upload system in TeamFinder, including all functions, endpoints, and the complete flow from image selection to storage and retrieval.

## Table of Contents

1. [Overview](#overview)
2. [Architecture Components](#architecture-components)
3. [Upload Flow](#upload-flow)
   - [Image Selection & Cropping](#1-image-selection--cropping)
   - [Image Processing](#2-image-processing)
   - [File Upload to Storage](#3-file-upload-to-storage)
   - [URL Generation & Database Update](#4-url-generation--database-update)
4. [Retrieval Flow](#retrieval-flow)
5. [Deletion Flow](#deletion-flow)
6. [Storage System](#storage-system)
7. [API Endpoints Reference](#api-endpoints-reference)
8. [Function Reference](#function-reference)
9. [Frontend Components](#frontend-components)
10. [Backend Services](#backend-services)

---

## Overview

TeamFinder uses a multi-step profile picture upload system that includes:

- **Image Selection** with file validation
- **Client-side Image Cropping** using React Image Crop
- **Canvas-based Image Processing** for preview generation
- **File Upload** to Supabase Storage
- **Signed URL Generation** for secure access
- **Database URL Storage** for quick retrieval
- **Base64 Fallback** for immediate display

The system supports:
- **Upload:** Select, crop, and upload profile pictures
- **Retrieval:** Fetch profile pictures via URL or Base64
- **Deletion:** Remove profile pictures from storage and database

---

## Architecture Components

### Frontend Components

1. **Profile.tsx**
   - Main profile page component
   - Manages profile picture state
   - Handles upload modal trigger
   - Fetches and displays profile picture

2. **Modal.tsx**
   - Modal wrapper for image cropper
   - Provides backdrop and close functionality

3. **ImageCropper.tsx**
   - Image selection and cropping interface
   - Canvas preview generation
   - File upload orchestration
   - Supabase signed URL generation

4. **setCanvasPreview.ts**
   - Canvas rendering utility
   - Handles image cropping and scaling
   - Generates cropped image preview

### Backend Components

1. **UserController** (`/users/*`)
   - Handles all profile picture HTTP requests
   - Coordinates between services

2. **ImageHandlerService**
   - Manages Supabase Storage operations
   - Handles file upload, retrieval, and deletion
   - Communicates with Supabase Storage API

3. **UserService**
   - Manages user database operations
   - Saves and removes picture URLs
   - Updates user records

4. **UserRepository**
   - Database operations for user picture URLs
   - Custom queries for URL management

### External Services

- **Supabase Storage:** Cloud storage for image files
- **Supabase Client (Frontend):** For signed URL generation

---

## Upload Flow

### 1. Image Selection & Cropping

**Frontend:** `Profile.tsx` → `Modal.tsx` → `ImageCropper.tsx`

#### Step-by-Step Process:

1. **User Triggers Upload** (`Profile.tsx`)
   - User clicks "Upload Profile Picture" button
   - Opens modal via `setModalOpen(true)`
   - Modal component renders `ImageCropper`

2. **File Selection** (`ImageCropper.onSelectFile()`)
   - User selects image file via file input
   - File validation:
     - Checks file exists
     - Validates minimum dimensions (150x150px)
     - Sets error if image too small
   - Reads file using `FileReader.readAsDataURL()`
   - Converts file to data URL string
   - Sets `imageSrc` state with data URL

3. **Image Loading** (`ImageCropper.onImageLoad()`)
   - Image loads into DOM
   - Calculates initial crop dimensions
   - Creates centered crop area (25% of image, 1:1 aspect ratio)
   - Uses `makeAspectCrop()` and `centerCrop()` from react-image-crop
   - Sets initial crop state

4. **Image Cropping** (`ReactCrop` component)
   - User adjusts crop area interactively
   - Crop constraints:
     - Circular crop enabled
     - Minimum width: 150px
     - Aspect ratio: 1:1 (square)
   - Crop state updates on user interaction
   - Real-time preview available

#### Functions Involved:

- `Profile.tsx` - Modal state management
- `Modal.tsx` - Modal wrapper rendering
- `ImageCropper.onSelectFile()` - File selection handler
- `ImageCropper.onImageLoad()` - Image load handler
- `ReactCrop` - Cropping component

---

### 2. Image Processing

**Frontend:** `ImageCropper.tsx` → `setCanvasPreview.ts`

#### Step-by-Step Process:

1. **User Confirms Crop** (`ImageCropper.handleSetProfilePicture()`)
   - User clicks "Set as Profile Picture" button
   - Validates image and canvas refs exist

2. **Canvas Preview Generation** (`setCanvasPreview()`)
   - Converts crop coordinates from percentage to pixels
   - Uses `convertToPixelCrop()` to transform crop
   - Calculates device pixel ratio for retina displays
   - Sets canvas dimensions based on crop size
   - Applies scaling for high-DPI screens
   - Draws cropped image to canvas:
     - Translates canvas to crop origin
     - Draws full image
     - Crops to selected area
   - Applies high-quality image smoothing

3. **Data URL Generation**
   - Converts canvas to data URL using `canvas.toDataURL()`
   - Format: `data:image/png;base64,...`
   - Updates profile picture preview immediately
   - Calls `updateProfilePic(dataURL)` to update parent state

4. **Blob Conversion** (`ImageCropper.dataURLtoBlob()`)
   - Parses data URL string
   - Extracts base64 data and MIME type
   - Decodes base64 to binary
   - Creates `Blob` object with proper MIME type
   - Returns blob for file upload

#### Functions Involved:

- `ImageCropper.handleSetProfilePicture()` - Upload trigger
- `setCanvasPreview()` - Canvas rendering
- `convertToPixelCrop()` - Coordinate conversion
- `ImageCropper.dataURLtoBlob()` - Blob creation
- `canvas.toDataURL()` - Data URL generation

---

### 3. File Upload to Storage

**Frontend:** `ImageCropper.tsx` → **Backend:** `POST /users/upload`

#### Step-by-Step Process:

1. **Token Extraction** (`ImageCropper.tsx`)
   - Gets JWT token from localStorage
   - Decodes token using `jwtDecode`
   - Extracts user email from token subject
   - Extracts email prefix (before @) for filename

2. **FormData Preparation**
   - Creates `FormData` object
   - Converts blob to file with name: `{emailPrefix}.png`
   - Appends file to FormData as "file"

3. **Upload Request** (`POST /users/upload`)
   - Sends multipart/form-data request
   - Headers:
     - `Content-Type: multipart/form-data`
     - `Authorization: Bearer {token}`
   - Body: FormData with file blob

4. **Backend Processing** (`UserController.uploadImage()`)
   - Extracts JWT token from Authorization header
   - Validates token and extracts user email
   - Receives `MultipartFile` from request
   - Creates temporary file from MultipartFile
   - Transfers file data to temp file
   - Calls `ImageHandlerService.uploadFile()`

5. **Supabase Upload** (`ImageHandlerService.uploadFile()`)
   - Sanitizes filename (removes special characters)
   - Constructs Supabase Storage URL:
     - `{supabaseUrl}/storage/v1/object/{bucketName}/{fileName}`
   - Creates HTTP connection to Supabase
   - Sets request headers:
     - `Authorization: Bearer {serviceKey}`
     - `Content-Type: {detected MIME type}`
     - `x-upsert: true` (overwrites if exists)
     - `Content-Length: {file size}`
   - Streams file data to Supabase (8KB buffer)
   - Reads response code
   - Returns success/failure message

#### Functions Involved:

- `ImageCropper.handleSetProfilePicture()` - Upload initiation
- `jwtDecode()` - Token decoding
- `UserController.uploadImage()` - Upload endpoint
- `ImageHandlerService.uploadFile()` - Storage upload
- `File.transferTo()` - File transfer
- `HttpURLConnection` - HTTP communication

---

### 4. URL Generation & Database Update

**Frontend:** `ImageCropper.tsx` → **Backend:** `POST /users/uploadImageURL`

#### Step-by-Step Process:

1. **Signed URL Generation** (`ImageCropper.tsx`)
   - Uses Supabase client to create signed URL
   - Bucket: "image-store"
   - File: `{emailPrefix}.png`
   - Expiration: 1 year (31536000 seconds)
   - URL encoding applied to filename
   - Gets signed URL from Supabase response

2. **URL Upload Request** (`POST /users/uploadImageURL`)
   - Sends signed URL to backend
   - Request body: `{ fileURL: signedUrl }`
   - Headers: `Authorization: Bearer {token}`

3. **Backend Processing** (`UserController.uploadPictureURL()`)
   - Extracts JWT token
   - Validates token and extracts user email
   - Receives `ImageRequestDTO` with fileURL
   - Calls `UserService.saveFileURL()`

4. **Database Update** (`UserService.saveFileURL()`)
   - Calls `UserRepository.addPictureURL()`
   - Updates user record with picture URL
   - Stores signed URL in database

5. **Modal Closure**
   - Closes upload modal
   - Updates profile picture display
   - Shows success message

#### Functions Involved:

- `ImageCropper.handleSetProfilePicture()` - URL generation
- `supabase.storage.createSignedUrl()` - Signed URL creation
- `UserController.uploadPictureURL()` - URL endpoint
- `UserService.saveFileURL()` - Service layer
- `UserRepository.addPictureURL()` - Database update

---

## Retrieval Flow

**Frontend:** `Profile.tsx` → **Backend:** `GET /users/fetchProfilePic`

### Step-by-Step Process:

1. **Profile Page Load** (`Profile.tsx`)
   - Component mounts
   - Calls `fetchProfilePic()` in `useEffect`

2. **Fetch Request** (`Profile.fetchProfilePic()`)
   - Gets JWT token from localStorage
   - Sends GET request to `/users/fetchProfilePic`
   - Headers: `Authorization: Bearer {token}`

3. **Backend Processing** (`UserController.getImage()`)
   - Extracts JWT token
   - Validates token and extracts user email
   - Extracts email prefix (before @)
   - Constructs filename: `{prefix}.png`
   - Calls `ImageHandlerService.getFile()`

4. **File Retrieval** (`ImageHandlerService.getFile()`)
   - Constructs Supabase Storage URL
   - Creates HTTP GET request
   - Sets Authorization header with service key
   - Reads file bytes from Supabase
   - Returns byte array

5. **Base64 Encoding** (`UserController.getImage()`)
   - Encodes byte array to Base64 string
   - Prepends data URL prefix: `data:image/png;base64,`
   - Returns complete data URL string

6. **Frontend Display** (`Profile.tsx`)
   - Receives data URL or "Fail" string
   - If "Fail": sets default profile picture
   - If success: sets profile picture URL
   - Updates UI with profile picture

#### Functions Involved:

- `Profile.fetchProfilePic()` - Fetch initiation
- `UserController.getImage()` - Retrieval endpoint
- `ImageHandlerService.getFile()` - Storage retrieval
- `Base64.getEncoder().encodeToString()` - Base64 encoding

---

## Deletion Flow

**Frontend:** `Profile.tsx` → **Backend:** `DELETE /users/deleteProfilePicture` + `DELETE /users/deleteImageURL`

### Step-by-Step Process:

1. **User Triggers Deletion** (`Profile.deleteProfilePicture()`)
   - User clicks "Delete Profile Picture"
   - Calls deletion function

2. **Storage Deletion** (`DELETE /users/deleteProfilePicture`)
   - Extracts JWT token
   - Validates token and extracts user email
   - Extracts email prefix
   - Constructs filename: `{prefix}.png`
   - Calls `ImageHandlerService.deleteFile()`

3. **Supabase Deletion** (`ImageHandlerService.deleteFile()`)
   - Constructs Supabase Storage DELETE URL
   - Creates HTTP DELETE request
   - Sets Authorization header
   - Sends deletion request
   - Returns deletion result

4. **Database URL Removal** (`DELETE /users/deleteImageURL`)
   - Extracts JWT token
   - Validates token
   - Calls `UserService.deleteFileURL()`
   - Removes picture URL from database

5. **Frontend Update** (`Profile.tsx`)
   - Sets profile picture to default image
   - Updates UI immediately

#### Functions Involved:

- `Profile.deleteProfilePicture()` - Deletion trigger
- `UserController.deleteImage()` - Storage deletion endpoint
- `ImageHandlerService.deleteFile()` - Storage deletion
- `UserController.deleteImageURL()` - URL deletion endpoint
- `UserService.deleteFileURL()` - Database URL removal
- `UserRepository.removePictureURL()` - Database update

---

## Storage System

### Supabase Storage

**Bucket:** `image-store`

**File Naming Convention:**
- Format: `{emailPrefix}.png`
- Example: `john.doe@example.com` → `john.doe.png`
- Special characters sanitized during upload

**File Operations:**
- **Upload:** POST with `x-upsert: true` header (overwrites existing)
- **Retrieve:** GET with service key authorization
- **Delete:** DELETE with service key authorization

**Access Control:**
- Service key used for backend operations
- Signed URLs for frontend access (1-year expiration)
- Public access not enabled

### Configuration

Required properties in `application.properties`:

```properties
# Supabase Configuration
supabase.url=https://allzrnbdqtbuulmoiclr.supabase.co
supabase.service_key={service-role-key}
```

Frontend Supabase client (hardcoded in `ImageCropper.tsx`):
```typescript
const supabase = createClient(
  "https://allzrnbdqtbuulmoiclr.supabase.co",
  "{anon-key}"
);
```

---

## API Endpoints Reference

### Profile Picture Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/users/upload` | Upload image file to storage | `MultipartFile` | `String` ("Passed"/"Failed") |
| POST | `/users/uploadImageURL` | Save picture URL to database | `ImageRequestDTO` | `ResponseEntity<String>` |
| GET | `/users/fetchProfilePic` | Retrieve profile picture | None | `String` (Base64 data URL or "Fail") |
| DELETE | `/users/deleteProfilePicture` | Delete image from storage | None | `ResponseEntity<String>` |
| DELETE | `/users/deleteImageURL` | Remove URL from database | None | `ResponseEntity<String>` |

### DTOs

**ImageRequestDTO:**
```java
{
  fileURL: String
}
```

---

## Function Reference

### Frontend Functions

#### Profile.tsx

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `updateProfilePic()` | Update profile picture state | `imgSrc: string` | `void` |
| `fetchProfilePic()` | Fetch profile picture from backend | None | `Promise<void>` |
| `deleteProfilePicture()` | Delete profile picture | None | `Promise<void>` |

#### ImageCropper.tsx

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `onSelectFile()` | Handle file selection | `e: ChangeEvent<HTMLInputElement>` | `void` |
| `onImageLoad()` | Initialize crop on image load | `e: SyntheticEvent<HTMLImageElement>` | `void` |
| `dataURLtoBlob()` | Convert data URL to Blob | `dataURL: string` | `Blob \| null` |
| `handleSetProfilePicture()` | Process and upload image | None | `Promise<void>` |

#### setCanvasPreview.ts

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `setCanvasPreview()` | Render cropped image to canvas | `image: HTMLImageElement, canvas: HTMLCanvasElement, crop: PixelCrop` | `void` |

### Backend Functions

#### UserController

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `uploadImage()` | Upload file to storage | `token: String, file: MultipartFile` | `String` |
| `uploadPictureURL()` | Save URL to database | `token: String, request: ImageRequestDTO` | `ResponseEntity<String>` |
| `getImage()` | Retrieve profile picture | `token: String` | `String` |
| `deleteImage()` | Delete from storage | `token: String` | `ResponseEntity<String>` |
| `deleteImageURL()` | Remove URL from database | `token: String` | `ResponseEntity<String>` |

#### ImageHandlerService

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `uploadFile()` | Upload to Supabase Storage | `file: File, bucketName: String, fileName: String` | `String` |
| `getFile()` | Retrieve from Supabase Storage | `bucketName: String, fileName: String` | `byte[]` |
| `deleteFile()` | Delete from Supabase Storage | `bucketName: String, fileName: String` | `String` |
| `fileExists()` | Check if file exists | `bucketName: String, fileName: String` | `boolean` |

#### UserService

| Function | Purpose | Parameters | Returns |
|----------|---------|------------|---------|
| `saveFileURL()` | Save picture URL to database | `userEmail: String, fileURL: String` | `void` |
| `deleteFileURL()` | Remove picture URL from database | `userEmail: String` | `void` |

---

## Frontend Components

### Profile.tsx Structure

```typescript
// State Management
const [profilePicUrl, setProfilePicUrl] = useState(defaultProfilePicture);
const [isLoadingProfilePic, setIsLoadingProfilePic] = useState(true);
const [modalOpen, setModalOpen] = useState(false);

// Functions
- updateProfilePic(imgSrc) - Updates local state
- fetchProfilePic() - Retrieves from backend
- deleteProfilePicture() - Deletes picture
```

### ImageCropper.tsx Structure

```typescript
// State Management
const [imageSrc, setImageSrc] = useState<string>();
const [crop, setCrop] = useState<Crop>();
const [error, setError] = useState("");

// Refs
const imgRef = useRef<HTMLImageElement>(null);
const previewCanvasRef = useRef<HTMLCanvasElement>(null);

// Constants
const ASPECT_RATIO = 1; // Square
const MIN_DIMENSION = 150; // pixels
```

### Modal.tsx Structure

```typescript
// Props
interface ModalProps {
  updateProfilePic: (imgSrc: string) => void;
  closeModal: () => void;
}

// Features
- Backdrop overlay
- Close button
- Responsive sizing
```

---

## Backend Services

### ImageHandlerService Details

**Upload Process:**
1. Sanitize filename
2. Construct Supabase URL
3. Create HTTP connection
4. Set headers (auth, content-type, upsert)
5. Stream file data (8KB chunks)
6. Read response code
7. Return result

**Retrieval Process:**
1. Construct Supabase URL
2. Create HTTP GET request
3. Set authorization header
4. Read response bytes
5. Return byte array

**Deletion Process:**
1. Construct Supabase URL
2. Create HTTP DELETE request
3. Set authorization header
4. Read response
5. Return result

### UserService Details

**URL Management:**
- `saveFileURL()`: Updates user's `pictureURL` field
- `deleteFileURL()`: Sets user's `pictureURL` to null
- Uses custom repository methods for direct SQL updates

---

## Data Flow Diagrams

### Upload Flow

```
User → Select File → ImageCropper
  ↓
FileReader → Data URL → Image Element
  ↓
ReactCrop → User Adjusts Crop
  ↓
Canvas Preview → setCanvasPreview()
  ↓
Data URL → Blob Conversion
  ↓
FormData → POST /users/upload
  ↓
Backend → Temp File → Supabase Storage
  ↓
Frontend → Supabase Client → Signed URL
  ↓
POST /users/uploadImageURL → Database
  ↓
Profile Picture Updated
```

### Retrieval Flow

```
Profile Page Load → fetchProfilePic()
  ↓
GET /users/fetchProfilePic
  ↓
Backend → Extract Email Prefix
  ↓
ImageHandlerService → Supabase GET
  ↓
Byte Array → Base64 Encoding
  ↓
Data URL → Frontend Display
```

### Deletion Flow

```
User Clicks Delete → deleteProfilePicture()
  ↓
DELETE /users/deleteProfilePicture
  ↓
Backend → Supabase DELETE
  ↓
DELETE /users/deleteImageURL
  ↓
Backend → Database URL Removal
  ↓
Frontend → Default Picture
```

---

## Image Processing Details

### Canvas Rendering

**setCanvasPreview() Process:**
1. Get 2D canvas context
2. Calculate device pixel ratio
3. Calculate scale factors (natural vs displayed size)
4. Set canvas dimensions (crop size × pixel ratio)
5. Scale context for high-DPI
6. Enable high-quality smoothing
7. Translate to crop origin
8. Draw full image
9. Crop to selected area

**Key Calculations:**
- `scaleX = naturalWidth / displayedWidth`
- `scaleY = naturalHeight / displayedHeight`
- `canvasWidth = cropWidth × scaleX × pixelRatio`
- `canvasHeight = cropHeight × scaleY × pixelRatio`

### Blob Conversion

**dataURLtoBlob() Process:**
1. Split data URL: `data:image/png;base64,{data}`
2. Extract MIME type from prefix
3. Decode base64 string to binary
4. Create ArrayBuffer
5. Create Uint8Array from buffer
6. Create Blob with MIME type

---

## Error Handling

### Frontend Errors

1. **File Too Small:**
   - Validation: `naturalWidth < 150 || naturalHeight < 150`
   - Error message: "Image must be 150x150px"
   - Prevents upload

2. **Upload Failure:**
   - Try-catch around upload request
   - Console error logging
   - User can retry

3. **URL Generation Failure:**
   - Try-catch around Supabase call
   - Console error logging
   - Upload may succeed but URL not saved

### Backend Errors

1. **Invalid Token:**
   - Returns "Invalid token" string
   - HTTP 401 for unauthorized endpoints

2. **File Not Found:**
   - Returns "Fail" string
   - Frontend shows default picture

3. **Storage Errors:**
   - IOException caught
   - Error response body logged
   - Returns failure message

---

## Security Considerations

1. **Authentication:**
   - All endpoints require JWT token
   - Token validated before processing
   - User email extracted from token

2. **File Validation:**
   - Minimum size enforced (150x150px)
   - File type validation (image/*)
   - Filename sanitization

3. **Storage Security:**
   - Service key used for backend operations
   - Signed URLs with expiration
   - No public access

4. **File Naming:**
   - Based on authenticated user email
   - Prevents unauthorized access
   - Special characters sanitized

---

## Performance Optimizations

1. **Canvas Rendering:**
   - High-quality smoothing for better output
   - Device pixel ratio consideration
   - Efficient buffer streaming (8KB chunks)

2. **Image Processing:**
   - Client-side cropping reduces server load
   - Base64 encoding for immediate display
   - Signed URLs for cached access

3. **Storage:**
   - Upsert operation (overwrites existing)
   - Efficient byte streaming
   - Direct database URL storage

---

## Limitations & Notes

1. **Processing Time:**
   - Note to users: "It will take 10-15 mins for changes to reflect"
   - Likely due to free tier Supabase CDN caching

2. **File Format:**
   - All images converted to PNG
   - Original format not preserved

3. **File Size:**
   - No explicit size limit enforced
   - Limited by Supabase storage quotas

4. **Retrieval Method:**
   - Base64 encoding used (not URL)
   - May be inefficient for large images
   - Consider URL-based retrieval for production

---

## Future Enhancements

- [ ] Image compression before upload
- [ ] Multiple image format support
- [ ] Image size limits and validation
- [ ] Progress indicators for upload
- [ ] Image optimization (WebP, responsive sizes)
- [ ] CDN integration for faster delivery
- [ ] Image caching strategy
- [ ] Thumbnail generation
- [ ] Image rotation/flip features
- [ ] Batch upload support

---

## Troubleshooting

### Common Issues

1. **Image Not Uploading:**
   - Check Supabase credentials
   - Verify bucket exists and permissions
   - Check network connectivity
   - Review console errors

2. **Image Not Displaying:**
   - Verify fetchProfilePic() called
   - Check Base64 encoding
   - Verify default picture path
   - Check browser console

3. **Crop Not Working:**
   - Verify image dimensions meet minimum
   - Check ReactCrop configuration
   - Verify canvas refs exist

4. **Signed URL Not Generating:**
   - Check Supabase client credentials
   - Verify file exists in storage
   - Check URL encoding

---

**Last Updated:** 2026  
**Version:** 1.0
