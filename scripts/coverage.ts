import { spawnSync } from 'node:child_process';
import { globSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const { c8 } = JSON.parse(readFileSync('package.json', 'utf8')) as {
  c8: { include: string[] };
};
const excludes = ['--exclude=**/*.d.ts'];
for (const file of globSync(c8.include, { exclude: ['**/*.d.ts'] })) {
  const { outputText } = ts.transpileModule(readFileSync(file, 'utf8'), {
    fileName: file,
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ESNext,
      verbatimModuleSyntax: true,
      removeComments: true,
    },
  });
  // A file with only exported types may still emit an empty ES module marker.
  const output = outputText.trim();
  if (output === '' || output === 'export {};') {
    excludes.push('--exclude=' + file.replaceAll('\\', '/'));
  }
}

const result = spawnSync(process.execPath, [
  fileURLToPath(import.meta.resolve('c8/bin/c8.js')),
  ...excludes,
  process.execPath, '--test', 'tests/unit/**/*.test.ts', 'tests/integration/**/*.test.ts',
], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
