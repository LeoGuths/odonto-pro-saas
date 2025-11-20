import { getPermissionReports } from '@/app/(panel)/dashboard/reports/_data-access/get-permission-reports';
import getSession from '@/lib/getSession';
import { redirect } from 'next/navigation';

export default async function Reports() {
  const session = await getSession();

  if (!session || !session.user) {
    redirect('/');
  }
  const user = await getPermissionReports(session.user.id);

  if (!user) {
    return (
      <main>
        <h1>Você não possui permissão para acessar essa página</h1>
        <p>Assine o plano PROFESSIONAL para ter acesso completo!</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Página de Relatórios</h1>
    </main>
  );
}
