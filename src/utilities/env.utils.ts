import * as fs from 'fs';
import * as path from 'path';

export function getEnvVariable(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

function findDataFile(dir: string, targetFile: string): null | string {
  console.log(`Searching in directory: ${dir} for file: ${targetFile}`);
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      console.log(`Found directory: ${fullPath}`);
      const found = findDataFile(fullPath, targetFile);
      if (found) {
        return found;
      }
    } else if (file === targetFile) {
      console.log(`Found target file: ${fullPath}`);
      return fullPath;
    }
  }
  return null;
}

export function getDataSet(filename: string, datasetName: string, testCase: string) {
  const env = process.env.NODE_ENV || 'dev';
  const envDir = `${env}`;
  const baseDir = path.resolve(__dirname, `../data/${envDir}`);
  const targetFile = `${filename}.data.ts`;

  console.log(`Looking for data file in environment: ${env}`);
  console.log(`Base directory: ${baseDir}`);
  console.log(`Target file: ${targetFile}`);

  const dataFilePath = findDataFile(baseDir, targetFile);

  if (!dataFilePath) {
    // Check if the environment directory exists
    if (!fs.existsSync(baseDir)) {
      throw new Error(`Environment directory not found: ${baseDir}. Please check if NODE_ENV is set correctly.`);
    }
    throw new Error(`Data file not found: ${targetFile} in env: ${env}. Se arched in: ${baseDir}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const dataModule = require(dataFilePath);

  // Check if the module has a function to get the data
  if (typeof dataModule.getData === 'function') {
    return dataModule.getData(testCase);
  }

  // Fallback to direct access if no function exists
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const data = dataModule[datasetName]?.[testCase];
  if (!data) {
    throw new Error(`Test case data not found for: ${testCase} in dataset: ${datasetName} for env: ${env}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data;
}
