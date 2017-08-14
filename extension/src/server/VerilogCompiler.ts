'use strict';

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as vscode from 'vscode';
import {
	IPCMessageReader, IPCMessageWriter,
	createConnection, IConnection, TextDocumentSyncKind,
	TextDocuments, TextDocument, Diagnostic, DiagnosticSeverity,
	InitializeParams, InitializeResult, TextDocumentPositionParams,
	CompletionItem, CompletionItemKind, RemoteConsole
} from 'vscode-languageserver';


export namespace Compilers {
    /*
     * This class encapsulate run of IcarusServer
    */
    export class Compiler {
        // TODO : replace iverilog 
        private iverilogRoot: string = `c:\\iverilog`;
        private iverilogCompilerExe:string = `${this.iverilogRoot}\\bin\\iverilog.exe`;
        private iverilogVvpExe:string = `${this.iverilogRoot}\\bin\\vvp.exe`;


        private console: RemoteConsole;
        /**
         * Constructor of IcarusServer instance. Initialize mandatory settings
         */
        constructor(console: RemoteConsole) {
            this.console=console;
            // TODO : add iverilog path configuration as parameters 
        }

        public CheckSyntax(fileToCompile: string) : void {
            if (!fs.existsSync(this.iverilogCompilerExe)){
                throw new Error("Verilog compiler not found. Missing  " + this.iverilogCompilerExe);
            }
            if (!fs.existsSync(fileToCompile)){
                throw new Error("Invalid file name. Not found " + fileToCompile);
            }

            // TODO : check if a iverilog build file is available in folder -> use it, othe wise compile saved file
            

            // iverilog output file is NUL because we only want syntax check and retrieve stderr 
            // TODO : add unix OS support 
            let ivParams = ["-o","NUL",fileToCompile];

            //calling iverilog.exe to retrieve stderr (syntaxt or compilation error)
            let iverilogProcess = child_process.execFile(this.iverilogCompilerExe,ivParams,
                (error,stdout,stderr)=>{
                    if (error) { 
                        console.warn("*** ERROR: occured -> analyzing stderr to parse errore line");
                        console.log(stderr);
                    }
                    else{
                        // no error -> return or clean erroneous line in editor
                    }
                });
        }

        private SendErrorDiagnostic(string): void {

        }

    }
}