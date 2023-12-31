const vscode = require("vscode");
const { execSync } = require("child_process");

function activate(context) {

  let disposable = vscode.commands.registerCommand(
    "extension.asciiArtConvert",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        return;
      }

      const currentLine = editor.document.lineAt(editor.selection.active.line);
      const selectedText = currentLine.text;

      if (!selectedText) {
        return;
      }

      const config = vscode.workspace.getConfiguration("asciicomment");
      const asciiArtCommand = config.get("asciiArtCommand", "");
      try {
        const asciiArt = execSync(asciiArtCommand.replace("${currentLine}", selectedText), {encoding: "utf-8",});
        const commentAsciiArt = `${asciiArt.trim().split("\n").map(x=>`// ${x}`).join("\n")}`;

                await editor.edit((editBuilder) => {
                  const selectionRange = new vscode.Range(
                    currentLine.range.start,
                    currentLine.range.end
                  );
                  editBuilder.replace(selectionRange, commentAsciiArt);
                });
      } catch (error) {
        console.log(error);
        vscode.window.showErrorMessage("Error converting to AsciiComment.");
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
