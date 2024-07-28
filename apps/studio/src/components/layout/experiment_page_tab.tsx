'use client';
import { Tabs, Tab } from '@palico-ai/components';
import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';
import { useExperimentName } from '../../hooks/use_params';
import { RoutePath } from '../../utils/route_path';
import { ComponentWithChildren } from '../../types/component_types';
import { Box } from '@mui/material';

enum TabKey {
  EVALUATION = 'evals',
  NOTEBOOK = 'notebook',
}

const ExperimentSubpageLayout: React.FC<ComponentWithChildren> = ({
  children,
}) => {
  const currentPath = usePathname();
  const router = useRouter();
  const expName = useExperimentName();

  const activeTab = useMemo(() => {
    if (currentPath.includes(TabKey.NOTEBOOK)) {
      return TabKey.NOTEBOOK;
    }
    return TabKey.EVALUATION;
  }, [currentPath]);

  return (
    <Box
      sx={{
        mt: 2,
        mx: 2,
      }}
    >
      <Tabs
        variant="fullWidth"
        value={activeTab}
        sx={{
          mb: 2,
        }}
      >
        <Tab
          label="Evaluations"
          value={TabKey.EVALUATION}
          onClick={() => {
            router.push(
              RoutePath.experimentEvalList({ experimentName: expName })
            );
          }}
        />
        <Tab
          label="Notebooks"
          value={TabKey.NOTEBOOK}
          onClick={() => {
            router.push(
              RoutePath.experimentNotebookList({ experimentName: expName })
            );
          }}
        />
      </Tabs>
      <Box>{children}</Box>
    </Box>
  );
};

export default ExperimentSubpageLayout;
