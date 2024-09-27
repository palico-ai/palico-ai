'use client';

import React, { useEffect, useMemo } from 'react';
import {
  DatasetMetadata,
  NotebookWidget,
  NotebookWidgetType,
  TableNotebookWidget,
  TextboxNotebookWidget,
} from '@palico-ai/common';
import { getEvalByName } from '../../../../../../../services/experiments';
import {
  createColumnDefForDatasets,
  getMergedEvaluationResult,
} from './row/table/utils';
import {
  useControlledStateTable,
  useControlledTableColumns,
  useTableModel,
} from '@palico-ai/components';
import { ANALYSIS_TABLE_COL_ID } from '../../../../../../../utils/evaluation';
import { AggregationFnOption } from '@tanstack/react-table';
import { EvalTestCaseWithDatasetLabel } from '@palico-ai/common';
import { Dataset } from './types';

interface NotebookContextProps {
  datasets: Dataset[];
  setDatasets: React.Dispatch<React.SetStateAction<Dataset[]>>;
  rows: NotebookWidget[];
  setRows: React.Dispatch<React.SetStateAction<NotebookWidget[]>>;
}

const NotebookContext = React.createContext<NotebookContextProps>(
  {} as NotebookContextProps
);

interface NotebookProviderProps {
  initialRows?: NotebookWidget[];
  initialDatasets?: Dataset[];
  children: React.ReactNode;
}

export const NotebookProvider: React.FC<NotebookProviderProps> = ({
  initialRows = [],
  initialDatasets = [],
  children,
}) => {
  const [rows, setRows] = React.useState<NotebookWidget[]>(initialRows);
  const [datasets, setDatasets] = React.useState<Dataset[]>(initialDatasets);

  return (
    <NotebookContext.Provider value={{ rows, setRows, datasets, setDatasets }}>
      {children}
    </NotebookContext.Provider>
  );
};

export const useNotebookRowManipulation = () => {
  const { setRows, rows } = React.useContext(NotebookContext);

  const handleAddRow = (atIndex: number) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows.splice(atIndex, 0, { type: NotebookWidgetType.Empty });
      return newRows;
    });
  };

  const handleDeleteRow = (atIndex: number) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows.splice(atIndex, 1);
      return newRows;
    });
  };

  const handleAddRowAtEnd = () => {
    setRows((prevRows) => {
      return [...prevRows, { type: NotebookWidgetType.Empty }];
    });
  };

  return {
    rows,
    handleAddRow,
    handleDeleteRow,
    handleAddRowAtEnd,
  };
};

export const useRowManipulation = (index: number) => {
  const { setRows } = React.useContext(NotebookContext);

  const DEFAULT_TEXT_WIDGET_DATA: TextboxNotebookWidget['data'] = {
    text: '',
  };

  const DEFAULT_TABLE_WIDGET_DATA: TableNotebookWidget['data'] = {
    tableState: {
      columnVisibility: {
        [ANALYSIS_TABLE_COL_ID.payload]: false,
        [ANALYSIS_TABLE_COL_ID.responseData]: false,
      },
    },
    columnAggregationFn: {},
  };
  const setRowWidgetType = (type: NotebookWidget['type']) => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      switch (type) {
        case NotebookWidgetType.Empty:
          newRows[index] = {
            type: NotebookWidgetType.Empty,
          };
          break;
        case NotebookWidgetType.Table:
          newRows[index] = {
            type: NotebookWidgetType.Table,
            data: DEFAULT_TABLE_WIDGET_DATA,
          };
          break;
        case NotebookWidgetType.Text:
          newRows[index] = {
            type: NotebookWidgetType.Text,
            data: DEFAULT_TEXT_WIDGET_DATA,
          };
          break;
      }
      return newRows;
    });
  };

  return {
    setRowWidgetType,
  };
};

export const useHandleChangeTextWidget = (index: number) => {
  const { setRows, rows } = React.useContext(NotebookContext);
  const row = useMemo(() => rows[index], [rows, index]);

  const handleChangeText = (text: string) => {
    if (row.type !== NotebookWidgetType.Text) {
      console.error('Row is not a text widget');
      return;
    }
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = {
        type: NotebookWidgetType.Text,
        data: {
          text,
        },
      };
      return newRows;
    });
  };

  return {
    value: row.type === NotebookWidgetType.Text ? row.data.text : '',
    onChange: handleChangeText,
  };
};

export const useTableWidget = (index: number) => {
  const { datasets, rows, setRows } = React.useContext(NotebookContext);
  const row = useMemo(() => rows[index], [rows, index]) as TableNotebookWidget;
  const { columns, onChangeColumnAggregationFn } = useControlledTableColumns(
    createColumnDefForDatasets(
      getMergedEvaluationResult(datasets),
      row.data.columnAggregationFn
    )
  );

  const tableData = useMemo(() => {
    return getMergedEvaluationResult(datasets);
  }, [datasets]);

  const table = useTableModel({
    columns,
    data: tableData,
    enableGrouping: true,
    initialState: row.data.tableState,
  });

  const tableState = useControlledStateTable(table);

  useEffect(() => {
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = {
        ...row,
        data: {
          ...row.data,
          tableState,
        },
      };
      return newRows;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, setRows, tableState]);

  const handleChangeColumnAggregation = (
    id: string,
    fnName: AggregationFnOption<EvalTestCaseWithDatasetLabel>
  ) => {
    onChangeColumnAggregationFn(id, fnName);
    setRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = {
        ...row,
        data: {
          ...row.data,
          columnAggregationFn: {
            ...row.data.columnAggregationFn,
            [id]: fnName,
          },
        },
      };
      return newRows;
    });
  };

  return {
    table,
    handleChangeColumnAggregation,
  };
};

export const useDatasetManipulation = () => {
  const { datasets, setDatasets } = React.useContext(NotebookContext);

  const handleAddDataset = async (dataset: DatasetMetadata): Promise<void> => {
    const existingDataset = datasets.find(
      (current) => current.label === dataset.label
    );
    if (existingDataset) {
      throw new Error('Dataset with that label already exists');
    }
    const evaluation = await getEvalByName(
      dataset.experimentName,
      dataset.evalName
    );
    setDatasets((prevDatasets) => {
      return [
        ...prevDatasets,
        {
          ...dataset,
          data: evaluation,
        },
      ];
    });
  };

  const handleDeleteDataset = (label: string) => {
    setDatasets((prevDatasets) => {
      return prevDatasets.filter((dataset) => dataset.label !== label);
    });
  };

  return {
    datasets,
    handleAddDataset,
    handleDeleteDataset,
  };
};

export const useDatasets = () => {
  const { datasets } = React.useContext(NotebookContext);
  return datasets;
};

export default NotebookContext;
