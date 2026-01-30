# Honda DMS - API Specification
## Module 2: CRM (Customer Relationship Management)

**Version**: 1.0  
**Date**: 2026-01-28  
**Module**: CRM  
**Total APIs**: 40

---

## 📋 Module Overview

**Purpose**: Quản lý toàn bộ vòng đời khách hàng từ Lead → Customer → Loyalty

**FRD References**: SCR-CRM-001 to SCR-CRM-010

**Sub-modules**:
1. **Leads Management** (10 APIs) - SCR-CRM-001
2. **Customers Management** (8 APIs) - SCR-CRM-002  
3. **Scoring Management** (5 APIs) - SCR-CRM-003
4. **Interactions** (5 APIs) - SCR-CRM-005
5. **Reminders** (4 APIs) - SCR-CRM-006
6. **Complaints** (4 APIs) - SCR-CRM-009
7. **Marketing** (4 APIs) - SCR-CRM-010

---

## 🔹 Sub-module 1: Leads Management (10 APIs)

### API-CRM-001: List Leads
- **Endpoint**: `GET /api/crm/leads`
- **FRD**: SCR-CRM-001 (Quản Lý Leads)
- **ERD**: `leads` table, JOIN `users` (assigned_to)
- **Request**: Query params (status, source, assigned_to_id, score_min, score_max, search, page, limit)
- **Response**: Array of leads with pagination
- **Rules**: 
  - BR-CRM-001: Default sort by created_at DESC
  - BR-CRM-002: Default limit = 20, max = 100
  - BR-CRM-003: Search trong name và phone (LIKE %search%)
  - BR-CRM-004: Chỉ show leads của user hiện tại (except ADMIN/MANAGER)

### API-CRM-002: Create Lead
- **Endpoint**: `POST /api/crm/leads`
- **FRD**: SCR-CRM-001 (Create Lead Dialog)
- **ERD**: `leads` INSERT
- **Request**: Body (name*, phone*, email, address, model_interest, budget, source*, assigned_to_id)
- **Response**: Created lead with id, status=NEW, score=10
- **Rules**:
  - BR-CRM-005: Default status = 'NEW', score = 10
  - BR-CRM-006: Phone có thể trùng (không UNIQUE)
  - BR-CRM-007: Auto-assign nếu không có assigned_to_id
  - BR-CRM-008: Trigger scoring engine sau khi tạo

### API-CRM-003: Get Lead Detail
- **Endpoint**: `GET /api/crm/leads/{id}`
- **FRD**: SCR-CRM-001 (Lead Dialog)
- **ERD**: `leads`, JOIN `users`, `customers`, COUNT `interactions`
- **Request**: Path param (id)
- **Response**: Full lead details + assigned_to + customer + interactions_count
- **Rules**:
  - BR-CRM-009: Chỉ show lead của user hiện tại (except ADMIN/MANAGER)
  - BR-CRM-010: Include interactions_count (COUNT)

### API-CRM-004: Update Lead
- **Endpoint**: `PUT /api/crm/leads/{id}`
- **FRD**: SCR-CRM-001 (Edit Lead)
- **ERD**: `leads` UPDATE
- **Request**: Path param (id), Body (partial update - all fields optional)
- **Response**: Updated lead id + updated_at
- **Rules**:
  - BR-CRM-011: Partial update (only sent fields)
  - BR-CRM-012: Auto update updated_at = now()
  - BR-CRM-013: Không cho update nếu status = 'WON'
  - BR-CRM-014: Re-calculate score nếu thay đổi thông tin quan trọng

### API-CRM-005: Delete Lead
- **Endpoint**: `DELETE /api/crm/leads/{id}`
- **FRD**: SCR-CRM-001
- **ERD**: `leads` UPDATE status = 'DEAD' (soft delete)
- **Request**: Path param (id)
- **Response**: Success message
- **Rules**:
  - BR-CRM-015: Soft delete: UPDATE status = 'DEAD'
  - BR-CRM-016: Không xóa vật lý (keep for analytics)
  - BR-CRM-017: Không cho xóa nếu status = 'WON'

### API-CRM-006: Assign Lead
- **Endpoint**: `POST /api/crm/leads/{id}/assign`
- **FRD**: SCR-CRM-001 (Assign lead to sales rep)
- **ERD**: `leads` UPDATE assigned_to_id
- **Request**: Path param (id), Body (assigned_to_id*)
- **Response**: Updated lead with new assigned_to info
- **Rules**:
  - BR-CRM-018: Chỉ MANAGER/ADMIN có thể assign
  - BR-CRM-019: Log activity khi assign

