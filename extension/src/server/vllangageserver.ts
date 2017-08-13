
'use strict';

import * as vscode from 'vscode';
import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	InitializeParams, InitializeResult, TextDocumentPositionParams,
	CompletionItem, CompletionItemKind
} from 'vscode-languageserver';

import { Settings, NicarextSettings } from './ISettings';
import { IcarusServer } from './IcarusConnection'

// ************** Global variable
// root folder of workspace open in vscode (set on connection init)
let workspaceRoot: string; 

// SETTINGS : hold the maxNumberOfProblems setting
let maxNumberOfProblems: number;

// *************** server initialisation
console.log("Starting nicarext langage server ...");

// Create a connection for the server. The connection uses Node's IPC as a transport
let connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

let cnxMgr = new IcarusServer.ConnectionManager(connection);

connection.console.log("Nicarext langage server connected.");

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

	let settings = <Settings>change.settings;
	maxNumberOfProblems = settings.nicarextServer.maxNumberOfProblems || 100;
	// Revalidate any open text documents
	//documents.all().forEach(validateTextDocument);
});

connection.onDidChangeWatchedFiles((change) => {
    // Monitored files have change in VSCode
    connection.console.log("NICAREXT: connection.onDidChangeWatchedFiles");
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
    connection.console.log("NICAREXT: documents.onDidChangeContent");
});

documents.onDidClose((closed) => {
    connection.console.log("NICAREXT: documents.onDidClose");
});

documents.onDidOpen((opened) => {
    connection.console.log("NICAREXT: documents.onDidOpen");
});

documents.onDidSave((saved) =>{
    connection.console.log("NICAREXT:documents. onDidSave");
});

documents.onWillSave((willSave)=>{
    connection.console.log("NICAREXT: documents.onWillSave");
});


// START LISTENING VSCODE COMMANDE
connection.listen();

