import { getAllServices } from '@/app/(panel)/dashboard/services/_data-access/get-all-services';
import { ServicesList } from '@/app/(panel)/dashboard/services/_components/services-list';
import { canPermission } from '@/lib/permissions/canPermission';
import LabelSubscription from '@/components/label-subscription';

interface ServicesContentProps {
  userId: string;
}

export default async function ServicesContent({
  userId,
}: ServicesContentProps) {
  const services = await getAllServices({ userId: userId });
  const permissions = await canPermission({
    type: 'service',
  });

  return (
    <>
      {!permissions.hasPermission && (
        <LabelSubscription expired={!permissions.expired} />
      )}

      <ServicesList
        services={
          services.data?.slice(0, permissions.plan?.maxServices || Infinity) ||
          []
        }
        permission={permissions}
      />
    </>
  );
}
