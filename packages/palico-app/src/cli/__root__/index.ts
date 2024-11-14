import { AppServiceManager } from '../../utils/app_services';

interface StartDevAppParams {
  clean?: boolean;
}

export const StartDevApp = async (params: StartDevAppParams) => {
  console.log('Starting dev app...');
  if (params.clean) {
    console.log('Starting in clean mode');
  }
  await AppServiceManager.startDevApp({
    cleanStart: params.clean,
  });
};

export const StartProdApp = async () => {
  console.log('Starting prod app...');
  await AppServiceManager.startProductionApp();
};
