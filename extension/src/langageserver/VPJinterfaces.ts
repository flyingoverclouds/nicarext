'use strict';
/*
 * This class implement vscode langag server document management for the niverext extension.
 *
 */

import * as querystring from 'querystring';

import * as vscode from 'vscode';
import {
    IConnection, TextDocumentSyncKind,
    TextDocumentChangeEvent,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
 } from 'vscode-languageserver';

import { ISettings, INiVerExtSettings } from './ISettings';
import { ConnectionManager } from './ConnectionManager';
import { Compilers } from './VerilogCompiler'



declare module VPJ
{

    export interface File {
        filename: string;
        dependencies: string[];
    }

    export interface Testbench {
        filename: string;
        dependencies: string[];
    }

    export interface IVerilogProject {
        files: File[];
        startfile: string;
        output: string;
        testbenches: Testbench[];
    }


}