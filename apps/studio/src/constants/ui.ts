import { TopbarNavItem } from '../components/layout/topbar';
import { RoutePath } from '../utils/route_path';

export const ExperimentItemPageTabItemList = (
  experimentName: string
): TopbarNavItem[] => [
  {
    label: 'Tests',
    href: RoutePath.experimentEvalList({
      experimentName,
    }),
  },
  {
    label: 'Analysis',
    href: RoutePath.experimentReportItem({
      experimentName,
    }),
  },
];
