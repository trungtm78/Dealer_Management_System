# Integration Test Cases - CR-MD-001 VehicleModel Master Data

## Document Information
- **Document ID**: INTEG-TEST-CASES-001
- **Version**: 1.0
- **Date**: 2025-06-18
- **Project**: CRM VehicleModel Master Data Integration
- **Change Request**: CR-MD-001

## 1. Introduction

### 1.1 Purpose
This document defines specific integration test cases for the VehicleModel Master Data API endpoints. Each test case includes detailed steps, expected results, and verification criteria.

### 1.2 Test Case Structure
- **Test Case ID**: Unique identifier
- **Test Module**: Related module group
- **Test Description**: Brief description of what is being tested
- **Prerequisites**: Required conditions before test execution
- **Test Steps**: Step-by-step execution instructions
- **Expected Results**: Expected outcomes and responses
- **Verification Points**: Specific items to verify

## 2. Module 1: VehicleModel CRUD Operations

### 2.1 Test Case: CRUD-001 - Create VehicleModel Successfully
- **Test Module**: Module 1 - CRUD Operations
- **Test Description**: Verify successful creation of a new vehicle model
- **Prerequisites**: 
  - Database is in clean state
  - Test user has admin privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send POST request to `/api/vehicle-models` with valid vehicle model data
  2. Include required fields: name, code, category, base_price
  3. Include optional fields: description, status
  4. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 201 Created
  - Response Body: Created vehicle model object with ID and timestamps
  - Database: New record exists in VehicleModel table
  - Audit Log: Create action logged in activity_logs
- **Verification Points**:
  - Response contains all fields with correct data types
  - ID is generated and is numeric
  - created_at and updated_at timestamps are set
  - Database record matches request data
  - Audit log contains correct entity type, action, and values

### 2.2 Test Case: CRUD-002 - Get VehicleModel List Successfully
- **Test Module**: Module 1 - CRUD Operations
- **Test Description**: Verify successful retrieval of vehicle model list
- **Prerequisites**:
  - VehicleModel records exist in database
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models`
  2. Include valid authentication token
  3. Optionally include query parameters: page, limit
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Array of vehicle model objects with pagination metadata
  - Database: Query executes successfully
  - Audit Log: Read action logged in activity_logs
- **Verification Points**:
  - Response contains array of vehicle models
  - Pagination metadata is correct (total, page, limit, totalPages)
  - All database records are returned (or paginated subset)
  - Audit log contains read action with correct entity type

### 2.3 Test Case: CRUD-003 - Get VehicleModel by ID Successfully
- **Test Module**: Module 1 - CRUD Operations
- **Test Description**: Verify successful retrieval of specific vehicle model by ID
- **Prerequisites**:
  - Specific VehicleModel record exists in database
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models/{id}` with valid ID
  2. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Single vehicle model object
  - Database: Query executes successfully
  - Audit Log: Read action logged in activity_logs
- **Verification Points**:
  - Response contains correct vehicle model data
  - All fields are present with correct values
  - ID matches requested ID
  - Audit log contains read action with correct entity ID

### 2.4 Test Case: CRUD-004 - Update VehicleModel Successfully
- **Test Module**: Module 1 - CRUD Operations
- **Test Description**: Verify successful update of existing vehicle model
- **Prerequisites**:
  - VehicleModel record exists in database
  - Test user has update privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send PATCH request to `/api/vehicle-models/{id}` with partial update data
  2. Include fields to update: name, description, base_price
  3. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Updated vehicle model object
  - Database: Record is updated with new values
  - Audit Log: Update action logged in activity_logs
- **Verification Points**:
  - Response contains updated vehicle model data
  - Only specified fields are updated
  - updated_at timestamp is changed
  - Database record matches response data
  - Audit log contains old and new values

### 2.5 Test Case: CRUD-005 - Delete VehicleModel Successfully
- **Test Module**: Module 1 - CRUD Operations
- **Test Description**: Verify successful soft delete of vehicle model
- **Prerequisites**:
  - VehicleModel record exists in database with no related records
  - Test user has delete privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send DELETE request to `/api/vehicle-models/{id}` with valid ID
  2. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Success confirmation message
  - Database: Record status is set to 'inactive'
  - Audit Log: Delete action logged in activity_logs
