
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

let extensionSettings: INicarextSettings;

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
connection.console.log("create connection = " + connection);
let cnxMgr = new ConnectionManager(connection);



// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

// Make the text document manager listen on the connection
// for open, change and close text document events

//documents.listen(connection);
documents.listen(cnxMgr.getConnection());



// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((changed) => {
	//checkVlSyntax(changed.document.uri);
	//connection.console.log("NICAREXT: documents.onDidChangeContent " + changed.document.uri);
});

documents.onDidClose((closed) => {
    //connection.console.log("NICAREXT: documents.onDidClose");
});

documents.onDidOpen((opened) => {
	//connection.console.log("NICAREXT: documents.onDidOpen");
		checkVlSyntax(opened.document.uri);
});


documents.onDidSave((saved) =>{
	//connection.console.log('NICAREXT: documents.onDidSave : ' + saved.document.uri);
	checkVlSyntax(saved.document.uri);
	});

let isCompiling: boolean = false;
function checkVlSyntax(documentUri:string)
{
	if (isCompiling)
	{
		connection.console.warn("already compiling ... retry later.");
		return;
	}
	isCompiling=true;
	try {
		if(documentUri.startsWith("file:///"))
		{
			let filePath: string = querystring.unescape(documentUri).replace("file:///","");
			let compiler = new Compilers.Compiler(connection.console,connection); 
			let codeerrors = compiler.CheckSyntax(documentUri,filePath); // TODO : add a lamba to send back to vs , instead of passing connection to ctor
		}
	} catch (error) {
		connection.console.error("ERROR : " + error)
	}
	finally
	{
		isCompiling=false;
	}

}


documents.onWillSave((willSave)=>{
    //connection.console.log("NICAREXT: documents.onWillSave");
});


// START LISTENING VSCODE COMMANDE
connection.listen();

