'use strict';
/*
 * This class implement vscode langag server document management for the niverext extension.
 *
 */

import * as querystring from 'querystring';

import * as vscode from 'vscode';
import {
    Connection, TextDocumentSyncKind,
    TextDocumentChangeEvent,
	TextDocuments,  Diagnostic, DiagnosticSeverity,
 } from 'vscode-languageserver';

import { TextDocument } from 'vscode-languageserver-textdocument';

import { ISettings, INiVerExtSettings } from './ISettings';
import { ConnectionManager } from './ConnectionManager';
import { Compilers } from './VerilogCompiler'
//import { VPJinterfaces } from './VPJinterfaces'

export class DocumentManager
{

    private connectionManager:ConnectionManager;

    /******* CONSTRUCTOR     */
    constructor(cnxmgr: ConnectionManager ) {
        this.connectionManager=cnxmgr;
        let documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);
        
        documents.onDidChangeContent((changed) => this.DocumentContentChanged(changed));
        documents.onDidClose((closed) => this.DocumentClosed(closed));
        documents.onDidOpen((opened) => this.DocumentOpened(opened));
        documents.onWillSave((save) => this.DocumentWillSave(save));
        documents.onDidSave((saved) => this.DocumentSaved(saved));

        // TODO : find .vpj file and load dependencie graph
        
        documents.listen(this.connectionManager.getConnection());
    }

    private DocumentContentChanged(change:TextDocumentChangeEvent<TextDocument>){
        //console.log("DocumentManager.DocumentContentChanged : " + change.document.uri);

        // TODO : detect if .vpj file change to relad dependencies graph
    }

    private DocumentClosed(closed:TextDocumentChangeEvent<TextDocument>) {
        //console.log("DocumentManager.DocumentClosed : " + closed.document.uri);
        this.SendDiagnostics(closed.document.uri,[]); // clearing diagnostics for the closed document
    }

    private DocumentOpened(opened:TextDocumentChangeEvent<TextDocument>){
        //console.log("DocumentManager.DocumentOpened : " + opened.document.uri);
        this.CheckVerilogSyntax(opened.document.uri);
    }

    private DocumentSaved(saved:TextDocumentChangeEvent<TextDocument>) {
        //console.log("DocumentManager.DocumentSaved : " + saved.document.uri);
        this.CheckVerilogSyntax(saved.document.uri);
    }

    private DocumentWillSave(save: TextDocumentChangeEvent<TextDocument>) {
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
            if(documentUri.startsWith("file:///") && (documentUri.endsWith(".v") || documentUri.endsWith(".vh")))
            {
                let filePath: string = querystring.unescape(documentUri).replace("file:///","");
                let compiler = new Compilers.Compiler(this.connectionManager.getSettings().niverextServer); 
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