- **Verification Points**:
  - Response contains success message
  - Record still exists in database with status 'inactive'
  - updated_at timestamp is changed
  - Audit log contains delete action with correct entity ID

## 3. Module 2: VehicleModel Validation and Business Rules

### 3.1 Test Case: VAL-001 - Create VehicleModel with Missing Required Fields
- **Test Module**: Module 2 - Validation and Business Rules
- **Test Description**: Verify validation error when required fields are missing
- **Prerequisites**:
  - Database is in clean state
  - Test user has admin privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send POST request to `/api/vehicle-models` with missing required fields
  2. Omit one or more required fields (name, code, category, base_price)
  3. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 400 Bad Request
  - Response Body: Error message with validation details
  - Database: No new record created
  - Audit Log: No log entry (operation blocked by validation)
- **Verification Points**:
  - Response contains validation error details
  - Error message specifies which fields are missing
  - Database count remains unchanged
  - No audit log entry for create action

### 3.2 Test Case: VAL-002 - Create VehicleModel with Duplicate Code
- **Test Module**: Module 2 - Validation and Business Rules
- **Test Description**: Verify uniqueness constraint violation for code field
- **Prerequisites**:
  - VehicleModel with code 'TEST-001' exists in database
  - Test user has admin privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send POST request to `/api/vehicle-models` with duplicate code
  2. Use code 'TEST-001' that already exists
  3. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 409 Conflict
  - Response Body: Error message about duplicate code
  - Database: No new record created
  - Audit Log: No log entry (operation blocked by constraint)
- **Verification Points**:
  - Response contains duplicate code error
  - Database constraint is enforced
  - Database count remains unchanged
  - No audit log entry for create action

### 3.3 Test Case: VAL-003 - Create VehicleModel with Invalid Base Price
- **Test Module**: Module 2 - Validation and Business Rules
- **Test Description**: Verify validation error for negative base price
- **Prerequisites**:
  - Database is in clean state
  - Test user has admin privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send POST request to `/api/vehicle-models` with negative base price
  2. Set base_price to -100.00
  3. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 400 Bad Request
  - Response Body: Error message about invalid base price
  - Database: No new record created
  - Audit Log: No log entry (operation blocked by validation)
- **Verification Points**:
  - Response contains validation error for base price
  - Error message specifies base price must be positive
  - Database count remains unchanged
  - No audit log entry for create action

### 3.4 Test Case: VAL-004 - Update VehicleModel with Invalid Status Transition
- **Test Module**: Module 2 - Validation and Business Rules
- **Test Description**: Verify status transition validation
- **Prerequisites**:
  - VehicleModel record exists with status 'inactive'
  - Test user has update privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send PATCH request to `/api/vehicle-models/{id}`
  2. Attempt to set status to invalid value (e.g., 'pending')
  3. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 400 Bad Request
  - Response Body: Error message about invalid status value
  - Database: Record remains unchanged
  - Audit Log: No log entry (operation blocked by validation)
- **Verification Points**:
  - Response contains validation error for status field
  - Status value must be 'active' or 'inactive'
  - Database record status remains unchanged
  - No audit log entry for update action

### 3.5 Test Case: VAL-005 - Create VehicleModel with Field Length Violations
- **Test Module**: Module 2 - Validation and Business Rules
- **Test Description**: Verify field length constraints
- **Prerequisites**:
  - Database is in clean state
  - Test user has admin privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send POST request to `/api/vehicle-models` with fields exceeding maximum length
  2. Set name to 101+ characters, code to 21+ characters
  3. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 400 Bad Request
  - Response Body: Error message about field length violations
  - Database: No new record created
  - Audit Log: No log entry (operation blocked by validation)
- **Verification Points**:
  - Response contains validation errors for length violations
  - Error messages specify maximum allowed lengths
  - Database count remains unchanged
  - No audit log entry for create action

## 4. Module 3: VehicleModel Filtering and Search

