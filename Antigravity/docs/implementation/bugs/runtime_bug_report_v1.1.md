# Runtime Bug Report v1.1

**Bug ID**: BUG-RT-003  
**Date**: 2026-01-28  
**Status**: FIXED (Verified)

## 🔍 Evidence
Image shows "Đăng nhập thất bại - Lỗi kết nối Server".

## 🏁 Resolution
- Fixed property access error in `app/api/auth/login/route.ts`: changed `user.password` to `user.password_hash`.
- This resolved the 500 error that was being masked as a "Server connection error".
