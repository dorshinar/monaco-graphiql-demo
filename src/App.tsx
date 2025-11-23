import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";

loader.config({ monaco });

import { LogLevel } from "@codingame/monaco-vscode-api";
import { MonacoVscodeApiWrapper } from "monaco-languageclient/vscodeApiWrapper";
import {
  useWorkerFactory as configureUseWorkerFactory,
  defineDefaultWorkerLoaders,
} from "monaco-languageclient/workerFactory";
import getMarkersServiceOverride from "@codingame/monaco-vscode-markers-service-override";
import getBaseServiceOverride from "@codingame/monaco-vscode-base-service-override";
import getExtensionsServiceOverride from "@codingame/monaco-vscode-extensions-service-override";
import getLanguageDetectionWorkerServiceOverride from "@codingame/monaco-vscode-language-detection-worker-service-override";
import getIssueServiceOverride from "@codingame/monaco-vscode-issue-service-override";

const apiWrapper = new MonacoVscodeApiWrapper({
  $type: "classic",
  viewsConfig: {
    $type: "EditorService",
    htmlContainer: "ReactPlaceholder",
  },
  logLevel: LogLevel.Debug,
  monacoWorkerFactory: () =>
    configureUseWorkerFactory({
      workerLoaders: {
        ...defineDefaultWorkerLoaders(),
        graphql: () =>
          new Worker(MonacoEnvironment?.getWorkerUrl!("bla", "graphql")!, {
            type: "module",
          }),
        json: () =>
          new Worker(MonacoEnvironment?.getWorkerUrl!("bla", "json")!, {
            type: "module",
          }),
      },
    }),
  serviceOverrides: {
    ...getBaseServiceOverride(),
    ...getMarkersServiceOverride(),
    ...getExtensionsServiceOverride(),
    ...getLanguageDetectionWorkerServiceOverride(),
    ...getIssueServiceOverride(),
  },
});
await apiWrapper.start();

function App() {
  return (
    <div>
      <input type="text" />
    </div>
  );
}

export default App;
