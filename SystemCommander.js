/*:
 * @target MZ
 * @plugindesc [v1.0] Executes OS commands via child_process (desktop builds only).
 * @author Serewasfera
 * @help
 * == How to use ==
 * 1. Call the plugin command in the event:
 * ◆ Plugin command：SystemCommander, run, {"cmd":"calc.exe"}
 * 2. Available methods:
 * - this.runSystemCommand("notepad") - via script.
 * - this.runSystemCommand("calc.exe", callback) - with callback.
 *
 * == Important ==
 * • Works ONLY in desktop builds (Windows/Mac/Linux).
 * • Antiviruses can block suspicious commands.
 *
 * @command run
 * @text Run a command
 * @desc Runs a system command (e.g. "calc.exe").
 *
 * @arg cmd
 * @text Command
 * @desc Command to run (e.g. "notepad").
 * @type string
 * @default calc.exe
 */

(() => {
    'use strict';

    // Checking if Node.js available
    const isNode = typeof require === 'function' && typeof process === 'object';
    let _exec;

    if (isNode) {
        try {
            _exec = require('child_process').exec;
        } catch (e) {
            console.error("SystemCommander: Failed to load child_process", e);
        }
    }

    // Main function
    function executeCommand(command, callback) {
        if (!_exec) {
            console.warn("SystemCommander: child_process unavailable!");
            return false;
        }
        _exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error when executing "${command}":`, error.message);
                if (callback) callback(false, error);
                return;
            }
            if (stderr) console.warn("stderr:", stderr);
            if (callback) callback(true, stdout);
        });
        return true;
    }

    // Registering plugin command
    PluginManager.registerCommand('SystemCommander', 'run', function(args) {
        executeCommand(args.cmd, (success, result) => {
            if (success) {
                console.log(`Команда "${args.cmd}" выполнена:`, result);
            } else {
                $gameMessage.add(`Ошибка: ${result.message}`);
            }
        });
    });

    // Integration into Game_Interpreter for calling via scripts
    Game_Interpreter.prototype.runSystemCommand = function(command, callback) {
        return executeCommand(command, callback);
    };
})();