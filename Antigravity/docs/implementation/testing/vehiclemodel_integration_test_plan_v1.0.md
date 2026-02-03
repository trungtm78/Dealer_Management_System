# Integration Test Plan - CR-MD-001 VehicleModel Master Data

## Document Information
- **Document ID**: INTEG-TEST-PLAN-001
- **Version**: 1.0
- **Date**: 2025-06-18
- **Project**: CRM VehicleModel Master Data Integration
- **Change Request**: CR-MD-001

## 1. Introduction

### 1.1 Purpose
This document outlines the integration test plan for the VehicleModel Master Data API endpoints. The plan ensures proper functionality, data integrity, and integration between the API layer, business logic, and database layer.

### 1.2 Scope
- All VehicleModel Master Data API endpoints
- Integration with database tables and relationships
- Audit logging functionality
- Business rule validation
- Error handling and edge cases

### 1.3 Out of Scope
- UI testing
- Performance testing
- Load testing
- Security penetration testing

## 2. Endpoint Analysis with FRD Mapping

### 2.1 GET /api/vehicle-models
- **FRD Mapping**: FR-MD-001-02 (Read VehicleModel List)
- **Method**: GET
- **Description**: Retrieve paginated list of vehicle models with filtering capabilities
- **Query Parameters**:
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of items per page
  - `sort_by` (optional): Field to sort by (name, code, created_at, updated_at)
  - `sort_order` (optional): Sort direction (asc, desc)
  - `search` (optional): Search term for name or code
  - `status` (optional): Filter by status (active, inactive)
- **Expected Response**: JSON array of vehicle model objects with pagination metadata

### 2.2 POST /api/vehicle-models
- **FRD Mapping**: FR-MD-001-01 (Create VehicleModel)
- **Method**: POST
- **Description**: Create a new vehicle model with validation
- **Request Body**: Vehicle model object with required fields
  - `name` (required, string, max 100 chars)
  - `code` (required, string, max 20 chars, unique)
  - `description` (optional, string, max 500 chars)
  - `category` (required, string)
  - `base_price` (required, decimal)
  - `status` (optional, enum: active/inactive, default: active)
- **Expected Response**: Created vehicle model object with ID and timestamps

### 2.3 PATCH /api/vehicle-models/[id]
- **FRD Mapping**: FR-MD-001-03 (Update VehicleModel)
- **Method**: PATCH
- **Description**: Update an existing vehicle model with partial data
- **Path Parameters**: `id` (vehicle model ID)
- **Request Body**: Partial vehicle model object with fields to update
- **Expected Response**: Updated vehicle model object with new timestamps

### 2.4 DELETE /api/vehicle-models/[id]
- **FRD Mapping**: FR-MD-001-04 (Delete VehicleModel - Soft Delete)
- **Method**: DELETE
- **Description**: Soft delete a vehicle model (set status to inactive)
- **Path Parameters**: `id` (vehicle model ID)
- **Expected Response**: Success confirmation message

## 3. ERD Entity Mapping and Relationships

### 3.1 Primary Entity: VehicleModel
- **Table**: `VehicleModel`
- **Key Fields**:
  - `id` (Primary Key, BIGINT, Auto-increment)
  - `name` (VARCHAR(100), Not Null)
  - `code` (VARCHAR(20), Not Null, Unique)
  - `description` (VARCHAR(500), Nullable)
  - `category` (VARCHAR(50), Not Null)
  - `base_price` (DECIMAL(10,2), Not Null)
  - `status` (ENUM('active','inactive'), Not Null, Default 'active')
  - `created_at` (TIMESTAMP, Not Null)
  - `updated_at` (TIMESTAMP, Not Null)

### 3.2 Audit Entity: Activity Logs
- **Table**: `activity_logs`
- **Relationship**: VehicleModel operations are logged here
- **Key Fields**:
  - `id` (Primary Key)
  - `entity_type` (ENUM, includes 'VehicleModel')
  - `entity_id` (BIGINT, references VehicleModel.id)
  - `action` (ENUM: create, update, delete, read)
  - `old_values` (JSON, Nullable)
  - `new_values` (JSON, Nullable)
  - `user_id` (BIGINT, Nullable)
  - `timestamp` (TIMESTAMP, Not Null)

### 3.3 Related Entities with Foreign Key Constraints
- **Quotation Table**: References VehicleModel via `vehicle_model_id`
- **Vehicle Table**: References VehicleModel via `model_id`
- **Lead Table**: References VehicleModel via `preferred_model_id`

### 3.4 Business Rules
- **BR-MD-001**: VehicleModel name must be unique (enforced at application level)
- **BR-MD-002**: VehicleModel code must be unique (enforced at database level)
- **BR-MD-003**: Soft delete prevents hard deletion of records with existing references
- **BR-MD-004**: Base price must be a positive number
- **BR-MD-005**: Status transitions follow business logic (active ↔ inactive)

## 4. Module Grouping for Test Organization

### 4.1 Module 1: VehicleModel CRUD Operations
- **Test Group**: Basic CRUD functionality
- **Endpoints**: All 4 endpoints
- **Focus**: Create, Read, Update, Delete basic operations
- **Dependencies**: Database connectivity, basic validation

### 4.2 Module 2: VehicleModel Validation and Business Rules
- **Test Group**: Input validation and business rule enforcement
- **Endpoints**: POST, PATCH
- **Focus**: Field validation, uniqueness constraints, business rule validation
- **Dependencies**: Validation middleware, database constraints

