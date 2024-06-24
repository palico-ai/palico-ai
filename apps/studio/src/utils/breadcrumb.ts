import { BreadcrumbItem } from '../components/layout/topbar';
import {
  RequireExperimentName,
  RequireLabName,
  RequireEvalName,
} from '../types/common';
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

  static experimentEvalList(
    params?: IncludeHrefWithOptions<RequireExperimentName>
  ): BreadcrumbItem {
    return {
      label: 'Evals',
      href: params?.includeHref
        ? RoutePath.experimentEvalList({
            experimentName: params.options.experimentName,
          })
        : undefined,
    };
  }

  static experimentEvalItem(
    params: RequireEvalName &
      Partial<IncludeHrefWithOptions<RequireExperimentName>>
  ): BreadcrumbItem {
    return {
      label: params.evalName,
      href: params.includeHref
        ? RoutePath.experimentEvalItem({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            experimentName: params.options!.experimentName,
            evalName: params.evalName,
          })
        : undefined,
    };
  }

  static newReport(): BreadcrumbItem {
    return { label: 'New Report' };
  }
}
