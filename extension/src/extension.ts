'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode' ;

import * as path from 'path';
import * as fs from 'fs';

import { workspace, ExtensionContext } from 'vscode';

import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind
} from 'vscode-languageclient/node';

import { Nicorext } from "./verilogTest1";
import { ISettings } from './langageserver/ISettings';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Bien joué ! Your extension "NiVerExt-4-IVerilog" is now active!');
    
    // ***************************** ACTIONVATION Extension Test 1 "sayhello"

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('niverext.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        vscode.window.showInformationMessage('Hello from NiVerExt-4-IVerilog. Happy hard-coding.'); 
        let testVl = new Nicorext.VerilogHelper(null);
    });
    context.subscriptions.push(disposable);
       
    // ***************************** ACTIONVATION Extension Test 2
    let disposable2 = vscode.commands.registerCommand('niverext.direBonjour', () => {
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

    // ******************************** Activation of extension 'niverext.buildfile'
    let disposable3 = vscode.commands.registerCommand('niverext.buildfile', () => {
    
        var editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No file file opened');
            return; // No open text editor
        }
        if (!(editor.document.fileName.endsWith('.v') || editor.document.fileName.endsWith('.vh'))){
            vscode.window.showWarningMessage('Not a verilog (.v or .vh) file.');
            return; // not a verilog file
        }
        // Display a message box to the user
        vscode.window.showInformationMessage('Compiling file : ' + editor.document.fileName);
        // TODO : start compilation :)
    });
    context.subscriptions.push(disposable3);
    

    // ******************************** Activation of extension 'niverext.buildproject'
    let disposableBP = vscode.commands.registerCommand('niverext.buildproject', () => {
        
            var editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No file file opened');
                return; // No open text editor
            }
            if (!(editor.document.fileName.endsWith('.vpj'))) {
                vscode.window.showWarningMessage('Not a verilog project (.vpj) file.');
                return; // not a verilog project file
            }
            // Display a message box to the user
            vscode.window.showInformationMessage('Compiling project : ' + editor.document.fileName);
            // TODO : start compilation :)
        });
        context.subscriptions.push(disposable3);
        


    // ******************************** Activation LANGAGE SERVER
    // The server is hosted in subfolder ./langageserver
    let serverModule = context.asAbsolutePath(path.join('out/src/langageserver', 'vllangageserver.js'));

    // The debug options for the server
	let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
	
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run : { module: serverModule, transport: TransportKind.ipc },
		debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
	}

    // Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for verilog code file
		documentSelector: ['verilog','verilogproject'],
		synchronize: {
			// Synchronize the setting section 'niverextServer' to the server
			configurationSection: 'niverextServer',
			// Notify the server about file changes to '.clientrc files contain in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	}

    // Create the language client and start the client.
	let langcliDisposable = new LanguageClient('niverextServer', 'NiVerExt IcarusVerilog extension langage server', serverOptions, clientOptions).start();
	
	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
    context.subscriptions.push(langcliDisposable);
    
    // ******************************** Check if iverilog compiler is not present to infor dev
    let cfg = vscode.workspace.getConfiguration('niverextServer'); 
    if (!fs.existsSync(cfg.get('iverilogCompilerExePath') as string)){
        vscode.window.showErrorMessage('IcarusVerilog compiler not found! Please install it or update extension configuration ( see https://github.com/flyingoverclouds/nicarext/extension/doc/configuration.md)');
    }

    if (!fs.existsSync(cfg.get('vvpExePath') as string)){
        vscode.window.showErrorMessage('VVP exe not found! Please install it or update extension configuration ( see https://github.com/flyingoverclouds/nicarext/extension/doc/configuration.md)');
    }

    if (!fs.existsSync(cfg.get('gtkWaveExePath') as string)){
        vscode.window.showErrorMessage('GTKWAVE exe not found! Please install it or update extension configuration ( see https://github.com/flyingoverclouds/nicarext/extension/doc/configuration.md)');
    }

}

// this method is called when your extension is deactivated
export function deactivate() {
    
}