### 4.1 Test Case: FIL-001 - Get VehicleModel List with Pagination
- **Test Module**: Module 3 - Filtering and Search
- **Test Description**: Verify pagination functionality
- **Prerequisites**:
  - Multiple VehicleModel records exist in database (at least 15)
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models?page=1&limit=5`
  2. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: First 5 vehicle models with pagination metadata
  - Database: Query executes with LIMIT and OFFSET
  - Audit Log: Read action logged
- **Verification Points**:
  - Response contains exactly 5 vehicle models
  - Pagination metadata shows correct totals
  - page=1, limit=5, totalPages=3 (for 15 records)
  - Next page should contain different records

### 4.2 Test Case: FIL-002 - Get VehicleModel List with Sorting
- **Test Module**: Module 3 - Filtering and Search
- **Test Description**: Verify sorting functionality
- **Prerequisites**:
  - Multiple VehicleModel records exist in database
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models?sort_by=name&sort_order=asc`
  2. Include valid authentication token
  3. Send GET request to `/api/vehicle-models?sort_by=base_price&sort_order=desc`
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Vehicle models sorted by specified field and order
  - Database: Query executes with ORDER BY clause
  - Audit Log: Read action logged
- **Verification Points**:
  - First request returns models sorted by name ascending
  - Second request returns models sorted by base_price descending
  - Sorting is applied correctly across all records
  - Pagination works correctly with sorting

### 4.3 Test Case: FIL-003 - Get VehicleModel List with Status Filter
- **Test Module**: Module 3 - Filtering and Search
- **Test Description**: Verify status filtering functionality
- **Prerequisites**:
  - VehicleModel records exist with both 'active' and 'inactive' status
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models?status=active`
  2. Include valid authentication token
  3. Send GET request to `/api/vehicle-models?status=inactive`
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Vehicle models filtered by status
  - Database: Query executes with WHERE clause
  - Audit Log: Read action logged
- **Verification Points**:
  - First request returns only active models
  - Second request returns only inactive models
  - Status filtering is applied correctly
  - Total count matches expected active/inactive counts

### 4.4 Test Case: FIL-004 - Get VehicleModel List with Search
- **Test Module**: Module 3 - Filtering and Search
- **Test Description**: Verify search functionality
- **Prerequisites**:
  - VehicleModel records exist with searchable names and codes
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models?search=Civic`
  2. Include valid authentication token
  3. Send GET request to `/api/vehicle-models?search=CRV`
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Vehicle models matching search term
  - Database: Query executes with LIKE clause
  - Audit Log: Read action logged
- **Verification Points**:
  - First request returns models with 'Civic' in name or code
  - Second request returns models with 'CRV' in name or code
  - Search is case-insensitive
  - Search matches both name and code fields

### 4.5 Test Case: FIL-005 - Get VehicleModel List with Combined Filters
- **Test Module**: Module 3 - Filtering and Search
- **Test Description**: Verify combination of multiple filters
- **Prerequisites**:
  - Multiple VehicleModel records exist with various attributes
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models?status=active&category=Sedan&page=1&limit=5&sort_by=name&sort_order=asc`
  2. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Filtered, sorted, and paginated vehicle models
  - Database: Query executes with combined WHERE, ORDER BY, LIMIT, OFFSET
  - Audit Log: Read action logged
- **Verification Points**:
  - Only active sedan models are returned
  - Results are sorted by name ascending
  - Pagination limits to 5 records
  - All filters work together correctly

## 5. Module 4: VehicleModel Audit Logging

### 5.1 Test Case: AUD-001 - Verify Create Action Logging
- **Test Module**: Module 4 - Audit Logging
- **Test Description**: Verify create operations are properly logged
- **Prerequisites**:
  - Database is in clean state
  - Test user has admin privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send POST request to `/api/vehicle-models` with valid data
  2. Include valid authentication token for user ID 1
  3. Record the returned vehicle model ID
  4. Query activity_logs for the create action
- **Expected Results**:
  - HTTP Status: 201 Created
  - Response Body: Created vehicle model
  - Audit Log: Create action logged with complete details
- **Verification Points**:
  - Audit log entry has entity_type='VehicleModel'
  - Audit log entry has action='create'
  - Audit log entry has entity_id matching created model ID
  - Audit log entry has new_values containing all create data
  - Audit log entry has user_id=1
  - Audit log entry has valid timestamp

### 5.2 Test Case: AUD-002 - Verify Update Action Logging
- **Test Module**: Module 4 - Audit Logging
- **Test Description**: Verify update operations are properly logged
- **Prerequisites**:
  - VehicleModel record exists in database
  - Test user has update privileges
  - Authentication token is valid
- **Test Steps**:
  1. Get current vehicle model data (for old_values comparison)
  2. Send PATCH request to `/api/vehicle-models/{id}` with update data
  3. Include valid authentication token for user ID 2
  4. Query activity_logs for the update action
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Updated vehicle model
  - Audit Log: Update action logged with old and new values
- **Verification Points**:
  - Audit log entry has entity_type='VehicleModel'
  - Audit log entry has action='update'
  - Audit log entry has entity_id matching updated model ID
  - Audit log entry has old_values containing data before update
  - Audit log entry has new_values containing data after update
  - Audit log entry has user_id=2
  - Audit log entry has valid timestamp

### 5.3 Test Case: AUD-003 - Verify Delete Action Logging
- **Test Module**: Module 4 - Audit Logging
- **Test Description**: Verify delete operations are properly logged
- **Prerequisites**:
  - VehicleModel record exists in database with no related records
  - Test user has delete privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send DELETE request to `/api/vehicle-models/{id}`
  2. Include valid authentication token for user ID 3
  3. Query activity_logs for the delete action
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Success confirmation message
  - Audit Log: Delete action logged
- **Verification Points**:
  - Audit log entry has entity_type='VehicleModel'
  - Audit log entry has action='delete'
  - Audit log entry has entity_id matching deleted model ID
  - Audit log entry has old_values containing data before delete
  - Audit log entry has new_values=null or empty
  - Audit log entry has user_id=3
  - Audit log entry has valid timestamp

### 5.4 Test Case: AUD-004 - Verify Read Action Logging
- **Test Module**: Module 4 - Audit Logging
- **Test Description**: Verify read operations are properly logged
- **Prerequisites**:
  - VehicleModel records exist in database
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models`
  2. Include valid authentication token for user ID 4
  3. Query activity_logs for read actions
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Vehicle model list
  - Audit Log: Read action logged
