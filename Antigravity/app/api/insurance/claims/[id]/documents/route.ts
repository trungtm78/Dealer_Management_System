import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 10;

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "INS_NO_FILES",
                    message: "At least 1 supporting document is required"
                }
            }, { status: 400 });
        }

        // 1. Check file quantity
        if (files.length > MAX_FILES) {
            return NextResponse.json({
                success: false,
                error: {
                    code: "INS_TOO_MANY_FILES",
                    message: `Maximum ${MAX_FILES} files allowed`
                }
            }, { status: 400 });
        }

        for (const file of files) {
            // 2. Check MIME type
            if (!ALLOWED_TYPES.includes(file.type)) {
                return NextResponse.json({
                    success: false,
                    error: {
                        code: "INS_INVALID_FILE_TYPE",
                        message: "Invalid file type. Allowed: JPG, PNG, PDF"
                    }
                }, { status: 400 });
            }

            // 3. Check file size
            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json({
                    success: false,
                    error: {
                        code: "INS_FILE_TOO_LARGE",
                        message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024} MB limit`
                    }
                }, { status: 400 });
            }
        }

        // Mock saving logic - normally we would upload to S3/Local and update DB
        const claim = await prisma.insuranceClaim.findUnique({
            where: { id: params.id }
        });

        if (!claim) {
            return NextResponse.json({
                success: false,
                error: { code: "INS_404", message: "Claim not found" }
            }, { status: 404 });
        }

        // Update DB with document paths (simplified)
        const updatedDocuments = [
            ...(JSON.parse(claim.documents || "[]")),
            ...files.map(f => `/uploads/insurance/claims/${params.id}/${f.name}`)
        ];

        await prisma.insuranceClaim.update({
            where: { id: params.id },
            data: {
                documents: JSON.stringify(updatedDocuments)
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                count: files.length,
                filenames: files.map(f => f.name)
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Document Upload Error:", error);
        return NextResponse.json({
            success: false,
            error: {
                code: "INS_500",
                message: "Internal Server Error"
            }
        }, { status: 500 });
    }
}
