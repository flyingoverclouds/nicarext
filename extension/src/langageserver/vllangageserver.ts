
'use strict';


import * as querystring from 'querystring';
import * as vscode from 'vscode';
import {
	createConnection,
	TextDocuments,
	Diagnostic,
	DiagnosticSeverity,
	ProposedFeatures,
	InitializeParams,
	DidChangeConfigurationNotification,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult
  } from 'vscode-languageserver/node';
  
  import { TextDocument } from 'vscode-languageserver-textdocument';

import { ISettings, INiVerExtSettings } from './ISettings';
import { ConnectionManager } from './ConnectionManager'
import { DocumentManager } from './DocumentManager'
import { Compilers } from './VerilogCompiler'



console.log("Starting NiVerExt langage server for IVerilog ...");

// Create a connection for the server. The connection uses Node's IPC as a transport
let cnxMgr = new ConnectionManager(createConnection(ProposedFeatures.all));


// create a document manager to handle event on document opened in VS Code
let docMgr = new DocumentManager(cnxMgr);


// START LISTENING VSCODE COMMANDE
cnxMgr.Listen();

