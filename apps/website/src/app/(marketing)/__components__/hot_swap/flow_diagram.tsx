'use client';

import React from 'react';
import { Background, Edge, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const getPositionFor = (row: number, column: number) => {
  return {
    x: column * 200,
    y: row * 90 + 25,
  };
};

export const HOTSWAP_NODE_LIST = {
  input: {
    id: 'input',
    data: { label: 'Input' },
    position: getPositionFor(0, 2),
  },
  prompts: {
    chainOfThought: {
      id: 'chainOfThought',
      data: { label: 'Chain of Thought' },
      position: getPositionFor(1, 1),
    },
    fewShot: {
      id: 'fewShot',
      data: { label: 'Few-shot' },
      position: getPositionFor(1, 2),
    },
    zeroShot: {
      id: 'zeroShot',
      data: { label: 'Zero-shot' },
      position: getPositionFor(1, 3),
    },
  },
  rag: {
    datasetV1: {
      id: 'datasetV1',
      data: { label: 'RAG with Dataset V1' },
      position: getPositionFor(2, 1),
    },
    datasetV2: {
      id: 'datasetV2',
      data: { label: 'RAG with Dataset V2' },
      position: getPositionFor(2, 2),
    },
    datasetV3: {
      id: 'datasetV3',
      data: { label: 'RAG with Dataset V3' },
      position: getPositionFor(2, 3),
    },
  },
  model: {
    gpt35: {
      id: 'gpt35',
      data: { label: 'GPT-3.5' },
      position: getPositionFor(3, 1),
    },
    gpt4: {
      id: 'gpt4',
      data: { label: 'GPT-4' },
      position: getPositionFor(3, 2),
    },
    llama2: {
      id: 'llama2',
      data: { label: 'LLAMA-2' },
      position: getPositionFor(3, 3),
    },
  },
  postProcess: {
    id: 'postProcess',
    data: { label: 'Post-process' },
    position: getPositionFor(4, 1),
  },
  respond: {
    id: 'respond',
    data: { label: 'Output' },
    position: getPositionFor(5, 2),
  },
};

interface HotswapFlowDiagramProps {
  edges: Edge[];
}

const HotswapFlowDiagram: React.FC<HotswapFlowDiagramProps> = ({ edges }) => {
  return (
    <ReactFlow
      fitView
      zoomOnScroll={false}
      zoomOnPinch={false}
      edges={edges}
      nodes={[
        HOTSWAP_NODE_LIST.input,
        ...Object.values(HOTSWAP_NODE_LIST.prompts),
        ...Object.values(HOTSWAP_NODE_LIST.rag),
        ...Object.values(HOTSWAP_NODE_LIST.model),
        HOTSWAP_NODE_LIST.postProcess,
        HOTSWAP_NODE_LIST.respond,
      ]}
      colorMode="dark"
    >
      <Background />
    </ReactFlow>
  );
};

export default HotswapFlowDiagram;