### API-CRM-007: Convert Lead to Customer
- **Endpoint**: `POST /api/crm/leads/{id}/convert`
- **FRD**: SCR-CRM-001 (Convert lead)
- **ERD**: `leads` UPDATE (status='WON', customer_id), `customers` INSERT/UPDATE
- **Request**: Path param (id), Body (create_new, existing_customer_id)
- **Response**: lead_id + customer_id + customer details
- **Rules**:
  - BR-CRM-020: Chỉ convert nếu status >= 'QUALIFIED'
  - BR-CRM-021: Check duplicate phone trong customers
  - BR-CRM-022: Nếu phone đã tồn tại → link to existing customer
  - BR-CRM-023: New customer: tier = 'BRONZE', points = 0

### API-CRM-008: Update Lead Score
- **Endpoint**: `POST /api/crm/leads/{id}/score`
- **FRD**: SCR-CRM-003 (Chấm Điểm Lead)
- **ERD**: `leads` UPDATE score
- **Request**: Path param (id), Body (score*, reason)
- **Response**: Updated score + previous_score
- **Rules**:
  - BR-CRM-024: Score range: 1-100
  - BR-CRM-025: Log score changes in activity_logs

### API-CRM-009: Search Leads
- **Endpoint**: `GET /api/crm/leads/search`
- **FRD**: SCR-CRM-001 (Search)
- **ERD**: `leads` with full-text search
- **Request**: Query params (q*, limit)
- **Response**: Array of matching leads (simplified)
- **Rules**:
  - BR-CRM-026: Search trong name, phone, email
  - BR-CRM-027: Case-insensitive, Order by score DESC

### API-CRM-010: Get Lead Activities
- **Endpoint**: `GET /api/crm/leads/{id}/activities`
- **FRD**: SCR-CRM-005 (Lịch Sử & Hoạt Động)
- **ERD**: `interactions` WHERE lead_id, JOIN `users`
- **Request**: Path param (id), Query (type, page, limit)
- **Response**: Array of interactions with pagination
- **Rules**:
  - BR-CRM-028: Order by created_at DESC
  - BR-CRM-029: Include user info (JOIN)

---

## 🔹 Sub-module 2: Customers Management (8 APIs)

### API-CRM-011: List Customers
- **Endpoint**: `GET /api/crm/customers`
- **FRD**: SCR-CRM-002 (Khách Hàng)
- **ERD**: `customers` table
- **Request**: Query params (type, tier, search, sort_by, page, limit)
- **Response**: Array of customers with pagination
- **Rules**:
  - BR-CRM-030: Default tier = 'SILVER' for new customers
  - BR-CRM-031: Phone is UNIQUE constraint
  - BR-CRM-032: Tags stored as JSON array

### API-CRM-012: Create Customer
- **Endpoint**: `POST /api/crm/customers`
- **FRD**: SCR-CRM-002 (Create Customer)
- **ERD**: `customers` INSERT
- **Request**: Body (name*, type*, phone*, mobile, email, address, vat, tags, notes)
- **Response**: Created customer with id, tier=SILVER, points=0
- **Rules**:
  - BR-CRM-033: Default tier = 'SILVER', points = 0
  - BR-CRM-034: Phone must be UNIQUE
  - BR-CRM-035: VAT required if type = 'COMPANY'

### API-CRM-013: Get Customer Detail
- **Endpoint**: `GET /api/crm/customers/{id}`
- **FRD**: SCR-CRM-002 (Customer Detail)
- **ERD**: `customers`, aggregate stats from `contracts`, `leads`
- **Request**: Path param (id)
- **Response**: Full customer details + stats (total_purchases, total_spent, leads_count)
- **Rules**:
  - BR-CRM-036: Include stats (aggregation)
  - BR-CRM-037: total_purchases = COUNT(contracts)
  - BR-CRM-038: total_spent = SUM(contracts.total_amount)

### API-CRM-014: Update Customer
- **Endpoint**: `PUT /api/crm/customers/{id}`
- **FRD**: SCR-CRM-002 (Edit Customer)
- **ERD**: `customers` UPDATE
- **Request**: Path param (id), Body (partial update)
- **Response**: Updated customer id + updated_at
- **Rules**:
  - BR-CRM-039: Partial update (only sent fields)
  - BR-CRM-040: Check phone UNIQUE if updating phone

