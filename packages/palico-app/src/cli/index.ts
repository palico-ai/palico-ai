#!/usr/bin/env node

import { Command } from 'commander'
import { ServeDevServer } from './__root__/dev'
import { SyncDB } from './__root__/sync_db'
import { GetServiceKeyHandler } from './__root__/get_service_key'

const root = new Command()

root.command('dev')
  .description('starts local server')
  .option('-p, --port <port>', 'port to run server on')
  .option('--force-sync', 'force sync database')
  .action(ServeDevServer)

root.command('sync-db')
  .description('syncs database')
  .option('--force-sync', 'force sync database')
  .action(SyncDB)

root.command('get-service-key')
  .description('get service key')
  .action(GetServiceKeyHandler)

root.parse()
