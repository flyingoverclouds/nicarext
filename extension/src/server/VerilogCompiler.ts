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


        private connection: IConnection;
        private console: RemoteConsole;
        /**
         * Constructor of IcarusServer instance. Initialize mandatory settings
         */
        constructor(console: RemoteConsole,connection: IConnection) {
            this.console=console;
            this.connection=connection;
            // TODO : add iverilog path configuration as parameters 
        }

        public CheckSyntax(uri:string,fileToCompile: string) :void {
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
                        console.error("Error occured : ---------------------------------------------------------------");
                        console.error(stderr);
                        console.error("-------------------------------------------------------------------------------");
                        // splitting stderr and removing filename
                        let lines :string[] = stderr.split("\n").map( l=> l.replace(fileToCompile,""));
                        let diagnostics = this.GetDiagnostics(lines);
                        this.connection.sendDiagnostics( { uri: uri, diagnostics} );
                    }
                    else{
                        this.connection.sendDiagnostics( { uri: uri, diagnostics: []} );

                        // no error -> return or clean erroneous line in editor
                    }
                });
        }

        private GetDiagnostics(lines: string[]): Diagnostic[] {
            let diagnostics: Diagnostic[] = [];
            let lastLineNumber:number=1;

            for(let l of lines) {
                if(l.trim()=="")
                    continue;
                console.warn("ERROR: " + l);
                
                let message:string="";
                let lineNumber:number=1;
                // normally, error line looks like ':LINENUM: message'
                if (l.startsWith(":")) {
                    let pos = l.indexOf(":",1);
                    lineNumber = Number(l.substring(1,pos))-1; // because vscode diagnostic line numbering start a 0
                    message = l.substring(pos+1).trim();
                }
                else {
                    message= l + " //INVALID ERROR LINE FORMAT//";
                    lineNumber=lastLineNumber; // unable to detect line number -> use the last detected
                }
                diagnostics.push({
                    severity: DiagnosticSeverity.Error,
                    range: { 
                        start: {line: lineNumber, character:0 },
                        end: { line: lineNumber, character: Number.MAX_VALUE}
                    },
                    message: `${message}`,
                    source:'ERROR'
                });
                lastLineNumber=lineNumber;
            };
            return diagnostics;
        }
    }
}