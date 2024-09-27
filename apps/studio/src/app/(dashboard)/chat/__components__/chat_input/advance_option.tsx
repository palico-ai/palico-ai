import { Card, CardContent } from '@mui/material';
import { Editor, TabPanel, TabView } from '@palico-ai/components';
import React from 'react';

export interface AdvanceOptionProps {
  requestPayload?: string;
  onChangeRequestPayload: (payload?: string) => void;
  appConfig?: string;
  onChangeAppConfig: (appConfig?: string) => void;
}

const EDITOR_HEIGHT = '18vh';

const AdvanceOption: React.FC<AdvanceOptionProps> = ({
  requestPayload,
  onChangeRequestPayload,
  appConfig,
  onChangeAppConfig,
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
            label: 'App Config',
            value: 'app_config',
          },
        ]}
      >
        <CardContent>
          <TabPanel value="request_payload">
            <Editor
              height={EDITOR_HEIGHT}
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
          <TabPanel value="app_config">
            <Editor
              height={EDITOR_HEIGHT}
              value={appConfig}
              onChange={(value) => onChangeAppConfig(value ?? '')}
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