### API-CRM-015: Delete Customer
- **Endpoint**: `DELETE /api/crm/customers/{id}`
- **FRD**: SCR-CRM-002
- **ERD**: `customers` UPDATE status = 'INACTIVE' (soft delete)
- **Request**: Path param (id)
- **Response**: Success message
- **Rules**:
  - BR-CRM-041: Soft delete: UPDATE status = 'INACTIVE'
  - BR-CRM-042: Không cho xóa nếu có contracts active

### API-CRM-016: Get Customer Loyalty Transactions
- **Endpoint**: `GET /api/crm/customers/{id}/loyalty`
- **FRD**: SCR-CRM-007 (Chương Trình Loyalty)
- **ERD**: `loyalty_transactions` WHERE customer_id
- **Request**: Path param (id), Query (type, page, limit)
- **Response**: Array of loyalty transactions + current_points in meta
- **Rules**:
  - BR-CRM-043: EARN = positive, REDEEM = negative points
  - BR-CRM-044: current_points = SUM(points)

### API-CRM-017: Add Loyalty Points
- **Endpoint**: `POST /api/crm/customers/{id}/loyalty`
- **FRD**: SCR-CRM-007 (Add loyalty points)
- **ERD**: `loyalty_transactions` INSERT, `customers` UPDATE points
- **Request**: Path param (id), Body (points*, description*, reference_type, reference_id)
- **Response**: transaction_id + new_total + new_tier
- **Rules**:
  - BR-CRM-045: Positive = EARN, Negative = REDEEM
  - BR-CRM-046: Auto upgrade/downgrade tier based on points
  - BR-CRM-047: Tier thresholds: BRONZE (0-499), SILVER (500-1999), GOLD (2000-4999), PLATINUM (5000+)

### API-CRM-018: Search Customers
- **Endpoint**: `GET /api/crm/customers/search`
- **FRD**: SCR-CRM-002 (Search)
- **ERD**: `customers` with full-text search
- **Request**: Query params (q*, limit)
- **Response**: Array of matching customers (simplified)
- **Rules**:
  - BR-CRM-048: Search trong name, phone, mobile, email, vat
  - BR-CRM-049: Order by tier DESC, then name ASC

---

## 🔹 Sub-module 3: Scoring Management (5 APIs)

### API-CRM-019: Get Scoring Rules
- **Endpoint**: `GET /api/crm/scoring/rules`
- **FRD**: SCR-CRM-003 (Chấm Điểm Lead)
- **ERD**: `scoring_rules` table
- **Request**: None
- **Response**: Array of scoring rules with conditions (JSON)
- **Rules**:
  - BR-CRM-050: Total weight must = 100
  - BR-CRM-051: Auto-apply rules when lead created/updated

### API-CRM-020: Update Scoring Rules
- **Endpoint**: `PUT /api/crm/scoring/rules`
- **FRD**: SCR-CRM-003 (Configure scoring)
- **ERD**: `scoring_rules` UPDATE/INSERT
- **Request**: Body (rules array with name, field, weight, conditions)
- **Response**: Updated rules
- **Rules**:
  - BR-CRM-052: Validate total weight = 100
  - BR-CRM-053: Recalculate all leads after update

### API-CRM-021: Calculate Lead Score
- **Endpoint**: `POST /api/crm/scoring/calculate/{id}`
- **FRD**: SCR-CRM-003
- **ERD**: Read `scoring_rules`, UPDATE `leads.score`
- **Request**: Path param (lead_id)
- **Response**: Calculated score + breakdown by rule
- **Rules**:
  - BR-CRM-054: Apply all active rules
  - BR-CRM-055: Log score calculation details

### API-CRM-022: Get Score Distribution
- **Endpoint**: `GET /api/crm/scoring/distribution`
- **FRD**: SCR-CRM-003 (Dashboard)
- **ERD**: Aggregate `leads.score`
- **Request**: Query params (date_from, date_to)
- **Response**: Score distribution histogram
- **Rules**:
  - BR-CRM-056: Group by score ranges (0-20, 21-40, 41-60, 61-80, 81-100)

### API-CRM-023: Simulate Score
- **Endpoint**: `POST /api/crm/scoring/simulate`
- **FRD**: SCR-CRM-003 (Test scoring)
- **ERD**: Read `scoring_rules` (no write)
- **Request**: Body (lead data without saving)
- **Response**: Simulated score + breakdown
- **Rules**:
  - BR-CRM-057: No database write, calculation only

