'use strict';
/*
 * This class implement vscode langag server document management for the nicarext extension.
 *
 */

import * as vscode from 'vscode';
import {
	IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
 } from 'vscode-languageserver';

import { ISettings, INicarextSettings } from './ISettings';
import { ConnectionManager } from './ConnectionManager';

export class DocumentManager
{
    /**
     *
     */
    constructor(cnxmgr: ConnectionManager ) {
        let documents: TextDocuments = new TextDocuments();
        documents.listen(cnxmgr.getConnection());
    }
}