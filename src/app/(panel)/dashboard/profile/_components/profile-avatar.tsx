'use client';

import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import defaultClinicImg from '@/../public/default-clinic.svg';
import { Loader, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfileAvatar } from '@/app/(panel)/dashboard/profile/_actions/update-profile-avatar';
import { useSession } from 'next-auth/react';

interface ProfileAvatarProps {
  avatarUrl: string | null;
  userId: string;
}

export function ProfileAvatar({ avatarUrl, userId }: ProfileAvatarProps) {
  const [previewImage, setPreviewImage] = useState(avatarUrl);
  const [loading, setLoading] = useState(false);

  const { update } = useSession();

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const image = e.target.files[0];

      if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
        toast.error('Formato de arquivo inválido. Apenas .jpg e .png.');
        setLoading(false);
        return;
      }

      const newFileName = `${userId}`;
      const newFile = new File([image], newFileName, {
        type: image.type,
      });

      const urlImage = await uploadImage(newFile);
      if (!urlImage || urlImage === '') {
        toast.error('Erro ao carregar a imagem.');
        setLoading(false);
        return;
      }

      const response = await updateProfileAvatar(urlImage);

      if (response.error) {
        toast.error(response.error);
        setLoading(false);
        return;
      }

      await update({
        image: urlImage,
      });

      setPreviewImage(urlImage);
      toast.success('Imagem atualizada com sucesso.');
      setLoading(false);
    }
  }

  async function uploadImage(image: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('userId', userId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST_URL}/api/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        toast.error('Erro ao carregar a imagem.');
        return null;
      }

      return (await response.json()).secure_url as string;
    } catch (error) {
      toast.error('Erro ao carregar a imagem.');
      return null;
    }
  }

  return (
    <div className="relative w-40 h-40 md:w-48 md:h-48">
      <div className="relative w-full h-full overflow-hidden rounded-full">
        <Image
          src={previewImage || defaultClinicImg}
          alt="Foto de perfil da clínica"
          className="object-cover w-full h-full bg-slate-200 transition-transform duration-300 hover:scale-110"
          fill
          quality={100}
          priority
          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw"
        />
      </div>

      <div className="absolute bottom-2 right-2 z-10">
        <label
          className={`flex items-center justify-center bg-white hover:bg-slate-50 p-3 rounded-full shadow-lg border-2 border-slate-200 transition-colors ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
        >
          {loading ? (
            <Loader size={18} className="text-slate-700 animate-spin" />
          ) : (
            <Upload size={18} className="text-slate-700" />
          )}
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
            disabled={loading}
          />
        </label>
      </div>
    </div>
  );
}
