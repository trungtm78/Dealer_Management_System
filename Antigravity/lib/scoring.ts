
import { ScoringRuleDTO, LeadDTO } from "./types/crm";

// We need a subset of Lead for calculation to avoid circular deps or full type requirements
// Using 'any' for lead to be flexible or define a simplified interface
export function calculateLeadScore(lead: any, rules: ScoringRuleDTO[]): number {
    let score = 0;

    // Filter active rules only
    const activeRules = rules.filter(r => r.enabled);

    // 1. Check Source
    const sourceRule = activeRules.find(r => r.category === 'Nguồn Lead' && r.criteria === lead.source);
    if (sourceRule) score += sourceRule.weight;

    // 2. Check Model Interest
    if (lead.modelInterest) {
        const modelRule = activeRules.find(r => r.category === 'Sản Phẩm Quan Tâm' && lead.modelInterest?.includes(r.criteria));
        if (modelRule) score += modelRule.weight;
    }

    // 3. Check Model Version
    if (lead.modelVersion) {
        const versionRule = activeRules.find(r => r.category === 'Phiên Bản' && lead.modelVersion?.includes(r.criteria));
        if (versionRule) score += versionRule.weight;
    }

    // 4. Behavioral Checks
    if (lead.isTestDrive) {
        const rule = activeRules.find(r => r.criteria === 'Lái thử');
        if (rule) score += rule.weight;
    }
    if (lead.isEmailOpened) {
        const rule = activeRules.find(r => r.criteria === 'Mở Email');
        if (rule) score += rule.weight;
    }
    if (lead.isLinkClicked) {
        const rule = activeRules.find(r => r.criteria === 'Click Link');
        if (rule) score += rule.weight;
    }

    return score;
}
