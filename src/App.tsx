import "prettier/standalone";
import "prettier/plugins/estree";
import "prettier/parser-babel";
import "prettier/parser-graphql";

import "@codingame/monaco-vscode-standalone-languages";
import "@codingame/monaco-vscode-standalone-json-language-features";
import "@codingame/monaco-vscode-json-default-extension";
import "@codingame/monaco-vscode-json-language-features-default-extension";

import * as monaco from "monaco-editor";
// import * as monaco from './customMonaco';
import { loader } from "@monaco-editor/react";

loader.config({ monaco });

import { ConsoleLogger } from "monaco-languageclient/common";
import { LogLevel } from "@codingame/monaco-vscode-api";
import { MonacoVscodeApiWrapper } from "monaco-languageclient/vscodeApiWrapper";
import {
  useWorkerFactory as configureUseWorkerFactory,
  defineDefaultWorkerLoaders,
} from "monaco-languageclient/workerFactory";
import MonacoEditorReact from "@monaco-editor/react";
import getLanguageServiceOverride from "@codingame/monaco-vscode-languages-service-override";
import getFilesServiceOverride from "@codingame/monaco-vscode-files-service-override";
import getMarkersServiceOverride from "@codingame/monaco-vscode-markers-service-override";
import getBaseServiceOverride from "@codingame/monaco-vscode-base-service-override";
import getExtensionsServiceOverride from "@codingame/monaco-vscode-extensions-service-override";
import getModelServiceOverride from "@codingame/monaco-vscode-model-service-override";
import getLanguageDetectionWorkerServiceOverride from "@codingame/monaco-vscode-language-detection-worker-service-override";
import getIssueServiceOverride from "@codingame/monaco-vscode-issue-service-override";

const logger = new ConsoleLogger(LogLevel.Trace);
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
    ...getLanguageServiceOverride(),
    ...getFilesServiceOverride(),
    ...getMarkersServiceOverride(),
    ...getExtensionsServiceOverride(),
    ...getModelServiceOverride(),
    ...getLanguageDetectionWorkerServiceOverride(),
    ...getIssueServiceOverride(),
  },
});
await apiWrapper.start();
import { GraphiQL } from "graphiql";
import { createGraphiQLFetcher } from "@graphiql/toolkit";

// import "./App.css";
import "graphiql/style.css";
import { explorerPlugin } from "@graphiql/plugin-explorer";
import { HISTORY_PLUGIN } from "@graphiql/plugin-history";
import { useGraphiQL, GraphiQLProvider } from "@graphiql/react";
import { useState, useEffect } from "react";
import { URI } from "monaco-editor/esm/vs/base/common/uri";

const fetcher = createGraphiQLFetcher({
  url: "https://graphql.pokeapi.co/v1beta2",
});
const DEFAULT_PLUGINS = [HISTORY_PLUGIN, explorerPlugin()];

function App() {
  return (
    <GraphiQLProvider fetcher={fetcher}>
      <Inner />
    </GraphiQLProvider>
  );
}

function Inner() {
  const uriInstanceId = useGraphiQL((state) => state.uriInstanceId);
  const initialVariables = useGraphiQL((state) => state.initialVariables);
  const initialQuery = useGraphiQL((state) => state.initialQuery);

  const [modelCreated, setModelCreated] = useState(false);

  useEffect(() => {
    if (!monaco) {
      return;
    }
    (async () => {
      const variablesUri = URI.file(`${uriInstanceId}variables.json`);
      const variablesModel = monaco.editor.getModel(variablesUri);

      if (!variablesModel) {
        await monaco.editor.createModelReference(
          variablesUri,
          initialVariables
        );
      }

      const operationUri = URI.file(`${uriInstanceId}operation.graphql`);
      const operationModel = monaco.editor.getModel(operationUri);

      if (!operationModel) {
        await monaco.editor.createModelReference(operationUri, initialQuery);
      }

      setModelCreated(true);
    })();
  }, [uriInstanceId, initialVariables, initialQuery]);

  if (!modelCreated) {
    return null;
  }
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <GraphiQL fetcher={fetcher} plugins={DEFAULT_PLUGINS} />;
    </div>
  );
}

export default App;
