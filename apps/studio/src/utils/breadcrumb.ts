import { BreadcrumbItem } from '../components/layout/topbar';
import {
  RequireExperimentName,
  RequireLabName,
  RequireEvalName,
  RequireNoteobokName,
  RequireWorkflowName,
} from '../types/common';
import { RoutePath } from './route_path';
import { capitalCase } from 'change-case';

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
    return { label: capitalCase(params.labName) };
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
      label: capitalCase(params.experimentName),
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
      label: capitalCase(params.evalName),
      href: params.includeHref
        ? RoutePath.experimentEvalItem({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            experimentName: params.options!.experimentName,
            evalName: params.evalName,
          })
        : undefined,
    };
  }

  static experimentNotebookList(
    params?: IncludeHrefWithOptions<RequireExperimentName>
  ): BreadcrumbItem {
    return {
      label: 'Notebooks',
      href: params?.includeHref
        ? RoutePath.experimentNotebookList({
            experimentName: params.options.experimentName,
          })
        : undefined,
    };
  }

  static experimentNotebookItem(
    params: RequireNoteobokName &
      Partial<IncludeHrefWithOptions<RequireExperimentName>>
  ): BreadcrumbItem {
    return {
      label: capitalCase(params.notebookName),
      href: params.includeHref
        ? RoutePath.experimentNotebookItem({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            experimentName: params.options!.experimentName,
            notebookName: params.notebookName,
          })
        : undefined,
    };
  }

  static workflowList(params?: IncludeHref): BreadcrumbItem {
    return {
      label: 'Workflows',
      href: params?.includeHref ? RoutePath.workflowList() : undefined,
    };
  }

  static workflowItem(
    params: RequireWorkflowName &
      Partial<IncludeHrefWithOptions<RequireWorkflowName>>
  ): BreadcrumbItem {
    return {
      label: capitalCase(params.workflowName),
      href: params.includeHref
        ? RoutePath.workflowItem({ workflowName: params.workflowName })
        : undefined,
    };
  }

  static newReport(): BreadcrumbItem {
    return { label: 'New Report' };
  }

  static settings(): BreadcrumbItem {
    return { label: 'Settings' };
  }
}
