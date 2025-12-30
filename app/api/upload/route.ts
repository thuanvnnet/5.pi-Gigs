import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'No file provided' }, { status: 400 });
  }

  // Làm sạch tên file để ngăn chặn các cuộc tấn công path traversal.
  // Thao tác này sẽ loại bỏ các ký tự đường dẫn như `../` và chỉ giữ lại tên file.
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
  const uniqueFilename = `${Date.now()}-${sanitizedFilename}`;

  // ⚠️ The `request.body` can only be consumed once.
  const blob = await put(uniqueFilename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}