---

## 🔹 Sub-module 4: Interactions (5 APIs)

### API-CRM-024: List Interactions
- **Endpoint**: `GET /api/crm/interactions`
- **FRD**: SCR-CRM-005 (Lịch Sử & Hoạt Động)
- **ERD**: `interactions` table, JOIN `leads`, `customers`, `users`
- **Request**: Query params (lead_id, customer_id, type, user_id, date_from, date_to, page, limit)
- **Response**: Array of interactions with pagination
- **Rules**:
  - BR-CRM-058: Order by created_at DESC
  - BR-CRM-059: Include related entities (lead/customer/user)

### API-CRM-025: Create Interaction
- **Endpoint**: `POST /api/crm/interactions`
- **FRD**: SCR-CRM-005 (Log activity)
- **ERD**: `interactions` INSERT
- **Request**: Body (lead_id OR customer_id, type*, outcome, notes, metadata)
- **Response**: Created interaction with id
- **Rules**:
  - BR-CRM-060: Must have either lead_id OR customer_id
  - BR-CRM-061: Auto set user_id = current user
  - BR-CRM-062: Update lead.last_interaction_at

### API-CRM-026: Get Interaction Detail
- **Endpoint**: `GET /api/crm/interactions/{id}`
- **FRD**: SCR-CRM-005
- **ERD**: `interactions`, JOIN related entities
- **Request**: Path param (id)
- **Response**: Full interaction details
- **Rules**:
  - BR-CRM-063: Include lead/customer/user details

### API-CRM-027: Update Interaction
- **Endpoint**: `PUT /api/crm/interactions/{id}`
- **FRD**: SCR-CRM-005 (Edit activity)
- **ERD**: `interactions` UPDATE
- **Request**: Path param (id), Body (partial update)
- **Response**: Updated interaction
- **Rules**:
  - BR-CRM-064: Only creator or ADMIN can update

### API-CRM-028: Delete Interaction
- **Endpoint**: `DELETE /api/crm/interactions/{id}`
- **FRD**: SCR-CRM-005
- **ERD**: `interactions` DELETE (hard delete)
- **Request**: Path param (id)
- **Response**: Success message
- **Rules**:
  - BR-CRM-065: Only creator or ADMIN can delete

---

## 🔹 Sub-module 5: Reminders (4 APIs)

### API-CRM-029: List Reminders
- **Endpoint**: `GET /api/crm/reminders`
- **FRD**: SCR-CRM-006 (Nhắc Bảo Dưỡng)
- **ERD**: `reminders` table, JOIN `customers`
- **Request**: Query params (customer_id, type, status, scheduled_date_from, scheduled_date_to, page, limit)
- **Response**: Array of reminders with pagination
- **Rules**:
  - BR-CRM-066: Order by scheduled_date ASC
  - BR-CRM-067: Types: MAINTENANCE, INSPECTION, INSURANCE, BIRTHDAY

### API-CRM-030: Create Reminder
- **Endpoint**: `POST /api/crm/reminders`
- **FRD**: SCR-CRM-006 (Create reminder)
- **ERD**: `reminders` INSERT
- **Request**: Body (customer_id*, type*, scheduled_date*, message, channel)
- **Response**: Created reminder with id
- **Rules**:
  - BR-CRM-068: Default status = 'PENDING'
  - BR-CRM-069: Channels: SMS, EMAIL, ZALO

### API-CRM-031: Update Reminder Status
- **Endpoint**: `PUT /api/crm/reminders/{id}/status`
- **FRD**: SCR-CRM-006
- **ERD**: `reminders` UPDATE status, sent_at
- **Request**: Path param (id), Body (status*)
- **Response**: Updated reminder
- **Rules**:
  - BR-CRM-070: Status: PENDING, SENT, FAILED
  - BR-CRM-071: Auto set sent_at when status = SENT

### API-CRM-032: Send Reminder
- **Endpoint**: `POST /api/crm/reminders/{id}/send`
- **FRD**: SCR-CRM-006 (Send reminder now)
- **ERD**: `reminders` UPDATE status, sent_at
- **Request**: Path param (id)
- **Response**: Send result (success/failure)
- **Rules**:
  - BR-CRM-072: Trigger notification service (SMS/Email/Zalo)
  - BR-CRM-073: Update status based on send result

---

## 🔹 Sub-module 6: Complaints (4 APIs)

