# StorageSync Product Roadmap

> This is a living product-direction document, not a fixed implementation
> contract. Priorities, designs, and technical choices will change as the
> product is built and tested.

## Product vision

StorageSync begins as a dependable cloud drive and grows into a flexible place
to store, receive, protect, share, and automate files.

The first important user journey is:

> A user signs up, creates folders, uploads and previews a file, shares it,
> the recipient opens or downloads it, and the owner can revoke access.

The product should prove this complete loop before expanding into more advanced
features.

## Delivery principles

- Build and polish one complete workflow at a time.
- Treat the phases below as direction, not a promise to implement every item.
- Revisit priorities using user feedback, product risk, and technical learning.
- Favor reliable file handling and clear permissions over feature count.
- Use established security and cryptography practices; never invent custom
  cryptography.

## Phase 1: Core cloud drive (MVP)

### Accounts

- User registration
- Login and logout
- Forgot-password and password-reset flows

### File management

- Create folders
- Upload one or multiple files
- Download files
- Rename, move, and delete files and folders
- Trash, restore, and permanent deletion
- List and basic grid views
- File-type icons
- Image and PDF previews
- Recent files
- Starred/favorite files
- Filename search
- Storage-usage meter
- Responsive mobile UI

### Sharing

- Generate and revoke public share links
- Share with another registered user
- Viewer and editor permissions
- "Shared with me" view

### MVP completion milestone

The MVP is complete when the primary user journey works reliably from end to
end: sign up -> upload -> organize -> preview -> share -> receive -> revoke.

## Phase 2: Reliable large uploads

- Large-file and chunked uploads
- Resumable uploads
- Pause, resume, cancel, and retry
- Retry failed chunks without restarting the entire upload
- Upload progress and queue
- Background uploads
- Drag-and-drop and folder uploads
- Upload conflict handling
- Automatic pause when offline and resume when the connection returns

## Phase 3: Advanced sharing

- Password-protected links
- Link expiration
- Download and open limits
- Disable-download and view-only links
- One-time links
- Instant revocation
- Share activity logs and open notifications
- Copy share URL
- Custom permissions
- Watermarked previews
- Device and geographic restrictions for sensitive sharing

Possible permission roles include Owner, Editor, Uploader, Commenter, Viewer,
and Downloader.

## Phase 4: File Requests

Allow a user to create a branded upload page for other people. Uploaders should
not need an account.

- Public upload request
- Custom title and message
- Destination folder
- Expiration date
- Maximum upload size
- Allowed file types
- Optional password
- Requester name/email
- Upload confirmation

This is especially useful for freelancers, photographers, recruiters, teachers,
designers, agencies, lawyers, and students.

## Phase 5: Version history

- Keep multiple versions of a file
- View version history
- Download or restore an older version
- Compare version metadata
- Delete old versions
- Limit retained history by subscription plan if needed

## Phase 6: Search and discovery

Start with filename search, then add:

- File type, date, owner, size, and folder filters
- Shared/not-shared and starred filters
- Modified-date filters
- Search syntax such as `type:pdf modified:this-month project`
- PDF and DOCX text indexing
- Markdown and code search
- OCR for scanned documents, if justified later

## Phase 7: Activity and collaboration

### Activity

- Upload, download, share-open, restore, and link-expiration events
- Security and team audit history

### Comments

- File comments
- Mentions and threads
- Resolve comments
- Related notifications

## Phase 8: Private Vault

- Re-authentication before access
- Encrypted files
- Automatic lock and configurable vault timeout
- Stricter sharing rules
- Sensitive-document protections

Longer term, evaluate client-side encryption and a zero-knowledge-style
architecture using established, reviewed cryptographic designs.

## Phase 9: Developer platform

### API and authentication

- File, upload, share, and delete APIs
- API keys
- Personal access tokens
- SDKs

### CLI

Potential commands:

```text
storagesync login
storagesync ls
storagesync upload build.zip
storagesync download <file-id>
storagesync share build.zip --expire 24h
storagesync sync ./project
```

### Webhooks

Potential events:

```text
file.uploaded
file.deleted
upload.completed
share.opened
share.expired
quota.exceeded
```

## Phase 10: Temporary transfers

Add a separate Send experience for transferring large files without keeping
them permanently in the user's drive.

- Expire after an hour, day, or week
- Optional password
- Maximum download count
- Delete after first download
- Email recipient
- Download notifications

## Phase 11: Organization and automation

### Inbox

Let unorganized files land in an Inbox so users can sort them later.

### Automation rules

Rules can move or classify files using properties such as MIME type, filename,
upload source, or uploader. For example:

```text
IF mime_type = application/pdf
AND source = file_request
THEN move to Documents/Requests
```

### Duplicate detection

- Detect identical files using hashes
- Warn before uploading a duplicate
- Show the existing file's location
- Later evaluate full-file and chunk-level deduplication

## Phase 12: Photos and media

- Photo timeline and date grouping
- Albums and favorites
- Camera backup and automatic mobile uploads
- EXIF metadata
- Video previews

## Phase 13: Spaces, families, and teams

Move beyond folders with purpose-specific Spaces, such as Personal, Family,
Client, Project, Developer, Public, and Vault.

### Family

- Family members and shared storage quota
- Shared albums and documents
- Emergency-document area
- Child/parent folder permissions
- Private "My Files" alongside a shared Family Space

### Teams and organizations

- Organizations, members, and roles
- Owner, Admin, Member, and Guest roles
- Workspace storage and team folders
- Admin dashboard and audit logs
- Remove members and transfer ownership

### Client spaces and branding

- Client-specific upload/download permissions
- Custom domain, logo, and colors
- Branded upload portals and share pages

## Phase 14: Desktop sync and offline access

- Desktop sync application
- Filesystem watchers
- Local metadata database
- File hashes and sync queues
- Conflict detection and resolution
- Offline state handling
- Mark selected files/folders as available offline
- Sync offline changes when connectivity returns

## Platform security and reliability

These concerns grow alongside the relevant product phases rather than waiting
until the end:

- Email verification and secure password reset
- Session and device management
- Log out other devices
- Two-factor authentication and passkeys
- Login history and suspicious-login alerts
- Rate limiting
- File validation, antivirus scanning, and malware detection
- Secure signed download URLs
- Share-token rotation

## Storage management

- Usage breakdown by file category, versions, and trash
- Largest and oldest files
- Duplicate-file review
- Trash cleanup
- Old-version cleanup

## Notifications

Support in-app and email notifications for meaningful events:

- File shared or uploaded
- File request received or submitted
- Share opened
- Comment or mention
- Storage nearly full
- Upload failure
- New login

Push notifications can be evaluated later.

## Backup and recovery (long term)

- Folder snapshots
- Immutable backups
- Deleted-file recovery
- Ransomware protection
- Restore a folder to a previous point in time

## Current direction

The rough product sequence is:

```text
Core cloud drive
-> Reliable uploads
-> Advanced sharing
-> File Requests
-> Version history
-> Search
-> Activity
-> Private Vault
-> Developer API and CLI
-> Temporary transfers
-> Automation rules
-> Desktop sync
-> Families and teams
```

The strongest candidates for a distinct product identity are:

1. File Requests
2. Private Vault
3. Developer API and CLI
4. Powerful expiring and password-protected sharing

