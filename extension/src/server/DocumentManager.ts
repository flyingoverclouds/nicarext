'use strict';
/*
 * This class implement vscode langag server document management for the nicarext extension.
 *
 */

import * as querystring from 'querystring';

import * as vscode from 'vscode';
import {
    IConnection, TextDocumentSyncKind,
    TextDocumentChangeEvent,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
 } from 'vscode-languageserver';

import { ISettings, INicarextSettings } from './ISettings';
import { ConnectionManager } from './ConnectionManager';
import { Compilers } from './VerilogCompiler'

export class DocumentManager
{

    private connectionManager:ConnectionManager;

    /******* CONSTRUCTOR     */
    constructor(cnxmgr: ConnectionManager ) {
        this.connectionManager=cnxmgr;
        let documents: TextDocuments = new TextDocuments();
        
        documents.onDidChangeContent((changed) => this.DocumentContentChanged(changed));
        documents.onDidClose((closed) => this.DocumentClosed(closed));
        documents.onDidOpen((opened) => this.DocumentOpened(opened));
        documents.onWillSave((save) => this.DocumentWillSave(save));
        documents.onDidSave((saved) => this.DocumentSaved(saved));

        documents.listen(this.connectionManager.getConnection());
    }

    private DocumentContentChanged(change:TextDocumentChangeEvent){
        //console.log("DocumentManager.DocumentContentChanged : " + change.document.uri);
    }

    private DocumentClosed(closed:TextDocumentChangeEvent) {
        //console.log("DocumentManager.DocumentClosed : " + closed.document.uri);
        this.SendDiagnostics(closed.document.uri,[]); // clearing diagnostics for the closed document
    }

    private DocumentOpened(opened:TextDocumentChangeEvent){
        //console.log("DocumentManager.DocumentOpened : " + opened.document.uri);
        this.CheckVerilogSyntax(opened.document.uri);
    }

    private DocumentSaved(saved:TextDocumentChangeEvent) {
        //console.log("DocumentManager.DocumentSaved : " + saved.document.uri);
        this.CheckVerilogSyntax(saved.document.uri);
    }

    private DocumentWillSave(save: TextDocumentChangeEvent) {
        console.log("DocumentManager.DocumentWillSave : " + save.document.uri);
    }

    private isCompiling: boolean = false;
    private CheckVerilogSyntax(documentUri:string)
    {
        if (this.isCompiling)
        {
            console.warn("already compiling ... retry later to avoid duplicate compilation at the same time.");
            return;
        }
        this.isCompiling=true;
        try {
            if(documentUri.startsWith("file:///"))
            {
                let filePath: string = querystring.unescape(documentUri).replace("file:///","");
                let compiler = new Compilers.Compiler(this.connectionManager.getSettings().nicarextServer); 
                compiler.CheckSyntax(documentUri,filePath, (diagnostics)=>{
                    this.SendDiagnostics(documentUri,diagnostics );
                });
            }
        } catch (error) {
            console.error("ERROR : " + error)
        }
        finally
        {
            this.isCompiling=false;
        }

    }

    private SendDiagnostics(documentUri:string, diagnostics: Diagnostic[] ){
        this.connectionManager.getConnection().sendDiagnostics( { uri: documentUri, diagnostics: diagnostics} );
    }

}