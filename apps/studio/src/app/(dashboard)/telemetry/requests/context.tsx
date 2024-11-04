import { QueryParam } from '../../../../utils/route_path';
import { useSearchParams } from 'next/navigation';

export const useSelectedRequestId = () => {
  const searchParams = useSearchParams();
  return searchParams.get(QueryParam.RequestId);
};
