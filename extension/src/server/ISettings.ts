
// These are the example settings we defined in the client's package.json
// file

	export interface INicarextSettings {
		maxNumberOfProblems:number;
	}


	// The settings interface describe the server relevant settings part
	export interface ISettings {
		nicarextServer: INicarextSettings;
	} 


	