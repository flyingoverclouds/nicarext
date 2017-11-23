
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

import { ISettings, INiVerExtSettings } from './ISettings';
import { ConnectionManager } from './ConnectionManager'
import { DocumentManager } from './DocumentManager'
import { Compilers } from './VerilogCompiler'


// *************** server initialisation
console.log("Starting NiVerExt langage server for IVerilog ...");

// Create a connection for the server. The connection uses Node's IPC as a transport
let cnxMgr = new ConnectionManager(createConnection(new IPCMessageReader(process), new IPCMessageWriter(process)));

// create a document manager to handle event on_ document opened in VS Code
let docMgr = new DocumentManager(cnxMgr);

// START LISTENING VSCODE COMMANDE
cnxMgr.Listen();

