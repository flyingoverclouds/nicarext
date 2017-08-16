'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind } from 'vscode-languageclient';

import { Nicorext } from "./verilogTest1";


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "NIverExt" is now active!');

    // ***************************** ACTIONVATION Extension  1

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World NICOLAS!');


        let testVl = new Nicorext.VerilogHelper(null);

    });
    context.subscriptions.push(disposable);
       
    // ***************************** ACTIONVATION Extension  2
    let disposable2 = vscode.commands.registerCommand('extension.direBonjour', () => {
        vscode.window.showInformationMessage('Bonjour tout le monde du Code!');
    
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No editor opened');
            return; // No open text editor
        }

        var selection = editor.selection;
        var text = editor.document.getText(selection);

        // Display a message box to the user
        vscode.window.showInformationMessage('Selected characters: ' + text.length);
    });
    context.subscriptions.push(disposable2);

    // ******************************** Activation LANGAGE SERVER
    // The server is implemented in nodeJS

    let serverModule = context.asAbsolutePath(path.join('out/src/server', 'vllangageserver.js'));
	// The debug options for the server
	let debugOptions = { execArgv: ["--nolazy", "--debug=6009"] };
	
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	}
	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for verilog code file
		documentSelector: ['verilog'],
		synchronize: {
			// Synchronize the setting section 'nicarextServer' to the server
			configurationSection: 'nicarextServer',
			// Notify the server about file changes to '.clientrc files contain in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	}

    // Create the language client and start the client.
	let langcliDisposable = new LanguageClient('nicarextServer', 'Icarus support extension by Nicolas CLERC', serverOptions, clientOptions).start();
	
	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(langcliDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}