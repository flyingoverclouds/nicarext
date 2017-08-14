'use strict';

import * as vscode from 'vscode';
import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	InitializeParams, InitializeResult, TextDocumentPositionParams,
	CompletionItem, CompletionItemKind
} from 'vscode-languageserver';

import { ISettings, INicarextSettings } from './ISettings';

export class ConnectionManager
{
    cnx: IConnection; 
    
    /**
     *
     */
    constructor(connection: IConnection) {
        //this.cnx = connection;

    }



}

