import { Editor } from '@monaco-editor/react';
import { Card, CardContent } from '@mui/material';
import { TabPanel, TabView } from '@palico-ai/components';
import React from 'react';

export interface AdvanceOptionProps {
  requestPayload?: string;
  onChangeRequestPayload: (payload?: string) => void;
  featureFlag?: string;
  onChangeFeatureFlag: (featureFlag?: string) => void;
}

const AdvanceOption: React.FC<AdvanceOptionProps> = ({
  requestPayload,
  onChangeRequestPayload,
  featureFlag,
  onChangeFeatureFlag,
}) => {
  return (
    <Card>
      <TabView
        tabs={[
          {
            label: 'Request Payload',
            value: 'request_payload',
          },
          {
            label: 'Feature Flag',
            value: 'feature_flag',
          },
        ]}
      >
        <CardContent>
          <TabPanel value="request_payload">
            <Editor
              theme="vs-dark"
              height={'15vh'}
              defaultLanguage="json"
              value={requestPayload}
              onChange={(value) => onChangeRequestPayload(value ?? '')}
              options={{
                ariaLabel: 'User Message',
                scrollBeyondLastColumn: 0,
              }}
              defaultValue={JSON.stringify({}, null, 2)}
            />
          </TabPanel>
          <TabPanel value="feature_flag">
            <Editor
              theme="vs-dark"
              height={200}
              value={featureFlag}
              onChange={(value) => onChangeFeatureFlag(value ?? '')}
              defaultLanguage="json"
              options={{
                ariaLabel: 'User Message',
                scrollBeyondLastColumn: 0,
              }}
            />
          </TabPanel>
        </CardContent>
      </TabView>
    </Card>
  );
};

export default AdvanceOption;
