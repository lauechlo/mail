# HoagieMail Codebase: Comprehensive Architecture Analysis

## Executive Summary

HoagieMail is a Next.js-based email distribution platform for Princeton University that enables clubs, departments, and organizations to send emails to residential college listservs. The application is currently undergoing development to add **demographic targeting** (undergrad/grad/faculty filtering) and an **email templates system**.

---

## 1. PROJECT STRUCTURE & TECH STACK

### 1.1 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | Next.js | 14.2.15 | App Router, SSR, API routes |
| **UI Library** | React | 18.3.1 | Component-based UI |
| **Language** | TypeScript | 5.7.2 | Type-safe JavaScript |
| **UI Components** | Evergreen UI | 7.1.9 | Enterprise design system |
| **Rich Text Editor** | SunEditor | 2.47.0 | WYSIWYG email composition |
| **Authentication** | Auth0 | 3.5.0 | OAuth2/JWT token auth |
| **Data Fetching** | SWR | 2.2.5 | React data fetching with caching |
| **Image Hosting** | Imgur API | - | External CDN for email images |
| **HTTP Client** | Fetch API | Native | Browser standard API |
| **HTML Sanitization** | DOMPurify | 3.2.1 | Prevent XSS attacks |
| **PWA** | next-pwa | 5.6.0 | Progressive Web App support |
| **Styling** | Custom CSS | - | Evergreen UI theme system |
| **Linting** | ESLint | 9.35.0 | Code quality |
| **Formatting** | Prettier | 3.4.1 | Code formatting |

### 1.2 Project Directory Structure

```
/home/user/mail/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout with Auth0 & theme
│   ├── page.tsx                      # Landing page with login
│   ├── Content.tsx                   # Global nav, footer, theme wrapper
│   ├── api/
│   │   ├── auth/[...auth0]/
│   │   │   └── route.ts              # Auth0 authentication handler
│   │   └── hoagie/[...path]/
│   │       └── route.ts              # Proxy to backend Hoagie API
│   ├── app/
│   │   └── page.tsx                  # Email type selector (StudentOrg/Sales/Lost/Bulletin)
│   ├── send/
│   │   └── page.tsx                  # Send email form (StudentOrg emails)
│   ├── scheduled/
│   │   └── page.tsx                  # View/manage scheduled emails
│   ├── digest/
│   │   └── page.tsx                  # Create/manage digest messages
│   ├── mail.css                      # Success animation styles
│   └── quill.snow.css                # Rich editor styles
│
├── components/                       # Reusable React components
│   ├── MailForm/
│   │   ├── index.tsx                 # Main form wrapper (detects digest vs regular)
│   │   ├── SendForm.tsx              # Regular email composition form
│   │   ├── SuccessPage.tsx           # Post-send confirmation page
│   │   ├── ExistingDigest.tsx        # View/delete existing digest messages
│   │   ├── DigestForm/
│   │   │   ├── index.tsx             # Digest form wrapper
│   │   │   └── Forms.tsx             # Lost/Found, Sales, Generic forms
│   │   └── ScheduledSend/
│   │       ├── ScheduledMailForm.tsx # Scheduled emails management
│   │       ├── ScheduledMailPane.tsx # List of scheduled emails
│   │       ├── ScheduleSelectField.tsx # Time slot selector
│   │       └── formatDateString.ts   # Date/time formatting utility
│   ├── RichSunEditor.tsx             # SunEditor wrapper for rich text
│   ├── ErrorMessage.tsx              # Error alert component
│   └── View.tsx                      # Centered container wrapper
│
├── lib/hoagie-ui/                    # Hoagie design system components
│   ├── AuthButton/                   # Login/logout button
│   ├── Nav/                          # Navigation bar with profile menu
│   ├── ProfileCard/                  # User profile display in dropdown
│   ├── Footer/                       # Footer with links
│   ├── Layout/                       # Main layout with nav/footer
│   ├── Theme/
│   │   ├── index.tsx                 # Theme provider component
│   │   ├── themes.tsx                # Blue, Purple, Orange themes
│   │   ├── Button.tsx                # Custom button styling
│   │   └── Tab.tsx                   # Custom tab styling
│   └── theme.css                     # Hoagie brand styles
│
├── public/                           # Static assets
├── .github/                          # GitHub configuration
│   ├── workflows/
│   │   └── lint.yml                  # Linting CI/CD
│   └── pull_request_template.md      # PR template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.mjs                   # Next.js config (PWA)
├── eslint.config.js                  # ESLint rules
├── .env.local.txt                    # Environment variables template
└── README.md                         # Project documentation
```

