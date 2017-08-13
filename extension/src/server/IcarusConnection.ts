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


export namespace IcarusServer
{
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

}