import { BreadcrumbItem } from '../components/layout/topbar';
import { RequireExperimentName, RequireLabName, RequireTestName } from '../types/common';
import { RoutePath } from './route_path';

export interface IncludeHref {
  includeHref: boolean;
}

export interface IncludeHrefWithOptions<T> {
  includeHref: boolean;
  options: T;
}

export default class Breadcrumb {
  static chat(): BreadcrumbItem {
    return { label: 'Chat' };
  }

  static quickLab(params?: IncludeHref): BreadcrumbItem {
    return {
      label: 'Quick Lab',
      href: params?.includeHref ? RoutePath.labList() : undefined,
    };
  }

  static quickLabItem(params: RequireLabName): BreadcrumbItem {
    return { label: params.labName };
  }

  static experimentList(params?: IncludeHref): BreadcrumbItem {
    return {
      label: 'Experiments',
      href: params?.includeHref ? RoutePath.experimentList() : undefined,
    };
  }

  static experimentItem(
    params: RequireExperimentName & Partial<IncludeHref>
  ): BreadcrumbItem {
    return {
      label: params.experimentName,
      href: params.includeHref
        ? RoutePath.experimentItem({ experimentName: params.experimentName })
        : undefined,
    };
  }

  static experimentTestList(
    params?: IncludeHrefWithOptions<RequireExperimentName>
  ): BreadcrumbItem {
    return {
      label: 'Tests',
      href: params?.includeHref
        ? RoutePath.experimentTestList({
            experimentName: params.options.experimentName,
          })
        : undefined,
    };
  }

  static experimentTestItem(
    params: RequireTestName &
      Partial<IncludeHrefWithOptions<RequireExperimentName>>
  ): BreadcrumbItem {
    return {
      label: params.testName,
      href: params.includeHref
        ? RoutePath.experimentTestItem({
            experimentName: params.options!.experimentName,
            testName: params.testName,
          })
        : undefined,
    };
  }

  static newReport(): BreadcrumbItem {
    return { label: 'New Report' };
  }
}
