# Runtime Bug Report v1.2

**Bug ID**: BUG-RT-004  
**Date**: 2026-01-28  
**Environment**: Local / Dev  

## 🔍 Evidence
**Image Content**:
- Modal: "Thêm Tiêu Chí Chấm Điểm Mới" (Add New Scoring Criterion).
- Input: Category="Nguồn Lead", Criterion="test", Points=20, Status=Active.
- Toast Message: "Thêm thất bại" (Add failed).

## 🛠️ Analysis
- **Error Message**: Add failed.
- **Bug Category**: API Bug / Missing Implementation.
- **Affected Module**: CRM / Scoring.
- **Root Cause**: 
    1. The API endpoint for creating scoring rules (`POST /api/crm/scoring/rules`) is not implemented in either Next.js API routes or the NestJS controller (`src/modules/crm/scoring/scoring.controller.ts`).
    2. The existing `GET /api/crm/scoring/rules` endpoint in NestJS returns hardcoded mock data and does not interact with the `ScoringRule` table in the database.

## 📜 Trace to Docs
- **FRD**: SCR-CRM-003 (Lead Scoring).
- **API Spec**: `POST /api/crm/scoring/rules`.
- **ERD**: `ScoringRule` table.

## 🏁 Proposed Action
**Proposed Action**: BUG FIX  
- **Description**: 
    1. Implement `POST /api/crm/scoring/rules` API endpoint.
    2. Update `GET /api/crm/scoring/rules` to fetch data from the `ScoringRule` table.
- **Status**: Waiting classification.
