// import {
//   CreateStudioLabParams,
//   StudioLabModel,
//   StudioLabModelMetadata,
//   UpdateStudioLabParams,
// } from '@palico-ai/common';
// import { StudioLabAttriutes, StudioLabTable } from '../services/database/tables';
// import { uuid } from 'uuidv4';
// import { trace } from '@opentelemetry/api';

// const tracer = trace.getTracer('studio-lab');

// export class StudioLab {
//   static async create(params: CreateStudioLabParams): Promise<StudioLabModel> {
//     const response = await StudioLabTable.create({
//       id: uuid(),
//       name: params.name,
//       experimentListJSON: JSON.stringify(params.experiments),
//       testCasesJSON: JSON.stringify(params.testCases),
//       experimentTestResultJSON: JSON.stringify(params.experimentTestResults),
//     });
//     return this.parse(response.dataValues);
//   }

//   static async get(id: string): Promise<StudioLabModel | null> {
//     return await tracer.startActiveSpan('Get Studio Lab By ID', async (span) => {
//       const response = await StudioLabTable.findByPk(id);
//       if (!response) {
//         return null;
//       }
//       span.addEvent('Lab found', {
//         ...response.dataValues,
//       });
//       span.end();
//       return this.parse(response.dataValues);
//     });
//   }

//   static async findAll(): Promise<StudioLabModelMetadata[]> {
//     return await tracer.startActiveSpan('Find All Studio Labs', async (span) => {
//       const response = await StudioLabTable.findAll({
//         attributes: ['id', 'name'],
//       });
//       span.addEvent('Labs found', {
//         count: response.length,
//       });
//       span.end();
//       return response.map((data) => this.parseMetadata(data.dataValues));
//     });
//   }

//   static async update(id: string, params: UpdateStudioLabParams) {
//     await tracer.startActiveSpan('Update Studio Lab', async (span) => {
//       const updatedValues: Partial<StudioLabAttriutes> = {};
//       if (params.experiments) {
//         updatedValues.experimentListJSON = JSON.stringify(params.experiments);
//       }
//       if (params.testCases) {
//         updatedValues.testCasesJSON = JSON.stringify(params.testCases);
//       }
//       if (params.experimentTestResults) {
//         updatedValues.experimentTestResultJSON = JSON.stringify(
//           params.experimentTestResults
//         );
//       }
//       if(params.baselineExperimentId) {
//         updatedValues.baselineExperimentId = params.baselineExperimentId;
//       }
//       span.setAttribute(
//         'updatedValues',
//         JSON.stringify(updatedValues, null, 2)
//       );
//       await StudioLabTable.update(updatedValues, {
//         where: {
//           id,
//         },
//       });
//       span.end();
//     });
//   }

//   static async remove(id: string) {
//     await StudioLabTable.destroy({
//       where: {
//         id,
//       },
//     });
//   }

//   private static parse(data: StudioLabAttriutes): StudioLabModel {
//     return {
//       id: data.id,
//       name: data.name,
//       experiments: JSON.parse(data.experimentListJSON),
//       testCases: JSON.parse(data.testCasesJSON),
//       baselineExperimentId: data.baselineExperimentId,
//       experimentTestResults: JSON.parse(data.experimentTestResultJSON),
//       createdAt: data.createdAt,
//       updatedAt: data.updatedAt,
//     };
//   }

//   private static parseMetadata(
//     data: StudioLabAttriutes
//   ): StudioLabModelMetadata {
//     return {
//       id: data.id,
//       name: data.name,
//     };
//   }
// }
