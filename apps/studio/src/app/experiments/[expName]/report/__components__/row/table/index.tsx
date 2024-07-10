import { Table } from '@palico-ai/components';
import React from 'react';
import { useTableWidget } from '../../notebook.context';
import { Box } from '@mui/material';

interface TableNotebookWidgetProps {
  index: number;
}

const TableNotebookWidget: React.FC<TableNotebookWidgetProps> = ({ index }) => {
  // const availableDatasets = useDatasets();
  // const tableData = useMemo(() => {
  //   return getMergedEvaluationResult(availableDatasets);
  // }, [availableDatasets]);
  // const [columns, setColumns] = useState(createColumnDefs(tableData));

  // const table = useTableModel({
  //   columns,
  //   data: tableData,
  //   enableGrouping: true,
  //   initialState: {
  //     columnVisibility: {
  //       [ANALYSIS_TABLE_COL_ID.payload]: false,
  //       [ANALYSIS_TABLE_COL_ID.responseData]: false,
  //     },
  //   },
  // });

  // const tableState = useControlledStateTable(table);

  // useEffect(() => {
  //   console.log(tableState);
  // }, [tableState]);
  const { table, handleChangeColumnAggregation } = useTableWidget(index);

  return (
    <Box>
      <Table
        maxHeight={'75vh'}
        table={table}
        onChangeColumnAggregation={handleChangeColumnAggregation}
      />
    </Box>
  );
};

export default TableNotebookWidget;
