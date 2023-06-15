import {
  addFunction,
  amplifyPush,
  createNewProjectDir,
  deleteProject,
  deleteProjectDir,
  generateRandomShortId,
  initJSProjectWithProfile,
  loadFunctionTestFile,
  overrideFunctionSrcNode,
} from '@aws-amplify/amplify-e2e-core';
import { v4 as uuid } from 'uuid';

describe('amplify push function cases:', () => {
  let projRoot: string;

  beforeEach(async () => {
    projRoot = await createNewProjectDir('multiple-function-push');
  });

  afterEach(async () => {
    await deleteProject(projRoot);
    deleteProjectDir(projRoot);
  });

  it('should be able to push multiple functions at the same time', async () => {
    const projName = `multi-lambda-${generateRandomShortId()}`;
    await initJSProjectWithProfile(projRoot, { name: projName });

    const [shortId] = uuid().split('-');
    const functionName = `nodetestfunction${shortId}`;

    await addFunction(projRoot, { functionTemplate: 'Hello World', name: functionName }, 'nodejs');
    await amplifyPush(projRoot);

    const functionCode = loadFunctionTestFile('case-function.js').replace('{{testString}}', 'Hello from Lambda!');
    overrideFunctionSrcNode(projRoot, functionName, functionCode);
    await addFunction(projRoot, { functionTemplate: 'Hello World' }, 'python');

    await amplifyPush(projRoot);
  });
});
