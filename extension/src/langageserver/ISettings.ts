// Definition of settings interface for Nicarext VSCode Extension

	export interface INiVerExtSettings {
		iverilogCompilerExePath:string;
		vvpExePath:string;
		gtkWaveExePath:string;
	}


	// The settings interface describe the server relevant settings part
	export interface ISettings {
		niverextServer: INiVerExtSettings;
	} 


	