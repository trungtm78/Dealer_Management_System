import os

def consolidate(doc_type, v1_1_path, update_path, v1_2_path, new_log_entry):
    print(f"Consolidating {doc_type}...")
    
    # Read v1.1
    if not os.path.exists(v1_1_path):
        print(f"Error: {v1_1_path} not found.")
        return

    try:
        with open(v1_1_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {v1_1_path}: {e}")
        return

    # Split at "## Change Log"
    split_marker = "## Change Log"
    if split_marker not in content:
        print(f"Warning: '{split_marker}' not found in {doc_type}. Appending to end.")
        body = content
        legacy_changelog = ""
    else:
        parts = content.split(split_marker)
        # parts[0] is body, parts[1] is legacy change log + end
        # We need to be careful if there are multiple "## Change Log" (unlikely)
        body = parts[0]
        legacy_changelog = split_marker + parts[1]

    # Remove "**End of Document**" from legacy_changelog if present
    if legacy_changelog:
        legacy_changelog = legacy_changelog.replace("**End of Document**", "")
        legacy_changelog = legacy_changelog.strip()

    # Read Update
    if os.path.exists(update_path):
        try:
            with open(update_path, 'r', encoding='utf-8') as f:
                update_content = f.read()
            
            # Remove comment markers if any
            update_content = update_content.replace("<!-- CR-20260202-001: ADDED -->", "")
            update_content = update_content.replace("<!-- END CR-20260202-001 -->", "")
            update_content = "\n" + update_content.strip() + "\n"
        except Exception as e:
            print(f"Error reading {update_path}: {e}")
            update_content = ""
    else:
        print(f"Warning: {update_path} not found. Proceeding without update content.")
        update_content = ""

    # Construct v1.2
    # Body + Update + Legacy Logs + New Log + End
    if legacy_changelog:
        new_content = body + update_content + "\n\n" + legacy_changelog + "\n\n" + new_log_entry + "\n\n" + "**End of Document**"
    else:
        new_content = body + update_content + "\n\n" + "## Change Log" + "\n\n" + new_log_entry + "\n\n" + "**End of Document**"
    
    # Write v1.2
    try:
        with open(v1_2_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Created {v1_2_path}")
    except Exception as e:
        print(f"Error writing {v1_2_path}: {e}")

# Define Paths
base_dir = r"c:\Honda\Antigravity\docs"
cr_dir = os.path.join(base_dir, "requirements", "change_requests", "CR-20260202-001")
drafts_dir = os.path.join(cr_dir, "drafts")

# New Change Logs
log_frd = """### v1.2 (02/02/2026) - CR-MD-005 to 008 (Emergency CR)
- **Added FR-MD-005: Employee Management**
- **Added FR-MD-006: Supplier Management**
- **Added FR-MD-007: Warehouse Management**
- **Added FR-MD-008: UOM Management**
- Consolidated from CR-20260202-001."""

log_erd = """### v1.2 (02/02/2026) - CR-MD-005 to 008 (Emergency CR)
- Added Entity: Employee (and supporting tables)
- Added Entity: Supplier
- Added Entity: Warehouse
- Added Entity: UOM
- Updated Relationships
- Consolidated from CR-20260202-001."""

log_api = """### v1.2 (02/02/2026) - CR-MD-005 to 008 (Emergency CR)
- Added Employee Endpoints
- Added Supplier Endpoints
- Added Warehouse/UOM Endpoints
- Consolidated from CR-20260202-001."""

log_ui = """### v1.2 (02/02/2026) - CR-MD-005 to 008 (Emergency CR)
- Added Screen: Employee Management
- Added Screen: Supplier Management
- Added Screen: Inventory Masters (Warehouses, UOMs)
- Consolidated from CR-20260202-001."""

# Execute
print("Starting Consolidation...")

# FRD
consolidate("FRD", 
            os.path.join(base_dir, "requirements", "FRD", "frd_master_data_v1.1.md"),
            os.path.join(drafts_dir, "frd_update.md"),
            os.path.join(base_dir, "requirements", "FRD", "frd_master_data_v1.2.md"),
            log_frd)

# ERD
consolidate("ERD", 
            os.path.join(base_dir, "design", "database", "erd", "erd_master_data_v1.1.md"),
            os.path.join(drafts_dir, "erd_update.md"),
            os.path.join(base_dir, "design", "database", "erd", "erd_master_data_v1.2.md"),
            log_erd)

# API
consolidate("API", 
            os.path.join(base_dir, "design", "api", "api_spec_master_data_v1.1.md"),
            os.path.join(drafts_dir, "api_update.md"),
            os.path.join(base_dir, "design", "api", "api_spec_master_data_v1.2.md"),
            log_api)

# UI
consolidate("UI", 
            os.path.join(base_dir, "design", "ui", "ui_spec_master_data_v1.1.md"),
            os.path.join(drafts_dir, "ui_update.md"),
            os.path.join(base_dir, "design", "ui", "ui_spec_master_data_v1.2.md"),
            log_ui)

print("Consolidation Complete.")
