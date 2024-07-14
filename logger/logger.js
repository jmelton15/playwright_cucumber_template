require("dotenv").config();
const ExcelJS = require('exceljs');
const fs = require('fs');
const moment = require("moment");
const {getErrorString} = require("./errorHelpers")

exports.Logger = class Logger {
    filepath = process.env.LOGGER_FILEPATH || `./Error-Test-Results/`
    fullLogFileName = `DetailedTestLog_${moment().format('MMDDYYYY')}.xlsx`;
    _excelFileExists = false;
    lineNumCachePath = process.env.LINE_NUM_CACHE_PATH || "./logger/failedLineCache.json"
    lineNumCache = [];

    logs = [];

    constructor() {
        
    }

    getTimestamp() {
        return moment().format('MMDDYYYY-HHmmA');
    }

    /**
     * 
     * @param  {...any} args  -> [{argName:argValue},{argName,argValue}]
     * 
    */
    async addLog(...args) {
        const currentTime = this.getTimestamp();
        let logObject = {"Timestamp":currentTime};
        if(!Array.isArray(args)) {
            let internalArrayError = `LOGGER: Cannot Create Log Object. Parameter must be an array.
                                    \n Received type ${typeof args}\n`
            console.error(internalArrayError);
            logObject["Internal Error"] = internalArrayError;
            return logObject;
        } 
        args.forEach((arg) => {
            if(typeof arg != 'object') {
                let internalObjectError = `LOGGER: Cannot Create Log Object. Values inside args array must be objects.
                                            \n Received type ${typeof arg}\n`
                console.error(internalObjectError);
                logObject["Internal Error"] = internalObjectError;
            } else {
                for(const property in arg) {
                    if(property === "Result") {
                        const errorMessage = arg[property].message;
                        const readableError = getErrorString(errorMessage);
                        logObject[property] = readableError;
                    } else {
                        logObject[property] = arg[property];
                    }
                }
            }
        })
        await this.updateExcelsheet(logObject)
        return logObject;
    }

    async setupExcelFile() {
        const filePath = `${this.filepath}${this.fullLogFileName}`;
        try {
            if(!await this.checkIfFileExists(filePath)) {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet("TestReport");
                worksheet.addRow([
                    'Timestamp',
                    'Feature Name',
                    'Scenario Name', 
                    'Step Line Number',
                    'Error',
                    'Excel Line Number'
                ]);
                workbook.xlsx.writeFile(`${filePath}`)
                .then(function() {
                    console.log(`Excel Workbook '${filePath}' Created Successfully`)
                })
                .catch(function(err) {
                    console.error(`Could not create Excel Workbook for '${filePath}'!\nError:${err}`)
                })
            }
        } catch(e) {
            console.error(`\nCould not initiate excel file creation at location: '${filePath}'\nError: ${e}\n`);
        }
    }

    async updateExcelsheet(logObject) {
        const filePath = `${this.filepath}${this.fullLogFileName}`

        const timeStamp = logObject["Timestamp"];
        const featureName = logObject["FeatureName"]
        const scenarioName = logObject["ScenarioName"]
        const stepLineNumber = logObject["StepLineNumbers"]
        const errorMessage = logObject["Result"]
        const excelLineNumber = logObject["ExcelLineNumbers"]

        if(!this._excelFileExists) {
            await this.setupExcelFile();
        }

        try {
            const workbook = new ExcelJS.Workbook();
            workbook.xlsx.readFile(filePath)
            .then(function() {
                const worksheet = workbook.getWorksheet(1);
                const newRow = worksheet.addRow([
                    timeStamp,
                    featureName,
                    scenarioName,
                    stepLineNumber,
                    errorMessage,
                    excelLineNumber
                ])
                return workbook.xlsx.writeFile(filePath);
            }) 
            .then(function() {
                console.log(`Excel file at location, ${filePath}, was updated Successfully!`)
            })
            .catch(function(e) {
                console.error(`There was a problem updating file at location ${filePath}\nError: ${e}`)
            })
        } catch(err) {
            console.error(err)
        }
    }

    async checkIfFileExists(filePath) {
        if(fs.existsSync(filePath)) {
            this._excelFileExists = true;
            return true;
        } else {
            console.error(`File at location, ${filePath}, has not been created yet`);
            return false;
        }
    }

    addLineNumToCache(lineNumObject) {
        this.lineNumCache.push(lineNumObject);
    }

    async writeToFailedLineCache() {
        const lineNumObjString = JSON.stringify(this.lineNumCache,null,2); // The third argument (2) is for indentation
        try {
            fs.writeFile(this.lineNumCachePath, lineNumObjString, 'utf8', (err) => {
                if (err) {
                  console.error(`Error writing to file: ${err.message}`);
                } else {
                  console.log(`Object successfully saved to ${this.lineNumCachePath}`); 
                }
            });
        } catch(error) {
            console.error(`There was an issue writing to file ${this.lineNumCachePath}\n**Error: ${error}\n`);
        }
    }
}