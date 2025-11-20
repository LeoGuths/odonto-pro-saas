import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string,
  api_key: process.env.CLOUDINARY_KEY as string,
  api_secret: process.env.CLOUDINARY_SECRET as string,
});

export async function POST(request: Request) {
  const formData = await request.formData();

  const file = formData.get('file') as File;
  const userId = formData.get('userId') as string;

  if (!userId) {
    return NextResponse.json(
      { error: 'Falha ao alterar a imagem' },
      { status: 401 }
    );
  }

  if (!file) {
    return NextResponse.json(
      { error: 'Falha ao alterar a imagem' },
      { status: 400 }
    );
  }

  if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    return NextResponse.json(
      { error: 'Formato de imagem inválido. Apenas .jpg e .png.' },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const results = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          tags: [`${userId}`],
          public_id: file.name,
        },
        function (error, result) {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      )
      .end(buffer);
  });

  return NextResponse.json(results);
}
