# NiVerExt-4-Verilog configuration

## Settings
Default settings can be superseed on a user level, or a workspace level. 

Use VSCode Preferences to update settings (menu 'File/Preferences/Settings'), selection 'User' or 'Workspace' and add the following JSon snippet (with your own values :) )

```json
{
    "niverextServer.iverilogCompilerExePath": "C:/iverilog/bin/iverilog.exe",
    "niverextServer.vvpExePath": "C:/iverilog/bin/vvp.exe",
    "niverextServer.gtkWaveExePath": "C:/iverilog/gtkwave/bin/gtkwave.exe"
}
```

## Dependencies

### Icarus Verilog 
Icarus Verilog is a freely available Verilog compiler. 
You can download it from http://iverilog.icarus.com/
