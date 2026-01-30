"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScoringRuleDTO } from "@/lib/types/crm";

interface ScoringSimulatorProps {
    rules: ScoringRuleDTO[];
    config: {
        hot: { min: number; label: string; color: string };
        warm: { min: number; label: string; color: string };
        cold: { min: number; label: string; color: string };
    };
}

export default function ScoringSimulator({ rules, config }: ScoringSimulatorProps) {
    // 1. Group Rules
    const groups = useMemo(() => {
        const g: Record<string, ScoringRuleDTO[]> = {};
        rules.filter(r => r.enabled).forEach(r => {
            if (!g[r.category]) g[r.category] = [];
            g[r.category].push(r);
        });
        return g;
    }, [rules]);

    // 2. State for Selections (Store as array of strings for all categories)
    // Map<Category, Set<Criteria>>
    const [selections, setSelections] = useState<Record<string, string[]>>({});

    // Initialize Default State
    useEffect(() => {
        const initial: Record<string, string[]> = {};
        Object.keys(groups).forEach(cat => {
            initial[cat] = [];
        });
        setSelections(initial);
    }, [groups]);

    const handleCheckboxChange = (category: string, criteria: string, checked: boolean) => {
        setSelections(prev => {
            const current = prev[category] || [];
            if (checked) return { ...prev, [category]: [...current, criteria] };
            return { ...prev, [category]: current.filter(c => c !== criteria) };
        });
    };

    // 3. Calculate Score
    const currentScore = useMemo(() => {
        let total = 0;
        Object.entries(selections).forEach(([cat, selectedItems]) => {
            if (Array.isArray(selectedItems)) {
                selectedItems.forEach(item => {
                    const rule = groups[cat]?.find(r => r.criteria === item);
                    if (rule) total += rule.weight;
                });
            }
        });
        return total;
    }, [selections, groups]);

    // 4. Calculate Max Score (Dynamic - Sum of all positive weights)
    const maxScore = useMemo(() => {
        let max = 0;
        Object.values(groups).forEach(rules => {
            // For a Simulator using checkboxes, the theoretic max is if you checked everything with positive weight.
            const sumPositive = rules.reduce((s, r) => s + (r.weight > 0 ? r.weight : 0), 0);
            max += sumPositive;
        });
        return max || 100;
    }, [groups]);

    const percentage = Math.min(Math.round((currentScore / maxScore) * 100), 100) || 0;

    // 5. Determine Tier
    const currentTier = useMemo(() => {
        if (currentScore >= config.hot.min) return { ...config.hot, bg: 'bg-green-100', text: 'text-green-700' };
        if (currentScore >= config.warm.min) return { ...config.warm, bg: 'bg-yellow-100', text: 'text-yellow-700' };
        return { ...config.cold, bg: 'bg-gray-100', text: 'text-gray-700' };
    }, [currentScore, config]);

    // SVG Circle Props
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <Card className="shadow-xl overflow-hidden border-0 ring-1 ring-gray-200">
            {/* Red Header */}
            <div className="bg-[#D50032] p-6 text-white">
                <h3 className="text-xl font-bold">Preview Tính Điểm</h3>
                <p className="text-white/80 text-sm mt-1">Mô phỏng chấm điểm lead</p>
            </div>

            <CardContent className="p-6">
                {/* Score Visual Gauge */}
                <div className="flex flex-col items-center mb-8 relative">
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* Gauge SVG */}
                        <svg className="transform -rotate-90 w-40 h-40">
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            <circle
                                cx="80"
                                cy="80"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="12"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className={`transition-all duration-1000 ease-out ${percentage >= 80 ? 'text-green-500' :
                                        percentage >= 50 ? 'text-yellow-500' : 'text-red-500'
                                    }`}
                            />
                        </svg>

                        {/* Score Text Center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-4xl font-extrabold ${percentage >= 80 ? 'text-green-600' :
                                    percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                {currentScore}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">/ {maxScore}</span>
                        </div>
                    </div>

                    {/* Tier Badge */}
                    <div className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${currentTier.bg} ${currentTier.text}`}>
                        {currentTier.label}
                    </div>
                </div>

                {/* Progress Bar Linear */}
                <div className="space-y-1 mb-6">
                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>Điểm đạt</span>
                        <span>{percentage}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#D50032] transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>

                <Separator className="my-6" />

                {/* Dynamic Form - All Checkboxes */}
                <div className="space-y-6">
                    {Object.entries(groups).map(([cat, rules]) => (
                        <div key={cat} className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide border-l-4 border-[#D50032] pl-2">
                                {cat}
                            </h4>
                            <div className="grid grid-cols-1 gap-2 pl-2">
                                {rules.map(rule => {
                                    const isChecked = (selections[cat] || []).includes(rule.criteria);
                                    return (
                                        <div key={rule.id} className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleCheckboxChange(cat, rule.criteria, !isChecked)}>
                                            <Checkbox
                                                id={`sim-rule-${rule.id}`}
                                                checked={isChecked}
                                                onCheckedChange={(c) => handleCheckboxChange(cat, rule.criteria, c as boolean)}
                                                className="data-[state=checked]:bg-[#D50032] border-gray-300"
                                            />
                                            <label
                                                htmlFor={`sim-rule-${rule.id}`}
                                                className="text-sm cursor-pointer flex-1 flex justify-between"
                                            >
                                                <span className="text-gray-700">{rule.criteria}</span>
                                                <span className={`text-xs ml-2 font-medium ${rule.weight >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                    {rule.weight > 0 ? '+' : ''}{rule.weight}
                                                </span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

            </CardContent>
        </Card>
    );
}
