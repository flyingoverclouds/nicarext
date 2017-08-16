'use strict';
/*
 * This class implement vscode langage server connection management for the nicarext extension.
 *
 */

import * as vscode from 'vscode';
import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
    InitializeParams, InitializeResult, TextDocumentPositionParams,
    DidChangeConfigurationParams, DidChangeWatchedFilesParams,
	CompletionItem, CompletionItemKind
} from 'vscode-languageserver';

import { ISettings, INicarextSettings } from './ISettings';

export class ConnectionManager
{
    readonly connection: IConnection; 
    private currentSettings: ISettings;
    private workspaceRoot: string;

    constructor(cnx: IConnection) {
        this.connection = cnx
        this.connection.onInitialize( (initParams): InitializeResult => this.OnInitialized(initParams) );
        this.connection.onDidChangeConfiguration( (change) =>  this.OnDidChangeConfiguration(change) );
        this.connection.onCompletion( (params): CompletionItem[] => this.OnCompletion(params));
        this.connection.onCompletionResolve( (item): CompletionItem => this.OnCompletionResolve(item));
        this.connection.onDidChangeWatchedFiles( (changes) => this.OnDidChangedWatchedFiles(changes) );
    }

    public Listen():void {
        this.connection.listen();
    }
    public getConnection()
    {
        return this.connection;
    }

    public getSettings()
    {
        return this.currentSettings;
    }

    private OnInitialized(params:InitializeParams): InitializeResult {
        //this.connection.console.log("NICAREXT:  ConnectionManager.OnInitialize");
        this.workspaceRoot = params.rootPath; // store locally the root folder ofworkspace open in vscode
        return {
            capabilities: {
                // Tell the client that the server works in FULL text document sync mode
                textDocumentSync: TextDocumentSyncKind.Full,
                
                // Tell the client that the server support code complete
                completionProvider: {
                    resolveProvider: true
                }
            }
        }
    }

    private OnDidChangeConfiguration(change: DidChangeConfigurationParams) {
        //this.connection.console.log("NICAREXT: ConnectionManager.OnDidChangeConfiguration");
        this.currentSettings = <ISettings>change.settings;
    }

    private OnDidChangedWatchedFiles(changes: DidChangeWatchedFilesParams) {
        this.connection.console.log("NICAREXT: ConnectionManager.OnDidChangedWatchedFiles");
    }
 
    private OnCompletion(textDocumentPosition: TextDocumentPositionParams): CompletionItem[] {
         this.connection.console.log("NICAREXT: ConnectionManager.OnCompletion");
        return [];
        // The pass parameter contains the position of the text document in 
        // which code complete got requested. For the example we ignore this
        // info and always provide the same completion items.
        // return [
        //     {
        //         label: 'TypeScript',
        //         kind: CompletionItemKind.Text,
        //         data: 1
        //     },
        //     {
        //         label: 'JavaScript',
        //         kind: CompletionItemKind.Text,
        //         data: 2
        //     }
        // ]
    }

    private OnCompletionResolve(item: CompletionItem): CompletionItem {
        this.connection.console.log("NICAREXT: ConnectionManager.OnCompletionResolve");
    
        // if (item.data === 1) {
        //     item.detail = 'TypeScript details',
        //     item.documentation = 'TypeScript documentation'
        // } else if (item.data === 2) {
        //     item.detail = 'JavaScript details',
        //     item.documentation = 'JavaScript documentation'
        // }
        return item;
    }

}

