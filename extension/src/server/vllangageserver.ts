
'use strict';


import * as querystring from 'querystring';
import * as vscode from 'vscode';
import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	InitializeParams, InitializeResult, TextDocumentPositionParams,
	CompletionItem, CompletionItemKind
} from 'vscode-languageserver';

import { ISettings, INicarextSettings } from './ISettings';
import { ConnectionManager } from './ConnectionManager'
import { Compilers } from './VerilogCompiler'

// ************** Global variable
// root folder of workspace open in vscode (set on connection init)
let workspaceRoot: string; 

// SETTINGS : hold the maxNumberOfProblems setting
let maxNumberOfProblems: number;
let iverilogRoot: string = "c:\\iverilog";
let iverilogCompilerExe:string = '${iverilogRoot}\\bin\\iverilog.exe';
let iverilogVvpExe:string = '${iverilogRoot}\\bin\\vvp.exe';
let gtkwaveRoot:string = '${iverilogRoot}\\gtkwave\\';
let gtkwaveExe:string = '${gtkwaveRoot}\\bin\\gtkwave.exe';
 

// *************** server initialisation
console.log("Starting nicarext langage server ...");

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

let cnxMgr = new ConnectionManager(connection);

connection.console.log("Nicarext langage server available.");

connection.onInitialize((params): InitializeResult => {
    connection.console.log("NICAREXT: connection.onInitialize");

	workspaceRoot = params.rootPath; // store locally the root folder ofworkspace open in vscode
	return {
		capabilities: {
			// Tell the client that the server works in FULL text document sync mode
            textDocumentSync: documents.syncKind,
            
			// Tell the client that the server support code complete
			completionProvider: {
				resolveProvider: true
			}
		}
	}
});


// This handler provides the initial list of the completion items.
connection.onCompletion((textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
     connection.console.log("NICAREXT: connection.onCompletion");
     
	// The pass parameter contains the position of the text document in 
	// which code complete got requested. For the example we ignore this
	// info and always provide the same completion items.
	return [
		{
			label: 'TypeScript',
			kind: CompletionItemKind.Text,
			data: 1
		},
		{
			label: 'JavaScript',
			kind: CompletionItemKind.Text,
			data: 2
		}
	]
});

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
    connection.console.log("NICAREXT: connection.onCompletionResolve");
    
	if (item.data === 1) {
		item.detail = 'TypeScript details',
		item.documentation = 'TypeScript documentation'
	} else if (item.data === 2) {
		item.detail = 'JavaScript details',
		item.documentation = 'JavaScript documentation'
	}
	return item;
});

// The settings have changed. Is send on server activation
// as well.
connection.onDidChangeConfiguration((change) => {
    connection.console.log("NICAREXT: connection.onDidChangeConfiguration");

	let settings = <ISettings>change.settings;
	maxNumberOfProblems = settings.nicarextServer.maxNumberOfProblems || 100;

	// TODO : test or find ICARUS installation folder and store in config
	
});

connection.onDidChangeWatchedFiles((change) => {
    // Monitored files have change in VSCode
    //connection.console.log("NICAREXT: connection.onDidChangeWatchedFiles");
});



// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);




// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((changed) => {
    //connection.console.log("NICAREXT: documents.onDidChangeContent");
});

documents.onDidClose((closed) => {
    connection.console.log("NICAREXT: documents.onDidClose");
});

documents.onDidOpen((opened) => {
    //connection.console.log("NICAREXT: documents.onDidOpen");
});

let isCompiling: boolean = false;
documents.onDidSave((saved) =>{
		connection.console.log('NICAREXT: documents.onDidSave : ' + saved.document.uri);
		if (isCompiling)
		{
			connection.console.warn("already compiling ... retry later.");
			return;
		}
		isCompiling=true;
		try {
			if(saved.document.uri.startsWith("file:///"))
			{
				let filePath: string = querystring.unescape(saved.document.uri).replace("file:///","");
				let compiler = new Compilers.Compiler(connection.console);
				let codeerrors = compiler.CheckSyntax(filePath);
			}
		} catch (error) {
			connection.console.error("ERROR : " + error)
		}
		finally
		{
			isCompiling=false;
		}
	});

documents.onWillSave((willSave)=>{
    //connection.console.log("NICAREXT: documents.onWillSave");
});


// START LISTENING VSCODE COMMANDE
connection.listen();

