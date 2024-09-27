import { redirect } from 'next/navigation';
import { RoutePath } from '../../utils/route_path';

export default function Index() {
  redirect(RoutePath.chat());
}
