import { OrderDetailPage } from '@/presentation/pages/mechanic/OrderDetailPage';

export default async function MechanicOrderDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <OrderDetailPage orderId={resolvedParams.id} />;
}
