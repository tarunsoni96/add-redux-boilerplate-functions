const vscode = require('vscode');
const fs = require('fs')
const path = require('path')

/**
 * @param {vscode.ExtensionContext} context
 */

 async function activate(context) {
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('tarry.addReduxBoilerplate',async function () {
		const reduxFunctionTypeName = await vscode.window.showInputBox({ placeHolder: 'Enter Redux Function Type', prompt: 'Enter Redux Function Type' });
		console.log(reduxFunctionTypeName)

		if(!reduxFunctionTypeName)
		return
	
		const reduxActionType = `${'\n'}export const ${reduxFunctionTypeName} = "${reduxFunctionTypeName}"`
		const reduxPath = `${vscode.workspace.workspaceFolders[0].uri.toString().split(':')[1]}/src/AppLevelComponents/Redux/`
		fs.appendFile(path.join(reduxPath+'ActionTypes/','ActionTypes.js'),reduxActionType,err => {
			if(err){
				console.error(err)
				return vscode.window.showErrorMessage("Failed to auto generate function for the redux action trigger");
				
			}
			vscode.window.showInformationMessage("Auto generated function for the redux type");
			createTriggerFunction(reduxFunctionTypeName,reduxPath)
		})
	});
	context.subscriptions.push(disposable);
}

function createTriggerFunction(actionTypeName,reduxPath){
	const reduxActionTriggerFunction = `${'\n'}${'\n'}export const ${actionTypeName.charAt(0).toUpperCase()+actionTypeName.slice(1)}Trigger = (obj) => {
		return {
			type : ${actionTypeName},
			payload:obj
		}
	}`
	let data = fs.readFileSync(reduxPath+'ActionTriggers/ActionTriggers.js').toString().split("\n");
	data.splice(2, 0, actionTypeName+',');
	let text = data.join("\n");

	fs.writeFile(path.join(reduxPath+'ActionTriggers/','ActionTriggers.js'),text,err => {
		if(err){
			console.error(err)
			return vscode.window.showErrorMessage("Failed to auto generate function for the redux action trigger");
		}
		vscode.window.showInformationMessage("Auto generated trigger function for the redux triggers");

		fs.appendFile(path.join(reduxPath+'ActionTriggers/','ActionTriggers.js'),reduxActionTriggerFunction,err => {
			if(err){
				console.error(err)
				return vscode.window.showErrorMessage("Failed to auto generate function for the redux action trigger");
			}
			vscode.window.showInformationMessage("Auto generated trigger function for the redux triggers");
		})
		let triggerFunName = actionTypeName.charAt(0).toUpperCase()+actionTypeName.slice(1)+'Trigger'
		pbcopy(triggerFunName)

		
	})

	
}


function pbcopy(data) {
    let proc = require('child_process').spawn('pbcopy'); 
    proc.stdin.write(data); proc.stdin.end();
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
