// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { run } from 'fp-ts-codegen';
import { Options } from 'fp-ts-codegen/lib/ast';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-fp-ts-codegen" is now active!');

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.expandSelection', expandSelection)
  );
}

export function deactivate() {}

const expandSelection = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    warn('No Active TextEditor');
  } else {
    const selection = editor.selection;
    if (selection.isEmpty) {
      warn('No selection to Expand');
    } else {
      run(
        editor.document.getText(selection),
        toOptions((vscode.workspace.getConfiguration(
          'extension'
        ) as unknown) as ExtensionOptions)
      ).fold(warn, insertSnippet(editor, selection));
    }
  }
};

interface ExtensionOptions {
  encoding: 'fp-ts' | 'literal';
  foldName: string;
  handlersName: string;
  handlersStyle: 'positional' | 'record';
  matcheeName: string;
  tagName: string;
}

const toOptions = ({
  handlersName,
  handlersStyle,
  ...rest
}: ExtensionOptions): Options => ({
  ...rest,
  handlersStyle:
    handlersStyle === 'positional'
      ? { type: 'positional' }
      : { type: 'record', handlersName }
});
const warn = (msg: string) => {
  vscode.window.showWarningMessage(msg);
};

const insertSnippet = (editor: vscode.TextEditor, selection: vscode.Selection) => (
  snippet: string
) => {
  editor.insertSnippet(new vscode.SnippetString(snippet), selection);
};