- **Verification Points**:
  - Audit log entry has entity_type='VehicleModel'
  - Audit log entry has action='read'
  - Audit log entry may have entity_id=null for list operations
  - Audit log entry has old_values=null
  - Audit log entry has new_values=null
  - Audit log entry has user_id=4
  - Audit log entry has valid timestamp

### 5.5 Test Case: AUD-005 - Verify Audit Log Data Integrity
- **Test Module**: Module 4 - Audit Logging
- **Test Description**: Verify audit log data is complete and accurate
- **Prerequisites**:
  - Multiple operations have been performed
  - Audit log contains multiple entries
- **Test Steps**:
  1. Query all audit log entries for VehicleModel operations
  2. Compare audit log data with actual database operations
  3. Verify chronological order of operations
- **Expected Results**:
  - All operations are logged
  - Data integrity is maintained
- **Verification Points**:
  - Every database operation has corresponding audit log
  - Audit log data matches actual operation data
  - Timestamps are in chronological order
  - User IDs are correctly captured
  - Entity types and actions are correct

## 6. Module 5: VehicleModel Relationship Integrity

### 6.1 Test Case: REL-001 - Delete VehicleModel with Related Quotations
- **Test Module**: Module 5 - Relationship Integrity
- **Test Description**: Verify soft delete behavior when related quotations exist
- **Prerequisites**:
  - VehicleModel record exists with related quotations
  - Test user has delete privileges
  - Authentication token is valid
- **Test Steps**:
  1. Verify related quotations exist for the vehicle model
  2. Send DELETE request to `/api/vehicle-models/{id}`
  3. Include valid authentication token
  4. Check the vehicle model status
  5. Check related quotations still exist
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Success confirmation message
  - Database: VehicleModel status set to 'inactive'
  - Database: Related quotations still exist
  - Audit Log: Delete action logged
- **Verification Points**:
  - VehicleModel status is changed to 'inactive'
  - VehicleModel record is not hard deleted
  - Related quotations still reference the vehicle model
  - Foreign key constraint is not violated
  - Audit log records the soft delete operation

### 6.2 Test Case: REL-002 - Delete VehicleModel with Related Vehicles
- **Test Module**: Module 5 - Relationship Integrity
- **Test Description**: Verify soft delete behavior when related vehicles exist
- **Prerequisites**:
  - VehicleModel record exists with related vehicles
  - Test user has delete privileges
  - Authentication token is valid
