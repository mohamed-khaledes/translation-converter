import { NextRequest, NextResponse } from 'next/server';
import { tsToExcel, excelToTs } from '@/lib/converter';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const direction = formData.get('direction') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    
    if (direction === 'ts-to-excel') {
      // Convert TypeScript to Excel
      const content = buffer.toString('utf-8');
      const excelBuffer = tsToExcel(content);
      
      return new NextResponse(excelBuffer as any, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="translations.xlsx"`
        }
      });
    } else if (direction === 'excel-to-ts') {
      // Convert Excel to TypeScript
      const tsContent = excelToTs(buffer);
      
      return new NextResponse(tsContent as any, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': `attachment; filename="translations.ts"`
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid conversion direction' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: error.message || 'Conversion failed' },
      { status: 500 }
    );
  }
}