---

## 2. HOW EMAIL COMPOSITION IS IMPLEMENTED

### 2.1 Email Composition User Flow

```
Landing Page (/)
    ↓ User authenticates
Main Menu (/app)
    ├─ Student Org → Send Email Form (/send) [Regular Email]
    ├─ Sales → Digest Form (/digest?type=sale)
    ├─ Lost & Found → Digest Form (/digest?type=lost)
    └─ Everything Else → Digest Form (/digest?type=bulletin)
```

### 2.2 SendForm Component Architecture

**File**: `/home/user/mail/components/MailForm/SendForm.tsx`

The SendForm is the primary email composition interface with the following features:

#### Form Fields:
1. **Scheduled Time** (Required)
   - Selector for send timing (now, or 8am/1pm/6pm EST up to 4 days ahead)
   - Generated dynamically based on EST timezone
   - Uses custom `ScheduleSelectField` component
   - Validation: Only future times shown

2. **Email Header/Subject** (Required)
   - Text input field
   - Placeholder: "Hi from Hoagie!"
   - Validation: Cannot be empty
   - Max length: No visible limit (frontend)

3. **Displayed Sender Name** (Required)
   - Text input field
   - Default: User's name from Auth0 profile
   - Description: Can be personal name, club name, or organization
   - Footer disclaimer: Full name always included regardless of sender display name
   - Validation: Cannot be empty

4. **Body Content** (Required)
   - Rich HTML editor using `RichSunEditor` component
   - Features: Text formatting, colors, images, videos, links
   - Image upload: Direct to Imgur CDN
   - HTML sanitization with DOMPurify before storing

#### Form State Management:
```typescript
const [header, setHeader] = useState('');           // Subject
const [sender, setSender] = useState(user.name);    // Sender display name
const [body, setBody] = useState('');               // HTML content
const [schedule, setSchedule] = useState('now');    // Send time
const [showConfirm, setShowConfirm] = useState(false);      // Confirmation dialog
const [showTestConfirm, setShowTestConfirm] = useState(false); // Test email dialog
```

#### Actions:
- **Send Email Button**: Opens confirmation dialog
  - Shows warning: "You are about to send an email to everyone at Princeton"
  - Mentions emails sent to "all residential college listservs"
  - Confirms all emails include user's name + NetID in footer
  - Usage warning about responsible use

- **Send Test Email Button**: Opens test confirmation
  - Sends to user's own email only
  - Used for preview before sending to all
  - No schedule selector for test

### 2.3 RichSunEditor Component

**File**: `/home/user/mail/components/RichSunEditor.tsx`

Wraps SunEditor WYSIWYG editor with:

#### Configuration:
```typescript
const options: SunEditorOptions = {
    buttonList: [
        ['undo', 'redo'],
        ['font', 'fontSize'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor'],
        ['outdent', 'indent'],
        ['align', 'list', 'lineHeight'],
        ['link', 'image', 'video'],
        ['fullScreen'],
    ],
    imageWidth: '500px',
    showPathLabel: false,
    height: 'auto',
    font: ['sans-serif', 'serif'],
    defaultStyle: 'font-family:sans-serif',
};
```

#### Image Upload Pipeline:
1. User selects image in editor
2. `onImageUploadBefore` handler triggered
3. Image posted to `https://api.imgur.com/3/image`
4. Imgur returns CDN link
5. Editor inserts image with CDN URL
6. Image is NOT embedded in email body, only referenced by URL

#### Error Handling:
- Image upload errors captured and displayed
- Network errors handled gracefully
- User gets feedback on upload failures