- **Test Steps**:
  1. Verify related vehicles exist for the vehicle model
  2. Send DELETE request to `/api/vehicle-models/{id}`
  3. Include valid authentication token
  4. Check the vehicle model status
  5. Check related vehicles still exist
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Success confirmation message
  - Database: VehicleModel status set to 'inactive'
  - Database: Related vehicles still exist
  - Audit Log: Delete action logged
- **Verification Points**:
  - VehicleModel status is changed to 'inactive'
  - VehicleModel record is not hard deleted
  - Related vehicles still reference the vehicle model
  - Foreign key constraint is not violated
  - Audit log records the soft delete operation

### 6.3 Test Case: REL-003 - Delete VehicleModel with Related Leads
- **Test Module**: Module 5 - Relationship Integrity
- **Test Description**: Verify soft delete behavior when related leads exist
- **Prerequisites**:
  - VehicleModel record exists with related leads
  - Test user has delete privileges
  - Authentication token is valid
- **Test Steps**:
  1. Verify related leads exist for the vehicle model
  2. Send DELETE request to `/api/vehicle-models/{id}`
  3. Include valid authentication token
  4. Check the vehicle model status
  5. Check related leads still exist
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Success confirmation message
  - Database: VehicleModel status set to 'inactive'
  - Database: Related leads still exist
  - Audit Log: Delete action logged
- **Verification Points**:
  - VehicleModel status is changed to 'inactive'
  - VehicleModel record is not hard deleted
  - Related leads still reference the vehicle model
  - Foreign key constraint is not violated
  - Audit log records the soft delete operation

### 6.4 Test Case: REL-004 - Cascade Update to Related Records
- **Test Module**: Module 5 - Relationship Integrity
- **Test Description**: Verify related records handle model updates correctly
- **Prerequisites**:
  - VehicleModel record exists with related records
  - Test user has update privileges
  - Authentication token is valid
- **Test Steps**:
  1. Verify related records exist for the vehicle model
  2. Send PATCH request to `/api/vehicle-models/{id}` with update data
  3. Include valid authentication token
  4. Check related records still reference the vehicle model
- **Expected Results**:
  - HTTP Status: 200 OK
  - Response Body: Updated vehicle model
  - Database: VehicleModel record updated
  - Database: Related records still reference the vehicle model
  - Audit Log: Update action logged
- **Verification Points**:
  - VehicleModel record is updated successfully
  - Related records still reference the same vehicle model ID
  - Foreign key relationships are maintained
  - No data integrity issues occur
  - Audit log records the update operation

### 6.5 Test Case: REL-005 - Prevent Hard Delete with Related Records
- **Test Module**: Module 5 - Relationship Integrity
- **Test Description**: Verify hard delete is prevented when related records exist
- **Prerequisites**:
  - VehicleModel record exists with related records
  - Database constraint prevents hard delete
  - Test user has delete privileges
  - Authentication token is valid
- **Test Steps**:
  1. Attempt to hard delete vehicle model from database directly
  2. Verify constraint prevents deletion
  3. Perform soft delete via API
- **Expected Results**:
  - Database: Hard delete fails due to foreign key constraint
  - API: Soft delete succeeds via status change
  - Audit Log: Delete action logged
- **Verification Points**:
  - Foreign key constraint prevents hard deletion
  - Soft delete via API works correctly
  - Related records remain intact
  - Database integrity is maintained
  - Only soft delete is allowed for records with relationships

## 7. Edge Case and Error Scenario Test Cases

### 7.1 Test Case: ERR-001 - Access VehicleModel with Invalid ID
- **Test Module**: Edge Cases
- **Test Description**: Verify error handling for invalid vehicle model ID
- **Prerequisites**:
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models/999999` (non-existent ID)
  2. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 404 Not Found
  - Response Body: Error message about vehicle model not found
  - Database: Query executes but returns no results
  - Audit Log: Read action logged (attempt to read non-existent record)
- **Verification Points**:
  - Response contains clear error message
  - HTTP status code is 404
  - Database query returns empty result
  - Audit log records the read attempt

### 7.2 Test Case: ERR-002 - Access VehicleModel with Invalid Authentication
- **Test Module**: Edge Cases
- **Test Description**: Verify error handling for invalid authentication
- **Prerequisites**:
  - VehicleModel records exist in database
  - Invalid authentication token
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models` with invalid token
  2. Include invalid/expired authentication token