### API-CRM-033: List Complaints
- **Endpoint**: `GET /api/crm/complaints`
- **FRD**: SCR-CRM-009 (Khiếu Nại)
- **ERD**: `complaints` table, JOIN `customers`, `users`
- **Request**: Query params (customer_id, status, priority, assigned_to_id, page, limit)
- **Response**: Array of complaints with pagination
- **Rules**:
  - BR-CRM-074: Order by priority DESC, created_at DESC
  - BR-CRM-075: Status: NEW, IN_PROGRESS, RESOLVED, CLOSED

### API-CRM-034: Create Complaint
- **Endpoint**: `POST /api/crm/complaints`
- **FRD**: SCR-CRM-009 (Create complaint)
- **ERD**: `complaints` INSERT
- **Request**: Body (customer_id*, category*, priority*, description*, assigned_to_id)
- **Response**: Created complaint with id
- **Rules**:
  - BR-CRM-076: Default status = 'NEW'
  - BR-CRM-077: Priority: LOW, MEDIUM, HIGH, URGENT

### API-CRM-035: Update Complaint Status
- **Endpoint**: `PUT /api/crm/complaints/{id}/status`
- **FRD**: SCR-CRM-009
- **ERD**: `complaints` UPDATE status, updated_at
- **Request**: Path param (id), Body (status*, resolution)
- **Response**: Updated complaint
- **Rules**:
  - BR-CRM-078: Resolution required if status = RESOLVED
  - BR-CRM-079: Auto set resolved_at when status = RESOLVED

### API-CRM-036: Resolve Complaint
- **Endpoint**: `POST /api/crm/complaints/{id}/resolve`
- **FRD**: SCR-CRM-009 (Resolve complaint)
- **ERD**: `complaints` UPDATE status='RESOLVED', resolution, resolved_at
- **Request**: Path param (id), Body (resolution*)
- **Response**: Resolved complaint
- **Rules**:
  - BR-CRM-080: Set status = RESOLVED, resolved_at = now()
  - BR-CRM-081: Notify customer về resolution

---

## 🔹 Sub-module 7: Marketing (4 APIs)

### API-CRM-037: List Campaigns
- **Endpoint**: `GET /api/crm/campaigns`
- **FRD**: SCR-CRM-010 (Marketing)
- **ERD**: `marketing_campaigns` table
- **Request**: Query params (type, status, date_from, date_to, page, limit)
- **Response**: Array of campaigns with pagination
- **Rules**:
  - BR-CRM-082: Order by start_date DESC
  - BR-CRM-083: Types: SMS, EMAIL, SOCIAL, EVENT, ZALO, FACEBOOK

### API-CRM-038: Create Campaign
- **Endpoint**: `POST /api/crm/campaigns`
- **FRD**: SCR-CRM-010 (Create campaign)
- **ERD**: `marketing_campaigns` INSERT
- **Request**: Body (name*, type*, target_segment, budget, start_date, end_date)
- **Response**: Created campaign with id
- **Rules**:
  - BR-CRM-084: Default status = 'DRAFT'
  - BR-CRM-085: target_segment stored as JSON

### API-CRM-039: Get Campaign Performance
- **Endpoint**: `GET /api/crm/campaigns/{id}/performance`
- **FRD**: SCR-CRM-010 (Campaign analytics)
- **ERD**: `marketing_campaigns`, aggregate metrics
- **Request**: Path param (id)
- **Response**: Performance metrics (sent, opened, clicked, converted counts + rates)
- **Rules**:
  - BR-CRM-086: Calculate rates: open_rate, click_rate, conversion_rate
  - BR-CRM-087: ROI = (converted_value - budget) / budget

### API-CRM-040: Send Campaign
- **Endpoint**: `POST /api/crm/campaigns/{id}/send`
- **FRD**: SCR-CRM-010 (Execute campaign)
- **ERD**: `marketing_campaigns` UPDATE status='ACTIVE', sent_count
- **Request**: Path param (id)
- **Response**: Send result (total sent, failed)
- **Rules**:
  - BR-CRM-088: Filter customers by target_segment
  - BR-CRM-089: Update sent_count after sending
  - BR-CRM-090: Set status = ACTIVE

---

**End of Module 2: CRM (40 APIs)**

**Summary**:
- ✅ Leads Management: 10 APIs
- ✅ Customers Management: 8 APIs
- ✅ Scoring Management: 5 APIs
- ✅ Interactions: 5 APIs
- ✅ Reminders: 4 APIs
- ✅ Complaints: 4 APIs
- ✅ Marketing: 4 APIs