---

## 3. EMAIL SENDING FLOW (Frontend & Backend)

### 3.1 Frontend Email Sending Flow

```
SendForm.tsx (Component)
    ↓
onSend callback (passed from parent page)
    ↓
POST /api/hoagie/mail/send with mailData
    ↓
[...path]/route.ts (API Proxy)
    ├─ Extract Auth0 access token
    ├─ Add Authorization header
    └─ Forward to HOAGIE_API_URL/mail/send
        ↓
    Backend Hoagie API
    ├─ Authenticate user
    ├─ Validate email content
    ├─ Check user permissions
    ├─ Fetch recipient lists
    ├─ Queue emails for sending
    └─ Return response
        ↓
    Frontend receives response
    ├─ If success → Show SuccessPage
    └─ If error → Display ErrorMessage

```

### 3.2 Email Data Structure

**Data sent in POST request** (from SendForm):
```typescript
{
    sender: string;        // Display name shown in "From"
    header: string;        // Email subject
    body: string;          // HTML content from SunEditor
    schedule: string;      // "now" or ISO timestamp (e.g., "2025-11-05T13:00:00")
}
```

Currently, there is **NO demographic filtering field** in the frontend data structure. The backend currently sends to all residential college listservs.

### 3.3 API Proxy Architecture

**File**: `/home/user/mail/app/api/hoagie/[...path]/route.ts`

The proxy handles:
```typescript
// Dynamic routing: /api/hoagie/* → HOAGIE_API_URL/*
async handler(request, { params: { path } }) {
    const path = params.path.join('/');  // e.g., 'mail/send'
    
    // Get Auth0 access token from session
    const { accessToken } = await getAccessToken();
    
    // Create headers with authorization
    const fetchReq: RequestInit = {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    };
    
    // Copy request body if not GET
    if (request.method !== 'GET') {
        fetchReq.body = await request.text();
    }
    
    // Forward to backend
    return proxyRequest(`${HOAGIE_API_URL}${path}`, fetchReq);
}
```

**Key Points**:
- All requests include Auth0 access token
- Method, headers, and body passed through
- Backend validates token and user permissions
- Errors return with original status code

### 3.4 Send Page Implementation

**File**: `/home/user/mail/app/send/page.tsx`

```typescript
export default withPageAuthRequired(() => {
    const [errorMessage, setErrorMessage] = useState('');
    const [success, setSuccess] = useState(false);
    
    const sendMail = async (mailData) => {
        const response = await fetch('/api/hoagie/mail/send', {
            body: JSON.stringify(mailData),
            method: 'POST',
        });
        
        if (!response.ok) {
            // Handle error
            const errorText = await response.text();
            setErrorMessage(`There was an issue with your email. ${errorText}`);
        } else if (mailData.schedule !== 'test') {
            // Show success page for regular sends
            setSuccess(true);
        } else {
            // Toast notification for test emails
            toaster.success('Test email sent! Check your inbox.');
        }
    };
    
    return <MailForm onSend={sendMail} errorMessage={errorMessage} success={success} />;
});
```

---

## 4. DATABASE SCHEMA & USER MODELS

### 4.1 Inferred Database Structure