- **Expected Results**:
  - HTTP Status: 401 Unauthorized
  - Response Body: Authentication error message
  - Database: No query executed
  - Audit Log: No log entry (authentication blocks operation)
- **Verification Points**:
  - Response contains authentication error
  - HTTP status code is 401
  - Database operation is not attempted
  - No audit log entry is created

### 7.3 Test Case: ERR-003 - Access VehicleModel without Authentication
- **Test Module**: Edge Cases
- **Test Description**: Verify error handling for missing authentication
- **Prerequisites**:
  - VehicleModel records exist in database
  - No authentication token provided
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models` without authentication
  2. Omit authentication token
- **Expected Results**:
  - HTTP Status: 401 Unauthorized
  - Response Body: Authentication required error message
  - Database: No query executed
  - Audit Log: No log entry (authentication blocks operation)
- **Verification Points**:
  - Response contains authentication required error
  - HTTP status code is 401
  - Database operation is not attempted
  - No audit log entry is created

### 7.4 Test Case: ERR-004 - Invalid Query Parameters
- **Test Module**: Edge Cases
- **Test Description**: Verify error handling for invalid query parameters
- **Prerequisites**:
  - VehicleModel records exist in database
  - Test user has read privileges
  - Authentication token is valid
- **Test Steps**:
  1. Send GET request to `/api/vehicle-models?page=abc&limit=xyz`
  2. Include valid authentication token
- **Expected Results**:
  - HTTP Status: 400 Bad Request
  - Response Body: Validation error for query parameters
  - Database: Query may not execute or may handle invalid params
  - Audit Log: Read action may be logged depending on when validation occurs
- **Verification Points**:
  - Response contains validation error details
  - HTTP status code is 400
  - Error message specifies invalid parameters
  - Database behavior is appropriate (no error or graceful handling)

### 7.5 Test Case: ERR-005 - Concurrent Access and Modification
- **Test Module**: Edge Cases
- **Test Description**: Verify concurrent access and modification handling
- **Prerequisites**:
  - VehicleModel record exists in database
  - Multiple test users with update privileges
  - Multiple valid authentication tokens
- **Test Steps**:
  1. User 1 sends PATCH request to update vehicle model
  2. Simultaneously, User 2 sends PATCH request to update same model
  3. Include valid authentication tokens for both users
- **Expected Results**:
  - HTTP Status: 200 OK for successful update
  - HTTP Status: 409 Conflict or 200 OK for concurrent update
  - Database: Last update wins or optimistic concurrency prevents conflict
  - Audit Log: Both update actions logged (if both succeed)
- **Verification Points**:
  - Concurrent updates are handled gracefully
  - No data corruption occurs
  - Final state is consistent
  - Audit trail shows all update attempts
  - Appropriate conflict resolution is applied

## 8. Test Case Summary

### 8.1 Test Case Count by Module
| Module | Test Cases | Description |
|--------|------------|-------------|
| Module 1: CRUD Operations | 5 | Basic create, read, update, delete operations |
| Module 2: Validation & Business Rules | 5 | Input validation and business rule enforcement |
| Module 3: Filtering & Search | 5 | Data retrieval with filtering and search |
| Module 4: Audit Logging | 5 | Audit trail verification and completeness |
| Module 5: Relationship Integrity | 5 | Foreign key constraints and referential integrity |
| Edge Cases & Error Scenarios | 5 | Error handling and edge case scenarios |
| **Total** | **30** | Comprehensive integration test coverage |

### 8.2 Test Case Priority
- **High Priority**: All CRUD operations, validation rules, and critical business logic
- **Medium Priority**: Filtering, search, audit logging, and relationship integrity
- **Low Priority**: Edge cases and non-critical error scenarios

### 8.3 Test Execution Order
1. **Phase 1**: Module 1 - Basic CRUD operations
2. **Phase 2**: Module 2 - Validation and business rules
3. **Phase 3**: Module 3 - Filtering and search
4. **Phase 4**: Module 4 - Audit logging
5. **Phase 5**: Module 5 - Relationship integrity
6. **Phase 6**: Edge cases and error scenarios

---
**Approvals**:

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | | | |
| Development Lead | | | |
| Product Owner | | | |