### 4.3 Module 3: VehicleModel Filtering and Search
- **Test Group**: Data retrieval with filtering
- **Endpoints**: GET
- **Focus**: Pagination, sorting, search functionality, status filtering
- **Dependencies**: Query builders, search algorithms

### 4.4 Module 4: VehicleModel Audit Logging
- **Test Group**: Audit trail verification
- **Endpoints**: All (monitoring)
- **Focus**: Activity log creation, data accuracy, completeness
- **Dependencies**: Audit middleware, logging system

### 4.5 Module 5: VehicleModel Relationship Integrity
- **Test Group**: Foreign key constraint validation
- **Endpoints**: DELETE
- **Focus**: Referential integrity, soft delete with existing references
- **Dependencies**: Foreign key constraints, soft delete logic

## 5. Integration Points to Verify

### 5.1 API to Database Integration
- **Verification Points**:
  - API requests properly persist to database
  - Database constraints are enforced through API validation
  - Data types and formats match between API and database
  - Timestamps are correctly generated and updated
  - Soft delete logic properly updates database records

### 5.2 Business Logic Integration
- **Verification Points**:
  - Validation rules are consistently applied
  - Business rule violations are properly handled
  - Status transitions follow defined rules
  - Unique constraints are enforced before database operations

### 5.3 Audit System Integration
- **Verification Points**:
  - All operations create appropriate audit entries
  - Audit data contains complete and accurate information
  - Old/new values are properly captured for updates
  - User context is properly logged when available

### 5.4 Error Handling Integration
- **Verification Points**:
  - Database errors are properly caught and translated to API responses
  - Validation errors provide clear, actionable error messages
  - Constraint violations return appropriate HTTP status codes
  - Error responses follow consistent format

### 5.5 Relationship Integration
- **Verification Points**:
  - Foreign key constraints prevent invalid operations
  - Soft delete handles existing references appropriately
  - Related entity operations cascade correctly
  - Referential integrity is maintained across operations

## 6. Test Environment Requirements

### 6.1 Software Requirements
- **Application Server**: Running VehicleModel API endpoints
- **Database Server**: MySQL/MariaDB with test database
- **Test Data**: Clean, isolated test database with known data
- **Test Runner**: API testing framework (e.g., Postman, Supertest, REST Assured)
- **Reporting**: Test result capture and reporting capability

### 6.2 Database Requirements
- **Test Database**: Separate from production, with full schema
- **Test Data**: Pre-populated with known test data sets
- **Clean State**: Ability to reset database to known state between tests
- **Data Isolation**: Test data should not affect other tests

### 6.3 Test Data Requirements
- **Base Vehicle Models**: Set of standard vehicle models for testing
- **Edge Case Data**: Models with various configurations for boundary testing
- **Related Data**: Sample records in related tables (Quotation, Vehicle, Lead)
- **User Context**: Test user accounts for audit logging verification

### 6.4 Configuration Requirements
- **API Configuration**: Test environment API configuration
- **Database Configuration**: Test database connection settings
- **Logging Configuration**: Enhanced logging for test verification
- **Environment Variables**: All required environment variables for testing

## 7. Test Execution Strategy

### 7.1 Test Phases
1. **Setup Phase**: Prepare test environment and data
2. **Execution Phase**: Run integration tests in logical order
3. **Verification Phase**: Validate results and capture evidence
4. **Cleanup Phase**: Reset environment for next test cycle

### 7.2 Test Dependencies
- Database must be available and accessible
- Application must be running and accessible
- Test data must be properly initialized
- Test dependencies must be executed in correct order

### 7.3 Test Data Management
- **Test Data Sets**: Multiple data sets for different test scenarios
- **Data Reset**: Clean state between test runs
- **Data Isolation**: Tests should not interfere with each other
- **Data Verification**: Verify data changes are as expected

## 8. Success Criteria

### 8.1 Functional Criteria
- All API endpoints function according to specification
- All business rules are properly enforced
- Database operations complete successfully
- Audit logging captures all required information
- Error handling meets requirements

### 8.2 Technical Criteria
- HTTP status codes are correct for all scenarios
- Response formats match API specification
- Database integrity is maintained
- Performance meets minimum requirements
- No security vulnerabilities exposed

### 8.3 Integration Criteria
- API-to-database integration works correctly
- Business logic integration is complete
- Audit system integration functions properly
- Error handling integration is robust
- Relationship constraints are enforced

## 9. Risks and Mitigations

### 9.1 Technical Risks
- **Risk**: Database connection issues
  - **Mitigation**: Verify database connectivity before test execution
- **Risk**: Test data contamination
  - **Mitigation**: Use database transactions and rollback mechanisms
- **Risk**: Environment configuration issues
  - **Mitigation**: Pre-test environment verification checklist

### 9.2 Integration Risks
- **Risk**: API changes during testing
  - **Mitigation**: Version locking and change control
- **Risk**: Schema changes affecting tests
  - **Mitigation**: Database schema versioning
- **Risk**: External dependencies unavailable
  - **Mitigation**: Mock external dependencies if needed

### 9.3 Execution Risks
- **Risk**: Incomplete test coverage
  - **Mitigation**: Test case review and traceability matrix
- **Risk**: Test automation failures
  - **Mitigation**: Manual verification of critical paths
- **Risk**: Time constraints
  - **Mitigation**: Prioritize critical integration points

## 10. Deliverables

1. **Test Data Setup Document** - Detailed test data preparation
2. **Test Cases Document** - Specific test cases with expected results
3. **Test Execution Document** - Execution results and evidence
4. **Test Summary Document** - Final results and gate decision

---
**Approvals**:

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Test Lead | | | |
| Development Lead | | | |
| Product Owner | | | |