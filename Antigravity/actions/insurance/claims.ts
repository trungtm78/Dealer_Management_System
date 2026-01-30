"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { InsuranceClaimDTO, CreateClaimInput } from "@/lib/types/insurance";

export async function getClaims(): Promise<InsuranceClaimDTO[]> {
  try {
    const claims = await prisma.insuranceClaim.findMany({
      include: {
        contract: {
          include: { customer: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    
    return claims.map((c: any) => ({
      ...c,
      contract_number: c.contract.contract_number,
      incident_date: c.incident_date.toISOString(),
      created_at: c.created_at.toISOString(),
      claim_amount: Number(c.claim_amount),
      approved_amount: c.approved_amount ? Number(c.approved_amount) : null,
    }));
  } catch (error) {
    console.error("Failed to get claims:", error);
    return [];
  }
}

export async function createClaim(data: CreateClaimInput) {
  try {
    const claimCount = await prisma.insuranceClaim.count();
    const claimNumber = `CLM-${new Date().getFullYear()}-${(claimCount + 1).toString().padStart(4, '0')}`;

    const claim = await prisma.insuranceClaim.create({
      data: {
        contract_id: data.contract_id,
        claim_number: claimNumber,
        incident_date: new Date(data.incident_date),
        incident_type: 'ACCIDENT', // Default
        incident_description: data.incident_description,
        claim_amount: data.claim_amount,
        status: 'SUBMITTED',
      }
    });
    revalidatePath("/insurance/claims");
    return { success: true, data: claim };
  } catch (error: any) {
    console.error("Failed to create claim:", error);
    return { success: false, error: error.message };
  }
}

export async function updateClaimStatus(id: string, status: string, notes?: string) {
  try {
    await prisma.insuranceClaim.update({
      where: { id },
      data: { status, notes } as any
    });
    revalidatePath("/insurance/claims");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update claim status:", error);
    return { success: false, error: error.message };
  }
}
