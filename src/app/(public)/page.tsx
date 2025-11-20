import { Header } from './_components/header';
import { Hero } from '@/app/(public)/_components/hero';
import { Professionals } from '@/app/(public)/_components/professionals';
import Footer from '@/app/(public)/_components/footer';
import { getProfessionals } from '@/app/(public)/_data-access/get-professionals';

export const revalidate = 120;

export default async function Home() {
  const professionals = await getProfessionals();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div>
        <Hero />
        <Professionals professionals={professionals} />
        <Footer />
      </div>
    </div>
  );
}
