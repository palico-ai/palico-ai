#!/usr/bin/env node

import { UpdatePalicoContainerImages } from '../cli/selfhost/handlers';
import Project from '../utils/project';

const PalicoPostInstall = async () => {
  try {
    const isSelfHosted = await Project.isSelfHosted();
    if (isSelfHosted) {
      console.log('Updating docker compose image version...');
      await UpdatePalicoContainerImages();
    }
  } catch (e) {
    console.error('Error updating docker compose file', e);
  }
};

void PalicoPostInstall();
