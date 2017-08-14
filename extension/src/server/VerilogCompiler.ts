'use strict';

import * as vscode from 'vscode';
import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	InitializeParams, InitializeResult, TextDocumentPositionParams,
	CompletionItem, CompletionItemKind, RemoteConsole
} from 'vscode-languageserver';


export namespace Compilers
{
    /*
     * This class encapsulate run of IcarusServer
    */
    export class Compiler
    {
        // TODO : replace iverilog 
        private iverilogRoot: string = "c:\\iverilog";
        private iverilogCompilerExe:string = '${iverilogRoot}\\bin\\iverilog.exe';
        private iverilogVvpExe:string = '${iverilogRoot}\\bin\\vvp.exe';

        private installRoot: string;

        private console: RemoteConsole;
        /**
         * Constructor of IcarusServer instance. Initialize mandatory settings
         */
        constructor(console: RemoteConsole) {
            this.console=console;
        }

        public Compile(fileToCompile: string)
        {
            console.log("VerilogCompiler.Compile : " + fileToCompile);

            // TODO : call iverilog.exe
        }
    }
}