Based on API endpoints and application flow, the backend likely has:

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    auth0_id VARCHAR(255) UNIQUE,
    netid VARCHAR(50),
    name VARCHAR(255),
    email VARCHAR(255),
    demographic_type ENUM('undergraduate', 'graduate', 'faculty', 'staff'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Emails/Mail Table
```sql
CREATE TABLE emails (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    sender VARCHAR(255),
    header VARCHAR(500),
    body LONGTEXT,              -- HTML content
    schedule TIMESTAMP,          -- When to send
    schedule_status ENUM('draft', 'scheduled', 'sent', 'failed'),
    sent_at TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Scheduled Emails Table
```sql
CREATE TABLE scheduled_emails (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    email_id UUID REFERENCES emails(id),
    original_schedule TIMESTAMP,
    current_schedule TIMESTAMP,
    status ENUM('pending', 'sent', 'cancelled'),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### Distribution Lists
```sql
CREATE TABLE distribution_lists (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    recipient_type ENUM('all_students', 'undergraduates', 'graduates', 'faculty'),
    email_list TEXT,              -- Comma-separated or JSON array
    count INT,
    last_updated TIMESTAMP
);
```

### 4.2 User Demographic Information Storage

**Current Status**: The application currently lacks demographic targeting.

**Based on README** ("sends emails to undergraduate and graduate listservs"), the system assumes:
- Users have an associated demographic classification
- Distribution lists exist for: undergraduates, graduates, faculty
- One historical commit changed "undergrads" to "all students" (more inclusive approach)

**For Implementation**, the backend likely needs:
1. A `user_demographics` or similar field in the users table
2. Authentication integration with Princeton's CAS/directory system
3. An endpoint to retrieve user's demographic classification
4. Multiple distribution lists mapped to demographic types

### 4.3 Existing API Data Structures

#### Mail Send Request (Inferred):
```typescript
POST /api/hoagie/mail/send
{
    sender: string,
    header: string,
    body: string,
    schedule: string,
    // MISSING: recipients_filter or demographic_target
}
```

#### Scheduled Emails Response (from useSWR):
```typescript
GET /api/hoagie/mail/scheduled/user
{
    status: 'used' | 'unused',
    scheduledMail: [
        {
            header: string,
            sender: string,
            body: string,
            schedule: string (ISO timestamp),
            createdAt: string (ISO timestamp),
        }
    ]
}
```

#### Digest Response (from useSWR):
```typescript
GET /api/hoagie/stuff/user
{
    status: 'used' | 'unused',
    title?: string,
    category?: string,
    description?: string,
    tags?: string[],
    user?: { email: string },
    link?: string,
}
```

---

## 5. USER DEMOGRAPHIC INFORMATION

### 5.1 Current Demographic Data Availability

**Identified in Code**:
- Auth0 `UserProfile` object contains: `name`, `email`, `sub` (user ID)
- No demographic fields visible in frontend Auth0 integration
- README mentions the system should support "undergraduate and graduate listservs"
- Commit history shows: "DEV-168 changed undergrads to all students" → indicates past targeted approach

### 5.2 Where Demographic Data Comes From

**Likely Sources**:
1. **Princeton CAS System** - Central authentication
2. **Princeton Directory Service** - Contains demographic metadata
3. **Auth0 Custom Claims** - Can be populated during login
4. **Hoagie API Backend** - May fetch from Princeton systems and store

**Not Currently Exposed in Frontend**:
- No demographic selection field in SendForm
- No demographic filter in API requests
- No user profile page showing demographic info

### 5.3 For Feature Implementation

You will likely need to:
1. Extend Auth0 custom claims or create new API endpoint to fetch user demographic
2. Add demographic field to user profile retrieval
3. Modify SendForm to accept recipient targeting
4. Update API request payload to include demographic filters
5. Backend changes to filter distribution lists by demographic

---

## 6. EMAIL EDITOR IMPLEMENTATION

### 6.1 Editor Architecture

The email editor uses **SunEditor** (WYSIWYG - What You See Is What You Get):

**Component Chain**:
```
SendForm.tsx (captures body content)
    ↓
RichSunEditor.tsx (component wrapper)
    ↓
SunEditor React (dynamic import, SSR disabled)
    ↓
SunEditor Core (DOM manipulation library)
```

### 6.2 Editor Features

#### Text Formatting:
- Font selection (sans-serif, serif)
- Font size adjustment
- Text styles: Bold, Underline, Italic, Strikethrough, Subscript, Superscript
- Font color and highlight color
- Indentation and outdenting
- Text alignment (left, center, right, justify)
- Lists (ordered/unordered)
- Line height adjustment

#### Media:
- **Links**: Insert hyperlinks
- **Images**: Upload from local disk → Imgur CDN
- **Videos**: Embed YouTube/video links

#### Other:
- Undo/Redo
- Fullscreen editing mode

### 6.3 Editor Configuration

```typescript
// From RichSunEditor.tsx
const options: SunEditorOptions = {
    buttonList: [
        ['undo', 'redo'],
        ['font', 'fontSize'],
        ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
        ['fontColor', 'hiliteColor'],
        ['outdent', 'indent'],
        ['align', 'list', 'lineHeight'],
        ['link', 'image', 'video'],
        ['fullScreen'],
    ],
    imageWidth: '500px',        // Max image width in email
    showPathLabel: false,       // Hide HTML path display
    height: 'auto',             // Auto height expand
    font: ['sans-serif', 'serif'],
    defaultStyle: 'font-family:sans-serif',
};
```

### 6.4 Image Upload Details

**Flow**:
1. User clicks image button in editor
2. Selects file from computer
3. `onImageUploadBefore` callback intercepts
4. `saveToServer()` posts to Imgur API:
   ```
   POST https://api.imgur.com/3/image
   Headers: Authorization: Client-ID {NEXT_PUBLIC_IMGUR_API_ID}
   Body: FormData with file
   ```
5. Returns: `{ success: true, data: { link: "https://imgur.com/..." } }`
6. Editor inserts `<img src="imgur_url">` into body
7. Email body stored with Imgur URLs

**Key Points**:
- Images NOT embedded in email, only referenced by URL
- Requires internet connection for image viewing (no offline support)
- Imgur API key stored in `NEXT_PUBLIC_IMGUR_API_ID` (public, safe for client-side)
- Image errors displayed as validation messages

### 6.5 Content Sanitization

```typescript
import DOMPurify from 'dompurify';

// In ScheduledMailPane.tsx
const mailBody = DOMPurify.sanitize(listing.body);

// Then rendered as:
<Paragraph dangerouslySetInnerHTML={{ __html: mailBody }} />
```

- Prevents XSS attacks by stripping dangerous HTML/JavaScript
- Preserves formatting: links, images, styles
- Applied both in frontend preview and assumed in backend

---

## 7. API ENDPOINTS FOR SENDING EMAILS

### 7.1 Primary Email Endpoints

#### Send Email (Regular & Test)
```
POST /api/hoagie/mail/send
Content-Type: application/json
Authorization: Bearer {auth0_access_token}

Request Body:
{
    sender: string,           // Display name
    header: string,           // Subject line
    body: string,             // HTML content
    schedule: string,         // "now", "test", or ISO timestamp
}

Response (Success):
200 OK
(Empty body or { success: true })

Response (Error):
400-500 {error message}
```

**Behavior**:
- `schedule: "now"` → Send immediately to all recipients
- `schedule: "test"` → Send only to requesting user's email
- `schedule: "2025-11-05T13:00:00Z"` → Queue for scheduled sending

#### Get Scheduled Emails
```
GET /api/hoagie/mail/scheduled/user
Authorization: Bearer {auth0_access_token}

Response (200 OK):
{
    status: "used" | "unused",
    scheduledMail?: [
        {
            header: string,
            sender: string,
            body: string,
            schedule: string (ISO),
            createdAt: string (ISO)
        }
    ]
}
```

#### Update Scheduled Email
```
POST /api/hoagie/mail/scheduled/user
Content-Type: application/json
Authorization: Bearer {auth0_access_token}

Request Body:
{
    schedule: string (original ISO timestamp),
    newSchedule: string (new ISO timestamp)
}

Response (204 No Content or 200 OK)
```

#### Delete Scheduled Email
```
DELETE /api/hoagie/mail/scheduled/user
Content-Type: application/json
Authorization: Bearer {auth0_access_token}

Request Body:
{
    schedule: string (ISO timestamp to delete),
    newSchedule: null
}

Response (204 No Content or 200 OK)
```

### 7.2 Digest Email Endpoints

#### Create/Update Digest Message
```
POST /api/hoagie/stuff/user
Content-Type: application/json
Authorization: Bearer {auth0_access_token}

Request Body:
{
    title: string,
    description: string,
    category: "sale" | "lost" | "bulletin",
    link: string (optional, for Google Slides),
    tags: string[]
}

Response (200 OK):
{ success: true } or digest data
```

#### Get Current Digest
```
GET /api/hoagie/stuff/user
Authorization: Bearer {auth0_access_token}

Response (200 OK):
{
    status: "used" | "unused",
    title?: string,
    description?: string,
    category?: string,
    link?: string,
    tags?: string[],
    user?: { email: string }
}
```

#### Delete Digest Message
```
DELETE /api/hoagie/stuff/user
Authorization: Bearer {auth0_access_token}

Response (204 No Content or 200 OK)
```

### 7.3 Authentication Flow

All API calls follow this pattern:

1. **Client-side** (`/api/hoagie/[...path]/route.ts`):
   - Receives request from frontend
   - Calls `getAccessToken()` from Auth0 SDK
   - Extracts JWT access token from session
   - Attaches to `Authorization: Bearer {token}` header
   - Forwards to backend Hoagie API

2. **Backend** (`HOAGIE_API_URL`):
   - Validates JWT token
   - Verifies token is not expired
   - Extracts user ID from token claims
   - Verifies user has permission for action
   - Processes request with user context
   - Returns response or error

**Environment Config**:
```
HOAGIE_API_URL=http://localhost:8000  # During development
```

### 7.4 Scheduling System

**Time Slots** (EST timezone):
- 8:00 AM
- 1:00 PM (13:00)
- 6:00 PM (18:00)

**Available Days**: Next 4 days only

**Generation Logic** (from `ScheduleSelectField.tsx`):
```typescript
const hours = [8, 13, 18];
const daysToGenerate = 4;

// For each day (0-3 days from now)
for (let day = 0; day < daysToGenerate; day++) {
    for (let hour of hours) {
        // Create date option
        // Filter out past times
    }
}
```

**Time Validation**:
- Only shows times in the future (EST timezone)
- If user changes to an already-selected time slot, it's moved to front of list
- If time doesn't exist in options, it's added to allow user to keep their selection

---

## 8. COMPONENT INTERACTION FLOW

### 8.1 Page Load Flow

```
app/send/page.tsx
├─ withPageAuthRequired() wrapper
│  └─ Redirects to /api/auth/login if not authenticated
├─ useState for form state and errors
├─ useRouter for navigation
└─ JSX Structure:
   ├─ MailForm component
   │  ├─ useUser() hook to get Auth0 user
   │  ├─ SendForm component
   │  │  ├─ Schedule selector
   │  │  ├─ Header input
   │  │  ├─ Sender name input
   │  │  ├─ RichSunEditor (body)
   │  │  ├─ Send button → Dialog confirmation
   │  │  ├─ Test email button → Dialog confirmation
   │  │  └─ Back button
   │  └─ SuccessPage (if success=true)
   │     └─ Checkmark animation + confirmation message
   └─ Content wrapper (app/Content.tsx)
      ├─ Nav component (header with profile)
      └─ Layout component (footer)
```

### 8.2 Form Submission Flow

```
User clicks "Send Email"
    ↓
Dialog opens (confirmation warning)
    ↓
User confirms
    ↓
onSend({ sender, header, body, schedule })
    ↓ (in /app/send/page.tsx)
fetch('/api/hoagie/mail/send', {
    method: 'POST',
    body: JSON.stringify(mailData)
})
    ↓
API Proxy (/api/hoagie/[...path]/route.ts)
├─ Get Auth0 token
├─ Add Authorization header
└─ Forward to backend
    ↓
Backend Response
├─ If OK: setSuccess(true) → Show SuccessPage
├─ If Error: setErrorMessage(error) → Show ErrorMessage above form
└─ If Test: toaster.success('Test email sent!')
```

---

## 9. CURRENT LIMITATIONS & GAPS FOR NEW FEATURES

### 9.1 Missing for Demographic Targeting

**Frontend Gaps**:
- [ ] No demographic field in SendForm
- [ ] No demographic options in email type selector
- [ ] No API payload support for demographic filtering
- [ ] No user profile page to display/verify demographic
- [ ] No warning/validation about demographic coverage

**Backend Integration Needed**:
- [ ] Fetch user demographic from Princeton systems
- [ ] Expose demographic in Auth0 custom claims or new endpoint
- [ ] Filter distribution lists by demographic
- [ ] Validate user has permission for selected demographic
- [ ] Log which demographics email was sent to

### 9.2 Missing for Email Templates

**Frontend Gaps**:
- [ ] No template creation interface
- [ ] No template library/browser
- [ ] No template selector in SendForm
- [ ] No template preview
- [ ] No template management (edit, delete, share)

**Backend Integration Needed**:
- [ ] Templates database table with user_id, name, content, created_at
- [ ] CRUD endpoints for templates
- [ ] Template sharing/permissions system
- [ ] Variable substitution support ({{name}}, {{organization}})
- [ ] Template preview rendering

### 9.3 Data Structure Requirements

Current SendForm sends:
```typescript
{ sender, header, body, schedule }
```

For demographic targeting, needs:
```typescript
{
    sender,
    header,
    body,
    schedule,
    recipients_demographic: 'all' | 'undergraduates' | 'graduates' | 'faculty'
    // OR
    target_demographics: ['undergraduates', 'graduates']
}
```

For templates, needs new endpoints:
```
POST /api/hoagie/templates           // Create
GET /api/hoagie/templates            // List
GET /api/hoagie/templates/{id}       // Get one
PUT /api/hoagie/templates/{id}       // Update
DELETE /api/hoagie/templates/{id}    // Delete
```

---

## 10. KEY ARCHITECTURAL PATTERNS

### 10.1 State Management Pattern
- React hooks (`useState`, `useRef`, `useEffect`)
- Form state lifted to component level
- Error states separate from success states
- Loading states with Spinner components

### 10.2 API Request Pattern
- Client-side fetch to `/api/hoagie/*`
- Automatic Auth0 token attachment in proxy
- Error handling with `response.ok` check
- JSON stringify/parse for request/response bodies

### 10.3 Component Composition
- Pages as route handlers
- Container components manage state
- Presentational components receive props
- Wrapper components for layout/theme

### 10.4 Data Fetching Pattern
- SWR for GET requests with caching
- Fetch API for POST/DELETE mutations
- Manual refetch with `mutate()` after mutations
- Loading states managed locally

### 10.5 Validation Pattern
- Frontend: Required field checks, format validation
- Backend: Token validation, permission checks, content validation
- User feedback via ErrorMessage component or Dialog

---

## 11. DEVELOPMENT SETUP

### Dependencies
```bash
npm install  # or yarn
# Key packages:
# - next@14.2.15
# - react@18.3.1
# - typescript@5.7.2
# - evergreen-ui@7.1.9
# - suneditor@2.47.0
# - @auth0/nextjs-auth0@3.5.0
```

### Environment Variables Needed
```
AUTH0_SECRET=
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=
AUTH0_SCOPE=openid profile email

HOAGIE_API_URL=http://localhost:8000
NEXT_PUBLIC_IMGUR_API_ID=
```

### Running Development Server
```bash
yarn dev  # Starts on http://localhost:3000
```

---

## 12. SECURITY CONSIDERATIONS

1. **Auth0 Integration**: All requests verified with JWT tokens
2. **HTML Sanitization**: DOMPurify prevents XSS from user content
3. **API Proxy**: Backend validates all requests server-side
4. **Image Hosting**: External Imgur CDN avoids server storage
5. **HTTPS**: Required for production (Auth0 enforces)
6. **CORS**: Backend handles cross-origin requests
7. **Rate Limiting**: Likely implemented in backend (not visible in frontend)
8. **Audit Trail**: Emails sent to "all students" with sender info preserved

---

## Summary for Implementation

For **Demographic Targeting**:
1. Add demographic user property fetching
2. Add demographic selector in SendForm
3. Include demographic in API request payload
4. Backend filters recipient lists by demographic
5. Show success message with targeted demographic count

For **Email Templates**:
1. Create template management UI (create, list, edit, delete)
2. Add template selector/preview in SendForm
3. Template API endpoints with CRUD operations
4. Variable substitution support ({{variable}})
5. Template preview functionality
6. Access control (personal vs organizational templates)

