import os

def consolidate(doc_type, v1_2_path, update_path, v1_3_path, new_log_entry):
    print(f"Consolidating {doc_type}...")
    
    # Read v1.2
    if not os.path.exists(v1_2_path):
        print(f"Error: {v1_2_path} not found.")
        return

    try:
        with open(v1_2_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {v1_2_path}: {e}")
        return

    # Split at "## Change Log"
    split_marker = "## Change Log"
    if split_marker not in content:
        print(f"Warning: '{split_marker}' not found in {doc_type}. Appending to end.")
        body = content
        legacy_changelog = ""
    else:
        parts = content.split(split_marker)
        body = parts[0]
        legacy_changelog = split_marker + parts[1]

    # Change Version in Header (v1.2 -> v1.3)
    if "Version**: 1.2" in body:
        body = body.replace("Version**: 1.2", "Version**: 1.3")
    
    # Remove "**End of Document**" from legacy_changelog if present
    if legacy_changelog:
        legacy_changelog = legacy_changelog.replace("**End of Document**", "")
        legacy_changelog = legacy_changelog.strip()

    # Read Update
    if os.path.exists(update_path):
        try:
            with open(update_path, 'r', encoding='utf-8') as f:
                update_content = f.read()
            
            # Remove any header/title from draft if it duplicates
            # (Simple heuristic: just take the content as is for now, standard drafts usually append)
            update_content = "\n" + update_content.strip() + "\n"
        except Exception as e:
            print(f"Error reading {update_path}: {e}")
            update_content = ""
    else:
        print(f"Warning: {update_path} not found. Proceeding without update content.")
        update_content = ""

    # Construct v1.3
    # Body + Update + Legacy Logs + New Log + End
    if legacy_changelog:
        new_content = body + update_content + "\n\n" + legacy_changelog + "\n\n" + new_log_entry + "\n\n" + "**End of Document**"
    else:
        new_content = body + update_content + "\n\n" + "## Change Log" + "\n\n" + new_log_entry + "\n\n" + "**End of Document**"
    
    # Write v1.3
    try:
        with open(v1_3_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Created {v1_3_path}")
    except Exception as e:
        print(f"Error writing {v1_3_path}: {e}")

# Define Paths
base_dir = r"c:\Honda\Antigravity\docs"
cr_dir = os.path.join(base_dir, "requirements", "change_requests", "CR-20260202-002")
drafts_dir = os.path.join(cr_dir, "drafts")

# New Change Logs
log_brd = """### v1.3 (02/02/2026) - CR-20260202-002 (Master Data UI/UX)
- Updated Scope: Comprehensive Management of Secondary Masters
- Added User Stories for managing Colors, Versions, Departments, Contracts
- Ref: CR-20260202-002"""

log_frd = """### v1.3 (02/02/2026) - CR-20260202-002 (Master Data UI/UX)
- Added FR-MD-009 to FR-MD-025: Functional Requirements for Secondary Masters
- Defined Navigation Structure for Master Data module
- Ref: CR-20260202-002"""

log_erd = """### v1.3 (02/02/2026) - CR-20260202-002 (Master Data UI/UX)
- Added Entities: VehicleVersion, VehicleColor, VehicleSpec
- Added Entities: MasterDepartment, MasterPosition, MasterLevel
- Added Entities: SupplierContact, SupplierContract
- Added Entities: MasterProvince, MasterDistrict, MasterWard
- Added Entities: MasterBank, MasterPaymentMethod
- Ref: CR-20260202-002"""

log_api = """### v1.3 (02/02/2026) - CR-20260202-002 (Master Data UI/UX)
- Added CRUD Endpoints for all secondary masters (~25 new sets)
- Updated Employee Detail endpoint
- Ref: CR-20260202-002"""

log_ui = """### v1.3 (02/02/2026) - CR-20260202-002 (Master Data UI/UX)
- Defined Navigation Menu Structure (5 groups)
- Defined Standard Master Layout
- Specified UI for 25+ secondary master screens
- Ref: CR-20260202-002"""

# Execute
print("Starting Consolidation for CR-20260202-002...")

# BRD (Assume v1.2 exists or base on v1.1 - prompt said BRD v1.1, let's try v1.1 if v1.2 not found, but output to v1.3)
# Actually, let's assume standard flow v1.2 -> v1.3. If v1.2 doesn't exist, we might fail.
# Let's check for BRD v1.2. If not, use v1.1.
brd_src = os.path.join(base_dir, "requirements", "BRD", "BRD_master_data_v1.2.md")
if not os.path.exists(brd_src):
    brd_src = os.path.join(base_dir, "requirements", "BRD", "BRD_master_data_v1.1.md")
# If still not, map to main BRD? Usually master data has its own.
# For now, let's try consolidating BRD if source exists.

if os.path.exists(brd_src):
    consolidate("BRD", 
                brd_src,
                os.path.join(drafts_dir, "brd_update.md"),
                os.path.join(base_dir, "requirements", "BRD", "BRD_master_data_v1.3.md"),
                log_brd)

# FRD
consolidate("FRD", 
            os.path.join(base_dir, "requirements", "FRD", "frd_master_data_v1.2.md"),
            os.path.join(drafts_dir, "frd_update.md"),
            os.path.join(base_dir, "requirements", "FRD", "frd_master_data_v1.3.md"),
            log_frd)

# ERD
consolidate("ERD", 
            os.path.join(base_dir, "design", "database", "erd", "erd_master_data_v1.2.md"),
            os.path.join(drafts_dir, "erd_update.md"),
            os.path.join(base_dir, "design", "database", "erd", "erd_master_data_v1.3.md"),
            log_erd)

# API
consolidate("API", 
            os.path.join(base_dir, "design", "api", "api_spec_master_data_v1.2.md"),
            os.path.join(drafts_dir, "api_update.md"),
            os.path.join(base_dir, "design", "api", "api_spec_master_data_v1.3.md"),
            log_api)

# UI
consolidate("UI", 
            os.path.join(base_dir, "design", "ui", "ui_spec_master_data_v1.2.md"),
            os.path.join(drafts_dir, "ui_update.md"),
            os.path.join(base_dir, "design", "ui", "ui_spec_master_data_v1.3.md"),
            log_ui)

print("Consolidation Complete.")
