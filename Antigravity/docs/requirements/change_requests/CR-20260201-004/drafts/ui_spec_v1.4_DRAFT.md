# UI Spec v1.4 (DRAFT)
**Target**: `docs/design/ui/ui_spec_v1.4.md`
**Changes**: Added Master Data Navigation.

---

## Navigation Structure Updates (App.tsx)

### New Menu Group: Master Data
*Position: Between Service and Accounting*
*Icon: Database (Lucide)*

| ID | Label | Icon | Route |
|----|-------|------|-------|
| `master-vehicles` | Mẫu Xe | `Car` | `/master/vehicle-models` |
| `master-accessories` | Phụ Tùng | `Puzzle` | `/master/accessories` |
| `master-services` | Dịch Vụ | `Wrench` | `/master/services` |
| `master-bays` | Khoang Sửa | `Grid` | `/master/bays` |

*Note: Requires creating `MasterDataLayout` or reusing MainLayout.*
