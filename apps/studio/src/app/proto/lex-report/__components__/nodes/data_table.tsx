import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Box, CardActions, CardHeader, Divider, Paper } from '@mui/material';
import { Button, Card, Table, CardContent } from '@palico-ai/components';
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { $getNodeByKey, DecoratorNode, NodeKey } from 'lexical';
import { cloneDeep } from 'lodash';
import { ReactNode, useState } from 'react';

interface LexicalTableNodeProps {
  nodekey: NodeKey;
  data: any[];
  columns: ColumnDef<any>[];
}

const LexicalTableNode: React.FC<LexicalTableNodeProps> = ({
  nodekey,
  data,
  columns,
}) => {
  const [editor] = useLexicalComposerContext();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card>
      <CardHeader
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
        title="Data Table"
        action={
          <Box>
            <Button variant="contained" color="secondary">
              Modify
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                editor.update(() => {
                  const node = $getNodeByKey(nodekey);
                  console.log('Node', node);
                  if (node instanceof DataTableNode) {
                    node?.removeRow();
                  } else {
                    console.log('Node is not DataTableNode');
                  }
                });
              }}
            >
              Remove Row
            </Button>
          </Box>
        }
      />
      <CardContent>
        <Table table={table} />
      </CardContent>
    </Card>
  );
};

type CreateDatatableParams = Pick<LexicalTableNodeProps, 'data' | 'columns'>;

export class DataTableNode extends DecoratorNode<ReactNode> {
  static getType(): string {
    return 'data_table';
  }

  static clone(node: DataTableNode): DataTableNode {
    return new DataTableNode(node.params, node.__key);
  }

  data: any[];
  columns: ColumnDef<any>[];

  constructor(readonly params: CreateDatatableParams, key?: NodeKey) {
    super(key);
    this.data = params.data;
    this.columns = params.columns;
  }

  removeRow() {
    const writter = this.getWritable();
    writter.data = cloneDeep(this.data.slice(0, this.data.length - 1));
  }

  createDOM(): HTMLElement {
    return document.createElement('div');
  }

  updateDOM(): false {
    return false;
  }

  isIsolated(): boolean {
    return true;
  }

  decorate(): ReactNode {
    console.log('Decorate');
    console.log(this.data);
    return (
      <LexicalTableNode
        nodekey={this.__key}
        data={this.data}
        columns={this.columns}
      />
    );
  }
  isKeyboardSelectable(): boolean {
    return false;
  }
}

export const $createDataTableNode = (params: CreateDatatableParams) => {
  return new DataTableNode(params);
};
