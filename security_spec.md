# Security Specification: FlixDairy

## 1. Data Invariants
- **Public Read Model**: Movies and Categories are publicly readable by any visitor browsing the FlixDairy vault (simulating Netflix browsing experience).
- **Admin Write Authority**: Only authenticated administrators (such as `moshaibur.mahadi@gmail.com` or users explicitly recorded in the `/admins/{adminId}` collection) can create, update, or delete movies and categories.
- **Payload Boundaries**: All string properties must respect upper-bound size checks to prevent Denial-of-Wallet or storage injection attacks.
- **Relational Integrity**: Category names and movie IDs must conform to alphanumeric/hyphen patterns without injection payloads.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated Movie Creation**: Anonymous user sending `create /movies/evil-movie`. (Expect: PERMISSION_DENIED)
2. **Unauthenticated Category Creation**: Anonymous user creating `/categories/spam`. (Expect: PERMISSION_DENIED)
3. **Malicious Admin Escalation**: Regular authenticated non-admin creating `/admins/{their_uid}`. (Expect: PERMISSION_DENIED)
4. **Oversized Field Attack**: Admin payload sending 5MB string in movie `description`. (Expect: PERMISSION_DENIED)
5. **Rating Boundary Overflow**: Payload sending `personalRating: 9999` or `personalRating: -5`. (Expect: PERMISSION_DENIED)
6. **Path Traversal / Special Char ID**: Writing movie with ID containing `../` or special control characters. (Expect: PERMISSION_DENIED)
7. **Ghost Field Poisoning**: Inserting unexpected properties into movie schema during update. (Expect: PERMISSION_DENIED)
8. **Unauthorized Movie Deletion**: Unauthenticated or non-admin client deleting a movie document. (Expect: PERMISSION_DENIED)
9. **Category Subcategories Array Flooding**: Subcategories array with 5000 elements. (Expect: PERMISSION_DENIED)
10. **Spoofed Email Attack**: Auth token claiming admin email with `email_verified: false`. (Expect: PERMISSION_DENIED)
11. **Admin Record Tampering**: Non-admin user updating another admin document's role to superadmin. (Expect: PERMISSION_DENIED)
12. **Blanket Overwrite Attack**: Attempting to overwrite the entire collection via batch without per-document admin authorization. (Expect: PERMISSION_DENIED)
